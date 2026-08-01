import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Award, BookOpen, Clock, Mail, Shield, Star, Trophy } from "lucide-react"
import Link from "next/link"

// Mock data for a specific student
const student = {
  id: "1",
  name: "Emma Watson",
  email: "emma.w@example.com",
  joined: "Sep 2025",
  rank: 1,
  xp: 2450,
  stars: 14,
  status: "Active",
  initials: "EW",
  avatar: "/avatars/01.png",
  bio: "Aspiring Penetration Tester. Love CTFs and web app security.",
  stats: {
    modulesCompleted: 8,
    totalModules: 12,
    assignmentsSubmitted: 15,
    averageScore: 92,
  },
  recentActivity: [
    { id: 1, action: "Completed Module", target: "Network Reconnaissance", time: "2 days ago" },
    { id: 2, action: "Earned Badge", target: "First Blood (Web Auth)", time: "5 days ago" },
    { id: 3, action: "Submitted Assignment", target: "SQL Injection Lab", time: "1 week ago" },
  ],
  skills: [
    { name: "Web Application Security", progress: 85 },
    { name: "Network Penetration", progress: 60 },
    { name: "Cryptography", progress: 40 },
  ]
}

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
          <p className="text-muted-foreground mt-1">Detailed view of student progress and activity.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Sidebar */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-muted">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback className="text-2xl">{student.initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{student.name}</CardTitle>
            <CardDescription>{student.bio}</CardDescription>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                {student.status}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Trophy className="h-3 w-3 text-yellow-500" /> Rank #{student.rank}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Joined {student.joined}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono">{student.xp.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center gap-1">
                  {student.stars} <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
                <div className="text-xs text-muted-foreground">Stars Earned</div>
              </div>
            </div>

            <Button className="w-full">Message Student</Button>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.stats.modulesCompleted}/{student.stats.totalModules}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{student.stats.assignmentsSubmitted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">{student.stats.averageScore}%</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="progress">Learning Progress</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Matrix</CardTitle>
                  <CardDescription>Current proficiency across different domains.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {student.skills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium flex items-center gap-2">
                          {index === 0 ? <Shield className="h-4 w-4" /> : index === 1 ? <BookOpen className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                          {skill.name}
                        </span>
                        <span className="text-muted-foreground">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent actions performed by the student.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {student.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center">
                        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Clock className="h-4 w-4" />
                        </span>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.target}
                          </p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
