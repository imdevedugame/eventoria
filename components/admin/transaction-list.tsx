import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  id: string
  amount: number
  payment_status: string
  created_at: string
  users: {
    full_name: string
    email: string
  }
  seminars: {
    title: string
  }
}

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Belum ada transaksi.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => {
            const statusColor =
              transaction.payment_status === "success"
                ? "bg-secondary/10 text-secondary-foreground border-secondary"
                : transaction.payment_status === "pending"
                  ? "bg-accent/10 text-accent-foreground border-accent"
                  : "bg-destructive/10 text-destructive-foreground border-destructive"

            return (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm text-balance">{transaction.seminars.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.users.full_name} ({transaction.users.email})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={statusColor}>
                    {transaction.payment_status === "success"
                      ? "Berhasil"
                      : transaction.payment_status === "pending"
                        ? "Menunggu"
                        : "Gagal"}
                  </Badge>
                  <p className="font-semibold text-sm">
                    {transaction.amount === 0 ? "GRATIS" : `Rp ${transaction.amount.toLocaleString("id-ID")}`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
