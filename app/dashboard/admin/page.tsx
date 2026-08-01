"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, TrendingUp, Bell, Calendar, Trophy, ChevronRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Simple mock components for Recharts since full charts are verbose
function MockChart({ title, height = "h-48" }: { title: string, height?: string }) {
  return (
    <div className={`w-full ${height} bg-zinc-100 dark:bg-zinc-900/50 rounded-md flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800`}>
      <span className="text-zinc-400 font-medium text-sm">{title} Chart Area</span>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
        <Button>Create Assignment</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">2 due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Needs grading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Quiz Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last quiz</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Charts Area */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Student participation and assignment submissions over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <MockChart title="Activity" height="h-[300px]" />
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Assignments due in the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg border bg-card">
              <Calendar className="h-9 w-9 p-2 mr-4 bg-primary/10 text-primary rounded-md" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">React Hooks Project</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 11:59 PM</p>
              </div>
              <div className="text-sm font-medium">24/32</div>
            </div>
            <div className="flex items-center p-3 rounded-lg border bg-card">
              <Calendar className="h-9 w-9 p-2 mr-4 bg-primary/10 text-primary rounded-md" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">JavaScript Quiz 3</p>
                <p className="text-sm text-muted-foreground">Friday, 10:00 AM</p>
              </div>
              <div className="text-sm font-medium">10/32</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {/* Recent Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest assignments submitted by students.</CardDescription>
            </div>
            <Link href="/dashboard/assignments" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      Jane Doe
                    </div>
                  </TableCell>
                  <TableCell>React Hooks</TableCell>
                  <TableCell><Badge variant="secondary">Needs Grading</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Grade</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      Alex Smith
                    </div>
                  </TableCell>
                  <TableCell>CSS Grid Layout</TableCell>
                  <TableCell><Badge variant="outline" className="text-success border-success">Graded (95)</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Leaderboard Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Current leaderboard standings.</CardDescription>
            </div>
            <Link href="/dashboard/leaderboard" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Full Leaderboard
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-xs">1</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>EM</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Emma Watson</span>
                    <span className="text-xs text-muted-foreground">Level 12 • 2,450 XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">14</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-300/50 text-zinc-600 dark:text-zinc-400 font-bold text-xs">2</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Michael Johnson</span>
                    <span className="text-xs text-muted-foreground">Level 11 • 2,210 XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-700 dark:text-amber-500 font-bold text-xs">3</div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Sarah Jenkins</span>
                    <span className="text-xs text-muted-foreground">Level 11 • 2,150 XP</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">10</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
