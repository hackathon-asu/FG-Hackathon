'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ChatDialog } from '@/components/messaging/chat-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserConversations, getAllMessages, sendMessage, getConversationId } from '@/lib/storage'
import type { ChatMessage } from '@/lib/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MessageSquare, Inbox, ArrowRight, Archive, ChevronDown } from 'lucide-react'

/* ── Archived / pre-seeded conversations ─────────────────────── */

interface ArchivedConvo {
  recipientId: string
  recipientName: string
  messages: { from: 'sofia' | 'student'; text: string; daysAgo: number }[]
}

const ARCHIVED_CONVOS: ArchivedConvo[] = [
  {
    recipientId: 's1',
    recipientName: 'Maria Gonzalez',
    messages: [
      { from: 'student', text: "Hi Sofia! I got matched with you through NavigateASU. I'm a CS junior and I'm struggling with internship applications.", daysAgo: 45 },
      { from: 'sofia', text: "Hey Maria! Welcome — I was in your exact shoes a few years ago. First thing: don't wait for \"perfect\" to apply. Most first-gen students under-apply because they think they need to check every box. You don't.", daysAgo: 45 },
      { from: 'student', text: "Really? I keep seeing listings that want 3+ years experience for entry-level roles and it's discouraging.", daysAgo: 44 },
      { from: 'sofia', text: "Those are wish lists, not requirements. If you match 50-60%, apply. Here's what actually matters: 1) A solid resume (I can review yours), 2) One or two projects that show you can build things, 3) Practicing LeetCode — even 1-2 problems a day adds up.", daysAgo: 44 },
      { from: 'sofia', text: "Also — ASU has free mock interview prep through the Career Center. Book a slot ASAP. And check Handshake, companies specifically recruit there for ASU students.", daysAgo: 44 },
      { from: 'student', text: "I didn't know about Handshake! And yes please, I'd love a resume review. Should I send it over?", daysAgo: 43 },
      { from: 'sofia', text: "Absolutely. Send it whenever you're ready. One more thing — look into the FAFSA Summer Income Protection Allowance. If you land a paid internship this summer, it won't hurt your financial aid as much as you'd think.", daysAgo: 43 },
      { from: 'student', text: "Oh wow, I had no idea. My parents don't know about any of this stuff and I've been too afraid to ask advisors.", daysAgo: 42 },
      { from: 'sofia', text: "That's so common for first-gen students and it's nothing to feel bad about. Your advisors are literally paid to help you — go to office hours. Also, the First-Gen Alliance club has a Slack channel where people share internship openings. Join if you haven't.", daysAgo: 42 },
      { from: 'student', text: "Just joined! Thank you so much Sofia. This is the most useful advice I've gotten all semester.", daysAgo: 41 },
      { from: 'sofia', text: "You've got this Maria. Remember — imposter syndrome lies. You belong here. Let me know when you send that resume over 💪", daysAgo: 41 },
    ],
  },
  {
    recipientId: 's3',
    recipientName: 'Linh Nguyen',
    messages: [
      { from: 'student', text: "Hi Sofia, I'm Linh — a senior psych major thinking about grad school. My advisor suggested I reach out to alumni mentors.", daysAgo: 30 },
      { from: 'sofia', text: "Hey Linh! Great to meet you. Grad school is a big decision. What programs are you looking at — clinical psych, counseling, research?", daysAgo: 30 },
      { from: 'student', text: "Clinical psychology PhD. But the acceptance rates are like 5% and I don't have research experience yet. Feeling like it's too late.", daysAgo: 29 },
      { from: 'sofia', text: "It's NOT too late. Plenty of successful applicants take 1-2 gap years to build research experience. Here's what I'd suggest: look into post-bacc research assistant positions at ASU or nearby universities. Professors often need RAs and it's great for getting letters of recommendation.", daysAgo: 29 },
      { from: 'sofia', text: "Also — have you looked into the McNair Scholars Program? It's specifically designed for first-gen students pursuing graduate degrees. They fund summer research and give you mentorship through the whole application process.", daysAgo: 29 },
      { from: 'student', text: "I've heard of McNair but thought the deadline passed. Let me check!", daysAgo: 28 },
      { from: 'sofia', text: "Even if this cycle passed, apply for the next one. In the meantime, email 2-3 professors whose research interests you. Most won't reply, but the ones who do can change your trajectory. Keep the email short: who you are, what about their work excites you, and what you can contribute.", daysAgo: 28 },
      { from: 'student', text: "That's really helpful. What about the GRE? I can't afford prep courses.", daysAgo: 27 },
      { from: 'sofia', text: "Good news — many clinical psych programs have dropped the GRE requirement. Check each program's website. For the ones that still require it, Khan Academy and Magoosh have free/cheap prep. Also, ASU's testing center sometimes has fee waiver vouchers for first-gen students.", daysAgo: 27 },
      { from: 'sofia', text: "One more thing: your personal statement is EVERYTHING for clinical programs. Your first-gen background, your cultural perspective, your motivation — that's not a weakness, it's what makes you a compelling applicant. Programs want diversity of experience.", daysAgo: 27 },
      { from: 'student', text: "I never thought of it that way. I always felt like my background was something to overcome, not something to highlight.", daysAgo: 26 },
      { from: 'sofia', text: "Reframe it. You've navigated systems nobody taught you how to navigate. That takes resilience and resourcefulness — exactly what clinical work demands. I'm happy to review your personal statement when you start drafting it.", daysAgo: 26 },
      { from: 'student', text: "Thank you Sofia! This conversation alone has given me more direction than months of worrying.", daysAgo: 25 },
    ],
  },
]

