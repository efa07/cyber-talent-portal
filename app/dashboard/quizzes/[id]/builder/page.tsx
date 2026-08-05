"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, CheckCircle2, Circle, ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRole } from "@/components/role-provider"
import { saveQuizQuestions } from "@/app/actions"
import { useParams, useRouter } from "next/navigation"

type Option = {
  id: string
  text: string
  isCorrect: boolean
}

type Question = {
  id: string
  text: string
  points: number
  options: Option[]
}

export default function QuizBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const { role } = useRole()
  const [quizTitle, setQuizTitle] = useState("New Quiz")
  const [isSaving, setIsSaving] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      text: "What is a characteristic of a strong password?",
      points: 10,
      options: [
        { id: "o1", text: "At least 12 characters, mixing letters, numbers, and symbols", isCorrect: true },
        { id: "o2", text: "Using your pet's name followed by 123", isCorrect: false },
      ]
    }
  ])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveQuizQuestions(quizId, quizTitle, questions)
      router.push('/dashboard/quizzes')
    } catch (error) {
      console.error(error)
      // Normally we'd show a toast here
    } finally {
      setIsSaving(false)
    }
  }

  if (role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to access the quiz builder.</p>
        <Link href="/dashboard/quizzes">
          <Button>Return to Quizzes</Button>
        </Link>
      </div>
    )
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addQuestion = () => {
    setQuestions([...questions, {
      id: generateId(),
      text: "",
      points: 10,
      options: [
        { id: generateId(), text: "", isCorrect: true },
        { id: generateId(), text: "", isCorrect: false }
      ]
    }])
  }

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter(q => q.id !== qId))
  }

  const updateQuestionText = (qId: string, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, text } : q))
  }

  const updatePoints = (qId: string, points: number) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, points } : q))
  }

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: [...q.options, { id: generateId(), text: "", isCorrect: false }]
        }
      }
      return q
    }))
  }

  const removeOption = (qId: string, oId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.filter(o => o.id !== oId) }
      }
      return q
    }))
  }

  const updateOptionText = (qId: string, oId: string, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => o.id === oId ? { ...o, text } : o)
        }
      }
      return q
    }))
  }

  const setCorrectOption = (qId: string, oId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: q.options.map(o => ({ ...o, isCorrect: o.id === oId }))
        }
      }
      return q
    }))
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/quizzes">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <input 
              type="text" 
              value={quizTitle} 
              onChange={(e) => setQuizTitle(e.target.value)}
              className="text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full hover:bg-muted/50 px-2 py-1 rounded transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Preview</Button>
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Quiz'}
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="relative overflow-hidden border-2 border-border/50 hover:border-border transition-colors">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-muted/50 flex flex-col items-center py-4 border-r border-border/50">
              <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
            </div>
            
            <CardHeader className="pl-12 pb-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Text</Label>
                  <Textarea 
                    value={question.text}
                    onChange={(e) => updateQuestionText(question.id, e.target.value)}
                    placeholder="Write your question here..."
                    className="text-lg font-medium resize-none min-h-[80px]"
                  />
                </div>
                <div className="flex flex-col items-end gap-2 w-24 shrink-0">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Points</Label>
                  <Input 
                    type="number" 
                    value={question.points}
                    onChange={(e) => updatePoints(question.id, parseInt(e.target.value) || 0)}
                    className="text-center font-bold"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full mt-2">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pl-12 space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Answers</Label>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <div key={option.id} className={`flex items-center gap-3 p-2 rounded-xl transition-colors border ${option.isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-background border-transparent hover:border-border/50'}`}>
                    <button 
                      onClick={() => setCorrectOption(question.id, option.id)}
                      className="shrink-0 flex items-center justify-center rounded-full h-8 w-8 transition-colors hover:bg-muted"
                      title="Mark as correct answer"
                    >
                      {option.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-500/20" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground opacity-50" />
                      )}
                    </button>
                    
                    <Input 
                      value={option.text}
                      onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                      placeholder="Option text..."
                      className={`flex-1 ${option.isCorrect ? 'border-green-500/20 focus-visible:ring-green-500/30' : ''}`}
                    />

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeOption(question.id, option.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 shrink-0"
                      disabled={question.options.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => addOption(question.id)} className="mt-2 text-xs border-dashed gap-2">
                <Plus className="h-3 w-3" /> Add Option
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <Button size="lg" onClick={addQuestion} className="rounded-full shadow-lg h-14 px-8 gap-2 bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="h-5 w-5" /> Add New Question
        </Button>
      </div>

    </div>
  )
}
