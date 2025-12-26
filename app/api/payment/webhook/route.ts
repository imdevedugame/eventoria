export const runtime = "nodejs"

import { NextResponse } from "next/server"
import crypto from "crypto"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const notification = await req.json()

    // Test notification → langsung OK
    if (!notification?.order_id) {
      return NextResponse.json({ message: "Test OK" }, { status: 200 })
    }

    const calculatedSignature = crypto
      .createHash("sha512")
      .update(
        notification.order_id +
        notification.status_code +
        notification.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex")

    if (notification.signature_key !== calculatedSignature) {
      console.warn("Invalid signature", notification)
      return NextResponse.json({ message: "Ignored" }, { status: 200 })
    }

    // lanjut logic DB (bebas)
    return NextResponse.json({ message: "Processed" }, { status: 200 })

  } catch (e) {
    console.error("Webhook error", e)
    return NextResponse.json({ message: "OK" }, { status: 200 })
  }
}
