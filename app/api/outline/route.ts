import { NextRequest, NextResponse } from 'next/server'
import { generateOutlineWithGemini } from '@/lib/google/gemini'
import { getBrainstormSession, updateBrainstormSession, getIdea } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { ideaId } = await request.json()

    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaIdは必須です' },
        { status: 400 }
      )
    }

    // Get idea details
    const idea = await getIdea(ideaId)

    // Get brainstorm session
    const session = await getBrainstormSession(ideaId)

    // Generate outline using Gemini
    const outline = await generateOutlineWithGemini(
      idea.title,
      idea.description,
      session.messages || []
    )

    // Save outline to database
    await updateBrainstormSession(session.id, session.messages, JSON.stringify(outline))

    return NextResponse.json({
      outline,
      message: 'アウトライン生成が完了しました'
    })
  } catch (error) {
    console.error('Outline Generation API Error:', error)
    return NextResponse.json(
      { error: 'アウトライン生成でエラーが発生しました' },
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

    if (!session.outline) {
      return NextResponse.json(
        { error: 'アウトラインがまだ生成されていません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      outline: JSON.parse(session.outline)
    })
  } catch (error) {
    console.error('Get Outline Error:', error)
    return NextResponse.json(
      { error: 'アウトラインの取得でエラーが発生しました' },
      { status: 500 }
    )
  }
}
