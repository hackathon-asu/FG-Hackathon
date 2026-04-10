'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveFeedback } from '@/lib/storage'
import { useAuth } from '@/components/auth/auth-provider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MessageSquarePlus, Send, CheckCircle2, Star } from 'lucide-react'

const categories = ['General', 'AI Advisor', 'Career Guide', 'Social', 'Events', 'Bug Report']

export function FloatingFeedback() {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [category, setCategory] = useState('General')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const pathname = usePathname()

  // Don't show on login/onboarding/demo pages
  if (['/login', '/onboarding', '/demo', '/alumni/signup'].some((p) => pathname.startsWith(p))) {
    return null
  }
  if (!user) return null

  function handleSubmit() {
    if (!message.trim()) return
    saveFeedback({
      id: `fb-${Date.now()}`,
      category,
      rating,
      message: message.trim(),
      name: user?.name || 'Anonymous',
      aiHelpful: null,
      createdAt: new Date().toISOString(),
    })
    setSent(true)
    setTimeout(() => {
      setOpen(false)
      setSent(false)
      setMessage('')
      setRating(0)
      setCategory('General')
    }, 1500)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6"
        title="Send feedback"
      >
        <MessageSquarePlus className="size-5" />
      </button>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Quick Feedback</DialogTitle>
          </DialogHeader>

          {sent ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-6 text-emerald-400" />
              </div>
              <p className="font-medium">Thank you!</p>
              <p className="text-sm text-muted-foreground">Your feedback helps us improve.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
                      category === c
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Star rating */}
              <div>
                <Label className="mb-1.5 block text-xs text-muted-foreground">How&apos;s your experience?</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          'size-6',
                          n <= rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground/30'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <Textarea
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                autoFocus
              />

              <Button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="w-full"
              >
                <Send className="size-4" />
                Send Feedback
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
