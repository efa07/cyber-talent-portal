"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, FileText, CheckCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const assignments = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    description: "Build a custom hook for managing form state with validation.",
    dueDate: "Tomorrow, 11:59 PM",
    maxScore: 100,
    submissions: 24,
    totalStudents: 32,
    status: "Active",
  },
  {
    id: "2",
    title: "CSS Grid Layout Masterclass",
    description: "Create a complex dashboard layout using advanced CSS Grid techniques.",
    dueDate: "Oct 28, 10:00 AM",
    maxScore: 50,
    submissions: 32,
    totalStudents: 32,
    status: "Completed",
  },
  {
    id: "3",
    title: "Next.js App Router Setup",
    description: "Initialize a Next.js project with App Router and implement nested layouts.",
    dueDate: "Nov 5, 11:59 PM",
    maxScore: 100,
    submissions: 5,
    totalStudents: 32,
    status: "Active",
  }
]

export default function AssignmentsPage() {
  return (
    <div className="flex flex-col gap-6 relative min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground mt-1">Manage class assignments and submissions.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-20">
        {assignments.map((assignment) => (
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
        ))}
      </div>

      {/* Floating Create Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button size="lg" className="rounded-full shadow-lg h-14 px-6 gap-2">
          <Plus className="h-5 w-5" />
          Create Assignment
        </Button>
      </div>
    </div>
  )
}
