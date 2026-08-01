"use client"

import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAssignment } from "@/app/actions"
import { useState, useTransition } from "react"

export function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await createAssignment(formData)
        setOpen(false)
      } catch (e) {
        console.error(e)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-8 right-8 z-50">
        <DialogTrigger 
          render={
            <Button size="lg" className="rounded-full shadow-lg h-14 px-6 gap-2">
              <Plus className="h-5 w-5" />
              Create Assignment
            </Button>
          }
        />
      </div>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Add a new assignment for your students. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input id="title" name="title" required placeholder="e.g., Buffer Overflow Lab" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" name="due-date" required type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload Assignment (PDF)</Label>
              <Input id="file" name="file" type="file" accept=".pdf" className="cursor-pointer file:text-violet-600 file:bg-violet-50 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-medium hover:file:bg-violet-100 transition-colors" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Assignment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
