"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, DollarSign } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Transaction {
  id: string
  amount: number
  payment_status: string
  paid_at: string
  created_at: string
  users: {
    full_name: string
    email: string
  }
  seminars: {
    title: string
  }
}

interface RevenueManagementProps {
  transactions: Transaction[]
  totalRevenue: number
}

export function RevenueManagement({ transactions, totalRevenue }: RevenueManagementProps) {
  const exportToCSV = () => {
    // Create CSV headers
    const headers = ["Tanggal", "Order ID", "Nama User", "Email", "Seminar", "Jumlah", "Status", "Dibayar"]

    // Create CSV rows
    const rows = transactions.map((t) => [
      new Date(t.created_at).toLocaleDateString("id-ID"),
      t.id,
      t.users.full_name,
      t.users.email,
      t.seminars.title,
      `Rp ${Number(t.amount).toLocaleString("id-ID")}`,
      t.payment_status === "success" ? "Berhasil" : t.payment_status === "pending" ? "Pending" : "Gagal",
      t.paid_at ? new Date(t.paid_at).toLocaleDateString("id-ID") : "-",
    ])

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `revenue-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const successfulTransactions = transactions.filter((t) => t.payment_status === "success")
  const pendingTransactions = transactions.filter((t) => t.payment_status === "pending")
  const pendingRevenue = pendingTransactions.reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Rp {totalRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {successfulTransactions.length} transaksi berhasil
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {pendingRevenue.toLocaleString("id-ID")}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingTransactions.length} transaksi pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transaksi</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Semua transaksi</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Transaksi</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Seminar</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Belum ada transaksi
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">
                      {new Date(transaction.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="font-medium">{transaction.users.full_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{transaction.users.email}</TableCell>
                    <TableCell className="text-sm">{transaction.seminars.title}</TableCell>
                    <TableCell className="font-medium">
                      Rp {Number(transaction.amount).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.payment_status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.payment_status === "success"
                          ? "Berhasil"
                          : transaction.payment_status === "pending"
                            ? "Pending"
                            : "Gagal"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
