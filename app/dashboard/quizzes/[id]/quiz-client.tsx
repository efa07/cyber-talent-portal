"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Timer, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { submitQuiz } from "@/app/actions"

export function QuizClient({ quiz, questions }: { quiz: any, questions: any[] }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState((quiz.time_limit_minutes || 30) * 60)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    if (isPending) return
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("quiz_id", quiz.id)
        formData.append("answers", JSON.stringify(answers))
        formData.append("time_spent", ((quiz.time_limit_minutes || 30) * 60 - timeLeft).toString())
        
        // This action needs to be created or we just redirect
        await submitQuiz(formData)
        router.push(`/dashboard/quizzes/${quiz.id}/results`)
      } catch (e) {
        console.error(e)
      }
    })
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-2xl font-bold">No Questions Found</h2>
        <p className="text-muted-foreground">This quiz doesn't have any questions yet.</p>
        <Button onClick={() => router.push('/dashboard/quizzes')}>Go Back</Button>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pt-4 md:pt-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
          <p className="text-muted-foreground mt-1">Question {currentQuestion + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg font-mono text-xl font-bold ${timeLeft < 300 ? 'text-destructive bg-destructive/10 animate-pulse' : 'bg-muted'}`}>
          <Timer className="h-6 w-6" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-8" />

      <Card className="flex-1 border-2 border-border/50 shadow-lg">
        <CardHeader className="pb-6">
          <h2 className="text-2xl font-semibold leading-relaxed">
            {currentQuestion + 1}. {question.question_text}
          </h2>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[question.id] || ""} 
            onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}
            className="flex flex-col gap-4"
          >
            {question.options.map((option: any, index: number) => {
              const isSelected = answers[question.id] === option.text;
              return (
                <div 
                  key={index}
                  onClick={() => setAnswers({ ...answers, [question.id]: option.text })}
                  className={`flex flex-1 items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-green-500 bg-green-500/20' 
                      : 'border-muted bg-transparent hover:bg-muted'
                  }`}
                >
                  <span className="text-base font-medium">{option.text}</span>
                  <RadioGroupItem 
                    value={option.text} 
                    id={`q-${question.id}-opt-${index}`} 
                    className="sr-only" 
                  />
                </div>
              )
            })}
          </RadioGroup>
        </CardContent>
        <CardFooter className="pt-8 flex justify-between border-t mt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={isPending} className="gap-2 bg-success text-success-foreground hover:bg-success/90">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
