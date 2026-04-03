'use client'

import { useState } from 'react'
import type { Event } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  BookmarkCheck,
  Users,
  User,
} from 'lucide-react'

const categoryConfig: Record<
  Event['category'],
  { label: string; className: string }
> = {
  career: {
    label: 'Career',
    className: 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25',
  },
  social: {
    label: 'Social',
    className: 'bg-purple-500/15 text-purple-400 hover:bg-purple-500/25',
  },
  academic: {
    label: 'Academic',
    className: 'bg-green-500/15 text-green-400 hover:bg-green-500/25',
  },
  cultural: {
    label: 'Cultural',
    className: 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25',
  },
  'first-gen': {
    label: 'First-Gen',
    className: 'bg-primary/15 text-primary hover:bg-primary/25',
  },
}

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const [saved, setSaved] = useState(event.saved ?? false)
  const [rsvpd, setRsvpd] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const config = categoryConfig[event.category]

  const formattedDate = new Date(event.date + 'T00:00:00').toLocaleDateString(
    'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )

  return (
    <Card
      className={cn(
        'transition-all duration-300',
        isHovered && 'shadow-lg shadow-primary/10 ring-primary/30'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="space-y-3">
        {/* Category Badge */}
        <div className="flex items-start justify-between">
          <Badge className={config.className}>{config.label}</Badge>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSaved(!saved)}
            className={cn(saved && 'text-primary')}
          >
            {saved ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold leading-snug">{event.title}</h3>

        {/* Description (2-line truncate) */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>

        {/* Date / Time / Location */}
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="size-3.5 shrink-0" />
            <span>{formattedDate}</span>
            <Clock className="ml-2 size-3.5 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Organizer + RSVP Count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="size-3" />
            <span>{event.organizer}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3" />
            <span>{rsvpd ? event.rsvpCount + 1 : event.rsvpCount} going</span>
          </div>
        </div>

        {/* RSVP Button */}
        <Button
          className="w-full"
          variant={rsvpd ? 'secondary' : 'default'}
          onClick={() => setRsvpd(!rsvpd)}
        >
          {rsvpd ? 'Cancel RSVP' : 'RSVP'}
        </Button>
      </CardContent>
    </Card>
  )
}
