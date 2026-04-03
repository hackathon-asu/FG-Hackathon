'use client'

import { useState } from 'react'
import type { SuggestedQuestion } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MessageCircleQuestion, ChevronDown, ChevronUp } from 'lucide-react'

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[]
  onSelect: (text: string) => void
}

export function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <MessageCircleQuestion className="size-4" />
          <span>Suggested questions</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? 'Show less' : 'View more'}
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>
      </div>
      <div
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          expanded ? 'max-h-[500px]' : 'max-h-[2.25rem]'
        )}
      >
        <div className="flex flex-wrap gap-2">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => onSelect(q.text)}
              className={cn(
                'rounded-full border border-border/60 bg-muted/50 px-3 py-1',
                'text-left text-[11px] font-medium text-foreground/80',
                'transition-all duration-200',
                'hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
              )}
            >
              {q.text}
            </button>
          ))}
        </div>
        {/* Fade-out gradient when collapsed to hint there's more */}
        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
    </div>
  )
}
