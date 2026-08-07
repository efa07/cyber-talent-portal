"use client"

import { useRouter, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Assignment {
  id: string
  title: string
}

export function SubmissionsFilter({
  assignments,
  currentAssignment,
}: {
  assignments: Assignment[]
  currentAssignment?: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (value: string | null) => {
    if (!value || value === "all") {
      router.push(pathname)
    } else {
      router.push(`${pathname}?assignment=${value}`)
    }
  }

  return (
    <Select value={currentAssignment || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[240px]" id="assignment-filter">
        <SelectValue placeholder="Filter by assignment…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Assignments</SelectItem>
        {assignments.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
