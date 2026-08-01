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

  // Mock description and file URL for now since the form doesn't have a description field 
  // and we don't have storage set up for the file yet.
  const description = "New assignment created by instructor."
  const fileUrl = "#"

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
