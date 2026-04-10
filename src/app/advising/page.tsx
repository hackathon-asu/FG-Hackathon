'use client'

import { useRef, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import {
  ChatInterface,
  type ChatInterfaceHandle,
} from '@/components/advising/chat-interface'
import { ChatHistory } from '@/components/advising/chat-history'
import { SuggestedQuestions } from '@/components/advising/suggested-questions'
import { ResourcePanel } from '@/components/advising/resource-panel'
import { advisingQuestions } from '@/lib/data/questions'
import type { ChatSession } from '@/lib/storage'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BookOpen, History } from 'lucide-react'

export default function AdvisingPage() {
  const [chatStarted, setChatStarted] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const chatRef = useRef<ChatInterfaceHandle>(null)

  function handleSelectQuestion(text: string) {
    setChatStarted(true)
    setTimeout(() => {
      chatRef.current?.sendQuestion(text)
    }, 50)
  }

  function handleSelectSession(session: ChatSession) {
    setChatStarted(true)
    setActiveSessionId(session.id)
    chatRef.current?.loadSession(session)
    setShowHistory(false)
  }

  function handleNewChat() {
    setChatStarted(false)
    setActiveSessionId(null)
    chatRef.current?.clearChat()
    setShowHistory(false)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                AI Academic Advisor
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                RAG Grounded
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              ASU questions are answered from verified sources. General education questions can use broader guidance.
            </p>
          </div>

          <div className="flex gap-2">
            {/* History toggle (mobile + desktop) */}
            <Button
              variant={showHistory ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="size-4" />
              History
            </Button>

            {/* Mobile resource toggle */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <BookOpen className="size-4" />
                    Resources
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="overflow-y-auto p-4">
                  <SheetHeader>
                    <SheetTitle>Campus Resources</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    <ResourcePanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Suggested Questions (before chat starts) */}
        {!chatStarted && !showHistory && (
          <SuggestedQuestions
            questions={advisingQuestions}
            onSelect={handleSelectQuestion}
          />
        )}

        {/* Main Layout */}
        <div className="flex gap-4">
          {/* Chat History Panel */}
          {showHistory && (
            <Card className="hidden w-64 shrink-0 overflow-hidden sm:block" style={{ height: '70vh' }}>
              <ChatHistory
                chatType="advising"
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
                onNewChat={handleNewChat}
              />
            </Card>
          )}

          {/* Mobile History Sheet */}
          {showHistory && (
            <Sheet open={showHistory} onOpenChange={setShowHistory}>
              <SheetContent side="left" className="w-72 p-0 sm:hidden">
                <SheetHeader className="sr-only">
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <ChatHistory
                  chatType="advising"
                  activeSessionId={activeSessionId}
                  onSelectSession={handleSelectSession}
                  onNewChat={handleNewChat}
                />
              </SheetContent>
            </Sheet>
          )}

          {/* Chat Area */}
          <Card className="flex-1 overflow-hidden" style={{ height: '70vh' }}>
            <ChatInterface
              ref={chatRef}
              api="/api/chat/advising"
              chatType="advising"
              placeholder="Try: What does ASU say about repeating a course?"
              onFirstMessage={() => setChatStarted(true)}
              onSessionChange={(id) => setActiveSessionId(id)}
            />
          </Card>

          {/* Desktop Resource Panel */}
          <div className="hidden w-72 shrink-0 md:block lg:w-80">
            <ResourcePanel />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
