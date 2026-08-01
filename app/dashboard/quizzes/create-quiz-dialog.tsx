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
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { createQuiz } from "@/app/actions"
import { useState, useTransition } from "react"

export function CreateQuizDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await createQuiz(formData)
        setOpen(false)
        if (result.success && result.quizId) {
          router.push(`/dashboard/quizzes/${result.quizId}/builder`)
        }
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
              Create Quiz
            </Button>
          }
        />
      </div>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>
            Configure the settings for your new quiz.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input id="title" name="title" required placeholder="e.g., JavaScript Basics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required placeholder="Brief description of the quiz..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (mins)</Label>
                <Input id="time-limit" name="time-limit" required type="number" placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attempts">Max Attempts</Label>
                <Input id="attempts" name="attempts" required type="number" placeholder="1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue to Builder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
