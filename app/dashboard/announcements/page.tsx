"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pin, Megaphone, CalendarClock, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

const announcements = [
  {
    id: 1,
    title: "Hackathon Weekend!",
    content: "Join us this weekend for a 48-hour coding challenge. We will be building a complete full-stack application from scratch. Extra XP for participants! Form your teams by Friday noon.",
    date: "Today, 10:00 AM",
    author: "Instructor John",
    pinned: true,
  },
  {
    id: 2,
    title: "Assignment 3 Grades Posted",
    content: "The grades for the React Hooks Deep Dive assignment have been posted. Please check your submission page for individual feedback. Overall, great job everyone!",
    date: "Yesterday, 2:30 PM",
    author: "Instructor John",
    pinned: false,
  },
  {
    id: 3,
    title: "Upcoming Guest Lecture: CSS Architecture",
    content: "Next Tuesday, we'll have a guest lecture from a senior frontend developer discussing modern CSS architecture and styling strategies at scale. Don't miss it!",
    date: "Oct 28, 2026",
    author: "Instructor John",
    pinned: false,
  },
  {
    id: 4,
    title: "Course Materials Updated",
    content: "I've uploaded new PDFs for the Next.js App Router module in the Resources section. Please review them before Thursday's class.",
    date: "Oct 25, 2026",
    author: "Instructor John",
    pinned: false,
  }
]

export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-4 md:pt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1">Stay updated with the latest news and notices.</p>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button className="gap-2">
              <Megaphone className="h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Post a new announcement to the class. It will appear at the top of the feed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Hackathon this weekend!" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your announcement here..." className="min-h-[140px]" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Post Announcement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative border-l-2 border-muted ml-3 md:ml-6 space-y-8 pb-12">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="relative pl-6 md:pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ${announcement.pinned ? 'bg-primary' : 'bg-muted-foreground'}`}>
              {announcement.pinned ? (
                <Pin className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-background" />
              )}
            </div>

            <Card className={`relative overflow-hidden ${announcement.pinned ? 'border-primary/50 shadow-md shadow-primary/5' : ''}`}>
              {announcement.pinned && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-bl-lg flex items-center gap-1">
                  <Pin className="h-3 w-3 fill-current" /> Pinned
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>{announcement.date}</span>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {announcement.content}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">IJ</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{announcement.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-4 w-4" /> 
                    <span className="text-xs">Comment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
