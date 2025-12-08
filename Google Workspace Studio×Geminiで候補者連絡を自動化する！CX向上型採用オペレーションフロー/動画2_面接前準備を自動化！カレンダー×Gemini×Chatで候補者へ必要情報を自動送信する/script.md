# 第2回：面接前準備を自動化！Calendar×Gemini×Chatで候補者へ必要情報を自動送信する

**動画時間**: 10分
**学習目標**: 面接予定をCalendarから検知し、Geminiで候補者情報を要約、面接官へChat通知するエージェントを作成する

---

## 1. 導入（0:00-1:00）

### 講師セリフ

「前回は、CX向上型採用オペレーションフローの全体像を学びました。今回から実際にエージェントを作成していきます。

まず取り組むのは、**面接前準備の自動化**です。

面接官の皆さん、こんな経験はありませんか？面接5分前に『あれ、この候補者どんな人だっけ？』と慌てて履歴書を探す...

**（画面：慌てて資料を探すイメージ）**

この問題を解決するエージェントを作ります。Calendar上の面接予定を検知し、Geminiが候補者情報を要約、面接10分前に面接官へChat通知する仕組みです。」

---

## 2. エージェントの設計（1:00-2:30）

### 講師セリフ

「今回作成するエージェントの設計を見ていきましょう。

**（画面：エージェント設計図）**

### スターター（トリガー）

**Schedule Trigger**を使用します。
- 毎朝9時に実行
- 当日の面接予定をCalendarから取得

### ステップ

**Step 1**: Calendar APIで当日の面接イベントを取得
**Step 2**: 各面接について、Driveから候補者の履歴書を取得
**Step 3**: Geminiで候補者情報を要約
**Step 4**: 面接10分前にChatで面接官に通知

### 変数

- {interview_time}: 面接時刻
- {candidate_name}: 候補者名
- {interviewer}: 面接官
- {resume_summary}: 履歴書要約
- {position}: 応募ポジション」

---

## 3. Studio でエージェント作成（2:30-5:00）

### 講師セリフ

「では、実際にStudioでエージェントを作成していきます。

**（画面：Studio画面を表示）**

### Step 1: 新規エージェント作成

『Create agent』をクリックし、エージェント名を入力します。

**Name**: Interview Prep Notification
**Description**: Sends interview preparation summary to interviewers before meetings

### Step 2: スターターの設定

『Add starter』から『Schedule』を選択します。

**設定内容**：
- Frequency: Daily
- Time: 9:00 AM
- Days: Weekdays only

### Step 3: Calendarイベント取得

『Add step』から『Get calendar events』を選択。

**設定内容**：
- Calendar: Primary calendar
- Time range: Today
- Filter: Title contains '面接' or 'Interview'

**（画面：Calendar設定画面）**

### Step 4: Drive ファイル取得

候補者名でDriveを検索し、履歴書ファイルを取得します。

**設定内容**：
- Search query: {candidate_name} 履歴書
- Folder: 採用書類フォルダ

### Step 5: Gemini 要約

取得した履歴書をGeminiで要約します。

**（画面：プロンプト入力画面）**

プロンプトはprompts.txtに記載のものを使用します。」

---

## 4. Gemini プロンプト設定（5:00-6:30）

### 講師セリフ

「Geminiへのプロンプト設定が重要なポイントです。

**（画面：プロンプト表示）**

```
You are an HR assistant preparing interview briefings.

Candidate: {candidate_name}
Position: {position}
Resume content: {resume_content}

Create a brief summary for the interviewer including:
1. Key qualifications (3 bullet points)
2. Relevant experience highlights
3. Suggested interview focus areas
4. Any notable points or concerns

Keep the summary concise (under 200 words).
Output in Japanese.
```

### ポイント

**（画面：プロンプトのポイント）**

1. **役割を明確に**: 『HR assistant preparing interview briefings』
2. **出力形式を指定**: 4つの項目を箇条書きで
3. **文字数制限**: 『under 200 words』で簡潔に
4. **言語指定**: 『Output in Japanese』

これにより、面接官が**30秒で把握できる**要約が生成されます。」

---

## 5. Chat通知設定（6:30-8:00）

### 講師セリフ

「最後に、Chat通知の設定です。

**（画面：Chat設定画面）**

### Step 6: Chat メッセージ送信

『Add step』から『Send Chat message』を選択。

**設定内容**：
- Recipient: {interviewer_email}
- Timing: 10 minutes before {interview_time}

**メッセージテンプレート**：

```
【面接準備情報】

本日 {interview_time} からの面接情報です。

■ 候補者: {candidate_name}
■ 応募ポジション: {position}

■ 候補者サマリー
{resume_summary}

■ 履歴書リンク
{resume_link}

面接頑張ってください！
```

**（画面：完成したフロー図）**

### テスト実行

『Test』ボタンをクリックしてテスト実行します。

**確認ポイント**：
- Calendarからイベントが正しく取得できているか
- Driveから履歴書が取得できているか
- Geminiの要約が適切か
- Chatメッセージが正しい宛先に送信されるか」

---

## 6. 実運用のポイント（8:00-9:30）

### 講師セリフ

「実運用に向けたポイントを確認しましょう。

**（画面：運用ポイント一覧）**

### ポイント1：フォルダ構造の統一

候補者ごとにフォルダを作成し、履歴書の命名規則を統一しておくと、Driveからの検索精度が上がります。

**推奨構造**：
```
採用書類/
├── [候補者名A]_[日付]/
│   └── 履歴書_[候補者名].pdf
└── [候補者名B]_[日付]/
    └── ...
```

### ポイント2：Calendarイベントの命名規則

面接予定のタイトルに候補者名を含めることで、エージェントが正確に検知できます。

**推奨形式**：「面接：山田太郎さん（エンジニア）」

### ポイント3：通知タイミングの調整

デフォルトは10分前ですが、チームの状況に応じて15分前、30分前に調整可能です。

### エラー対応

履歴書が見つからない場合は、『ファイルが見つかりませんでした』と通知し、手動確認を促すフォールバックを設定しておきましょう。」

---

## 7. まとめ・次回予告（9:30-10:00）

### 講師セリフ

「今日は、面接前準備を自動化するエージェントを作成しました。

### 今日のポイント

**（画面：ポイントまとめ）**

1. **Schedule Trigger**で毎朝自動実行
2. **Calendar連携**で当日の面接予定を取得
3. **Drive連携**で候補者の履歴書を取得
4. **Gemini**で面接官向けサマリーを自動生成
5. **Chat通知**で面接10分前に自動配信

これで面接官は、面接前の準備時間が**ゼロ**になり、候補者との対話に集中できます。

次回は、**面接後の作業を自動化**します。面接終了を検知し、Geminiが評価ポイントを整理、Gmail・Chatで関係者へ自動共有するフローを作成します。

**（画面：次回タイトル）**

次回：「面接後作業をゼロにする！要約＆評価ポイントをGmail・Chatへ自動送信するフローを作る」

それでは、次回もお楽しみに！」

---

## 画面表示資料一覧

1. 慌てて資料を探すイメージ（0:30）
2. エージェント設計図（1:15）
3. Studio画面（2:30）
4. Calendar設定画面（3:30）
5. プロンプト入力画面（5:00）
6. プロンプトのポイント（6:00）
7. Chat設定画面（6:45）
8. 完成したフロー図（7:45）
9. 運用ポイント一覧（8:00）
10. ポイントまとめ（9:30）
11. 次回タイトル（9:50）
