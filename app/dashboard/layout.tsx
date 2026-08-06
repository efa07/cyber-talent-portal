import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { RoleProvider } from "@/components/role-provider"
import { Search, Bell, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

function getInitials(name: string) {
  if (!name) return "A"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning"
  if (hour < 17) return "Good Afternoon"
  return "Good Evening"
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user?.id) {
    const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
    profile = data
  }

  const greeting = getGreeting()
  const roleName = profile?.role === 'admin' ? 'Admin' : (profile?.full_name || 'User')

  return (
    <RoleProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-screen bg-[#FAFBFC]">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-[#ECECF3] bg-[#FFFFFF] px-6 shadow-xs">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-[#6B7280] hover:text-[#111827] transition-colors" />
              <div>
                <h1 className="text-sm font-semibold text-[#111827] flex items-center gap-1.5">
                  {greeting} 👋
                </h1>
                <p className="text-xs text-[#6B7280]">
                  Welcome back, {roleName}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 rounded-xl border border-[#ECECF3] bg-[#FAFBFC] px-3 py-1.5 text-xs text-[#6B7280] hover:border-[#684DF4]/30 transition-all cursor-pointer">
                <Search className="h-3.5 w-3.5 text-[#6B7280]" />
                <span>Search...</span>
                <kbd className="ml-4 pointer-events-none hidden sm:inline-flex h-4 items-center gap-1 rounded border border-[#ECECF3] bg-white px-1.5 font-mono text-[10px] text-[#6B7280]">
                  ⌘K
                </kbd>
              </div>

              {/* Notification Bell */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECECF3] bg-white text-[#6B7280] hover:text-[#684DF4] hover:border-[#684DF4]/40 hover:bg-[#F5F3FF] transition-all duration-200 cursor-pointer">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-white" />
              </button>

              {/* Settings Icon */}
              <Link
                href="/dashboard/settings"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ECECF3] bg-white text-[#6B7280] hover:text-[#684DF4] hover:border-[#684DF4]/40 hover:bg-[#F5F3FF] transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
              </Link>

              {/* User Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#684DF4] text-white text-xs font-bold shadow-sm shadow-[#684DF4]/20 cursor-pointer hover:bg-[#7C3AED] transition-all">
                {getInitials(profile?.full_name || roleName)}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  )
}
