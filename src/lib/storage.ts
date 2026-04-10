/**
 * Client-side localStorage persistence layer.
 * In production, swap with a real database API.
 */

const KEYS = {
  PROFILE: 'fg-profile',
  FEEDBACK: 'fg-feedback',
  TICKETS: 'fg-tickets',
  ALUMNI_SIGNUPS: 'fg-alumni-signups',
  EVENTS: 'fg-user-events',
} as const

// ─── User Profile ───────────────────────────────────────────

export interface UserProfile {
  name: string
  email: string
  major: string
  year: string
  interests: string[]
  firstGen: boolean | null
  careerGoals: string
  createdAt: string
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
}

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(KEYS.PROFILE)
  return raw ? JSON.parse(raw) : null
}

// ─── Feedback ───────────────────────────────────────────────

export interface FeedbackEntry {
  id: string
  category: string
  rating: number
  message: string
  name: string
  aiHelpful: boolean | null
  createdAt: string
}

export function saveFeedback(entry: FeedbackEntry): void {
  const existing = getFeedbackEntries()
  existing.unshift(entry)
  localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(existing))
}

export function getFeedbackEntries(): FeedbackEntry[] {
  const raw = localStorage.getItem(KEYS.FEEDBACK)
  return raw ? JSON.parse(raw) : []
}

// ─── Salesforce Tickets ─────────────────────────────────────

import type { SalesforceTicket } from './types'

export function saveTicket(ticket: SalesforceTicket): void {
  const existing = getTickets()
  existing.unshift(ticket)
  localStorage.setItem(KEYS.TICKETS, JSON.stringify(existing))
}

export function getTickets(): SalesforceTicket[] {
  const raw = localStorage.getItem(KEYS.TICKETS)
  return raw ? JSON.parse(raw) : []
}

export function updateTicketStatus(ticketId: string, status: string, note?: string): void {
  const tickets = getTickets()
  const idx = tickets.findIndex(t => t.id === ticketId)
  if (idx !== -1) {
    tickets[idx].status = status as SalesforceTicket['status']
    if (note) {
      (tickets[idx] as SalesforceTicket & { adminNote?: string }).adminNote = note
    }
    localStorage.setItem(KEYS.TICKETS, JSON.stringify(tickets))
  }
}

// ─── Alumni Signups ─────────────────────────────────────────

export interface AlumniSignup {
  id: string
  name: string
  email: string
  graduationYear: string
  major: string
  company: string
  role: string
  bio: string
  skills: string[]
  availableFor: string[]
  createdAt: string
}

export function saveAlumniSignup(signup: AlumniSignup): void {
  const existing = getAlumniSignups()
  existing.unshift(signup)
  localStorage.setItem(KEYS.ALUMNI_SIGNUPS, JSON.stringify(existing))
}

export function getAlumniSignups(): AlumniSignup[] {
  const raw = localStorage.getItem(KEYS.ALUMNI_SIGNUPS)
  return raw ? JSON.parse(raw) : []
}
