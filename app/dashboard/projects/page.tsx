import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Layers, Users, Zap, ChevronRight, ArrowRight } from "lucide-react"
import { CreateProjectDialog } from "./create-project-dialog"

function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role || "student"
  const supabaseAdmin = getAdminClient()

  if (role === "admin") {
    // Admin: fetch all projects with enrollment stats
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select(`
        *,
        project_enrollments (
          id,
          progress,
          xp_awarded
        )
      `)
      .order("created_at", { ascending: false })

    const enriched = (projects || []).map((p: any) => {
      const enrollments = p.project_enrollments || []
      const studentCount = enrollments.length
      const avgProgress =
        studentCount > 0
          ? Math.round(enrollments.reduce((s: number, e: any) => s + e.progress, 0) / studentCount)
          : 0
      const totalXpAwarded = enrollments.reduce((s: number, e: any) => s + (e.xp_awarded || 0), 0)
      return { ...p, studentCount, avgProgress, totalXpAwarded }
    })

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Create and track student project progress.
            </p>
          </div>
          <CreateProjectDialog />
        </div>

        {enriched.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-6">
              Create your first project and enroll students.
            </p>
            <CreateProjectDialog />
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {enriched.map((project: any) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group">
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                        <Layers className="h-5 w-5 text-violet-500" />
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {project.max_xp} XP max
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg group-hover:text-primary transition-colors leading-snug">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Avg. Progress</span>
                        <span className="font-medium text-foreground">{project.avgProgress}%</span>
                      </div>
                      <Progress value={project.avgProgress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        <span>{project.studentCount} students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-yellow-500" />
                        <span>{project.totalXpAwarded} XP awarded</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-3 border-t">
                    <span className="text-sm font-medium text-primary flex items-center gap-1 ml-auto">
                      Manage <ChevronRight className="h-4 w-4" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── Student view ──
  const { data: enrollments } = await supabaseAdmin
    .from("project_enrollments")
    .select(`
      *,
      projects (id, title, description, max_xp)
    `)
    .eq("student_id", user.id)
    .order("updated_at", { ascending: false })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        <p className="text-muted-foreground mt-1">Track your project progress and XP earned.</p>
      </div>

      {!enrollments || enrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Layers className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No projects assigned yet</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Your instructor will assign projects soon.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment: any) => {
            const project = enrollment.projects
            const xpEarned = enrollment.xp_awarded || 0
            const xpMax = project?.max_xp || 100
            const progress = enrollment.progress || 0

            return (
              <Card key={enrollment.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                      <Layers className="h-5 w-5 text-violet-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base leading-snug">{project?.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-0.5 text-xs">
                        {project?.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Your Progress</span>
                      <span className="font-semibold text-foreground">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5" />
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-violet-500/5 border border-violet-500/10 px-3 py-2">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-violet-600">
                      <Zap className="h-4 w-4" />
                      XP Earned
                    </div>
                    <span className="font-bold text-violet-600">{xpEarned} / {xpMax}</span>
                  </div>

                  {enrollment.notes && (
                    <div className="rounded-lg bg-muted/50 border px-3 py-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground block mb-1">Instructor Notes</span>
                      {enrollment.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
