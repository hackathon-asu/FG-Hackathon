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

export interface SalesforceTicket {
  id: string
  caseNumber: string
  subject: string
  description: string
  category: 'academic-advising' | 'financial-aid' | 'career-services' | 'counseling' | 'general'
  priority: 'low' | 'medium' | 'high'
  status: 'new' | 'open' | 'in-progress' | 'resolved'
  studentName: string
  createdAt: string
  assignedTo?: string
}

export interface MenteeConnection {
  id: string
  student: Student
  status: 'pending' | 'active' | 'completed'
  lastContact: string
  messages: number
  topic: string
}
