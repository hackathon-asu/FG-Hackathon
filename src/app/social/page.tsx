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
} from 'lucide-react'

const communityGroups = [
  {
    name: 'STEM First-Gen',
    icon: FlaskConical,
    members: 234,
    color: 'text-green-400',
  },
  {
    name: 'Pre-Law Students',
    icon: Scale,
    members: 89,
    color: 'text-blue-400',
  },
  {
    name: 'Creative Arts',
    icon: Palette,
    members: 156,
    color: 'text-purple-400',
  },
  {
    name: 'Transfer Students',
    icon: ArrowRightLeft,
    members: 112,
    color: 'text-orange-400',
  },
]

const years = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior'] as const

export default function SocialPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [joinedGroups, setJoinedGroups] = useState<string[]>([])

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

  const handlePrev = () => {
    setCurrentIndex((i) => Math.max(0, i - 1))
  }

  const handleNext = () => {
    setCurrentIndex((i) => Math.min(filteredStudents.length - 1, i + 1))
  }

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

        {/* Search / Filter Bar */}
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

        {/* Tabs */}
        <Tabs defaultValue="discover">
          <TabsList>
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover">
            <div className="flex flex-col items-center gap-4 pt-4">
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
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchedStudents.map((student) => {
                const initials = student.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                return (
                  <Card key={student.id} className="transition-all duration-200 hover:shadow-md hover:shadow-primary/10">
                    <CardContent className="flex items-center gap-3">
                      <Avatar className="size-12">
                        <AvatarImage
                          src={student.avatar}
                          alt={student.name}
                        />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{student.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {student.major}
                        </p>
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
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              {communityGroups.map((group) => {
                const joined = joinedGroups.includes(group.name)
                return (
                  <Card
                    key={group.name}
                    className="transition-all duration-200 hover:shadow-md hover:shadow-primary/10"
                  >
                    <CardContent className="flex items-center gap-4">
                      <div
                        className={cn(
                          'flex size-12 items-center justify-center rounded-xl bg-muted',
                          group.color
                        )}
                      >
                        <group.icon className="size-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{group.name}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="size-3" />
                          <span>{group.members} members</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={joined ? 'secondary' : 'default'}
                        onClick={() => toggleGroup(group.name)}
                      >
                        {joined ? 'Joined' : 'Join'}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
