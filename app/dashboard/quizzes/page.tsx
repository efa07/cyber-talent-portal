"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Plus, Clock, HelpCircle, Award, RotateCcw, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRole } from "@/components/role-provider"

const quizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JS variables, functions, and loops.",
    questions: 15,
    timeLimit: "30 mins",
    totalMarks: 100,
    attempts: 2,
    status: "Active",
  },
  {
    id: "2",
    title: "React Components & State",
    description: "Evaluate understanding of functional components and hooks.",
    questions: 20,
    timeLimit: "45 mins",
    totalMarks: 100,
    attempts: 1,
    status: "Active",
  },
  {
    id: "3",
    title: "CSS Layouts (Flexbox & Grid)",
    description: "Assessment on modern CSS layout techniques.",
    questions: 10,
    timeLimit: "20 mins",
    totalMarks: 50,
    attempts: 0,
    status: "Completed",
  }
]

export default function QuizzesPage() {
  const { role } = useRole()

  return (
    <div className="flex flex-col gap-6 relative min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Assess knowledge with interactive quizzes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-20">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col hover:border-primary/50 transition-colors group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={quiz.status === "Active" ? "default" : "secondary"}>
                  {quiz.status}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <span>{quiz.questions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{quiz.timeLimit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="h-4 w-4 text-primary" />
                  <span>{quiz.totalMarks} Marks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RotateCcw className="h-4 w-4 text-primary" />
                  <span>{quiz.attempts} Attempts</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t flex gap-2">
              <Link 
                href={`/dashboard/quizzes/${quiz.id}`} 
                className={buttonVariants({ variant: quiz.status === "Active" ? "default" : "outline", className: "w-full gap-2" })}
              >
                {quiz.status === "Active" ? (
                  <>
                    <Play className="h-4 w-4 fill-current" /> Start Quiz
                  </>
                ) : (
                  "View Results"
                )}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Floating Create Button */}
      {role === "admin" && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button size="lg" className="rounded-full shadow-lg h-14 px-6 gap-2">
            <Plus className="h-5 w-5" />
            Create Quiz
          </Button>
        </div>
      )}
    </div>
  )
}
