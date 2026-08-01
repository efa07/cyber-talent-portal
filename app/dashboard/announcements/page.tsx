import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pin, CalendarClock, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/server"
import { CreateAnnouncementDialog } from "./create-announcement-dialog"

export default async function AnnouncementsPage() {
  const supabase = await createClient()

  // Get current user and their DB role
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'student'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) role = profile.role
  }

  // Fetch announcements
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select(`
      *,
      author:profiles(full_name)
    `)
    .order('created_at', { ascending: false })

  const announcements = (announcementsData || []).map((ann) => {
    return {
      id: ann.id,
      title: ann.title,
      content: ann.content,
      date: new Date(ann.created_at).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
      }),
      author: ann.author?.full_name || "Unknown",
      pinned: ann.type === "info", // Mock pinned state for now based on type
    }
  })

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-4 md:pt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1">Stay updated with the latest news and notices.</p>
        </div>
        {role === "admin" && (
          <CreateAnnouncementDialog />
        )}
      </div>

      <div className="relative border-l-2 border-muted ml-3 md:ml-6 space-y-8 pb-12">
        {announcements.length > 0 ? announcements.map((announcement) => (
          <div key={announcement.id} className="relative pl-6 md:pl-8">
            <div className={`absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background ${announcement.pinned ? 'bg-primary' : 'bg-muted-foreground'}`}>
              {announcement.pinned ? (
                <Pin className="h-3 w-3 text-primary-foreground fill-primary-foreground" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-background" />
              )}
            </div>

            <Card className={`relative overflow-hidden ${announcement.pinned ? 'border-primary/50 shadow-md shadow-primary/5' : ''}`}>
              {announcement.pinned && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-bl-lg flex items-center gap-1">
                  <Pin className="h-3 w-3 fill-current" /> Pinned
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <CalendarClock className="h-4 w-4" />
                  <span>{announcement.date}</span>
                </div>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {announcement.content}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {announcement.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{announcement.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-foreground">
                    <MessageSquare className="h-4 w-4" /> 
                    <span className="text-xs">Comment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )) : (
          <div className="text-center py-12 text-muted-foreground">
            No announcements yet.
          </div>
        )}
      </div>
    </div>
  )
}
