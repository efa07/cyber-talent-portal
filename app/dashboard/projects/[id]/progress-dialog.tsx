"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
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
import { Loader2, Zap, TrendingUp } from "lucide-react"
import { updateProjectProgress } from "@/app/actions"

interface ProgressDialogProps {
  enrollmentId: string
  studentId: string
  projectId: string
  studentName: string
  currentProgress: number
  currentXpAwarded: number
  currentNotes: string
  maxXp: number
  onSaved: () => void
}

export function ProgressDialog({
  enrollmentId,
  studentId,
  projectId,
  studentName,
  currentProgress,
  currentXpAwarded,
  currentNotes,
  maxXp,
  onSaved,
}: ProgressDialogProps) {
  const [open, setOpen] = useState(false)
  const [progress, setProgress] = useState(currentProgress)
  const [isPending, startTransition] = useTransition()

  const newXpForProject = Math.floor((progress / 100) * maxXp)
  const xpDelta = newXpForProject - currentXpAwarded

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await updateProjectProgress(formData)
        setOpen(false)
        onSaved()
      } catch (e: any) {
        console.error(e)
        alert(e?.message || "Failed to update progress")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setProgress(currentProgress) }}>
      <DialogTrigger render={<Button size="sm" variant="outline" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Update</Button>} />

      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Set {studentName}&apos;s progress and award XP for this project.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="space-y-5 py-2">
          {/* Hidden fields */}
          <input type="hidden" name="enrollment_id" value={enrollmentId} />
          <input type="hidden" name="student_id" value={studentId} />
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="max_xp" value={maxXp} />
          <input type="hidden" name="progress" value={progress} />

          {/* Progress Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Progress</label>
              <span className="text-2xl font-bold text-violet-600">{progress}%</span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* XP Preview */}
          <div className="rounded-xl border bg-gradient-to-br from-violet-500/5 to-violet-500/10 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Zap className="h-4 w-4 text-yellow-500" />
              XP Breakdown
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Already Awarded</p>
                <p className="font-semibold">{currentXpAwarded} XP</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Will Become</p>
                <p className="font-semibold">{newXpForProject} XP</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${
              xpDelta > 0
                ? "bg-green-500/10 text-green-600"
                : xpDelta < 0
                ? "bg-muted text-muted-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              <Zap className="h-3.5 w-3.5" />
              {xpDelta > 0
                ? `+${xpDelta} XP will be awarded to student`
                : xpDelta === 0
                ? "No XP change (same progress level)"
                : "XP is never revoked — no change to student XP"}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="prog-notes" className="text-sm font-medium">
              Instructor Notes <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              id="prog-notes"
              name="notes"
              defaultValue={currentNotes}
              placeholder="Feedback for the student..."
              className="h-24"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Progress
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
