"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export type Role = "admin" | "student"

interface RoleContextType {
  role: Role
  setRole: (role: Role) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("student")
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial session role
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role) {
        setRole(session.user.user_metadata.role as Role)
      }
    }
    
    getSession()

    // Listen for auth state changes (e.g. login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.user_metadata?.role) {
        setRole(session.user.user_metadata.role as Role)
      } else {
        setRole("student") // fallback
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider")
  }
  return context
}
