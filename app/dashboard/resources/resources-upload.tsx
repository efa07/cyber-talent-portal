"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UploadCloud } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useState, useRef, useTransition } from "react"
import { createResource } from "@/app/actions"

export function ResourcesUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Finished uploading, now call server action
          const formData = new FormData()
          formData.append("title", file.name)
          
          startTransition(async () => {
            try {
              await createResource(formData)
              setTimeout(() => setIsUploading(false), 500)
            } catch (error) {
              console.error(error)
              setIsUploading(false)
            }
          })
          
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card 
      className={`border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-10 space-y-4 text-center relative">
        <div className="p-4 bg-muted rounded-full">
          <UploadCloud className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">Drag & drop files to upload</h3>
          <p className="text-sm text-muted-foreground">Support for PDF, DOCX, ZIP, JSON, and TS files up to 50MB.</p>
        </div>
        
        {isUploading || isPending ? (
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{isPending ? "Saving resource..." : "Uploading file..."}</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        ) : (
          <>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
