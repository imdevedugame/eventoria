import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SeminarDetail } from "@/components/seminar/seminar-detail"
import type { Seminar } from "@/lib/types"
import { notFound } from "next/navigation"

export default async function SeminarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await import("@/lib/supabase/server").then(m => m.getSupabaseServerClient())
  const { id } = await params
  const { data: seminar, error } = await supabase.from("seminars").select("*").eq("id", id).single()
  if (error || !seminar) {
    notFound()
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SeminarDetail seminar={seminar as Seminar} seminarId={id} />
      <Footer />
    </div>
  )
}
