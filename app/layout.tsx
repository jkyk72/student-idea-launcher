import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Idea Launcher',
  description: 'AI壁打ち〜スライド化〜権利保全〜税理士連携ツール',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
