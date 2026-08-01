import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Award, BookOpen, Clock, Shield, Target, Trophy, Users } from "lucide-react"

// Mock Data
const stats = [
  {
    title: "Global Rank",
    value: "#42",
    description: "Top 5% of all students",
    icon: Trophy,
    trend: "+3 positions this week"
  },
  {
    title: "Total Points",
    value: "2,450",
    description: "Across 12 modules",
    icon: Award,
    trend: "+150 since last login"
  },
  {
    title: "Active Modules",
    value: "3",
    description: "2 assignments pending",
    icon: BookOpen,
    trend: "1 due tomorrow"
  },
  {
    title: "Hours Logged",
    value: "128h",
    description: "In cyber range",
    icon: Clock,
    trend: "+12h this week"
  }
]

const recentActivity = [
  { id: 1, action: "Completed Module", target: "Network Reconnaissance", time: "2 hours ago", points: "+50", type: "success" },
  { id: 2, action: "Submitted Report", target: "Vulnerability Assessment", time: "5 hours ago", points: "Pending", type: "neutral" },
  { id: 3, action: "Earned Badge", target: "First Blood (Web Auth)", time: "1 day ago", points: "+100", type: "success" },
  { id: 4, action: "Started Lab", target: "Privilege Escalation (Linux)", time: "2 days ago", points: "-", type: "neutral" },
]

const leaderboard = [
  { rank: 1, name: "Alice Smith", handle: "zer0day", points: 3100, avatar: "/avatars/01.png" },
  { rank: 2, name: "Bob Jones", handle: "cyber_ninja", points: 2950, avatar: "/avatars/02.png" },
  { rank: 3, name: "Charlie Brown", handle: "scriptkiddie", points: 2800, avatar: "/avatars/03.png" },
  { rank: 4, name: "Diana Prince", handle: "amazon_sec", points: 2650, avatar: "/avatars/04.png" },
  { rank: 5, name: "You", handle: "student_hacker", points: 2450, avatar: "/avatars/05.png", isCurrentUser: true },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          {/* We can add a date picker or download report button here later */}
        </div>
      </div>

      {/* KPI Stats */}
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
        {/* Main Progress & Activity Area */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest actions in the cyber range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mini Leaderboard / Status */}
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
                  <TableHead className="text-right">Points</TableHead>
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
                          <AvatarFallback>{user.handle.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium leading-none">{user.handle}</span>
                          {user.isCurrentUser && <span className="text-[10px] text-muted-foreground">You</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{user.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Current Path: Penetration Tester</CardTitle>
          <CardDescription>
            You are 65% through the core curriculum.
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
