import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import crypto from "crypto"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ""
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true"
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions"

interface AttendeeData {
  full_name: string
  email: string
  phone: string
}

export async function POST(request: Request) {
  try {
    const { seminar_id, user_id, quantity = 1, attendees = [] } = await request.json()

    const supabase = await getSupabaseServerClient()

    // Get seminar details
    const { data: seminar, error: seminarError } = await supabase
      .from("seminars")
      .select("*")
      .eq("id", seminar_id)
      .single()

    if (seminarError || !seminar) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    const availableSlots = seminar.max_participants - seminar.current_participants
    if (quantity > availableSlots) {
      return NextResponse.json({ error: `Only ${availableSlots} tickets available` }, { status: 400 })
    }

    // Get user details
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("id", user_id).single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const ticketCodes: string[] = []
    const ticketIds: string[] = []

    for (let i = 0; i < quantity; i++) {
      const ticketCode = `EVNT-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
      ticketCodes.push(ticketCode)

      // Create ticket
      const { data: ticket, error: ticketError } = await supabase
        .from("tickets")
        .insert({
          seminar_id,
          user_id,
          ticket_code: ticketCode,
          status: "active",
        })
        .select()
        .single()

      if (ticketError || !ticket) {
        console.error("[checkout] Failed to create ticket", ticketError, ticket)
        return NextResponse.json({ error: "Failed to create ticket", detail: ticketError }, { status: 500 })
      }

      ticketIds.push(ticket.id)

      // Insert attendee data for this ticket
      if (attendees[i]) {
        const { error: attendeeError } = await supabase.from("ticket_attendees").insert({
          ticket_id: ticket.id,
          full_name: attendees[i].full_name,
          email: attendees[i].email,
          phone: attendees[i].phone,
        })
        if (attendeeError) {
          console.error("[checkout] Failed to insert attendee", attendeeError)
        }
      }
    }

    // Generate order ID
    const orderId = `ORDER-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`

    const totalAmount = seminar.price * quantity

    for (const ticketId of ticketIds) {
      const { error: transactionError } = await supabase.from("transactions").insert({
        ticket_id: ticketId,
        user_id,
        seminar_id,
        amount: seminar.price,
        payment_method: "midtrans",
        midtrans_order_id: orderId,
        payment_status: seminar.price === 0 ? "success" : "pending",
        paid_at: seminar.price === 0 ? new Date().toISOString() : null,
      })
      if (transactionError) {
        console.error("[checkout] Failed to insert transaction", transactionError)
      }
    }

    if (seminar.price === 0) {
      // Update current_participants untuk seminar gratis
      const { error: updateError } = await supabase
        .from("seminars")
        .update({ current_participants: seminar.current_participants + quantity })
        .eq("id", seminar_id)

      if (updateError) {
        console.error("[checkout] Failed to update current_participants", updateError)
      }

      // Trigger internal webhook agar status transaksi langsung success (simulasi Midtrans)
      try {
        const status_code = "200"
        const gross_amount = String(seminar.price * quantity)
        const server_key = MIDTRANS_SERVER_KEY
        const crypto = (await import("crypto")).default
        const signature = crypto.createHash("sha512")
          .update(orderId + status_code + gross_amount + server_key)
          .digest("hex")

        await fetch("https://seminar-jade-zeta.vercel.app/api/payment/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            transaction_status: "settlement",
            fraud_status: "accept",
            status_code,
            gross_amount,
            signature_key: signature,
            transaction_id: "INTERNAL_SIMULATED",
          }),
        })
      } catch (err) {
        console.error("[checkout] Failed to trigger internal webhook", err)
      }

      return NextResponse.json({
        order_id: orderId,
        ticket_codes: ticketCodes,
        message: "Free tickets created successfully",
      })
    }

    // CATATAN: Untuk seminar berbayar, update current_participants harus dilakukan di webhook/callback Midtrans setelah pembayaran sukses.

    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: totalAmount,
      },
      customer_details: {
        first_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
      },
      item_details: [
        {
          id: seminar_id,
          price: seminar.price,
          quantity: quantity,
          name: seminar.title,
        },
      ],
    }

    const authString = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64")


    let midtransData = null
    if (seminar.price > 0) {
      const midtransResponse = await fetch(MIDTRANS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(midtransPayload),
      })

      midtransData = await midtransResponse.json()

      if (!midtransResponse.ok) {
        console.error("[checkout] Failed to create payment", midtransData)
        return NextResponse.json({ error: "Failed to create payment", detail: midtransData }, { status: 500 })
      }

      // Trigger internal webhook agar status transaksi langsung success (simulasi Midtrans, hanya untuk development/testing)
      try {
        const status_code = "200"
        const gross_amount = String(seminar.price * quantity)
        const server_key = MIDTRANS_SERVER_KEY
        const crypto = (await import("crypto")).default
        const signature = crypto.createHash("sha512")
          .update(orderId + status_code + gross_amount + server_key)
          .digest("hex")

        await fetch("https://seminar-jade-zeta.vercel.app/api/payment/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            transaction_status: "settlement",
            fraud_status: "accept",
            status_code,
            gross_amount,
            signature_key: signature,
            transaction_id: midtransData?.transaction_id || "INTERNAL_SIMULATED",
          }),
        })
      } catch (err) {
        console.error("[checkout] Failed to trigger internal webhook (paid)", err)
      }
    }

    return NextResponse.json({
      snap_token: midtransData?.token,
      order_id: orderId,
      ticket_codes: ticketCodes,
    })
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
