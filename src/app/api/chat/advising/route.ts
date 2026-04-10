import { streamText, convertToModelMessages } from 'ai'
import { openai } from '@ai-sdk/openai'
import { searchKnowledge, formatContext, getSourceCitations } from '@/lib/rag/search'

const BASE_SYSTEM_PROMPT = `You are a knowledgeable AI academic advisor for Arizona State University (ASU), specializing in helping first-generation college students.

STRICT GROUNDING RULES (HIGHEST PRIORITY):
1. ONLY state facts that are EXPLICITLY present in the ASU KNOWLEDGE BASE CONTEXT provided below. If the context says "Year 2 Spring: MAT 343", you may say MAT 343 is in Year 2 Spring. You may NOT add claims about prerequisites, reasons, or relationships unless those exact details appear in the context.
2. NEVER fabricate prerequisites, course sequences, or policy details. If the context does not explicitly state that Course A is a prerequisite for Course B, do NOT claim it is. Say "the prerequisite information is not in my current knowledge base — check with your advisor or the ASU course catalog."
3. NEVER invent course codes, credit hours, GPA requirements, or deadlines not present in the context.
4. When quoting the semester plan, quote it exactly as provided — do not rearrange, summarize loosely, or add interpretation beyond what the data says.
5. If the context is insufficient to fully answer the question, clearly say which parts you can confirm from the knowledge base and which parts you cannot. Never fill gaps with guesses.

RESPONSE RULES:
6. ALWAYS answer the student's question directly and completely. Never say "refer to this link" or "check this website." YOU provide the answer using the context.
7. After your answer, include a "Sources:" section listing where the information came from.
8. You understand first-gen students may not have family who attended college, so explain things clearly without assuming prior knowledge.
9. Be warm, encouraging, and practical. Always suggest concrete next steps.
10. If a student seems stressed, acknowledge their feelings first before giving advice.
11. Keep responses concise but thorough.

FORMAT:
- Start with a one-line direct answer.
- Then add short sections with markdown headings: **Recommendation**, **Why this matters**, **Next steps**, **Sources**.
- Bold important course codes, deadlines, policy names, GPA thresholds, and action items using **double asterisks**.
- Use concise bullet points for steps and avoid long paragraphs.
- If you are uncertain about any detail, add a "**Note:** This detail is not confirmed in my knowledge base — please verify with your academic advisor." line.`

const ASU_KEYWORDS = [
  'asu',
  'arizona state',
  'tempe',
  'polytechnic',
  'downtown phoenix',
  'west valley',
  'myasu',
  'canvas',
  'solar',
  'sun devil',
  'registrar',
  'major map',
  'maroon and gold',
  'add/drop',
  'session a',
  'session b',
]

function isLikelyAsuQuestion(query: string): boolean {
  const lower = query.toLowerCase()
  if (ASU_KEYWORDS.some(keyword => lower.includes(keyword))) return true

  // Course-style references (e.g., CSE 110, MAT265)
  if (/\b[A-Za-z]{2,4}\s?-?\d{3}\b/.test(query)) return true

  return false
}

function extractLatestUserText(
  messages: Array<{
    role?: string
    content?: unknown
    parts?: Array<{ type?: string; text?: string }>
  }>
): string {
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
  if (!lastUserMessage) return ''

  if (typeof lastUserMessage.content === 'string') return lastUserMessage.content

  if (Array.isArray(lastUserMessage.parts)) {
    return lastUserMessage.parts
      .filter(p => p?.type === 'text' && typeof p.text === 'string')
      .map(p => p.text as string)
      .join(' ')
  }

  return ''
}

function getCoursePathGuardrail(query: string): string {
  const lower = query.toLowerCase()
  const asksNextClass =
    /(what|which).*(class|course).*(next|after)|next.*(class|course)|what should i be taking next/.test(lower)
  const mentionsCse110 = /\bcse\s?-?110\b/.test(lower)

  if (asksNextClass && mentionsCse110) {
    return `\n\nCOURSE-PATH GUARDRAIL:
- The student says they completed CSE 110 and asks what class to take next.
- Use ASU CS semester plan and prerequisites in the provided context.
- The recommended next CS course is CSE 205.
- Do NOT suggest course codes not present in the provided context.
- Include a concise rationale and sources.`
  }

  return ''
}

type AdviceFailureCode =
  | 'BAD_REQUEST'
  | 'MISSING_API_KEY'
  | 'RATE_LIMITED'
  | 'AUTH_FAILED'
  | 'TIMEOUT'
  | 'UPSTREAM_ERROR'
  | 'INTERNAL_ERROR'

