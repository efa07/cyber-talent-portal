import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, BookOpen, Zap, Clock, CheckCircle2, ArrowRight, Target, ShieldCheck, Flame, Sparkles } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/dashboard/animated-components"

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  // Fetch current user profile
  let profile = null
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

  const myRank = students.findIndex(s => s.id === userId) + 1

  // Fetch pending assignments count
  const now = new Date().toISOString()
  const { count: pendingAssignmentsCount } = await supabase
    .from('assignments')
    .select('*', { count: 'exact', head: true })
    .gt('due_date', now)

  // Fetch recent submissions
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
    action: sub.status === 'graded' ? "Assignment Graded" : "Assignment Submitted",
    target: sub.assignments?.title || "Security Challenge",
    time: new Date(sub.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " • " + new Date(sub.submitted_at).toLocaleDateString(),
    points: sub.score ? `+${sub.score} XP` : (sub.status === 'pending' ? 'Pending' : '-'),
    isGraded: sub.status === 'graded'
  }))

  const userXp = profile?.xp || 0
  const userStars = profile?.stars || 0
  const userLevel = Math.max(1, Math.floor(userXp / 500) + 1)
  const xpCurrentLevel = userXp % 500
  const xpProgressPercent = Math.min(100, Math.round((xpCurrentLevel / 500) * 100))

  const statCards = [
    {
      title: "Total XP",
      value: userXp.toLocaleString(),
      description: "+12% this week",
      icon: Zap,
      badge: "+12%",
      badgeColor: "bg-[#10B981]/10 text-[#10B981]"
    },
    {
      title: "Class Rank",
      value: myRank > 0 ? `#${myRank}` : "N/A",
      description: `Out of ${students.length} operatives`,
      icon: Trophy,
      badge: "Rank",
      badgeColor: "bg-[#684DF4]/10 text-[#684DF4]"
    },
    {
      title: "Stars Earned",
      value: userStars.toString(),
      description: "Achievement rewards",
      icon: Star,
      badge: "Rewards",
      badgeColor: "bg-[#F59E0B]/10 text-[#F59E0B]"
    },
    {
      title: "Active Modules",
      value: (pendingAssignmentsCount || 0).toString(),
      description: "Work in progress",
      icon: BookOpen,
      badge: "Active",
      badgeColor: "bg-[#8B5CF6]/10 text-[#8B5CF6]"
    }
  ]

  const rankMedals = ["🥇", "🥈", "🥉"]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <FadeUp delay={0.05}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#684DF4] via-[#7C3AED] to-[#8B5CF6] opacity-95 text-white p-6 sm:p-8 shadow-md">
          {/* Decorative Grid Pattern & Floating Blurred Circles */}
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
            {/* Left Content */}
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                Cybersecurity Pathway
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome back 👋
              </h2>
              <p className="text-sm text-purple-100/90 leading-relaxed">
                Continue your cybersecurity journey. You have <span className="font-semibold text-white">{pendingAssignmentsCount || 0} pending assignments</span> ready for completion.
              </p>
            </div>

            {/* Right Content — Quick Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 min-w-[260px] space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-purple-200" />
                  Level {userLevel}
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-300" />
                  {userStars} Stars
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white tracking-tight">{userXp.toLocaleString()} <span className="text-xs font-normal text-purple-200">XP</span></span>
                <span className="text-[11px] text-purple-200">{xpCurrentLevel}/500 XP to Lvl {userLevel + 1}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${xpProgressPercent}%` }} />
                </div>
              </div>
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

      {/* Main Grid: Activity Timeline + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

        {/* Recent Activity Timeline */}
        <FadeUp delay={0.2} className="lg:col-span-4">
          <Card className="rounded-2xl border-[#ECECF3] bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-[#ECECF3]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#111827]">Recent Activity</CardTitle>
                  <CardDescription className="text-xs text-[#6B7280] mt-0.5">Your learning timeline in the cyber range</CardDescription>
                </div>
                <Link 
                  href="/dashboard/assignments" 
                  className="text-xs font-semibold text-[#684DF4] hover:text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-6 flex-1 flex flex-col justify-between">
              {recentActivity.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-[#ECECF3]">
                  {recentActivity.map((act) => (
                    <div key={act.id} className="relative flex items-start justify-between gap-4 group">
                      {/* Timeline Dot Icon */}
                      <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F3FF] text-[#684DF4] ring-4 ring-white">
                        {act.isGraded ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-[#684DF4]" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#111827]">{act.action}</p>
                          <Badge variant="outline" className="text-[10px] py-0 px-2 border-[#ECECF3] text-[#6B7280]">
                            {act.points}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#6B7280] font-medium">{act.target}</p>
                        <p className="text-[11px] text-[#6B7280]/70">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-10 text-center my-auto">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F3FF] text-[#684DF4] mb-3 text-2xl">
                    🎯
                  </div>
                  <h4 className="text-sm font-bold text-[#111827]">You&apos;re all caught up!</h4>
                  <p className="text-xs text-[#6B7280] max-w-xs mt-1">Complete a quiz or submit an assignment to earn XP and climb the leaderboard.</p>
                  <Link href="/dashboard/quizzes" className="mt-4">
                    <button className="h-9 px-4 rounded-xl bg-[#684DF4] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer">
                      Start a Quiz
                    </button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        {/* Leaderboard Preview */}
        <FadeUp delay={0.25} className="lg:col-span-3">
          <Card className="rounded-2xl border-[#ECECF3] bg-white shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-[#ECECF3]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-[#111827]">Leaderboard</CardTitle>
                  <CardDescription className="text-xs text-[#6B7280] mt-0.5">Top performing cyber operatives</CardDescription>
                </div>
                <Link 
                  href="/dashboard/leaderboard" 
                  className="text-xs font-semibold text-[#684DF4] hover:text-[#7C3AED] hover:underline flex items-center gap-1 transition-colors"
                >
                  Full list <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-4 flex-1">
              <div className="space-y-2.5">
                {leaderboard.map((student, i) => (
                  <div 
                    key={student.id} 
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200 ${
                      student.isCurrentUser
                      ? "bg-[#F5F3FF] border-[#684DF4]/30 shadow-xs"
                      : "border-transparent hover:bg-[#FAFBFC] hover:border-[#ECECF3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Medal / Rank */}
                      <div className="w-6 text-center text-sm font-bold">
                        {i < 3 ? (
                          <span>{rankMedals[i]}</span>
                        ) : (
                          <span className="text-xs text-[#6B7280]">#{student.rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <Avatar className="h-9 w-9 border border-[#ECECF3]">
                        <AvatarFallback className="bg-[#F5F3FF] text-[#684DF4] text-xs font-bold">
                          {getInitials(student.full_name)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Name & Badge */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111827]">{student.full_name || "Unknown"}</span>
                          {student.isCurrentUser && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#684DF4] text-white">You</span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-[#6B7280]">Level {Math.max(1, Math.floor((student.xp || 0) / 500) + 1)}</span>
                      </div>
                    </div>

                    {/* XP & Stars */}
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xs font-extrabold text-[#684DF4]">{(student.xp || 0).toLocaleString()} <span className="text-[10px] font-normal text-[#6B7280]">XP</span></span>
                      <div className="flex items-center gap-1 text-[10px] text-[#F59E0B] font-medium">
                        <Star className="h-3 w-3 fill-[#F59E0B]" />
                        <span>{student.stars || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

      </div>
    </div>
  )
}
