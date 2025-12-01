# クイックスタート - 5分で始める Student Idea Launcher

このガイドでは、最小限の設定でStudent Idea Launcherをすぐに試せます。

## 前提条件

- Node.js 18以上がインストールされていること
- npmが使用可能であること

## セットアップ（5分）

### 1. パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成（既にあればそのまま編集）：

```env
# 必須: Gemini API（無料で取得可能）
GEMINI_API_KEY=your_gemini_api_key_here

# 必須: Supabase（無料プランあり）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# オプション: 以下は後で設定可能
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# SMTP_USER=
# SMTP_PASSWORD=
```

### 3. Gemini APIキーの取得（2分）

1. [Google AI Studio](https://makersuite.google.com/app/apikey)を開く
2. Googleアカウントでログイン
3. 「Get API key」をクリック
4. APIキーをコピーして`.env.local`に貼り付け

### 4. Supabaseの設定（3分）

1. [Supabase](https://supabase.com)でアカウント作成
2. 新しいプロジェクトを作成
3. Settings > API からURL とキーを取得
4. SQL Editorで`supabase-schema.sql`の内容を実行

### 5. 起動！

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 初めての使い方

### ステップ1: アイデア作成

1. ホーム画面で「今すぐ始める」をクリック
2. タイトルと説明を入力
3. 「アイデアを作成して壁打ち開始」をクリック

### ステップ2: AI壁打ち

1. Gemini AIとチャット
2. アイデアについて質問に答えたり、フィードバックを受ける
3. 満足したら「次へ: スライド生成」をクリック

### ステップ3: スライド生成

1. 「アウトライン生成」をクリック
2. 生成されたアウトラインを確認
3. 「Google Slidesを生成」をクリック

### ステップ4: 権利保全

1. 「PDF生成 & 権利保全」をクリック
2. SHA256ハッシュを確認
3. PDFをダウンロード

### ステップ5: 専門家連携

1. 相談したい専門家を選択
2. 相談内容を記入
3. 送信

## MVP版の注意事項

現在の実装は**デモ版**のため、以下の点にご注意ください：

### 動作する機能
- ✅ AI壁打ち（Gemini API）
- ✅ アウトライン生成
- ✅ PDF生成とSHA256ハッシュ
- ✅ 基本的なUI/UX

### 要設定の機能
- ⚠️ Google Slides連携（OAuth設定が必要）
- ⚠️ メール送信（SMTP設定が必要）
- ⚠️ ユーザー認証（現在はデモユーザー）

### 本番環境で必要な追加設定
- データベースのRow Level Security（RLS）設定
- 本番用のSupabaseプロジェクト
- Google OAuth認証
- メール送信サーバー（SMTP）
- ファイルストレージ（PDF保存用）

## よくある質問

### Q: Gemini APIは無料ですか？

A: はい、Google AI Studioで取得できるAPIキーは無料で使用できます（制限あり）。詳細は[Google AI Studio](https://makersuite.google.com)をご確認ください。

### Q: Supabaseは無料ですか？

A: 無料プランがあり、小規模プロジェクトには十分です。詳細は[Supabaseの料金ページ](https://supabase.com/pricing)をご確認ください。

### Q: Google Slidesが生成できません

A: MVP版ではGoogle OAuth設定が必要です。設定方法は`SETUP_GUIDE.md`を参照してください。設定なしの場合、モックデータが返されます。

### Q: メールが送信されません

A: MVP版ではメール送信はコンソールログに出力されます。実際に送信するにはSMTP設定が必要です（`SETUP_GUIDE.md`参照）。

### Q: データが保存されません

A: Supabaseのスキーマが正しく設定されているか確認してください。`supabase-schema.sql`をSQL Editorで実行する必要があります。

### Q: エラーが出ました

A: 以下を確認してください：
1. `.env.local`の設定が正しいか
2. Supabaseプロジェクトが起動しているか
3. APIキーが有効か
4. `npm install`を実行したか

詳細は`SETUP_GUIDE.md`のトラブルシューティングセクションを参照してください。

## 次のステップ

基本的な使い方に慣れたら：

1. **README.md**を読んで全機能を理解
2. **SETUP_GUIDE.md**で完全なセットアップ
3. Google Slides連携を設定
4. メール送信機能を有効化
5. 認証機能の追加（Supabase Auth）

## サポート

問題がある場合：
- `SETUP_GUIDE.md`のトラブルシューティングを確認
- GitHubのIssuesで質問
- Supabaseの[ドキュメント](https://supabase.com/docs)を参照

**楽しいアイデア開発を！🚀**
