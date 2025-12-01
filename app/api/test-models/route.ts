import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    // Try different model names
    const modelNamesToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ]

    const results = []

    for (const modelName of modelNamesToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Hello')
        const response = await result.response
        results.push({
          model: modelName,
          status: 'success',
          response: response.text().substring(0, 50) + '...'
        })
      } catch (error: any) {
        results.push({
          model: modelName,
          status: 'error',
          error: error.message
        })
      }
    }

    return NextResponse.json({
      apiKeyPresent: true,
      apiKeyLength: apiKey.length,
      results
    })
  } catch (error: any) {
    console.error('Test Models Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
