'use client'

import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent } from '@/components/ui/card'
import { menteeConnections } from '@/lib/data/mentee-connections'
import {
  Heart,
  Users,
  MessageSquare,
  TrendingUp,
  Star,
  Award,
} from 'lucide-react'

const activeCount = menteeConnections.filter((c) => c.status === 'active').length
const totalMessages = menteeConnections.reduce((sum, c) => sum + c.messages, 0)

const impactStats = [
  { label: 'Students Mentored', value: String(menteeConnections.length), icon: Users, color: 'text-blue-400 bg-blue-500/10' },
  { label: 'Messages Sent', value: String(totalMessages), icon: MessageSquare, color: 'text-violet-400 bg-violet-500/10' },
  { label: 'Hours Volunteered', value: String(activeCount * 6), icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/10' },
  { label: 'Students Helped Graduate', value: '1', icon: Award, color: 'text-amber-400 bg-amber-500/10' },
]

const testimonials = [
  {
    name: `${menteeConnections[0].student.name.split(' ')[0]} ${menteeConnections[0].student.name.split(' ')[1][0]}.`,
    message: "Your advice about FAFSA deadlines saved me. I almost missed the window. Thank you so much!",
  },
  {
    name: `${menteeConnections[1].student.name.split(' ')[0]} ${menteeConnections[1].student.name.split(' ')[1][0]}.`,
    message: "Sofia helped me land my first internship. I wouldn't have known where to start without her.",
  },
  {
    name: `${menteeConnections[2].student.name.split(' ')[0]} ${menteeConnections[2].student.name.split(' ')[1][0]}.`,
    message: "You helped me realize I could apply for grad school. None of this would've happened without you.",
  },
]

export default function AlumniImpactPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Impact</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s the difference you&apos;re making.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 py-5">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="size-7" />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Thank You Banner — compact */}
        <Card className="border-0 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Heart className="size-6 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                You&apos;re the reason someone didn&apos;t give up
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Every message, every answer, every bit of encouragement — it matters more than you know.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Student Testimonials — compact */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Star className="size-4 text-primary" />
            What Students Are Saying
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0">
                <CardContent className="py-3">
                  <p className="text-xs italic leading-relaxed text-muted-foreground">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <span className="mt-2 block text-[11px] font-medium text-foreground">— {t.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
