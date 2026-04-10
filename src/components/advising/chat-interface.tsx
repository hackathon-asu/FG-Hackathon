'use client'

import { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { isActionableAdvice, createSalesforceTicket } from '@/lib/salesforce'
import { saveTicket, saveChatSession } from '@/lib/storage'
import { useAuth } from '@/components/auth/auth-provider'
import type { SalesforceTicket } from '@/lib/types'
import type { ChatSession } from '@/lib/storage'
import {
  Send,
  Bot,
  User,
  Loader2,
  Ticket,
  CheckCircle2,
  ArrowUpRight,
  Building2,
} from 'lucide-react'

export interface ChatInterfaceHandle {
  sendQuestion: (text: string) => void
  loadSession: (session: ChatSession) => void
  clearChat: () => void
}

interface ChatInterfaceProps {
  api: string
  chatType: string
  placeholder?: string
  onFirstMessage?: () => void
  onSessionChange?: (sessionId: string) => void
}

function TicketCard({ ticket }: { ticket: SalesforceTicket }) {
  return (
    <div className="mx-12 my-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
      <div className="flex items-start gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Ticket className="size-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-primary">
              ASU Support Ticket Created
            </p>
            <Badge variant="outline" className="border-primary/20 text-[10px] text-primary">
              <CheckCircle2 className="mr-1 size-2.5" />
              {ticket.caseNumber}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
            {ticket.subject}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              <Building2 className="mr-1 size-2.5" />
              {ticket.assignedTo}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-[10px]',
                ticket.priority === 'high' && 'border-red-500/30 text-red-400',
                ticket.priority === 'medium' && 'border-yellow-500/30 text-yellow-400',
                ticket.priority === 'low' && 'border-green-500/30 text-green-400'
              )}
            >
              {ticket.priority} priority
            </Badge>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground/60">
            A support case has been opened with ASU Salesforce. An advisor will follow up within 24-48 hours.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-xs text-primary hover:text-primary"
        >
          View
          <ArrowUpRight className="ml-1 size-3" />
        </Button>
      </div>
    </div>
  )
}

