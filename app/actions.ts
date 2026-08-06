"use server"

import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

export async function createAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const dueDate = formData.get("due-date") as string
  const description = (formData.get("description") as string) || "New assignment created by instructor."
  let fileUrl = "#"

  // Handle file upload to Supabase Storage if a file was provided
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    try {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `assignments/${fileName}`
      
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
        upsert: false,
        contentType: file.type
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
        // fallback to placeholder
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl || fileUrl
      }
    } catch (e) {
      console.error('File upload failed', e)
    }
  }

  const { error } = await supabase.from('assignments').insert({
    title,
    description,
    due_date: new Date(dueDate).toISOString(),
    file_url: fileUrl,
    instructor_id: user.id
  })

  if (error) {
    console.error("Error creating assignment:", error)
    throw new Error("Failed to create assignment")
  }

  revalidatePath('/dashboard/assignments')
  return { success: true }
}

export async function updateAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const dueDate = formData.get("due-date") as string
  const description = (formData.get("description") as string) || ""
  let fileUrl = undefined
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    try {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `assignments/${fileName}`
      
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
        upsert: false,
        contentType: file.type
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl
      }
    } catch (e) {
      console.error('File upload failed', e)
    }
  }

  const updatePayload: any = {
    title,
    description,
    due_date: new Date(dueDate).toISOString(),
  }
  if (fileUrl) updatePayload.file_url = fileUrl

  const { error } = await supabase.from('assignments').update(updatePayload).eq('id', id)

  if (error) {
    console.error('Error updating assignment:', error)
    throw new Error('Failed to update assignment')
  }

  revalidatePath(`/dashboard/assignments/${id}`)
  revalidatePath('/dashboard/assignments')
  return { success: true }
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("message") as string

  const { error } = await supabase.from('announcements').insert({
    title,
    content,
    type: 'info', // Default to info
    author_id: user.id
  })

  if (error) {
    console.error("Error creating announcement:", error)
    throw new Error("Failed to create announcement")
  }

  revalidatePath('/dashboard/announcements')
  return { success: true }
}

export async function createResource(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string || "Uploaded Resource"
  let fileUrl = "#"
  let resourceType = "pdf"

  const file = formData.get('file') as File | null
  
  if (file && file.size > 0) {
    try {
      const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const fileName = `${Date.now()}-${file.name}`
      const filePath = `resources/${fileName}`
      
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
        upsert: false,
        contentType: file.type
      })

      if (uploadError) {
        console.error('Error uploading resource:', uploadError)
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl || "#"
      }
      
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext) resourceType = ext
    } catch(e) {
      console.error('File upload exception:', e)
    }
  }

  const { error } = await supabase.from('resources').insert({
    title,
    description: "Uploaded resource file.",
    file_url: fileUrl,
    resource_type: resourceType,
    instructor_id: user.id
  })

  if (error) {
    console.error("Error creating resource:", error)
    throw new Error("Failed to create resource")
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function createQuiz(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const timeLimit = parseInt(formData.get("time-limit") as string, 10)
  const maxAttempts = parseInt(formData.get("attempts") as string, 10)

  const { data, error } = await supabase.from('quizzes').insert({
    title,
    description,
    time_limit_minutes: timeLimit || 30,
    max_attempts: maxAttempts || 1,
    instructor_id: user.id
  }).select().single()

  if (error) {
    console.error("Error creating quiz:", error)
    throw new Error("Failed to create quiz")
  }

  revalidatePath('/dashboard/quizzes')
  return { success: true, quizId: data.id }
}

export async function saveQuizQuestions(quizId: string, title: string, questions: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Update quiz title
  await supabase.from('quizzes').update({ title }).eq('id', quizId)

  // Clear existing questions for this quiz (simplest way to handle updates)
  await supabase.from('quiz_questions').delete().eq('quiz_id', quizId)

  // Insert new questions
  const questionsToInsert = questions.map((q, index) => {
    const correctIndex = q.options.findIndex((o: any) => o.isCorrect)
    return {
      quiz_id: quizId,
      question_text: q.text,
      options: q.options,
      correct_option_index: correctIndex !== -1 ? correctIndex : 0,
      order_index: index
    }
  })

  if (questionsToInsert.length > 0) {
    const { error } = await supabase.from('quiz_questions').insert(questionsToInsert)
    if (error) {
      console.error("Error saving quiz questions:", error)
      throw new Error("Failed to save quiz questions")
    }
  }

  revalidatePath(`/dashboard/quizzes/${quizId}`)
  revalidatePath('/dashboard/quizzes')
  return { success: true }
}

export async function submitAssignment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const assignmentId = formData.get("assignment_id") as string
  if (!assignmentId) throw new Error("Missing assignment ID")

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    throw new Error("No file provided")
  }

  let fileUrl = "#"

  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const fileName = `${Date.now()}-${file.name}`
    const filePath = `submissions/${fileName}`
    
    const fileBuffer = await file.arrayBuffer()
    
    const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
      upsert: false,
      contentType: file.type
    })

    if (uploadError) {
      console.error('Error uploading student submission:', uploadError)
      throw new Error("File upload failed")
    } else {
      const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
      fileUrl = publicData?.publicUrl || "#"
    }
  } catch (e) {
    console.error('File upload exception:', e)
    throw new Error("File upload failed")
  }

  // Insert submission record
  const { error } = await supabase.from('submissions').insert({
    assignment_id: assignmentId,
    student_id: user.id,
    status: 'pending',
    file_url: fileUrl,
  })

  if (error) {
    console.error("Error creating submission record:", error)
    throw new Error("Failed to record submission")
  }

  revalidatePath(`/dashboard/assignments/${assignmentId}`)
  return { success: true }
}

