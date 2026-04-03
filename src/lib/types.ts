export interface Student {
  id: string
  name: string
  avatar: string
  major: string
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior'
  interests: string[]
  careerGoals: string[]
  clubs: string[]
  background: string
  challenges: string[]
  matchPercentage?: number
}

export interface Alumni {
  id: string
  name: string
  avatar: string
  graduationYear: number
  major: string
  currentRole: string
  company: string
  industry: string
  skills: string[]
  mentorBadges: string[]
  bio: string
  availableFor: ('mentorship' | 'referrals' | 'networking' | 'internships' | 'career-guidance')[]
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: 'career' | 'social' | 'academic' | 'cultural' | 'first-gen'
  organizer: string
  imageUrl?: string
  rsvpCount: number
  saved?: boolean
}

export interface SuggestedQuestion {
  id: string
  text: string
  category: string
}
