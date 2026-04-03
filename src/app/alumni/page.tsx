'use client'

import { useState, useMemo } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { MentorCard } from '@/components/alumni/mentor-card'
import { alumni } from '@/lib/data/alumni'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Award,
  Search,
  Users,
  Building2,
  TrendingUp,
  Heart,
  GraduationCap,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AlumniPage() {
  const [industryFilter, setIndustryFilter] = useState('all')
  const [skillFilter, setSkillFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [search, setSearch] = useState('')

  const industries = useMemo(
    () => Array.from(new Set(alumni.map((a) => a.industry))).sort(),
    []
  )

  const skills = useMemo(
    () => Array.from(new Set(alumni.flatMap((a) => a.skills))).sort(),
    []
  )

  const availabilities = [
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'referrals', label: 'Referrals' },
    { value: 'networking', label: 'Networking' },
    { value: 'internships', label: 'Internships' },
    { value: 'career-guidance', label: 'Career Guidance' },
  ]

  const filtered = useMemo(() => {
    return alumni.filter((a) => {
      if (industryFilter !== 'all' && a.industry !== industryFilter) return false
      if (skillFilter !== 'all' && !a.skills.includes(skillFilter)) return false
      if (
        availabilityFilter !== 'all' &&
        !a.availableFor.includes(availabilityFilter as typeof a.availableFor[number])
      )
        return false
      if (
        search &&
        !a.name.toLowerCase().includes(search.toLowerCase()) &&
        !a.company.toLowerCase().includes(search.toLowerCase()) &&
        !a.major.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [industryFilter, skillFilter, availabilityFilter, search])

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Award className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Alumni Mentors
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn from those who walked your path
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card/50 px-5 py-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-primary" />
            <span className="text-sm font-medium">500+ Alumni</span>
          </div>
          <span className="hidden text-border sm:inline">|</span>
          <div className="flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            <span className="text-sm font-medium">15+ Industries</span>
          </div>
          <span className="hidden text-border sm:inline">|</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <span className="text-sm font-medium">92% Response Rate</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or major..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {skills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Available For" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              {availabilities.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{filtered.length} mentors</Badge>
          {(industryFilter !== 'all' || skillFilter !== 'all' || availabilityFilter !== 'all' || search) && (
            <button
              onClick={() => {
                setIndustryFilter('all')
                setSkillFilter('all')
                setAvailabilityFilter('all')
                setSearch('')
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Mentor Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <MentorCard key={a.id} alumni={a} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <Search className="size-10 text-muted-foreground/50" />
            <p className="text-lg font-medium text-foreground">No mentors found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters to find the right match.
            </p>
          </div>
        )}

        {/* Become a Mentor CTA */}
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
              <Heart className="size-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Are you an alumni? Join as a mentor.
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your story can change someone&apos;s life. It only takes 30 minutes a month.
              </p>
            </div>
            <a href="/alumni/signup">
              <Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                <GraduationCap className="size-4" />
                Sign Up as Alumni
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
