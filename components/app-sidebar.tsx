"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Award,
  Trophy,
  Megaphone,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const adminNav = [
  { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Students", url: "/dashboard/students", icon: Users },
  { name: "Assignments", url: "/dashboard/assignments", icon: BookOpen },
  { name: "Resources", url: "/dashboard/resources", icon: FileText },
  { name: "Quizzes", url: "/dashboard/quizzes", icon: Award },
  { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { name: "Announcements", url: "/dashboard/announcements", icon: Megaphone },
  { name: "Settings", url: "/dashboard/settings", icon: Settings },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BookOpen className="size-5" />
          </div>
          <span className="truncate">Cyber Talent</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {adminNav.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.name}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-muted-foreground text-center">
          &copy; 2026 Cyber Talent
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
