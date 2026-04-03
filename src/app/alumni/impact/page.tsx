'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Award,
} from 'lucide-react'

const impactStats = [
  { label: 'Students Mentored', value: '12', icon: Users, color: 'text-blue-400 bg-blue-500/10' },
  { label: 'Messages Sent', value: '148', icon: MessageSquare, color: 'text-violet-400 bg-violet-500/10' },
  { label: 'Hours Volunteered', value: '36', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
  { label: 'Students Helped Graduate', value: '4', icon: Award, color: 'text-amber-400 bg-amber-500/10' },
]

const testimonials = [
  {
    name: 'Maria G.',
    message: "Your advice about FAFSA deadlines saved me. I almost missed the window. Thank you so much!",
  },
  {
    name: 'James W.',
    message: "I didn't know what office hours were until you explained it. Now I go every week. You changed how I do school.",
  },
  {
    name: 'Priya P.',
    message: "You helped me realize I could switch to CS. I'm now interning at a tech company. None of this would've happened without you.",
  },
]

export default function AlumniImpactPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Your Impact <span aria-hidden="true">&#127775;</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re making a real difference in students&apos; lives. Here&apos;s the proof.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <Card key={stat.label} className="border-0">
              <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <div className={`flex size-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="size-6" />
                </div>
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Thank You Banner */}
        <Card className="border-0 bg-primary/5">
          <CardContent className="py-8 text-center">
            <Heart className="mx-auto size-8 text-primary" />
            <h2 className="mt-3 text-lg font-semibold text-foreground">
              You&apos;re the reason someone didn&apos;t give up
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Every message you send, every question you answer, every bit of encouragement —
              it matters more than you know. First-gen students don&apos;t forget the people who believed in them.
            </p>
          </CardContent>
        </Card>

        {/* Student Testimonials */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <Star className="size-4 text-primary" />
            What Students Are Saying
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0">
                <CardContent className="flex flex-col gap-3 py-5">
                  <p className="text-sm italic text-muted-foreground">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <span className="text-xs font-medium text-foreground">— {t.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Encouragement Footer */}
        <div className="rounded-xl border border-primary/10 bg-primary/5 px-5 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            You were once in their shoes. Now you&apos;re the mentor you wish you had.{' '}
            <span className="text-primary" aria-hidden="true">&#128155;</span>
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
