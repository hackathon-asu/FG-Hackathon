'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { AuthUser, UserRole } from '@/lib/auth'
import { getAuthUser, login as authLogin, logout as authLogout, ROLE_DASHBOARDS } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}

/** Pages that don't require authentication */
const PUBLIC_PATHS = ['/login', '/onboarding', '/alumni/signup', '/demo']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setUser(getAuthUser())
    setLoading(false)
  }, [])

  // Redirect unauthenticated users away from protected pages
  useEffect(() => {
    if (loading) return
    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))
    if (!user && !isPublic) {
      router.replace('/login')
    }
  }, [user, loading, pathname, router])

  const handleLogin = useCallback((u: AuthUser) => {
    authLogin(u)
    setUser(u)
  }, [])

  const handleLogout = useCallback(() => {
    authLogout()
    setUser(null)
    router.replace('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}
