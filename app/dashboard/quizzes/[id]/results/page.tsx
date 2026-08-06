import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Trophy, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: quiz } = await supabase.from('quizzes').select('*').eq('id', unwrappedParams.id).single()
  
  if (!quiz) redirect('/dashboard/quizzes')

  const { data: submission } = await supabase
    .from('quiz_submissions')
    .select('*')
    .eq('quiz_id', quiz.id)
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single()

  if (!submission) {
    // If they haven't taken it yet, redirect them to the quiz start page
    redirect(`/dashboard/quizzes/${quiz.id}`)
  }

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quiz.id)
    .order('order_index', { ascending: true })

  const totalQuestions = questions?.length || 0
  
  let correctCount = 0
  const detailedResults = questions?.map(q => {
    const correctOption = q.options[q.correct_option_index]
    const userAnswerText = submission.answers?.[q.id] || "No answer provided"
    const isCorrect = correctOption && correctOption.text === userAnswerText
    
    if (isCorrect) correctCount++
    
    return {
      id: q.id,
      question: q.question_text,
      correctAnswer: correctOption?.text || "",
      userAnswer: userAnswerText,
      isCorrect
    }
  }) || []

  const percentage = submission.score || 0
  
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pt-4 md:pt-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/quizzes" className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
          <p className="text-muted-foreground mt-1">{quiz.title}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-zinc-950 text-white border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="relative z-10 text-center pb-2">
            <CardTitle className="text-lg text-zinc-300 font-medium">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center size-40 rounded-full bg-zinc-900 border-[8px] border-primary/20">
              <svg className="absolute inset-0 size-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-primary/20" strokeWidth="10%" />
                <circle cx="50%" cy="50%" r="45%" className="fill-none stroke-primary transition-all duration-1000 ease-out" strokeWidth="10%" strokeDasharray="100 100" strokeDashoffset={100 - percentage} pathLength="100" />
              </svg>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold">{percentage}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-6 p-2 px-4 bg-primary/20 text-primary-foreground rounded-full">
              <Trophy className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">+{percentage} XP Earned</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>A breakdown of your quiz performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-4 rounded-xl border bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">Correct</span>
                </div>
                <span className="text-3xl font-bold">{correctCount}</span>
                <span className="text-xs text-muted-foreground mt-1">out of {totalQuestions}</span>
              </div>
              
              <div className="flex flex-col p-4 rounded-xl border bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="font-medium">Incorrect</span>
                </div>
                <span className="text-3xl font-bold">{totalQuestions - correctCount}</span>
                <span className="text-xs text-muted-foreground mt-1">out of {totalQuestions}</span>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <Link href={`/dashboard/quizzes/${quiz.id}`} className={buttonVariants({ variant: "outline" })}>
                Retake Quiz
              </Link>
              <Link href="/dashboard/quizzes" className={buttonVariants({ className: "gap-2" })}>
                Back to Quizzes <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Review</CardTitle>
          <CardDescription>Review your answers and see correct solutions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {detailedResults.map((result, idx) => (
            <div key={result.id} className="flex gap-4 border-b pb-6 last:border-0 last:pb-0">
              <div className="mt-1">
                {result.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-success" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="text-base font-medium leading-relaxed">
                  <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                  {result.question}
                </h4>
                
                <div className="grid gap-2 sm:grid-cols-2 mt-4">
                  <div className={`p-3 rounded-lg border ${result.isCorrect ? 'bg-success/10 border-success/20' : 'bg-destructive/10 border-destructive/20'}`}>
                    <span className="text-xs font-medium text-muted-foreground block mb-1">Your Answer</span>
                    <span className={result.isCorrect ? 'text-success font-medium' : 'text-destructive font-medium'}>
                      {result.userAnswer}
                    </span>
                  </div>
                  
                  {!result.isCorrect && (
                    <div className="p-3 rounded-lg border bg-success/10 border-success/20">
                      <span className="text-xs font-medium text-muted-foreground block mb-1">Correct Answer</span>
                      <span className="text-success font-medium">
                        {result.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
