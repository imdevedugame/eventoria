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

    /* =====================
       GET SEMINAR
    ===================== */
    const { data: seminar } = await supabase
      .from("seminars")
      .select("*")
      .eq("id", seminar_id)
      .single()

    if (!seminar) {
      return NextResponse.json({ error: "Seminar not found" }, { status: 404 })
    }

    const available = seminar.max_participants - seminar.current_participants
    if (quantity > available) {
      return NextResponse.json(
        { error: `Only ${available} slots available` },
        { status: 400 }
      )
    }

    /* =====================
       GET USER
    ===================== */
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    /* =====================
       CREATE ORDER ID
    ===================== */
    const orderId = `ORDER-${Date.now()}-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`

    const ticketCodes: string[] = []

    /* =====================
       CREATE TICKETS + TRANSACTIONS
    ===================== */
    for (let i = 0; i < quantity; i++) {
      const code = `EVNT-${crypto
        .randomBytes(6)
        .toString("hex")
        .toUpperCase()}`

      const { data: ticket } = await supabase
        .from("tickets")
        .insert({
          seminar_id,
          user_id,
          ticket_code: code,
          status: "pending",
        })
        .select()
        .single()

      if (!ticket) {
        return NextResponse.json(
          { error: "Failed to create ticket" },
          { status: 500 }
        )
      }

      await supabase.from("transactions").insert({
        ticket_id: ticket.id, // 🔥 WAJIB
        seminar_id,
        user_id,
        midtrans_order_id: orderId,
        amount: seminar.price,
        payment_method: "midtrans",
        payment_status: "pending",
      })

      ticketCodes.push(code)
    }

    /* =====================
       FREE EVENT
    ===================== */
    if (seminar.price === 0) {
      await supabase
        .from("tickets")
        .update({ status: "active" })
        .eq("seminar_id", seminar_id)
        .eq("user_id", user_id)

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

    /* =====================
       MIDTRANS SNAP
    ===================== */
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
          quantity,
          name: seminar.title,
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

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: "Midtrans error", details: data },
        { status: 500 }
      )
    }

    return NextResponse.json({
      snap_token: data.token,
      order_id: orderId,
      ticket_codes: ticketCodes,
    })
  } catch (e) {
    console.error("Checkout error:", e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
