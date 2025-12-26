import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TicketList } from "@/components/tickets/ticket-list"
import { redirect } from "next/navigation"
export default function MyTicketsPage() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Tiket Saya</h1>
            <p className="text-muted-foreground">Kelola dan lihat semua tiket seminar Anda</p>
          </div>
          <TicketList />
        </div>
      </main>
      <Footer />
    </div>
  )
}
