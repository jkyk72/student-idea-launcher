import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { ideaTitle, ideaDescription, conversationHistory } = await request.json()

    if (!ideaTitle || !ideaDescription) {
      return NextResponse.json(
        { error: 'アイデア情報は必須です' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const conversationSummary = conversationHistory && conversationHistory.length > 0
      ? conversationHistory
          .map((msg: Message) => `${msg.role === 'user' ? '学生' : 'メンター'}: ${msg.content}`)
          .join('\n')
      : 'まだ壁打ちセッションが行われていません。'

    const prompt = `以下のアイデアと壁打ちセッションの内容から、プレゼンテーション用のアウトラインを生成してください。

アイデアタイトル: ${ideaTitle}
アイデア概要: ${ideaDescription}

壁打ちセッション:
${conversationSummary}

以下の構成でアウトラインを作成してください：
1. タイトルスライド
2. 問題提起
3. ソリューション
4. 市場分析
5. ビジネスモデル
6. 実装計画
7. まとめ・次のステップ

各セクションには、キーポイント（3-5個）を含めてください。
JSON形式で出力してください。

出力形式例：
{
  "slides": [
    {
      "title": "タイトル",
      "points": ["ポイント1", "ポイント2"]
    }
  ]
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    let outline
    if (jsonMatch) {
      outline = JSON.parse(jsonMatch[0])
    } else {
      outline = { slides: [] }
    }

    return NextResponse.json({
      outline,
      success: true,
      message: 'アウトライン生成が完了しました'
    })
  } catch (error: any) {
    console.error('Outline Generation API Error:', error)
    return NextResponse.json(
      { error: error.message || 'アウトライン生成でエラーが発生しました' },
      { status: 500 }
    )
  }
}
