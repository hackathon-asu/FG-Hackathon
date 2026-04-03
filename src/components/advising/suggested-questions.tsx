'use client'

import type { SuggestedQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MessageCircleQuestion } from 'lucide-react'

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[]
  onSelect: (text: string) => void
}

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <MessageCircleQuestion className="size-4" />
        <span>Suggested questions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => onSelect(q.text)}
            className={cn(
              'rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5',
              'text-left text-xs font-medium text-foreground/80',
              'transition-all duration-200',
              'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
            )}
          >
            {q.text}
          </button>
        ))}
      </div>
    </div>
  )
}
