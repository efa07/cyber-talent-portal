import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Medal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/server"

function getInitials(name: string) {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

export default async function LeaderboardPage() {
  const supabase = await createClient()
  
  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('xp', { ascending: false })
    
  const students = studentsData || []

  // Create podium data based on rank (indexes 0, 1, 2 map to rank 1, 2, 3)
  const podiumStyles = [
    { color: "bg-yellow-400 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-500", accent: "border-yellow-400 dark:border-yellow-500/50", scale: "scale-110 z-10" }, // 1st
    { color: "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300", accent: "border-zinc-300 dark:border-zinc-700", scale: "" }, // 2nd
    { color: "bg-amber-700 text-amber-100 dark:bg-amber-900/50 dark:text-amber-500", accent: "border-amber-700 dark:border-amber-900/50", scale: "" }, // 3rd
  ]

  let topThree = []
  if (students.length >= 1) topThree.push({ rank: 1, ...students[0], ...podiumStyles[0] })
  if (students.length >= 2) topThree.push({ rank: 2, ...students[1], ...podiumStyles[1] })
  if (students.length >= 3) topThree.push({ rank: 3, ...students[2], ...podiumStyles[2] })

  // Reorder for visual display: 2nd, 1st, 3rd
  topThree = topThree.sort((a, b) => {
    const order = { 2: 0, 1: 1, 3: 2 }
    return (order as any)[a.rank] - (order as any)[b.rank]
  })

  const leaderboard = students.slice(3).map((s, idx) => ({
    rank: idx + 4,
    ...s
  }))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 text-center items-center justify-center py-6">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" /> Class Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Compete with your classmates, earn XP, and collect stars to climb the ranks!
        </p>
      </div>

      <div className="flex justify-center items-end gap-2 md:gap-6 mb-8 pt-10">
        {topThree.map((student) => (
          <div key={student.rank} className={`flex flex-col items-center transition-transform ${student.scale || ''}`}>
            <div className="relative mb-4">
              <Avatar className={`h-20 w-20 md:h-24 md:w-24 border-4 ${student.accent}`}>
                <AvatarFallback className="text-xl">{getInitials(student.full_name)}</AvatarFallback>
              </Avatar>
              <div className={`absolute -top-3 -right-3 flex items-center justify-center size-8 rounded-full font-bold shadow-lg ${student.color}`}>
                {student.rank}
              </div>
            </div>
            
            <Card className={`w-32 md:w-48 text-center border-t-4 shadow-md ${student.accent}`}>
              <CardContent className="p-3 md:p-4">
                <h3 className="font-bold text-sm md:text-base truncate" title={student.full_name}>{student.full_name || "Unknown"}</h3>
                <div className="flex items-center justify-center gap-1 mt-2 text-primary font-mono text-sm md:text-base font-semibold">
                  {(student.xp || 0).toLocaleString()} XP
                </div>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{student.stars || 0} Stars</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="max-w-4xl mx-auto w-full">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-center">Stars</TableHead>
                <TableHead className="text-right pr-6">Quiz Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length > 0 ? (
                leaderboard.map((student) => (
                  <TableRow key={student.rank} className="group">
                    <TableCell className="text-center font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {student.rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(student.full_name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.full_name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {(student.xp || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{student.stars || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Medal className="h-4 w-4 text-muted-foreground" />
                        <span>-</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No other students on the leaderboard.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
