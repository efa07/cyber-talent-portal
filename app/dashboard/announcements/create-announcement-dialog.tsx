"use client"

import { Button } from "@/components/ui/button"
import { Megaphone, Loader2 } from "lucide-react"
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
import { createAnnouncement } from "@/app/actions"
import { useState, useTransition } from "react"

export function CreateAnnouncementDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await createAnnouncement(formData)
        setOpen(false)
      } catch (e) {
        console.error(e)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2">
            <Megaphone className="h-4 w-4" />
            New Announcement
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Post a new announcement to the class. It will appear at the top of the feed.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="e.g., Hackathon this weekend!" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required placeholder="Type your announcement here..." className="min-h-[140px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
