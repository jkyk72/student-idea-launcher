import { NextRequest, NextResponse } from 'next/server'
import { getIdea, getBrainstormSession, createDocument } from '@/lib/supabase/database'

export async function POST(request: NextRequest) {
  try {
    const { ideaId, pdfHash } = await request.json()

    if (!ideaId || !pdfHash) {
      return NextResponse.json(
        { error: 'ideaIdとpdfHashは必須です' },
        { status: 400 }
      )
    }

    // For MVP, we'll store the hash in the database
    // In production, you might also upload the PDF to storage (Supabase Storage, S3, etc.)

    const pdfUrl = `document_${ideaId}_${Date.now()}.pdf` // Mock URL for MVP

    // Save document info to database
    await createDocument(ideaId, pdfUrl, pdfHash)

    return NextResponse.json({
      message: 'アイデアが保護されました',
      hash: pdfHash,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Protect API Error:', error)
    return NextResponse.json(
      { error: '権利保全処理でエラーが発生しました' },
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

    const { getDocuments } = await import('@/lib/supabase/database')
    const documents = await getDocuments(ideaId)

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Get Documents Error:', error)
    return NextResponse.json(
      { error: '文書情報の取得でエラーが発生しました' },
      { status: 500 }
    )
  }
}
