export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true"

const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions"

export async function POST(req: Request) {
  try {
    const { seminar_id, user_id, quantity = 1 } = await req.json()
    const supabase = await getSupabaseServerClient()

    // ---------------------------------------------------------
    // 1. VALIDASI SEMINAR & KUOTA
    // ---------------------------------------------------------
    const { data: seminar, error: seminarError } = await supabase
      .from("seminars")
      .select("*")
      .eq("id", seminar_id)
      .single()

    if (seminarError || !seminar) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    const available = seminar.max_participants - seminar.current_participants
    if (quantity > available) {
      return NextResponse.json(
        { error: `Only ${available} slots available` },
        { status: 400 }
      )
    }

    // ---------------------------------------------------------
    // 2. VALIDASI USER
    // ---------------------------------------------------------
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // ---------------------------------------------------------
    // 3. PERSIAPAN DATA TIKET (BATCH)
    // ---------------------------------------------------------
    const orderId = `ORDER-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`

    // Buat array data tiket untuk di-insert sekaligus
    const ticketsPayload = Array.from({ length: quantity }).map(() => ({
      seminar_id,
      user_id,
      ticket_code: `EVNT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`,
      status: "pending",
    }))

    // ---------------------------------------------------------
    // 4. EKSEKUSI INSERT TIKET
    // ---------------------------------------------------------
    const { data: createdTickets, error: insertTicketError } = await supabase
      .from("tickets")
      .insert(ticketsPayload)
      .select() // Penting: agar kita dapat ID tiket yang baru dibuat

    // 🔥 PERBAIKAN UTAMA DI SINI: Cek error spesifik
    if (insertTicketError || !createdTickets) {
      console.error("Ticket Insert Error:", insertTicketError)
      return NextResponse.json(
        { 
          error: "Failed to create tickets", 
          details: insertTicketError?.message || "Unknown error"
        },
        { status: 500 }
      )
    }

    const ticketCodes = createdTickets.map((t) => t.ticket_code)

    // ---------------------------------------------------------
    // 5. BUAT TRANSAKSI (Berdasarkan tiket yang berhasil dibuat)
    // ---------------------------------------------------------
    const transactionsPayload = createdTickets.map((ticket) => ({
      ticket_id: ticket.id,
      seminar_id,
      user_id,
      midtrans_order_id: orderId,
      amount: seminar.price,
      payment_method: "midtrans",
      payment_status: "pending",
    }))

    const { error: insertTransError } = await supabase
      .from("transactions")
      .insert(transactionsPayload)

    if (insertTransError) {
      console.error("Transaction Insert Error:", insertTransError)
      // Note: Idealnya kita rollback tiket di sini jika transaksi gagal,
      // tapi untuk Supabase Client tanpa RPC, kita return error dulu.
      return NextResponse.json(
        { 
          error: "Failed to create transaction record", 
          details: insertTransError.message 
        },
        { status: 500 }
      )
    }

    // ---------------------------------------------------------
    // 6. JIKA EVENT GRATIS
    // ---------------------------------------------------------
    if (seminar.price === 0) {
      // Update status tiket jadi active
      await supabase
        .from("tickets")
        .update({ status: "active" })
        .in("id", createdTickets.map(t => t.id)) // Batch update

      // Update kuota seminar
      await supabase
        .from("seminars")
        .update({
          current_participants: seminar.current_participants + quantity,
        })
        .eq("id", seminar_id)

      return NextResponse.json({
        message: "Free ticket created",
        order_id: orderId,
        ticket_codes: ticketCodes,
      })
    }

    // ---------------------------------------------------------
    // 7. MIDTRANS SNAP REQUEST
    // ---------------------------------------------------------
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: seminar.price * quantity,
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
          name: seminar.title.substring(0, 50), // Midtrans max name length safety
        },
      ],
    }

    const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")

    const response = await fetch(MIDTRANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    })

    const midtransData = await response.json()

    if (!response.ok) {
      console.error("Midtrans Error:", midtransData)
      return NextResponse.json(
        { error: "Midtrans error", details: midtransData },
        { status: 500 }
      )
    }

    return NextResponse.json({
      snap_token: midtransData.token,
      order_id: orderId,
      ticket_codes: ticketCodes,
    })

  } catch (e: any) {
    console.error("Global Checkout Error:", e)
    return NextResponse.json(
      { error: "Internal Server Error", details: e.message }, 
      { status: 500 }
    )
  }
}