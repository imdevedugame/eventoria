"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Calendar, MapPin, TicketIcon, ArrowLeft, Minus, Plus } from "lucide-react"
import type { Seminar } from "@/lib/types"
import { useAuth } from "@/context/auth-context"
import { useEffect } from "react"
import { CATEGORY_LABELS } from "@/lib/types"
import Link from "next/link"
import { useRouter } from "next/navigation"


interface CheckoutFormProps {
  seminar: Seminar
}

interface AttendeeData {
  full_name: string
  email: string
  phone: string
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: any) => void
    }
  }
}


export function CheckoutForm({ seminar }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { user, loading: loadingUser } = useAuth()
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [attendees, setAttendees] = useState<AttendeeData[]>([
    { full_name: "", email: "", phone: "" },
  ])

  // Prefill attendee data when user is loaded
  useEffect(() => {
    if (user) {
      setAttendees([{ full_name: user.full_name || "", email: user.email || "", phone: user.phone || "" }])
    }
  }, [user])

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace(`/login?redirect=/checkout/${seminar.id}`)
    }
  }, [user, loadingUser, seminar.id, router])

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

  const handleIncreaseQuantity = () => {
    const availableSlots = seminar.max_participants - seminar.current_participants
    if (ticketQuantity < availableSlots && ticketQuantity < 10) {
      const newQuantity = ticketQuantity + 1
      setTicketQuantity(newQuantity)
      setAttendees([...attendees, { full_name: "", email: "", phone: "" }])
    }
  }

  const handleDecreaseQuantity = () => {
    if (ticketQuantity > 1) {
      const newQuantity = ticketQuantity - 1
      setTicketQuantity(newQuantity)
      setAttendees(attendees.slice(0, newQuantity))
    }
  }

  const handleAttendeeChange = (index: number, field: keyof AttendeeData, value: string) => {
    const updatedAttendees = [...attendees]
    updatedAttendees[index][field] = value
    setAttendees(updatedAttendees)
  }

  const validateAttendees = () => {
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i]
      if (!attendee.full_name || !attendee.email || !attendee.phone) {
        setError(`Mohon lengkapi data peserta ${i + 1}`)
        return false
      }
      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email)) {
        setError(`Email peserta ${i + 1} tidak valid`)
        return false
      }
      // Phone validation (basic)
      if (!/^[\d+\-$$$$\s]{8,}$/.test(attendee.phone)) {
        setError(`Nomor telepon peserta ${i + 1} tidak valid`)
        return false
      }
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateAttendees()) {
      return
    }
    if (!user) {
      setError("Anda harus login untuk melanjutkan.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/checkout/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seminar_id: seminar.id,
          user_id: user.id,
          quantity: ticketQuantity,
          attendees: attendees,
        }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create transaction")
      }
      // For free seminars, redirect directly to success page
      if (seminar.price === 0) {
        router.push(`/payment/success?order_id=${data.order_id}`)
        return
      }
      // Load Midtrans Snap script if not already loaded
      if (!window.snap) {
        const script = document.createElement("script")
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js"
        script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "")
        document.body.appendChild(script)
        script.onload = () => {
          if (window.snap && data.snap_token) {
            window.snap.pay(data.snap_token, {
              onSuccess: () => {
                router.push(`/payment/success?order_id=${data.order_id}`)
              },
              onPending: () => {
                router.push(`/payment/pending?order_id=${data.order_id}`)
              },
              onError: () => {
                setError("Pembayaran gagal. Silakan coba lagi.")
                setLoading(false)
              },
              onClose: () => {
                setLoading(false)
              },
            })
          }
        }
      } else {
        if (data.snap_token) {
          window.snap.pay(data.snap_token, {
            onSuccess: () => {
              router.push(`/payment/success?order_id=${data.order_id}`)
            },
            onPending: () => {
              router.push(`/payment/pending?order_id=${data.order_id}`)
            },
            onError: () => {
              setError("Pembayaran gagal. Silakan coba lagi.")
              setLoading(false)
            },
            onClose: () => {
              setLoading(false)
            },
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      setLoading(false)
    }
  }

  const availableSlots = seminar.max_participants - seminar.current_participants

  return (
    <main className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/seminar/${seminar.id}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Checkout</h1>
          <p className="text-muted-foreground">Isi data peserta sebelum melanjutkan pembayaran</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Seminar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-balance">{seminar.title}</h3>
                <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[seminar.category]}</p>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Tanggal & Waktu</p>
                    <p className="text-muted-foreground">
                      {formattedDate}, {formattedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Lokasi</p>
                    <p className="text-muted-foreground">{seminar.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TicketIcon className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Pembicara</p>
                    <p className="text-muted-foreground">{seminar.speaker}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jumlah Tiket</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Pilih jumlah tiket</p>
                  <p className="text-sm text-muted-foreground">Tersisa {availableSlots} tiket</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={handleDecreaseQuantity} disabled={ticketQuantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-12 text-center">{ticketQuantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleIncreaseQuantity}
                    disabled={ticketQuantity >= availableSlots || ticketQuantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {attendees.map((attendee, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Data Peserta {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Nama Lengkap</Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="Masukkan nama lengkap"
                    value={attendee.full_name}
                    onChange={(e) => handleAttendeeChange(index, "full_name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`}>Email</Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="contoh@email.com"
                    value={attendee.email}
                    onChange={(e) => handleAttendeeChange(index, "email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`phone-${index}`}>Nomor Telepon</Label>
                  <Input
                    id={`phone-${index}`}
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={attendee.phone}
                    onChange={(e) => handleAttendeeChange(index, "phone", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Detail Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga Tiket</span>
                  <span>{seminar.price === 0 ? "Rp 0" : `Rp ${seminar.price.toLocaleString("id-ID")}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah Tiket</span>
                  <span>x{ticketQuantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {seminar.price === 0 ? "Rp 0" : `Rp ${(seminar.price * ticketQuantity).toLocaleString("id-ID")}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Biaya Admin</span>
                  <span>Rp 0</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {seminar.price === 0 ? "GRATIS" : `Rp ${(seminar.price * ticketQuantity).toLocaleString("id-ID")}`}
                </span>
              </div>

              <Button onClick={handlePayment} className="w-full" size="lg" disabled={loading}>
                {loading ? "Memproses..." : seminar.price === 0 ? "Konfirmasi Pendaftaran" : "Bayar Sekarang"}
              </Button>

              {seminar.price > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Pembayaran dilakukan melalui Midtrans. Anda akan diarahkan ke halaman pembayaran.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
