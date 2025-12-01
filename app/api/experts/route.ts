import { NextRequest, NextResponse } from 'next/server'
import { sendExpertEmail, sendConfirmationEmail } from '@/lib/utils/email'
import { createExpertRequest, updateExpertRequestStatus, getIdea } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { ideaId, userId, expertType, message, studentName, studentEmail } = await request.json()

    if (!ideaId || !userId || !expertType || !message) {
      return NextResponse.json(
        { error: '必要な情報が不足しています' },
        { status: 400 }
      )
    }

    // Get idea details
    const idea = await getIdea(ideaId)

    // Create expert request in database
    const expertRequest = await createExpertRequest(ideaId, userId, expertType, message)

    // Send email to expert
    try {
      await sendExpertEmail({
        expertType,
        studentName: studentName || 'Student User',
        studentEmail: studentEmail || 'student@example.com',
        ideaTitle: idea.title,
        message
      })

      // Send confirmation email to student
      await sendConfirmationEmail(
        studentEmail || 'student@example.com',
        studentName || 'Student User',
        expertType,
        idea.title
      )

      // Update status to sent
      await updateExpertRequestStatus(expertRequest.id, 'sent')

      return NextResponse.json({
        message: '専門家への相談を送信しました',
        requestId: expertRequest.id
      })
    } catch (emailError) {
      console.error('Email Error:', emailError)
      return NextResponse.json({
        message: '相談は記録されましたが、メール送信に失敗しました',
        requestId: expertRequest.id,
        warning: 'メール送信エラー'
      })
    }
  } catch (error) {
    console.error('Expert Request API Error:', error)
    return NextResponse.json(
      { error: '専門家連携でエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userIdは必須です' },
        { status: 400 }
      )
    }

    const { getExpertRequests } = await import('@/lib/supabase/database')
    const requests = await getExpertRequests(userId)

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Get Expert Requests Error:', error)
    return NextResponse.json(
      { error: '相談履歴の取得でエラーが発生しました' },
      { status: 500 }
    )
  }
}
