'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getIdea, getSession, saveSession } from '@/lib/utils/localStorage'

export default function SlidesPage() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('ideaId')
  const [idea, setIdea] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [outline, setOutline] = useState<any>(null)
  const [slides, setSlides] = useState<any>(null)
  const [step, setStep] = useState<'outline' | 'slides'>('outline')

  useEffect(() => {
    if (ideaId) {
      const loadedIdea = getIdea(ideaId)
      const loadedSession = getSession(ideaId)
      setIdea(loadedIdea)
      setSession(loadedSession)
    }
  }, [ideaId])

  const generateOutline = async () => {
    if (!idea || !session) {
      alert('アイデアまたはセッション情報が見つかりません')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/outline-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          conversationHistory: session.messages || []
        })
      })

      if (res.ok) {
        const data = await res.json()
        setOutline(data.outline)
        setStep('slides')
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to generate outline')
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(`アウトライン生成でエラーが発生しました: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const generateSlides = async () => {
    if (!idea || !outline) {
      alert('アイデアまたはアウトライン情報が見つかりません')
      return
    }

    setLoading(true)
    try {
      // Save outline to session first
      const updatedSession = { ...session, outline: JSON.stringify(outline) }
      saveSession(updatedSession)

      const res = await fetch('/api/slides-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaTitle: idea.title,
          outline: outline,
          ideaId: ideaId
        })
      })

      if (res.ok) {
        const data = await res.json()
        setSlides(data)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to generate slides')
      }
    } catch (error: any) {
      console.error('Error:', error)
      alert(`スライド生成でエラーが発生しました: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!ideaId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アイデアIDが指定されていません</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            ホームに戻る
          </Link>
        </div>
      </div>
    )
  }

  if (!idea && ideaId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アイデアが見つかりません</h1>
          <p className="text-gray-600 mb-4">このアイデアは存在しないか、削除されました。</p>
          <Link href="/create-idea" className="text-blue-600 hover:underline">
            新しいアイデアを作成
          </Link>
        </div>
      </div>
    )
  }

  if (!session && ideaId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">壁打ちセッションが見つかりません</h1>
          <p className="text-gray-600 mb-4">まずAI壁打ちでアイデアをブラッシュアップしましょう。</p>
          <Link href={`/brainstorm-local?ideaId=${ideaId}`} className="text-blue-600 hover:underline">
            AI壁打ちを開始
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            スライド自動生成
          </h1>

          {step === 'outline' && !outline && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold mb-4">アウトラインを生成</h2>
              <p className="text-gray-600 mb-6">
                壁打ちセッションの内容からプレゼンテーション用のアウトラインを自動生成します。
              </p>
              <button
                onClick={generateOutline}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? '生成中...' : 'アウトライン生成'}
              </button>
            </div>
          )}

          {outline && !slides && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">生成されたアウトライン</h2>
              <div className="space-y-6 mb-8">
                {outline.slides && outline.slides.map((slide: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {index + 1}. {slide.title}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {slide.points.map((point: string, pointIndex: number) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={generateSlides}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {loading ? '生成中...' : 'Google Slidesを生成'}
                </button>
              </div>
            </div>
          )}

          {slides && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-4">スライド生成完了！</h2>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">プレゼンテーションURL:</p>
                <a
                  href={slides.presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {slides.presentationUrl}
                </a>
                {slides.note && (
                  <p className="text-xs text-gray-500 mt-2">{slides.note}</p>
                )}
              </div>
              <div className="flex justify-center space-x-4">
                <a
                  href={slides.presentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  スライドを開く
                </a>
                <Link
                  href={`/protect?ideaId=${ideaId}`}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  次へ: 権利保全
                </Link>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
