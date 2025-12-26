import { Card, CardContent } from "@/components/ui/card"
import { Search, Ticket, Calendar, CheckCircle2 } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Jelajahi Seminar",
    description: "Cari dan temukan seminar yang sesuai dengan minat dan kebutuhan Anda dari berbagai kategori.",
    step: "01",
  },
  {
    icon: Ticket,
    title: "Pilih & Beli Tiket",
    description: "Pilih jumlah tiket yang diinginkan, isi data peserta, dan lakukan pembayaran dengan aman.",
    step: "02",
  },
  {
    icon: Calendar,
    title: "Terima Konfirmasi",
    description: "Dapatkan tiket digital langsung ke email Anda setelah pembayaran berhasil diverifikasi.",
    step: "03",
  },
  {
    icon: CheckCircle2,
    title: "Hadiri Seminar",
    description: "Tunjukkan tiket digital Anda saat check-in dan nikmati pengalaman seminar yang berkesan.",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Cara Kerja Platform</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Proses sederhana dalam 4 langkah untuk mengikuti seminar impian Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative border-border/50 hover:border-primary/50 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary/10">{step.step}</div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
