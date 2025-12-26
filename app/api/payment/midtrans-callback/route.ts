import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// Endpoint: /api/payment/midtrans-callback
// Midtrans will POST payment notification here

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, transaction_status, fraud_status } = body

    // Only process if payment is successful
    if (transaction_status === "settlement" || transaction_status === "capture") {
      const supabase = await getSupabaseServerClient()

      // Update all transactions with this order_id to success
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("id, ticket_id, seminar_id")
        .eq("midtrans_order_id", order_id)

      if (txError || !transactions || transactions.length === 0) {
        console.error("[midtrans-callback] Transaction not found", txError)
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
      }

      // Update status to success and set paid_at
      const { error: updateTxError } = await supabase
        .from("transactions")
        .update({ payment_status: "success", paid_at: new Date().toISOString() })
        .eq("midtrans_order_id", order_id)

      if (updateTxError) {
        console.error("[midtrans-callback] Failed to update transaction", updateTxError)
        return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 })
      }

      // Count how many tickets in this order
      const ticketCount = transactions.length
      const seminarId = transactions[0].seminar_id

      // Update current_participants in seminars
      const { data: seminar, error: seminarError } = await supabase
        .from("seminars")
        .select("current_participants")
        .eq("id", seminarId)
        .single()

      if (!seminar || seminarError) {
        console.error("[midtrans-callback] Seminar not found", seminarError)
        return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
      }

      const { error: updateSeminarError } = await supabase
        .from("seminars")
        .update({ current_participants: seminar.current_participants + ticketCount })
        .eq("id", seminarId)

      if (updateSeminarError) {
        console.error("[midtrans-callback] Failed to update seminar", updateSeminarError)
        return NextResponse.json({ error: "Failed to update seminar" }, { status: 500 })
      }

      // Optionally, update ticket status to active (if needed)
      const ticketIds = transactions.map((tx: any) => tx.ticket_id)
      await supabase
        .from("tickets")
        .update({ status: "active" })
        .in("id", ticketIds)

      return NextResponse.json({ message: "Payment processed and seminar updated" })
    }

    // If not paid, ignore
    return NextResponse.json({ message: "No action taken (not paid)" })
  } catch (error) {
    console.error("[midtrans-callback] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
