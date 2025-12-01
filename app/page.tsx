'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-4 text-blue-600">
            Student Idea Launcher
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            あなたのアイデアを守り、育てる学生向けプラットフォーム
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <FeatureCard
              title="AI壁打ち"
              description="Gemini AIとアイデアをブラッシュアップ"
              icon="💡"
              link="/create-idea"
            />
            <FeatureCard
              title="自動スライド化"
              description="NotebookLM & Google Slidesで自動生成"
              icon="📊"
              link="/create-idea"
            />
            <FeatureCard
              title="権利保全"
              description="PDF+SHA256ハッシュでアイデアを保護"
              icon="🔒"
              link="/create-idea"
            />
            <FeatureCard
              title="専門家連携"
              description="税理士・弁護士へ簡単相談"
              icon="👨‍💼"
              link="/create-idea"
            />
          </div>

          <div className="text-center">
            <Link
              href="/create-idea"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              今すぐ始める
            </Link>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              使い方（4ステップ）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
                  1
                </div>
                <h3 className="font-semibold mb-2">アイデア登録</h3>
                <p className="text-sm text-gray-600">思いついたアイデアを記録</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
                  2
                </div>
                <h3 className="font-semibold mb-2">AI壁打ち</h3>
                <p className="text-sm text-gray-600">AIとブラッシュアップ</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
                  3
                </div>
                <h3 className="font-semibold mb-2">スライド化</h3>
                <p className="text-sm text-gray-600">自動でプレゼン作成</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600">
                  4
                </div>
                <h3 className="font-semibold mb-2">権利保全</h3>
                <p className="text-sm text-gray-600">PDF+ハッシュで保護</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({ title, description, icon, link }: {
  title: string
  description: string
  icon: string
  link: string
}) {
  return (
    <Link href={link}>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer border border-gray-200">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