/** Read-only display of a previously saved session */
function PreviousMessages({ session }: { session: ChatSession }) {
  return (
    <>
      {session.messages.map((msg, i) => {
        const isUser = msg.role === 'user'
        return (
          <div
            key={`prev-${i}`}
            className={cn(
              'flex items-start gap-3',
              isUser ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            <Avatar className="mt-0.5 size-8 shrink-0">
              <AvatarFallback
                className={cn(
                  'text-xs font-medium',
                  isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/70 text-foreground ring-1 ring-border/50'
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        )
      })}
    </>
  )
}

export const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(
  function ChatInterface(
    {
      api,
      chatType,
      placeholder = 'Ask about classes, majors, schedules...',
      onFirstMessage,
      onSessionChange,
    },
    ref
  ) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const firstMessageFired = useRef(false)
    const { user } = useAuth()

    const [input, setInput] = useState('')
    const [tickets, setTickets] = useState<Record<string, SalesforceTicket>>({})
    const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`)
    const [loadedSession, setLoadedSession] = useState<ChatSession | null>(null)

    const { messages, sendMessage, status, setMessages: setChatMessages } = useChat({
      transport: new DefaultChatTransport({ api }),
    })

    const isLoading = status === 'submitted' || status === 'streaming'

    // Persist session to localStorage when messages change
    useEffect(() => {
      if (!user || messages.length === 0) return
      // Don't persist while still streaming
      if (status !== 'ready') return

      const flatMessages = messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.parts
          ?.filter((p) => p.type === 'text')
          .map((p) => (p as { text: string }).text)
          .join('') ?? '',
      })).filter((m) => m.content)

      if (flatMessages.length === 0) return

      // Use first user message as title
      const firstUserMsg = flatMessages.find((m) => m.role === 'user')
      const title = firstUserMsg?.content.slice(0, 80) || 'New chat'

      saveChatSession({
        id: sessionId,
        chatType,
        userId: user.id,
        title,
        messages: flatMessages,
        createdAt: loadedSession?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }, [messages, status, user, sessionId, chatType, loadedSession])

    const clearChat = useCallback(() => {
      const newId = `session-${Date.now()}`
      setSessionId(newId)
      setLoadedSession(null)
      setChatMessages([])
      setTickets({})
      firstMessageFired.current = false
      onSessionChange?.(newId)
    }, [setChatMessages, onSessionChange])

    const loadSession = useCallback((session: ChatSession) => {
      setSessionId(session.id)
      setLoadedSession(session)
      setChatMessages([])
      setTickets({})
      firstMessageFired.current = true
      onFirstMessage?.()
      onSessionChange?.(session.id)
    }, [setChatMessages, onFirstMessage, onSessionChange])

    useImperativeHandle(ref, () => ({
      sendQuestion(text: string) {
        sendMessage({ text })
      },
      loadSession,
      clearChat,
    }))

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, [messages, status, tickets, loadedSession])

    useEffect(() => {
      if (messages.length > 0 && !firstMessageFired.current) {
        firstMessageFired.current = true
        onFirstMessage?.()
      }
    }, [messages.length, onFirstMessage])

    // Check for actionable AI responses and create tickets
    useEffect(() => {
      if (status !== 'ready' || messages.length < 2) return

      const lastMsg = messages[messages.length - 1]
      if (lastMsg.role !== 'assistant' || tickets[lastMsg.id]) return

      const responseText = lastMsg.parts
        ?.filter((p) => p.type === 'text')
        .map((p) => (p as { text: string }).text)
        .join('')

      if (!responseText) return

      const userMsg = messages[messages.length - 2]
      const userText = userMsg?.parts
        ?.filter((p) => p.type === 'text')
        .map((p) => (p as { text: string }).text)
        .join('')

      if (userText && isActionableAdvice(responseText)) {
        const ticket = createSalesforceTicket(userText, responseText)
        saveTicket(ticket)
        setTickets((prev) => ({ ...prev, [lastMsg.id]: ticket }))
      }
    }, [messages, status, tickets])

    function handleSend() {
      if (!input.trim() || isLoading) return
      sendMessage({ text: input })
      setInput('')
    }

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const hasMessages = messages.length > 0 || loadedSession !== null

    return (
      <div className="flex h-full flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col gap-4 p-4">
            {!hasMessages && (
              <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="size-8 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  How can I help you today?
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  No question is too basic. We are here to help you launch your career.
                </p>
              </div>
            )}

            {/* Show loaded session messages first */}
            {loadedSession && <PreviousMessages session={loadedSession} />}

            {/* Then show new messages from this session */}
            {messages.map((message) => {
              const isUser = message.role === 'user'
              return (
                <div key={message.id}>
                  <div
                    className={cn(
                      'flex items-start gap-3',
                      isUser ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <Avatar className="mt-0.5 size-8 shrink-0">
                      <AvatarFallback
                        className={cn(
                          'text-xs font-medium',
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {isUser ? (
                          <User className="size-4" />
                        ) : (
                          <Bot className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                        isUser
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/70 text-foreground ring-1 ring-border/50'
                      )}
                    >
                      {message.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <p key={i} className="whitespace-pre-wrap">
                              {part.text}
                            </p>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>

                  {/* Salesforce Ticket Card */}
                  {!isUser && tickets[message.id] && (
                    <TicketCard ticket={tickets[message.id]} />
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {isLoading &&
              messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex items-start gap-3">
                  <Avatar className="mt-0.5 size-8 shrink-0">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl bg-muted/70 px-4 py-3 ring-1 ring-border/50">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1 rounded-xl border-border/60 bg-muted/40 focus-visible:ring-primary/30"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="size-10 shrink-0 rounded-xl bg-primary hover:bg-primary/90"
            >
              <Send className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
            Actionable advice is automatically shared with ASU support via Salesforce
          </p>
        </div>
      </div>
    )
  }
)
