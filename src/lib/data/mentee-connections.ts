import type { MenteeConnection } from '../types'
import type { Student } from '../types'
import { students } from './students'

/** Jordan Rivera — the demo student account, shown as a mentee for Sofia */
const jordanAsStudent: Student = {
  id: 'demo-student',
  name: 'Jordan Rivera',
  avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan',
  major: 'Computer Science',
  year: 'Sophomore',
  interests: ['web development', 'first-gen support', 'AI'],
  careerGoals: ['software engineer', 'startup founder'],
  clubs: ['First-Gen Alliance', 'Hack Club'],
  background: 'First-gen student navigating the tech world. Parents immigrated from Guatemala.',
  challenges: ['imposter syndrome', 'networking', 'financial aid'],
  matchPercentage: 97,
}

export const menteeConnections: MenteeConnection[] = [
  {
    id: 'mc0',
    student: jordanAsStudent,
    status: 'active',
    lastContact: '2026-04-08',
    messages: 5,
    topic: 'First-gen CS student seeking career guidance',
  },
  {
    id: 'mc1',
    student: students[0],
    status: 'active',
    lastContact: '2026-04-02',
    messages: 12,
    topic: 'Career transition into software engineering',
  },
  {
    id: 'mc2',
    student: students[2],
    status: 'pending',
    lastContact: '2026-03-28',
    messages: 3,
    topic: 'Graduate school applications',
  },
]
