import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { ideaTitle, ideaDescription, message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージは必須です' },
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

    // システムプロンプト
    let prompt = `あなたは学生のアイデアをブラッシュアップする優秀なメンターです。
以下のアイデアについて、建設的なフィードバックと質問を提供してください。

アイデアタイトル: ${ideaTitle}
アイデア概要: ${ideaDescription}

以下の観点から支援してください：
1. アイデアの独自性と市場価値
2. 実現可能性と必要なリソース
3. ターゲットユーザーとペインポイント
4. ビジネスモデルと収益化
5. 技術的な課題と解決策
6. 次のステップとアクションプラン

学生が自分で考えを深められるよう、質問を投げかけながら対話してください。

---

`

    // 会話履歴を追加
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: Message) => {
        if (msg.role === 'user') {
          prompt += `学生: ${msg.content}\n`
        } else {
          prompt += `メンター: ${msg.content}\n`
        }
      })
    }

    // 最新のメッセージを追加
    prompt += `学生: ${message}\nメンター: `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      success: true
    })
  } catch (error: any) {
    console.error('Brainstorm Local API Error:', error)
    return NextResponse.json(
      { error: error.message || 'エラーが発生しました' },
      { status: 500 }
    )
  }
}
