'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { sendMessage as persistMessage, getConversationId } from '@/lib/storage'
import { resolveRecipientId } from '@/lib/auth'
import type { Alumni } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Star,
  Award,
  Briefcase,
  GraduationCap,
  Handshake,
  Send,
  Sparkles,
  Trophy,
  Target,
  Mic,
} from 'lucide-react'

const mentorBadgeConfig: Record<string, { icon: typeof Star; className: string }> = {
  'First-Gen Champion': { icon: Trophy, className: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  'Industry Expert': { icon: Briefcase, className: 'border-blue-500/30 bg-blue-500/10 text-blue-400' },
  'Interview Coach': { icon: Mic, className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  'Career Changer': { icon: Sparkles, className: 'border-purple-500/30 bg-purple-500/10 text-purple-400' },
  'Networking Pro': { icon: Handshake, className: 'border-rose-500/30 bg-rose-500/10 text-rose-400' },
  'Resume Guru': { icon: Target, className: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' },
  'Graduate School Guide': { icon: GraduationCap, className: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400' },
  'Research Mentor': { icon: Star, className: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' },
  'Scholarship Advisor': { icon: Award, className: 'border-teal-500/30 bg-teal-500/10 text-teal-400' },
  'Startup Mentor': { icon: Sparkles, className: 'border-orange-500/30 bg-orange-500/10 text-orange-400' },
  'Internship Connector': { icon: Handshake, className: 'border-lime-500/30 bg-lime-500/10 text-lime-400' },
}

const availableForLabels: Record<string, string> = {
  mentorship: 'Mentorship',
  referrals: 'Referrals',
  networking: 'Networking',
  internships: 'Internships',
  'career-guidance': 'Career Guidance',
}

const helpOptions = [
  'Resume & Cover Letter Review',
  'Mock Interview Practice',
  'Career Path Advice',
  'Industry Insights',
  'Networking Introduction',
  'Graduate School Guidance',
]

export function MentorCard({ alumni }: { alumni: Alumni }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedHelp, setSelectedHelp] = useState<string[]>([])
  const [sent, setSent] = useState(false)
  const { user } = useAuth()

  function toggleHelp(option: string) {
    setSelectedHelp((prev) =>
      prev.includes(option) ? prev.filter((h) => h !== option) : [...prev, option]
    )
  }

  function handleSend() {
    if (user) {
      const recipientId = resolveRecipientId(alumni.id)
      const text = [
        selectedHelp.length > 0 ? `Looking for help with: ${selectedHelp.join(', ')}` : '',
        message.trim(),
      ].filter(Boolean).join('\n\n')
      if (text) {
        persistMessage({
          id: `msg-${Date.now()}`,
          conversationId: getConversationId(user.id, recipientId),
          senderId: user.id,
          senderName: user.name,
          recipientId,
          recipientName: alumni.name,
          text,
          createdAt: new Date().toISOString(),
        })
      }
    }
    setSent(true)
    setTimeout(() => {
      setDialogOpen(false)
      setSent(false)
      setMessage('')
      setSelectedHelp([])
    }, 1800)
  }

  const initials = alumni.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <Card className="relative border-0 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:ring-2 hover:ring-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex flex-col gap-4 pt-2">
        {/* Header: Avatar + Identity */}
        <div className="flex items-start gap-4">
          <Avatar className="size-20 ring-2 ring-primary/20">
            <AvatarImage src={alumni.avatar} alt={alumni.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1 pt-1">
            <h3 className="text-base font-semibold text-foreground">{alumni.name}</h3>
            <p className="text-sm text-muted-foreground">
              {alumni.currentRole} at <span className="font-medium text-foreground/80">{alumni.company}</span>
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GraduationCap className="size-3.5" />
                Class of {alumni.graduationYear}
              </span>
              <span className="text-border">|</span>
              <span>{alumni.major}</span>
            </div>
          </div>
        </div>

        {/* Industry badge */}
        <div>
          <Badge variant="outline" className="border-primary/20 text-primary">
            {alumni.industry}
          </Badge>
        </div>

        {/* Mentor Badges */}
        <div className="flex flex-wrap gap-1.5">
          {alumni.mentorBadges.map((badge) => {
            const config = mentorBadgeConfig[badge] ?? {
              icon: Star,
              className: 'border-primary/30 bg-primary/10 text-primary',
            }
            const Icon = config.icon
            return (
              <span
                key={badge}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                  config.className
                )}
              >
                <Icon className="size-3" />
                {badge}
              </span>
            )
          })}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {alumni.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[11px]">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {alumni.bio}
        </p>

        {/* Available For */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-muted-foreground">Available for:</span>
          {alumni.availableFor.map((item) => (
            <span
              key={item}
              className="rounded-md bg-primary/8 px-1.5 py-0.5 text-[11px] text-primary"
            >
              {availableForLabels[item] ?? item}
            </span>
          ))}
        </div>

        {/* Connect Button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-1 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Handshake className="size-4" />
              Connect
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect with {alumni.name}</DialogTitle>
              <DialogDescription>
                {alumni.currentRole} at {alumni.company}
              </DialogDescription>
            </DialogHeader>

            {sent ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
                  <Send className="size-5 text-emerald-400" />
                </div>
                <p className="font-medium text-foreground">Message Sent!</p>
                <p className="text-sm text-muted-foreground">
                  {alumni.name.split(' ')[0]} will get back to you soon.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-amber-400/80">
                  Alumni love hearing from students like you. Be yourself -- they were in your shoes once.
                </p>

                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    What do you need help with?
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {helpOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleHelp(option)}
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                          selectedHelp.includes(option)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="connect-message" className="mb-2 block text-sm font-medium">
                    Your message
                  </Label>
                  <Textarea
                    id="connect-message"
                    placeholder={`Hi ${alumni.name.split(' ')[0]}, I'm a first-gen student and I'd love to learn from your experience...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {!sent && (
              <DialogFooter>
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() && selectedHelp.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <Send className="size-4" />
                  Send Message
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
