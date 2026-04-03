import {
  GraduationCap,
  BookOpen,
  DollarSign,
  PenLine,
  Briefcase,
  Heart,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const resources = [
  {
    icon: GraduationCap,
    title: 'Academic Advising Office',
    description: 'Schedule a meeting with your advisor',
    href: '#',
  },
  {
    icon: BookOpen,
    title: 'Tutoring Center',
    description: 'Free tutoring for all subjects',
    href: '#',
  },
  {
    icon: DollarSign,
    title: 'Financial Aid',
    description: 'Scholarships, grants, and FAFSA help',
    href: '#',
  },
  {
    icon: PenLine,
    title: 'Writing Center',
    description: 'Get help with papers and essays',
    href: '#',
  },
  {
    icon: Briefcase,
    title: 'Career Services',
    description: 'Resume reviews, mock interviews, job listings',
    href: '#',
  },
  {
    icon: Heart,
    title: 'Counseling Services',
    description: 'Free mental health support',
    href: '#',
  },
]

export function ResourcePanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Campus Resources</h3>
      <div className="grid gap-2">
        {resources.map((resource) => (
          <a key={resource.title} href={resource.href}>
            <Card
              size="sm"
              className="transition-all duration-200 hover:ring-primary/30 hover:shadow-sm"
            >
              <CardContent className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <resource.icon className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium leading-tight">
                      {resource.title}
                    </span>
                    <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  )
}
