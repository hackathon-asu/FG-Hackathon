'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

type FeedbackStatus = 'new' | 'reviewed' | 'resolved'

interface FeedbackItem {
  id: string
  from: string
  role: string
  message: string
  date: string
  status: FeedbackStatus
  category: string
}

const feedbackItems: FeedbackItem[] = [
  {
    id: '1',
    from: 'Maria Gonzalez',
    role: 'Student',
    message: 'The AI Advisor gave me incorrect info about the FAFSA deadline. It said March 1 but it was actually June 30 for my state.',
    date: '2026-04-02',
    status: 'new',
    category: 'AI Accuracy',
  },
  {
    id: '2',
    from: 'James Washington',
    role: 'Student',
    message: "Love the social matching! But it would be great to filter by students who are also working part-time. That's a big thing we have in common.",
    date: '2026-04-01',
    status: 'new',
    category: 'Feature Request',
  },
  {
    id: '3',
    from: 'Dr. Sarah Kim',
    role: 'Alumni',
    message: 'The alumni dashboard is great but I\'d love to see which of my mentees are attending events so I can meet them in person.',
    date: '2026-03-30',
    status: 'reviewed',
    category: 'Feature Request',
  },
  {
    id: '4',
    from: 'Priya Patel',
    role: 'Student',
    message: 'The Career Coach helped me prep for my first interview. Got the internship! Just wanted to say thanks.',
    date: '2026-03-28',
    status: 'resolved',
    category: 'Praise',
  },
  {
    id: '5',
    from: 'Carlos Rivera',
    role: 'Student',
    message: 'Events page loads slowly on my phone. Takes about 5 seconds to see anything.',
    date: '2026-03-27',
    status: 'reviewed',
    category: 'Bug Report',
  },
]

const statusConfig: Record<FeedbackStatus, { label: string; icon: typeof Clock; variant: 'default' | 'secondary' | 'outline' }> = {
  new: { label: 'New', icon: AlertCircle, variant: 'default' },
  reviewed: { label: 'Reviewed', icon: Clock, variant: 'secondary' },
  resolved: { label: 'Resolved', icon: CheckCircle2, variant: 'outline' },
}

export default function AdminFeedbackPage() {
  const [items, setItems] = useState(feedbackItems)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | 'all'>('all')

  const filtered = filterStatus === 'all' ? items : items.filter((i) => i.status === filterStatus)
  const counts = {
    all: items.length,
    new: items.filter((i) => i.status === 'new').length,
    reviewed: items.filter((i) => i.status === 'reviewed').length,
    resolved: items.filter((i) => i.status === 'resolved').length,
  }

  function updateStatus(id: string, status: FeedbackStatus) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Feedback & Feature Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review feedback, feature requests, and bug reports from students and alumni
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'reviewed', 'resolved'] as const).map((s) => (
            <Button
              key={s}
              variant={filterStatus === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className="gap-1.5"
            >
              {s === 'all' ? 'All' : statusConfig[s].label}
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {counts[s]}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Feedback list */}
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const config = statusConfig[item.status]
            const isExpanded = expandedId === item.id
            return (
              <Card key={item.id} className="border-0">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex w-full items-start gap-3 p-4 text-left"
                  >
                    <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground">{item.from}</span>
                        <Badge variant="outline" className="text-[10px]">{item.role}</Badge>
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        <Badge variant={config.variant} className="gap-1 text-[10px]">
                          <config.icon className="size-2.5" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                        {item.message}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-3">
                      <p className="text-sm text-foreground">{item.message}</p>
                      <div className="mt-3 flex gap-2">
                        {item.status !== 'reviewed' && (
                          <Button size="xs" variant="outline" onClick={() => updateStatus(item.id, 'reviewed')}>
                            Mark Reviewed
                          </Button>
                        )}
                        {item.status !== 'resolved' && (
                          <Button size="xs" onClick={() => updateStatus(item.id, 'resolved')}>
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
          {filtered.length === 0 && (
            <Card className="border-0">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No feedback items match this filter.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
