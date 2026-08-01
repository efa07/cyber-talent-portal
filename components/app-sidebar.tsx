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
  ChevronDown,
  BookOpen
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  return (
    <Sidebar className="border-r-0 !bg-[#0B0C10] text-slate-300 w-[300px]" {...props}>
      <SidebarHeader className="pt-8 pb-4 px-6 !bg-[#0B0C10]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-semibold text-white tracking-wide">Cyber Talent</span>
            <span className="text-[13px] font-medium text-violet-400">Learn. Code. Grow.</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 !bg-[#0B0C10]">
        <SidebarMenu className="gap-1 mt-2">
          {adminNav.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/dashboard/admin" && pathname.startsWith(item.url))
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  className={`h-[48px] px-3 rounded-xl transition-all relative overflow-hidden ${
                    isActive 
                    ? "!bg-[#1A1625] text-white hover:!bg-[#1A1625] hover:text-white" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Link href={item.url} className="flex items-center w-full h-full">
                    {isActive && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500" />
                    )}
                    <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-violet-400" : ""}`} />
                    <span className="ml-4 text-[15px] font-medium">{item.name}</span>
                    {item.hasArrow && (
                      <ChevronRight className="ml-auto h-4 w-4 text-slate-600" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        <div className="h-px bg-slate-800/50 my-6 mx-2" />

        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider text-slate-500 mb-3 px-1 uppercase">
            Quick Actions
          </SidebarGroupLabel>
          <div className="flex flex-col gap-3">
            <button className="flex items-center gap-3 rounded-xl bg-[#13151A] p-3 text-left transition-colors hover:bg-[#1A1C23] border border-slate-800/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-200">Create Assignment</span>
                <span className="text-[12px] text-slate-500 mt-0.5">Add a new assignment</span>
              </div>
            </button>
            <button className="flex items-center gap-3 rounded-xl bg-[#13151A] p-3 text-left transition-colors hover:bg-[#1A1C23] border border-slate-800/30">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white">
                <FilePlus className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-medium text-slate-200">Upload Resource</span>
                <span className="text-[12px] text-slate-500 mt-0.5">Add study material</span>
              </div>
            </button>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-5 !bg-[#0B0C10] pb-6">
        <div className="flex flex-col gap-5">
      
          
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1A1625] text-violet-500">
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
