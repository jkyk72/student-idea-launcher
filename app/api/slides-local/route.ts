import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ideaTitle, outline, ideaId } = await request.json()

    if (!ideaTitle || !outline || !ideaId) {
      return NextResponse.json(
        { error: 'アイデアタイトル、アウトライン、アイデアIDは必須です' },
        { status: 400 }
      )
    }

    // HTML/PDFスライド生成版
    // ブラウザで表示・プレゼン可能、PDFダウンロード対応
    const presentationUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/presentation/${ideaId}`

    return NextResponse.json({
      presentationId: ideaId,
      presentationUrl: presentationUrl,
      success: true,
      message: 'スライドが生成されました',
      note: 'ブラウザで表示・プレゼンテーションが可能です。PDFとしてダウンロードもできます。'
    })
  } catch (error: any) {
    console.error('Slides Generation API Error:', error)
    return NextResponse.json(
      { error: error.message || 'スライド生成でエラーが発生しました' },
      { status: 500 }
    )
  }
}
