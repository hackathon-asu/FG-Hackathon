import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      system:
        "You are an AI career guide for first-generation college students. You help with career planning, internship searches, resume building, interview prep, networking, career fairs, salary negotiation, and professional development. You understand that first-gen students often lack family connections and professional networks, so you provide clear, actionable guidance that doesn't assume prior knowledge of corporate culture. Help with questions like: How do I find internships? How do I write a resume with no experience? How do I network? How do I prepare for career fairs? How do I negotiate salary? What career paths fit my major? Be practical, encouraging, and specific. Share insider tips that 'most students don't know'. Always end with a concrete next step the student can take today. Never be preachy — be like a career mentor who genuinely wants them to succeed.",
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
