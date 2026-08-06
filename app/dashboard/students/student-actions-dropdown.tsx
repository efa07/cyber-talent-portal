"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Award, Edit, Trash, Loader2 } from "lucide-react"
import { awardStar, removeStudent } from "@/app/actions"

export function StudentActionsDropdown({ studentId }: { studentId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAwardStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    startTransition(async () => {
      try {
        await awardStar(studentId)
        router.refresh()
      } catch (err: any) {
        console.error("Failed to award star:", err)
        alert(err.message || "Failed to award star")
      }
    })
  }

  const handleRemoveStudent = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to remove this student? This action cannot be undone.")) {
      return
    }
    startTransition(async () => {
      try {
        await removeStudent(studentId)
        router.refresh()
      } catch (err: any) {
        console.error("Failed to remove student:", err)
        alert(err.message || "Failed to remove student")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            render={
              <Link href={`/dashboard/students/${studentId}`}>
                <Eye className="mr-2 h-4 w-4" /> View Profile
              </Link>
            }
          />
          <DropdownMenuItem onClick={handleAwardStar} className="cursor-pointer">
            <Award className="mr-2 h-4 w-4 text-[#F59E0B]" /> Award Star
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link href={`/dashboard/students/${studentId}`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </Link>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleRemoveStudent} className="text-destructive cursor-pointer">
            <Trash className="mr-2 h-4 w-4" /> Remove Student
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
