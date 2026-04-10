'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { mockTickets } from '@/lib/data/tickets'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Ticket,
  Users,
  Bot,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Brain,
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

const aiConversationLogs = [
  {
    id: 'ai-1',
    student: 'Maria Gonzalez',
    question: 'When is the FAFSA deadline for Arizona?',
    aiResponse: 'The FAFSA deadline for Arizona is March 1, 2026. Make sure to submit before then to maximize your aid.',
    correct: false,
    flagReason: 'Incorrect deadline — actual AZ FAFSA priority deadline is June 30',
    timestamp: '2026-04-02T14:23:00',
    category: 'financial-aid',
  },
  {
    id: 'ai-2',
    student: 'Deshawn Williams',
    question: 'Can I take organic chemistry without completing general chemistry first?',
    aiResponse: 'No, General Chemistry I (CHM 113) is a prerequisite for Organic Chemistry (CHM 233) at ASU. You must complete it with a C or better.',
    correct: true,
    flagReason: null,
    timestamp: '2026-04-02T11:45:00',
    category: 'academic-advising',
  },
  {
    id: 'ai-3',
    student: 'Priya Patel',
    question: 'How do I apply for the Pell Grant separately from FAFSA?',
    aiResponse: 'You don\'t need to apply separately — the Pell Grant is automatically determined from your FAFSA application. There\'s no separate application.',
    correct: true,
    flagReason: null,
    timestamp: '2026-04-01T16:30:00',
    category: 'financial-aid',
  },
  {
    id: 'ai-4',
    student: 'Carlos Rivera',
    question: 'Is there a limit on how many credits I can take per semester?',
    aiResponse: 'ASU allows up to 18 credits per semester without overload approval. For 19+ credits you need advisor approval and a minimum 3.0 GPA.',
    correct: true,
    flagReason: null,
    timestamp: '2026-04-01T09:15:00',
    category: 'academic-advising',
  },
  {
    id: 'ai-5',
    student: 'Aisha Johnson',
    question: 'Can my counselor help me with immigration paperwork?',
    aiResponse: 'Yes, the ASU counseling center can assist with all immigration-related documents and paperwork.',
    correct: false,
    flagReason: 'Incorrect — counseling center handles mental health. Immigration is handled by ISSC (International Students and Scholars Center)',
    timestamp: '2026-03-31T13:20:00',
    category: 'counseling',
  },
  {
    id: 'ai-6',
    student: 'James Washington',
    question: 'What GPA do I need to keep my merit scholarship?',
    aiResponse: 'Most ASU merit scholarships require maintaining a 3.0 cumulative GPA. Check your specific award letter for exact requirements as some scholarships may differ.',
    correct: true,
    flagReason: null,
    timestamp: '2026-03-31T10:05:00',
    category: 'financial-aid',
  },
]

