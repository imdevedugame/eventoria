import { LoginForm } from "@/components/auth/login-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Ticket } from "lucide-react"

export default async function LoginPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Ticket className="h-8 w-8" />
            <span className="text-2xl font-bold">Eventoria</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Platform Seminar Terpercaya</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
