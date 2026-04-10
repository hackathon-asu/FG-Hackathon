/**
 * Lightweight demo auth module.
 * Stores session in localStorage — swap for real auth (NextAuth, Supabase) in production.
 */

export type UserRole = 'student' | 'alumni' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: string
}

const AUTH_KEY = 'fg-auth'

export function login(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  // Also set cookie for server-side API routes
  const profile = { name: user.name, email: user.email, role: user.role }
  document.cookie = `fg-auth=${encodeURIComponent(JSON.stringify(profile))};path=/;max-age=31536000`
  // Notify same-tab listeners (storage event only fires cross-tab)
  window.dispatchEvent(new Event('fg-auth-change'))
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_KEY)
  return raw ? JSON.parse(raw) : null
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
  document.cookie = 'fg-auth=;path=/;max-age=0'
  document.cookie = 'fg-profile=;path=/;max-age=0'
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null
}

/** Pre-built demo accounts for instant login */
export const DEMO_ACCOUNTS: AuthUser[] = [
  {
    id: 'demo-student',
    name: 'Jordan Rivera',
    email: 'jordan.rivera@asu.edu',
    role: 'student',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'demo-alumni',
    name: 'Sofia Herrera',
    email: 'sofia.herrera@google.com',
    role: 'alumni',
    createdAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'demo-admin',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@asu.edu',
    role: 'admin',
    createdAt: '2024-09-01T00:00:00.000Z',
  },
]

/** Role → default dashboard path */
export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  student: '/',
  alumni: '/alumni/dashboard',
  admin: '/admin',
}

/**
 * Map between data IDs (from alumni.ts / students.ts) and auth IDs (from DEMO_ACCOUNTS).
 * Ensures cross-account messaging works — both sides see the same conversation.
 */
export const DATA_TO_AUTH_MAP: Record<string, string> = {
  a1: 'demo-alumni',   // Sofia Herrera (alumni data → auth)
  s1: 'demo-student',  // Jordan Rivera approximation — but Jordan's student data may not be s1
  // Add more mappings as needed
}

/** Resolve a data ID to the auth ID if a mapping exists, otherwise return as-is */
export function resolveRecipientId(id: string): string {
  return DATA_TO_AUTH_MAP[id] || id
}
