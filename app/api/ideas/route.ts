import { NextRequest, NextResponse } from 'next/server'
import { createIdea, getIdeas, getIdea, updateIdea } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { title, description, category } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { error: 'titleとdescriptionは必須です' },
        { status: 400 }
      )
    }

    // In production, get userId from auth session
    const userId = 'demo-user-id'

    const idea = await createIdea(userId, title, description, category)

    return NextResponse.json({
      idea,
      message: 'アイデアが作成されました'
    })
  } catch (error) {
    console.error('Create Idea API Error:', error)
    return NextResponse.json(
      { error: 'アイデア作成でエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (id) {
      // Get single idea
      const idea = await getIdea(id)
      return NextResponse.json(idea)
    } else if (userId) {
      // Get all ideas for user
      const ideas = await getIdeas(userId)
      return NextResponse.json({ ideas })
    } else {
      return NextResponse.json(
        { error: 'idまたはuserIdが必要です' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Get Idea(s) API Error:', error)
    return NextResponse.json(
      { error: 'アイデア取得でエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'idは必須です' },
        { status: 400 }
      )
    }

    const idea = await updateIdea(id, updates)

    return NextResponse.json({
      idea,
      message: 'アイデアが更新されました'
    })
  } catch (error) {
    console.error('Update Idea API Error:', error)
    return NextResponse.json(
      { error: 'アイデア更新でエラーが発生しました' },
      { status: 500 }
    )
  }
}
