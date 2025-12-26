import Link from "next/link"
import { Ticket, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <Ticket className="h-6 w-6" />
              <span className="text-xl font-bold">Eventoria</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
              Platform seminar terpercaya untuk meningkatkan pengetahuan dan networking Anda. Temukan, daftar, dan
              hadiri seminar berkualitas dengan mudah.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" asChild>
                <Link href="#" aria-label="Facebook">
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href="#" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href="#" aria-label="Instagram">
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="icon" variant="outline" asChild>
                <Link href="#" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/?category=all" className="text-muted-foreground hover:text-primary transition-colors">
                  Semua Seminar
                </Link>
              </li>
              <li>
                <Link href="/?category=general" className="text-muted-foreground hover:text-primary transition-colors">
                  Seminar Umum
                </Link>
              </li>
              <li>
                <Link href="/?category=health" className="text-muted-foreground hover:text-primary transition-colors">
                  Seminar Kesehatan
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=education"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Promosi Sekolah/Kampus
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="text-muted-foreground hover:text-primary transition-colors">
                  Tiket Saya
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Bantuan & Info</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Cara Pembelian Tiket
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Kebijakan Pengembalian
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Hubungi Kami</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>support@eventoria.id</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium">Newsletter</h4>
              <p className="text-xs text-muted-foreground">Dapatkan info seminar terbaru</p>
              <div className="flex gap-2">
                <Input placeholder="Email Anda" className="h-9 text-sm" />
                <Button size="sm">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Eventoria. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="#" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Syarat Layanan
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
