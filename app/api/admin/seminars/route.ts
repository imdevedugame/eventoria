import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, speaker, event_date, location, price, max_participants, image_url, media_partner_logos } = body

    // media_partner_logos: array of logo URLs (string[])

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("seminars")
      .insert({
        title,
        description,
        category,
        speaker,
        event_date,
        location,
        price,
        max_participants,
        created_by: user.id,
        status: "active",
        image_url,
        media_partner_logos, // store as array or JSONB in DB
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Create seminar error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, description, category, speaker, event_date, location, price, max_participants, status, image_url, media_partner_logos } = body

    // media_partner_logos: array of logo URLs (string[])

    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("seminars")
      .update({
        title,
        description,
        category,
        speaker,
        event_date,
        location,
        price,
        max_participants,
        status,
        image_url,
        media_partner_logos, // store as array or JSONB in DB
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Update seminar error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
