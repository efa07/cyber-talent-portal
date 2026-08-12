import { createAdminClient, createClient } from "@/utils/supabase/server"
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

  // Check if the current student has already submitted this quiz
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const supabaseAdmin = createAdminClient()
    const { data: existingSubmission } = await supabaseAdmin
      .from('quiz_submissions')
      .select('id')
      .eq('quiz_id', unwrappedParams.id)
      .eq('student_id', user.id)
      .limit(1)
      .maybeSingle()

    if (existingSubmission) {
      // Already submitted — send them straight to their results
      redirect(`/dashboard/quizzes/${unwrappedParams.id}/results`)
    }
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
