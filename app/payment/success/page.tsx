import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"


export default async function PaymentSuccessPage({ searchParams }: { searchParams: { order_id?: string } }) {


  const user = await getCurrentUser()
  const supabase = await getSupabaseServerClient()

  if (!user) {
    redirect("/login")
  }

  const resolvedSearchParams = typeof searchParams.then === "function" ? await searchParams : searchParams
  const orderId = resolvedSearchParams.order_id

  if (!orderId) {
    redirect("/")
  }

  const { data: transaction } = await supabase
    .from("transactions")
    .select("*, tickets(*), seminars(*)")
    .eq("midtrans_order_id", orderId)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Pembayaran Berhasil!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <p className="text-muted-foreground">
                Tiket Anda telah berhasil dibuat. Terima kasih atas pembelian Anda!
              </p>

              {transaction && (
                <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono font-medium">{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode Tiket</span>
                    <span className="font-mono font-medium">{transaction.tickets?.ticket_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Seminar</span>
                    <span className="font-medium">{transaction.seminars?.title}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild>
                  <Link href="/my-tickets">Lihat Tiket Saya</Link>
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
