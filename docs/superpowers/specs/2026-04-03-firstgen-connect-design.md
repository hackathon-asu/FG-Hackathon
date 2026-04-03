# FirstGen Connect — Design Spec

## Overview

A web platform for first-generation college students providing social connections, event discovery, alumni mentorship, and AI-powered guidance. Built with Next.js 15, Tailwind CSS, shadcn/ui, and Gemini 2.5 Flash.

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page — problem statement, features, testimonials, CTA |
| `/social` | Friend matching — swipe-style profile cards, match %, filters |
| `/events` | Event discovery — filterable card grid with RSVP |
| `/alumni` | Alumni mentorship — mentor profiles, skill badges, connect flow |
| `/advising` | AI academic advisor — chat UI with resource side panel |
| `/decisions` | AI college life co-pilot — chat UI with suggested questions |
| `/dashboard` | Student overview — stats, upcoming events, matches, AI suggestions |
| `/onboarding` | Sign-up flow (UI only, no auth backend) |

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui (new-york style, zinc base)
- **AI:** AI SDK v6 + `@ai-sdk/google` (Gemini 2.5 Flash)
- **Chat UI:** AI Elements (Conversation, Message, PromptInput)
- **Fonts:** Geist Sans + Geist Mono
- **Theme:** Dark mode default, warm amber primary accent

## Visual Design

- **Base palette:** zinc/neutral
- **Primary:** warm amber (approachable, optimistic)
- **Secondary:** soft coral for highlights
- **Success:** sage green
- **Radius:** 0.625rem
- **Density:** comfortable (gap-6, p-6, text-sm)
- **Icons:** Lucide at h-4 w-4 / h-5 w-5
- **Tone:** Supportive, never judgmental ("You're not behind", "One step at a time")

## Data Model

```typescript
interface Student {
  id: string
  name: string
  avatar: string
  major: string
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior'
  interests: string[]
  careerGoals: string[]
  clubs: string[]
  background: string
  challenges: string[]
  matchPercentage?: number
}

interface Alumni {
  id: string
  name: string
  avatar: string
  graduationYear: number
  major: string
  currentRole: string
  company: string
  industry: string
  skills: string[]
  mentorBadges: string[]
  bio: string
  availableFor: ('mentorship' | 'referrals' | 'networking' | 'internships' | 'career-guidance')[]
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: 'career' | 'social' | 'academic' | 'cultural' | 'first-gen'
  organizer: string
  imageUrl?: string
  rsvpCount: number
  saved?: boolean
}
```

## AI Integration

Two API routes with distinct system prompts:

### `/api/chat/advising`
Academic advisor persona. Knows about: classes, schedules, majors, office hours, academic struggles, campus resources, deadlines. Context-aware, remembers conversation history within session.

### `/api/chat/decisions`
College life co-pilot persona. Empathetic, practical. Handles: class decisions, professor interactions, club selection, internship prep, career fairs, major changes, campus resources. Proactive with suggested next steps after each response.

Both use: `google('gemini-2.5-flash-preview-04-17')` via AI SDK v6, streamed with `toUIMessageStreamResponse()`, rendered with AI Elements.

## Component Architecture

### Shared
- `AppSidebar` — desktop sidebar nav with icons
- `MobileNav` — bottom tab bar on mobile
- `ThemeProvider` — dark mode via next-themes

### Landing
- `Hero` — headline, subheadline, CTA buttons
- `FeatureCards` — 5 feature highlights with icons
- `HowItWorks` — 3-step process
- `Testimonials` — mock student testimonials
- `CTASection` — final call to action

### Social
- `ProfileCard` — swipeable student card with tags, match %
- `MatchList` — list of matched students
- `FriendFilters` — filter by major, year, interests

### Events
- `EventCard` — event details with RSVP/save buttons
- `EventFilters` — category filter bar
- `EventGrid` — responsive card grid

### Alumni
- `MentorCard` — alumni profile with badges and connect CTA
- `MentorFilters` — filter by industry, skill, availability
- `ConnectFlow` — reach out dialog

### AI Pages
- AI Elements: `Conversation`, `Message`, `PromptInput`
- `ResourcePanel` — side panel with relevant campus resources
- `SuggestedQuestions` — quick-start question chips

### Dashboard
- `StatsCards` — key metrics (matches, events, sessions)
- `UpcomingEvents` — next 3 events
- `RecentMatches` — latest friend matches
- `AIActions` — AI-suggested next steps

## File Structure

```
src/
  app/
    layout.tsx
    page.tsx                 # Landing
    globals.css
    social/page.tsx
    events/page.tsx
    alumni/page.tsx
    advising/page.tsx
    decisions/page.tsx
    dashboard/page.tsx
    onboarding/page.tsx
    api/chat/advising/route.ts
    api/chat/decisions/route.ts
  components/
    ui/                      # shadcn components
    ai-elements/             # AI Elements components
    layout/                  # AppSidebar, MobileNav
    landing/                 # Landing page sections
    social/                  # Social page components
    events/                  # Events page components
    alumni/                  # Alumni page components
    advising/                # Advising page components
    decisions/               # Decisions page components
    dashboard/               # Dashboard components
  lib/
    utils.ts                 # cn() utility
    data/
      students.ts            # Mock student data
      alumni.ts              # Mock alumni data
      events.ts              # Mock event data
    types.ts                 # Shared interfaces
```

## Environment

```
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
```

## Non-Goals

- No real authentication/authorization
- No database — all mock data in TypeScript files
- No real-time features (WebSocket, etc.)
- No file uploads
- No payment/billing
