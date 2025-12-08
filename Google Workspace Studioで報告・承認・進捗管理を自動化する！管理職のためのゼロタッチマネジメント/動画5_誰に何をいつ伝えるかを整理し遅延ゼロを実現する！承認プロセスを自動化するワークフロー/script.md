# 第5回：誰に何をいつ伝えるかを整理し遅延ゼロを実現する！承認プロセスを自動化するワークフロー

**動画時間**: 10分
**学習目標**: 稟議・申請の承認フローを自動化し、ゼロタッチマネジメントを完成させる

---

## 1. 導入（0:00-1:30）

### 講師セリフ

「いよいよ最終回です。これまでの4回で、以下を自動化しました。

**（画面：これまでの振り返り）**

- 第1回: 日報・週報提出依頼の自動化
- 第2回: 日報・週報の自動要約
- 第3回: 品質チェックの自動判定
- 第4回: 進捗ダッシュボードの自動更新

今回は、**承認プロセスの自動化**を実装し、ゼロタッチマネジメントを完成させます。

**（画面：承認プロセスの課題）**

よくある課題：
- 承認依頼に気づかず放置
- 誰に承認を求めるか不明確
- 承認待ち状況が把握できない
- 差し戻し後のフォローが抜ける」

---

## 2. 承認フローの設計（1:30-3:00）

### 講師セリフ

「承認フローの全体像を設計します。

**（画面：承認フロー図）**

### 承認フローの構成

```
申請受付
    ↓
申請内容の自動分類（金額・種類）
    ↓
承認者の自動決定
    ↓
承認依頼の自動送信
    ↓
承認待ち監視
    ↓
[承認] → 申請者に通知、次のステップへ
[差し戻し] → 修正依頼、再申請待ち
[却下] → 却下通知
```

### 承認ルールの定義

**（画面：承認ルール表）**

| 申請種類 | 金額 | 承認者 |
|---------|------|--------|
| 経費申請 | 〜5万円 | 直属上長 |
| 経費申請 | 5万円〜 | 部門長 |
| 稟議 | 全て | 部門長 → 経営層 |
| 休暇申請 | 全て | 直属上長 |」

---

## 3. エージェント作成（3:00-7:00）

### 講師セリフ

「承認フローのエージェントを作成します。

**（画面：Studio画面）**

### Step 1: 申請受付エージェント

- Name: **Approval Request Agent**
- Trigger: Gmail（件名に「申請」「稟議」を含む）またはForms送信

**プロンプト**:

```
You are an approval workflow assistant.

Request content:
---
{request_content}
---

Analyze and extract:
1. Request type: 経費申請 / 稟議 / 休暇申請 / その他
2. Amount (if applicable): {amount} JPY
3. Requester: {name}
4. Department: {department}
5. Summary: (one sentence)
6. Urgency: 通常 / 急ぎ / 緊急

Determine approver based on rules:
- 経費 < 50,000: Direct manager
- 経費 >= 50,000: Department head
- 稟議: Department head, then Executive
- 休暇: Direct manager

Output:
---
REQUEST_TYPE: {type}
AMOUNT: {amount}
REQUESTER: {name}
DEPARTMENT: {department}
SUMMARY: {summary}
URGENCY: {urgency}
APPROVER: {approver_name} ({approver_email})
NEXT_APPROVER: {if multi-level approval}
---
```

### Step 2: 承認依頼送信

**（画面：承認依頼設定）**

```
Send approval request:
- To: {approver_email}
- CC: {requester_email}
- Subject: 【承認依頼】{request_type} - {requester}
- Body: {approval_request_template}
- Include: One-click approval buttons (if supported)
```

**承認依頼テンプレート**:

```
{approver}さん

以下の申請について、承認をお願いいたします。

■ 申請内容
・種類: {request_type}
・申請者: {requester}
・金額: {amount}円
・概要: {summary}

■ 詳細
{request_detail}

■ 対応
下記リンクより承認・差し戻し・却下を選択してください。
{approval_link}

期限: {deadline}

よろしくお願いいたします。
```

### Step 3: 承認待ち監視エージェント

**（画面：監視エージェント設定）**

- Name: **Approval Monitor Agent**
- Trigger: Schedule（毎日10:00, 15:00）

**処理内容**:

