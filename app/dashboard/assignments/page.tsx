import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, CheckCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { CreateAssignmentDialog } from "./create-assignment-dialog"

export default async function AssignmentsPage() {
  const supabase = await createClient()

  // Get current user and their DB role
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single()
  const role = profile?.role || 'student'

  // Fetch total students count
  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student')

  // Fetch all assignments with their submission counts
  const { data: assignmentsData } = await supabase
    .from('assignments')
    .select(`
      *,
      submissions (count)
    `)
    .order('due_date', { ascending: true })

  const assignments = (assignmentsData || []).map((assignment: any) => {
    const isPastDue = new Date(assignment.due_date) < new Date()
    const status = isPastDue ? "Completed" : "Active"
    
    // In postgrest, a count join returns an array with one object { count: number }
    const submissionsCount = assignment.submissions[0]?.count || 0

    return {
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: new Date(assignment.due_date).toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      }),
      maxScore: 100, // Hardcoded for now since DB lacks max_score
      submissions: submissionsCount,
      totalStudents: totalStudents || 0,
      status: status,
    }
  })

  return (
    <div className="flex flex-col gap-6 relative min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage class assignments and submissions.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-20">
        {assignments.length > 0 ? assignments.map((assignment) => (
          <Card key={assignment.id} className="flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
            <Link href={`/dashboard/assignments/${assignment.id}`} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={assignment.status === "Active" ? "default" : "secondary"}>
                    {assignment.status}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    {assignment.maxScore} pts
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{assignment.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{assignment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{assignment.submissions} / {assignment.totalStudents} Submitted</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    <FileText className="h-4 w-4" /> View Details
                  </span>
                </div>
              </CardFooter>
            </Link>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No assignments found.
          </div>
        )}
      </div>

      {role === "admin" && (
        <CreateAssignmentDialog />
      )}
    </div>
  )
}
