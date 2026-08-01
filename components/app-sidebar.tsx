"use client"

import * as React from "react"
import {
  Home,
  Users,
  FileText,
  Folder,
  ClipboardList,
  Trophy,
  Megaphone,
  Settings,
  ChevronRight,
  PlusCircle,
  FilePlus,
  BookOpen,
  UserCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRole } from "@/components/role-provider"

const adminNav = [
  { name: "Dashboard", url: "/dashboard/admin", icon: Home, hasArrow: false },
  { name: "Students", url: "/dashboard/students", icon: Users, hasArrow: true },
  { name: "Assignments", url: "/dashboard/assignments", icon: FileText, hasArrow: true },
  { name: "Resources", url: "/dashboard/resources", icon: Folder, hasArrow: true },
  { name: "Quizzes", url: "/dashboard/quizzes", icon: ClipboardList, hasArrow: true },
  { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy, hasArrow: false },
  { name: "Announcements", url: "/dashboard/announcements", icon: Megaphone, hasArrow: false },
  { name: "Settings", url: "/dashboard/settings", icon: Settings, hasArrow: false },
]

const studentNav = [
  { name: "Dashboard", url: "/dashboard", icon: Home, hasArrow: false },
  { name: "My Assignments", url: "/dashboard/assignments", icon: FileText, hasArrow: true },
  { name: "Resources", url: "/dashboard/resources", icon: Folder, hasArrow: true },
  { name: "Quizzes", url: "/dashboard/quizzes", icon: ClipboardList, hasArrow: true },
  { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy, hasArrow: false },
  { name: "Settings", url: "/dashboard/settings", icon: Settings, hasArrow: false },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { role, setRole } = useRole()
  
  const navItems = role === "admin" ? adminNav : studentNav

  return (
    <Sidebar
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
      className="border-r border-border bg-background text-foreground"
      {...props}
    >
      <SidebarHeader className="pt-8 pb-4 px-6 bg-background">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold text-foreground tracking-wide">Cyber Talent</span>
            <span className="text-[13px] font-medium text-violet-600">Learn. Code. Grow.</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 bg-background">
        <SidebarMenu className="gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard/admin" && item.url !== "/dashboard" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild
                  className={`h-[48px] px-3 rounded-xl transition-all relative overflow-hidden ${
                    isActive 
                    ? "!bg-violet-50 text-violet-700 hover:!bg-violet-50 hover:text-violet-700" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Link href={item.url} className="flex items-center w-full h-full">
                    {isActive && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                    )}
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-violet-600" : ""}`} />
                    <span className="ml-4 text-[15px] font-medium">{item.name}</span>
                    {item.hasArrow && (
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-5 bg-background pb-6">
        <div className="flex flex-col gap-5">
          <button 
            onClick={() => setRole(role === "admin" ? "student" : "admin")}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 p-3 transition-colors hover:bg-slate-200 border border-slate-200 w-full text-slate-600 hover:text-slate-900"
          >
            <UserCircle className="h-4 w-4" />
            <span className="text-[13px] font-medium">Viewing as: {role === "admin" ? "Admin" : "Student"}</span>
          </button>
          
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col text-[11px] text-slate-500">
              <span>&copy; 2026 Cyber Talent</span>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
