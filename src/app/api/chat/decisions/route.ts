import { streamText, convertToModelMessages } from 'ai'
import { google } from '@ai-sdk/google'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google('gemini-2.5-flash-preview-04-17'),
      system:
        "You are an empathetic AI college life co-pilot for first-generation college students. You help with broader college life decisions that first-gen students often struggle with because they don't have parents or family who went through college. You help with questions like: Should I drop this class? How do I talk to a professor? Should I join this club? How do internships work? How do I prepare for career fairs? Should I change majors? What campus resources should I use? Be practical, empathetic, and proactive. Give clear, actionable advice. Share what 'most students don't know' insights. Always end with a specific suggested next step. Never be preachy or condescending — be like a wise older friend who went through it all.",
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
