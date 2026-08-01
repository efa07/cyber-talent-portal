"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Target, Code, CheckCircle2, Award, Zap } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="relative pt-20">
        <div className="absolute inset-0 h-40 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent rounded-t-xl z-0" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 px-4 md:px-8">
          <Avatar className="h-32 w-32 border-4 border-background bg-background shadow-lg">
            <AvatarFallback className="text-4xl">AS</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Alex Smith</h1>
            <p className="text-muted-foreground mt-1">Student • Joined August 2026</p>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border">
              <span className="text-sm text-muted-foreground font-medium mb-1">Rank</span>
              <div className="flex items-center gap-1 font-bold text-xl">
                <Trophy className="h-5 w-5 text-yellow-500" /> #4
              </div>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-muted/50 border">
              <span className="text-sm text-muted-foreground font-medium mb-1">Stars</span>
              <div className="flex items-center gap-1 font-bold text-xl">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" /> 14
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-4">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-sm font-medium text-primary">Level 12 Developer</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">2,450</span>
                  <span className="text-sm text-muted-foreground ml-1">XP</span>
                </div>
              </div>
              <Progress value={65} className="h-3" />
              <p className="text-xs text-muted-foreground mt-3 text-center">150 XP to next level</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Fast Learner</h4>
                  <p className="text-xs text-muted-foreground">Completed 5 assignments early.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Perfect Score</h4>
                  <p className="text-xs text-muted-foreground">Scored 100% on 3 quizzes.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-muted-foreground opacity-50">
                  <Code className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Code Ninja</h4>
                  <p className="text-xs text-muted-foreground">Locked: Submit 20 assignments.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest submissions and quiz results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Assignments</h4>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-success/20 p-1.5 rounded-full text-success">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">React Hooks Deep Dive</p>
                      <Badge variant="outline" className="text-success border-success">Graded</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Score: 95/100</p>
                    <p className="text-xs text-muted-foreground">Submitted 2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-primary/20 p-1.5 rounded-full text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">CSS Grid Layout</p>
                      <Badge variant="secondary">Needs Grading</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Score: Pending</p>
                    <p className="text-xs text-muted-foreground">Submitted yesterday</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quizzes</h4>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-success/20 p-1.5 rounded-full text-success">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">JavaScript Fundamentals</p>
                      <Badge variant="outline" className="text-success border-success">100%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Taken on Oct 24 • +100 XP</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
