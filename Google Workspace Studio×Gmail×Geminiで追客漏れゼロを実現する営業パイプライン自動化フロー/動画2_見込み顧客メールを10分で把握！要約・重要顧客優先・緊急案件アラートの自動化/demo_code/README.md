# 第2回：見込み顧客メール要約エージェント - デモファイル

## 概要

見込み顧客からのメールを毎朝自動で要約し、Google Chatに通知するエージェントを作成します。

## エージェント構成

```
[Scheduled: 毎朝9時]
        ↓
[Gmail: 重要顧客メール取得]
        ↓
[Gemini: 要約・優先度判定]
        ↓
[Chat: 通知送信]
        ↓
[Conditional: 緊急案件あり?]
    ├─ Yes → [Chat: アラート送信]
    └─ No → 終了
```

## デモで作成するエージェント

### エージェント名
```
見込み顧客メール要約エージェント
```

### Starter設定
```
Type: Scheduled
Frequency: Daily
Time: 9:00 AM
Timezone: Asia/Tokyo
```

### Step 1: Gmail検索
```
Action: Search emails
Query: newer_than:1d is:unread from:(@a-corp.co.jp OR @b-inc.com OR @c-group.jp)
Output variable: gmail_emails
```

### Step 2: Gemini要約
```
Action: Generate content
Input: {gmail_emails}
Prompt: [prompts.txt参照]
Output variable: gemini_summary
```

### Step 3: Chat通知
```
Action: Send message to space
Space: [通知先スペース]
Message:
📬 本日の見込み顧客メール要約

{gemini_summary}

---
対応漏れがないかご確認ください。
```

### Step 4: 条件分岐（オプション）
```
Type: Conditional
Condition: {gemini_summary} contains "HIGH"
True action: 追加Chat通知（アラート）
```

## 画面表示資料一覧

### 1. Studioアクセス画面（1:00）
- URL: studio.workspace.google.com
- Discoverページのテンプレート一覧

### 2. エージェント作成画面（1:30）
- 「Create」ボタン
- エージェント名入力欄

### 3. Starter設定画面（2:00）
- Scheduled選択
- Daily / 9:00 AM / Asia/Tokyo

### 4. Gmail Step設定（3:30）
- Search emails
- 検索クエリ入力欄
- 変数出力設定

### 5. Gemini Step設定（5:00）
- Generate content
- プロンプト入力欄
- 変数挿入UI

### 6. Chat Step設定（6:30）
- Send message to space
- スペース選択
- メッセージテンプレート

### 7. 条件分岐設定（7:30）
- Conditional
- contains条件
- True/False分岐

### 8. テスト実行（8:00）
- Testボタン
- 実行ログ
- 結果確認

## テスト用サンプルメール

### サンプル1：緊急案件
```
From: tanaka@a-corp.co.jp
Subject: 【至急】見積書の件
Body:
山田様
お世話になっております。
先日ご提案いただいた件について、至急見積書をお送りいただけますでしょうか。
来週月曜日の役員会議で検討予定のため、金曜日までにお願いできれば幸いです。
```

### サンプル2：通常案件
```
From: suzuki@b-inc.com
Subject: 製品資料のご送付お願い
Body:
ご担当者様
貴社製品に興味があり、詳細資料をお送りいただけますでしょうか。
導入検討の参考にさせていただきます。
```

### サンプル3：契約交渉
```
From: sato@c-group.jp
Subject: 契約条件のご相談
Body:
山田様
先日の打ち合わせありがとうございました。
契約条件について、いくつか確認させていただきたい点がございます。
お時間いただけますでしょうか。
```

## 期待される出力例

### Gemini要約結果
```
📋 本日の見込み顧客メール要約（3件）

1. 【送信者】田中様（株式会社A）
   【件名】【至急】見積書の件
   【要約】先日の提案について至急見積書を求められています。金曜日が期限で、来週月曜の役員会議で検討予定。
   【緊急度】HIGH
   【案件ステージ】見積もり
   【推奨アクション】本日中に見積書を作成・送付

2. 【送信者】佐藤様（Cグループ）
   【件名】契約条件のご相談
   【要約】先日の打ち合わせ後、契約条件について確認事項があるとのこと。
   【緊急度】MEDIUM
   【案件ステージ】契約交渉
   【推奨アクション】打ち合わせ日程を調整

3. 【送信者】鈴木様（B株式会社）
   【件名】製品資料のご送付お願い
   【要約】製品に興味を持っており、詳細資料を求められています。
   【緊急度】LOW
   【案件ステージ】問い合わせ
   【推奨アクション】製品資料PDFを送付
```

## 参考リンク

- [Google Workspace Studio 公式](https://workspace.google.com/studio/)
- [Gmail検索演算子](https://support.google.com/mail/answer/7190)
- [studio.workspace.google.com](https://studio.workspace.google.com)
