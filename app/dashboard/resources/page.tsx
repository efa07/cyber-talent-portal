import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, FileJson, FileCode2, Link as LinkIcon, File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/utils/supabase/server"
import { ResourcesUpload } from "./resources-upload"

const iconMap: Record<string, any> = {
  pdf: FileText,
  docx: FileText,
  ts: FileCode2,
  json: FileJson,
  link: LinkIcon,
}

const colorMap: Record<string, string> = {
  pdf: "text-red-500",
  docx: "text-blue-500",
  ts: "text-blue-600",
  json: "text-yellow-500",
  link: "text-emerald-500",
}

const bgMap: Record<string, string> = {
  pdf: "bg-red-500/10",
  docx: "bg-blue-500/10",
  ts: "bg-blue-600/10",
  json: "bg-yellow-500/10",
  link: "bg-emerald-500/10",
}

export default async function ResourcesPage() {
  const supabase = await createClient()

  // Get current user and their DB role
  const { data: { user } } = await supabase.auth.getUser()
  let role = 'student'
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) role = profile.role
  }

  // Fetch resources
  const { data: resourcesData } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  const resources = (resourcesData || []).map((resource) => {
    // Determine type from resource_type
    const type = resource.resource_type.toLowerCase()
    const Icon = iconMap[type] || File
    const color = colorMap[type] || "text-zinc-500"
    const bg = bgMap[type] || "bg-zinc-500/10"

    return {
      id: resource.id,
      title: resource.title,
      type: type,
      week: "Module Resource", // Mock week for now
      date: new Date(resource.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      size: "Unknown", // Real size would require storage API
      icon: Icon,
      color: color,
      bg: bg,
      url: resource.file_url
    }
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Resources</h1>
          <p className="text-muted-foreground mt-1">
            {role === "admin" ? "Upload and manage study materials." : "View and download study materials."}
          </p>
        </div>
      </div>

      {role === "admin" && (
        <ResourcesUpload />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resources.length > 0 ? resources.map((resource) => (
          <Card key={resource.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-5 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${resource.bg}`}>
                  <resource.icon className={`h-6 w-6 ${resource.color}`} />
                </div>
                <Badge variant="outline">{resource.week}</Badge>
              </div>
              <div className="mb-4 flex-1">
                <h3 className="font-semibold line-clamp-2" title={resource.title}>
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Uploaded on {resource.date}
                </p>
                <p className="text-xs font-mono text-muted-foreground mt-2">
                  {resource.type.toUpperCase()} • {resource.size}
                </p>
              </div>
              <Button 
                variant="secondary" 
                className="w-full gap-2" 
                render={<a href={resource.url} target="_blank" rel="noopener noreferrer" />}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No resources found.
          </div>
        )}
      </div>
    </div>
  )
}
