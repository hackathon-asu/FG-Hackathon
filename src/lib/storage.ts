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
  MESSAGES: 'fg-messages',
  CHAT_SESSIONS: 'fg-chat-sessions',
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

// ─── Messages ──────────────────────────────────────────────

export interface ChatMessage {
  id: string
  /** Conversation ID — sorted pair of user IDs, e.g. "demo-student:a1" */
  conversationId: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  text: string
  createdAt: string
}

/** Build a stable conversation ID from two user IDs */
export function getConversationId(a: string, b: string): string {
  return [a, b].sort().join(':')
}

export function sendMessage(msg: ChatMessage): void {
  const all = getAllMessages()
  all.push(msg)
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(all))
}

export function getAllMessages(): ChatMessage[] {
  const raw = localStorage.getItem(KEYS.MESSAGES)
  return raw ? JSON.parse(raw) : []
}

export function getConversationMessages(conversationId: string): ChatMessage[] {
  return getAllMessages().filter((m) => m.conversationId === conversationId)
}

/** Get all conversations a user is part of (for inbox view) */
export function getUserConversations(userId: string): { recipientId: string; recipientName: string; lastMessage: ChatMessage }[] {
  const all = getAllMessages()
  const convos = new Map<string, ChatMessage>()
  for (const msg of all) {
    if (msg.senderId === userId || msg.recipientId === userId) {
      const existing = convos.get(msg.conversationId)
      if (!existing || msg.createdAt > existing.createdAt) {
        convos.set(msg.conversationId, msg)
      }
    }
  }
  return Array.from(convos.values()).map((msg) => ({
    recipientId: msg.senderId === userId ? msg.recipientId : msg.senderId,
    recipientName: msg.senderId === userId ? msg.recipientName : msg.senderName,
    lastMessage: msg,
  })).sort((a, b) => b.lastMessage.createdAt.localeCompare(a.lastMessage.createdAt))
}

// ─── AI Chat Sessions ──────────────────────────────────────

export interface ChatSession {
  id: string
  /** e.g. "advising" or "decisions" */
  chatType: string
  userId: string
  title: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  createdAt: string
  updatedAt: string
}

function getChatSessionsKey(userId: string, chatType: string): string {
  return `${KEYS.CHAT_SESSIONS}-${userId}-${chatType}`
}

export function saveChatSession(session: ChatSession): void {
  const all = getChatSessions(session.userId, session.chatType)
  const idx = all.findIndex((s) => s.id === session.id)
  if (idx !== -1) {
    all[idx] = session
  } else {
    all.unshift(session)
  }
  // Keep last 20 sessions
  localStorage.setItem(getChatSessionsKey(session.userId, session.chatType), JSON.stringify(all.slice(0, 20)))
}

export function getChatSessions(userId: string, chatType: string): ChatSession[] {
  const raw = localStorage.getItem(getChatSessionsKey(userId, chatType))
  return raw ? JSON.parse(raw) : []
}

export function deleteChatSession(userId: string, chatType: string, sessionId: string): void {
  const all = getChatSessions(userId, chatType).filter((s) => s.id !== sessionId)
  localStorage.setItem(getChatSessionsKey(userId, chatType), JSON.stringify(all))
}
