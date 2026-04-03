'use client'

import { useState } from 'react'
import type { Student } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  X,
  Heart,
  GraduationCap,
  Briefcase,
  Users,
  BookOpen,
} from 'lucide-react'

interface ProfileCardProps {
  student: Student
  onPass?: (id: string) => void
  onConnect?: (id: string) => void
}

function MatchIndicator({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 28
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg width="68" height="68" className="-rotate-90">
        <circle
          cx="34"
          cy="34"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted"
        />
        <circle
          cx="34"
          cy="34"
          r="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-700"
        />
      </svg>
      <span className="absolute text-sm font-bold text-primary">
        {percentage}%
      </span>
    </div>
  )
}

export function ProfileCard({ student, onPass, onConnect }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <Card
      className={cn(
        'w-full max-w-md transition-all duration-300',
        isHovered && 'shadow-lg shadow-primary/10 ring-primary/30'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="space-y-4">
        {/* Header: Avatar + Name + Match */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-16">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="size-3" />
                  {student.major}
                </Badge>
                <Badge variant="outline">{student.year}</Badge>
              </div>
            </div>
          </div>
          <MatchIndicator percentage={student.matchPercentage ?? 0} />
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Interests
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.interests.map((interest) => (
              <Badge
                key={interest}
                className="bg-primary/15 text-primary hover:bg-primary/25"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Career Goals */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Briefcase className="size-3" />
            Career Goals
          </div>
          <p className="text-sm">
            {student.careerGoals.join(' / ')}
          </p>
        </div>

        {/* Clubs */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Users className="size-3" />
            Clubs
          </div>
          <div className="flex flex-wrap gap-1.5">
            {student.clubs.map((club) => (
              <Badge key={club} variant="outline" className="text-xs">
                {club}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Background */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <BookOpen className="size-3" />
            Their Story
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {student.background}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 gap-2"
            onClick={() => onPass?.(student.id)}
          >
            <X className="size-4" />
            Pass
          </Button>
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={() => onConnect?.(student.id)}
          >
            <Heart className="size-4" />
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
