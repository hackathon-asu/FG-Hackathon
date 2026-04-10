'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/components/auth/auth-provider'
import { DEMO_ACCOUNTS, ROLE_DASHBOARDS } from '@/lib/auth'
import type { AuthUser, UserRole } from '@/lib/auth'
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Award,
  Shield,
  Zap,
  Sparkles,
} from 'lucide-react'

const roleCards: {
  role: UserRole
  label: string
  icon: typeof BookOpen
  description: string
  demoName: string
  demoDetail: string
  color: string
  bgColor: string
}[] = [
  {
    role: 'student',
    label: 'Student',
    icon: BookOpen,
    description: 'First-gen student looking for support, mentors, and community',
    demoName: 'Jordan Rivera',
    demoDetail: 'CS Junior @ ASU',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    role: 'alumni',
    label: 'Alumni',
    icon: Award,
    description: 'Graduate ready to mentor and give back to the next generation',
    demoName: 'Sofia Herrera',
    demoDetail: 'Sr. SWE @ Google',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    description: 'University staff managing the platform and student support',
    demoName: 'Dr. Sarah Chen',
    demoDetail: 'ASU Advising Director',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
  },
]

export default function LoginPage() {
  const [demoMode, setDemoMode] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  // If already logged in, redirect
  if (user) {
    router.replace(ROLE_DASHBOARDS[user.role])
    return null
  }

  function handleDemoLogin(role: UserRole) {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!
    login(account)
    router.push(ROLE_DASHBOARDS[role])
  }

  function handleCardClick(role: UserRole) {
    if (demoMode) {
      handleDemoLogin(role)
    } else {
      setSelectedRole(role)
    }
  }

  function handleSignIn() {
    if (!email.trim()) return
    const user: AuthUser = {
      id: `user-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      role: selectedRole,
      createdAt: new Date().toISOString(),
    }
    login(user)
    if (selectedRole === 'student') {
      router.push('/onboarding')
    } else if (selectedRole === 'alumni') {
      router.push('/alumni/signup')
    } else {
      router.push(ROLE_DASHBOARDS[selectedRole])
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              FirstGen Connect
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {showForm
                ? `Sign in as ${roleCards.find((r) => r.role === selectedRole)?.label}`
                : demoMode
                  ? 'Tap a role to jump right in'
                  : 'Choose how you want to join'}
            </p>
          </div>
        </div>

        {/* Demo Mode Toggle */}
        <div className="mb-5 flex items-center justify-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
          <Zap className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Demo Mode</span>
          <Switch
            checked={demoMode}
            onCheckedChange={(v) => {
              setDemoMode(v)
              setShowForm(false)
            }}
          />
          <span className="text-xs text-muted-foreground">
            {demoMode ? 'ON — instant login' : 'OFF — enter your info'}
          </span>
        </div>

        {!showForm ? (
          <>
            {/* Role Cards */}
            <div className="flex flex-col gap-3">
              {roleCards.map((r) => (
                <Card
                  key={r.role}
                  className={cn(
                    'cursor-pointer border transition-all hover:ring-2 hover:ring-primary/20',
                    !demoMode && selectedRole === r.role && 'ring-2 ring-primary border-primary/30'
                  )}
                  onClick={() => handleCardClick(r.role)}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', r.bgColor)}>
                      <r.icon className={cn('size-5', r.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{r.label}</h3>
                        {demoMode && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            {r.demoName}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {demoMode ? r.demoDetail : r.description}
                      </p>
                    </div>
                    {demoMode ? (
                      <ArrowRight className="size-4 text-primary" />
                    ) : (
                      <div className={cn(
                        'size-5 rounded-full border-2 transition-colors',
                        selectedRole === r.role
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/30'
                      )} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Non-demo continue button */}
            {!demoMode && (
              <div className="mt-5">
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setShowForm(true)}
                >
                  Continue as {roleCards.find((r) => r.role === selectedRole)?.label}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              <span>
                {demoMode
                  ? 'Tap any role to log in instantly — no signup required'
                  : 'Create an account or toggle Demo Mode for instant access'}
              </span>
            </div>
          </>
        ) : (
          <>
            {/* Sign In Form */}
            <Card>
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={
                      selectedRole === 'student'
                        ? 'you@asu.edu'
                        : selectedRole === 'alumni'
                          ? 'you@company.com'
                          : 'you@asu.edu'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                  />
                </div>
                <Button
                  className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSignIn}
                  disabled={!email.trim()}
                >
                  {selectedRole === 'admin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="size-4" />
                </Button>
              </CardContent>
            </Card>

            <button
              onClick={() => setShowForm(false)}
              className="mt-4 block w-full text-center text-xs text-muted-foreground hover:text-foreground"
            >
              &larr; Back to role selection
            </button>
          </>
        )}

        {/* Landing page link */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Learn more about{' '}
          <Link href="/demo" className="font-medium text-primary hover:underline">
            FirstGen Connect
          </Link>
        </p>
      </div>
    </div>
  )
}
