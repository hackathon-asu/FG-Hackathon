'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Heart,
  Clock,
} from 'lucide-react'

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Law',
  'Nonprofit / Government',
  'Media / Entertainment',
  'Consulting',
  'Retail / Consumer',
  'Energy / Sustainability',
  'Other',
]

const availableForOptions = [
  { value: 'mentorship', label: 'One-on-one Mentorship' },
  { value: 'referrals', label: 'Job / Internship Referrals' },
  { value: 'networking', label: 'Networking Introductions' },
  { value: 'internships', label: 'Internship Hosting' },
  { value: 'career-guidance', label: 'Career Path Guidance' },
  { value: 'resume-review', label: 'Resume / Portfolio Review' },
  { value: 'mock-interviews', label: 'Mock Interviews' },
  { value: 'grad-school', label: 'Graduate School Advice' },
]

const skillSuggestions = [
  'Leadership', 'Python', 'React', 'Data Analysis', 'Public Speaking',
  'Financial Modeling', 'Project Management', 'Research', 'Writing',
  'Networking', 'Mentoring', 'Design Thinking', 'SQL', 'Marketing',
  'Negotiation', 'Clinical Research', 'Entrepreneurship', 'Fundraising',
]

export default function AlumniSignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [firstGen, setFirstGen] = useState<boolean | null>(null)

  function toggleAvailable(value: string) {
    setSelectedAvailable((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="size-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to FirstGen Connect!</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for signing up as an alumni mentor. Your profile is being reviewed
            and you&apos;ll be matched with students within 48 hours. Your experience
            and willingness to help will make a real difference.
          </p>
          <Link href="/alumni/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Go to Alumni Dashboard
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-6">
          <GraduationCap className="size-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold">Join as an Alumni Mentor</h1>
            <p className="text-sm text-muted-foreground">
              Help first-gen students navigate their journey
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Value Prop */}
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
            <Heart className="size-5 shrink-0 text-primary" />
            <span className="text-xs text-muted-foreground">Change a student&apos;s trajectory</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
            <Clock className="size-5 shrink-0 text-primary" />
            <span className="text-xs text-muted-foreground">Only 30 min/month commitment</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
            <Briefcase className="size-5 shrink-0 text-primary" />
            <span className="text-xs text-muted-foreground">Earn referral bonuses too</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              This information helps us match you with the right students.
              Takes about 5 minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="Your full name" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="your.email@company.com" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>LinkedIn Profile</Label>
                <Input placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Profile Photo URL</Label>
                <Input placeholder="https://..." />
                <p className="text-xs text-muted-foreground">Link to a professional headshot</p>
              </div>
            </div>

            <Separator />

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Education</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>University / College *</Label>
                  <Input placeholder="e.g. Arizona State University" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Graduation Year *</Label>
                  <Input type="number" placeholder="e.g. 2020" min={1970} max={2026} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Major *</Label>
                  <Input placeholder="e.g. Computer Science" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Degree</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select degree" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bachelors">Bachelor&apos;s</SelectItem>
                      <SelectItem value="masters">Master&apos;s</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="mba">MBA</SelectItem>
                      <SelectItem value="jd">JD</SelectItem>
                      <SelectItem value="md">MD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Were you a first-generation college student? *</Label>
                <div className="flex gap-2">
                  <Button
                    variant={firstGen === true ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFirstGen(true)}
                    className={firstGen === true ? 'bg-primary text-primary-foreground' : ''}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={firstGen === false ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFirstGen(false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Career */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Career Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Current Job Title *</Label>
                  <Input placeholder="e.g. Senior Software Engineer" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Company *</Label>
                  <Input placeholder="e.g. Google" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>Industry *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Years of Experience</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0–2 years</SelectItem>
                      <SelectItem value="3-5">3–5 years</SelectItem>
                      <SelectItem value="6-10">6–10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Skills &amp; Expertise</h3>
              <p className="text-xs text-muted-foreground">
                Select the skills you can help students develop (select all that apply)
              </p>
              <div className="flex flex-wrap gap-2">
                {skillSuggestions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {selectedSkills.length > 0 && (
                <p className="text-xs text-muted-foreground">{selectedSkills.length} selected</p>
              )}
            </div>

            <Separator />

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">How Can You Help?</h3>
              <p className="text-xs text-muted-foreground">
                Select the ways you&apos;d like to support students (select all that apply)
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableForOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggleAvailable(option.value)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedAvailable.includes(option.value)
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    <div className={`size-4 rounded border transition-colors ${
                      selectedAvailable.includes(option.value)
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    }`}>
                      {selectedAvailable.includes(option.value) && (
                        <CheckCircle2 className="size-4 text-primary-foreground" />
                      )}
                    </div>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">About You</h3>
              <div className="flex flex-col gap-2">
                <Label>Your Story *</Label>
                <Textarea
                  rows={4}
                  placeholder="Share your journey as a first-gen student (or why you want to help). What would you want a student to know about you?"
                />
                <p className="text-xs text-muted-foreground">
                  This helps students connect with mentors they relate to.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Anything else students should know?</Label>
                <Textarea
                  rows={2}
                  placeholder="e.g. I'm happy to review resumes, I work in a niche field, I can help with visa sponsorship questions..."
                />
              </div>
            </div>

            <Separator />

            {/* Commitment */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">Time Commitment</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="How much time can you commit monthly?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 minutes / month</SelectItem>
                  <SelectItem value="1hr">1 hour / month</SelectItem>
                  <SelectItem value="2hr">2 hours / month</SelectItem>
                  <SelectItem value="4hr">4+ hours / month</SelectItem>
                  <SelectItem value="flexible">Flexible / As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => {
                // Persist alumni signup to localStorage
                if (typeof window !== 'undefined') {
                  const existing = JSON.parse(localStorage.getItem('fg-alumni-signups') || '[]')
                  existing.unshift({ id: `alumni-${Date.now()}`, createdAt: new Date().toISOString() })
                  localStorage.setItem('fg-alumni-signups', JSON.stringify(existing))
                }
                setSubmitted(true)
              }}
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <GraduationCap className="mr-2 size-4" />
              Create Alumni Profile
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/alumni/dashboard" className="text-primary hover:underline">
                Sign in to your dashboard
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
