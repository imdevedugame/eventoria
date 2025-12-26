"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS } from "@/lib/types"

interface CategoryFilterProps {
  currentCategory?: string
}

export function CategoryFilter({ currentCategory = "all" }: CategoryFilterProps) {
  const categories: Array<{ value: string; label: string }> = [
    { value: "all", label: "Semua" },
    { value: "umum", label: CATEGORY_LABELS.umum },
    { value: "kesehatan", label: CATEGORY_LABELS.kesehatan },
    { value: "promosi_sekolah_kampus", label: CATEGORY_LABELS.promosi_sekolah_kampus },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          asChild
          variant={currentCategory === category.value ? "default" : "outline"}
          size="sm"
        >
          <Link href={category.value === "all" ? "/" : `/?category=${category.value}`}>{category.label}</Link>
        </Button>
      ))}
    </div>
  )
}
