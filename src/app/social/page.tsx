'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ProfileCard } from '@/components/social/profile-card'
import { students } from '@/lib/data/students'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Search,
  Users,
  Sparkles,
  FlaskConical,
  Scale,
  Palette,
  ArrowRightLeft,
  Brain,
  CheckCircle2,
  Circle,
  ArrowRight,
  Heart,
  UserPlus,
  LayoutDashboard,
} from 'lucide-react'

const communityGroups = [
  { name: 'STEM First-Gen', icon: FlaskConical, members: 234, color: 'text-green-400' },
  { name: 'Pre-Law Students', icon: Scale, members: 89, color: 'text-blue-400' },
  { name: 'Creative Arts', icon: Palette, members: 156, color: 'text-purple-400' },
  { name: 'Transfer Students', icon: ArrowRightLeft, members: 112, color: 'text-orange-400' },
]

const nextSteps = [
  { id: 1, text: 'Attend the FAFSA Help Session on April 14', link: '/events' },
  { id: 2, text: "Reply to your mentor Sarah's message", link: '/alumni' },
  { id: 3, text: 'Check out 3 new friend matches', link: '/social' },
  { id: 4, text: 'Ask the AI advisor about summer classes', link: '/advising' },
]

const years = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior'] as const

export default function SocialPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])
  const [completed, setCompleted] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const recentMatches = students.slice(0, 8)

  function toggleStep(id: number) {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.interests.some((i) =>
          i.toLowerCase().includes(searchQuery.toLowerCase())
        )
      const matchesYear = yearFilter === 'All' || s.year === yearFilter
      return matchesSearch && matchesYear
    })
  }, [searchQuery, yearFilter])

  const matchedStudents = students.slice(0, 6)

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1))
  const handleNext = () => setCurrentIndex((i) => Math.min(filteredStudents.length - 1, i + 1))
  const toggleGroup = (name: string) => {
    setJoinedGroups((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Find Your People
          </h1>
          <p className="mt-1 text-muted-foreground">
            Connect with students who get it
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">
              <LayoutDashboard className="mr-1.5 size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discover">
              <UserPlus className="mr-1.5 size-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Sparkles className="mr-1.5 size-4" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="community">
              <Users className="mr-1.5 size-4" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6 pt-4">
              {/* Recent Matches */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <Heart className="size-4 text-primary" />
                    Recent Matches
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground"
                    onClick={() => setActiveTab('matches')}
                  >
                    View all
                    <ArrowRight className="ml-1 size-3" />
                  </Button>
                </div>
                <ScrollArea className="w-full">
                  <div className="flex gap-3 pb-3">
                    {recentMatches.map((student) => (
                      <Card
                        key={student.id}
                        className="w-[140px] shrink-0 transition-all hover:ring-2 hover:ring-primary/20"
                      >
                        <CardContent className="flex flex-col items-center gap-2 p-3 text-center">
                          <Avatar className="size-11">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-medium">{student.name}</p>
                            <p className="text-[10px] text-muted-foreground">{student.major}</p>
                          </div>
                          {student.matchPercentage != null && (
                            <Badge variant="outline" className="border-primary/20 text-[9px] text-primary">
                              {student.matchPercentage}%
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {/* Next Steps */}
                <Card>
                  <CardContent className="flex flex-col gap-2 p-5">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Brain className="size-4 text-primary" />
                      Your Next Steps
                    </h3>
                    <p className="mb-1 text-xs text-muted-foreground">
                      AI-suggested actions based on your goals
                    </p>
                    {nextSteps.map((step) => {
                      const done = completed.includes(step.id)
                      return (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 transition-colors hover:bg-muted/50"
                        >
                          <button
                            onClick={() => toggleStep(step.id)}
                            className="shrink-0 text-muted-foreground hover:text-primary"
                          >
                            {done ? (
                              <CheckCircle2 className="size-4 text-emerald-400" />
                            ) : (
                              <Circle className="size-4" />
                            )}
                          </button>
                          <span className={`flex-1 text-xs ${done ? 'text-muted-foreground line-through' : ''}`}>
                            {step.text}
                          </span>
                          <a href={step.link}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                              Go
                              <ArrowRight className="ml-1 size-3" />
                            </Button>
                          </a>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex flex-col gap-3">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-5">
                      <UserPlus className="size-8 text-primary" />
                      <h3 className="mt-3 font-semibold">Discover New Friends</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Swipe through profiles and connect with students who share your interests and goals.
                      </p>
                      <Button
                        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => setActiveTab('discover')}
                      >
                        Start Discovering
                        <ArrowRight className="ml-1 size-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-primary/20 py-6 text-primary hover:bg-primary/5"
                    onClick={() => setActiveTab('community')}
                  >
                    <Users className="size-5" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">Join a Community</p>
                      <p className="text-[10px] text-muted-foreground">Find your group</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {communityGroups.reduce((sum, g) => sum + g.members, 0)} members
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Discover Tab */}
          <TabsContent value="discover">
            <div className="space-y-4 pt-4">
              {/* Search / Filter */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, major, or interest..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentIndex(0)
                    }}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={yearFilter}
                  onValueChange={(v) => {
                    setYearFilter(v)
                    setCurrentIndex(0)
                  }}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y === 'All' ? 'All Years' : y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center gap-4">
                {filteredStudents.length === 0 ? (
                  <Card className="w-full max-w-md">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No students match your filters. Try adjusting your search.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {currentIndex + 1} of {filteredStudents.length}
                    </p>
                    <ProfileCard
                      student={filteredStudents[currentIndex]}
                      onPass={() => handleNext()}
                      onConnect={() => handleNext()}
                    />
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentIndex === filteredStudents.length - 1}
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchedStudents.map((student) => {
                const initials = student.name.split(' ').map((n) => n[0]).join('')
                return (
                  <Card key={student.id} className="transition-all duration-200 hover:shadow-md hover:shadow-primary/10">
                    <CardContent className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{student.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{student.major}</p>
                        <div className="mt-1 flex items-center gap-1.5">
                          <Sparkles className="size-3 text-primary" />
                          <span className="text-xs font-medium text-primary">
                            {student.matchPercentage}% match
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="shrink-0 gap-1.5">
                        <MessageCircle className="size-3.5" />
                        Chat
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community">
            <div className="space-y-6 pt-4">
              {/* Community Groups */}
              <div className="grid gap-4 sm:grid-cols-2">
                {communityGroups.map((group) => {
                  const joined = joinedGroups.includes(group.name)
                  return (
                    <Card
                      key={group.name}
                      className={cn(
                        'transition-all duration-200 hover:shadow-md hover:shadow-primary/10',
                        joined && 'ring-1 ring-primary/20'
                      )}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn('flex size-14 items-center justify-center rounded-xl bg-muted', group.color)}>
                            <group.icon className="size-7" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{group.name}</p>
                              {joined && (
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-[10px] text-green-400">
                                  Joined
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Users className="size-3" />
                              <span>{group.members} members</span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground/70">
                              Connect with fellow first-gen students, share resources, and attend group events.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant={joined ? 'outline' : 'default'}
                            onClick={() => toggleGroup(group.name)}
                            className={joined ? '' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                          >
                            {joined ? 'Leave Group' : 'Join Group'}
                          </Button>
                          {joined && (
                            <Button size="sm" variant="ghost" className="text-xs text-muted-foreground">
                              <MessageCircle className="mr-1 size-3" />
                              Group Chat
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Suggest a Community */}
              <Card className="border-dashed">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30">
                    <UserPlus className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Don&apos;t see your community?</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Suggest a new group and we&apos;ll help you build it.
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Suggest Group
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
