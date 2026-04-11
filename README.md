# NavigateASU

**AI-powered platform helping first-generation college students navigate ASU.**

First-gen students don't fail because they lack ability — they fail because they lack access to information that other students get at the dinner table. NavigateASU closes that gap.

## Three Pillars

### 1. AI Academic Advisor
An always-available advising assistant grounded in verified ASU data.

- **RAG pipeline** over 212 verified ASU knowledge chunks (courses, degree requirements, policies, career services)
- **Strict grounding** — every answer cites its source, AI flags uncertainty instead of guessing
- **Low temperature (0.1)** — deterministic, fact-based responses with no hallucination
- **BM25 search** with minimum relevance threshold to prevent weak-match false confidence
- **Personalized** to student's major, year, and interests via profile context
- **No PII stored** — student profile lives in browser cookie only

### 2. Alumni Mentorship Network
Matched with first-gen alumni by major, background, and challenge type.

- Real stories of overcoming imposter syndrome and navigating ASU
- Visible role models who walked the same path
- Alumni dashboard with impact tracking and messaging

### 3. Peer Community Hub
Connect with students sharing similar challenges and experiences.

- Community knowledge exchange, study groups, and shared resources
- Events discovery with RSVP tracking
- Normalizes difficulty — builds belonging from day one

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, shadcn/ui, Radix, Tailwind CSS 4 |
| AI | Vercel AI SDK, OpenAI, Google Gemini |
| Search | BM25 (custom implementation) |
| Knowledge | 212 curated ASU data chunks (JSON) |
| Language | TypeScript 5 |

## Project Structure

```
src/
├── app/
│   ├── advising/        # AI academic advisor chat
│   ├── alumni/           # Alumni mentorship (dashboard, messages, signup)
│   ├── social/           # Peer community hub
│   ├── events/           # Campus events discovery
│   ├── decisions/        # Career guidance chat
│   ├── onboarding/       # Student profile setup
│   ├── feedback/         # User feedback collection
│   ├── admin/            # Admin dashboard (feedback, tickets)
│   ├── docs/
│   │   ├── mermaid/      # Architecture diagrams
│   │   └── data/         # Data privacy & CreateAI partnership
│   └── api/chat/         # AI chat API routes
├── components/           # UI components (advising, alumni, auth, etc.)
├── lib/
│   ├── rag/              # RAG search engine + knowledge base
│   └── data/             # Alumni, events, courses, students data
└── scripts/
    └── claude-server.mjs # Local Claude Code API server (Ollama-style)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

See the full interactive architecture diagrams at [`/docs/mermaid`](http://localhost:3000/docs/mermaid).

**How a question flows:**

```
Student asks question
  → API route extracts message + loads profile
  → Detects if ASU-specific
  → BM25 searches 212 knowledge chunks (threshold ≥ 1.5)
  → Assembles grounded prompt with strict rules
  → LLM responds at temperature 0.1
  → Student gets cited, verified answer
```

## Data Privacy

All details at [`/docs/data`](http://localhost:3000/docs/data).

- No student PII stored server-side
- Future: all AI calls routed through ASU CreateAI data-protected servers
- Future: fine-tuned advising model hosted on ASU infrastructure via CreateAI + Knowledge Enterprise partnership

## Team

Built for the ASU First-Generation Student Hackathon.
