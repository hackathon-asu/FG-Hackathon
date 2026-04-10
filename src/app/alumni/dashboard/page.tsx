'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ChatDialog } from '@/components/messaging/chat-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { menteeConnections } from '@/lib/data/mentee-connections'
import { students } from '@/lib/data/students'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Award,
  Calendar,
  Clock,
  GraduationCap,
  Heart,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Search,
  UserPlus,
  BookOpen,
  Briefcase,
} from 'lucide-react'

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  completed: 'bg-muted text-muted-foreground border-border',
}

const statusIcons = {
  pending: AlertCircle,
  active: CheckCircle2,
  completed: Star,
}

export default function AlumniDashboardPage() {
  const [connections] = useState(menteeConnections)
  const [studentSearch, setStudentSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [majorFilter, setMajorFilter] = useState('all')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string; avatar: string } | null>(null)
  const { user } = useAuth()

  function openChat(target: { id: string; name: string; avatar: string }) {
    setChatTarget(target)
    setChatOpen(true)
  }

  const activeCount = connections.filter((c) => c.status === 'active').length
  const pendingCount = connections.filter((c) => c.status === 'pending').length
  const totalMessages = connections.reduce((sum, c) => sum + c.messages, 0)

  const majors = useMemo(
    () => Array.from(new Set(students.map((s) => s.major))).sort(),
    []
  )

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (yearFilter !== 'all' && s.year !== yearFilter) return false
      if (majorFilter !== 'all' && s.major !== majorFilter) return false
      if (
        studentSearch &&
        !s.name.toLowerCase().includes(studentSearch.toLowerCase()) &&
        !s.major.toLowerCase().includes(studentSearch.toLowerCase()) &&
        !s.interests.some((i) =>
          i.toLowerCase().includes(studentSearch.toLowerCase())
        )
      )
        return false
      return true
    })
  }, [studentSearch, yearFilter, majorFilter])

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <GraduationCap className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Alumni Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user?.name?.split(' ')[0] || 'Sofia'}! Your mentorship makes a difference.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-primary/30 bg-primary/5 text-primary"
          >
            <Award className="mr-1 size-3" />
            First-Gen Champion
          </Badge>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                <Users className="size-7 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active Mentees</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-yellow-500/10">
                <AlertCircle className="size-7 text-yellow-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <MessageSquare className="size-7 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalMessages}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="size-7 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Mentees / Find Students */}
        <Tabs defaultValue="mentees">
          <TabsList>
            <TabsTrigger value="mentees">
              <Heart className="mr-1.5 size-4" />
              Your Mentees
            </TabsTrigger>
            <TabsTrigger value="find">
              <Search className="mr-1.5 size-4" />
              Find Students
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentees" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Connections</CardTitle>
                <CardDescription>
                  Students you&apos;re currently supporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {connections.map((conn) => {
                    const StatusIcon = statusIcons[conn.status]
                    return (
                      <div key={conn.id}>
                        <div className="flex items-center gap-4">
                          <Avatar className="size-12">
                            <AvatarImage src={conn.student.avatar} alt={conn.student.name} />
                            <AvatarFallback className="bg-muted text-sm">
                              {conn.student.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{conn.student.name}</p>
                              <Badge variant="outline" className={`text-[10px] ${statusColors[conn.status]}`}>
                                <StatusIcon className="mr-1 size-3" />
                                {conn.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {conn.student.major} &middot; {conn.student.year}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground/70">{conn.topic}</p>
                          </div>
                          <div className="hidden flex-col items-end gap-1 sm:flex">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="size-3" />
                              {conn.messages} messages
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {conn.lastContact}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={conn.status === 'pending' ? 'default' : 'outline'}
                            className={conn.status === 'pending' ? 'bg-primary text-primary-foreground' : ''}
                            onClick={() => {
                              if (conn.status !== 'pending') {
                                openChat({ id: conn.student.id, name: conn.student.name, avatar: conn.student.avatar })
                              }
                            }}
                          >
                            {conn.status === 'pending' ? 'Accept' : 'Message'}
                            <ArrowUpRight className="ml-1 size-3" />
                          </Button>
                        </div>
                        <Separator className="mt-4" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="find" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserPlus className="size-5 text-primary" />
                  Find First-Gen Students
                </CardTitle>
                <CardDescription>
                  Browse students looking for mentorship and support
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 flex flex-wrap items-end gap-3">
                  <div className="relative min-w-[200px] flex-1">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, major, or interest..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={majorFilter} onValueChange={setMajorFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Major" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Majors</SelectItem>
                      {majors.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-3 text-sm text-muted-foreground">
                  {filteredStudents.length} students found
                </div>

                {/* Student Cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-start gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40"
                    >
                      <Avatar className="size-14 shrink-0">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback className="bg-muted">
                          {student.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{student.name}</p>
                          <Badge variant="secondary" className="text-[10px]">
                            {student.year}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="size-3" />
                          {student.major}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground/70">
                          <Briefcase className="size-3" />
                          {student.careerGoals.join(', ')}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {student.interests.slice(0, 3).map((interest) => (
                            <Badge
                              key={interest}
                              variant="outline"
                              className="border-primary/20 bg-primary/5 text-[10px] text-primary"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground/60 line-clamp-2">
                          {student.background}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Button size="sm" className="h-7 bg-primary text-xs text-primary-foreground hover:bg-primary/90">
                            <UserPlus className="mr-1 size-3" />
                            Offer Mentorship
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upcoming Sessions & Impact — compact row */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="py-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-4 text-primary" />
                Upcoming Sessions
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">1:1 with Jordan Rivera</p>
                    <p className="text-[11px] text-muted-foreground">Career guidance chat</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">Apr 12, 3:00 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">Group Mentorship Hour</p>
                    <p className="text-[11px] text-muted-foreground">Open Q&A for first-gen students</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">Apr 15, 5:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Star className="size-4 text-primary" />
                Your Impact
              </h3>
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
                <p className="text-xs font-medium text-primary">
                  &ldquo;Sofia helped me land my first internship. I wouldn&apos;t have known where to start without her.&rdquo;
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">— Maria Gonzalez, CS Junior</p>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-muted/30 px-3 py-2 text-center">
                  <p className="text-lg font-bold">{connections.length}</p>
                  <p className="text-[10px] text-muted-foreground">Students mentored</p>
                </div>
                <div className="rounded-lg bg-muted/30 px-3 py-2 text-center">
                  <p className="text-lg font-bold">2</p>
                  <p className="text-[10px] text-muted-foreground">Internship referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chat Dialog */}
      {chatTarget && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          recipientId={chatTarget.id}
          recipientName={chatTarget.name}
          recipientAvatar={chatTarget.avatar}
        />
      )}
    </AppLayout>
  )
}
