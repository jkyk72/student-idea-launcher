# 📦 Vercelへのデプロイ手順

このドキュメントでは、Student Idea LauncherをVercelにデプロイして、どこからでもアクセスできるようにする方法を説明します。

## 🎯 前提条件

- GitHubアカウント（無料）
- Vercelアカウント（無料）
- Gemini API キー

## 📋 手順

### 1️⃣ GitHubリポジトリの作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `student-idea-launcher`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

### 2️⃣ コードをGitHubにプッシュ

ターミナルで以下のコマンドを実行：

```bash
# GitHubのリモートリポジトリを追加（YOUR_USERNAMEを自分のユーザー名に置き換える）
git remote add origin https://github.com/YOUR_USERNAME/student-idea-launcher.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

### 3️⃣ Vercelにデプロイ

#### A. Vercelアカウント作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択
4. GitHubアカウントで認証

#### B. プロジェクトをインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリ一覧から `student-idea-launcher` を選択
3. 「Import」をクリック

#### C. プロジェクト設定

- **Framework Preset**: Next.js（自動検出）
- **Root Directory**: `.`（デフォルト）
- **Build Command**: `npm run build`（デフォルト）
- **Output Directory**: `.next`（デフォルト）

#### D. 環境変数の設定

「Environment Variables」セクションで以下を追加：

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | あなたのGemini APIキー |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://demo.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `demo-anon-key-placeholder` |
| `SUPABASE_SERVICE_ROLE_KEY` | `demo-service-role-key-placeholder` |

**重要**: `GEMINI_API_KEY`には実際のAPIキーを入力してください。

#### E. デプロイ実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待つ（通常1-3分）
3. デプロイ成功！🎉

### 4️⃣ アクセスURL

デプロイが完了すると、以下のようなURLが発行されます：

```
https://student-idea-launcher.vercel.app
```

または

```
https://student-idea-launcher-xxxxx.vercel.app
```

このURLを使って、どのデバイスからでもアクセスできます！

## 🔄 更新方法

コードを変更してGitHubにプッシュすると、Vercelが自動的に再デプロイします：

```bash
git add .
git commit -m "Update: 変更内容"
git push
```

## 📱 スマホ・タブレットからのアクセス

1. ブラウザでVercelから発行されたURLにアクセス
2. ホーム画面に追加（PWA対応）
3. どこからでも使える！

## 🔒 セキュリティ

- 環境変数（APIキー）はVercelで安全に管理されます
- GitHubリポジトリには含まれません（`.gitignore`で除外）
- HTTPS接続で通信が暗号化されます

## 🆘 トラブルシューティング

### デプロイが失敗する場合

1. Vercelのビルドログを確認
2. 環境変数が正しく設定されているか確認
3. `package.json`の依存関係を確認

### APIが動作しない場合

1. Vercelダッシュボードで環境変数を再確認
2. `GEMINI_API_KEY`が正しいか確認
3. Gemini APIの利用制限を確認

## 📞 サポート

問題が発生した場合は、以下をご確認ください：

- [Vercelドキュメント](https://vercel.com/docs)
- [Next.jsドキュメント](https://nextjs.org/docs)
- GitHubリポジトリのIssues

---

🎉 デプロイ完了おめでとうございます！
