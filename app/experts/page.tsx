'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type ExpertType = 'tax_accountant' | 'lawyer' | 'patent_attorney'

export default function ExpertsPage() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('ideaId')
  const [selectedExpert, setSelectedExpert] = useState<ExpertType | null>(null)
  const [message, setMessage] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const experts = [
    {
      type: 'tax_accountant' as ExpertType,
      name: '税理士',
      icon: '💼',
      description: '税務相談、創業支援、補助金申請など',
      expertise: ['税務申告', '会計記帳', '創業融資', '補助金申請', '節税対策']
    },
    {
      type: 'lawyer' as ExpertType,
      name: '弁護士',
      icon: '⚖️',
      description: '法律相談、契約書作成、紛争解決など',
      expertise: ['契約書作成', '利用規約', '紛争解決', '知財相談', '会社設立']
    },
    {
      type: 'patent_attorney' as ExpertType,
      name: '弁理士',
      icon: '📝',
      description: '特許・商標出願、知的財産権の保護など',
      expertise: ['特許出願', '商標登録', '意匠登録', '侵害調査', 'ライセンス契約']
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedExpert || !message.trim() || !ideaId) return

    setLoading(true)
    try {
      const res = await fetch('/api/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId,
          userId: 'demo-user-id', // In production, get from auth
          expertType: selectedExpert,
          message: message.trim(),
          studentName: studentName || '学生ユーザー',
          studentEmail: studentEmail || 'student@example.com'
        })
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        throw new Error('Failed to send expert request')
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                相談を送信しました！
              </h2>
              <p className="text-gray-600 mb-6">
                専門家から3営業日以内にメールで返信があります。
                <br />
                しばらくお待ちください。
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  ホームに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            専門家連携
          </h1>

          {!selectedExpert ? (
            <>
              <p className="text-center text-gray-600 mb-8">
                相談したい専門家を選択してください
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {experts.map((expert) => (
                  <button
                    key={expert.type}
                    onClick={() => setSelectedExpert(expert.type)}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  >
                    <div className="text-5xl mb-3">{expert.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{expert.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{expert.description}</p>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-700 mb-2">専門分野:</p>
                      <div className="flex flex-wrap gap-1">
                        {expert.expertise.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {experts.find(e => e.type === selectedExpert)?.name}への相談
                </h2>
                <button
                  onClick={() => setSelectedExpert(null)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  専門家を変更
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    お名前
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="山田 太郎"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    相談内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="具体的な相談内容を記入してください..."
                    rows={8}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>注意:</strong> 専門家への相談は有料の場合があります。
                    初回相談は無料ですが、詳細なサポートには料金が発生する可能性があります。
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setSelectedExpert(null)}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                  >
                    {loading ? '送信中...' : '相談を送信'}
                  </button>
                </div>
              </form>
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
