"use client"

import { LoginForm } from "@/components/login-form"
import { Code2 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Code2 className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Cyber Talent Room</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-zinc-950 lg:flex flex-col justify-between p-10 text-white overflow-hidden border-l border-border/40">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex items-center text-lg font-medium">
          Programming Class LMS
        </div>
        
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg text-zinc-300">
              "Mastering code is not about writing commands. It's about crafting solutions."
            </p>
            <footer className="text-sm text-zinc-500">Instructor Dashboard</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
