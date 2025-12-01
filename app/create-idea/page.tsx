'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveIdea, generateId } from '@/lib/utils/localStorage'

export default function CreateIdeaPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    'テクノロジー',
    'ビジネス',
    '教育',
    'ヘルスケア',
    'エンターテインメント',
    '環境',
    'その他'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setLoading(true)
    try {
      // ローカルストレージに保存
      const newIdea = {
        id: generateId(),
        title: title.trim(),
        description: description.trim(),
        category: category || undefined,
        createdAt: new Date().toISOString()
      }

      saveIdea(newIdea)

      // 壁打ちページにリダイレクト
      router.push(`/brainstorm-local?ideaId=${newIdea.id}`)
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              新しいアイデアを登録
            </h1>
            <p className="text-gray-600">
              あなたのアイデアを記録して、AIと一緒にブラッシュアップしましょう
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  アイデアのタイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: 学生向けオンライン家庭教師マッチングサービス"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/200文字
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  カテゴリー
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">選択してください（任意）</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  アイデアの説明 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="あなたのアイデアについて詳しく説明してください。&#10;&#10;例：&#10;- どんな問題を解決しますか？&#10;- 誰のためのサービスですか？&#10;- どのように実現しますか？"
                  rows={10}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/2000文字
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  💡 アイデア記入のヒント
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>解決したい課題や問題を明確に</li>
                  <li>ターゲットユーザーを具体的に</li>
                  <li>どんな価値を提供するかを記載</li>
                  <li>実現方法のアイデアがあれば追記</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/"
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !description.trim()}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {loading ? '作成中...' : 'アイデアを作成して壁打ち開始'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
