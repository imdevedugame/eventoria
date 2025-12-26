import { SeminarCard } from "./seminar-card"
import type { Seminar } from "@/lib/types"

interface SeminarGridProps {
  seminars: Seminar[]
}

export function SeminarGrid({ seminars }: SeminarGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {seminars.map((seminar) => (
        <SeminarCard key={seminar.id} seminar={seminar} />
      ))}
    </div>
  )
}
