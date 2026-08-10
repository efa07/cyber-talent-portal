"use server"

import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
  return createSupabaseClient(url, key)
}

function getUploadContentType(file: File) {
  const name = file.name.toLowerCase()

  if (name.endsWith('.zip') || name.endsWith('.gz') || name.endsWith('.tar')) {
    return 'application/zip'
  }

  if (name.endsWith('.pdf')) {
    return 'application/pdf'
  }

  return file.type || 'application/octet-stream'
}

async function verifyAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized: Please log in first.")
  }

  const supabaseAdmin = getAdminClient()
  const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'admin') {
    throw new Error("Unauthorized: Only instructors can perform this action.")
  }

  return { user, supabaseAdmin }
}

export async function createAssignment(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const title = formData.get("title") as string
  const dueDate = formData.get("due-date") as string
  const description = (formData.get("description") as string) || "New assignment created by instructor."
  let fileUrl: string | null = null

  // Handle file upload to Supabase Storage if a file was provided
  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${Date.now()}-${sanitizedName}`
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
        upsert: true,
        contentType: getUploadContentType(file)
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
        throw new Error(`File upload failed: ${uploadError.message}`)
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl || null
      }
    } catch (e: any) {
      console.error('File upload failed', e)
      throw new Error(e?.message || 'File upload failed')
    }
  }

  const { error } = await supabaseAdmin.from('assignments').insert({
    title,
    description,
    due_date: new Date(dueDate).toISOString(),
    file_url: fileUrl,
    instructor_id: user.id
  })

  if (error) {
    console.error("Error creating assignment:", error)
    throw new Error(`Failed to create assignment: ${error.message}`)
  }

  revalidatePath('/dashboard/assignments')
  return { success: true }
}

export async function updateAssignment(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const dueDate = formData.get("due-date") as string
  const description = (formData.get("description") as string) || ""
  let fileUrl: string | undefined = undefined

  const file = formData.get('file') as File | null
  if (file && file.size > 0) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${Date.now()}-${sanitizedName}`
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('assignments').upload(filePath, fileBuffer, {
        upsert: true,
        contentType: getUploadContentType(file)
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
        throw new Error(`File upload failed: ${uploadError.message}`)
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('assignments').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl
      }
    } catch (e: any) {
      console.error('File upload failed', e)
      throw new Error(e?.message || 'File upload failed')
    }
  }

  const updatePayload: any = {
    title,
    description,
    due_date: new Date(dueDate).toISOString(),
  }
  if (fileUrl !== undefined) updatePayload.file_url = fileUrl

  const { error } = await supabaseAdmin.from('assignments').update(updatePayload).eq('id', id)

  if (error) {
    console.error('Error updating assignment:', error)
    throw new Error(`Failed to update assignment: ${error.message}`)
  }

  revalidatePath(`/dashboard/assignments/${id}`)
  revalidatePath('/dashboard/assignments')
  return { success: true }
}

