import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CheckCircle2, TrendingUp, Calendar, Trophy, ArrowRight, PlusCircle, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/dashboard/animated-components"

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
    .limit(4)

  const statCards = [
    {
      title: "Total Students",
      value: (studentCount || 0).toString(),
      description: "Registered in system",
      icon: Users,
      badge: "Active",
      badgeColor: "bg-[#684DF4]/10 text-[#684DF4]"
    },
    {
      title: "Active Assignments",
      value: (activeAssignmentsCount || 0).toString(),
      description: "Currently open",
      icon: FileText,
      badge: "Open",
      badgeColor: "bg-[#8B5CF6]/10 text-[#8B5CF6]"
    },
    {
      title: "Pending Submissions",
      value: (pendingSubmissionsCount || 0).toString(),
      description: "Needs grading",
      icon: CheckCircle2,
      badge: pendingSubmissionsCount ? "Action Required" : "Up to date",
      badgeColor: pendingSubmissionsCount ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#10B981]/10 text-[#10B981]"
    },
    {
      title: "Avg. Assignment Score",
      value: `${avgScore}%`,
      description: "Across all graded",
      icon: TrendingUp,
      badge: "Overall",
      badgeColor: "bg-[#10B981]/10 text-[#10B981]"
    }
  ]

  const rankMedals = ["🥇", "🥈", "🥉"]

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <FadeUp delay={0.05}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#684DF4] via-[#7C3AED] to-[#8B5CF6] opacity-95 text-white p-6 sm:p-8 shadow-md">
          {/* Decorative Pattern */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
              backgroundSize: `20px 20px`
            }}
          />
          <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-300/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                Instructor Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Instructor Dashboard 👋
              </h2>
              <p className="text-sm text-purple-100/90 leading-relaxed">
                Manage your cybersecurity class, review student submissions, and build assignments.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/assignments">
                <button className="h-10 px-4 rounded-xl bg-white hover:bg-purple-50 text-[#684DF4] text-xs font-bold transition-all hover:scale-[1.02] shadow-sm flex items-center gap-2 cursor-pointer">
                  <PlusCircle className="h-4 w-4 text-[#684DF4]" />
                  Create Assignment
                </button>
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Statistic Cards */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <StaggerItem key={i}>
            <div className="group rounded-2xl border border-[#ECECF3] bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F3FF] text-[#684DF4] group-hover:bg-[#684DF4] group-hover:text-white transition-colors duration-200">
                  <card.icon className="h-5 w-5" />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-xs font-medium text-[#6B7280]">{card.title}</span>
                <div className="text-4xl font-bold tracking-tight text-[#111827] mt-1">{card.value}</div>
              </div>

              <div className="mt-3 text-xs text-[#6B7280] font-medium flex items-center gap-1">
                {card.description}
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Grid: Recent Submissions + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

        {/* Recent Submissions */}
        <FadeUp delay={0.2} className="lg:col-span-4">
          <Card className="rounded-2xl border-[#ECECF3] bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-[#ECECF3]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#111827]">Recent Submissions</CardTitle>
                  <CardDescription className="text-xs text-[#6B7280] mt-0.5">Latest assignments submitted by students</CardDescription>
                </div>
                <Link 
                  href="/dashboard/assignments" 
                  className="text-xs font-semibold text-[#684DF4] hover:text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-4 flex-1">
              {recentSubmissions && recentSubmissions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#ECECF3]">
                      <TableHead className="text-xs font-medium text-[#6B7280]">Student</TableHead>
                      <TableHead className="text-xs font-medium text-[#6B7280]">Assignment</TableHead>
                      <TableHead className="text-xs font-medium text-[#6B7280]">Status</TableHead>
                      <TableHead className="text-xs font-medium text-[#6B7280] text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSubmissions.map((sub: any) => {
                      const studentProfile = sub.profiles
                      const assignment = sub.assignments
                      const studentName = studentProfile?.full_name || "Unknown Student"
                      const assignmentTitle = assignment?.title || "Unknown Assignment"

                      return (
                        <TableRow key={sub.id} className="border-[#ECECF3] hover:bg-[#FAFBFC]">
                          <TableCell className="font-medium text-xs">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 border border-[#ECECF3]">
                                <AvatarFallback className="bg-[#F5F3FF] text-[#684DF4] text-[10px] font-bold">
                                  {getInitials(studentName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-[#111827] font-semibold">{studentName}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-[#6B7280] max-w-[140px] truncate" title={assignmentTitle}>
                            {assignmentTitle}
                          </TableCell>
                          <TableCell>
                            {sub.status === 'pending' ? (
                              <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20 text-[10px] py-0.5 px-2">
                                Needs Grading
                              </Badge>
                            ) : (
                              <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 text-[10px] py-0.5 px-2">
                                Graded
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-[#111827]">
                            {sub.score !== null ? `${sub.score}` : '-'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center my-auto">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F3FF] text-[#684DF4] mb-2 text-xl">
                    📁
                  </div>
                  <p className="text-xs font-semibold text-[#111827]">No recent submissions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        {/* Top Performers Leaderboard */}
        <FadeUp delay={0.25} className="lg:col-span-3">
          <Card className="rounded-2xl border-[#ECECF3] bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-[#ECECF3]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#111827]">Top Performers</CardTitle>
                  <CardDescription className="text-xs text-[#6B7280] mt-0.5">Current leaderboard standings</CardDescription>
                </div>
                <Link 
                  href="/dashboard/leaderboard" 
                  className="text-xs font-semibold text-[#684DF4] hover:text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  Full Leaderboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-4 flex-1">
              <div className="space-y-2.5">
                {topPerformers && topPerformers.length > 0 ? (
                  topPerformers.map((student, i) => (
                    <div 
                      key={student.id} 
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                        i === 0 
                        ? "bg-[#F5F3FF] border-[#684DF4]/30" 
                        : "border-transparent hover:bg-[#FAFBFC] hover:border-[#ECECF3]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-sm font-bold">
                          {i < 3 ? rankMedals[i] : `#${i + 1}`}
                        </div>

                        <Avatar className="h-8 w-8 border border-[#ECECF3]">
                          <AvatarFallback className="bg-[#F5F3FF] text-[#684DF4] text-xs font-bold">
                            {getInitials(student.full_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#111827]">{student.full_name || "Unknown"}</span>
                          <span className="text-[10px] font-medium text-[#6B7280]">{student.xp || 0} XP</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-[#F59E0B] font-bold">
                        <Star className="h-3.5 w-3.5 fill-[#F59E0B]" />
                        <span>{student.stars || 0}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#6B7280] text-center py-6">No students found</div>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

      </div>
    </div>
  )
}
