"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { Seminar } from "@/lib/types"
import { CATEGORY_LABELS } from "@/lib/types"
import { CreateSeminarDialog } from "./create-seminar-dialog"
import { EditSeminarDialog } from "./edit-seminar-dialog"
import { useState } from "react"

interface SeminarManagementProps {
  seminars: Seminar[]
}

export function SeminarManagement({ seminars }: SeminarManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Seminar</h2>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Seminar
        </Button>
      </div>

      <CreateSeminarDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      {seminars.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Belum ada seminar. Tambahkan seminar pertama Anda!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {seminars.map((seminar) => (
            <Card key={seminar.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-balance">{seminar.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{CATEGORY_LABELS[seminar.category]}</Badge>
                      <Badge
                        variant={
                          seminar.status === "active"
                            ? "default"
                            : seminar.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {seminar.status === "active"
                          ? "Aktif"
                          : seminar.status === "completed"
                            ? "Selesai"
                            : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                  <EditSeminarDialog seminar={seminar} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Harga</p>
                    <p className="font-medium">
                      {seminar.price === 0 ? "GRATIS" : `Rp ${seminar.price.toLocaleString("id-ID")}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Peserta</p>
                    <p className="font-medium">
                      {seminar.current_participants}/{seminar.max_participants}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tanggal</p>
                    <p className="font-medium">
                      {new Date(seminar.event_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lokasi</p>
                    <p className="font-medium line-clamp-1">{seminar.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
