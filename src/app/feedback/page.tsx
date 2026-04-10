'use client'

import { useState } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
} from 'lucide-react'

const ratingLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing']

export default function FeedbackPage() {
  const [category, setCategory] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [aiHelpful, setAiHelpful] = useState<boolean | null>(null)

  function handleSubmit() {
    if (!category || !rating || !message.trim()) return
    // Persist feedback to localStorage
    if (typeof window !== 'undefined') {
      const { saveFeedback } = require('@/lib/storage')
      saveFeedback({
        id: `fb-${Date.now()}`,
        category,
        rating,
        message: message.trim(),
        name: name.trim() || 'Anonymous',
        aiHelpful,
        createdAt: new Date().toISOString(),
      })
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Thank you for your feedback!</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Your input helps us make NavigateASU better for every student.
            We read every piece of feedback and use it to improve the platform.
          </p>
          <Button onClick={() => { setSubmitted(false); setCategory(''); setRating(0); setMessage(''); setName(''); setAiHelpful(null) }}>
            Submit Another
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
            <p className="text-sm text-muted-foreground">
              Help us improve your experience
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Thoughts</CardTitle>
                <CardDescription>
                  Your feedback directly shapes how we build this platform.
                  No suggestion is too small.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Category */}
                <div className="flex flex-col gap-2">
                  <Label>What is this about?</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="social">Social / Friend Matching</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="alumni">Alumni Mentorship</SelectItem>
                      <SelectItem value="ai-advisor">AI Academic Advisor</SelectItem>
                      <SelectItem value="ai-decisions">College Life Guide AI</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col gap-2">
                  <Label>How would you rate your experience?</Label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="rounded p-1 transition-colors hover:bg-muted"
                      >
                        <Star
                          className={`size-7 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                    {(hoverRating || rating) > 0 && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        {ratingLabels[(hoverRating || rating) - 1]}
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Helpfulness */}
                <div className="flex flex-col gap-2">
                  <Label>Was the AI advisor helpful?</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={aiHelpful === true ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiHelpful(true)}
                      className={aiHelpful === true ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      <ThumbsUp className="mr-1 size-4" />
                      Yes, helpful
                    </Button>
                    <Button
                      variant={aiHelpful === false ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiHelpful(false)}
                      className={aiHelpful === false ? 'bg-red-600 hover:bg-red-700' : ''}
                    >
                      <ThumbsDown className="mr-1 size-4" />
                      Needs improvement
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAiHelpful(null)}
                      className="text-muted-foreground"
                    >
                      N/A
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <Label>Your feedback</Label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's working, what's not, or what you'd love to see..."
                    rows={5}
                  />
                </div>

                {/* Name (optional) */}
                <div className="flex flex-col gap-2">
                  <Label>
                    Name <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!category || !rating || !message.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="mr-2 size-4" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <Sparkles className="size-8 text-primary" />
                <h3 className="mt-3 font-semibold">Your voice matters</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  NavigateASU was built for students like you.
                  Every piece of feedback helps us make it better.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What we do with feedback</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">1</Badge>
                  <span>We review every submission within 48 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">2</Badge>
                  <span>Bug reports go straight to our dev team</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">3</Badge>
                  <span>Feature requests are prioritized by student votes</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5 size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px]">4</Badge>
                  <span>AI feedback trains our models to give better advice</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
