export type UserRole = "user" | "admin"

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type SeminarCategory = "umum" | "kesehatan" | "promosi_sekolah_kampus"
export type SeminarStatus = "active" | "inactive" | "completed"

export interface Seminar {
  id: string
  title: string
  description: string
  category: SeminarCategory
  speaker: string
  event_date: string
  location: string
  price: number
  max_participants: number
  current_participants: number
  image_url?: string
  status: SeminarStatus
  created_by?: string
  created_at: string
  updated_at: string
}

export type TicketStatus = "active" | "used" | "cancelled"

export interface Ticket {
  id: string
  seminar_id: string
  user_id: string
  ticket_code: string
  status: TicketStatus
  purchased_at: string
}

export type PaymentStatus = "pending" | "success" | "failed" | "expired"

export interface Transaction {
  id: string
  ticket_id: string
  user_id: string
  seminar_id: string
  amount: number
  payment_method: string
  midtrans_order_id?: string
  midtrans_transaction_id?: string
  payment_status: PaymentStatus
  paid_at?: string
  created_at: string
}

export const CATEGORY_LABELS: Record<SeminarCategory, string> = {
  umum: "Umum",
  kesehatan: "Kesehatan",
  promosi_sekolah_kampus: "Promosi Sekolah/Kampus",
}
