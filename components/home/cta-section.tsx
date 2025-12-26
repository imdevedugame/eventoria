import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-primary p-12 md:p-16 text-center">
          <div className="relative z-10 mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground text-balance">
              Siap Memulai Perjalanan Belajar Anda?
            </h2>
            <p className="text-lg text-primary-foreground/90 text-pretty leading-relaxed">
              Bergabunglah dengan ribuan profesional dan pelajar yang sudah meningkatkan pengetahuan mereka. Daftar
              sekarang dan dapatkan akses ke seminar-seminar berkualitas tinggi.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="gap-2">
                <Link href="/signup">
                  Daftar Gratis Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link href="#seminars">Lihat Seminar</Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>
      </div>
    </section>
  )
}
