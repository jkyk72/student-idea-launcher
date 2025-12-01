import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(apiKey)

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const brainstormWithGemini = async (
  ideaTitle: string,
  ideaDescription: string,
  conversationHistory: Message[]
) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // System prompt for brainstorming
    const systemPrompt = `あなたは学生のアイデアをブラッシュアップする優秀なメンターです。
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

学生が自分で考えを深められるよう、質問を投げかけながら対話してください。`

    // Build conversation context
    let prompt = systemPrompt + '\n\n'

    conversationHistory.forEach(msg => {
      if (msg.role === 'user') {
        prompt += `学生: ${msg.content}\n`
      } else {
        prompt += `メンター: ${msg.content}\n`
      }
    })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('AI壁打ちでエラーが発生しました')
  }
}

export const generateOutlineWithGemini = async (
  ideaTitle: string,
  ideaDescription: string,
  conversationHistory: Message[]
) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const conversationSummary = conversationHistory
      .map(msg => `${msg.role === 'user' ? '学生' : 'メンター'}: ${msg.content}`)
      .join('\n')

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
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return { slides: [] }
  } catch (error) {
    console.error('Outline Generation Error:', error)
    throw new Error('アウトライン生成でエラーが発生しました')
  }
}
