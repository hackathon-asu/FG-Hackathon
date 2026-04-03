'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

const interestOptions = [
  'Web Development',
  'AI / Machine Learning',
  'Pre-Med',
  'Business',
  'Creative Writing',
  'Data Science',
  'Psychology',
  'Engineering',
  'Social Justice',
  'Research',
  'Entrepreneurship',
  'Environmental Science',
  'Public Policy',
  'Design',
  'Music',
  'Sports',
]

export default function OnboardingPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [firstGen, setFirstGen] = useState<boolean | null>(null)

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Join FirstGen Connect
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us about yourself so we can connect you with the right people
            </p>
          </div>
        </div>

        <Card className="border-0">
          <CardContent className="flex flex-col gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" placeholder="Your full name" />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@university.edu" />
            </div>

            {/* Major */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="major">Major</Label>
              <Input id="major" placeholder="e.g. Computer Science" />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1.5">
              <Label>Year</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select your year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freshman">Freshman</SelectItem>
                  <SelectItem value="sophomore">Sophomore</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interests */}
            <div className="flex flex-col gap-1.5">
              <Label>Interests</Label>
              <p className="text-xs text-muted-foreground">
                Tap to select what you&apos;re into
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                      selectedInterests.includes(interest)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* First-Gen Toggle */}
            <div className="flex flex-col gap-1.5">
              <Label>Are you a first-generation college student?</Label>
              <p className="text-xs text-muted-foreground">
                First-gen means neither of your parents completed a 4-year degree
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setFirstGen(true)}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-sm font-medium transition-all',
                    firstGen === true
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  )}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFirstGen(false)}
                  className={cn(
                    'flex-1 rounded-lg border py-2 text-sm font-medium transition-all',
                    firstGen === false
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  )}
                >
                  No
                </button>
              </div>
            </div>

            {/* Career Goals */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="careerGoals">Career Goals</Label>
              <Textarea
                id="careerGoals"
                placeholder="What do you dream of doing after graduation? No wrong answers here."
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Create My Profile
              <ArrowRight className="size-4" />
            </Button>

            {/* Supportive copy */}
            <p className="text-center text-xs text-muted-foreground">
              This takes about 2 minutes. No judgment, just support.
            </p>

            {/* Sign In link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
