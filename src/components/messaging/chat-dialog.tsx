'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import {
  sendMessage,
  getConversationMessages,
  getConversationId,
} from '@/lib/storage'
import type { ChatMessage } from '@/lib/storage'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientId: string
  recipientName: string
  recipientAvatar?: string
}

export function ChatDialog({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientAvatar,
}: ChatDialogProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const conversationId = user ? getConversationId(user.id, recipientId) : ''

  useEffect(() => {
    if (open && conversationId) {
      setMessages(getConversationMessages(conversationId))
    }
  }, [open, conversationId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  function handleSend() {
    if (!input.trim() || !user) return
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      recipientId,
      recipientName,
      text: input.trim(),
      createdAt: new Date().toISOString(),
    }
    sendMessage(msg)
    setMessages((prev) => [...prev, msg])
    setInput('')
  }

  const initials = recipientName
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[500px] max-w-md flex-col gap-0 p-0">
        <DialogHeader className="border-b px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              {recipientAvatar && <AvatarImage src={recipientAvatar} alt={recipientName} />}
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-sm font-semibold">{recipientName}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-muted-foreground">
                No messages yet. Say hi!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id
                return (
                  <div
                    key={msg.id}
                    className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm',
                        isMine
                          ? 'rounded-br-md bg-primary text-primary-foreground'
                          : 'rounded-bl-md bg-muted text-foreground'
                      )}
                    >
                      {msg.text}
                      <p className={cn(
                        'mt-1 text-[10px]',
                        isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
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
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
