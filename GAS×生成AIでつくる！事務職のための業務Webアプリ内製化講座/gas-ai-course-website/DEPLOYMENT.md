# Vercelデプロイ手順書

このドキュメントでは、GAS×生成AI講座WebサイトをVercelにデプロイする手順を説明します。

## 🎯 前提条件

- Node.js 18以上がインストールされていること
- GitHubアカウントを持っていること（推奨）
- Vercelアカウントを持っていること（無料で作成可能）

## 📦 準備

### 1. 依存関係のインストール

```bash
cd "GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座/gas-ai-course-website"
npm install
```

### 2. ローカルで動作確認

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて、サイトが正しく表示されることを確認してください。

## 🚀 Vercelへのデプロイ（推奨方法）

### 方法1: GitHub連携デプロイ（最も簡単）

#### Step 1: GitHubリポジトリの作成

1. GitHubで新しいリポジトリを作成
2. ローカルでGitリポジトリを初期化:

```bash
cd "GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座"
git init
git add .
git commit -m "Initial commit: GAS×AI講座Webサイト"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 2: Vercelでプロジェクトをインポート

1. [Vercel](https://vercel.com)にアクセスしてログイン
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定:
   - **Project Name**: `gas-ai-course-website`（任意）
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `gas-ai-course-website` ⚠️ **重要: 必ず設定してください**
   - **Build Command**: `npm run build`（自動設定、変更不要）
   - **Output Directory**: `.next`（自動設定、変更不要）
   - **Install Command**: `npm install`（自動設定、変更不要）
   - **Environment Variables**: なし（不要）

5. 「Deploy」ボタンをクリック

**⚠️ 重要**: Root Directoryを `gas-ai-course-website` に設定しないと、ビルドが失敗します。

#### Step 3: デプロイ完了

- 数分待つとデプロイが完了します
- 自動生成されたURL（例: `https://gas-ai-course-website-xxxx.vercel.app`）でサイトにアクセスできます

### 方法2: Vercel CLIでデプロイ

```bash
# Vercel CLIのインストール
npm i -g vercel

# プロジェクトディレクトリに移動
cd gas-ai-course-website

# デプロイ
vercel

# 本番環境へデプロイ
vercel --prod
```

## 🔄 更新とCI/CD

GitHubと連携した場合、以下のように自動デプロイされます：

- **mainブランチ**: 本番環境に自動デプロイ
- **その他のブランチ**: プレビュー環境に自動デプロイ

更新手順：

```bash
# ファイルを編集
git add .
git commit -m "Update: 〇〇を修正"
git push origin main
```

→ 自動的にVercelが検知してデプロイ開始

## 🎨 カスタムドメインの設定（オプション）

1. Vercelのプロジェクト設定を開く
2. 「Domains」タブを選択
3. 独自ドメインを追加
4. DNS設定を指示通りに変更

## 🐛 トラブルシューティング

### ビルドエラーが出る場合

```bash
# ローカルでビルドテスト
npm run build

# エラーログを確認
```

### ファイルが読み込めない場合

`app/lesson/[id]/page.tsx` の `basePath` を確認:

```typescript
const basePath = path.join(process.cwd(), '..', lesson.folder);
```

### 環境変数が必要な場合

Vercelのプロジェクト設定 → Environment Variables で追加

## 📊 パフォーマンス最適化

デプロイ後、以下を確認：

- ✅ ページ読み込み速度（Lighthouse スコア）
- ✅ 画像最適化（Next.js Image コンポーネント）
- ✅ モバイル対応（レスポンシブデザイン）

## 🔒 セキュリティ

- ✅ HTTPS が自動で有効化
- ✅ 環境変数は暗号化して保存
- ✅ XSS対策（React の自動エスケープ）

## 📞 サポート

問題が発生した場合：

1. [Vercel ドキュメント](https://vercel.com/docs)を確認
2. [Next.js ドキュメント](https://nextjs.org/docs)を確認
3. GitHub Issues で質問

---

以上でデプロイ完了です！🎉
