import { createClient } from "@/utils/supabase/server"
import { QuizClient } from "./quiz-client"
import { redirect } from "next/navigation"

export default async function QuizTakingPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  const supabase = await createClient()

  // Fetch quiz details
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', unwrappedParams.id)
    .single()

  if (quizError || !quiz) {
    redirect('/dashboard/quizzes')
  }

  // Fetch questions
  const { data: questions, error: qError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', unwrappedParams.id)
    .order('order_index', { ascending: true })

  if (qError) {
    console.error("Failed to load questions", qError)
  }

  return (
    <QuizClient quiz={quiz} questions={questions || []} />
  )
}
