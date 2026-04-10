'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ProfileCard } from '@/components/social/profile-card'
import { useAuth } from '@/components/auth/auth-provider'
import {
  sendMessage,
  getConversationMessages,
  getConversationId,
} from '@/lib/storage'
import type { ChatMessage } from '@/lib/storage'
import { students } from '@/lib/data/students'
import { GROUP_CHAT_DATA, type GroupMessage } from '@/lib/data/group-chats'
import { cn } from '@/lib/utils'
import type { Student } from '@/lib/types'
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
  MessageCircle,
  MessagesSquare,
  Search,
  Users,
  Sparkles,
  FlaskConical,
  Scale,
  Palette,
  ArrowRightLeft,
  ArrowRight,
  UserPlus,
  Send,
  X,
  Heart,
  ChevronLeft,
} from 'lucide-react'

const communityGroups = [
  { name: 'STEM First-Gen', icon: FlaskConical, members: 234, color: 'text-green-400' },
  { name: 'Pre-Law Students', icon: Scale, members: 89, color: 'text-blue-400' },
  { name: 'Creative Arts', icon: Palette, members: 156, color: 'text-purple-400' },
  { name: 'Transfer Students', icon: ArrowRightLeft, members: 112, color: 'text-orange-400' },
]

const years = ['All', 'Freshman', 'Sophomore', 'Junior', 'Senior'] as const

/* ── Quick-reply bot (regex first, Groq fallback) ── */
const QUICK_REPLIES: [RegExp, string[]][] = [
  [/^(hey|hi|hello|yo|sup|hiya|howdy)\b/i, [
    "Hey! Nice to meet you 😊", "Hi there! Glad we matched!", "Hey! What's up?", "Hello! Great to connect with you!",
  ]],
  [/how\s*(are|r)\s*(you|u|ya)|\bhow('s| is) it going\b|\bwhat'?s up\b|\bwyd\b/i, [
    "I'm doing great, thanks for asking! How about you?", "Pretty good! Just grinding through the semester 😅 You?",
    "Going well! Excited to connect. How are you doing?",
  ]],
  [/nice to meet (you|u|ya)|great to connect/i, [
    "Nice to meet you too! What are you studying?", "Likewise! Always great to meet fellow first-gen students 💪",
    "Same here! What brought you to ASU?",
  ]],
  [/what('s| is) your major|what (do |are )you study/i, [
    "I'm really into my major! What about you — what are you studying?",
    "Love talking about this stuff. What's your major?",
  ]],
  [/thank(s| you)|thx|ty\b/i, [
    "Of course! Happy to help 😊", "No problem at all!", "Anytime!",
  ]],
  [/bye|see (you|ya|u)|gotta go|talk later|ttyl/i, [
    "See you around! 👋", "Talk soon! Good luck with everything!", "Bye! Let's catch up again soon.",
  ]],
  [/lol|lmao|haha|😂/i, [
    "😄 Right?!", "Haha for real!", "😂",
  ]],
  [/yeah|yep|yup|for sure|definitely|totally/i, [
    "For sure! 🙌", "Totally agree!", "100%!",
  ]],
]

function getQuickReply(text: string): string | null {
  const trimmed = text.trim()
  for (const [pattern, replies] of QUICK_REPLIES) {
    if (pattern.test(trimmed)) {
      return replies[Math.floor(Math.random() * replies.length)]
    }
  }
  return null
}

async function getGroqReply(text: string, name: string): Promise<string> {
  // Lightweight fallback — just return a friendly generic if no API key
  const key = typeof window !== 'undefined' ? localStorage.getItem('groq-api-key') : null
  if (!key) {
    const fallbacks = [
      `That's interesting! Tell me more 😊`,
      `Cool! I'd love to hear more about that.`,
      `Oh nice! What else is going on?`,
      `That's awesome! What made you interested in that?`,
    ]
    return fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: `You are ${name}, a friendly college student. Reply in 1-2 short casual sentences. Be warm and relatable.` },
          { role: 'user', content: text },
        ],
        max_tokens: 60,
        temperature: 0.8,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || "That's cool! Tell me more 😊"
  } catch {
    return "That's cool! Tell me more 😊"
  }
}

