export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!

export async function POST(req: Request) {
  try {
    const notification = await req.json()

    // TEST NOTIFICATION
    if (!notification?.order_id) {
      return NextResponse.json({ message: "Test OK" }, { status: 200 })
    }

    const calculatedSignature = crypto
      .createHash("sha512")
      .update(
        notification.order_id +
          notification.status_code +
          notification.gross_amount +
          SERVER_KEY
      )
      .digest("hex")

    // Signature invalid → IGNORE
    if (calculatedSignature !== notification.signature_key) {
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

    /* =====================
       UPDATE TRANSACTION
    ===================== */
    await supabase
      .from("transactions")
      .update({
        payment_status: status,
        paid_at: status === "success" ? new Date().toISOString() : null,
      })
      .eq("midtrans_order_id", notification.order_id)

    /* =====================
       UPDATE TICKET
    ===================== */
    const ticketIds = transactions.map((t) => t.ticket_id)

    if (status === "success") {
      await supabase.from("tickets").update({ status: "active" }).in("id", ticketIds)

      // Fetch current participants
      const { data: seminarData, error: seminarError } = await supabase
        .from("seminars")
        .select("current_participants")
        .eq("id", transactions[0].seminar_id)
        .single();

      if (!seminarError && seminarData) {
        const newParticipants = (seminarData.current_participants || 0) + ticketIds.length;
        await supabase
          .from("seminars")
          .update({
            current_participants: newParticipants,
          })
          .eq("id", transactions[0].seminar_id);
      }
    }

    if (status === "failed") {
      await supabase.from("tickets").delete().in("id", ticketIds)
    }

    return NextResponse.json({ message: "OK" }, { status: 200 })
  } catch (e) {
    console.error("Webhook error:", e)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }
}
