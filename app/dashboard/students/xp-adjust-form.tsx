"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateStudentXp } from "@/app/actions"

export function XpAdjustForm({ studentId, currentXp }: { studentId: string; currentXp: number }) {
  const [amount, setAmount] = useState(50)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")
  const router = useRouter()

  const updateXp = async (delta: number) => {
    setError("")
    const formData = new FormData()
    formData.set("student_id", studentId)
    formData.set("xp_change", delta.toString())

    startTransition(async () => {
      try {
        await updateStudentXp(formData)
        router.refresh()
      } catch (err: any) {
        setError(err?.message || "Failed to update XP")
        console.error("XP update failed", err)
      }
    })
  }

  const onChangeAmount = (value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) {
      setAmount(0)
      return
    }
    setAmount(Math.max(0, parsed))
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <div>
          <Label htmlFor="xp-amount">XP amount</Label>
          <Input
            id="xp-amount"
            type="number"
            min={0}
            value={amount}
            onChange={(event) => onChangeAmount(event.target.value)}
            placeholder="50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Current XP: {currentXp.toLocaleString()}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            type="button"
            className="w-full"
            onClick={() => updateXp(amount)}
            disabled={isPending || amount <= 0}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add XP
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => updateXp(-amount)}
            disabled={isPending || amount <= 0}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Remove XP
          </Button>
        </div>
      </div>
    </div>
  )
}