/* ── Inline Chat Panel ── */
function ChatPanel({
  recipientId,
  recipientName,
  recipientAvatar,
  onClose,
}: {
  recipientId: string
  recipientName: string
  recipientAvatar?: string
  onClose: () => void
}) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const conversationId = user ? getConversationId(user.id, recipientId) : ''

  useEffect(() => {
    if (conversationId) setMessages(getConversationMessages(conversationId))
  }, [conversationId])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [messages, typing])

  function addBotReply(text: string) {
    const reply: ChatMessage = {
      id: `msg-${Date.now()}-bot`,
      conversationId,
      senderId: recipientId,
      senderName: recipientName,
      recipientId: user!.id,
      recipientName: user!.name,
      text,
      createdAt: new Date().toISOString(),
    }
    sendMessage(reply)
    setMessages((prev) => [...prev, reply])
    setTyping(false)
  }

  async function handleSend() {
    if (!input.trim() || !user) return
    const text = input.trim()
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      recipientId,
      recipientName,
      text,
      createdAt: new Date().toISOString(),
    }
    sendMessage(msg)
    setMessages((prev) => [...prev, msg])
    setInput('')

    // Auto-reply
    const quick = getQuickReply(text)
    if (quick) {
      setTyping(true)
      setTimeout(() => addBotReply(quick), 600 + Math.random() * 800)
    } else {
      setTyping(true)
      const reply = await getGroqReply(text, recipientName)
      setTimeout(() => addBotReply(reply), 300)
    }
  }

  const initials = recipientName.split(' ').map((n) => n[0]).join('')

  return (
    <Card className="flex h-[420px] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar className="size-8">
          {recipientAvatar && <AvatarImage src={recipientAvatar} alt={recipientName} />}
          <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">{initials}</AvatarFallback>
        </Avatar>
        <p className="flex-1 text-sm font-semibold">{recipientName}</p>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && !typing ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Say hi!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id
              return (
                <div key={msg.id} className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                      isMine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted text-foreground'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              )
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-2.5">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="shrink-0">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

/* ── Group Chat Panel (pre-seeded messages) ── */
function GroupChatPanel({
  groupName,
  onBack,
}: {
  groupName: string
  onBack: () => void
}) {
  const { user } = useAuth()
  const seedMessages = GROUP_CHAT_DATA[groupName] || []
  const [userMessages, setUserMessages] = useState<{ id: string; sender: string; text: string; minutesAgo: number }[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const allMessages = useMemo(() => [...seedMessages, ...userMessages], [seedMessages, userMessages])

  useEffect(() => {
    // scroll to bottom on mount
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50)
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [userMessages])

  function handleSend() {
    if (!input.trim() || !user) return
    setUserMessages((prev) => [...prev, {
      id: `ugm-${Date.now()}`,
      sender: user.name.split(' ')[0],
      text: input.trim(),
      minutesAgo: 0,
    }])
    setInput('')
  }

  function formatTime(minutesAgo: number) {
    if (minutesAgo === 0) return 'Just now'
    if (minutesAgo < 60) return `${minutesAgo}m ago`
    const hrs = Math.floor(minutesAgo / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const group = communityGroups.find((g) => g.name === groupName)
  const GroupIcon = group?.icon || Users

  return (
    <div className="flex h-[600px] flex-col rounded-xl border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="size-7" onClick={onBack}>
          <ChevronLeft className="size-4" />
        </Button>
        <div className={cn('flex size-8 items-center justify-center rounded-lg bg-muted', group?.color)}>
          <GroupIcon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{groupName}</p>
          <p className="text-[10px] text-muted-foreground">{group?.members} members</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-1.5">
          {allMessages.map((msg) => {
            const isMe = msg.sender === (user?.name?.split(' ')[0] || '')
            return (
              <div key={msg.id} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
                {!isMe && (
                  <span className="mb-0.5 text-[10px] font-medium text-primary/70">{msg.sender}</span>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-3 py-1.5 text-sm',
                    isMe ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted text-foreground'
                  )}
                >
                  {msg.text}
                </div>
                <span className="mt-0.5 text-[9px] text-muted-foreground/50">{formatTime(msg.minutesAgo)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder={`Message ${groupName}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="shrink-0">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Social Page ── */
export default function SocialPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('All')
  const [joinedGroups, setJoinedGroups] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('fg-joined-groups')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [activeTab, setActiveTab] = useState('discover')
  const [connectedIds, setConnectedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('fg-matches')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string; avatar: string } | null>(null)
  const [openGroupChat, setOpenGroupChat] = useState<string | null>(null)

  // Persist matches + joined groups to localStorage
  useEffect(() => {
    localStorage.setItem('fg-matches', JSON.stringify(connectedIds))
  }, [connectedIds])
  useEffect(() => {
    localStorage.setItem('fg-joined-groups', JSON.stringify(joinedGroups))
  }, [joinedGroups])

  function openChat(student: { id: string; name: string; avatar: string }) {
    setChatTarget(student)
  }

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.major.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesYear = yearFilter === 'All' || s.year === yearFilter
      return matchesSearch && matchesYear
    })
  }, [searchQuery, yearFilter])

  const matchedStudents = useMemo(
    () => students.filter((s) => connectedIds.includes(s.id)),
    [connectedIds]
  )

  function handlePass() {
    setCurrentIndex((i) => Math.min(filteredStudents.length - 1, i + 1))
  }

  function handleConnect() {
    const s = filteredStudents[currentIndex]
    if (s && !connectedIds.includes(s.id)) {
      setConnectedIds((prev) => [...prev, s.id])
    }
    // advance after animation delay
    setTimeout(() => {
      setCurrentIndex((i) => Math.min(filteredStudents.length - 1, i + 1))
    }, 50)
  }

  const toggleGroup = (name: string) => {
    setJoinedGroups((prev) => prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name])
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Find Your People</h1>
          <p className="mt-1 text-muted-foreground">Swipe right to connect, left to pass</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="discover">
              <UserPlus className="mr-1.5 size-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Heart className="mr-1.5 size-4" />
              Matches
              {connectedIds.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 px-1.5 py-0 text-[10px]">
                  {connectedIds.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessagesSquare className="mr-1.5 size-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="community">
              <Users className="mr-1.5 size-4" />
              Community
            </TabsTrigger>
          </TabsList>

          {/* ── Discover Tab ── */}
          <TabsContent value="discover">
            <div className="space-y-4 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, major, or interest..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentIndex(0) }}
                    className="pl-9"
                  />
                </div>
                <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setCurrentIndex(0) }}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>{y === 'All' ? 'All Years' : y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center gap-4">
                {filteredStudents.length === 0 ? (
                  <Card className="w-full max-w-md">
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No students match your filters.</p>
                    </CardContent>
                  </Card>
                ) : currentIndex >= filteredStudents.length ? (
                  <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                      <Sparkles className="size-8 text-primary" />
                      <p className="font-semibold">You&apos;ve seen everyone!</p>
                      <p className="text-sm text-muted-foreground">Check your matches or adjust filters.</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setCurrentIndex(0)}>Start Over</Button>
                        <Button size="sm" onClick={() => setActiveTab('matches')}>View Matches</Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {currentIndex + 1} of {filteredStudents.length}
                    </p>
                    <ProfileCard
                      key={filteredStudents[currentIndex].id}
                      student={filteredStudents[currentIndex]}
                      onPass={handlePass}
                      onConnect={handleConnect}
                    />
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ── Matches Tab ── */}
          <TabsContent value="matches">
            <div className="pt-4">
              {matchedStudents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                    <Heart className="size-10 text-muted-foreground/30" />
                    <h3 className="font-semibold">No matches yet</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Swipe right on profiles in Discover to start building your network.
                    </p>
                    <Button size="sm" onClick={() => setActiveTab('discover')}>
                      Start Discovering <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {matchedStudents.map((student) => {
                    const isChatting = chatTarget?.id === student.id
                    const initials = student.name.split(' ').map((n) => n[0]).join('')
                    return (
                      <div key={student.id} className="flex flex-col gap-3">
                        <Card className={cn('transition-all', isChatting && 'ring-2 ring-primary/30')}>
                          <CardContent className="flex items-center gap-3">
                            <Avatar className="size-12">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">{student.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{student.major}</p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <Sparkles className="size-3 text-primary" />
                                <span className="text-xs font-medium text-primary">{student.matchPercentage}% match</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant={isChatting ? 'default' : 'outline'}
                              className="shrink-0 gap-1.5"
                              onClick={() => isChatting ? setChatTarget(null) : openChat({ id: student.id, name: student.name, avatar: student.avatar })}
                            >
                              <MessageCircle className="size-3.5" />
                              {isChatting ? 'Close' : 'Chat'}
                            </Button>
                          </CardContent>
                        </Card>
                        {isChatting && (
                          <ChatPanel
                            recipientId={student.id}
                            recipientName={student.name}
                            recipientAvatar={student.avatar}
                            onClose={() => setChatTarget(null)}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Chat Tab ── */}
          <TabsContent value="chat">
            <div className="pt-4">
              {openGroupChat ? (
                <GroupChatPanel groupName={openGroupChat} onBack={() => setOpenGroupChat(null)} />
              ) : (
                <div className="flex flex-col gap-2">
                  {/* Section: Group Chats (only joined groups) */}
                  {joinedGroups.length > 0 && (
                    <>
                      <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Users className="size-3" />
                        Group Chats
                      </h3>
                      {communityGroups.filter((g) => joinedGroups.includes(g.name)).map((group) => {
                        const msgs = GROUP_CHAT_DATA[group.name] || []
                        const lastMsg = msgs[msgs.length - 1]
                        return (
                          <Card
                            key={group.name}
                            className="cursor-pointer transition-all hover:ring-2 hover:ring-primary/20"
                            onClick={() => setOpenGroupChat(group.name)}
                          >
                            <CardContent className="flex items-center gap-3 py-3">
                              <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted', group.color)}>
                                <group.icon className="size-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="truncate text-sm font-semibold">{group.name}</p>
                                  <Badge variant="secondary" className="shrink-0 text-[9px]">{group.members}</Badge>
                                </div>
                                {lastMsg && (
                                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    <span className="font-medium">{lastMsg.sender}:</span> {lastMsg.text}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                            </CardContent>
                          </Card>
                        )
                      })}
                    </>
                  )}

                  {/* Section: Match Chats */}
                  {matchedStudents.length > 0 && (
                    <>
                      <h3 className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <Heart className="size-3" />
                        Matches
                      </h3>
                      {matchedStudents.map((student) => {
                        const initials = student.name.split(' ').map((n) => n[0]).join('')
                        const isChatting = chatTarget?.id === student.id
                        return (
                          <div key={student.id} className="flex flex-col gap-2">
                            <Card
                              className={cn('cursor-pointer transition-all hover:ring-2 hover:ring-primary/20', isChatting && 'ring-2 ring-primary/30')}
                              onClick={() => isChatting ? setChatTarget(null) : openChat({ id: student.id, name: student.name, avatar: student.avatar })}
                            >
                              <CardContent className="flex items-center gap-3 py-3">
                                <Avatar className="size-10">
                                  <AvatarImage src={student.avatar} alt={student.name} />
                                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold">{student.name}</p>
                                  <p className="text-xs text-muted-foreground">{student.major}</p>
                                </div>
                                <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                              </CardContent>
                            </Card>
                            {isChatting && (
                              <ChatPanel
                                recipientId={student.id}
                                recipientName={student.name}
                                recipientAvatar={student.avatar}
                                onClose={() => setChatTarget(null)}
                              />
                            )}
                          </div>
                        )
                      })}
                    </>
                  )}

                  {matchedStudents.length === 0 && joinedGroups.length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                        <MessagesSquare className="size-8 text-muted-foreground/30" />
                        <p className="font-semibold">No chats yet</p>
                        <p className="max-w-xs text-sm text-muted-foreground">
                          Swipe right in Discover or join a Community group to start chatting.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Community Tab ── */}
          <TabsContent value="community">
            <div className="space-y-6 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {communityGroups.map((group) => {
                  const joined = joinedGroups.includes(group.name)
                  return (
                    <Card
                      key={group.name}
                      className={cn('transition-all duration-200 hover:shadow-md hover:shadow-primary/10', joined && 'ring-1 ring-primary/20')}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={cn('flex size-14 items-center justify-center rounded-xl bg-muted', group.color)}>
                            <group.icon className="size-7" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{group.name}</p>
                              {joined && (
                                <Badge variant="outline" className="border-green-500/20 bg-green-500/10 text-[10px] text-green-400">Joined</Badge>
                              )}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Users className="size-3" />
                              <span>{group.members} members</span>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground/70">
                              Connect with fellow first-gen students, share resources, and attend group events.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button
                            size="sm"
                            variant={joined ? 'outline' : 'default'}
                            onClick={() => toggleGroup(group.name)}
                            className={joined ? '' : 'bg-primary text-primary-foreground hover:bg-primary/90'}
                          >
                            {joined ? 'Leave Group' : 'Join Group'}
                          </Button>
                          {joined && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs text-muted-foreground"
                              onClick={() => openChat({ id: `group-${group.name}`, name: group.name, avatar: '' })}
                            >
                              <MessageCircle className="mr-1 size-3" />
                              Group Chat
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="border-dashed">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30">
                    <UserPlus className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Don&apos;t see your community?</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Suggest a new group and we&apos;ll help you build it.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => alert('Thanks! We\'ll review your suggestion and get back to you.')}>
                    Suggest Group
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
