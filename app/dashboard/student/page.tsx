import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, TrendingUp, Calendar, FileText, Medal, CheckCircle2, Megaphone, Activity } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Please log in to view your dashboard.</div>
  }

  // Fetch all required data in parallel
  const [
    profileRes,
    studentsRes,
    assignmentsRes,
    announcementsRes,
    resourcesRes,
    quizRes
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('profiles').select('id, xp').eq('role', 'student').order('xp', { ascending: false }),
    supabase.from('assignments').select('*, submissions(*)').order('due_date', { ascending: true }).limit(5),
    supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('resources').select('*').order('created_at', { ascending: false }).limit(3),
    supabase.from('quiz_submissions').select('*, quizzes(title)').eq('student_id', user.id).order('submitted_at', { ascending: false }).limit(3)
  ])

  const profile = profileRes.data
  const allStudents = studentsRes.data || []
  const rankIndex = allStudents.findIndex(s => s.id === user.id)
  const rank = rankIndex !== -1 ? rankIndex + 1 : 0
  const topPercent = allStudents.length > 0 ? Math.round((rank / allStudents.length) * 100) : 0
  
  const assignments = assignmentsRes.data || []
  const announcements = announcementsRes.data || []
  const resources = resourcesRes.data || []
  const quizResults = quizRes.data || []

  // Calculate average quiz score
  const totalQuizScore = quizResults.reduce((acc, q) => acc + (q.score || 0), 0)
  const avgQuizScore = quizResults.length > 0 ? Math.round(totalQuizScore / quizResults.length) : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening in your class today.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800/50 p-2 rounded-lg">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col pr-4">
            <span className="text-sm font-bold capitalize">{profile?.role || 'Student'}</span>
            <span className="text-xs text-muted-foreground">{(profile?.xp || 0).toLocaleString()} XP Total</span>
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
            <div className="text-2xl font-bold">{rank > 0 ? `${rank}${['st','nd','rd'][((rank+90)%100-10)%10-1]||'th'} Place` : 'Unranked'}</div>
            <p className="text-xs text-primary-foreground/70 mt-1">Top {topPercent}% of class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience (XP)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(profile?.xp || 0).toLocaleString()}</div>
            <Progress value={((profile?.xp || 0) % 1000) / 10} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{1000 - ((profile?.xp || 0) % 1000)} XP to next level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stars Earned</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.stars || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">From excellent performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Average</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgQuizScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on {quizResults.length} recent quizzes</p>
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
            {assignments.length > 0 ? assignments.map(assignment => {
              const mySub = assignment.submissions?.find((s: any) => s.student_id === user.id)
              const statusText = mySub ? (mySub.status === 'graded' ? 'Graded' : 'Pending Review') : 'Not Started'
              const statusColor = mySub ? (mySub.status === 'graded' ? 'text-success border-success' : 'text-warning border-warning') : 'text-muted-foreground border-muted'
              
              return (
                <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-9 w-9 p-2 bg-primary/10 text-primary rounded-md" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {new Date(assignment.due_date).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {mySub ? (
                      <Badge variant="outline" className={statusColor}>{statusText}</Badge>
                    ) : (
                      <Link href={`/dashboard/assignments/${assignment.id}`}>
                        <Button size="sm">Start</Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            }) : (
              <div className="text-sm text-muted-foreground py-4 text-center">No upcoming assignments.</div>
            )}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Latest updates from instructor.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.length > 0 ? announcements.map(announcement => (
              <div key={announcement.id} className="flex gap-3">
                <Megaphone className={`h-5 w-5 mt-0.5 ${announcement.type === 'info' ? 'text-primary' : announcement.type === 'warning' ? 'text-warning' : 'text-success'}`} />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{announcement.title}</p>
                  <p className="text-xs text-muted-foreground">{announcement.content}</p>
                  <p className="text-[10px] text-muted-foreground pt-1">{new Date(announcement.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No announcements yet.</div>
            )}
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
            {resources.length > 0 ? resources.map(resource => (
              <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 p-1.5 bg-blue-500/10 text-blue-500 rounded-md" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{resource.title}</p>
                    <p className="text-xs text-muted-foreground uppercase">{resource.resource_type}</p>
                  </div>
                </div>
                {resource.file_url && resource.file_url !== '#' && (
                  <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="ghost" size="sm">Download</Button>
                  </a>
                )}
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No resources available.</div>
            )}
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
            {quizResults.length > 0 ? quizResults.map(result => (
              <div key={result.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-8 w-8 p-1.5 rounded-md ${(result.score || 0) >= 70 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`} />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{result.quizzes?.title || 'Quiz'}</p>
                    <p className="text-xs text-muted-foreground">Completed: {new Date(result.submitted_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`text-xl font-bold ${(result.score || 0) >= 70 ? 'text-success' : 'text-warning'}`}>{result.score}%</div>
              </div>
            )) : (
              <div className="text-sm text-muted-foreground text-center py-4">No recent quiz results.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
