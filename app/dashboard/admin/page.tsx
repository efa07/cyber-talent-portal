import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle, TrendingUp, Bell, Calendar, Trophy, ChevronRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

// Simple mock components for Recharts since full charts are verbose
function MockChart({ title, height = "h-48" }: { title: string, height?: string }) {
  return (
    <div className={`w-full ${height} bg-zinc-100 dark:bg-zinc-900/50 rounded-md flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800`}>
      <span className="text-zinc-400 font-medium text-sm">{title} Chart Area</span>
    </div>
  )
}

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const now = new Date().toISOString()

  // 1. Total Students
  const { count: studentCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')

  // 2. Active Assignments
  const { count: activeAssignmentsCount } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .gt('due_date', now)

  // 3. Pending Submissions
  const { count: pendingSubmissionsCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // 4. Avg Score
  const { data: scoresData } = await supabase
    .from('submissions')
    .select('score')
    .not('score', 'is', null)
  
  let avgScore = 0
  if (scoresData && scoresData.length > 0) {
    const sum = scoresData.reduce((acc, curr) => acc + (curr.score || 0), 0)
    avgScore = Math.round(sum / scoresData.length)
  }

  // 5. Upcoming Deadlines
  const { data: upcomingDeadlines } = await supabase
    .from('assignments')
    .select('*')
    .gt('due_date', now)
    .order('due_date', { ascending: true })
    .limit(3)

  // 6. Recent Submissions
  const { data: recentSubmissions } = await supabase
    .from('submissions')
    .select(`
      *,
      profiles:student_id (full_name),
      assignments:assignment_id (title)
    `)
    .order('submitted_at', { ascending: false })
    .limit(5)

  // 7. Top Performers
  const { data: topPerformers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('xp', { ascending: false })
    .limit(3)

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
            <div className="text-2xl font-bold">{studentCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAssignmentsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissionsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Needs grading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Assignment Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Across all graded</p>
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
            <CardDescription>Assignments due in the future.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingDeadlines && upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((assignment) => (
                <div key={assignment.id} className="flex items-center p-3 rounded-lg border bg-card">
                  <Calendar className="h-9 w-9 p-2 mr-4 bg-primary/10 text-primary rounded-md" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(assignment.due_date).toLocaleDateString()} at {new Date(assignment.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-4 text-center">No upcoming deadlines</div>
            )}
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
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions && recentSubmissions.length > 0 ? (
                  recentSubmissions.map((sub) => {
                    // Type assertion since the join returns an array or object depending on schema relations
                    // For a one-to-many from submissions -> profiles, it's a single object
                    const profile = sub.profiles as any
                    const assignment = sub.assignments as any
                    const studentName = profile?.full_name || "Unknown Student"
                    const assignmentTitle = assignment?.title || "Unknown Assignment"
                    
                    return (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{getInitials(studentName)}</AvatarFallback>
                            </Avatar>
                            {studentName}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate" title={assignmentTitle}>
                          {assignmentTitle}
                        </TableCell>
                        <TableCell>
                          {sub.status === 'pending' ? (
                            <Badge variant="secondary">Needs Grading</Badge>
                          ) : (
                            <Badge variant="outline" className="text-success border-success">Graded</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sub.score !== null ? sub.score : '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No recent submissions
                    </TableCell>
                  </TableRow>
                )}
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
              {topPerformers && topPerformers.length > 0 ? (
                topPerformers.map((student, index) => {
                  let rankColors = "bg-zinc-300/50 text-zinc-600 dark:text-zinc-400" // Default for >3
                  if (index === 0) rankColors = "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                  if (index === 1) rankColors = "bg-zinc-300/50 text-zinc-600 dark:text-zinc-400"
                  if (index === 2) rankColors = "bg-amber-700/20 text-amber-700 dark:text-amber-500"
                  
                  return (
                    <div key={student.id} className={`flex items-center justify-between p-2 rounded-lg ${index === 0 ? 'bg-zinc-100 dark:bg-zinc-800/50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${rankColors}`}>
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{student.full_name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground">{student.xp || 0} XP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{student.stars || 0}</span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-muted-foreground text-center p-4">No students on leaderboard</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
