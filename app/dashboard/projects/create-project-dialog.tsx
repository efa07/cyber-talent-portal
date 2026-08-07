"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2, Layers } from "lucide-react"
import { createProject } from "@/app/actions"
import { useRouter } from "next/navigation"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await createProject(formData)
        setOpen(false)
        if (result.projectId) {
          router.push(`/dashboard/projects/${result.projectId}`)
        } else {
          router.refresh()
        }
      } catch (e: any) {
        console.error(e)
        alert(e?.message || "Failed to create project")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus className="h-4 w-4" />New Project</Button>} />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-violet-500" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up a project and optionally enroll all current students.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="proj-title" className="text-sm font-medium">
              Project Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="proj-title"
              name="title"
              required
              placeholder="e.g. HTML & CSS Landing Page"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="proj-desc" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Textarea
              id="proj-desc"
              name="description"
              required
              placeholder="Describe what students need to build..."
              className="h-28"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="proj-xp" className="text-sm font-medium">
              Maximum XP
            </label>
            <Input
              id="proj-xp"
              name="max_xp"
              type="number"
              min={1}
              max={1000}
              defaultValue={100}
              className="max-w-[140px]"
            />
            <p className="text-xs text-muted-foreground">
              XP awarded scales with progress. 100% → max XP.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
            <input
              id="auto-enroll"
              name="auto_enroll"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-violet-600 rounded"
            />
            <label htmlFor="auto-enroll" className="text-sm font-medium cursor-pointer">
              Auto-enroll all current students
            </label>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
