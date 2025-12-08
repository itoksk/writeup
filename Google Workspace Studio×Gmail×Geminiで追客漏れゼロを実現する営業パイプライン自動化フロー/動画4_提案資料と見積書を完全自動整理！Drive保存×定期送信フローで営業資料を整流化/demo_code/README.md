# 第4回：営業資料自動整理エージェント - デモファイル

## 概要

メールの添付ファイルを自動でDriveに保存し、案件ごとのフォルダに整理。週次で資料一覧レポートを送信するエージェントを作成します。

## エージェント構成

### エージェント1：添付ファイル自動保存

```
[Gmail: メール受信（添付あり）]
        ↓
[Gemini: 資料分類]
        ↓
[Drive: ファイル保存]
        ↓
[Chat: 保存完了通知]
```

### エージェント2：週次レポート

```
[Scheduled: 毎週月曜9時]
        ↓
[Drive: ファイル一覧取得]
        ↓
[Gemini: レポート作成]
        ↓
[Chat: レポート送信]
```

## デモで作成するエージェント

### エージェント1：営業資料自動整理エージェント

#### Starter設定
```
Type: Gmail - Email received
Filter: has:attachment from:(@a-corp.co.jp OR @b-inc.com)
```

#### Step 1: Gemini分類
```
Action: Generate content
Prompt: [prompts.txt参照]
Output variable: gemini_classification
```

#### Step 2: Drive保存
```
Action: Upload file
File: {email_attachments}
Folder: 営業資料/{顧客名}/{案件名}/{資料タイプ}
Filename: {YYYY-MM-DD}_{顧客名}_{資料タイプ}.{ext}
```

#### Step 3: Chat通知
```
Action: Send message
Message: [prompts.txt参照]
```

### エージェント2：営業資料週次レポート

#### Starter設定
```
Type: Scheduled
Frequency: Weekly
Day: Monday
Time: 9:00 AM
Timezone: Asia/Tokyo
```

#### Step 1: Drive一覧取得
```
Action: List files
Folder: 営業資料/
Modified: Last 7 days
Include subfolders: Yes
Output variable: drive_files
```

#### Step 2: Geminiレポート
```
Action: Generate content
Prompt: [prompts.txt参照]
Input: {drive_files}
Output variable: gemini_report
```

#### Step 3: Chat送信
```
Action: Send message
Message: [prompts.txt参照]
```

## 画面表示資料一覧

### 1. 散らかったDriveのイメージ（0:30）
- ファイルがバラバラに保存されている状態
- 「あの資料どこだっけ？」

### 2. 整理されたDrive（0:50）
- フォルダ構造化されている状態
- 顧客別・案件別・資料タイプ別

### 3. エージェントフロー図（1:00）
- 2つのフローを並列表示

### 4. フォルダ構造例（4:45）
```
営業資料/
├── 株式会社A/
│   ├── Aプロジェクト/
│   │   ├── 提案書/
│   │   └── 見積書/
```

### 5. Starter設定（has:attachment）（2:30）
- フィルター設定画面

### 6. Gemini分類プロンプト（3:30）
- プロンプト入力画面

### 7. Drive保存設定（4:30）
- Upload file設定

### 8. Scheduled設定（週次）（5:45）
- Weekly / Monday / 9:00 AM

### 9. テスト実行（8:00）
- 両エージェントのテスト

### 10. Drive確認画面（8:30）
- ファイルが正しく保存されている様子

## 推奨フォルダ構造

### 事前準備：Driveでフォルダ作成

```
営業資料/
├── 株式会社A/
│   ├── Aプロジェクト/
│   │   ├── 提案書/
│   │   ├── 見積書/
│   │   ├── 契約書/
│   │   └── その他/
│   └── 一般/
├── 株式会社B/
├── 株式会社C/
└── 未分類/
```

### ファイル命名規則

```
{YYYY-MM-DD}_{顧客名}_{資料タイプ}.{拡張子}

例:
- 2025-01-15_A社_提案書.pdf
- 2025-01-20_B社_見積書.xlsx
- 2025-01-22_C社_契約書.pdf
```

## テスト用サンプルメール

### サンプル1：見積書
```
From: tanaka@a-corp.co.jp
Subject: 御見積書送付の件
Body:
山田様
お世話になっております。
ご依頼いただいておりました見積書を送付いたします。
ご確認のほどよろしくお願いいたします。
Attachment: 見積書_20250115.pdf
```

期待される分類結果:
```
【資料タイプ】見積書
【顧客名】株式会社A（または田中様）
【案件名】（メール内容から推定）
【保存フォルダ】株式会社A/一般/見積書
【ファイル名】2025-01-15_A社_見積書.pdf
【重要度】高
```

### サンプル2：提案書
```
From: suzuki@b-inc.com
Subject: 【B社様】新システム提案書のご送付
Body:
山田様
先日のお打ち合わせありがとうございました。
ご検討いただいている新システムの提案書を送付いたします。
ご不明点がございましたらお気軽にお問い合わせください。
Attachment: B社様_新システム提案書_v1.pptx
```

期待される分類結果:
```
【資料タイプ】提案書
【顧客名】B社（株式会社B）
【案件名】新システム
【保存フォルダ】株式会社B/新システム/提案書
【ファイル名】2025-01-20_B社_提案書.pptx
【重要度】中
```

## 期待される週次レポート例

```
📊 今週の営業資料レポート（1/13〜1/19）

【新規追加ファイル】
- 2025-01-15_A社_見積書.pdf（株式会社A、見積書）
- 2025-01-18_B社_提案書.pptx（株式会社B、提案書）
- 2025-01-19_C社_契約書.pdf（株式会社C、契約書）

【更新されたファイル】
- 2025-01-17_A社_提案書_v2.pptx（株式会社A、提案書）

【統計サマリー】
- 提案書: 2件
- 見積書: 1件
- 契約書: 1件
- 合計: 4件

【注目案件】
資料の動きが活発な顧客:
1. 株式会社A（2件）
2. 株式会社B（1件）
3. 株式会社C（1件）
```

## 参考リンク

- [Google Drive API](https://developers.google.com/drive)
- [Gmail 添付ファイル検索](https://support.google.com/mail/answer/7190)
- [Google Workspace Studio 公式](https://workspace.google.com/studio/)