export async function createAnnouncement(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const title = formData.get("title") as string
  const content = formData.get("message") as string

  const { error } = await supabaseAdmin.from('announcements').insert({
    title,
    content,
    type: 'info',
    author_id: user.id
  })

  if (error) {
    console.error("Error creating announcement:", error)
    throw new Error(`Failed to create announcement: ${error.message}`)
  }

  revalidatePath('/dashboard/announcements')
  revalidatePath('/dashboard/student')
  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function createResource(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const title = formData.get("title") as string || "Uploaded Resource"
  let fileUrl: string | null = null
  let resourceType = "pdf"

  const file = formData.get('file') as File | null
  
  if (file && file.size > 0) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${Date.now()}-${sanitizedName}`
      const fileBuffer = await file.arrayBuffer()
      
      const { error: uploadError } = await supabaseAdmin.storage.from('resources').upload(filePath, fileBuffer, {
        upsert: true,
        contentType: getUploadContentType(file)
      })

      if (uploadError) {
        console.error('Error uploading resource:', uploadError)
        throw new Error(`File upload failed: ${uploadError.message}`)
      } else {
        const { data: publicData } = supabaseAdmin.storage.from('resources').getPublicUrl(filePath)
        fileUrl = publicData?.publicUrl || null
      }
      
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext) resourceType = ext
    } catch(e: any) {
      console.error('File upload exception:', e)
      throw new Error(e?.message || 'File upload failed')
    }
  }

  const { error } = await supabaseAdmin.from('resources').insert({
    title,
    description: "Uploaded resource file.",
    file_url: fileUrl || "#",
    resource_type: resourceType,
    instructor_id: user.id
  })

  if (error) {
    console.error("Error creating resource:", error)
    throw new Error(`Failed to create resource: ${error.message}`)
  }

  revalidatePath('/dashboard/resources')
  return { success: true }
}

export async function createQuiz(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const timeLimit = parseInt(formData.get("time-limit") as string, 10)
  const maxAttempts = parseInt(formData.get("attempts") as string, 10)

  const { data, error } = await supabaseAdmin.from('quizzes').insert({
    title,
    description,
    time_limit_minutes: timeLimit || 30,
    max_attempts: maxAttempts || 1,
    instructor_id: user.id
  }).select().single()

  if (error) {
    console.error("Error creating quiz:", error)
    throw new Error(`Failed to create quiz: ${error.message}`)
  }

  revalidatePath('/dashboard/quizzes')
  return { success: true, quizId: data.id }
}

export async function saveQuizQuestions(quizId: string, title: string, questions: any[]) {
  const { supabaseAdmin } = await verifyAdminUser()

  // Update quiz title
  await supabaseAdmin.from('quizzes').update({ title }).eq('id', quizId)

  // Clear existing questions for this quiz
  await supabaseAdmin.from('quiz_questions').delete().eq('quiz_id', quizId)

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
    const { error } = await supabaseAdmin.from('quiz_questions').insert(questionsToInsert)
    if (error) {
      console.error("Error saving quiz questions:", error)
      throw new Error(`Failed to save quiz questions: ${error.message}`)
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
    throw new Error("Unauthorized: Please log in first.")
  }

  const assignmentId = formData.get("assignment_id") as string
  if (!assignmentId) throw new Error("Missing assignment ID")

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) {
    throw new Error("No file provided")
  }

  let fileUrl: string | null = null

  try {
    const supabaseAdmin = getAdminClient()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${Date.now()}-${sanitizedName}`
    
    const fileBuffer = await file.arrayBuffer()
    
    const { error: uploadError } = await supabaseAdmin.storage.from('submissions').upload(filePath, fileBuffer, {
      upsert: true,
      contentType: getUploadContentType(file)
    })

    if (uploadError) {
      console.error('Error uploading student submission:', uploadError)
      throw new Error(`File upload failed: ${uploadError.message}`)
    } else {
      const { data: publicData } = supabaseAdmin.storage.from('submissions').getPublicUrl(filePath)
      fileUrl = publicData?.publicUrl || null
    }
  } catch (e: any) {
    console.error('File upload exception:', e)
    throw new Error(e?.message || "File upload failed")
  }

  const supabaseAdmin = getAdminClient()
  const { error } = await supabaseAdmin.from('submissions').upsert({
    assignment_id: assignmentId,
    student_id: user.id,
    status: 'pending',
    file_url: fileUrl,
    submitted_at: new Date().toISOString()
  }, { onConflict: 'assignment_id,student_id' })

  if (error) {
    console.error("Error creating submission record:", error)
    throw new Error(`Failed to record submission: ${error.message}`)
  }

  revalidatePath(`/dashboard/assignments/${assignmentId}`)
  return { success: true }
}

