"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, Download, FileJson, FileCode2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const resources = [
  { id: 1, title: "React Lifecycle Cheatsheet", type: "pdf", week: "Week 2", date: "Oct 15, 2026", size: "1.2 MB", icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
  { id: 2, title: "Next.js App Router Guide", type: "docx", week: "Week 4", date: "Oct 22, 2026", size: "2.4 MB", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, title: "Tailwind CSS Utility Classes", type: "pdf", week: "Week 3", date: "Oct 18, 2026", size: "3.1 MB", icon: FileText, color: "text-red-500", bg: "bg-red-500/10" },
  { id: 4, title: "TypeScript Interface Examples", type: "ts", week: "Week 5", date: "Oct 29, 2026", size: "45 KB", icon: FileCode2, color: "text-blue-600", bg: "bg-blue-600/10" },
  { id: 5, title: "Mock Data JSON", type: "json", week: "Week 1", date: "Oct 05, 2026", size: "120 KB", icon: FileJson, color: "text-yellow-500", bg: "bg-yellow-500/10" },
]

export default function ResourcesPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    simulateUpload()
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsUploading(false), 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Resources</h1>
          <p className="text-muted-foreground mt-1">Upload and manage study materials.</p>
        </div>
      </div>

      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
          <div className="p-4 bg-muted rounded-full">
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Drag & drop files to upload</h3>
            <p className="text-sm text-muted-foreground">Support for PDF, DOCX, ZIP, JSON, and TS files up to 50MB.</p>
          </div>
          
          {isUploading ? (
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading file...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          ) : (
            <Button variant="outline" onClick={simulateUpload}>Browse Files</Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {resources.map((resource) => (
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
              <Button variant="secondary" className="w-full gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
