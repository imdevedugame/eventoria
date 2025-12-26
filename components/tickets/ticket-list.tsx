"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TicketIcon } from "lucide-react"
import type { Ticket } from "@/lib/types"

interface TicketWithDetails extends Ticket {
  seminars: any
  transactions: any
}


import { useAuth } from "@/context/auth-context"
import { useEffect, useState } from "react"

export function TicketList() {
  const { user, loading } = useAuth()
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true)
      if (user) {
        const supabase = require("@/lib/supabase/client").getSupabaseBrowserClient()
        const { data } = await supabase
          .from("tickets")
          .select("*, seminars(*), transactions(*)")
          .eq("user_id", user.id)
          .order("purchased_at", { ascending: false })
        setTickets(data || [])
      } else {
        setTickets([])
      }
      setLoadingTickets(false)
    }
    fetchTickets()
  }, [user])

  if (loading || loadingTickets) {
    return <div>Memuat tiket...</div>
  }

  if (!user) {
    return <div>Anda harus login untuk melihat tiket.</div>
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <TicketIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Anda belum memiliki tiket apapun.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const seminar = ticket.seminars
        const transaction = Array.isArray(ticket.transactions) ? ticket.transactions[0] : ticket.transactions

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

        const paymentStatus = transaction?.payment_status || "unknown"
        const statusColor =
          paymentStatus === "success"
            ? "bg-secondary/10 text-secondary-foreground border-secondary"
            : paymentStatus === "pending"
              ? "bg-accent/10 text-accent-foreground border-accent"
              : "bg-destructive/10 text-destructive-foreground border-destructive"

        return (
          <Card key={ticket.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg text-balance">{seminar.title}</h3>
                    <Badge className={statusColor}>
                      {paymentStatus === "success" ? "Berhasil" : paymentStatus === "pending" ? "Menunggu" : "Gagal"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formattedDate}, {formattedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{seminar.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <div className="text-sm">
                    <p className="text-muted-foreground">Kode Tiket</p>
                    <p className="font-mono font-bold text-primary">{ticket.ticket_code}</p>
                  </div>
                  {transaction && (
                    <div className="text-sm text-right">
                      <p className="text-muted-foreground">Total Bayar</p>
                      <p className="font-semibold">
                        {transaction.amount === 0 ? "GRATIS" : `Rp ${transaction.amount.toLocaleString("id-ID")}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
