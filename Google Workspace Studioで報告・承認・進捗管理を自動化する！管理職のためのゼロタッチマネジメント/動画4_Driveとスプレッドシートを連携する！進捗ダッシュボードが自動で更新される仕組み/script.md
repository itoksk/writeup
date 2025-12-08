# 第4回：Driveとスプレッドシートを連携する！進捗ダッシュボードが自動で更新される仕組み

**動画時間**: 10分
**学習目標**: チームの進捗状況をリアルタイムで可視化するダッシュボードを自動更新するエージェントを作成する

---

## 1. 導入（0:00-1:30）

### 講師セリフ

「これまでの3回で、提出依頼、要約、品質チェックを自動化しました。

でも、**チーム全体の進捗**はどう把握していますか？

**（画面：よくある進捗把握の課題）**

- 各メンバーの状況を個別に確認している
- 遅延に気づくのが遅い
- 週次ミーティングまで状況がわからない
- ダッシュボードの更新が手作業

今回は、**進捗ダッシュボードの自動更新**を実装します。

**（画面：完成イメージ）**

- 日報・週報の提出状況がリアルタイムで更新
- 未提出者が一目でわかる
- 遅延アラートが自動発報
- DriveとSheetsが連携」

---

## 2. ダッシュボード設計（1:30-3:00）

### 講師セリフ

「ダッシュボードの設計を確認します。

**（画面：ダッシュボード構成）**

### ダッシュボードの構成要素

| セクション | 内容 |
|-----------|------|
| 提出状況 | 日報・週報の提出率 |
| 個人別ステータス | メンバーごとの提出状況 |
| 遅延アラート | 未提出・遅延者リスト |
| 週次サマリー | 今週の提出統計 |

### データソース

**（画面：データフロー図）**

```
Gmail（日報・週報受信）
    ↓
Sheets（提出ログ）
    ↓
ダッシュボードシート（自動集計）
    ↓
Chat（アラート通知）
```」

---

## 3. 提出ログシートの設計（3:00-4:30）

### 講師セリフ

「まず、提出ログを記録するシートを設計します。

**（画面：シート構成）**

### 提出ログシート

| 列 | 内容 | 例 |
|----|------|-----|
| A | 日付 | 2024/01/15 |
| B | 提出者 | 山田太郎 |
| C | 種類 | 日報 / 週報 |
| D | 提出時刻 | 17:30 |
| E | ステータス | 提出済 / 遅延提出 |
| F | 品質判定 | 合格 / 要修正 / 再提出 |

### メンバーマスタシート

| 列 | 内容 |
|----|------|
| A | メンバー名 |
| B | メールアドレス |
| C | 部署 |
| D | 上長 |」

---

## 4. エージェント作成（4:30-7:30）

### 講師セリフ

「それでは、エージェントを作成します。

**（画面：Studio画面）**

### Step 1: 提出ログ記録エージェント

前回作成したReport Summary Agentを拡張します。

**追加アクション**: Sheets書き込み

```
When email received (日報/週報):
1. Parse email metadata
2. Check submission time vs deadline (17:00)
3. Write to Sheets:
   - Date: {email_date}
   - Submitter: {sender_name}
   - Type: {report_type}
   - Time: {submission_time}
   - Status: {on_time or late}
```

### Step 2: 未提出検知エージェント

**（画面：新規エージェント作成）**

- Name: **Submission Check Agent**
- Description: Detects missing submissions and sends alerts

**トリガー**: Schedule（毎日20:00）

**プロンプト**:

```
You are checking daily report submissions.

Member list:
{member_list}

Today's submissions from log:
{today_submissions}

Identify:
1. Members who have NOT submitted today's report
2. Members who submitted LATE (after 17:00)

Output format:
---
MISSING_SUBMISSIONS:
- {member_name} ({email})

LATE_SUBMISSIONS:
- {member_name} - submitted at {time}

SUMMARY:
- Total members: {count}
- Submitted: {count}
- Missing: {count}
- Late: {count}
- Submission rate: {percentage}%
---
Output in Japanese.
```

### Step 3: ダッシュボード更新エージェント

**（画面：ダッシュボード更新設定）**

- Name: **Dashboard Update Agent**
- Trigger: Schedule（毎日21:00）

**処理内容**:

1. 提出ログから今日のデータを集計
2. ダッシュボードシートを更新
3. 異常値があればChat通知

```
Update Dashboard Sheet:
- Cell B2: Today's submission count
- Cell B3: Today's submission rate
- Cell B4: Missing count
- Cell B5: Late count
- Range A8:D20: Individual status table
```

### Step 4: 週次サマリー生成

**（画面：週次サマリー設定）**

金曜日に週次サマリーを自動生成

```
You are generating a weekly submission summary.

This week's data:
{weekly_submission_log}

Generate a summary including:
1. 週次提出率（日報・週報別）
2. 提出率ランキング（上位3名）
3. 要フォロー（提出率80%未満）
4. 前週との比較
5. 改善提案（if any）

Output in Japanese, formatted for Chat message.
```」

---

## 5. Drive連携の設定（7:30-8:30）

### 講師セリフ

「DriveとSheetsの連携を設定します。

**（画面：Drive連携設定）**

### 添付ファイルの自動保存

日報・週報に添付ファイルがある場合、Driveに自動保存

```
When email has attachment:
1. Create folder: 日報週報/{year}/{month}
2. Save attachment with name: {date}_{submitter}_{filename}
3. Add Drive link to Sheets log
```

### ダッシュボードの共有設定

- 管理者: 編集権限
- チームメンバー: 閲覧権限
- 自動更新を有効化」

---

## 6. まとめ・次回予告（8:30-10:00）

### 講師セリフ

「今日のポイントを振り返りましょう。

**（画面：ポイントまとめ）**

### 今日のポイント

1. **提出ログをSheetsで一元管理**
2. **未提出者を自動検知してアラート**
3. **ダッシュボードを定時自動更新**
4. **週次サマリーを自動生成**
5. **DriveとSheetsを連携**

### 達成した効果

- 進捗把握: **リアルタイム**
- 遅延検知: **当日中に自動アラート**
- 集計作業: **完全自動化**

### 次回予告（最終回）

**（画面：次回予告）**

次回は「**誰に何をいつ伝えるかを整理し遅延ゼロを実現する！承認プロセスを自動化するワークフロー**」を作成します。

稟議・申請の承認フローを自動化し、ゼロタッチマネジメントを完成させます。」
