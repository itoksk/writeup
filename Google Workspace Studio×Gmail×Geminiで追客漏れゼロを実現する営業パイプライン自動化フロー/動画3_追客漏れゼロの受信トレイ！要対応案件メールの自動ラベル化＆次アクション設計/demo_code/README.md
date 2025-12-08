# 第3回：追客漏れゼロエージェント - デモファイル

## 概要

メール受信時にリアルタイムで起動し、要対応案件を自動でラベル付け、次アクションをGeminiが提案するエージェントを作成します。

## エージェント構成

```
[Gmail: メール受信]
        ↓
[Gemini: 要対応判定・分析]
        ↓
[Conditional: 要対応?]
    ├─ YES
    │   ├─ [Gmail: ラベル付与]
    │   └─ [Chat: 通知送信]
    │       ↓
    │   [Conditional: 緊急?]
    │       ├─ HIGH → [Chat: アラート]
    │       └─ その他 → 終了
    └─ NO → 終了
```

## デモで作成するエージェント

### エージェント名
```
追客漏れゼロエージェント
```

### Starter設定
```
Type: Gmail - Email received
Filter: from:(@a-corp.co.jp OR @b-inc.com OR @c-group.jp)
```

### Step 1: Gemini分析
```
Action: Generate content
Input: {email_content}
Prompt: [prompts.txt参照]
Output variable: gemini_analysis
```

### Step 2: 条件分岐
```
Type: Conditional
Condition: {gemini_analysis} contains "YES"
```

### Step 2a（True）: ラベル付与
```
Action: Gmail - Add label
Email: {trigger_email}
Label: 要対応
```

### Step 2b（True）: Chat通知
```
Action: Google Chat - Send message
Space: [通知先スペース]
Message: [prompts.txt参照]
```

## 画面表示資料一覧

### 1. 追客漏れのイメージ（0:30）
- 返信を忘れて失注した案件のイメージ
- 「あ、返信するの忘れてた...」

### 2. 自動ラベル付けのイメージ（0:50）
- Gmailに「要対応」ラベルが付いた状態
- 一目で対応すべきメールがわかる

### 3. エージェントフロー図（1:00）
```
[メール受信] → [Gemini分析] → [条件分岐] → [ラベル] → [通知]
```

### 4. Starter選択画面（2:30）
- 「Gmail - Email received」を選択
- フィルター設定

### 5. Geminiプロンプト入力（3:30）
- 要対応判定プロンプト
- 変数挿入

### 6. 条件分岐設定（5:00）
- Conditionalの設定
- contains条件

### 7. ラベル付与設定（5:30）
- Gmail Add label
- ラベル名入力

### 8. Chat通知設定（7:00）
- メッセージテンプレート
- 変数展開

### 9. テスト実行（8:00）
- サンプルメールでテスト
- 結果確認

### 10. Gmail確認画面（8:30）
- ラベルが付与されたメール
- フィルター検索

## テスト用サンプルメール

### サンプル1：要対応YES（緊急HIGH）
```
From: tanaka@a-corp.co.jp
Subject: 【至急】契約書の最終確認
Body:
山田様

お世話になっております。
契約書の最終版を本日中にご確認いただけますでしょうか。
明日の取締役会で承認を取る予定です。

何卒よろしくお願いいたします。
```

期待される出力:
```
【要対応判定】YES
【理由】本日中の確認依頼、明日の取締役会向け
【緊急度】HIGH
【案件ステージ】契約交渉
【次アクション】契約書を確認し、問題なければ承認の旨を返信
【対応期限】本日中
【返信ドラフト】承知しました。本日中に確認し、ご連絡いたします。
```

### サンプル2：要対応YES（通常MEDIUM）
```
From: suzuki@b-inc.com
Subject: 追加提案のお願い
Body:
山田様

先日の提案ありがとうございました。
社内で検討した結果、追加でオプションAについてもご提案いただけないでしょうか。
来週中にいただければ幸いです。
```

期待される出力:
```
【要対応判定】YES
【理由】追加提案の依頼
【緊急度】MEDIUM
【案件ステージ】提案中
【次アクション】オプションAの提案資料を作成し送付
【対応期限】来週中
【返信ドラフト】承知しました。オプションAについて来週中にご提案いたします。
```

### サンプル3：要対応NO
```
From: info@c-group.jp
Subject: 【ご報告】組織変更のお知らせ
Body:
関係者各位

いつもお世話になっております。
4月1日付で組織変更がございますので、お知らせいたします。
詳細は添付資料をご確認ください。

※本メールへの返信は不要です。
```

期待される出力:
```
【要対応判定】NO
【理由】情報共有のみ、返信不要と明記
【緊急度】LOW
【案件ステージ】-
【次アクション】添付資料を確認し、必要に応じて連絡先を更新
【対応期限】-
【返信ドラフト】-
```

## ラベル設定

### 事前準備：Gmailでラベル作成
1. Gmail設定 → ラベル → 新しいラベルを作成
2. ラベル名：「要対応」
3. 色：赤またはオレンジ推奨

### フィルター併用（オプション）
Gmailのフィルター機能と組み合わせることで、より柔軟な運用が可能です。

## 参考リンク

- [Gmail ラベルの管理](https://support.google.com/mail/answer/118708)
- [Gmail 検索演算子](https://support.google.com/mail/answer/7190)
- [Google Workspace Studio 公式](https://workspace.google.com/studio/)
