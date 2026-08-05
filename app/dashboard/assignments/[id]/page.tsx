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
import { updateAssignment } from "@/app/actions"

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
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.from('assignments').select('*').eq('id', unwrappedParams.id).single()
      if (error) {
        console.error('Failed to load assignment', error)
        return
      }
      setAssignment(data)
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
          <Card>
            <CardHeader>
              <CardTitle>Submission Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Students</span>
                <span className="font-medium">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="font-medium text-success">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Graded</span>
                <span className="font-medium text-primary">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium text-warning">8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
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

function GradeDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button size="sm">Grade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grade Submission</DialogTitle>
          <DialogDescription>
            Enter a score and provide feedback for Jane Doe's submission.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="score" className="text-sm font-medium leading-none">Score (out of 100)</label>
              <span className="text-xs text-muted-foreground">Max: 100</span>
            </div>
            <Input id="score" type="number" placeholder="95" className="max-w-[150px]" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="feedback" className="text-sm font-medium leading-none">Feedback</label>
            <Textarea 
              id="feedback" 
              placeholder="Great job on implementing the error state!" 
              className="h-32" 
            />
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md mt-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">jane-doe-useform.zip</span>
            <Button variant="ghost" size="sm" className="ml-auto h-8 px-2">Download</Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Submit Grade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
