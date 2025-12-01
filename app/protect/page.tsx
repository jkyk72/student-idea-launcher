'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { generateIdeaPDF, calculateSHA256, downloadPDF } from '@/lib/utils/pdf'
import { getIdea, getSession } from '@/lib/utils/localStorage'

export default function ProtectPage() {
  const searchParams = useSearchParams()
  const ideaId = searchParams.get('ideaId')
  const [idea, setIdea] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)
  const [hash, setHash] = useState<string>('')
  const [timestamp, setTimestamp] = useState<string>('')
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  useEffect(() => {
    if (ideaId) {
      const loadedIdea = getIdea(ideaId)
      const loadedSession = getSession(ideaId)
      setIdea(loadedIdea)
      setSession(loadedSession)
    }
  }, [ideaId])

  const generateAndProtect = async () => {
    if (!ideaId || !idea) {
      alert('アイデア情報が見つかりません')
      return
    }

    setLoading(true)
    try {
      // Prepare document data from localStorage
      const timestamp = new Date().toISOString()
      const documentData = {
        title: idea.title || 'Untitled Idea',
        description: idea.description || 'No description',
        author: 'Student User', // In production, get from auth
        timestamp: timestamp,
        brainstormSummary: session?.messages?.length > 0
          ? `壁打ちセッション: ${session.messages.length}件のメッセージ`
          : undefined,
        outline: session?.outline ? JSON.parse(session.outline) : undefined
      }

      // Generate PDF
      const blob = generateIdeaPDF(documentData)
      setPdfBlob(blob)

      // Calculate SHA256 hash
      const pdfHash = await calculateSHA256(blob)
      setHash(pdfHash)
      setTimestamp(timestamp)

      // Save hash to localStorage (instead of database)
      const protectionData = {
        ideaId,
        pdfHash,
        timestamp,
        protectedAt: new Date().toISOString()
      }
      localStorage.setItem(`protection_${ideaId}`, JSON.stringify(protectionData))

      setPdfGenerated(true)
    } catch (error) {
      console.error('Error:', error)
      alert('エラーが発生しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfBlob) {
      downloadPDF(pdfBlob, `idea_${ideaId}_${Date.now()}.pdf`)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
            権利保全 - アイデアを守る
          </h1>

          {!pdfGenerated ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold mb-4">アイデアを文書化して保護</h2>
              <p className="text-gray-600 mb-6">
                あなたのアイデアをPDF文書化し、SHA256ハッシュで権利を保全します。
                <br />
                このハッシュは、アイデアの存在証明として使用できます。
              </p>
              <button
                onClick={generateAndProtect}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'PDF生成中...' : 'PDF生成 & 権利保全'}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold mb-4 text-green-600">
                  権利保全が完了しました！
                </h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">SHA256 ハッシュ値</h3>
                  <p className="text-xs font-mono bg-white p-3 rounded border break-all">
                    {hash}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    このハッシュ値は、あなたのアイデアの存在証明です。
                    <br />
                    必ず保管してください。
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">タイムスタンプ</h3>
                  <p className="text-sm">{new Date(timestamp).toLocaleString('ja-JP')}</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-800">💡 権利保全のポイント</h3>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>このPDFとハッシュ値を安全に保管してください</li>
                    <li>ハッシュ値は改ざん検出に使用できます</li>
                    <li>必要に応じて専門家（弁護士・弁理士）にご相談ください</li>
                  </ul>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    PDFをダウンロード
                  </button>
                  <Link
                    href={`/experts?ideaId=${ideaId}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    次へ: 専門家連携
                  </Link>
                </div>
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
