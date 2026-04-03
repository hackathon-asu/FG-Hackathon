'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { events } from '@/lib/data/events'
import { students } from '@/lib/data/students'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Users,
  Calendar,
  Award,
  MessageSquare,
  CheckCircle2,
  Circle,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  PenLine,
  GraduationCap,
  Brain,
  BookOpen,
  Heart,
  Lightbulb,
  ExternalLink,
} from 'lucide-react'

const nextSteps = [
  {
    id: 1,
    text: 'Attend the FAFSA Help Session on April 14',
    link: '/events',
  },
  {
    id: 2,
    text: "Reply to your mentor Sarah's message",
    link: '/alumni',
  },
  {
    id: 3,
    text: 'Check out 3 new friend matches',
    link: '/social',
  },
  {
    id: 4,
    text: 'Ask the AI advisor about summer classes',
    link: '/advising',
  },
]

const resources = [
  { title: 'Financial Aid Office', icon: DollarSign, color: 'text-emerald-400' },
  { title: 'Writing Center', icon: PenLine, color: 'text-blue-400' },
  { title: 'Career Services', icon: GraduationCap, color: 'text-amber-400' },
  { title: 'Counseling Center', icon: Heart, color: 'text-rose-400' },
  { title: 'Tutoring Hub', icon: BookOpen, color: 'text-violet-400' },
  { title: 'First-Gen Student Center', icon: Lightbulb, color: 'text-primary' },
]

const statCards = [
  { label: '5 New Matches', icon: Users, accent: 'bg-blue-500/10 text-blue-400' },
  { label: '3 Upcoming Events', icon: Calendar, accent: 'bg-emerald-500/10 text-emerald-400' },
  { label: '2 Mentor Connections', icon: Award, accent: 'bg-amber-500/10 text-amber-400' },
  { label: '12 AI Sessions', icon: MessageSquare, accent: 'bg-purple-500/10 text-purple-400' },
]

export default function DashboardPage() {
  const [completed, setCompleted] = useState<number[]>([])
  const upcomingEvents = events.slice(0, 3)
  const recentMatches = students.slice(0, 8)

  function toggleStep(id: number) {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, Jordan! <span aria-hidden="true">&#128075;</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re making great progress. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.label} size="sm" className="border-0">
              <CardContent className="flex items-center gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.accent}`}>
                  <stat.icon className="size-4" />
                </div>
                <span className="text-sm font-medium">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two column layout for steps + events */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Next Steps */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="size-4 text-primary" />
                Your Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <p className="mb-2 text-xs text-muted-foreground">
                AI-suggested actions based on your goals
              </p>
              {nextSteps.map((step) => {
                const done = completed.includes(step.id)
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <button
                      onClick={() => toggleStep(step.id)}
                      className="shrink-0 text-muted-foreground hover:text-primary"
                      aria-label={done ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {done ? (
                        <CheckCircle2 className="size-5 text-emerald-400" />
                      ) : (
                        <Circle className="size-5" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                    >
                      {step.text}
                    </span>
                    <Link href={step.link}>
                      <Button variant="ghost" size="xs">
                        Go
                        <ArrowRight className="size-3" />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              ))}
              <Link href="/events">
                <Button variant="ghost" size="sm" className="w-full">
                  View all events
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Matches */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
            <Users className="size-4 text-primary" />
            Recent Matches
          </h2>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-3">
              {recentMatches.map((student) => (
                <Card
                  key={student.id}
                  size="sm"
                  className="w-[160px] shrink-0 border-0 transition-all hover:ring-2 hover:ring-primary/20"
                >
                  <CardContent className="flex flex-col items-center gap-2 text-center">
                    <Avatar className="size-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                      <p className="text-[11px] text-muted-foreground">{student.major}</p>
                    </div>
                    {student.matchPercentage != null && (
                      <Badge variant="outline" className="border-primary/20 text-[10px] text-primary">
                        {student.matchPercentage}% match
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <Separator />

        {/* Campus Resources */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
            <BookOpen className="size-4 text-primary" />
            Campus Resources
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {resources.map((resource) => (
              <Card
                key={resource.title}
                size="sm"
                className="group cursor-pointer border-0 transition-all hover:ring-2 hover:ring-primary/20"
              >
                <CardContent className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
                    <resource.icon className={`size-5 ${resource.color}`} />
                  </div>
                  <p className="text-xs font-medium text-foreground">{resource.title}</p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-primary">
                    Learn More
                    <ExternalLink className="size-2.5" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Supportive Footer */}
        <div className="rounded-xl border border-primary/10 bg-primary/5 px-5 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            Remember: asking for help is a strength, not a weakness.{' '}
            <span className="text-primary" aria-hidden="true">&#128155;</span>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