function mapAdvisorError(error: unknown): {
  status: number
  code: AdviceFailureCode
  userMessage: string
  details: string
} {
  const details = error instanceof Error ? error.message : String(error)
  const lower = details.toLowerCase()

  if (lower.includes('api key is missing') || lower.includes('incorrect api key')) {
    return {
      status: 503,
      code: 'AUTH_FAILED',
      userMessage:
        'The advisor is temporarily unavailable due to an API configuration issue. Please try again in a few minutes.',
      details,
    }
  }

  if (lower.includes('rate limit') || lower.includes('quota') || lower.includes('429')) {
    return {
      status: 429,
      code: 'RATE_LIMITED',
      userMessage:
        'The advisor is receiving too many requests right now. Please wait a moment and try again.',
      details,
    }
  }

  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('abort')) {
    return {
      status: 504,
      code: 'TIMEOUT',
      userMessage:
        'The advisor response timed out. Please retry, or ask a shorter question for faster results.',
      details,
    }
  }

  if (lower.includes('5')) {
    return {
      status: 502,
      code: 'UPSTREAM_ERROR',
      userMessage:
        'The AI provider returned a temporary error. Please try again shortly.',
      details,
    }
  }

  return {
    status: 500,
    code: 'INTERNAL_ERROR',
    userMessage:
      'Something went wrong while processing your request. Please try again.',
    details,
  }
}

export async function POST(req: Request) {
  const startedAt = Date.now()
  const requestId = `adv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'Advisor is not configured',
          code: 'MISSING_API_KEY' as AdviceFailureCode,
          requestId,
          userMessage:
            'The advisor is not configured yet. Please add OPENAI_API_KEY and retry.',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()
    const messages = body?.messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request payload',
          code: 'BAD_REQUEST' as AdviceFailureCode,
          requestId,
          userMessage: 'Please send at least one message to the advisor.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const modelMessages = await convertToModelMessages(messages)
    const query = extractLatestUserText(messages).trim()

    // Check for user profile from cookie
    const profileCookie = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('fg-profile='))
    let profileContext = ''
    if (profileCookie) {
      try {
        const profile = JSON.parse(decodeURIComponent(profileCookie.split('=').slice(1).join('=')))
        const parts = []
        if (profile.name) parts.push(`Name: ${profile.name}`)
        if (profile.major) parts.push(`Major: ${profile.major}`)
        if (profile.year) parts.push(`Year: ${profile.year}`)
        if (profile.interests?.length) parts.push(`Interests: ${profile.interests.join(', ')}`)
        if (parts.length > 0) profileContext = `\n\nSTUDENT PROFILE:\n${parts.join('\n')}\nUse this to personalize your advice.`
      } catch { /* ignore parse errors */ }
    }

    // Search knowledge base for relevant context
    const results = searchKnowledge(query, 5)
    const context = formatContext(results)
    const sources = getSourceCitations(results)

    const isAsuQuestion = isLikelyAsuQuestion(query)
    const hasRelevantAsuContext = results.length > 0

    if (isAsuQuestion && !hasRelevantAsuContext) {
      const fallbackResult = streamText({
        model: openai('gpt-4o-mini'),
        temperature: 0.1,
        system: `${BASE_SYSTEM_PROMPT}${profileContext}

The user asked an ASU-specific question, but there is no reliable ASU context available.
You must:
- Clearly state you cannot verify this ASU-specific detail from the current knowledge base.
- Recommend contacting an ASU academic advisor for confirmation.
- Still provide 2-3 practical next steps the student can take now.
- End with:
Sources:
- No verified ASU source available in current knowledge base`,
        messages: modelMessages,
      })

      return fallbackResult.toUIMessageStreamResponse()
    }

    const coursePathGuardrail = getCoursePathGuardrail(query)
    const systemPrompt = hasRelevantAsuContext
      ? `${BASE_SYSTEM_PROMPT}${profileContext}${context}${coursePathGuardrail}

GROUNDING MODE — STRICT:
- This question is ${isAsuQuestion ? 'ASU-specific' : 'potentially ASU-related'}.
- The ASU KNOWLEDGE BASE CONTEXT above is your ONLY source of truth for ASU-specific claims.
- You MUST NOT add prerequisite relationships, course sequences, or policy details that are not explicitly stated in the context above.
- If the student asks about prerequisites and the context does not list them, say: "I don't have prerequisite details for this course in my knowledge base. Please check the ASU course catalog or ask your advisor."
- If the student asks "when should I take X" and the semester plan is in the context, quote the semester plan directly. Do not add reasoning about WHY it's in that semester unless the context explains it.
- Every factual claim you make must be traceable to a specific sentence in the context above.

When citing sources in your response, use these URLs:
${sources.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : `${BASE_SYSTEM_PROMPT}${profileContext}

Grounding mode:
- This question appears general and not ASU-specific.
- You may answer using general educational best practices.
- Include:
Sources:
- General guidance (no ASU source required)`

    const result = streamText({
      model: openai('gpt-4o-mini'),
      temperature: 0.1,
      system: systemPrompt,
      messages: modelMessages,
    })

    console.info('[advising-route] request_ok', {
      requestId,
      elapsedMs: Date.now() - startedAt,
      isAsuQuestion,
      retrievalCount: results.length,
      sourceCount: sources.length,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    const mapped = mapAdvisorError(error)
    console.error('[advising-route] request_failed', {
      requestId,
      elapsedMs: Date.now() - startedAt,
      code: mapped.code,
      details: mapped.details,
    })

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        code: mapped.code,
        requestId,
        userMessage: mapped.userMessage,
      }),
      { status: mapped.status, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
