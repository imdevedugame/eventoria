"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Users,
  UserIcon,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Building2,
  Award,
  Video,
  FileText,
  Gift,
} from "lucide-react"
import type { Seminar } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"
import { CATEGORY_LABELS } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"


interface SeminarDetailProps {
  seminar: Seminar
  seminarId: string
}


export function SeminarDetail({ seminar, seminarId }: SeminarDetailProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [hasTicket, setHasTicket] = useState(false)
  const [loadingTicket, setLoadingTicket] = useState(true)

  useEffect(() => {
    const fetchTicket = async () => {
      setLoadingTicket(true)
      if (user) {
        const supabase = require("@/lib/supabase/client").getSupabaseBrowserClient()
        const { data: existingTicket } = await supabase
          .from("tickets")
          .select("id")
          .eq("user_id", user.id)
          .eq("seminar_id", seminar.id)
          .single()
        setHasTicket(!!existingTicket)
      } else {
        setHasTicket(false)
      }
      setLoadingTicket(false)
    }
    fetchTicket()
  }, [user, seminar.id])

  const eventDate = new Date(seminar.event_date)
  const formattedDate = eventDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = eventDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const isFull = seminar.current_participants >= seminar.max_participants
  const availableSeats = seminar.max_participants - seminar.current_participants

  const handleBuyTicket = () => {
    if (!user) {
      router.push(`/login?redirect=/seminar/${seminar.id}`)
      return
    }
    router.push(`/checkout/${seminar.id}`)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[400px] rounded-xl overflow-hidden bg-muted shadow-lg">
              <Image
                src={seminar.image_url || "/placeholder.svg?height=400&width=800&query=conference seminar event"}
                alt={seminar.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground shadow-lg">
                  {CATEGORY_LABELS[seminar.category]}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance drop-shadow-lg">
                  {seminar.title}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tanggal & Waktu</p>
                    <p className="font-medium text-sm">{formattedDate}</p>
                    <p className="text-xs text-muted-foreground">{formattedTime} WIB</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lokasi</p>
                    <p className="font-medium text-sm">{seminar.location}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <UserIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pembicara</p>
                    <p className="font-medium text-sm">{seminar.speaker}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Kapasitas</p>
                    <p className="font-medium text-sm">
                      {seminar.current_participants} / {seminar.max_participants} Peserta
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-3">Tentang Seminar</h2>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{seminar.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Yang Akan Anda Dapatkan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sertifikat Digital</p>
                        <p className="text-xs text-muted-foreground">E-certificate untuk semua peserta</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 flex-shrink-0">
                        <FileText className="h-4 w-4 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Materi Lengkap</p>
                        <p className="text-xs text-muted-foreground">PDF & slide presentasi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                        <Video className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Rekaman Acara</p>
                        <p className="text-xs text-muted-foreground">Akses recording 30 hari</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <Gift className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Door Prize</p>
                        <p className="text-xs text-muted-foreground">Kesempatan dapat hadiah menarik</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Informasi Tambahan</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Durasi Acara</p>
                        <p className="text-muted-foreground">3 jam (termasuk sesi tanya jawab)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Penyelenggara</p>
                        <p className="text-muted-foreground">Eventoria & Partner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20 border-border/50 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Harga Tiket</p>
                  <p className="text-4xl font-bold text-primary">
                    {seminar.price === 0 ? "GRATIS" : `Rp ${seminar.price.toLocaleString("id-ID")}`}
                  </p>
                  {seminar.price > 0 && <p className="text-xs text-muted-foreground">Per orang</p>}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status Kursi</span>
                    <span className="font-medium">
                      {isFull ? (
                        <Badge variant="destructive">Penuh</Badge>
                      ) : availableSeats <= 10 ? (
                        <Badge variant="secondary">Hampir Penuh</Badge>
                      ) : (
                        <Badge variant="outline">Tersedia</Badge>
                      )}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tersisa</span>
                      <span className="font-medium">{isFull ? "0" : availableSeats} kursi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 bg-muted rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all"
                          style={{ width: `${(seminar.current_participants / seminar.max_participants) * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {seminar.current_participants} dari {seminar.max_participants} peserta terdaftar
                    </p>
                  </div>
                </div>

                <Separator />

                {hasTicket ? (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <p className="text-sm font-medium">Anda sudah memiliki tiket ini</p>
                    </div>
                    <Button asChild className="w-full bg-transparent" variant="outline">
                      <Link href="/my-tickets">Lihat Tiket Saya</Link>
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleBuyTicket} className="w-full" size="lg" disabled={isFull}>
                    {isFull ? "Tiket Habis" : seminar.price === 0 ? "Daftar Gratis" : "Beli Tiket Sekarang"}
                  </Button>
                )}

                {!user && !hasTicket && (
                  <p className="text-xs text-center text-muted-foreground">
                    Anda harus{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      masuk
                    </Link>{" "}
                    untuk {seminar.price === 0 ? "mendaftar" : "membeli tiket"}
                  </p>
                )}

                <Separator />

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Konfirmasi instan
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    E-tiket dikirim via email
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Refund 100% jika dibatalkan
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}