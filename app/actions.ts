"use server"

import { createClient } from "@/utils/supabase/server"
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
  if (file && (file as any).size > 0) {
    try {
      const fileName = `${Date.now()}-${(file as any).name}`
      const filePath = `assignments/${fileName}`
      const fileBuffer = Buffer.from(await (file as any).arrayBuffer())

      const { error: uploadError } = await supabase.storage.from('assignments').upload(filePath, fileBuffer, {
        contentType: (file as any).type || 'application/octet-stream',
        upsert: false,
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
        // fallback to placeholder
      } else {
        const { data: publicData } = supabase.storage.from('assignments').getPublicUrl(filePath)
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
  if (file && (file as any).size > 0) {
    try {
      const fileName = `${Date.now()}-${(file as any).name}`
      const filePath = `assignments/${fileName}`
      const fileBuffer = Buffer.from(await (file as any).arrayBuffer())

      const { error: uploadError } = await supabase.storage.from('assignments').upload(filePath, fileBuffer, {
        contentType: (file as any).type || 'application/octet-stream',
        upsert: false,
      })

      if (uploadError) {
        console.error('Error uploading file to storage:', uploadError)
      } else {
        const { data: publicData } = supabase.storage.from('assignments').getPublicUrl(filePath)
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
  const fileUrl = "#" // Mock until storage is setup
  
  // We'll just randomly assign a type for mock purposes based on the file name or default to pdf
  const resourceType = "pdf"

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
