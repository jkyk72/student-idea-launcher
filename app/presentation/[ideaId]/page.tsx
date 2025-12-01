'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getIdea, getSession } from '@/lib/utils/localStorage'

interface Slide {
  title: string
  points: string[]
}

export default function PresentationPage() {
  const params = useParams()
  const ideaId = params.ideaId as string
  const [idea, setIdea] = useState<any>(null)
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (ideaId) {
      const loadedIdea = getIdea(ideaId)
      const session = getSession(ideaId)
      setIdea(loadedIdea)

      // Generate slides from outline if available
      if (session?.outline) {
        try {
          const outline = typeof session.outline === 'string'
            ? JSON.parse(session.outline)
            : session.outline
          if (outline.slides) {
            setSlides(outline.slides)
          }
        } catch (error) {
          console.error('Error parsing outline:', error)
        }
      }
    }
  }, [ideaId])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'Escape' && isFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide, slides.length, isFullscreen])

  if (!idea || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">スライドが見つかりません</h1>
          <p className="text-gray-600 mb-4">まずアウトラインを生成してください。</p>
          <Link href={`/slides?ideaId=${ideaId}`} className="text-blue-600 hover:underline">
            スライド生成ページに戻る
          </Link>
        </div>
      </div>
    )
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Controls - Hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <Link href={`/slides?ideaId=${ideaId}`} className="text-blue-600 hover:underline text-sm">
            ← 戻る
          </Link>
          <span className="text-sm text-gray-600">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            前へ
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            次へ
          </button>
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {isFullscreen ? '終了' : 'フルスクリーン'}
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            PDFダウンロード
          </button>
        </div>
      </div>

      {/* Slide Display */}
      <div className="flex items-center justify-center p-8 print:p-0">
        <div className="w-full max-w-5xl aspect-[16/9] bg-white shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none print:max-w-full">
          <div className="h-full flex flex-col p-12 bg-gradient-to-br from-blue-50 to-white print:from-white print:to-white">
            {/* Slide Number - Hidden on first slide */}
            {currentSlide > 0 && (
              <div className="text-right text-sm text-gray-400 mb-4">
                {currentSlide + 1}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8 print:text-3xl">
              {currentSlideData.title}
            </h1>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <ul className="space-y-4">
                {currentSlideData.points.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3 text-lg text-gray-700 print:text-base"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm mt-1">
                      {index + 1}
                    </span>
                    <span className="flex-1">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
              <span>{idea.title}</span>
              <span>Student Idea Launcher</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Help - Hidden when printing */}
      <div className="print:hidden fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-xs text-gray-600">
        <div className="font-semibold mb-2">キーボードショートカット</div>
        <div>→ / Space: 次のスライド</div>
        <div>←: 前のスライド</div>
        <div>Esc: フルスクリーン終了</div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}
