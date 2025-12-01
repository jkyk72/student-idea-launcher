import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ideaTitle, outline } = await request.json()

    if (!ideaTitle || !outline) {
      return NextResponse.json(
        { error: 'アイデアタイトルとアウトラインは必須です' },
        { status: 400 }
      )
    }

    // MVPモック版: 実際のGoogle Slides APIの代わりにモックレスポンスを返す
    // 本番環境では、Google Slides APIを使用して実際のスライドを生成します

    const mockPresentationId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const mockPresentationUrl = `https://docs.google.com/presentation/d/${mockPresentationId}/edit`

    return NextResponse.json({
      presentationId: mockPresentationId,
      presentationUrl: mockPresentationUrl,
      success: true,
      message: 'スライドが生成されました',
      note: '※ これはMVPモック版です。実際のGoogle Slidesは生成されていません。本番環境では実際のスライドが生成されます。'
    })
  } catch (error: any) {
    console.error('Slides Generation API Error:', error)
    return NextResponse.json(
      { error: error.message || 'スライド生成でエラーが発生しました' },
      { status: 500 }
    )
  }
}
