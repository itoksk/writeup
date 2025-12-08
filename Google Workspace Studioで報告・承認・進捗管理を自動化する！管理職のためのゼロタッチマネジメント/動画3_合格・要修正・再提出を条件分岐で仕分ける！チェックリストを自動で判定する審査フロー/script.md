# 第3回：合格・要修正・再提出を条件分岐で仕分ける！チェックリストを自動で判定する審査フロー

**動画時間**: 10分
**学習目標**: 提出物の品質をGeminiが自動チェックし、合格/要修正/再提出を自動判定するエージェントを作成する

---

## 1. 導入（0:00-1:30）

### 講師セリフ

「前回は、日報・週報の自動要約を作成しました。

今回は、**提出物の品質チェック**を自動化します。

**（画面：審査業務の課題）**

よくある審査業務の課題：

- 提出物の形式チェックに時間がかかる
- チェック基準が属人化している
- 差し戻しの連絡が遅れる
- 何度も同じ指摘をしている

今回作成するエージェントは、**チェックリストに基づいて自動判定**し、結果に応じて適切なアクションを実行します。

**（画面：判定フロー）**

```
提出物受信
    ↓
Geminiでチェック
    ↓
[合格] → 承認通知
[要修正] → 修正依頼（軽微な指摘）
[再提出] → 再提出依頼（重大な不備）
```」

---

## 2. チェックリストの設計（1:30-3:00）

### 講師セリフ

「まず、チェックリストを設計します。

**（画面：チェックリスト例）**

### 日報チェックリスト例

| 項目 | 必須 | チェック内容 |
|------|------|-------------|
| 業務内容 | ○ | 具体的な作業が記載されているか |
| 進捗状況 | ○ | 数値や達成率が含まれているか |
| 課題 | △ | 課題がある場合に記載されているか |
| 翌日予定 | ○ | 翌日の計画が記載されているか |
| 文字数 | ○ | 最低100文字以上か |

### 判定基準

**（画面：判定基準）**

| 判定 | 条件 |
|------|------|
| 合格 | 全必須項目OK、軽微な指摘0〜1件 |
| 要修正 | 必須項目OK、軽微な指摘2件以上 |
| 再提出 | 必須項目に不備あり |」

---

## 3. エージェント作成（3:00-7:00）

### 講師セリフ

「それでは、エージェントを作成します。

**（画面：Studio画面）**

### Step 1: 新規エージェント作成

- Name: **Quality Check Agent**
- Description: Automatically checks submission quality and routes to appropriate action

### Step 2: トリガー設定

- Trigger Type: **Gmail**
- Condition: Subject contains 「提出」「報告」
- または **Forms** 送信時

### Step 3: Geminiチェックプロンプト

**（画面：プロンプト設定）**

```
You are a quality control assistant checking submissions against a checklist.

Submission content:
---
{submission_content}
---

Checklist:
1. 業務内容: 具体的な作業が記載されているか (Required)
2. 進捗状況: 数値や達成率が含まれているか (Required)
3. 課題: 課題がある場合に記載されているか (Optional)
4. 翌日予定: 翌日の計画が記載されているか (Required)
5. 文字数: 最低100文字以上か (Required)

For each item, output:
- Status: OK / NG / N/A
- Comment (if NG): specific issue found

Then provide overall judgment:
- APPROVED: All required items OK, minor issues 0-1
- NEEDS_REVISION: All required items OK, minor issues 2+
- RESUBMIT: Any required item NG

Output format:
---
CHECKLIST_RESULT:
1. 業務内容: [OK/NG] - [comment if NG]
2. 進捗状況: [OK/NG] - [comment if NG]
3. 課題: [OK/NG/N/A] - [comment if NG]
4. 翌日予定: [OK/NG] - [comment if NG]
5. 文字数: [OK/NG] - [comment if NG]

JUDGMENT: [APPROVED/NEEDS_REVISION/RESUBMIT]
FEEDBACK: [具体的なフィードバック（日本語）]
---
```

### Step 4: 条件分岐設定

**（画面：条件分岐）**

```
IF JUDGMENT == "APPROVED":
    → Send approval notification (Gmail)
    → Update status to "承認済" (Sheets)
    → Notify manager (Chat)

ELSE IF JUDGMENT == "NEEDS_REVISION":
    → Send revision request (Gmail)
    → Update status to "要修正" (Sheets)
    → Include specific feedback

ELSE IF JUDGMENT == "RESUBMIT":
    → Send resubmit request (Gmail)
    → Update status to "再提出" (Sheets)
    → Flag for manager attention (Chat)
```

### Step 5: メールテンプレート設定

**（画面：メールテンプレート）**

#### 合格通知

```
件名：【承認】{submission_type}が承認されました

{submitter_name}さん

提出いただいた{submission_type}を確認し、承認しました。

{feedback}

お疲れ様でした。
```

#### 要修正通知

```
件名：【要修正】{submission_type}の修正をお願いします

{submitter_name}さん

提出いただいた{submission_type}を確認しました。
以下の点について修正をお願いします。

■ 修正点
{revision_points}

修正後、再度提出をお願いします。
```

#### 再提出通知

```
件名：【再提出】{submission_type}の再提出をお願いします

{submitter_name}さん

提出いただいた{submission_type}を確認しましたが、
必須項目に不備があるため、再提出をお願いします。

■ 不備内容
{issues}

内容を確認の上、再度提出をお願いします。
```」

---

## 4. 実践的な活用例（7:00-8:30）

### 講師セリフ

「このエージェントの活用シーンを見てみましょう。

**（画面：活用例）**

### 活用例1: 日報・週報の品質管理

- 記載漏れを自動検知
- 形式の統一を促進
- チェック時間を大幅削減

### 活用例2: 申請書類の事前チェック

- 経費申請の添付漏れ検知
- 稟議書の必須項目チェック
- 承認前の形式確認

### 活用例3: 報告書の品質向上

- テンプレートに沿っているか確認
- 数値データの有無をチェック
- 結論・考察の記載確認

### カスタマイズポイント

- チェックリストは業務に合わせてカスタマイズ
- 判定基準の厳しさを調整可能
- 特定の提出者には緩い基準を適用など」

---

## 5. テストと確認（8:30-9:30）

### 講師セリフ

「エージェントをテストします。

**（画面：テスト実行）**

### テストケース

1. **合格ケース**: 全項目記載済みの完璧な提出物
2. **要修正ケース**: 数値が曖昧、具体性に欠ける
3. **再提出ケース**: 必須項目が未記載

### 確認ポイント

- 判定が正しく行われるか
- フィードバックが具体的か
- メール送信先が正しいか
- Sheets更新が正しいか」

---

## 6. まとめ・次回予告（9:30-10:00）

### 講師セリフ

「今日のポイントを振り返りましょう。

**（画面：ポイントまとめ）**

### 今日のポイント

1. **チェックリストベースの自動判定**を実装
2. **3段階の判定**（合格/要修正/再提出）で適切に分岐
3. **具体的なフィードバック**を自動生成
4. **ステータス管理**をSheetsで自動化

### 達成した効果

- チェック業務時間: **90%削減**
- 判定基準: **統一化**
- 差し戻し連絡: **即時自動送信**

### 次回予告

**（画面：次回予告）**

次回は「**Driveとスプレッドシートを連携する！進捗ダッシュボードが自動で更新される仕組み**」を作成します。

チームの進捗状況をリアルタイムで可視化するダッシュボードを構築します。」
