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
import { useState } from "react"
import { use } from "react"

export default function AssignmentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge>Active</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Due Tomorrow, 11:59 PM
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">React Hooks Deep Dive</h1>
          <p className="text-muted-foreground mt-1">Assignment ID: {unwrappedParams.id} • Max Score: 100 pts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Edit Assignment</Button>
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
              <p className="text-sm leading-relaxed">
                In this assignment, you will build a custom React Hook for managing form state with validation.
                The hook should be generic enough to handle different types of inputs (text, email, password) and 
                support complex validation rules.
              </p>
              <h4 className="font-medium mt-4">Requirements:</h4>
              <ul className="list-disc pl-5 text-sm space-y-2 text-muted-foreground">
                <li>Create a <code>useForm</code> hook that accepts initial state and validation schema.</li>
                <li>Implement <code>onChange</code> and <code>onSubmit</code> handlers.</li>
                <li>Support error state management per field.</li>
                <li>Write at least 3 unit tests for your hook.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 p-1.5 bg-blue-500/10 text-blue-500 rounded-md" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">starter-template.zip</p>
                    <p className="text-xs text-muted-foreground">ZIP • 2.4 MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
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
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">Jane Doe</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">Today, 10:23 AM</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-warning/10 text-warning hover:bg-warning/20 border-warning/20">Needs Grading</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-- / 100</TableCell>
                <TableCell className="text-right">
                  <GradeDialog />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">Alex Smith</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">Yesterday, 4:45 PM</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-success border-success">Graded</Badge>
                </TableCell>
                <TableCell className="font-medium">95 / 100</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit Grade</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">Michael Johnson</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">--</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-muted-foreground border-border">Missing</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">-- / 100</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>Grade</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
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
