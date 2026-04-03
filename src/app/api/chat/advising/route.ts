import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      system:
        'You are a supportive AI academic advisor for first-generation college students. You help with class scheduling, major selection, academic struggles, campus resources, office hours, and deadlines. You understand that first-gen students may not have family members who attended college, so you explain things clearly without assuming prior knowledge. Be warm, encouraging, and practical. Always suggest concrete next steps. If a student seems stressed, acknowledge their feelings first before giving advice. You are familiar with typical university systems, financial aid, tutoring services, and academic policies. Keep responses concise but thorough.',
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Advising chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