export async function gradeSubmission(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const submissionId = formData.get("submission_id") as string
  const studentId = formData.get("student_id") as string
  const assignmentId = formData.get("assignment_id") as string
  const score = parseInt(formData.get("score") as string, 10)
  
  if (!submissionId || !studentId || isNaN(score)) {
    throw new Error("Missing required grading fields")
  }

  // Use the admin client to bypass RLS for grading if necessary, but admins should have access based on schema policies
  // Our schema policy says "Only admins can update submissions", so standard client works if user is admin
  
  // 1. Update submission
  const { error: subError } = await supabase.from('submissions').update({
    status: 'graded',
    score: score
  }).eq('id', submissionId)

  if (subError) {
    console.error("Error updating submission:", subError)
    throw new Error("Failed to update submission")
  }

  // 2. Award XP to student (simple RPC or direct update if we have admin rights)
  // Let's use the admin client to update the student's profile XP safely
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch current XP
  const { data: profile } = await supabaseAdmin.from('profiles').select('xp').eq('id', studentId).single()
  const currentXp = profile?.xp || 0

  // Update XP
  const { error: profileError } = await supabaseAdmin.from('profiles').update({
    xp: currentXp + score
  }).eq('id', studentId)

  if (profileError) {
    console.error("Error updating student XP:", profileError)
  }

  revalidatePath(`/dashboard/assignments/${assignmentId}`)
  return { success: true }
}

export async function submitQuiz(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const quizId = formData.get("quiz_id") as string
  const answersRaw = formData.get("answers") as string
  if (!quizId || !answersRaw) throw new Error("Missing data")
  
  let userAnswers: Record<string, string> = {}
  try {
    userAnswers = JSON.parse(answersRaw)
  } catch (e) {
    throw new Error("Invalid answers format")
  }

  // Fetch the actual questions to grade it securely on the server
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quizId)

  if (!questions) throw new Error("Could not load questions")

  let correctCount = 0
  const totalCount = questions.length

  questions.forEach(q => {
    const correctOption = q.options[q.correct_option_index]
    const userAnswerText = userAnswers[q.id]
    if (correctOption && correctOption.text === userAnswerText) {
      correctCount++
    }
  })

  const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0
  const timeSpent = parseInt(formData.get("time_spent") as string, 10) || 300

  // Insert submission
  const { error } = await supabase.from('quiz_submissions').insert({
    quiz_id: quizId,
    student_id: user.id,
    score: score,
    time_spent_seconds: timeSpent
  })

  if (error) {
    console.error("Error submitting quiz:", error)
    throw new Error("Failed to submit quiz")
  }

  // Award XP based on score
  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: profile } = await supabaseAdmin.from('profiles').select('xp').eq('id', user.id).single()
    if (profile) {
      await supabaseAdmin.from('profiles').update({ xp: profile.xp + score }).eq('id', user.id)
    }
  } catch (e) {
    console.error("Failed to award XP", e)
  }

  revalidatePath(`/dashboard/quizzes/${quizId}`)
  revalidatePath('/dashboard/student')
  return { success: true, score }
}

export async function createStudent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Double check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw new Error("Unauthorized: Only admins can create students")
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if (!name || !email || !password) throw new Error("Missing required fields")

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      role: 'student'
    }
  })

  if (error) {
    console.error("Error creating student:", error)
    throw new Error(error.message || "Failed to create student")
  }

  revalidatePath('/dashboard/students')
  return { success: true }
}
