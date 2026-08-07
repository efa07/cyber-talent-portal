"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, UserPlus, Users } from "lucide-react"
import { enrollStudentInProject } from "@/app/actions"
import { useRouter } from "next/navigation"

interface Student {
  id: string
  full_name: string
}

function getInitials(name: string) {
  if (!name) return "ST"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export function EnrollMissingStudents({
  projectId,
  students,
}: {
  projectId: string
  students: Student[]
}) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const toggleAll = () => {
    if (selected.size === students.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(students.map((s) => s.id)))
    }
  }

  const toggleStudent = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const handleEnroll = () => {
    startTransition(async () => {
      try {
        await Promise.all(
          Array.from(selected).map((studentId) =>
            enrollStudentInProject(projectId, studentId)
          )
        )
        setOpen(false)
        setSelected(new Set())
        router.refresh()
      } catch (e: any) {
        console.error(e)
        alert(e?.message || "Failed to enroll students")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2"><UserPlus className="h-4 w-4" />Enroll Students</Button>} />
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-500" />
            Enroll Students
          </DialogTitle>
          <DialogDescription>
            {students.length} student{students.length !== 1 ? "s" : ""} not yet enrolled in this project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto py-1">
          {/* Select All */}
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-sm font-medium text-left"
          >
            <input
              type="checkbox"
              readOnly
              checked={selected.size === students.length}
              className="h-4 w-4 accent-violet-600 rounded"
            />
            Select all
          </button>

          <div className="border-t" />

          {students.map((student) => (
            <button
              key={student.id}
              type="button"
              onClick={() => toggleStudent(student.id)}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
            >
              <input
                type="checkbox"
                readOnly
                checked={selected.has(student.id)}
                className="h-4 w-4 accent-violet-600 rounded shrink-0"
              />
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="text-xs bg-violet-500/10 text-violet-600">
                  {getInitials(student.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{student.full_name}</span>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleEnroll}
            disabled={isPending || selected.size === 0}
            className="gap-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Enroll {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
