import { createAdminClient, createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Layers, Users, Zap, TrendingUp, CheckCircle } from "lucide-react"
import { ProgressDialog } from "./progress-dialog"
import { EnrollMissingStudents } from "./enroll-missing"

function getInitials(name: string) {
  if (!name) return "ST"
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const role = profile?.role || "student"
  const supabaseAdmin = createAdminClient()

  // Fetch project
  const { data: project } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (!project) redirect("/dashboard/projects")

  // ── Admin view ──
  if (role === "admin") {
    const { data: enrollments } = await supabaseAdmin
      .from("project_enrollments")
      .select(`
        *,
        profiles (id, full_name, xp)
      `)
      .eq("project_id", id)
      .order("progress", { ascending: false })

    // Find students not yet enrolled
    const { data: allStudents } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name")
      .eq("role", "student")

    const enrolledIds = new Set((enrollments || []).map((e: any) => e.student_id))
    const unenrolledStudents = (allStudents || []).filter((s: any) => !enrolledIds.has(s.id))

    const totalStudents = (enrollments || []).length
    const avgProgress =
      totalStudents > 0
        ? Math.round((enrollments || []).reduce((s: number, e: any) => s + e.progress, 0) / totalStudents)
        : 0
    const totalXpAwarded = (enrollments || []).reduce((s: number, e: any) => s + (e.xp_awarded || 0), 0)
    const completed = (enrollments || []).filter((e: any) => e.progress === 100).length

    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/dashboard/projects">
              <Button variant="ghost" size="icon" className="shrink-0 mt-1">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">{project.max_xp} XP max</Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">{project.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            {unenrolledStudents.length > 0 && (
              <EnrollMissingStudents
                projectId={id}
                students={unenrolledStudents}
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                  <Users className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgProgress}%</p>
                  <p className="text-xs text-muted-foreground">Avg Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalXpAwarded}</p>
                  <p className="text-xs text-muted-foreground">XP Awarded</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completed}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Progress Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>
              Update each student&apos;s progress to award XP. XP scales with progress percentage.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Student</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>XP Awarded</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments && enrollments.length > 0 ? (
                  enrollments.map((enrollment: any) => {
                    const student = enrollment.profiles
                    return (
                      <TableRow key={enrollment.id}>
                        {/* Student */}
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs bg-violet-500/10 text-violet-600">
                                {getInitials(student?.full_name || "")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{student?.full_name || "Unknown"}</span>
                          </div>
                        </TableCell>

                        {/* Progress Bar */}
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <Progress value={enrollment.progress} className="h-2 flex-1" />
                            <span className="text-sm font-semibold w-10 text-right">
                              {enrollment.progress}%
                            </span>
                          </div>
                        </TableCell>

                        {/* XP */}
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                            <span className="font-medium">{enrollment.xp_awarded}</span>
                            <span className="text-muted-foreground">/ {project.max_xp}</span>
                          </div>
                        </TableCell>

                        {/* Notes */}
                        <TableCell>
                          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[160px]">
                            {enrollment.notes || "—"}
                          </span>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="text-right pr-6">
                          <ProgressDialog
                            enrollmentId={enrollment.id}
                            studentId={enrollment.student_id}
                            projectId={id}
                            studentName={student?.full_name || "Student"}
                            currentProgress={enrollment.progress}
                            currentXpAwarded={enrollment.xp_awarded}
                            currentNotes={enrollment.notes || ""}
                            maxXp={project.max_xp}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-14 text-muted-foreground">
                      <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">No students enrolled</p>
                      <p className="text-sm mt-1">Enroll students to start tracking progress.</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Student view ──
  const { data: enrollment } = await supabaseAdmin
    .from("project_enrollments")
    .select("*")
    .eq("project_id", id)
    .eq("student_id", user.id)
    .maybeSingle()

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start gap-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <Badge variant="secondary" className="mb-1">{project.max_xp} XP max</Badge>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      {enrollment ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-bold text-2xl text-violet-600">{enrollment.progress}%</span>
                </div>
                <Progress value={enrollment.progress} className="h-3 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-violet-500/5 border-violet-500/10 p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                    <Zap className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold">{enrollment.xp_awarded}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">XP Earned</p>
                </div>
                <div className="rounded-xl border bg-muted/40 p-4 text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Layers className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold">{project.max_xp}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Max XP</p>
                </div>
              </div>

              {enrollment.notes && (
                <div className="rounded-xl border bg-muted/40 p-4">
                  <p className="text-sm font-semibold mb-1">Instructor Feedback</p>
                  <p className="text-sm text-muted-foreground">{enrollment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-14 text-center text-muted-foreground">
            <Layers className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p>You are not enrolled in this project yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