const SEED_KEY = 'fg-archived-seeded-v2'

function seedArchivedMessages() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(SEED_KEY)) return

  const existing = getAllMessages()
  const now = Date.now()

  for (const convo of ARCHIVED_CONVOS) {
    for (const msg of convo.messages) {
      const isSofia = msg.from === 'sofia'
      const senderId = isSofia ? 'demo-alumni' : convo.recipientId
      const senderName = isSofia ? 'Sofia Chen' : convo.recipientName
      const recipientId = isSofia ? convo.recipientId : 'demo-alumni'
      const recipientName = isSofia ? convo.recipientName : 'Sofia Chen'
      const conversationId = getConversationId('demo-alumni', convo.recipientId)
      const ts = new Date(now - msg.daysAgo * 86400000).toISOString()

      existing.push({
        id: `seed-${convo.recipientId}-${msg.daysAgo}-${msg.from}`,
        conversationId,
        senderId,
        senderName,
        recipientId,
        recipientName,
        text: msg.text,
        createdAt: ts,
      })
    }
  }

  localStorage.setItem('fg-messages', JSON.stringify(existing))
  localStorage.setItem(SEED_KEY, '1')
}

/* ── Component ───────────────────────────────────────────────── */

export default function AlumniMessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ReturnType<typeof getUserConversations>>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string } | null>(null)
  const [archivedOpen, setArchivedOpen] = useState(false)

  // Seed archived messages on first load
  useEffect(() => { seedArchivedMessages() }, [])

  useEffect(() => {
    if (user) {
      setConversations(getUserConversations(user.id))
    }
  }, [user, chatOpen])

  function openChat(recipientId: string, recipientName: string) {
    setChatTarget({ id: recipientId, name: recipientName })
    setChatOpen(true)
  }

  function formatTime(dateStr: string): string {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Split conversations: recent (< 14 days) vs archived
  const now = Date.now()
  const recent = conversations.filter(
    (c) => now - new Date(c.lastMessage.createdAt).getTime() < 14 * 86400000
  )
  const archived = conversations.filter(
    (c) => now - new Date(c.lastMessage.createdAt).getTime() >= 14 * 86400000
  )

  function renderConvoCard(convo: typeof conversations[number]) {
    const initials = convo.recipientName
      .split(' ')
      .map((n) => n[0])
      .join('')
    const isFromMe = convo.lastMessage.senderId === user?.id
    return (
      <Card
        key={convo.recipientId}
        className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
        onClick={() => openChat(convo.recipientId, convo.recipientName)}
      >
        <CardContent className="flex items-center gap-4 py-4">
          <Avatar className="size-11">
            <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {convo.recipientName}
              </p>
              <span className="shrink-0 text-[10px] text-muted-foreground">
                {formatTime(convo.lastMessage.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {isFromMe ? 'You: ' : ''}
              {convo.lastMessage.text}
            </p>
          </div>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Conversations with your mentees and students
          </p>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Inbox className="size-8 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">No messages yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                When students reach out to connect with you, their messages will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Recent conversations */}
            {recent.length > 0 && (
              <div className="flex flex-col gap-2">
                {recent.map(renderConvoCard)}
              </div>
            )}

            {/* Archived conversations */}
            {archived.length > 0 && (
              <div>
                <button
                  onClick={() => setArchivedOpen(!archivedOpen)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <Archive className="size-4" />
                  Archived ({archived.length})
                  <ChevronDown
                    className={`ml-auto size-4 transition-transform ${archivedOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {archivedOpen && (
                  <div className="mt-2 flex flex-col gap-2">
                    {archived.map(renderConvoCard)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {chatTarget && (
        <ChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          recipientId={chatTarget.id}
          recipientName={chatTarget.name}
        />
      )}
    </AppLayout>
  )
}
