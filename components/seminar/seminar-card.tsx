import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import type { Seminar } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import Image from "next/image"

interface SeminarCardProps {
  seminar: Seminar
}

export function SeminarCard({ seminar }: SeminarCardProps) {
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

  const isFull = seminar.current_participants >= seminar.max_participants
  const availableSeats = seminar.max_participants - seminar.current_participants

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={seminar.image_url || "/placeholder.svg?height=200&width=400"}
          alt={seminar.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur">
            {CATEGORY_LABELS[seminar.category]}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2 leading-tight text-balance">{seminar.title}</h3>

        <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{seminar.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs">
              {formattedDate}, {formattedTime}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs line-clamp-1">{seminar.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs">
              {isFull ? "Penuh" : `${availableSeats} kursi tersisa`} ({seminar.current_participants}/
              {seminar.max_participants})
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-2xl font-bold text-primary">
            {seminar.price === 0 ? "GRATIS" : `Rp ${seminar.price.toLocaleString("id-ID")}`}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full" disabled={isFull}>
          <Link href={`/seminar/${seminar.id}`}>{isFull ? "Tiket Habis" : "Lihat Detail"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
