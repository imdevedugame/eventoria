import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { AdminStats } from "@/components/admin/admin-stats"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeminarManagement } from "@/components/admin/seminar-management"
import { TransactionList } from "@/components/admin/transaction-list"
import { RevenueManagement } from "@/components/admin/revenue-management"
import { Footer } from "@/components/footer"

export default async function AdminPage() {
  const user = await getCurrentUser()
  const supabase = await getSupabaseServerClient()

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  // Get statistics
  const { count: totalSeminars } = await supabase.from("seminars").select("*", { count: "exact", head: true })

  const { count: totalTickets } = await supabase.from("tickets").select("*", { count: "exact", head: true })

  const { data: transactions } = await supabase.from("transactions").select("amount").eq("payment_status", "success")

  const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get seminars
  const { data: seminars } = await supabase.from("seminars").select("*").order("created_at", { ascending: false })

  const { data: allTransactions } = await supabase
    .from("transactions")
    .select("*, users(full_name, email), seminars(title)")
    .order("created_at", { ascending: false })

  // Get recent transactions
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select("*, users(full_name, email), seminars(title)")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola seminar dan monitor statistik platform</p>
          </div>

          <AdminStats
            totalSeminars={totalSeminars || 0}
            totalTickets={totalTickets || 0}
            totalRevenue={totalRevenue}
            totalUsers={totalUsers || 0}
          />

          <Tabs defaultValue="seminars" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="seminars">Kelola Seminar</TabsTrigger>
              <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
              <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            </TabsList>

            <TabsContent value="seminars" className="space-y-4">
              <SeminarManagement seminars={seminars || []} />
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <RevenueManagement transactions={allTransactions || []} totalRevenue={totalRevenue} />
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <TransactionList transactions={recentTransactions || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
