'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestGeminiPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai', content: string }>>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (res.ok) {
        const data = await res.json()
        setMessages(prev => [...prev, { role: 'ai', content: data.response }])
      } else {
        const error = await res.json()
        setMessages(prev => [...prev, {
          role: 'ai',
          content: `エラー: ${error.error || '応答の取得に失敗しました'}`
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'エラーが発生しました。もう一度お試しください。'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Gemini API テスト</h1>
              <Link href="/" className="text-sm hover:underline">
                ホームに戻る
              </Link>
            </div>

            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-gray-700">
                <strong>テストモード:</strong> Gemini APIとの直接対話をテストできます（データベース不要）
              </p>
            </div>

            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p className="text-lg">Gemini AIに質問してみましょう！</p>
                  <p className="text-sm mt-2">例: 「学生向けのビジネスアイデアを教えて」</p>
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
                      {msg.role === 'user' ? 'あなた' : 'Gemini AI'}
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
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
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

          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">テスト項目</h2>
            <div className="space-y-2">
              <button
                onClick={() => setInput('学生向けのビジネスアイデアを3つ教えて')}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                💡 学生向けのビジネスアイデアを3つ教えて
              </button>
              <button
                onClick={() => setInput('AIを活用した新しいサービスのアイデアを教えて')}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                🤖 AIを活用した新しいサービスのアイデアを教えて
              </button>
              <button
                onClick={() => setInput('大学生が起業する際の注意点を教えて')}
                className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
              >
                🎓 大学生が起業する際の注意点を教えて
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
