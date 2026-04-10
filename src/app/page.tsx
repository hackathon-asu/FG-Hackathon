'use client'

import Link from 'next/link'
import { AppLayout } from '@/components/layout/app-layout'
import { useAuth } from '@/components/auth/auth-provider'
import { events } from '@/lib/data/events'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Calendar,
  ArrowRight,
  BookOpen,
  Users,
  MessageSquare,
  DollarSign,
  Heart,
  Lightbulb,
  ExternalLink,
} from 'lucide-react'

const resources = [
  { title: 'Financial Aid', icon: DollarSign, color: 'text-emerald-400', href: 'https://students.asu.edu/financial-aid' },
  { title: 'Counseling', icon: Heart, color: 'text-rose-400', href: 'https://eoss.asu.edu/counseling' },
  { title: 'Tutoring', icon: BookOpen, color: 'text-violet-400', href: 'https://tutoring.asu.edu/' },
  { title: 'First-Gen Hub', icon: Lightbulb, color: 'text-primary', href: 'https://eoss.asu.edu/first-year-success' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const upcomingEvents = events.slice(0, 2)
  const userName = user?.name?.split(' ')[0] || 'Student'

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your quick access hub.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/advising" className="block">
            <Card className="group border-0 transition-all hover:ring-2 hover:ring-primary/20">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <BookOpen className="size-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">AI Advisor</h3>
                  <p className="text-xs text-muted-foreground truncate">Courses, aid, planning</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/social" className="block">
            <Card className="group border-0 transition-all hover:ring-2 hover:ring-primary/20">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="size-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">Social</h3>
                  <p className="text-xs text-muted-foreground truncate">Matches & community</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/alumni" className="block">
            <Card className="group border-0 transition-all hover:ring-2 hover:ring-primary/20">
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                  <MessageSquare className="size-5 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">Alumni</h3>
                  <p className="text-xs text-muted-foreground truncate">Find mentors</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Upcoming Events — compact */}
        <Card className="border-0">
          <CardContent className="py-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="size-4 text-primary" />
                Upcoming Events
              </h2>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  View all <ArrowRight className="ml-1 size-3" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href="/events"
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}
                    </p>
                  </div>
                  <ArrowRight className="ml-2 size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campus Resources — compact row */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Campus Resources</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {resources.map((r) => (
              <a
                key={r.title}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-muted/50"
              >
                <r.icon className={`size-4 shrink-0 ${r.color}`} />
                <span className="flex-1 truncate text-xs font-medium">{r.title}</span>
                <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
