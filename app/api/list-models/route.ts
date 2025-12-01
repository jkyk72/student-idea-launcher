import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini APIキーが設定されていません' },
        { status: 500 }
      )
    }

    // List models using REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'API呼び出しエラー',
          status: response.status,
          statusText: response.statusText,
          details: data
        },
        { status: response.status }
      )
    }

    return NextResponse.json({
      apiKeyPresent: true,
      availableModels: data.models?.map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        supportedGenerationMethods: m.supportedGenerationMethods
      })) || [],
      rawData: data
    })
  } catch (error: any) {
    console.error('List Models Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
