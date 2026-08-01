import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Award, BookOpen, Clock, Shield, Target, Trophy, Users } from "lucide-react"
import { createClient } from "@/utils/supabase/server"

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  // Fetch current user profile
  let profile = null;
  if (userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    profile = data
  }

  // Fetch leaderboard
  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('xp', { ascending: false })
    
  const students = studentsData || []
  const leaderboard = students.slice(0, 5).map((s, index) => ({
    rank: index + 1,
    ...s,
    isCurrentUser: s.id === userId
  }))

  // Calculate current user rank
  const myRank = students.findIndex(s => s.id === userId) + 1

  // Fetch recent submissions (as activity)
  const { data: submissionsData } = await supabase
    .from('submissions')
    .select(`
      id,
      status,
      score,
      submitted_at,
      assignments ( title )
    `)
    .eq('student_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(5)

  const recentActivity = (submissionsData || []).map((sub: any) => ({
    id: sub.id,
    action: sub.status === 'graded' ? "Graded Submission" : "Submitted Module",
    target: sub.assignments?.title || "Unknown Assignment",
    time: new Date(sub.submitted_at).toLocaleDateString(),
    points: sub.score ? `+${sub.score}` : (sub.status === 'pending' ? 'Pending' : '-'),
    type: sub.status === 'graded' ? 'success' : 'neutral'
  }))

  const stats = [
    {
      title: "Global Rank",
      value: myRank > 0 ? `#${myRank}` : "N/A",
      description: "Based on total XP",
      icon: Trophy,
      trend: "Keep going!"
    },
    {
      title: "Total Points",
      value: profile ? profile.xp.toLocaleString() : "0",
      description: "Across all modules",
      icon: Award,
      trend: "Earn more XP"
    },
    {
      title: "Active Modules",
      value: "-",
      description: "Work in progress",
      icon: BookOpen,
      trend: ""
    },
    {
      title: "Hours Logged",
      value: "-",
      description: "In cyber range",
      icon: Clock,
      trend: ""
    }
  ]

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <p className="text-[10px] font-medium text-emerald-500 mt-1">
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions in the cyber range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    {activity.type === 'success' ? <Award className="h-4 w-4 text-emerald-500" /> : <Activity className="h-4 w-4" />}
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.target}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground text-xs">{activity.time}</span>
                    <Badge variant={activity.type === 'success' ? 'default' : 'secondary'}>
                      {activity.points}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground">No recent activity.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Operatives</CardTitle>
            <CardDescription>
              Current standings in the cohort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Operative</TableHead>
                  <TableHead className="text-right">XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((user) => (
                  <TableRow key={user.rank} className={user.isCurrentUser ? "bg-muted/50" : ""}>
                    <TableCell className="font-medium">
                      #{user.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{user.full_name || "Unknown"}</span>
                          {user.isCurrentUser && <span className="text-[10px] text-muted-foreground">You</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{(user.xp || 0).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Path: Penetration Tester</CardTitle>
          <CardDescription>
            Core curriculum progress.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2"><Target className="h-4 w-4" /> Web Application Security</span>
              <span className="text-muted-foreground">80%</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2"><Shield className="h-4 w-4" /> Network Penetration</span>
              <span className="text-muted-foreground">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium flex items-center gap-2"><Users className="h-4 w-4" /> Social Engineering</span>
              <span className="text-muted-foreground">0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