1. 承認待ちリストを取得
2. 48時間以上未処理の案件を検出
3. 承認者にリマインド送信
4. 72時間以上なら上位者にエスカレーション

```
Check pending approvals from Sheets.

For each pending item:
- If pending > 48 hours: Send reminder to approver
- If pending > 72 hours: Escalate to approver's manager
- If urgent and pending > 24 hours: Send reminder

Output list of actions taken.
```

### Step 4: 承認結果処理

**（画面：結果処理設定）**

承認者の回答に応じて自動処理：

```
IF approval_status == "APPROVED":
    - Notify requester (承認完了)
    - Update status in Sheets
    - IF has_next_approver:
        - Send to next approver
    - ELSE:
        - Process completion actions

ELSE IF approval_status == "RETURNED":
    - Notify requester (差し戻し)
    - Include revision points
    - Update status to "要修正"

ELSE IF approval_status == "REJECTED":
    - Notify requester (却下)
    - Include rejection reason
    - Update status to "却下"
```」

---

## 4. 統合と運用ルール（7:00-8:30）

### 講師セリフ

「作成したエージェントを統合し、運用ルールを設定します。

**（画面：統合アーキテクチャ）**

### エージェント一覧

| エージェント | トリガー | 役割 |
|-------------|---------|------|
| Daily Report Request | Schedule 17:00 | 提出依頼 |
| Report Summary | Gmail受信 | 要約生成 |
| Quality Check | Gmail受信 | 品質判定 |
| Submission Check | Schedule 20:00 | 未提出検知 |
| Dashboard Update | Schedule 21:00 | ダッシュボード更新 |
| Approval Request | Gmail/Forms | 承認依頼 |
| Approval Monitor | Schedule 10:00, 15:00 | 承認監視 |

### 運用ルール

**（画面：運用ルール）**

1. **命名規則の統一**
   - 申請メール件名: 「【申請】{種類}_{申請者名}」
   - 承認依頼件名: 「【承認依頼】{種類}_{申請者名}」

2. **エスカレーションルール**
   - 48時間: 承認者にリマインド
   - 72時間: 上位者にエスカレーション
   - 緊急案件: 24時間でリマインド

3. **例外処理**
   - 承認者不在: 代理承認者を設定
   - システムエラー: 管理者にアラート」

---

## 5. コース全体の振り返り（8:30-9:30）

### 講師セリフ

「5回にわたるコースを振り返りましょう。

**（画面：コース成果）**

### 作成したエージェント

1. **Daily Report Request**: 日報・週報提出依頼
2. **Report Summary**: 日報・週報の自動要約
3. **Quality Check**: 品質チェック自動判定
4. **Submission Check**: 未提出検知・アラート
5. **Dashboard Update**: ダッシュボード自動更新
6. **Weekly Summary**: 週次サマリー生成
7. **Approval Request**: 承認依頼自動化
8. **Approval Monitor**: 承認待ち監視

### 達成した効果

**（画面：Before/After）**

| 項目 | Before | After |
|------|--------|-------|
| 提出依頼 | 手動送信 | 自動送信 |
| 日報確認 | 60分/日 | 12分/日 |
| 品質チェック | 手動 | 自動判定 |
| 進捗把握 | 週1回 | リアルタイム |
| 承認依頼 | 手動送信 | 自動送信 |
| 承認監視 | なし | 自動リマインド |

### 削減効果

- 管理業務時間: **70%削減**
- 連絡漏れ: **ほぼゼロ**
- 承認遅延: **大幅減少**」

---

## 6. まとめ・今後の展開（9:30-10:00）

### 講師セリフ

「お疲れ様でした！ゼロタッチマネジメントの構築が完了しました。

**（画面：ポイントまとめ）**

### 今日のポイント

1. 申請内容を自動分類し、承認者を自動決定
2. 承認依頼を自動送信
3. 承認待ちを監視してリマインド・エスカレーション
4. 結果に応じた自動処理

### 今後の展開

このフローはさらに拡張できます：

- **AIによる承認判断サポート**: 過去の承認傾向から推奨を提示
- **予算管理との連携**: 経費申請と予算残高を自動照合
- **モバイル承認**: Chatから直接承認操作

**（画面：コース完了）**

ぜひ、自社の業務に合わせてカスタマイズし、ゼロタッチマネジメントを実現してください。

5回にわたるコース、ありがとうございました！」
