'use client'

import { useRef, useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import {
  ChatInterface,
  type ChatInterfaceHandle,
} from '@/components/advising/chat-interface'
import { ResourcePanel } from '@/components/advising/resource-panel'
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
  Briefcase,
  Users,
  Target,
  FileText,
  Presentation,
  TrendingUp,
} from 'lucide-react'

const commonTopics = [
  {
    icon: Briefcase,
    label: 'Internship Prep',
    question:
      'How do I find and prepare for internships as a first-gen student with no connections?',
  },
  {
    icon: FileText,
    label: 'Resume Building',
    question:
      'How do I build a strong resume when I don\'t have much experience yet?',
  },
  {
    icon: Presentation,
    label: 'Career Fairs',
    question:
      'How do I prepare for a career fair? What should I say and bring?',
  },
  {
    icon: Users,
    label: 'Networking',
    question:
      'How do I network professionally when no one in my family has done this before?',
  },
  {
    icon: Target,
    label: 'Career Planning',
    question:
      'How do I start planning my career path and set realistic goals?',
  },
  {
    icon: TrendingUp,
    label: 'Salary Negotiation',
    question:
      'How do I negotiate salary and benefits for my first job offer?',
  },
]

export default function DecisionsPage() {
  const [chatStarted, setChatStarted] = useState(false)
  const chatRef = useRef<ChatInterfaceHandle>(null)

  function handleSelectTopic(question: string) {
    setChatStarted(true)
    setTimeout(() => {
      chatRef.current?.sendQuestion(question)
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
                Career Guide
              </h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your AI-powered career advisor for internships, jobs, and professional growth
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
                  <SheetTitle>Career Resources</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ResourcePanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Common Topics (before chat starts) */}
        {!chatStarted && (
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                What can I help with?
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {commonTopics.map((topic) => (
                  <button
                    key={topic.label}
                    onClick={() => handleSelectTopic(topic.question)}
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

          </div>
        )}

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Chat Area */}
          <Card className="flex-1 overflow-hidden" style={{ height: '70vh' }}>
            <ChatInterface
              ref={chatRef}
              api="/api/chat/decisions"
              placeholder="Ask about internships, resumes, career fairs, networking..."
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
