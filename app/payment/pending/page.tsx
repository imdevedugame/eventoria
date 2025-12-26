import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function PaymentPendingPage({ searchParams }: { searchParams: { order_id?: string } }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const orderId = searchParams.order_id

  if (!orderId) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Pembayaran Menunggu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono font-medium">{orderId}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild>
                  <Link href="/my-tickets">Cek Status Pembayaran</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Kembali ke Beranda</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
