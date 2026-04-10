'use client'

import { useEffect, useRef, useState } from 'react'

const DIAGRAM = `graph TD
    Student["Student Browser"]
    Frontend["Next.js Frontend (React)"]
    AdvisingUI["Advising Chat UI"]
    AlumniUI["Alumni Network"]
    API["API Routes<br/>/api/chat/*"]
    Extract["1. Extract user message<br/>2. Load student profile<br/>3. Detect ASU-specific question"]
    RAG["RAG Search Engine<br/>(BM25 scoring, min threshold 1.5)"]
    KB["Knowledge Base (JSON)<br/>212 verified ASU chunks<br/>---<br/>46 CS courses | 70 MAT courses<br/>12 degree reqs | 10 career services<br/>7 academic policies | 6 first-gen resources<br/>5 internship guides"]
    Prompt["Prompt Assembly<br/>---<br/>System Prompt<br/>+ Strict Grounding Rules<br/>+ Student Profile Context<br/>+ RAG Knowledge Context<br/>+ Source Citations<br/>+ Course Path Guardrails"]
    LLM["LLM Provider<br/>(OpenAI / Gemini Flash)<br/>temperature: 0.1"]
    Grounding["Strict Grounding Enforced<br/>---<br/>Only facts from knowledge base<br/>No fabricated prerequisites<br/>Cite sources or flag uncertainty"]
    Response["Student sees answer<br/>with sources + next steps"]

    Student -->|"Chat message"| Frontend
    Frontend --> AdvisingUI
    Frontend --> AlumniUI
    AdvisingUI -->|"POST request"| API
    API --> Extract
    Extract --> RAG
    RAG -->|"Query"| KB
    KB -->|"Top-K relevant chunks"| Prompt
    RAG --> Prompt
    Extract -->|"Student profile"| Prompt
    Prompt -->|"Assembled prompt<br/>temp: 0.1"| LLM
    LLM --> Grounding
    Grounding -->|"Streamed SSE response"| Response

    style Student fill:#8C1D40,stroke:#FFC627,color:#fff
    style Frontend fill:#2d2d2d,stroke:#FFC627,color:#fff
    style AdvisingUI fill:#8C1D40,stroke:#FFC627,color:#fff
    style AlumniUI fill:#8C1D40,stroke:#FFC627,color:#fff
    style API fill:#1a1a2e,stroke:#FFC627,color:#fff
    style Extract fill:#1a1a2e,stroke:#FFC627,color:#fff
    style RAG fill:#FFC627,stroke:#8C1D40,color:#000
    style KB fill:#FFC627,stroke:#8C1D40,color:#000
    style Prompt fill:#1a1a2e,stroke:#FFC627,color:#fff
    style LLM fill:#4a90d9,stroke:#FFC627,color:#fff
    style Grounding fill:#2e7d32,stroke:#FFC627,color:#fff
    style Response fill:#8C1D40,stroke:#FFC627,color:#fff
`

const SEQUENCE_DIAGRAM = `sequenceDiagram
    participant S as Student
    participant UI as Chat UI
    participant API as API Route
    participant P as Profile (Cookie)
    participant RAG as RAG Search
    participant KB as Knowledge Base
    participant LLM as LLM (temp 0.1)

    S->>UI: Types question
    UI->>API: POST /api/chat/advising
    API->>P: Read student profile
    P-->>API: Major, Year, Interests
    API->>API: Detect if ASU-specific
    API->>RAG: Search query
    RAG->>KB: BM25 scoring
    KB-->>RAG: Matched chunks (score >= 1.5)

    alt No relevant context found
        RAG-->>API: Empty results
        API->>LLM: Prompt with "no context" fallback
        LLM-->>API: "I cannot verify this — contact advisor"
    else Relevant context found
        RAG-->>API: Top-K chunks + sources
        API->>API: Assemble grounded prompt
        Note over API: System prompt<br/>+ Grounding rules<br/>+ RAG context<br/>+ Profile<br/>+ Guardrails
        API->>LLM: Strict grounded prompt
        LLM-->>API: Streamed response (SSE)
    end

    API-->>UI: Streamed answer + sources
    UI-->>S: Formatted response with citations
`

export default function MermaidPage() {
  const flowRef = useRef<HTMLDivElement>(null)
  const seqRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'flow' | 'sequence'>('flow')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    script.onload = () => {
      // @ts-expect-error mermaid is loaded via CDN
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#8C1D40',
          primaryTextColor: '#fff',
          primaryBorderColor: '#FFC627',
          lineColor: '#FFC627',
          secondaryColor: '#1a1a2e',
          tertiaryColor: '#2d2d2d',
          fontFamily: 'system-ui, sans-serif',
        },
      })
      setLoaded(true)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!loaded) return

    const renderDiagram = async () => {
      // @ts-expect-error mermaid is loaded via CDN
      const mermaid = window.mermaid

      if (activeTab === 'flow' && flowRef.current) {
        flowRef.current.innerHTML = ''
        const { svg } = await mermaid.render('flow-diagram', DIAGRAM)
        flowRef.current.innerHTML = svg
      }

      if (activeTab === 'sequence' && seqRef.current) {
        seqRef.current.innerHTML = ''
        const { svg } = await mermaid.render('seq-diagram', SEQUENCE_DIAGRAM)
        seqRef.current.innerHTML = svg
      }
    }

    renderDiagram()
  }, [loaded, activeTab])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          color: '#FFC627',
        }}>
          NavigateASU — AI System Architecture
        </h1>
        <p style={{ color: '#999', marginBottom: '2rem' }}>
          How the AI Academic Advisor processes student questions with strict grounding
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('flow')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: activeTab === 'flow' ? '#8C1D40' : '#1a1a2e',
              color: activeTab === 'flow' ? '#FFC627' : '#999',
            }}
          >
            System Flow
          </button>
          <button
            onClick={() => setActiveTab('sequence')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              background: activeTab === 'sequence' ? '#8C1D40' : '#1a1a2e',
              color: activeTab === 'sequence' ? '#FFC627' : '#999',
            }}
          >
            Request Sequence
          </button>
        </div>

        {/* Diagram */}
        <div style={{
          background: '#111',
          borderRadius: '12px',
          border: '1px solid #333',
          padding: '2rem',
          overflow: 'auto',
        }}>
          {!loaded && (
            <p style={{ color: '#666', textAlign: 'center' }}>Loading diagrams...</p>
          )}
          <div
            ref={flowRef}
            style={{ display: activeTab === 'flow' ? 'block' : 'none' }}
          />
          <div
            ref={seqRef}
            style={{ display: activeTab === 'sequence' ? 'block' : 'none' }}
          />
        </div>

        {/* Key Decisions Table */}
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#FFC627', marginBottom: '1rem' }}>
            Key Design Decisions
          </h2>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#FFC627' }}>Decision</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: '#FFC627' }}>Why</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['BM25 over embeddings', 'Deterministic, no vector DB needed, works well for structured course data'],
                ['Min score threshold (1.5)', 'Prevents weak keyword matches from triggering false confidence'],
                ['Temperature 0.1', 'Near-deterministic output -- sticks to facts, does not embellish'],
                ['Strict grounding rules', 'Every claim must trace to a specific knowledge base sentence'],
                ['Source citations', 'Builds trust -- students can verify any answer'],
                ['Student profile context', 'Personalizes advice by major, year, interests without storing data server-side'],
                ['Fallback path', 'If no relevant context found, AI explicitly says so instead of guessing'],
              ].map(([decision, why], i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#fff' }}>{decision}</td>
                  <td style={{ padding: '0.75rem', color: '#ccc' }}>{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
