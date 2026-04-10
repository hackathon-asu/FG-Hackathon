'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { getChatSessions, deleteChatSession } from '@/lib/storage'
import type { ChatSession } from '@/lib/storage'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react'

interface ChatHistoryProps {
  chatType: string
  activeSessionId: string | null
  onSelectSession: (session: ChatSession) => void
  onNewChat: () => void
}

export function ChatHistory({ chatType, activeSessionId, onSelectSession, onNewChat }: ChatHistoryProps) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    if (user) {
      setSessions(getChatSessions(user.id, chatType))
    }
  }, [user, chatType, activeSessionId])

  function handleDelete(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation()
    if (!user) return
    deleteChatSession(user.id, chatType, sessionId)
    setSessions(getChatSessions(user.id, chatType))
    if (activeSessionId === sessionId) {
      onNewChat()
    }
  }

  function formatDate(dateStr: string): string {
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Clock className="size-3" />
          Chat History
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={onNewChat}
        >
          <Plus className="size-3" />
          New
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-1.5">
          {sessions.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <MessageSquare className="mx-auto size-8 text-muted-foreground/30" />
              <p className="mt-2 text-xs text-muted-foreground">No previous chats</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={cn(
                  'group flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/60',
                  activeSessionId === session.id && 'bg-primary/10 text-primary'
                )}
              >
                <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{session.title}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {session.messages.length} messages · {formatDate(session.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, session.id)}
                  className="mt-0.5 hidden shrink-0 rounded p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:block"
                >
                  <Trash2 className="size-3" />
                </button>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
