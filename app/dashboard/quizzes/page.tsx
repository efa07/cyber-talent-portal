import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Clock, HelpCircle, Award, RotateCcw, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { CreateQuizDialog } from "./create-quiz-dialog"

export default async function QuizzesPage() {
  const supabase = await createClient()

  // Get current user and their DB role
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'student'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) role = profile.role
  }

  // Fetch quizzes with question counts
  const { data: quizzesData } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_questions (count)
    `)
    .order('created_at', { ascending: false })

  const quizzes = (quizzesData || []).map((quiz: any) => {
    // Check if current user has reached max attempts
    // In a real app we would query quiz_submissions, for now mock status
    const status = "Active" 
    const questionsCount = quiz.quiz_questions[0]?.count || 0
    const totalMarks = questionsCount * 10 // Assuming 10 marks per question

    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: questionsCount,
      timeLimit: `${quiz.time_limit_minutes} mins`,
      totalMarks: totalMarks,
      attempts: quiz.max_attempts,
      status: status,
    }
  })

  return (
    <div className="flex flex-col gap-6 relative min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
          <p className="text-muted-foreground mt-1">Assess knowledge with interactive quizzes.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pb-20">
        {quizzes.length > 0 ? quizzes.map((quiz) => (
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
        )) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No quizzes found.
          </div>
        )}
      </div>

      {role === "admin" && (
        <CreateQuizDialog />
      )}
    </div>
  )
}
