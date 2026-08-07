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
  ChevronRight,
  BookOpen,
  LogOut,
  Sparkles,
  CheckCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRole } from "@/components/role-provider"
import { createClient } from "@/utils/supabase/client"

const adminNav = [
  { name: "Dashboard", url: "/dashboard/admin", icon: Home, hasArrow: false },
  { name: "Students", url: "/dashboard/students", icon: Users, hasArrow: true },
  { name: "Assignments", url: "/dashboard/assignments", icon: FileText, hasArrow: true },
  { name: "Submissions", url: "/dashboard/assignments/submissions", icon: CheckCircle, hasArrow: true },
  { name: "Resources", url: "/dashboard/resources", icon: Folder, hasArrow: true },
  { name: "Quizzes", url: "/dashboard/quizzes", icon: ClipboardList, hasArrow: true },
  { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy, hasArrow: false },
  { name: "Announcements", url: "/dashboard/announcements", icon: Megaphone, hasArrow: false },
]

const studentNav = [
  { name: "Dashboard", url: "/dashboard", icon: Home, hasArrow: false },
  { name: "My Assignments", url: "/dashboard/assignments", icon: FileText, hasArrow: true },
  { name: "Resources", url: "/dashboard/resources", icon: Folder, hasArrow: true },
  { name: "Quizzes", url: "/dashboard/quizzes", icon: ClipboardList, hasArrow: true },
  { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy, hasArrow: false },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const { role } = useRole()
  const supabase = createClient()
  
  const navItems = role === "admin" ? adminNav : studentNav

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Sidebar
      style={{ "--sidebar-width": "15.5rem" } as React.CSSProperties}
      className="border-r border-[#ECECF3] bg-[#FFFFFF] text-[#111827] transition-all duration-200"
      {...props}
    >
      <SidebarHeader className="pt-6 pb-4 px-5 bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#684DF4] text-white shadow-sm shadow-[#684DF4]/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-bold text-[#111827] tracking-tight">Cyber Talent</span>
            <span className="text-[11px] font-medium text-[#684DF4]">Cyber Range Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 bg-[#FFFFFF]">
        <SidebarMenu className="gap-1.5 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard/admin" && item.url !== "/dashboard" && pathname.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  render={
                    <Link href={item.url} className="flex items-center w-full h-full gap-3 group/link">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-xl transition-colors ${
                        isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-[#F5F3FF] text-[#684DF4] group-hover/link:bg-[#684DF4] group-hover/link:text-white"
                      }`}>
                        <item.icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-white" : "text-[#684DF4] group-hover/link:text-white"}`} />
                      </div>
                      <span className={`text-sm font-medium ${isActive ? "text-white" : "text-[#111827] group-hover/link:text-[#684DF4]"}`}>{item.name}</span>
                      {item.hasArrow && (
                        <ChevronRight className={`ml-auto h-3.5 w-3.5 opacity-60 transition-colors ${isActive ? "text-white" : "text-[#6B7280] group-hover/link:text-[#684DF4]"}`} />
                      )}
                    </Link>
                  }
                  className={`h-11 px-3.5 rounded-2xl transition-all duration-200 ${
                    isActive 
                    ? "!bg-[#684DF4] !text-white hover:!bg-[#7C3AED] shadow-sm shadow-[#684DF4]/25" 
                    : "text-[#6B7280] hover:bg-[#F5F3FF] hover:text-[#684DF4]"
                  }`}
                />
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-[#FFFFFF] pb-6">
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#FAFBFC] p-2.5 text-[#6B7280] transition-all duration-200 hover:bg-[#EF4444]/10 hover:text-[#EF4444] border border-[#ECECF3] hover:border-[#EF4444]/30 w-full text-xs font-medium cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </button>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-2xl bg-[#F5F3FF] border border-[#684DF4]/10">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#684DF4] text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col text-[10px] text-[#6B7280]">
              <span className="font-semibold text-[#684DF4]">Cyber Talent Room</span>
              <span>v1.0 • Connected</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
