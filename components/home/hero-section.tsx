import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, Award } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-background py-20 md:py-28">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                Platform Seminar Terpercaya #1 di Indonesia
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance leading-tight">
              Tingkatkan Pengetahuan Anda Bersama <span className="text-primary">Eventoria</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl">
              Platform lengkap untuk menemukan, mendaftar, dan mengikuti berbagai seminar berkualitas tinggi. Dari
              kesehatan, pendidikan, hingga pengembangan profesional - semua ada di sini.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="#seminars">
                  Jelajahi Seminar
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#how-it-works">Cara Kerja</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm text-muted-foreground">Seminar Tersedia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">50K+</p>
                  <p className="text-sm text-muted-foreground">Peserta Aktif</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Rating Kepuasan</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="relative h-[500px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-secondary/20 to-accent/20 rounded-2xl transform -rotate-3"></div>
              <div className="absolute inset-4 bg-background rounded-2xl shadow-2xl overflow-hidden">
                <img src="/modern-conference-seminar-audience.jpg" alt="Seminar Event" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
    </section>
  )
}
