'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { events } from '@/lib/data/events'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  PenLine,
  GraduationCap,
  BookOpen,
  Heart,
  Lightbulb,
  ExternalLink,
  Compass,
  Users,
} from 'lucide-react'

const resources = [
  { title: 'Financial Aid', icon: DollarSign, color: 'text-emerald-400', href: 'https://students.asu.edu/financial-aid' },
  { title: 'Writing Center', icon: PenLine, color: 'text-blue-400', href: 'https://tutoring.asu.edu/writing-centers' },
  { title: 'Career Services', icon: GraduationCap, color: 'text-amber-400', href: 'https://career.asu.edu/' },
  { title: 'Counseling', icon: Heart, color: 'text-rose-400', href: 'https://eoss.asu.edu/counseling' },
  { title: 'Tutoring', icon: BookOpen, color: 'text-violet-400', href: 'https://tutoring.asu.edu/' },
  { title: 'First-Gen Hub', icon: Lightbulb, color: 'text-primary', href: 'https://eoss.asu.edu/first-year-success' },
]


export default function DashboardPage() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [userName, setUserName] = useState('Jordan')
  const upcomingEvents = events.slice(0, 3)

  useEffect(() => {
    const raw = localStorage.getItem('fg-profile')
    if (raw) {
      const profile = JSON.parse(raw)
      if (profile.name) setUserName(profile.name.split(' ')[0])
    }
  }, [])

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}! <span aria-hidden="true">&#128075;</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re making great progress. Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* AI Tools */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/advising" className="block">
            <Card className="group border-0 transition-all hover:ring-2 hover:ring-primary/20">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <BookOpen className="size-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Academic Advising</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    AI-powered guidance on courses, majors, financial aid, and academic planning tailored for first-gen students.
                  </p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/decisions" className="block">
            <Card className="group border-0 transition-all hover:ring-2 hover:ring-primary/20">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                  <Compass className="size-6 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">Career Coach</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Navigate big decisions with AI that understands first-gen challenges — internships, career paths, and life planning.
                  </p>
                </div>
                <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Events + Resources side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upcoming Events */}
          <Card className="border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-primary" />
                  Upcoming Events
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {events.length} events this month
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Workshops, socials, and career events curated for first-gen students
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {upcomingEvents.map((event) => (
                <div key={event.id}>
                  <button
                    onClick={() =>
                      setExpandedEvent(expandedEvent === event.id ? null : event.id)
                    }
                    className="w-full rounded-lg border border-border px-3 py-2 text-left transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="truncate text-xs font-medium text-foreground">{event.title}</h4>
                      <Badge variant="secondary" className="shrink-0 text-[9px]">
                        {event.category}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-2.5" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-2.5" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-2.5" />
                        {event.location}
                      </span>
                    </div>
                  </button>
                  {expandedEvent === event.id && (
                    <div className="mt-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      {event.description}
                      <div className="mt-2">
                        <Link href="/events">
                          <Button variant="outline" size="xs">
                            View Details
                            <ArrowRight className="size-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link href="/events">
                <Button variant="ghost" size="xs" className="w-full text-xs">
                  View all events
                  <ArrowRight className="size-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Campus Resources */}
          <Card className="border-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-primary" />
                Campus Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1.5">
              {resources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <resource.icon className={`size-4 ${resource.color}`} />
                  </div>
                  <span className="flex-1 text-xs font-medium text-foreground">{resource.title}</span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </a>
              ))}
            </CardContent>
          </Card>
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