export default function AITicketsPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const [statusFilter, setStatusFilter] = useState('all')

  // Load real tickets from localStorage and merge with mock data
  useEffect(() => {
    const raw = localStorage.getItem('fg-tickets')
    if (raw) {
      const liveTickets = JSON.parse(raw) as typeof mockTickets
      // Dedupe by id, live tickets first
      const ids = new Set(liveTickets.map((t: { id: string }) => t.id))
      const merged = [...liveTickets, ...mockTickets.filter(t => !ids.has(t.id))]
      setTickets(merged)
    }
  }, [])
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

  const incorrectCount = aiConversationLogs.filter((l) => !l.correct).length
  const correctCount = aiConversationLogs.filter((l) => l.correct).length
  const accuracyRate = Math.round((correctCount / aiConversationLogs.length) * 100)

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10">
              <Bot className="size-5 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Tickets</h1>
              <p className="text-sm text-muted-foreground">
                Review AI-generated support tickets and monitor response accuracy
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tickets">
          <TabsList>
            <TabsTrigger value="tickets">
              <Ticket className="mr-1.5 size-4" />
              Tickets
              {newCount > 0 && (
                <span className="ml-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {newCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ai-training">
              <Brain className="mr-1.5 size-4" />
              AI Training
            </TabsTrigger>
          </TabsList>

          {/* Tickets Tab */}
          <TabsContent value="tickets" className="mt-4">
            <div className="flex flex-col gap-4">
              {/* Ticket Stats */}
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
                            {review?.reason && (
                              <div className="mt-2 rounded-md bg-muted/30 p-2 text-xs text-muted-foreground">
                                <span className="font-medium">Review note:</span> {review.reason}
                              </div>
                            )}
                          </div>

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

          {/* AI Training Tab */}
          <TabsContent value="ai-training" className="mt-4">
            <div className="flex flex-col gap-6">
              {/* Accuracy Overview */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 text-center">
                  <CheckCircle2 className="mx-auto size-8 text-green-400" />
                  <p className="mt-2 text-2xl font-bold">{correctCount}</p>
                  <p className="text-xs text-muted-foreground">Correct Responses</p>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center">
                  <XCircle className="mx-auto size-8 text-red-400" />
                  <p className="mt-2 text-2xl font-bold">{incorrectCount}</p>
                  <p className="text-xs text-muted-foreground">Flagged Incorrect</p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
                  <Brain className="mx-auto size-8 text-primary" />
                  <p className="mt-2 text-2xl font-bold">{accuracyRate}%</p>
                  <p className="text-xs text-muted-foreground">AI Accuracy Rate</p>
                </div>
              </div>

              <Separator />

              {/* Conversation Logs */}
              <div>
                <h3 className="mb-4 text-base font-semibold">AI Conversation Logs</h3>
                <div className="flex flex-col gap-3">
                  {aiConversationLogs.map((log) => (
                    <Card key={log.id} className={!log.correct ? 'border-red-500/20' : ''}>
                      <CardContent className="pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{log.student}</span>
                              <Badge variant="outline" className="text-[10px]">
                                {categoryLabels[log.category]}
                              </Badge>
                              {log.correct ? (
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-[10px] text-green-400">
                                  <CheckCircle2 className="mr-1 size-2.5" />
                                  Correct
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-500/20 bg-red-500/10 text-[10px] text-red-400">
                                  <XCircle className="mr-1 size-2.5" />
                                  Flagged
                                </Badge>
                              )}
                            </div>

                            <div className="mt-3 rounded-lg bg-muted/30 p-3">
                              <p className="text-xs font-medium text-muted-foreground">Student asked:</p>
                              <p className="mt-1 text-sm">{log.question}</p>
                            </div>

                            <div className="mt-2 rounded-lg bg-primary/5 p-3">
                              <p className="text-xs font-medium text-primary">AI responded:</p>
                              <p className="mt-1 text-sm">{log.aiResponse}</p>
                            </div>

                            {log.flagReason && (
                              <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                                <p className="text-xs font-medium text-red-400">Issue:</p>
                                <p className="mt-1 text-xs text-muted-foreground">{log.flagReason}</p>
                              </div>
                            )}
                          </div>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(log.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Ticket Review History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Brain className="size-4 text-primary" />
                    Ticket Review History
                  </CardTitle>
                  <CardDescription>
                    Your ticket approvals and denials help train the AI on when to escalate.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.entries(reviewedTickets).length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {Object.entries(reviewedTickets).map(([ticketId, review]) => {
                        const ticket = tickets.find((t) => t.id === ticketId)
                        if (!ticket) return null
                        return (
                          <div key={ticketId} className="flex items-center gap-3 rounded-lg bg-muted/20 p-3">
                            {review.action === 'approved' ? (
                              <CheckCircle2 className="size-4 shrink-0 text-green-400" />
                            ) : (
                              <XCircle className="size-4 shrink-0 text-red-400" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm">
                                <span className="font-mono text-xs text-muted-foreground">{ticket.caseNumber}</span>
                                {' '}&mdash; {ticket.subject}
                              </p>
                              {review.reason && (
                                <p className="mt-0.5 text-xs text-muted-foreground">Note: {review.reason}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No tickets reviewed yet. Approve or deny tickets to start building the training dataset.
                    </p>
                  )}
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
                  <span className="font-mono">{selectedTicket.caseNumber}</span> &mdash;{' '}
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
                    ? 'e.g., Student needs personalized financial aid review...'
                    : 'e.g., This was a common FAQ the AI should answer directly...'
                }
                rows={4}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                This feedback trains the AI on when to escalate vs handle independently.
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
