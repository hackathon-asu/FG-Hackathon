import Link from "next/link";
import {
  GraduationCap,
  Users,
  Calendar,
  Award,
  BookOpen,
  Compass,
  ArrowRight,
  Star,
  Github,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const features = [
  {
    icon: Users,
    title: "Find Your People",
    description:
      "Get matched with students who share your background, interests, and goals. Build friendships that last beyond graduation.",
  },
  {
    icon: Calendar,
    title: "Discover Events",
    description:
      "Never miss a campus event, workshop, or social. Curated for first-gen students with reminders and RSVP tracking.",
  },
  {
    icon: Award,
    title: "Alumni Mentors",
    description:
      "Connect with first-gen graduates who have been in your shoes. Get real advice from people who understand your journey.",
  },
  {
    icon: BookOpen,
    title: "AI Academic Advisor",
    description:
      "Get instant guidance on courses, majors, financial aid, and academic planning -- powered by AI, built for first-gen needs.",
  },
  {
    icon: Compass,
    title: "Life Guide AI",
    description:
      "Navigate big decisions with an AI that understands first-gen challenges -- from housing to internships to family conversations.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create Profile",
    description: "Tell us about yourself, your school, and what you need most.",
  },
  {
    number: "2",
    title: "Get Matched",
    description:
      "We connect you with peers, mentors, and resources tailored to you.",
  },
  {
    number: "3",
    title: "Thrive Together",
    description:
      "Build your community, hit your goals, and pay it forward as you grow.",
  },
];

const testimonials = [
  {
    name: "Maria Gonzalez",
    year: "Class of 2026",
    initials: "MG",
    quote:
      "I almost dropped out my freshman year because I didn't know how to navigate financial aid. My mentor on FirstGen Connect walked me through every form and deadline. She'd been through the same thing. That one connection changed everything for me.",
  },
  {
    name: "James Washington",
    year: "Class of 2025",
    initials: "JW",
    quote:
      "When everyone else went home for Thanksgiving, I stayed on campus because I couldn't afford the flight. Through FirstGen Connect, I found a group of students in the same boat. We cooked together, studied together, and became family. I finally felt like I belonged.",
  },
  {
    name: "Priya Patel",
    year: "Class of 2027",
    initials: "PP",
    quote:
      "My parents never went to college, so I had no idea what 'office hours' even meant. The AI Advisor helped me understand things everyone else seemed to already know. Now I'm a peer mentor helping other first-gen students. It comes full circle.",
  },
];

const stats = [
  { value: "10,000+", label: "Students" },
  { value: "500+", label: "Alumni Mentors" },
  { value: "200+", label: "Campus Events" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" />
            <span className="text-base font-semibold tracking-tight">
              FirstGen Connect
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/onboarding">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-14">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Star className="size-3.5 fill-primary" />
            Built for first-generation students
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your College Journey
            <br />
            <span className="text-primary">Starts Here</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The community, mentors, and tools you need to navigate college as a
            first-generation student. You are not alone in this.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              asChild
            >
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Tools and community designed specifically for students who are the
              first in their family to go to college.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group transition-all duration-300 hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border/50 bg-muted/20 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Getting started takes less than five minutes.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stories From Our Community
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Real students. Real experiences. Real impact.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col">
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                        {t.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.year}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/50 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            You are not behind. You are just getting started.
          </p>
          <Button size="lg" className="mt-8 h-12 px-10 text-base" asChild>
            <Link href="/onboarding">
              Join FirstGen Connect
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              <span className="text-sm font-semibold">FirstGen Connect</span>
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">
                Features
              </a>
              <Link href="/onboarding" className="hover:text-foreground transition-colors">
                Get Started
              </Link>
              <Link href="/social" className="hover:text-foreground transition-colors">
                Community
              </Link>
            </nav>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="#"
                className="hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FirstGen Connect. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
