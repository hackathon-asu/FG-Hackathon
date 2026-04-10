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
 * Map between alumni data IDs and auth IDs so cross-account messaging works.
 * Key = alumni data ID (from alumni.ts), Value = auth user ID (from DEMO_ACCOUNTS).
 */
export const ALUMNI_ID_MAP: Record<string, string> = {
  a1: 'demo-alumni', // Sofia Herrera
}

/** Reverse map: auth ID → alumni data ID */
export const AUTH_TO_ALUMNI_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(ALUMNI_ID_MAP).map(([k, v]) => [v, k])
)

/** Resolve an alumni data ID to the auth ID if a mapping exists, otherwise return as-is */
export function resolveRecipientId(id: string): string {
  return ALUMNI_ID_MAP[id] || id
}
