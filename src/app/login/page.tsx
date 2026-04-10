'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Users,
  Sparkles,
} from 'lucide-react'

const roles: { role: UserRole; label: string; icon: typeof BookOpen; description: string; color: string }[] = [
  {
    role: 'student',
    label: 'Student',
    icon: BookOpen,
    description: 'First-gen student looking for support, mentors, and community',
    color: 'text-blue-400',
  },
  {
    role: 'alumni',
    label: 'Alumni',
    icon: Award,
    description: 'Graduate ready to mentor and give back to the next generation',
    color: 'text-amber-400',
  },
  {
    role: 'admin',
    label: 'Admin',
    icon: Shield,
    description: 'University staff managing the platform and student support',
    color: 'text-emerald-400',
  },
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState<'select' | 'signin'>('select')
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
    // New users go to onboarding, existing go to dashboard
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
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="size-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              FirstGen Connect
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'select'
                ? 'Choose how you want to join'
                : `Sign in as ${roles.find((r) => r.role === selectedRole)?.label}`}
            </p>
          </div>
        </div>

        {mode === 'select' ? (
          <>
            {/* Role Cards */}
            <div className="flex flex-col gap-3">
              {roles.map((r) => (
                <Card
                  key={r.role}
                  className={cn(
                    'cursor-pointer border transition-all hover:ring-2 hover:ring-primary/20',
                    selectedRole === r.role && 'ring-2 ring-primary border-primary/30'
                  )}
                  onClick={() => setSelectedRole(r.role)}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted')}>
                      <r.icon className={cn('size-5', r.color)} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground">{r.label}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.description}</p>
                    </div>
                    <div className={cn(
                      'size-5 rounded-full border-2 transition-colors',
                      selectedRole === r.role
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    )} />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col gap-3">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setMode('signin')}
              >
                Continue as {roles.find((r) => r.role === selectedRole)?.label}
                <ArrowRight className="size-4" />
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground">or try a demo account</span>
                </div>
              </div>

              {/* Quick Demo Logins */}
              <div className="grid grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    onClick={() => handleDemoLogin(account.role)}
                    className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-3 text-center transition-colors hover:bg-muted/60 hover:border-primary/30"
                  >
                    <Zap className="size-4 text-primary" />
                    <span className="text-[11px] font-medium text-foreground">
                      {account.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {account.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Demo badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              <span>Hackathon demo — instant logins, no passwords needed</span>
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
              onClick={() => setMode('select')}
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
