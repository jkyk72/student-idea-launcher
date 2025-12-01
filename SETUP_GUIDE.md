# Student Idea Launcher セットアップガイド

このガイドでは、Student Idea Launcherを初めてセットアップする手順を詳しく説明します。

## 目次

1. [必要なアカウント・ツール](#1-必要なアカウントツール)
2. [プロジェクトのインストール](#2-プロジェクトのインストール)
3. [Supabaseのセットアップ](#3-supabaseのセットアップ)
4. [Gemini APIの設定](#4-gemini-apiの設定)
5. [Google Cloud Platform設定（オプション）](#5-google-cloud-platform設定オプション)
6. [メール設定（オプション）](#6-メール設定オプション)
7. [動作確認](#7-動作確認)
8. [トラブルシューティング](#8-トラブルシューティング)

---

## 1. 必要なアカウント・ツール

### 必須
- ✅ Node.js 18以上（[公式サイト](https://nodejs.org/)からダウンロード）
- ✅ Supabaseアカウント（[supabase.com](https://supabase.com)で無料登録）
- ✅ Gemini APIキー（[Google AI Studio](https://makersuite.google.com/app/apikey)で無料取得）

### オプション
- Google Cloud Platformアカウント（Google Slides連携用）
- Gmailアカウント（メール送信用）

---

## 2. プロジェクトのインストール

### ステップ1: プロジェクトディレクトリに移動

```bash
cd student-idea-launcher
```

### ステップ2: 依存パッケージのインストール

```bash
npm install
```

インストールが完了するまで数分かかります。

---

## 3. Supabaseのセットアップ

### ステップ1: Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にログイン
2. 「New Project」をクリック
3. プロジェクト名: `student-idea-launcher`
4. データベースパスワードを設定（安全な場所に保存）
5. リージョンを選択（日本の場合: Northeast Asia (Tokyo)）
6. 「Create new project」をクリック

### ステップ2: データベーススキーマの作成

プロジェクトが作成されたら：

1. 左サイドバーの「SQL Editor」をクリック
2. 「New query」をクリック
3. `supabase-schema.sql`の内容をコピー＆ペースト
4. 「Run」をクリックしてSQLを実行

### ステップ3: API認証情報の取得

1. 左サイドバーの「Settings」→「API」をクリック
2. 以下の情報をコピー：
   - Project URL
   - anon public key
   - service_role key（セキュアに保管）

### ステップ4: 環境変数の設定

`.env.local`ファイルを開き、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## 4. Gemini APIの設定

### ステップ1: APIキーの取得

1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. Googleアカウントでログイン
3. 「Get API key」または「Create API key」をクリック
4. APIキーが表示されるのでコピー

### ステップ2: 環境変数の設定

`.env.local`に以下を追加：

```env
GEMINI_API_KEY=AIzaSy...
```

**注意:** APIキーは絶対に公開リポジトリにコミットしないでください！

---

## 5. Google Cloud Platform設定（オプション）

Google Slides自動生成機能を有効化する場合：

### ステップ1: GCPプロジェクトの作成

1. [Google Cloud Console](https://console.cloud.google.com)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクト名: `student-idea-launcher`

### ステップ2: Google Slides APIの有効化

1. 「APIとサービス」→「ライブラリ」
2. "Google Slides API"を検索
3. 「有効にする」をクリック

### ステップ3: OAuth 2.0認証情報の作成

1. 「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類: Webアプリケーション
4. 承認済みのリダイレクトURIに追加:
   - `http://localhost:3000/api/auth/callback`
   - `https://yourdomain.com/api/auth/callback`（本番環境用）
5. クライアントIDとシークレットをコピー

### ステップ4: 環境変数の設定

```env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

---

## 6. メール設定（オプション）

専門家連携機能でメール送信を有効化する場合：

### Gmailの場合

1. Googleアカウントにログイン
2. [アプリパスワード](https://myaccount.google.com/apppasswords)を生成
3. 2段階認証が必要です

### 環境変数の設定

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**注意:** Gmailの場合、通常のパスワードではなくアプリパスワードを使用してください。

---

## 7. 動作確認

### ステップ1: 開発サーバーの起動

```bash
npm run dev
```

以下のメッセージが表示されればOK：

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### ステップ2: ブラウザでアクセス

ブラウザで `http://localhost:3000` を開く

### ステップ3: 機能テスト

1. ホーム画面が表示されることを確認
2. 「今すぐ始める」をクリック
3. アイデアを作成
4. 各機能（壁打ち、スライド生成等）をテスト

---

## 8. トラブルシューティング

### エラー: "Module not found"

**原因:** パッケージのインストールが不完全

**解決策:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### エラー: "Supabase client error"

**原因:** Supabase認証情報が正しくない

**解決策:**
1. `.env.local`の設定を再確認
2. SupabaseダッシュボードでURLとキーを再取得
3. 開発サーバーを再起動

### エラー: "Gemini API error"

**原因:** APIキーが無効または制限超過

**解決策:**
1. APIキーが正しく設定されているか確認
2. [Google AI Studio](https://makersuite.google.com)でAPIキーの状態を確認
3. APIの利用制限を確認

### データベース接続エラー

**原因:** RLSポリシーまたはスキーマの問題

**解決策:**
1. Supabase SQL Editorで`supabase-schema.sql`を再実行
2. RLSが正しく設定されているか確認
3. Supabaseプロジェクトが起動しているか確認

### ポート3000が使用中

**原因:** 既に別のアプリケーションがポート3000を使用

**解決策:**
```bash
# 別のポートで起動
PORT=3001 npm run dev
```

---

## 開発のヒント

### 環境変数の確認

```bash
# .env.localが正しく読み込まれているか確認
npm run dev --debug
```

### データベースの確認

Supabaseダッシュボードの「Table Editor」でデータを直接確認できます。

### ログの確認

- ブラウザの開発者ツール（F12）でコンソールログを確認
- サーバーログはターミナルに表示されます

---

## 次のステップ

セットアップが完了したら：

1. **README.md**を読んで機能を理解
2. アイデアを実際に登録してみる
3. 各機能を試してフィードバック
4. カスタマイズや機能追加に挑戦！

---

## サポート

問題が解決しない場合：

- GitHubのIssuesで質問
- READMEの「よくある質問」を確認
- Supabaseの[ドキュメント](https://supabase.com/docs)を参照

**楽しい開発を！🚀**
