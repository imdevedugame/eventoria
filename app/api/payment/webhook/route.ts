// Handler GET untuk test endpoint dari Midtrans
export async function GET() {
  return NextResponse.json({ message: "Webhook endpoint OK" }, { status: 200 })
}
import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ""

function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string): string {
  const hash = crypto.createHash("sha512")
  hash.update(orderId + statusCode + grossAmount + serverKey)
  return hash.digest("hex")
}

export async function POST(request: Request) {
  try {
    const notification = await request.json()

    // Jika payload tidak lengkap (misal test dari Midtrans), balas 200 OK tanpa proses
    if (!notification.order_id || !notification.status_code || !notification.gross_amount || !notification.signature_key) {
      return NextResponse.json({ message: "Test notification or incomplete payload received. Webhook endpoint OK." }, { status: 200 })
    }

    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status
    const fraudStatus = notification.fraud_status
    const statusCode = notification.status_code
    const grossAmount = notification.gross_amount
    const signatureKey = notification.signature_key

    // Verify signature
    const calculatedSignature = verifySignature(orderId, statusCode, grossAmount, MIDTRANS_SERVER_KEY)

    if (signatureKey !== calculatedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    const supabase = await getSupabaseServerClient()

    // Get transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .select("*")
      .eq("midtrans_order_id", orderId)
      .single()

    if (transactionError || !transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    let paymentStatus = transaction.payment_status

    // Handle different transaction statuses
    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        paymentStatus = "success"
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "success"
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      paymentStatus = "failed"
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending"
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from("transactions")
      .update({
        payment_status: paymentStatus,
        midtrans_transaction_id: notification.transaction_id,
        paid_at: paymentStatus === "success" ? new Date().toISOString() : null,
      })
      .eq("id", transaction.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
    }

    // If payment successful, update seminar participant count
    if (paymentStatus === "success" && transaction.payment_status !== "success") {
      const { data: seminar } = await supabase.from("seminars").select("*").eq("id", transaction.seminar_id).single()

      if (seminar) {
        await supabase
          .from("seminars")
          .update({ current_participants: seminar.current_participants + 1 })
          .eq("id", transaction.seminar_id)
      }
    }

    // If payment failed, delete ticket
    if (paymentStatus === "failed") {
      await supabase.from("tickets").delete().eq("id", transaction.ticket_id)
    }

    return NextResponse.json({ message: "Notification processed" })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
