'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { EventCard } from '@/components/events/event-card'
import { events } from '@/lib/data/events'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Search, Plus, Target, Sparkles } from 'lucide-react'
import type { Event } from '@/lib/types'

const categories: { value: Event['category'] | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'career', label: 'Career' },
  { value: 'social', label: 'Social' },
  { value: 'academic', label: 'Academic' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'first-gen', label: 'First-Gen' },
]

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<
    Event['category'] | 'all'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const recommendedEvents = useMemo(
    () => events.filter((e) => e.category === 'first-gen').slice(0, 2),
    []
  )

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesCategory =
        activeCategory === 'all' || e.category === activeCategory
      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Campus Events
            </h1>
            <p className="mt-1 text-muted-foreground">
              Never miss an opportunity
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Share an Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share an Event</DialogTitle>
                <DialogDescription>
                  Let the community know about an upcoming event.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input id="event-title" placeholder="Event name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input id="event-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-time">Time</Label>
                    <Input id="event-time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c.value !== 'all')
                        .map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-location">Location</Label>
                  <Input id="event-location" placeholder="Where is it?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-desc">Description</Label>
                  <Textarea
                    id="event-desc"
                    placeholder="Tell people what to expect..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Share Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recommended Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <Target className="size-4 text-primary" />
              <span className="text-sm font-semibold">Recommended for you</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {recommendedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg bg-card/60 p-3"
                >
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="font-medium">{event.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}{' '}
                      at {event.time} &middot; {event.rsvpCount} going
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              className={cn(
                'cursor-pointer px-3 py-1 text-sm transition-colors',
                activeCategory === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
              onClick={() => setActiveCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No events found. Try a different filter or search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
