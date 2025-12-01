import { NextRequest, NextResponse } from 'next/server'
import { brainstormWithGemini } from '@/lib/google/gemini'
import { getBrainstormSession, updateBrainstormSession, createBrainstormSession, getIdea } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { ideaId, message } = await request.json()

    if (!ideaId || !message) {
      return NextResponse.json(
        { error: 'ideaIdとmessageは必須です' },
        { status: 400 }
      )
    }

    // Get idea details
    const idea = await getIdea(ideaId)

    // Get or create brainstorm session
    let session
    try {
      session = await getBrainstormSession(ideaId)
    } catch (error) {
      // Session doesn't exist, create it
      session = await createBrainstormSession(ideaId)
    }

    // Add user message to conversation history
    const conversationHistory = [
      ...(session.messages || []),
      { role: 'user', content: message }
    ]

    // Get AI response
    const aiResponse = await brainstormWithGemini(
      idea.title,
      idea.description,
      conversationHistory
    )

    // Update conversation history with AI response
    const updatedHistory = [
      ...conversationHistory,
      { role: 'assistant', content: aiResponse }
    ]

    // Save to database
    await updateBrainstormSession(session.id, updatedHistory)

    return NextResponse.json({
      response: aiResponse,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Brainstorm API Error:', error)
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get('ideaId')

    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaIdは必須です' },
        { status: 400 }
      )
    }

    const session = await getBrainstormSession(ideaId)

    return NextResponse.json({
      messages: session.messages || [],
      outline: session.outline
    })
  } catch (error) {
    console.error('Get Brainstorm Session Error:', error)
    return NextResponse.json(
      { error: 'セッションが見つかりません' },
      { status: 404 }
    )
  }
}
