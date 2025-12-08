# トラブルシューティングガイド

このドキュメントでは、よくある問題とその解決方法を説明します。

## 🚨 ビルドエラー

### エラー: "Build failed because of webpack errors"

**原因**: CSS/Webpack関連の設定に問題がある

**解決方法**:

1. **依存関係を再インストール**:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. **キャッシュをクリア**:

```bash
rm -rf .next
npm run build
```

3. **Node.jsのバージョンを確認**:

```bash
node -v  # 18.17.0以上が必要
```

バージョンが古い場合は、[Node.js公式サイト](https://nodejs.org/)から最新のLTS版をインストールしてください。

---

### エラー: "Cannot find module 'react-markdown'"

**原因**: 依存関係がインストールされていない

**解決方法**:

```bash
npm install
```

---

### エラー: "Module not found: Can't resolve '@/app/...'"

**原因**: TypeScriptのパス設定に問題がある

**解決方法**:

`tsconfig.json` の `paths` 設定を確認:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 🗂️ ファイル読み込みエラー

### エラー: "ENOENT: no such file or directory"

**原因**: 講座データファイル（script.md、materials.html、prompts.txt）が見つからない

**解決方法**:

1. **ディレクトリ構造を確認**:

親ディレクトリに以下のフォルダが存在することを確認:

```
GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座/
├── 動画1_GAS×AIで業務アプリを構築！まず必要な準備とは？/
│   ├── script.md
│   ├── materials.html
│   └── prompts.txt
├── 動画2_AIと一緒に作る！日報管理アプリの下書き生成/
├── ...
└── gas-ai-course-website/  ← このディレクトリ
```

2. **パスを確認**:

`app/lesson/[id]/page.tsx` の `basePath` を確認:

```typescript
const basePath = path.join(process.cwd(), '..', lesson.folder);
```

---

## 🌐 Vercelデプロイエラー

### エラー: "The file routes-manifest.json couldn't be found"

**原因**: `next.config.js` で `output: 'export'` を設定しているが、サーバーサイドの機能（fsモジュール等）を使用している

**解決方法**:

`next.config.js` から `output: 'export'` を削除してください：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercelでは output: 'export' は不要
}

module.exports = nextConfig
```

また、`vercel.json` もシンプルに：

```json
{
  "framework": "nextjs"
}
```

---

### エラー: "Build Command failed"

**解決方法**:

1. **ローカルでビルドテスト**:

```bash
npm run build
```

ローカルで成功することを確認してからデプロイしてください。

2. **Vercel設定を確認**:

- Root Directory: `gas-ai-course-website` ⚠️ **重要**
- Framework Preset: Next.js
- Build Command: `npm run build`（変更不要）
- Output Directory: `.next`（変更不要）
- Install Command: `npm install`（変更不要）

3. **環境変数の確認**:

Vercelの設定で、必要な環境変数が設定されているか確認（このプロジェクトでは不要）。

---

### エラー: "Module not found: Error: Can't resolve 'fs'"

**原因**: サーバーサイド専用モジュールをクライアントで使用している

**解決方法**:

ファイル読み込みは必ず `page.tsx` (Server Component) で行い、`'use client'` を使っているコンポーネントでは使用しないでください。

---

## 🎨 スタイルの問題

### スタイルが反映されない

**解決方法**:

1. **Tailwind設定を確認**:

`tailwind.config.ts` の `content` 配列を確認:

```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
],
```

2. **開発サーバーを再起動**:

```bash
# Ctrl+C で停止
npm run dev
```

---

## 🔧 その他の問題

### ポート3000が使用中

**解決方法**:

```bash
PORT=3001 npm run dev
```

または、使用中のプロセスを終了:

```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

### タブが切り替わらない

**原因**: `TabNavigation` コンポーネントが正しく動作していない

**解決方法**:

1. ブラウザのコンソールでエラーを確認
2. `'use client'` ディレクティブが正しく設定されているか確認

---

## 📞 さらなるサポート

上記で解決しない場合:

1. **Next.js公式ドキュメント**: https://nextjs.org/docs
2. **Vercel公式ドキュメント**: https://vercel.com/docs
3. **GitHub Issues**: プロジェクトのIssuesセクションで質問

---

## ✅ チェックリスト

問題が発生した場合、以下を順番に確認してください:

- [ ] Node.js 18以上がインストールされている
- [ ] `npm install` を実行した
- [ ] `.next` フォルダを削除してビルドを試した
- [ ] ローカルで `npm run build` が成功する
- [ ] 親ディレクトリに講座データフォルダが存在する
- [ ] ファイル名が正しい（script.md、materials.html、prompts.txt）
- [ ] ブラウザのコンソールでエラーを確認した

---

それでも解決しない場合は、エラーメッセージ全文をコピーして、サポートに問い合わせてください。
