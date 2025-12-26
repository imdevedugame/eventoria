import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import type { Seminar } from "@/lib/types"
import { notFound, redirect } from "next/navigation"

export default async function CheckoutPage({ params }: { params: { id: string } }) {

  const supabase = await import("@/lib/supabase/server").then(m => m.getSupabaseServerClient())
    const resolvedParams = typeof params.then === "function" ? await params : params
    const { data: seminar, error } = await supabase.from("seminars").select("*").eq("id", resolvedParams.id).single()
  if (error || !seminar) {
    notFound()
  }
  if (seminar.current_participants >= seminar.max_participants) {
      redirect(`/seminar/${resolvedParams.id}`)
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CheckoutForm seminar={seminar as Seminar} />
      <Footer />
    </div>
  )
}
