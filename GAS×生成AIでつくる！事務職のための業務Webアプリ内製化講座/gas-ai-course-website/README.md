# GAS×生成AI 業務Webアプリ内製化講座 Webサイト

このプロジェクトは、「GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座」の教材をWebサイトとして公開するためのNext.jsアプリケーションです。

## 🚀 特徴

- **Next.js 14** (App Router) を使用した高速なWebサイト
- **タブナビゲーション**で教材・セリフ・プロンプトを切り替え
- **レスポンシブデザイン**でスマホ・タブレット対応
- **Vercel**で簡単デプロイ

## 📁 プロジェクト構造

```
gas-ai-course-website/
├── app/
│   ├── components/        # 再利用可能なコンポーネント
│   │   ├── Header.tsx
│   │   └── TabNavigation.tsx
│   ├── lesson/[id]/       # 各講座ページ
│   │   └── page.tsx
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # レイアウト
│   └── page.tsx           # トップページ
├── public/                # 静的ファイル
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### 3. ビルド

```bash
npm run build
```

## 📦 Vercelへのデプロイ

### 方法1: Vercel CLIを使用

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

### 方法2: GitHubと連携

1. このプロジェクトをGitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)にログイン
3. 「New Project」をクリック
4. GitHubリポジトリを選択
5. プロジェクト設定:
   - **Framework Preset**: Next.js
   - **Root Directory**: `gas-ai-course-website`
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
6. 「Deploy」をクリック

## 📝 カスタマイズ

### 講座データの更新

講座データは親ディレクトリの各動画フォルダから自動的に読み込まれます：

- `script.md` - 講師用台本
- `materials.html` - 受講者用教材
- `prompts.txt` - プロンプト集

新しい講座を追加する場合は、`app/lesson/[id]/page.tsx` の `lessons` 配列に追加してください。

### デザインのカスタマイズ

- **色**: `tailwind.config.ts` のカラーパレットを編集
- **フォント**: `app/layout.tsx` でフォントを変更
- **スタイル**: `app/globals.css` でグローバルスタイルを調整

## 🎨 使用技術

- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - ユーティリティファーストCSS
- **React Markdown** - Markdownレンダリング
- **Vercel** - ホスティング

## 📄 ライセンス

このプロジェクトは教育目的で作成されています。
