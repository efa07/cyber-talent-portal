import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Users,
  FileText,
  CheckSquare,
  Trophy,
  TrendingUp,
  ArrowRight,
  MonitorPlay,
  GraduationCap,
  Sparkles,
  Globe,
  Code2,
  Bell,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-violet-600 p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Cyber Talent</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="text-violet-600 border-b-2 border-violet-600 pb-1">Home</Link>
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#students" className="hover:text-foreground transition-colors">For Students</Link>
            <Link href="#instructors" className="hover:text-foreground transition-colors">For Instructors</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-foreground hidden sm:block">Log in</Link>
            <Link href="/signup">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold text-violet-600 bg-violet-50 border-violet-100">
              Learn. Code. Grow.
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Empowering Learners.<br/>
              <span className="text-violet-600">Enabling Instructors.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
              Cyber Talent is a modern learning platform for programming classes. Assign, test, track progress, and build a community of high achievers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white rounded-full h-14 px-8 text-base">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base bg-white">
                Explore Features
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    {/* Placeholder for avatars */}
                    <div className="w-full h-full bg-slate-300" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Trusted by instructors and students<br/>building the future.
              </p>
            </div>
          </div>

          {/* Hero Dashboard Mockup */}
          <div className="relative mx-auto w-full max-w-[600px] aspect-[4/3] bg-white rounded-2xl shadow-2xl border flex overflow-hidden">
             {/* Mock Sidebar */}
             <div className="w-48 border-r bg-slate-50/50 p-4 flex flex-col gap-4">
               <div className="flex items-center gap-2 mb-4">
                 <div className="bg-violet-600 p-1 rounded"><BookOpen className="h-3 w-3 text-white" /></div>
                 <span className="text-xs font-bold">Cyber Talent</span>
               </div>
               <div className="space-y-1">
                 <div className="bg-violet-100 text-violet-700 text-xs font-medium p-2 rounded-md flex items-center gap-2">
                   <MonitorPlay className="h-3 w-3" /> Dashboard
                 </div>
                 {['Students', 'Assignments', 'Resources', 'Quizzes', 'Leaderboard', 'Settings'].map(item => (
                   <div key={item} className="text-slate-500 text-xs font-medium p-2 flex items-center gap-2">
                     <div className="w-3 h-3 rounded-sm bg-slate-200" /> {item}
                   </div>
                 ))}
               </div>
             </div>
             {/* Mock Content */}
             <div className="flex-1 p-6 bg-white flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">Welcome back, Cyber Teacher 👋</h3>
                    <p className="text-[10px] text-slate-500">Here's what's happening in your class today.</p>
                  </div>
                  <Bell className="h-4 w-4 text-slate-400" />
                </div>
                {/* Mock Stats */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="border rounded-lg p-2">
                    <div className="text-lg font-bold">30</div>
                    <div className="text-[9px] text-slate-500">Students</div>
                  </div>
                  <div className="border rounded-lg p-2">
                    <div className="text-lg font-bold">8</div>
                    <div className="text-[9px] text-slate-500">Assignments Active</div>
                  </div>
                  <div className="border rounded-lg p-2">
                    <div className="text-lg font-bold">12</div>
                    <div className="text-[9px] text-slate-500">Submissions Pending</div>
                  </div>
                  <div className="border rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600">85%</div>
                    <div className="text-[9px] text-slate-500">Avg Quiz Score</div>
                  </div>
                </div>
                {/* Mock Chart & List */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div className="border rounded-lg p-3 flex flex-col">
                    <div className="text-xs font-semibold mb-2">Class Activity</div>
                    <div className="flex-1 border-b-2 border-l-2 border-slate-100 relative">
                       {/* SVG Mock Chart */}
                       <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M0,80 Q20,60 40,70 T80,30 T100,20" fill="none" stroke="#7c3aed" strokeWidth="2" />
                         <circle cx="0" cy="80" r="2" fill="#7c3aed" />
                         <circle cx="40" cy="70" r="2" fill="#7c3aed" />
                         <circle cx="80" cy="30" r="2" fill="#7c3aed" />
                         <circle cx="100" cy="20" r="2" fill="#7c3aed" />
                       </svg>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-semibold">Recent Submissions</div>
                      <div className="text-[9px] text-violet-600">View all</div>
                    </div>
                    {[1,2,3].map(i => (
                      <div key={i} className="flex justify-between items-center bg-slate-50 p-1.5 rounded">
                        <div>
                          <div className="text-[10px] font-medium">Project Task {i}</div>
                          <div className="text-[8px] text-slate-500">Student Name • 2h ago</div>
                        </div>
                        <div className="text-[8px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Pending</div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <Badge variant="secondary" className="bg-violet-50 text-violet-600 hover:bg-violet-50 border-transparent uppercase tracking-wider text-xs font-bold">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Everything You Need to Teach and Learn</h2>
              <p className="text-lg text-slate-600">Powerful tools designed for modern classrooms.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Student Management", icon: Users, desc: "Manage your students, track progress, and celebrate achievements." },
                { title: "Assignments", icon: FileText, desc: "Create assignments, collect submissions, and provide feedback." },
                { title: "Resources", icon: BookOpen, desc: "Upload and share PDFs, code examples, and learning materials." },
                { title: "Quizzes & Tests", icon: CheckSquare, desc: "Build quizzes and tests with auto-grading and instant results." },
                { title: "Leaderboard", icon: Trophy, desc: "Motivate students with leaderboards, XP, and star rewards." },
                { title: "Progress Tracking", icon: TrendingUp, desc: "Visualize performance with beautiful charts and insights." },
              ].map((feature, i) => (
                <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-12 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: GraduationCap, num: "30+", label: "Active Students" },
                { icon: FileText, num: "100+", label: "Assignments Created" },
                { icon: CheckSquare, num: "250+", label: "Quizzes Taken" },
                { icon: Sparkles, num: "500+", label: "Stars Awarded" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center text-center space-y-2">
                  <stat.icon className="h-8 w-8 text-violet-600 mb-2" />
                  <div className="text-3xl font-extrabold text-slate-900">{stat.num}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Split Audience Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8">
            
            {/* For Students */}
            <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-6 relative z-10 max-w-[300px]">
                <div className="text-sm font-bold tracking-wider text-violet-600 uppercase">For Students</div>
                <h3 className="text-3xl font-bold text-slate-900">Learn. Practice. Achieve.</h3>
                <p className="text-slate-600">Access assignments, take quizzes, earn stars, and compete on the leaderboard.</p>
                <ul className="space-y-3">
                  {[
                    "Submit assignments easily",
                    "Track your progress",
                    "Earn XP and unlock achievements",
                    "Climb the leaderboard"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-violet-600" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="bg-white rounded-full mt-4">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              {/* Mock Student UI */}
              <div className="absolute right-[-20%] bottom-0 w-2/3 max-w-[300px]">
                 <div className="bg-white p-4 rounded-t-2xl shadow-xl border border-b-0 space-y-4">
                   <div className="text-sm font-bold">Your Progress</div>
                   <div className="aspect-square rounded-full border-8 border-violet-100 flex items-center justify-center relative">
                     <div className="text-2xl font-bold">85%</div>
                     <svg className="absolute inset-0 h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="#7c3aed" strokeWidth="8" strokeDasharray="289" strokeDashoffset="43" className="text-violet-600" />
                     </svg>
                   </div>
                   <div>
                     <div className="text-xs font-bold">XP Progress</div>
                     <div className="text-[10px] text-slate-500 mb-1">Level 4</div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-violet-600 w-3/4" />
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* For Instructors */}
            <div className="grid grid-rows-2 gap-8">
              <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
                <div className="space-y-6 max-w-[350px]">
                  <div className="text-sm font-bold tracking-wider text-violet-600 uppercase">For Instructors</div>
                  <h3 className="text-3xl font-bold text-slate-900">Teach. Inspire. Grow.</h3>
                  <p className="text-slate-600">Create content, monitor performance, and help students succeed.</p>
                  <ul className="space-y-3">
                    {[
                      "Create assignments & quizzes",
                      "Grade submissions",
                      "Award stars and XP",
                      "Monitor class performance"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-violet-600" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <Button variant="outline" className="bg-white rounded-full mt-4">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Purple CTA */}
              <div className="bg-violet-600 rounded-3xl p-8 lg:p-12 text-white flex flex-col justify-center">
                <Sparkles className="h-8 w-8 mb-6 text-violet-200" />
                <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-violet-100 mb-8 max-w-[300px]">
                  Join Cyber Talent and transform the way you teach and learn.
                </p>
                <Link href="/signup">
                  <Button className="bg-white text-violet-600 hover:bg-slate-50 rounded-full h-12 px-8 self-start w-full sm:w-auto">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-violet-200 mt-4">No credit card required</p>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12 lg:py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-violet-600 p-1 rounded">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Cyber Talent</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              A modern learning platform for programming classes.
            </p>
            <p className="text-xs text-slate-400 pt-8">
              © 2026 Cyber Talent. All rights reserved.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Product</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-violet-600">Features</Link></li>
              <li><Link href="#" className="hover:text-violet-600">For Students</Link></li>
              <li><Link href="#" className="hover:text-violet-600">For Instructors</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900">Company</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-violet-600">About</Link></li>
              <li><Link href="#" className="hover:text-violet-600">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-violet-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="space-y-4 col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-bold text-sm text-slate-900">Stay Updated</h4>
            <p className="text-sm text-slate-500">Get the latest updates and tips.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="bg-slate-50" />
              <Button className="bg-violet-600 hover:bg-violet-700 text-white">Subscribe</Button>
            </div>
            <div className="flex gap-4 pt-4 text-slate-400">
              <Globe className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
              <Code2 className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
              <GraduationCap className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
