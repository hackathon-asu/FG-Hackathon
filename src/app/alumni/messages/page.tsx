'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { ChatDialog } from '@/components/messaging/chat-dialog'
import { useAuth } from '@/components/auth/auth-provider'
import { getUserConversations } from '@/lib/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Inbox, ArrowRight } from 'lucide-react'

export default function AlumniMessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<ReturnType<typeof getUserConversations>>([])
  const [chatOpen, setChatOpen] = useState(false)
  const [chatTarget, setChatTarget] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (user) {
      setConversations(getUserConversations(user.id))
    }
  }, [user, chatOpen]) // refresh when chat closes

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
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
          <div className="flex flex-col gap-2">
            {conversations.map((convo) => {
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
            })}
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
