'use client'

import { useRef, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import {
  ChatInterface,
  type ChatInterfaceHandle,
} from '@/components/advising/chat-interface'
import { SuggestedQuestions } from '@/components/advising/suggested-questions'
import { ResourcePanel } from '@/components/advising/resource-panel'
import { advisingQuestions } from '@/lib/data/questions'
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
import { Sparkles, BookOpen } from 'lucide-react'

export default function AdvisingPage() {
  const [chatStarted, setChatStarted] = useState(false)
  const chatRef = useRef<ChatInterfaceHandle>(null)

  function handleSelectQuestion(text: string) {
    setChatStarted(true)
    // Small delay so chat mounts before we try to interact
    setTimeout(() => {
      chatRef.current?.sendQuestion(text)
    }, 50)
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
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Get personalized guidance for your academic journey
            </p>
          </div>

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

        {/* Suggested Questions (before chat starts) */}
        {!chatStarted && (
          <SuggestedQuestions
            questions={advisingQuestions}
            onSelect={handleSelectQuestion}
          />
        )}

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Chat Area */}
          <Card className="flex-1 overflow-hidden" style={{ height: '70vh' }}>
            <ChatInterface
              ref={chatRef}
              api="/api/chat/advising"
              placeholder="Ask about classes, majors, schedules..."
              onFirstMessage={() => setChatStarted(true)}
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
