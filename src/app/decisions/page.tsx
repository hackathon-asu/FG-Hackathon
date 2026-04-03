'use client'

import { useRef, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import {
  ChatInterface,
  type ChatInterfaceHandle,
} from '@/components/advising/chat-interface'
import { SuggestedQuestions } from '@/components/advising/suggested-questions'
import { ResourcePanel } from '@/components/advising/resource-panel'
import { decisionQuestions } from '@/lib/data/questions'
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
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Briefcase,
  Users,
  Lightbulb,
  Target,
  BookMarked,
} from 'lucide-react'

const commonTopics = [
  {
    icon: GraduationCap,
    label: 'Talking to Professors',
    question: 'How do I approach a professor and build a relationship with them?',
  },
  {
    icon: Briefcase,
    label: 'Internship Prep',
    question:
      'How do I find and prepare for internships as a first-gen student with no connections?',
  },
  {
    icon: Lightbulb,
    label: 'Choosing a Major',
    question:
      'How do I choose the right major when I am unsure about my career path?',
  },
  {
    icon: Users,
    label: 'Campus Involvement',
    question:
      'What clubs and organizations should I join to build my network and resume?',
  },
  {
    icon: Target,
    label: 'Career Planning',
    question:
      'How do I start planning my career when no one in my family has done this before?',
  },
  {
    icon: BookMarked,
    label: 'Study Strategies',
    question:
      'What are the most effective study strategies for college-level courses?',
  },
]

export default function DecisionsPage() {
  const [chatStarted, setChatStarted] = useState(false)
  const chatRef = useRef<ChatInterfaceHandle>(null)

  function handleSelectQuestion(text: string) {
    setChatStarted(true)
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
                College Life Guide
              </h1>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" />
                Powered by AI
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your trusted co-pilot for college decisions
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

        {/* Suggested Questions + Topics (before chat starts) */}
        {!chatStarted && (
          <div className="space-y-5">
            <SuggestedQuestions
              questions={decisionQuestions}
              onSelect={handleSelectQuestion}
            />

            {/* Common Topics */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Common Topics
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {commonTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => handleSelectQuestion(topic.question)}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-center transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <topic.icon className="size-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground/80 group-hover:text-primary">
                      {topic.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Supportive Banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm text-foreground/80">
              No question is too basic. We are here to help.
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Chat Area */}
          <Card className="flex-1 overflow-hidden" style={{ height: '70vh' }}>
            <ChatInterface
              ref={chatRef}
              api="/api/chat/decisions"
              placeholder="Ask about college life, internships, career fairs..."
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
