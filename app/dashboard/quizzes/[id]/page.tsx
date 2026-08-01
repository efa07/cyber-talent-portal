"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Timer, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const mockQuestions = [
  {
    id: 1,
    question: "What is the output of `typeof null` in JavaScript?",
    options: ["undefined", "null", "object", "string"],
    correct: "object",
  },
  {
    id: 2,
    question: "Which hook is used to perform side effects in a functional component?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correct: "useEffect",
  },
  {
    id: 3,
    question: "How do you apply a flex container using Tailwind CSS?",
    options: ["display-flex", "flex-container", "flex", "block-flex"],
    correct: "flex",
  }
]

export default function QuizTakingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, submit answers to API
    router.push(`/dashboard/quizzes/1/results`)
  }

  const question = mockQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full pt-4 md:pt-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">JavaScript Fundamentals</h1>
          <p className="text-muted-foreground mt-1">Question {currentQuestion + 1} of {mockQuestions.length}</p>
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
            {currentQuestion + 1}. {question.question}
          </h2>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={answers[question.id]} 
            onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}
            className="flex flex-col gap-4"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex flex-1 items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                >
                  <span className="text-base font-medium">{option}</span>
                </Label>
              </div>
            ))}
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
          
          {currentQuestion === mockQuestions.length - 1 ? (
            <Button onClick={handleSubmit} className="gap-2 bg-success text-success-foreground hover:bg-success/90">
              <CheckCircle2 className="h-4 w-4" /> Submit Quiz
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
