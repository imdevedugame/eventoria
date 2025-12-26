export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

export async function POST(req: Request) {
  try {
    const notification = await req.json()

    // TEST NOTIFICATION → SELALU OK
    if (!notification?.order_id) {
      return NextResponse.json({ message: "Test OK" }, { status: 200 })
    }

    const signature = crypto
      .createHash("sha512")
      .update(
        notification.order_id +
        notification.status_code +
        notification.gross_amount +
        SERVER_KEY
      )
      .digest("hex")

    // Signature salah → IGNORE, tapi tetap 200
    if (signature !== notification.signature_key) {
      console.warn("Invalid signature", notification)
      return NextResponse.json({ message: "Ignored" }, { status: 200 })
    }

    const supabase = await getSupabaseServerClient()

    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("midtrans_order_id", notification.order_id)

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ message: "No transaction" }, { status: 200 })
    }

    let status: "success" | "failed" | "pending" = "pending"

    if (
      notification.transaction_status === "settlement" ||
      (notification.transaction_status === "capture" &&
        notification.fraud_status === "accept")
    ) {
      status = "success"
    }

    if (
      ["cancel", "deny", "expire"].includes(notification.transaction_status)
    ) {
      status = "failed"
    }

    /* =======================
       UPDATE TRANSACTION
    ======================= */
    await supabase
      .from("transactions")
      .update({
        payment_status: status,
        paid_at: status === "success" ? new Date().toISOString() : null,
      })
      .eq("midtrans_order_id", notification.order_id)

    /* =======================
       UPDATE TICKET
    ======================= */
    if (status === "success") {
      await supabase
        .from("tickets")
        .update({ status: "active" })
        .in(
          "id",
          transactions.map(t => t.ticket_id)
        )
    }

    if (status === "failed") {
      await supabase
        .from("tickets")
        .delete()
        .in(
          "id",
          transactions.map(t => t.ticket_id)
        )
    }

    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (e) {
    console.error("Webhook error:", e)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }
}
