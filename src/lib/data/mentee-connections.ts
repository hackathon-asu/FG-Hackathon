import type { MenteeConnection } from '../types'
import { students } from './students'

export const menteeConnections: MenteeConnection[] = [
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
    status: 'active',
    lastContact: '2026-03-28',
    messages: 8,
    topic: 'Graduate school applications',
  },
  {
    id: 'mc3',
    student: students[4],
    status: 'pending',
    lastContact: '2026-04-01',
    messages: 2,
    topic: 'Internship search in creative writing',
  },
  {
    id: 'mc4',
    student: students[6],
    status: 'active',
    lastContact: '2026-03-30',
    messages: 15,
    topic: 'Pre-law career path guidance',
  },
  {
    id: 'mc5',
    student: students[8],
    status: 'completed',
    lastContact: '2026-03-15',
    messages: 22,
    topic: 'Data science portfolio building',
  },
]
