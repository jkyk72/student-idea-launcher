'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getIdea, getSession, saveSession } from '@/lib/utils/localStorage'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function BrainstormLocalPage() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('ideaId')
  const [idea, setIdea] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ideaId) {
      // ローカルストレージからアイデアとセッションを読み込み
      const loadedIdea = getIdea(ideaId)
      setIdea(loadedIdea)

      const session = getSession(ideaId)
      if (session) {
        setMessages(session.messages)
      }
    }
  }, [ideaId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !ideaId || !idea) return

    const userMessage = input.trim()
    setInput('')

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Gemini APIを呼び出す
      const res = await fetch('/api/brainstorm-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          message: userMessage,
          conversationHistory: messages
        })
      })

      if (res.ok) {
        const data = await res.json()
        const updatedMessages = [...newMessages, { role: 'assistant' as const, content: data.response }]
        setMessages(updatedMessages)

        // ローカルストレージに保存
        saveSession({
          ideaId,
          messages: updatedMessages
        })
      } else {
        throw new Error('Failed to get response')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
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

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アイデアが見つかりません</h1>
          <Link href="/create-idea" className="text-blue-600 hover:underline">
            新しいアイデアを作成
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">AI壁打ち - アイデアブラッシュアップ</h1>
                <Link href="/" className="text-sm hover:underline">
                  ホームに戻る
                </Link>
              </div>
              <div className="text-sm opacity-90">
                <strong>アイデア:</strong> {idea.title}
              </div>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-lg">アイデアについて話してみましょう！</p>
                  <p className="text-sm mt-2">AIメンターがあなたのアイデアをブラッシュアップするお手伝いをします。</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block text-left">
                    <p className="text-sm font-semibold mb-2">💡 質問例:</p>
                    <ul className="text-sm space-y-1">
                      <li>• このアイデアの市場価値は？</li>
                      <li>• どんなユーザーに刺さる？</li>
                      <li>• 実現するために必要なことは？</li>
                    </ul>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {msg.role === 'user' ? 'あなた' : 'AIメンター'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  送信
                </button>
              </div>
            </form>
          </div>

          {messages.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                href={`/slides?ideaId=${ideaId}`}
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                次へ: スライド生成
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
