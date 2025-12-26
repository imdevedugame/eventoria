import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Shield, Zap, CreditCard, Bell, HeartHandshake } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Beragam Kategori",
    description: "Temukan seminar dari berbagai topik: kesehatan, teknologi, bisnis, pendidikan, dan banyak lagi.",
  },
  {
    icon: Shield,
    title: "Transaksi Aman",
    description: "Pembayaran terenkripsi dengan Midtrans untuk keamanan maksimal dalam setiap transaksi.",
  },
  {
    icon: Zap,
    title: "Pendaftaran Instan",
    description: "Proses pendaftaran cepat dan mudah. Dapatkan tiket Anda hanya dalam beberapa klik.",
  },
  {
    icon: CreditCard,
    title: "Banyak Metode Pembayaran",
    description: "Bayar dengan transfer bank, e-wallet, kartu kredit, atau virtual account sesuai preferensi Anda.",
  },
  {
    icon: Bell,
    title: "Notifikasi Real-time",
    description: "Dapatkan update langsung tentang seminar, perubahan jadwal, dan pengingat acara.",
  },
  {
    icon: HeartHandshake,
    title: "Support 24/7",
    description: "Tim customer support kami siap membantu Anda kapan saja untuk pengalaman terbaik.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Mengapa Memilih Eventoria?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Platform terlengkap dengan berbagai fitur untuk pengalaman seminar yang tak terlupakan
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
