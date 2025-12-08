# 第3回：面接後作業をゼロにする！要約＆評価ポイントをGmail・Chatへ自動送信するフローを作る

**動画時間**: 10分
**学習目標**: 面接終了を検知し、Geminiが評価ポイントを整理、Gmail・Chatで関係者へ自動共有するエージェントを作成する

---

## 1. 導入（0:00-1:00）

### 講師セリフ

「前回は、面接前準備の自動化を学びました。今回は、**面接後の作業**を自動化します。

面接官の皆さん、面接後にこんなタスクが待っていませんか？
- 評価シートの記入依頼メール作成
- 面接メモの整理
- 採用チームへの結果共有
- 次の選考ステップの調整依頼

**（画面：面接後のタスク一覧）**

これらの作業、面接1件につき**20〜30分**かかっていませんか？今回作成するエージェントで、これを**ほぼゼロ**にします。」

---

## 2. エージェントの設計（1:00-2:30）

### 講師セリフ

「今回作成するエージェントの設計を見ていきましょう。

**（画面：エージェント設計図）**

### スターター（トリガー）

**Calendar Event Trigger**を使用します。
- 面接イベントの終了時に起動
- イベントタイトルに「面接」を含むものを検知

### ステップ

**Step 1**: Calendar イベント終了を検知
**Step 2**: 面接官にGmailで評価シート記入依頼を送信
**Step 3**: 評価シートが記入されたら、Geminiで要約
**Step 4**: 採用チームにChatで結果を共有
**Step 5**: 次のステップ提案を生成

### 変数

- {interview_end_time}: 面接終了時刻
- {interviewer}: 面接官
- {candidate_name}: 候補者名
- {feedback_summary}: フィードバック要約
- {next_step_recommendation}: 次ステップ提案」

---

## 3. Studio でエージェント作成（2:30-5:30）

### 講師セリフ

「では、Studioでエージェントを作成していきます。

**（画面：Studio画面）**

### Step 1: 新規エージェント作成

**Name**: Post-Interview Workflow
**Description**: Automates post-interview tasks including feedback collection and team notification

### Step 2: Calendar イベントトリガー設定

『Add starter』から『Calendar event ends』を選択。

**設定内容**：
- Event filter: Title contains '面接'
- Calendar: Primary calendar

### Step 3: Gmail 評価依頼送信

面接終了直後に、面接官へ評価シート記入依頼を送信。

**（画面：Gmail設定画面）**

**メールテンプレート**：

```
件名：【評価シート記入依頼】{candidate_name}さん面接

{interviewer}さん

お疲れ様です。
先ほどの {candidate_name}さんの面接、ありがとうございました。

評価シートへの記入をお願いいたします。
記入期限：{deadline}（面接翌日17時）

■ 評価シートリンク
{evaluation_sheet_link}

ご不明点があればお知らせください。
```

### Step 4: フォーム回答トリガー

評価シートが記入されたら次のステップを実行。

**設定**：
- Trigger: Form response received
- Form: 面接評価シート

### Step 5: Gemini 要約

記入された評価をGeminiで要約します。

**（画面：プロンプト設定画面）**」

---

## 4. Gemini プロンプト設定（5:30-7:00）

### 講師セリフ

「評価フィードバックを要約するプロンプトを設定します。

**（画面：プロンプト表示）**

```
You are an HR coordinator summarizing interview feedback.

Interview details:
- Candidate: {candidate_name}
- Position: {position}
- Interviewer: {interviewer_name}
- Date: {interview_date}

Evaluation form responses:
{form_responses}

Please organize:
1. Overall impression (Positive/Neutral/Negative)
2. Key strengths identified (3 bullets max)
3. Areas of concern (if any)
4. Recommended next step: Proceed to next round / Hold / Decline
5. Summary for hiring manager (2-3 sentences)

Output in Japanese.
```

### Chat通知設定

**（画面：Chat設定画面）**

採用チームスペースに結果を通知します。

**メッセージテンプレート**：

```
【面接結果速報】

■ 候補者: {candidate_name}
■ ポジション: {position}
■ 面接官: {interviewer_name}
■ 面接日: {interview_date}

■ 総合評価: {overall_impression}

■ 評価サマリー
{feedback_summary}

■ 推奨次ステップ: {next_step_recommendation}

詳細は評価シートをご確認ください：
{evaluation_sheet_link}
```」

---

## 5. 次ステップ提案の自動化（7:00-8:30）

### 講師セリフ

「さらに、次のステップを自動で提案する機能を追加します。

**（画面：条件分岐設定）**

### 条件分岐の設定

**IF** 推奨が「Proceed」の場合：
- 次の面接官にCalendar招待を自動作成
- 候補者に次ステップの案内メール下書きを作成

**IF** 推奨が「Hold」の場合：
- 採用マネージャーに判断依頼通知を送信

**IF** 推奨が「Decline」の場合：
- お見送りメールの下書きを作成
- ただし送信は人間が確認

**（画面：フロー完成図）**

### ポイント

重要なのは、**最終判断は人間が行う**こと。エージェントはあくまで「準備」と「提案」を行い、送信は人間が確認してから行うよう設計します。」

---

## 6. 実運用のポイント（8:30-9:30）

### 講師セリフ

「実運用のポイントを確認しましょう。

**（画面：運用ポイント）**

### ポイント1：評価シートの標準化

Geminiが正確に解析できるよう、評価シートの項目を統一しておきます。

**推奨項目**：
- 総合評価（5段階）
- スキル評価（5段階）
- カルチャーフィット（5段階）
- 強み（自由記述）
- 懸念点（自由記述）
- 推奨アクション（選択式）

### ポイント2：記入期限の設定

面接翌日17時を期限とし、未記入の場合はリマインドを送信（第4回で設定）。

### ポイント3：プライバシー配慮

評価内容は採用チーム内のみで共有。Chatスペースへのアクセス権限を適切に設定しておきましょう。」

---

## 7. まとめ・次回予告（9:30-10:00）

### 講師セリフ

「今日は、面接後作業を自動化するエージェントを作成しました。

### 今日のポイント

**（画面：ポイントまとめ）**

1. **Calendar Event Trigger**で面接終了を検知
2. **Gmail**で評価シート記入依頼を自動送信
3. **Forms連携**で記入完了を検知
4. **Gemini**で評価を要約・次ステップを提案
5. **Chat**で採用チームに結果を共有
6. 最終判断は人間が行う設計

これで面接官は面接に集中でき、面接後の事務作業から解放されます。

次回は、**リマインドの自動化**に取り組みます。面接リマインド、評価提出リマインド、遅延アラートを設定します。

**（画面：次回タイトル）**

次回：「遅延しない採用運用！面接リマインド・評価提出リマインドを自動化する」

それでは、次回もお楽しみに！」
