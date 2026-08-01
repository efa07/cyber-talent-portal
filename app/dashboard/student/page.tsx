"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, TrendingUp, Calendar, FileText, Medal, CheckCircle2, Megaphone } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function StudentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening in your class today.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col pr-4">
            <span className="text-sm font-bold">Level 12 Developer</span>
            <span className="text-xs text-muted-foreground">2,450 XP Total</span>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Current Rank</CardTitle>
            <Trophy className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4th Place</div>
            <p className="text-xs text-primary-foreground/70 mt-1">Top 15% of class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience (XP)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <Progress value={65} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">150 XP to Level 13</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stars Earned</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground mt-1">2 earned this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-success mt-1">+2% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Assignments */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>Your tasks due soon.</CardDescription>
            </div>
            <Link href="/dashboard/assignments" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <Calendar className="h-9 w-9 p-2 bg-primary/10 text-primary rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">React Hooks Project</p>
                  <p className="text-xs text-muted-foreground">Due Tomorrow, 11:59 PM</p>
                </div>
              </div>
              <Badge variant="outline" className="text-warning border-warning">In Progress</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <Calendar className="h-9 w-9 p-2 bg-primary/10 text-primary rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">CSS Grid Layout</p>
                  <p className="text-xs text-muted-foreground">Due Friday, 10:00 AM</p>
                </div>
              </div>
              <Button size="sm">Start</Button>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates from instructor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Megaphone className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Hackathon Weekend!</p>
                <p className="text-xs text-muted-foreground">Join us this weekend for a 48-hour coding challenge. Extra XP for participants!</p>
                <p className="text-[10px] text-muted-foreground pt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Megaphone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Assignment 3 Grades Posted</p>
                <p className="text-xs text-muted-foreground">Check your assignment page for feedback.</p>
                <p className="text-[10px] text-muted-foreground pt-1">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Latest Resources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest Resources</CardTitle>
              <CardDescription>Recently uploaded study materials.</CardDescription>
            </div>
            <Link href="/dashboard/resources" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Browse
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 p-1.5 bg-red-500/10 text-red-500 rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">React Lifecycle Cheatsheet</p>
                  <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 p-1.5 bg-blue-500/10 text-blue-500 rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Next.js App Router Guide</p>
                  <p className="text-xs text-muted-foreground">DOCX • 2.4 MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Quiz Results */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Quiz Results</CardTitle>
              <CardDescription>Your latest quiz performances.</CardDescription>
            </div>
            <Link href="/dashboard/quizzes" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 p-1.5 bg-success/20 text-success rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">JavaScript Basics Quiz</p>
                  <p className="text-xs text-muted-foreground">Completed: Oct 24 • +100 XP</p>
                </div>
              </div>
              <div className="text-xl font-bold text-success">100%</div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 p-1.5 bg-warning/20 text-warning rounded-md" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">CSS Selectors Quiz</p>
                  <p className="text-xs text-muted-foreground">Completed: Oct 20 • +85 XP</p>
                </div>
              </div>
              <div className="text-xl font-bold text-warning">85%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
