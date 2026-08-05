"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Download, CheckCircle, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useTransition } from "react"
import { use } from "react"
import { createClient } from "@/utils/supabase/client"
import { updateAssignment, submitAssignment, gradeSubmission } from "@/app/actions"
import { Loader2 } from "lucide-react"

function formatDateForInput(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n: number) => String(n).padStart(2, '0')
  const YYYY = d.getFullYear()
  const MM = pad(d.getMonth() + 1)
  const DD = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`
}

export default function AssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const [assignment, setAssignment] = useState<any | null>(null)
  const [stats, setStats] = useState({ totalStudents: 0, submitted: 0, graded: 0, pending: 0 })
  const [role, setRole] = useState<'student' | 'admin' | null>(null)
  const [mySubmission, setMySubmission] = useState<any | null>(null)
  const [allSubmissions, setAllSubmissions] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      
      const [assignmentRes, studentsRes, submissionsRes] = await Promise.all([
        supabase.from('assignments').select('*').eq('id', unwrappedParams.id).single(),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
        supabase.from('submissions').select('status').eq('assignment_id', unwrappedParams.id)
      ])

      if (assignmentRes.error) {
        console.error('Failed to load assignment', assignmentRes.error)
        return
      }
      
      setAssignment(assignmentRes.data)
      
      // Get current user and role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        setRole(profile?.role)
        
        if (profile?.role === 'student') {
          const { data: submission } = await supabase.from('submissions').select('*').eq('assignment_id', unwrappedParams.id).eq('student_id', user.id).maybeSingle()
          setMySubmission(submission)
        } else if (profile?.role === 'admin') {
          const { data: allSubmissions } = await supabase
            .from('submissions')
            .select('*, profiles(full_name)')
            .eq('assignment_id', unwrappedParams.id)
            .order('submitted_at', { ascending: false })
          setAllSubmissions(allSubmissions || [])
        }
      }
      
      const totalStudents = studentsRes.count || 0
      const submissions = submissionsRes.data || []
      
      setStats({
        totalStudents,
        submitted: submissions.length,
        graded: submissions.filter(s => s.status === 'graded').length,
        pending: submissions.filter(s => s.status === 'pending').length
      })
    }

    load()
  }, [unwrappedParams.id])

  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge>{assignment ? (new Date(assignment.due_date) < new Date() ? 'Completed' : 'Active') : 'Loading'}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {assignment ? new Date(assignment.due_date).toLocaleString() : '—'}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{assignment?.title || 'Loading...'}</h1>
          <p className="text-muted-foreground mt-1">Assignment ID: {unwrappedParams.id} • Max Score: 100 pts</p>
        </div>
        {role === 'admin' && (
          <div className="flex gap-2">
            <EditAssignmentDialog assignment={assignment} onSaved={async () => {
              startTransition(async () => {
                const supabase = createClient()
                const { data } = await supabase.from('assignments').select('*').eq('id', unwrappedParams.id).single()
                setAssignment(data)
              })
            }} />
            <Button>Download All Submissions</Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{assignment?.description || 'Loading description...'}</p>
              {assignment && (
                <>
                  <h4 className="font-medium mt-4">Requirements:</h4>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                    <li>Follow the assignment description.</li>
                    <li>Submit using the submission form before the due date.</li>
                  </ul>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle> </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 p-1.5 bg-blue-500/10 text-blue-500 rounded-md" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{assignment?.file_url ? assignment.file_url.split('/').pop() : 'No attachment'}</p>
                    <p className="text-xs text-muted-foreground">{assignment?.file_url ? 'Uploaded file' : ''}</p>
                  </div>
                </div>
                {assignment?.file_url && assignment.file_url !== '#' ? (
                  <a href={assignment.file_url} target="_blank" rel="noopener noreferrer" download>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                ) : (
                  <Button variant="ghost" size="icon" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {role === 'admin' ? (
            <Card>
              <CardHeader>
                <CardTitle>Submission Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="font-medium">{stats.totalStudents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Submitted</span>
                  <span className="font-medium text-success">{stats.submitted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Graded</span>
                  <span className="font-medium text-primary">{stats.graded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-warning">{stats.pending}</span>
                </div>
              </CardContent>
            </Card>
          ) : role === 'student' ? (
            <Card>
              <CardHeader>
                <CardTitle>My Submission</CardTitle>
                <CardDescription>Upload or view your assignment</CardDescription>
              </CardHeader>
              <CardContent>
                {mySubmission ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      {mySubmission.status === 'graded' ? (
                        <Badge variant="default" className="bg-success text-success-foreground">Graded</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-warning/10 text-warning">Pending Review</Badge>
                      )}
                    </div>
                    {mySubmission.status === 'graded' && (
                      <div className="p-3 bg-muted rounded-md mb-4">
                        <p className="text-sm font-medium">Score: {mySubmission.score} / 100</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 p-1 bg-violet-500/10 text-violet-500 rounded-md" />
                        <span className="text-sm font-medium truncate max-w-[150px]">{mySubmission.file_url ? mySubmission.file_url.split('/').pop() : 'Submission file'}</span>
                      </div>
                      {mySubmission.file_url && mySubmission.file_url !== '#' && (
                        <a href={mySubmission.file_url} target="_blank" rel="noopener noreferrer" download>
                          <Button variant="ghost" size="sm">Download</Button>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <StudentSubmissionForm assignmentId={unwrappedParams.id} onSubmitted={async () => {
                    const supabase = createClient()
                    const { data: { user } } = await supabase.auth.getUser()
                    if (user) {
                      const { data } = await supabase.from('submissions').select('*').eq('assignment_id', unwrappedParams.id).eq('student_id', user.id).single()
                      setMySubmission(data)
                    }
                  }} />
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
            <CardDescription>Review and grade submitted assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{sub.profiles?.full_name?.substring(0, 2).toUpperCase() || 'ST'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{sub.profiles?.full_name || 'Unknown Student'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(sub.submitted_at).toLocaleString()}</TableCell>
                    <TableCell>
                      {sub.status === 'pending' ? (
                        <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20">Needs Grading</Badge>
                      ) : (
                        <Badge variant="default" className="bg-success text-success-foreground">Graded</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sub.score !== null ? `${sub.score} / 100` : '-- / 100'}</TableCell>
                    <TableCell className="text-right">
                      {sub.status === 'pending' ? (
                        <GradeDialog submission={sub} onGraded={() => {
                          const supabase = createClient()
                          supabase.from('submissions').select('*, profiles(full_name)').eq('assignment_id', unwrappedParams.id).order('submitted_at', { ascending: false }).then(({ data }) => setAllSubmissions(data || []))
                        }} />
                      ) : (
                        <Button variant="ghost" size="sm" disabled>Graded</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {allSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No submissions yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

    </div>
  )
}

function StudentSubmissionForm({ assignmentId, onSubmitted }: { assignmentId: string, onSubmitted: () => void }) {
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await submitAssignment(formData)
        onSubmitted()
      } catch (e) {
        console.error(e)
      }
    })
  }

  return (
    <form action={action} encType="multipart/form-data" className="space-y-4">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <div className="space-y-2">
        <label htmlFor="file" className="text-sm font-medium">Upload File (PDF, ZIP)</label>
        <Input id="file" name="file" type="file" required accept=".pdf,.zip" className="cursor-pointer file:text-violet-600 file:bg-violet-50 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-medium hover:file:bg-violet-100 transition-colors" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Assignment
      </Button>
    </form>
  )
}

function EditAssignmentDialog({ assignment, onSaved }: { assignment: any, onSaved?: () => void }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await updateAssignment(formData)
        setOpen(false)
        if (onSaved) await onSaved()
      } catch (e) {
        console.error(e)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline">Edit Assignment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>Update assignment details.</DialogDescription>
        </DialogHeader>
        <form action={action} encType="multipart/form-data">
          <input type="hidden" name="id" value={assignment?.id} />
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input id="title" name="title" required defaultValue={assignment?.title} />
            </div>
            <div className="space-y-2">
              <label htmlFor="due-date">Due Date</label>
              <Input id="due-date" name="due-date" required type="datetime-local" defaultValue={formatDateForInput(assignment?.due_date)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Description</label>
              <Textarea id="description" name="description" required defaultValue={assignment?.description} className="h-36" />
            </div>
            <div className="space-y-2">
              <label htmlFor="file">Replace Attachment (optional)</label>
              <Input id="file" name="file" type="file" accept=".pdf,.zip" className="cursor-pointer file:text-violet-600 file:bg-violet-50 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-medium hover:file:bg-violet-100 transition-colors" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function GradeDialog({ submission, onGraded }: { submission: any, onGraded: () => void }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function action(formData: FormData) {
    startTransition(async () => {
      try {
        await gradeSubmission(formData)
        setOpen(false)
        onGraded()
      } catch (e) {
        console.error(e)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Grade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Enter a score and provide feedback for {submission.profiles?.full_name || 'this student'}'s submission.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          <input type="hidden" name="submission_id" value={submission.id} />
          <input type="hidden" name="student_id" value={submission.student_id} />
          <input type="hidden" name="assignment_id" value={submission.assignment_id} />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="score" className="text-sm font-medium leading-none">Score (out of 100 XP)</label>
                <span className="text-xs text-muted-foreground">Max: 100</span>
              </div>
              <Input id="score" name="score" type="number" required max={100} min={0} placeholder="100" className="max-w-[150px]" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium leading-none">Feedback (optional)</label>
              <Textarea 
                id="feedback" 
                name="feedback"
                placeholder="Great job!" 
                className="h-32" 
              />
            </div>
            {submission.file_url && submission.file_url !== '#' && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md mt-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium truncate max-w-[250px]">{submission.file_url.split('/').pop()}</span>
                <a href={submission.file_url} target="_blank" rel="noopener noreferrer" download className="ml-auto">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2">Download</Button>
                </a>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Grade & XP
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