export async function gradeSubmission(formData: FormData) {
  const { supabaseAdmin } = await verifyAdminUser()

  const submissionId = formData.get("submission_id") as string
  const studentId = formData.get("student_id") as string
  const assignmentId = formData.get("assignment_id") as string
  const score = parseInt(formData.get("score") as string, 10)
  
  if (!submissionId || !studentId || isNaN(score)) {
    throw new Error("Missing required grading fields")
  }

  // 1. Update submission
  const { error: subError } = await supabaseAdmin.from('submissions').update({
    status: 'graded',
    score: score
  }).eq('id', submissionId)

  if (subError) {
    console.error("Error updating submission:", subError)
    throw new Error(`Failed to update submission: ${subError.message}`)
  }

  // 2. Award XP to student
  const { data: profile } = await supabaseAdmin.from('profiles').select('xp').eq('id', studentId).single()
  const currentXp = profile?.xp || 0

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
    throw new Error("Unauthorized: Please log in first.")
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

  const supabaseAdmin = getAdminClient()

  // Check if the student has already submitted this quiz
  const { data: existingSubmission } = await supabaseAdmin
    .from('quiz_submissions')
    .select('id, score')
    .eq('quiz_id', quizId)
    .eq('student_id', user.id)
    .limit(1)
    .maybeSingle()

  if (existingSubmission) {
    // Already submitted — do NOT insert a new row or award XP.
    // Just return so the client can redirect to results showing the original score.
    return { success: true, score: existingSubmission.score, alreadySubmitted: true }
  }

  // Fetch the actual questions to grade it securely on the server
  const { data: questions } = await supabaseAdmin
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

  // Insert submission (first attempt only)
  const { error } = await supabaseAdmin.from('quiz_submissions').insert({
    quiz_id: quizId,
    student_id: user.id,
    score: score,
    time_spent_seconds: timeSpent,
    answers: userAnswers
  })

  if (error) {
    console.error("Error submitting quiz:", error)
    throw new Error(`Failed to submit quiz: ${error.message}`)
  }

  // Award XP based on score (first attempt only)
  try {
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
  const { supabaseAdmin } = await verifyAdminUser()

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if (!name || !email || !password) throw new Error("Missing required fields")

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

export async function awardStar(studentId: string) {
  const { supabaseAdmin } = await verifyAdminUser()

  // Fetch current stars
  const { data: studentProfile } = await supabaseAdmin.from('profiles').select('stars').eq('id', studentId).single()
  const currentStars = studentProfile?.stars || 0

  const { error } = await supabaseAdmin.from('profiles').update({
    stars: currentStars + 1
  }).eq('id', studentId)

  if (error) {
    console.error("Error awarding star:", error)
    throw new Error(`Failed to award star: ${error.message}`)
  }

  revalidatePath('/dashboard/students')
  revalidatePath(`/dashboard/students/${studentId}`)
  revalidatePath('/dashboard/leaderboard')
  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function removeStudent(studentId: string) {
  const { supabaseAdmin } = await verifyAdminUser()

  // 1. Delete from profiles
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', studentId)

  if (profileError) {
    console.error("Error deleting profile:", profileError)
  }

  // 2. Delete from auth.users (if user exists in auth)
  try {
    await supabaseAdmin.auth.admin.deleteUser(studentId)
  } catch (err) {
    console.warn("User might not exist in auth or already deleted:", err)
  }

  revalidatePath('/dashboard/students')
  revalidatePath('/dashboard/leaderboard')
  revalidatePath('/dashboard/admin')
  return { success: true }
}

export async function createProject(formData: FormData) {
  const { user, supabaseAdmin } = await verifyAdminUser()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const maxXp = parseInt(formData.get('max_xp') as string, 10) || 100
  const autoEnroll = formData.get('auto_enroll') === 'on'

  if (!title || !description) throw new Error('Missing required fields')

  const { data: project, error } = await supabaseAdmin
    .from('projects')
    .insert({ title, description, max_xp: maxXp, instructor_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw new Error(`Failed to create project: ${error.message}`)
  }

  // Auto-enroll all existing students if requested
  if (autoEnroll) {
    const { data: students } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('role', 'student')

    if (students && students.length > 0) {
      const enrollments = students.map(s => ({
        project_id: project.id,
        student_id: s.id,
        progress: 0,
        xp_awarded: 0,
      }))
      await supabaseAdmin.from('project_enrollments').insert(enrollments)
    }
  }

  revalidatePath('/dashboard/projects')
  return { success: true, projectId: project.id }
}

export async function updateProjectProgress(formData: FormData) {
  const { supabaseAdmin } = await verifyAdminUser()

  const enrollmentId = formData.get('enrollment_id') as string
  const studentId = formData.get('student_id') as string
  const projectId = formData.get('project_id') as string
  const progress = parseInt(formData.get('progress') as string, 10)
  const notes = (formData.get('notes') as string) || ''
  const maxXp = parseInt(formData.get('max_xp') as string, 10) || 100

  if (!enrollmentId || !studentId || isNaN(progress)) {
    throw new Error('Missing required fields')
  }

  // Fetch current enrollment to compute XP delta
  const { data: enrollment } = await supabaseAdmin
    .from('project_enrollments')
    .select('xp_awarded')
    .eq('id', enrollmentId)
    .single()

  const currentXpAwarded = enrollment?.xp_awarded || 0
  const newXpForProject = Math.floor((progress / 100) * maxXp)
  const delta = newXpForProject - currentXpAwarded

  // Update enrollment
  const { error: enrollError } = await supabaseAdmin
    .from('project_enrollments')
    .update({
      progress,
      xp_awarded: newXpForProject,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', enrollmentId)

  if (enrollError) {
    console.error('Error updating enrollment:', enrollError)
    throw new Error(`Failed to update progress: ${enrollError.message}`)
  }

  // Award XP delta to student profile (only if positive — never revoke)
  if (delta > 0) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('xp')
      .eq('id', studentId)
      .single()

    if (profile) {
      await supabaseAdmin
        .from('profiles')
        .update({ xp: profile.xp + delta })
        .eq('id', studentId)
    }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard/leaderboard')
  revalidatePath('/dashboard/admin')
  return { success: true, xpAwarded: delta > 0 ? delta : 0 }
}

export async function enrollStudentInProject(projectId: string, studentId: string) {
  const { supabaseAdmin } = await verifyAdminUser()

  const { error } = await supabaseAdmin
    .from('project_enrollments')
    .insert({ project_id: projectId, student_id: studentId, progress: 0, xp_awarded: 0 })

  if (error) {
    console.error('Error enrolling student:', error)
    throw new Error(`Failed to enroll student: ${error.message}`)
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}
