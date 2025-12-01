import { NextRequest, NextResponse } from 'next/server'
import { createSlidesFromOutline } from '@/lib/google/slides'
import { getIdea, getBrainstormSession, createSlide } from '@/lib/supabase/database'

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

    // Get brainstorm session with outline
    const session = await getBrainstormSession(ideaId)

    if (!session.outline) {
      return NextResponse.json(
        { error: 'アウトラインが生成されていません。先にアウトラインを生成してください。' },
        { status: 400 }
      )
    }

    const outline = JSON.parse(session.outline)

    // Create Google Slides presentation
    const result = await createSlidesFromOutline(idea.title, outline)

    // Save to database
    await createSlide(ideaId, result.presentationUrl, result.presentationId)

    return NextResponse.json({
      ...result,
      message: 'スライドが生成されました'
    })
  } catch (error) {
    console.error('Slides Generation API Error:', error)
    return NextResponse.json(
      { error: 'スライド生成でエラーが発生しました' },
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

    const { getSlides } = await import('@/lib/supabase/database')
    const slides = await getSlides(ideaId)

    return NextResponse.json({ slides })
  } catch (error) {
    console.error('Get Slides Error:', error)
    return NextResponse.json(
      { error: 'スライド情報の取得でエラーが発生しました' },
      { status: 500 }
    )
  }
}
