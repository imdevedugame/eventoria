import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Wijaya",
    role: "Dokter & Researcher",
    image: "/professional-woman-doctor.png",
    content:
      "Platform yang sangat membantu untuk menemukan seminar medis berkualitas. Proses pembelian tiket sangat mudah dan cepat!",
    rating: 5,
  },
  {
    name: "Ahmad Ridwan",
    role: "Mahasiswa Teknik",
    image: "/male-student-studying.png",
    content:
      "Eventoria memudahkan saya mengikuti berbagai seminar teknologi. Banyak pilihan gratis untuk mahasiswa seperti saya.",
    rating: 5,
  },
  {
    name: "Linda Kusuma",
    role: "Marketing Manager",
    image: "/business-woman-professional.jpg",
    content: "Sistem pembayaran yang aman dan customer service yang responsif. Sangat recommend untuk professionals!",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">Apa Kata Mereka?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Testimoni dari ribuan pengguna yang puas dengan layanan kami
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <Quote className="h-8 w-8 text-primary/20" />
                <p className="text-muted-foreground leading-relaxed text-pretty italic">"{testimonial.content}"</p>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
