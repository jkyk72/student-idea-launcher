import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

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

    const result = await model.generateContent(message)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      response: text,
      success: true
    })
  } catch (error: any) {
    console.error('Gemini API Error:', error)

    return NextResponse.json(
      {
        error: error.message || 'Gemini APIでエラーが発生しました',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}
