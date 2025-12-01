# Student Idea Launcher 🚀

学生向けAI壁打ち〜スライド化〜権利保全〜税理士連携ツール

## 概要

Student Idea Launcherは、学生の皆さんのアイデアを守り、育てるための総合プラットフォームです。

### 主な機能

1. **AI壁打ち（Gemini API）**
   - Gemini AIとの対話でアイデアをブラッシュアップ
   - 建設的なフィードバックと質問による思考の深化

2. **自動アウトライン生成**
   - 壁打ちセッションからプレゼンテーション用アウトラインを自動生成
   - Gemini APIを活用した構造化

3. **Google Slides自動生成**
   - アウトラインから自動的にスライドを作成
   - プレゼンテーション準備の時間を大幅短縮

4. **権利保全（PDF + SHA256ハッシュ）**
   - アイデアをPDF文書化
   - SHA256ハッシュで改ざん検出可能な証明書を生成
   - タイムスタンプ付きで権利の証拠として保管

5. **専門家連携（メール送信）**
   - 税理士、弁護士、弁理士への相談をワンクリック
   - 自動メール送信による簡単な専門家連携

## 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### バックエンド
- **Next.js API Routes**
- **Supabase** (PostgreSQL + RLS)
- **Google Cloud Functions** (準備済み)

### 外部API
- **Gemini API** - AI壁打ち、アウトライン生成
- **Google Slides API** - スライド自動生成
- **Nodemailer** - メール送信

### ライブラリ
- `jsPDF` - PDF生成
- `crypto-js` - SHA256ハッシュ生成
- `@supabase/supabase-js` - Supabaseクライアント
- `googleapis` - Google APIs

## セットアップ手順

### 1. 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント
- Gemini APIキー
- Google Cloud Platform アカウント（オプション）

### 2. インストール

```bash
cd student-idea-launcher
npm install
```

### 3. 環境変数設定

`.env.local`ファイルを編集：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Google APIs（オプション）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Email（オプション）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Supabaseデータベースセットアップ

1. Supabaseプロジェクトを作成
2. SQL Editorでスキーマをインポート：

```bash
# supabase-schema.sql の内容をSupabase SQL Editorで実行
```

または、Supabase CLIを使用：

```bash
supabase db push
```

### 5. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 使い方

### 1. アイデア登録
- ホーム画面から「今すぐ始める」をクリック
- アイデアのタイトルと説明を入力

### 2. AI壁打ち
- Gemini AIとチャット形式で対話
- アイデアをブラッシュアップ

### 3. スライド生成
- アウトライン自動生成
- Google Slidesへ自動変換

### 4. 権利保全
- PDF生成
- SHA256ハッシュで証明書作成
- ダウンロードして保管

### 5. 専門家連携
- 税理士/弁護士/弁理士を選択
- 相談内容を入力して送信

## プロジェクト構造

```
student-idea-launcher/
├── app/
│   ├── api/              # API Routes
│   │   ├── brainstorm/   # AI壁打ちAPI
│   │   ├── outline/      # アウトライン生成API
│   │   ├── slides/       # スライド生成API
│   │   ├── protect/      # 権利保全API
│   │   ├── experts/      # 専門家連携API
│   │   └── ideas/        # アイデアCRUD API
│   ├── brainstorm/       # 壁打ちページ
│   ├── slides/           # スライド生成ページ
│   ├── protect/          # 権利保全ページ
│   ├── experts/          # 専門家連携ページ
│   ├── create-idea/      # アイデア作成ページ
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── lib/
│   ├── supabase/         # Supabase関連
│   │   ├── client.ts     # Supabaseクライアント
│   │   └── database.ts   # DB操作関数
│   ├── google/           # Google APIs
│   │   ├── gemini.ts     # Gemini API
│   │   └── slides.ts     # Google Slides API
│   └── utils/            # ユーティリティ
│       ├── pdf.ts        # PDF生成
│       └── email.ts      # メール送信
├── components/           # Reactコンポーネント
├── public/               # 静的ファイル
├── functions/            # Cloud Functions（準備済み）
├── supabase-schema.sql   # DBスキーマ
├── .env.local            # 環境変数
├── next.config.js        # Next.js設定
├── tailwind.config.js    # Tailwind設定
├── tsconfig.json         # TypeScript設定
└── package.json          # 依存関係
```

## APIキーの取得方法

### Gemini API
1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 「Get API Key」をクリック
3. APIキーをコピーして`.env.local`に貼り付け

### Supabase
1. [Supabase](https://supabase.com)でプロジェクト作成
2. Settings > API からURLとキーを取得
3. `.env.local`に貼り付け

### Google Cloud Platform（オプション）
1. [Google Cloud Console](https://console.cloud.google.com)でプロジェクト作成
2. APIs & Services > Credentials でOAuth 2.0クライアントID作成
3. Google Slides APIを有効化
4. 認証情報を`.env.local`に設定

## デプロイ

### Vercel（推奨）

```bash
# Vercelにデプロイ
npm install -g vercel
vercel
```

環境変数を Vercel ダッシュボードで設定

### その他のプラットフォーム
- Netlify
- AWS Amplify
- Google Cloud Run

## MVP版の制限事項

本MVPには以下の制限があります：

1. **認証機能未実装**
   - デモ用のユーザーIDを使用
   - 本番環境ではSupabase Authの実装が必要

2. **Google Slides連携**
   - OAuth認証が未設定の場合、モックデータを返却
   - 本番環境ではOAuth設定が必要

3. **メール送信**
   - デモモードではコンソールログのみ
   - 本番環境ではSMTP設定が必要

4. **ファイルストレージ**
   - PDFはクライアント側でダウンロードのみ
   - 本番環境ではSupabase StorageまたはS3への保存推奨

## 今後の拡張予定

- [ ] ユーザー認証（Supabase Auth）
- [ ] アイデア一覧・検索機能
- [ ] チーム機能（複数人での壁打ち）
- [ ] バージョン管理（アイデアの履歴管理）
- [ ] ファイルストレージ（Supabase Storage）
- [ ] リアルタイム通知
- [ ] モバイルアプリ（React Native）
- [ ] 専門家ダッシュボード

## ライセンス

ISC

## 作成者

Student Idea Launcher Team

---

**学生の皆さんのアイデアが世界を変える！**
