import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileText, Users, CheckCircle, Clock, BarChart3 } from "lucide-react"
import Link from "next/link"
import { SubmissionsFilter } from "./submissions-filter"

export default async function SubmissionsOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ assignment?: string }>
}) {
  const supabase = await createClient()
  const resolvedParams = await searchParams

  // Auth + admin guard
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") redirect("/dashboard")

  // Fetch all assignments for the filter dropdown
  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, title")
    .order("due_date", { ascending: false })

  // Build submissions query — filter by assignment if selected
  let submissionsQuery = supabase
    .from("submissions")
    .select(
      `
      id,
      submitted_at,
      status,
      score,
      file_url,
      assignment_id,
      student_id,
      profiles (full_name, email),
      assignments (title, due_date)
    `
    )
    .order("submitted_at", { ascending: false })

  if (resolvedParams.assignment) {
    submissionsQuery = submissionsQuery.eq("assignment_id", resolvedParams.assignment)
  }

  const { data: submissions } = await submissionsQuery

  // Stats
  const total = submissions?.length || 0
  const graded = submissions?.filter((s) => s.status === "graded").length || 0
  const pending = submissions?.filter((s) => s.status === "pending").length || 0
  const uniqueStudents = new Set(submissions?.map((s) => s.student_id)).size

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignment Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review and download all student submitted files.
          </p>
        </div>
        <Link href="/dashboard/assignments">
          <Button variant="outline" size="sm">
            ← Back to Assignments
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                <FileText className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-xs text-muted-foreground">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueStudents}</p>
                <p className="text-xs text-muted-foreground">Unique Students</p>
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
                <p className="text-2xl font-bold">{graded}</p>
                <p className="text-xs text-muted-foreground">Graded</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pending}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-4">
          <div>
            <CardTitle>Submitted Assignments</CardTitle>
            <CardDescription>
              {resolvedParams.assignment
                ? `Filtered by: ${assignments?.find((a) => a.id === resolvedParams.assignment)?.title || "Selected assignment"}`
                : "All student submissions across every assignment."}
            </CardDescription>
          </div>
          <SubmissionsFilter
            assignments={assignments || []}
            currentAssignment={resolvedParams.assignment}
          />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right pr-6">File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length > 0 ? (
                submissions.map((sub) => {
                  const profile = sub.profiles as any
                  const assignment = sub.assignments as any
                  const initials = profile?.full_name
                    ? profile.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "ST"

                  return (
                    <TableRow key={sub.id}>
                      {/* Student */}
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-violet-500/10 text-violet-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {profile?.full_name || "Unknown Student"}
                            </p>
                            {profile?.email && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {profile.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Assignment */}
                      <TableCell>
                        <Link
                          href={`/dashboard/assignments/${sub.assignment_id}`}
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {assignment?.title || "—"}
                        </Link>
                      </TableCell>

                      {/* Submitted At */}
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sub.submitted_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        {sub.status === "graded" ? (
                          <Badge
                            variant="default"
                            className="bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                          >
                            Graded
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20"
                          >
                            Pending
                          </Badge>
                        )}
                      </TableCell>

                      {/* Score */}
                      <TableCell className="text-sm">
                        {sub.score !== null ? (
                          <span className="font-medium">{sub.score} / 100</span>
                        ) : (
                          <span className="text-muted-foreground">— / 100</span>
                        )}
                      </TableCell>

                      {/* Download */}
                      <TableCell className="text-right pr-6">
                        {sub.file_url && sub.file_url !== "#" ? (
                          <a
                            href={sub.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Button variant="outline" size="sm" className="gap-2 h-8">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </a>
                        ) : (
                          <Button variant="ghost" size="sm" disabled className="gap-2 h-8">
                            <Download className="h-3.5 w-3.5" />
                            No File
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-14 text-muted-foreground"
                  >
                    <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No submissions found</p>
                    <p className="text-sm mt-1">
                      {resolvedParams.assignment
                        ? "No students have submitted this assignment yet."
                        : "No students have submitted any assignments yet."}
                    </p>
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
