# Google Workspace Studioの活用

**コース概要**: Google Workspace Studioを使って、AIエージェントによる業務自動化を実現する方法を学ぶ実践講座

---

## 1. 想定する現場課題

### 数値で見る課題
- フォーム回答を確認し、手動でチームに通知：1件5分 × 日10件 = 50分/日
- Driveにアップロードされた資料の確認・要約・共有：1件10分 × 週5件 = 50分/週
- 未読メールの確認と優先順位付け：毎日30分
- 会議前の情報収集（参加者・議題確認）：1件10分

### 状況
- GAS（Google Apps Script）やWebhookの知識がないため、自動化を諦めていた
- 外部ツール（Zapier、Make等）は費用やセキュリティの懸念がある
- Gemini for Workspaceは使えるが、自動化までは手が出せていない

---

## 2. 理想の状態（Before / After）

### Before
- 毎日1〜2時間を定型作業に費やしている
- フォーム回答があるたび、手動でChatに通知
- Driveの資料を開いて内容確認し、要点を手動でまとめる
- 未読メールを1件ずつ確認し、優先順位を判断
- 自動化にはプログラミング知識が必要と思い込んでいる

### After
- フォーム送信 → 即座にChat通知（作業時間0秒）
- Driveアップロード → Geminiが要約 → Chat通知（作業時間0秒）
- 未読メールをGeminiが毎朝要約してChat通知（作業時間0秒）
- **プログラミング不要、自然言語で自動化エージェント完成**
- 定型作業時間を約70-90%削減

---

## 3. コース名

**Google Workspace Studioの活用**

---

## 4. 改善方針

- **10分以内の動画4本構成**で、段階的に習得
- **プログラミング不要**：自然言語とテンプレートで構築
- **Gemini 3搭載のAIエージェント**で、推論・分析・コンテンツ生成を自動化
- **Google Workspace深層統合**：Gmail、Drive、Chat、Calendar、Forms、Sheetsと連携
- **実務直結**：すぐに使えるテンプレートから始め、段階的にカスタマイズ

---

## 5. 動画タイトル一覧

| 回 | タイトル | 時間 |
|----|----------|------|
| 1 | Google Workspace Studioとは | 10分 |
| 2 | Google Workspace Studioの登録と基本操作 | 10分 |
| 3 | Google Workspace Studioの機能と活用事例 | 10分 |
| 4 | 現場で使うためのカスタマイズ術と知っておくべき注意点 | 10分 |

---

## 6. ディレクトリ構造

```
Google Workspace Studioの活用/
├── README.md
├── 動画1_Google Workspace Studioとは/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       └── README.md
├── 動画2_Google Workspace Studioの登録と基本操作/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       └── README.md
├── 動画3_Google Workspace Studioの機能と活用事例/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       └── README.md
└── 動画4_現場で使うためのカスタマイズ術と知っておくべき注意点/
    ├── script.md
    ├── materials.html
    ├── prompts.txt
    └── demo_code/
        └── README.md
```

---

## 7. 使用ツール・技術要素

- **Google Workspace Studio**（studio.workspace.google.com）
- **Gemini 3**（AIエージェントの頭脳）
- **Google Workspace各種サービス**：
  - Gmail（メール自動処理）
  - Google Drive（ファイル監視・要約）
  - Google Chat（通知送信）
  - Google Calendar（スケジュールトリガー）
  - Google Forms（回答トリガー）
  - Google Sheets（データ記録）
- **サードパーティ連携**（オプション）：Asana、Jira、Mailchimp、Salesforce
- **Apps Script**（上級者向けカスタムステップ）

---

## 8. 対象エディション

- Google Workspace Business Starter / Standard / Plus
- Google Workspace Enterprise Starter / Standard / Plus
- Google Workspace Essentials / Enterprise Essentials / Enterprise Essentials Plus
- Google Workspace Frontline Starter / Standard
- Google Workspace for Education Standard / Plus / Teaching and Learning Upgrade

**注意**：
- 個人Googleアカウントでは利用不可
- 2025年12月3日よりRapid Releaseドメインで順次展開開始
- Scheduled Releaseドメインは2026年1月5日以降に利用可能
- 現在は英語のみ対応（日本語プロンプト入力は可能だが、公式ドキュメントでは英語推奨）

---

## 9. 参考リンク

- [Google Workspace Studio 公式](https://workspace.google.com/studio/)
- [公式ブログ発表](https://workspace.google.com/blog/product-announcements/introducing-google-workspace-studio-agents-for-everyday-work)
- [Workspace Studio ヘルプ](https://support.google.com/workspace-studio/)
- [管理者向けヘルプ](https://support.google.com/a/answer/16703803)
