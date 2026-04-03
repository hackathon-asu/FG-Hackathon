'use client'

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Send, Bot, User, Loader2 } from 'lucide-react'

export interface ChatInterfaceHandle {
  sendQuestion: (text: string) => void
}

interface ChatInterfaceProps {
  api: string
  placeholder?: string
  onFirstMessage?: () => void
}

export const ChatInterface = forwardRef<ChatInterfaceHandle, ChatInterfaceProps>(
  function ChatInterface(
    {
      api,
      placeholder = 'Ask about classes, majors, schedules...',
      onFirstMessage,
    },
    ref
  ) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const firstMessageFired = useRef(false)

    const [input, setInput] = useState('')

    const { messages, sendMessage, status } = useChat({
      transport: new DefaultChatTransport({ api }),
    })

    const isLoading = status === 'submitted' || status === 'streaming'

    useImperativeHandle(ref, () => ({
      sendQuestion(text: string) {
        sendMessage({ text })
      },
    }))

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, [messages, status])

    useEffect(() => {
      if (messages.length > 0 && !firstMessageFired.current) {
        firstMessageFired.current = true
        onFirstMessage?.()
      }
    }, [messages.length, onFirstMessage])

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

    const hasMessages = messages.length > 0

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
                  Ask me anything about your academics, campus resources, or
                  college life. No question is too basic.
                </p>
              </div>
            )}

            {messages.map((message) => {
              const isUser = message.role === 'user'
              return (
                <div
                  key={message.id}
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
        </div>
      </div>
    )
  }
)
