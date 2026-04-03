'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { mockTickets } from '@/lib/data/tickets'
import { students } from '@/lib/data/students'
import { alumni } from '@/lib/data/alumni'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SalesforceTicket } from '@/lib/types'
import {
  Shield,
  Ticket,
  Users,
  GraduationCap,
  Bot,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Brain,
  BarChart3,
  Activity,
  MessageSquare,
  Calendar,
} from 'lucide-react'

const priorityColors = {
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusColors = {
  new: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  open: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'in-progress': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const categoryLabels: Record<string, string> = {
  'academic-advising': 'Academic Advising',
  'financial-aid': 'Financial Aid',
  'career-services': 'Career Services',
  counseling: 'Counseling',
  general: 'General Support',
}

export default function AdminPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<'approve' | 'deny'>('approve')
  const [selectedTicket, setSelectedTicket] = useState<SalesforceTicket | null>(null)
  const [reason, setReason] = useState('')
  const [reviewedTickets, setReviewedTickets] = useState<
    Record<string, { action: 'approved' | 'denied'; reason: string }>
  >({})

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
    return true
  })

  const newCount = tickets.filter((t) => t.status === 'new').length
  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length
  const highPriorityCount = tickets.filter((t) => t.priority === 'high').length

  function openReviewDialog(ticket: SalesforceTicket, action: 'approve' | 'deny') {
    setSelectedTicket(ticket)
    setDialogAction(action)
    setReason('')
    setDialogOpen(true)
  }

  function handleSubmitReview() {
    if (!selectedTicket) return
    setReviewedTickets((prev) => ({
      ...prev,
      [selectedTicket.id]: {
        action: dialogAction === 'approve' ? 'approved' : 'denied',
        reason,
      },
    }))
    if (dialogAction === 'approve') {
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'in-progress' as const } : t))
      )
    } else {
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'resolved' as const } : t))
      )
    }
    setDialogOpen(false)
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <Shield className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Platform overview and AI ticket management
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-primary/30 bg-primary/5 text-primary">
            <Shield className="mr-1 size-3" />
            Administrator
          </Badge>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <GraduationCap className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{alumni.length}</p>
                <p className="text-xs text-muted-foreground">Alumni Mentors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                <Bot className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">847</p>
                <p className="text-xs text-muted-foreground">AI Sessions (7d)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tickets">
          <TabsList>
            <TabsTrigger value="tickets">
              <Ticket className="mr-1.5 size-4" />
              AI Tickets
              {newCount > 0 && (
                <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {newCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="overview">
              <BarChart3 className="mr-1.5 size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-training">
              <Brain className="mr-1.5 size-4" />
              AI Training
            </TabsTrigger>
          </TabsList>

          {/* AI Tickets Tab */}
          <TabsContent value="tickets" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Ticket Stats Bar */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5">
                  <div className="size-2 rounded-full bg-blue-400" />
                  <span className="text-xs font-medium">{newCount} New</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5">
                  <div className="size-2 rounded-full bg-yellow-400" />
                  <span className="text-xs font-medium">{openCount} Open</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5">
                  <div className="size-2 rounded-full bg-green-400" />
                  <span className="text-xs font-medium">{resolvedCount} Resolved</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5">
                  <AlertTriangle className="size-3 text-red-400" />
                  <span className="text-xs font-medium">{highPriorityCount} High Priority</span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="academic-advising">Academic Advising</SelectItem>
                    <SelectItem value="financial-aid">Financial Aid</SelectItem>
                    <SelectItem value="career-services">Career Services</SelectItem>
                    <SelectItem value="counseling">Counseling</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ticket List */}
              <div className="flex flex-col gap-3">
                {filteredTickets.map((ticket) => {
                  const review = reviewedTickets[ticket.id]
                  return (
                    <Card key={ticket.id} className={review ? 'opacity-70' : ''}>
                      <CardContent className="pt-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="font-mono text-[10px]">
                                {ticket.caseNumber}
                              </Badge>
                              <Badge variant="outline" className={`text-[10px] ${priorityColors[ticket.priority]}`}>
                                {ticket.priority}
                              </Badge>
                              <Badge variant="outline" className={`text-[10px] ${statusColors[ticket.status]}`}>
                                {ticket.status}
                              </Badge>
                              {review && (
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    review.action === 'approved'
                                      ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                      : 'border-red-500/30 bg-red-500/10 text-red-400'
                                  }`}
                                >
                                  {review.action === 'approved' ? (
                                    <CheckCircle2 className="mr-1 size-3" />
                                  ) : (
                                    <XCircle className="mr-1 size-3" />
                                  )}
                                  {review.action}
                                </Badge>
                              )}
                            </div>
                            <p className="mt-2 text-sm font-medium">{ticket.subject}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="size-3" />
                                {ticket.studentName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="size-3" />
                                {categoryLabels[ticket.category]}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            {ticket.assignedTo && (
                              <p className="mt-1 text-xs text-muted-foreground/60">
                                Assigned to: {ticket.assignedTo}
                              </p>
                            )}
                            {review?.reason && (
                              <div className="mt-2 rounded-md bg-muted/30 p-2 text-xs text-muted-foreground">
                                <span className="font-medium">Review note:</span> {review.reason}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {!review && (
                            <div className="flex shrink-0 gap-2">
                              <Button
                                size="sm"
                                className="h-8 bg-green-600 text-xs text-white hover:bg-green-700"
                                onClick={() => openReviewDialog(ticket, 'approve')}
                              >
                                <CheckCircle2 className="mr-1 size-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-500/30 text-xs text-red-400 hover:bg-red-500/10"
                                onClick={() => openReviewDialog(ticket, 'deny')}
                              >
                                <XCircle className="mr-1 size-3" />
                                Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="size-5 text-primary" />
                    Platform Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-sm">New registrations (7d)</span>
                    <span className="font-mono text-sm font-bold">+34</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-sm">Mentor matches made (7d)</span>
                    <span className="font-mono text-sm font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-sm">Events RSVPs (7d)</span>
                    <span className="font-mono text-sm font-bold">156</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-sm">AI conversations (7d)</span>
                    <span className="font-mono text-sm font-bold">847</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-sm">Tickets generated (7d)</span>
                    <span className="font-mono text-sm font-bold">{tickets.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="size-5 text-primary" />
                    Ticket Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const count = tickets.filter((t) => t.category === key).length
                    const pct = Math.round((count / tickets.length) * 100)
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{label}</span>
                          <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-muted/30">
                          <div
                            className="h-2 rounded-full bg-primary/60"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="size-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    {[
                      { time: '2 min ago', event: 'New ticket ASU-1009 created — emergency financial assistance', type: 'ticket' },
                      { time: '15 min ago', event: 'Alumni Sofia Herrera accepted mentee request from Maria Gonzalez', type: 'mentor' },
                      { time: '1 hour ago', event: 'Student Deshawn Williams RSVPd to "Pre-Med Networking Night"', type: 'event' },
                      { time: '2 hours ago', event: 'AI advisor handled 23 conversations in the last hour', type: 'ai' },
                      { time: '3 hours ago', event: 'Ticket ASU-1005 resolved — career services connected with student', type: 'ticket' },
                      { time: '5 hours ago', event: 'New alumni mentor Omar Hassan completed onboarding', type: 'mentor' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-20 shrink-0 text-xs text-muted-foreground">{item.time}</span>
                        <div className="size-2 mt-1.5 shrink-0 rounded-full bg-primary/40" />
                        <span className="text-sm text-muted-foreground">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Training Tab */}
          <TabsContent value="ai-training" className="mt-4">
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Brain className="size-5 text-primary" />
                    AI Training Feedback
                  </CardTitle>
                  <CardDescription>
                    Approved and denied tickets are used to improve AI responses over time.
                    This feedback loop helps the AI learn what advice to escalate vs handle independently.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 text-center">
                      <CheckCircle2 className="mx-auto size-8 text-green-400" />
                      <p className="mt-2 text-2xl font-bold">
                        {Object.values(reviewedTickets).filter((r) => r.action === 'approved').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Approved (AI was right to escalate)</p>
                    </div>
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center">
                      <XCircle className="mx-auto size-8 text-red-400" />
                      <p className="mt-2 text-2xl font-bold">
                        {Object.values(reviewedTickets).filter((r) => r.action === 'denied').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Denied (AI should not have escalated)</p>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                      <Brain className="mx-auto size-8 text-primary" />
                      <p className="mt-2 text-2xl font-bold">
                        {Object.values(reviewedTickets).length > 0
                          ? Math.round(
                              (Object.values(reviewedTickets).filter((r) => r.action === 'approved').length /
                                Object.values(reviewedTickets).length) *
                                100
                            )
                          : 0}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">AI Accuracy Rate</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h4 className="mb-3 text-sm font-medium">Review History</h4>
                    {Object.entries(reviewedTickets).length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {Object.entries(reviewedTickets).map(([ticketId, review]) => {
                          const ticket = tickets.find((t) => t.id === ticketId)
                          if (!ticket) return null
                          return (
                            <div
                              key={ticketId}
                              className="flex items-center gap-3 rounded-lg bg-muted/20 p-3"
                            >
                              {review.action === 'approved' ? (
                                <CheckCircle2 className="size-4 shrink-0 text-green-400" />
                              ) : (
                                <XCircle className="size-4 shrink-0 text-red-400" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm">
                                  <span className="font-mono text-xs text-muted-foreground">
                                    {ticket.caseNumber}
                                  </span>{' '}
                                  — {ticket.subject}
                                </p>
                                {review.reason && (
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    Reason: {review.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No tickets reviewed yet. Go to the AI Tickets tab to approve or deny tickets.
                        Your feedback will appear here and be used to train the AI model.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {dialogAction === 'approve' ? (
                <>
                  <CheckCircle2 className="size-5 text-green-400" />
                  Approve Ticket
                </>
              ) : (
                <>
                  <XCircle className="size-5 text-red-400" />
                  Deny Ticket
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedTicket && (
                <>
                  <span className="font-mono">{selectedTicket.caseNumber}</span> —{' '}
                  {selectedTicket.subject}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                {dialogAction === 'approve'
                  ? 'Why should this be escalated to a human advisor?'
                  : 'Why should the AI have handled this without escalating?'}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  dialogAction === 'approve'
                    ? 'e.g., Student needs personalized financial aid review that AI cannot provide...'
                    : 'e.g., This was a common FAQ that the AI should answer directly without creating a ticket...'
                }
                rows={4}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                This feedback will be used to train the AI on when to escalate vs handle independently.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitReview}
              className={
                dialogAction === 'approve'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }
            >
              {dialogAction === 'approve' ? 'Approve & Escalate' : 'Deny & Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
