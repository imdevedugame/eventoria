import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SeminarGrid } from "@/components/seminar/seminar-grid"
import { CategoryFilter } from "@/components/seminar/category-filter"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { StatsSection } from "@/components/home/stats-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"
import type { Seminar } from "@/lib/types"

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()

  const { category } = await searchParams

  let query = supabase.from("seminars").select("*").eq("status", "active").order("event_date", { ascending: true })

  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data: seminars, error } = await query

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroSection />

      <StatsSection />

      <FeaturesSection />

      <HowItWorksSection />

      <section id="seminars" className="py-20 bg-background">
        <div className="container">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Jelajahi Seminar Terbaik</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Temukan seminar yang sesuai dengan minat dan kebutuhan Anda dari berbagai kategori
              </p>
            </div>

            <CategoryFilter currentCategory={category} />

            {error ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Gagal memuat seminar. Silakan coba lagi.</p>
              </div>
            ) : !seminars || seminars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Tidak ada seminar tersedia saat ini.</p>
              </div>
            ) : (
              <SeminarGrid seminars={seminars as Seminar[]} />
            )}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      <CTASection />

      <Footer />
    </div>
  )
}
