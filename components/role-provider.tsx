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
    const syncRole = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // First check profile table role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        if (profile?.role) {
          setRole(profile.role as Role)
          return
        }
        if (session.user.user_metadata?.role) {
          setRole(session.user.user_metadata.role as Role)
          return
        }
      }
      setRole("student")
    }
    
    syncRole()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single().then(({ data: profile }) => {
          if (profile?.role) {
            setRole(profile.role as Role)
          } else if (session.user?.user_metadata?.role) {
            setRole(session.user.user_metadata.role as Role)
          } else {
            setRole("student")
          }
        })
      } else {
        setRole("student")
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
