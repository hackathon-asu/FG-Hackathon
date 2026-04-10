import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'
import { searchKnowledge, formatContext, getSourceCitations } from '@/lib/rag/search'

const BASE_SYSTEM_PROMPT = `You are an AI career guide and life coach for Arizona State University (ASU) first-generation college students. You have access to real ASU course data, degree requirements, career resources, and academic policies.

STRICT GROUNDING RULES (HIGHEST PRIORITY):
1. ONLY state facts about ASU courses, requirements, policies, or resources that are EXPLICITLY present in the ASU KNOWLEDGE BASE CONTEXT provided below. Do NOT fabricate course details, prerequisites, credit hours, or deadlines.
2. If the context does not contain specific information to answer part of the question, clearly say which parts you can confirm and which you cannot. Never fill gaps with guesses.
3. When referencing ASU courses or programs, only mention ones that appear in the provided context.

RESPONSE RULES:
4. ALWAYS answer the student's question directly and completely. Never say "refer to this link" or "check this website." YOU provide the answer using the context.
5. After your answer, include a "Sources:" section listing where the information came from.
6. You understand first-gen students often lack family connections and professional networks, so provide clear, actionable guidance that doesn't assume prior knowledge of corporate culture.
7. Help with: career planning, internship searches, resume building, interview prep, networking, career fairs, salary negotiation, and professional development.
8. Share insider tips that "most students don't know." Always end with a concrete next step the student can take today.
9. Be practical, encouraging, and specific. Never be preachy — be like a career mentor who genuinely wants them to succeed.
10. When discussing career paths, reference specific ASU courses, concentrations, and degree requirements ONLY when they appear in the provided context.
11. If you are uncertain about any detail, add: "**Note:** This detail is not confirmed in my knowledge base — please verify with your academic advisor."`

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const modelMessages = await convertToModelMessages(messages)

    const lastUserMessage = [...messages].reverse().find(
      (m: { role: string }) => m.role === 'user'
    )
    const query = lastUserMessage?.content || ''

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
        if (parts.length > 0) profileContext = `\n\nSTUDENT PROFILE:\n${parts.join('\n')}\nUse this to personalize your career advice and recommendations.`
      } catch { /* ignore parse errors */ }
    }

    const results = searchKnowledge(query, 5)
    const context = formatContext(results)
    const sources = getSourceCitations(results)

    const systemPrompt = sources.length > 0
      ? `${BASE_SYSTEM_PROMPT}${profileContext}${context}

GROUNDING MODE — STRICT:
- The ASU KNOWLEDGE BASE CONTEXT above is your ONLY source of truth for ASU-specific claims.
- You MUST NOT add prerequisites, course sequences, or policy details not explicitly stated in the context.
- Every factual claim about ASU must be traceable to the context above.
- If you lack specific details, say so and recommend verifying with an advisor.

When citing sources in your response, use these URLs:
${sources.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : `${BASE_SYSTEM_PROMPT}${profileContext}`

    const result = streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      temperature: 0.1,
      system: systemPrompt,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Decisions chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
