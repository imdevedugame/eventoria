import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, DollarSign, Users, Calendar } from "lucide-react"

interface AdminStatsProps {
  totalSeminars: number
  totalTickets: number
  totalRevenue: number
  totalUsers: number
}

export function AdminStats({ totalSeminars, totalTickets, totalRevenue, totalUsers }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Seminar",
      value: totalSeminars,
      icon: Calendar,
      description: "Seminar yang terdaftar",
    },
    {
      title: "Tiket Terjual",
      value: totalTickets,
      icon: Ticket,
      description: "Total penjualan tiket",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: DollarSign,
      description: "Revenue dari penjualan",
    },
    {
      title: "Total User",
      value: totalUsers,
      icon: Users,
      description: "User terdaftar",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
