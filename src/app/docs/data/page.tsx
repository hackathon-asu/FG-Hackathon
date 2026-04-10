'use client'

export default function DataPrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#FFC627', marginBottom: '0.5rem' }}>
          Data Privacy &amp; CreateAI Partnership
        </h1>
        <p style={{ color: '#999', marginBottom: '2.5rem' }}>
          How NavigateASU protects student data today and where we&apos;re heading
        </p>

        {/* Three cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
          {[
            { title: 'Now', desc: 'RAG pipeline with verified ASU data. No student PII stored. Source citations on every answer.' },
            { title: 'Next', desc: 'Route all AI calls through ASU CreateAI servers for institutional data governance.' },
            { title: 'Future', desc: 'Fine-tune an advising-specific model (Gemma/Qwen) hosted on ASU infrastructure.' },
          ].map(({ title, desc }, i) => (
            <div key={i} style={{
              background: '#1a1a2e',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #333',
            }}>
              <div style={{
                background: '#8C1D40',
                color: '#FFC627',
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}>
                {title}
              </div>
              <p style={{ color: '#ccc', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* What is CreateAI */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Why CreateAI?
          </h2>
          <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: '1rem' }}>
            <strong style={{ color: '#FFC627' }}>ASU CreateAI</strong> manages AI infrastructure for the university.
            By routing our AI calls through CreateAI, all student interactions stay on{' '}
            <strong>ASU&apos;s data-protected servers</strong> &mdash; ensuring FERPA compliance and
            institutional data governance. They also support ASU-hosted models (Gemma 4 in production)
            through their partnership with Knowledge Enterprise, with a path toward hosting
            custom fine-tuned models in the future.
          </p>
        </section>

        {/* Proof */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Confirmation from CreateAI Team
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img
              src="/createai-chat-1.png"
              alt="CreateAI team confirming API access and ASU-hosted model support"
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #333',
              }}
            />
            <img
              src="/createai-chat-2.png"
              alt="CreateAI team confirming this can be included as future implementation"
              style={{
                width: '100%',
                borderRadius: '10px',
                border: '1px solid #333',
              }}
            />
          </div>
          <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            Slack conversation with ASU CreateAI team &mdash; April 10, 2026
          </p>
        </section>

        {/* Simple privacy summary */}
        <section>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Student Privacy
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              ['No PII stored', 'Student profile lives in browser cookie only — nothing saved on our servers'],
              ['FERPA compliant path', 'CreateAI routes through ASU-managed infrastructure'],
              ['No hallucinations', 'Strict grounding + low temperature — AI only states verified facts'],
              ['Full transparency', 'Every answer cites its source so students can verify'],
            ].map(([title, desc], i) => (
              <div key={i} style={{
                background: '#111',
                borderRadius: '10px',
                padding: '1.25rem',
                border: '1px solid #222',
              }}>
                <div style={{ fontWeight: 600, color: '#FFC627', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                  {title}
                </div>
                <div style={{ color: '#999', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
