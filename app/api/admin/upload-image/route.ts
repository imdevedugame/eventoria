import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!
const BUCKET_NAME = "seminar-images"

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    const fileName = `seminar-${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const publicUrl = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data.publicUrl
    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    return NextResponse.json({ error: "Upload error" }, { status: 500 })
  }
}
