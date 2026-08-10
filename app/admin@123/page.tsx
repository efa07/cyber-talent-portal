"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [role, setRole] = useState("student")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    
    // Automatically redirect after a short delay since Supabase usually logs you in if email confirmation is off
    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-slate-100 text-center py-8">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Account Created!</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to Cyber Talent. Redirecting you to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-100">
        <CardHeader className="space-y-3 items-center text-center">
          <div className="bg-red-600 p-2 rounded-xl mb-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          <CardDescription className="text-base">Please contact your administrator for access</CardDescription>
        </CardHeader>
      </Card>
    </div>
    // <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    //   <Card className="w-full max-w-md shadow-xl border-slate-100">
    //     <CardHeader className="space-y-3 items-center text-center">
    //       <div className="bg-violet-600 p-2 rounded-xl mb-2">
    //         <BookOpen className="h-6 w-6 text-white" />
    //       </div>
    //       <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
    //       <CardDescription>Join Cyber Talent today to start learning</CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <form onSubmit={handleSignup} className="space-y-4">
    //         {error && (
    //           <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium">
    //             {error}
    //           </div>
    //         )}
    //         <div className="space-y-2">
    //           <Label htmlFor="fullName">Full Name</Label>
    //           <Input 
    //             id="fullName" 
    //             type="text" 
    //             placeholder="John Doe" 
    //             value={fullName}
    //             onChange={(e) => setFullName(e.target.value)}
    //             required
    //           />
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="email">Email</Label>
    //           <Input 
    //             id="email" 
    //             type="email" 
    //             placeholder="name@example.com" 
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //             required
    //           />
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="password">Password</Label>
    //           <Input 
    //             id="password" 
    //             type="password" 
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             required
    //             minLength={6}
    //           />
    //         </div>
            
    //         <div className="space-y-2 pt-2">
    //           <Label>I am a...</Label>
    //           <div className="grid grid-cols-2 gap-4">
    //             <button
    //               type="button"
    //               onClick={() => setRole("student")}
    //               className={`p-3 border rounded-xl text-sm font-semibold transition-colors ${
    //                 role === "student" 
    //                   ? "border-violet-600 bg-violet-50 text-violet-700" 
    //                   : "border-slate-200 text-slate-600 hover:border-violet-300"
    //               }`}
    //             >
    //               Student
    //             </button>
    //             <button
    //               type="button"
    //               onClick={() => setRole("admin")}
    //               className={`p-3 border rounded-xl text-sm font-semibold transition-colors ${
    //                 role === "admin" 
    //                   ? "border-violet-600 bg-violet-50 text-violet-700" 
    //                   : "border-slate-200 text-slate-600 hover:border-violet-300"
    //               }`}
    //             >
    //               Instructor
    //             </button>
    //           </div>
    //         </div>

    //         <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 mt-6" disabled={loading}>
    //           {loading ? "Creating account..." : "Sign Up"}
    //         </Button>
    //       </form>
    //     </CardContent>
    //     <CardFooter className="justify-center border-t p-4 mt-4">
    //       <p className="text-sm text-slate-500">
    //         Already have an account?{" "}
    //         <Link href="/login" className="text-violet-600 font-semibold hover:underline">
    //           Sign in
    //         </Link>
    //       </p>
    //     </CardFooter>
    //   </Card>
    // </div>
  )
}
