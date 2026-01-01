Google Workspace Studioで“報告・承認・進捗管理”を自動化する！管理職のためのゼロタッチマネジメント　ディレクトリのコースは、  
元々条件分岐で“現場仕様”にカスタム！Google Workspace Flows×Geminiで会議・依頼・タスクを自動整理する実務活用コース.mdが原本だったんだけど、

- 属人管理から卒業するための基礎設計！条件分岐で“日報・週報提出依頼”を自動化する  
- 重要ポイントだけを抽出して確認時間を1/5にする！日報と週報を自動要約する確認時短フロー  
- 合格・要修正・再提出を条件分岐で仕分ける！チェックリストを自動で判定する審査フロー  
- Driveとスプレッドシートを連携する！進捗ダッシュボードが自動で更新される仕組み  
- 誰に何をいつ伝えるかを整理し遅延ゼロを実現する！承認プロセスを自動化するワークフロー

のコース名となるように、  
Workspaceflow Videolesson 2to5  
ユーザーによって生成された、未検証または安全でない可能性があるコンテンツを表示しています。  
報告する  
ChatGPT  
ChatGPT で編集する  
🎥 第1本：属人管理から卒業するための基礎設計！条件分岐で“日報・週報提出依頼”を自動化する

【導入フレーズ】 「毎週 “日報出してね”“週報まだ？” と声をかけるだけで1時間溶けていくんです…」 管理職なら一度は味わうこの徒労感。提出が遅く、提出形式もバラバラ。 結局、提出依頼を手で送り、催促もし、進捗を確認し…と完全に属人化している状態です。 本来はメンバーのマネジメントに時間を使いたいのに、“提出してもらうためだけの仕事” に追われている。 本動画では、この「提出依頼」という最もムダな作業をゼロにする仕組みを作ります。

【Before / After】 Before

日報・週報を提出してくれない

催促メッセージを毎週手で送っている

提出状況が人によってまちまち

提出フォーマットがバラバラで整理が大変

After

Flow が提出期限前に自動リマインド

書式指定も含めて自動で案内を送信

提出状況がスプレッドシートに自動集約

催促・提出依頼作業が完全ゼロ

【デモ（見せ場）】

Flow 実行により、メンバー全員に毎朝 9:00 に週報提出依頼が一斉送信される

期限前には「あと◯時間で週報締切です」リマインドが自動配信

提出された日報・週報がスプレッドシートに即時自動反映

【構築手順（全体像）】

スプレッドシートに“メンバー一覧 \+ メールアドレス”を作成

Flow で時間トリガー（例：毎日9:00）を設定

「提出依頼メールを送信」アクションを追加

条件分岐で「提出済 / 未提出」を判定できるように設定

未提出者へ自動リマインドを送るフローを追加

フォーム or 日報フォーマットへのリンクを添付

提出ログをスプレッドシートへ自動記録

【設定実演（具体手順）】

Flow を開く →「新しいフロー」

トリガー → 「時間」→「毎週金曜 17:00」

Gmail アクション → 「メールを送信」

本文に「週報提出はこちら」＋フォームURLを記載

スプレッドシートアクション → 「行を追加」

条件分岐：IF 提出記録が空欄 → THEN 催促メール自動送信

保存して実行テスト

【注意点・活用ポイント】

メール文面は Gemini で作ると“管理職らしい文章”が10秒で生成できる

提出期限は曖昧にせずFlow内に明確な時間設定

提出形式を統一すると後工程が圧倒的に楽

リマインド頻度は“前日 \+ 当日朝”が最適

【まとめ】 提出依頼という“管理職のムダ仕事TOP3”がFlowだけでなくなる。 ここがゼロタッチマネジメント全体の入口になる。

【次回予告】 次は、提出された日報・週報を読む時間を1/5にする「自動要約フロー」を構築します。

🎥 第2本：重要ポイントだけを抽出して確認時間を1/5にする！日報と週報を自動要約する確認時短フロー

【導入フレーズ（共感をつかむ冒頭）】 「日報読みは“読むこと自体”が目的化していませんか？」 管理職の多くが、毎日10〜20件届く日報を読み、ポイントを探し、懸念点がないかを判断します。しかし実際は読んだのに頭に入っていない、重要ポイントを見落とす、読み直す──心理的にも時間的にも重い作業です。

この動画では “読む”という行為そのものを自動化し、管理職の確認作業を1/5にするフローを構築します。ポイントは Flow × Gemini要約 × Gmail/Chat通知の三段連携。管理職は「要点だけ」見ればよい状態を作ります。

【Before / After】 ❌ Before

日報・週報を読むだけで毎日30〜60分

書き方が人によってバラバラで理解が難しい

重要事項を読み飛ばすリスクが高い

毎週「読むための時間」が必要

報告の質に左右され判断が遅れる

✅ After

Flow が日報を受信すると自動でGeminiへ要約依頼

「重要ポイント」「懸念」「フォロー必要箇所」が整理されて通知

Gmail・Chatに即サマリー配信

管理職は“判断”だけに集中

日報確認は1日30分→5〜7分へ短縮

【デモ（見せ場）】 ▼実演の流れ

部下が日報フォームを送信

Flow がトリガー → Geminiへ要約投入

数秒後、管理職に「本日の要点」がメール通知

Chatには「懸念点のみ」の緊急サマリーが届く

▼表示されるサマリー例 【本日の要点】 ・案件A：進捗50%。課題は顧客側の意思決定遅延 ・トラブル兆候：サーバー応答遅延（要即時確認） ・明日の優先タスク：資料更新、レビュー

管理職が見るのはこれだけ。“読む疲労”が完全にゼロになります。

【構築手順（工程全体）】

日報提出フォーム or シートを準備

Flowで「フォーム回答があったら開始」設定

回答内容を変数へ格納

「Gemini 要約」アクションを追加

プロンプトに重要点抽出の指示を設定

要約結果をメール/Chatへ通知

スプレッドシートにも自動保存

【設定実演（具体手順）】

Flow → 新しいフロー → イベント：フォーム回答

「データ取得」で回答を読み込む

「Geminiでテキストを生成」を追加

プロンプト例：

あなたは管理職の意思決定支援AIです。  
以下の日報から「重要点」「懸念」「次アクション」を抽出してください。  
Gmail送信で宛先を管理職に指定

Chat通知用に“懸念あり/なし”の条件分岐を追加

保存してテスト

【注意点・活用ポイント】

長文が多い場合は「300文字以内で要約」など制約を加えると精度UP

Chat通知は緊急時のみ→ノイズ削減

サマリー形式は毎日同じにすると比較しやすい

データがシートに溜まり、後のダッシュボード化も容易

【まとめ】 Gemini × Flow により管理職は“読む作業”から解放。判断と指示出しに集中できる本来のマネジメントへ。毎日30分削減は年間100時間以上の生産性向上。

【次回予告】 次は、チェックリスト・提出物評価を自動仕分けする「審査フロー」を構築します。

🎥 第3本：合格・要修正・再提出を条件分岐で仕分ける！チェックリストを自動で判定する審査フロー

【導入フレーズ】 「提出物の確認が“ただの目視チェック”になっていませんか？」 管理職は、業務手順書・企画書・改善提案書など多様な資料をチェックしますが、質がバラバラ、基準が曖昧、確認に時間がかかるという悩みがつきまといます。

本動画では、Flow × Gemini × 条件分岐で提出物を“合格・要修正・再提出”に自動仕分けする審査フローを構築します。

【Before / After】 ❌ Before

資料を開いて1ページずつ読む

判断基準が曖昧で評価がブレる

修正依頼に時間がかかる

再提出管理が煩雑

提出数が増えると破綻

✅ After

Flow が資料を検知→自動判定

Gemini が不足箇所を抽出

メンバーへ自動で修正依頼

合格物だけ管理職へ届く

再提出まで自動追跡

【デモ（見せ場）】

メンバーがフォームから資料提出

Flowが添付ファイルを取得

Geminiが基準に照らして自動判定

管理職には「合格のみ」通知

メンバーには「要修正」「再提出」メールが自動送信

結果はスプレッドシートに記録

【構築手順（工程全体）】

チェック基準（例：5項目）をシートに定義

資料提出フォームを作成（ファイル添付ON）

Flowで「フォーム回答」をトリガー

添付ファイルをDriveへ保存

Geminiへ以下を指示：

各基準を満たしているか

不足箇所の指摘

判定：合格 / 要修正 / 再提出

条件分岐でメール内容を切り替え

判定結果をシートに記録

【設定実演（具体手順）】

Flow → 新規作成 → トリガー：Google Form

「ファイルをDriveへ保存」

「Geminiでテキスト生成」→ プロンプト例：

以下の資料が、次の基準を満たしているか判定し、  
合格 / 要修正 / 再提出 のいずれかを出してください。  
不足箇所は具体的にリスト化してください。  
条件分岐：

If 合格 → 承認通知

If 要修正 → 修正依頼

If 再提出 → 追加案内

シートへ自動書き込み

【注意点・活用ポイント】

基準は曖昧にしないほど判定精度UP

添付ファイルはPDFが最も安定

「フォーマットに沿えば自動合格」の仕組みが改善文化をつくる

再提出追跡を自動化すると負荷ゼロ

【まとめ】 管理職は資料を開く必要がなくなり、判断すべき提出物だけが自分の画面に届く世界へ。

【次回予告】 次は、第1〜3本の自動化結果を“進捗ダッシュボード”へ統合します。

🎥 第4本：Driveとスプレッドシートを連携する！進捗ダッシュボードを自動更新する仕組み

【導入フレーズ】 「毎週、進捗をスプレッドシートにまとめる作業に追われていませんか？」 提出物をまとめる作業が管理職の負荷を圧迫しています。本動画では、Flow × Drive × Sheets 連携により“毎日勝手に更新されるダッシュボード”を構築します。

【Before / After】 ❌ Before

手作業でスプレッドシート更新

資料提出状況が把握しづらい

上層部向け資料準備に時間がかかる

見える化作業が本末転倒

✅ After

Driveへの資料追加で自動更新

日報・週報・審査結果が即時反映

Looker Studioのダッシュボード常時最新版

進捗監視作業が完全ゼロ

【デモ（見せ場）】

メンバーが資料をDriveにアップロード

Flowが即検知→提出情報をシートへ追加

Looker Studioダッシュボードが瞬時更新

管理職は“見るだけ”で状況把握

【構築手順（工程全体）】

Driveに"部署別フォルダ"を作成

スプレッドシートに管理項目を用意

Flowで「フォルダにファイル追加」をトリガー設定

ファイル情報（名前・日付・アップロード者）を取得

シートに行追加

Looker Studioでダッシュボード作成

シートをデータソースに紐づける

【設定実演（具体手順）】

🎥 第5本：誰に何をいつ伝えるかを整理し遅延ゼロを実現する！承認プロセスを自動化するワークフロー

【導入フレーズ】 「承認が止まると、チーム全体の仕事が止まる。」 管理職の承認作業が遅れることで、

メンバーの作業待ち

納期遅延

顧客対応の停滞

チームの士気低下 など、連鎖的な問題が発生します。

本動画では、承認依頼 → リマインド → 承認完了通知 をすべて自動化し、 管理職のボトルネックを取り除くゼロタッチ承認フローを構築します。

【Before / After】 ❌ Before

承認依頼がメールに埋もれて気づかない

「まだですか？」の催促が精神的に負担

確認→判定→返信の作業が重い

承認待ち一覧がなく状況把握が困難

✅ After

提出物があれば自動で承認依頼が届く

期限前に自動リマインド

承認/差し戻し後は自動でメンバーへ通知

スプレッドシートに承認履歴が蓄積

承認渋滞が完全解消

【デモ（見せ場）】

部下がフォームで提出

Flowが管理職へ自動で「承認依頼」を送信

期限前になると自動リマインド

管理職が承認/差し戻しを選択

メンバーへ自動連絡

承認結果はシートに反映→ダッシュボードも瞬時更新

管理職は “承認ボタンを押すだけ” の最軽量ワークフローを実現します。

【構築手順（工程全体）】

承認が必要な提出物フォームを作成

Flowで「提出があったら管理職へ承認依頼」を設定

承認用フォームまたはChatボタンを準備

承認結果を受けてメンバーへ通知

スプレッドシートへ承認結果を記録

ダッシュボードへ連動

【設定実演（具体手順）】

Flow → 新規フロー

トリガー：Google Form → 新規回答

Gmailアクション：「承認依頼を送信」

本文に「承認ボタン（承認フォームURL）」を挿入

条件分岐を設定：承認 / 差し戻し

承認ルート：

If 承認 → メンバーへ承認完了通知

If 差し戻し → 修正依頼メール

スプレッドシートに承認結果を追加

【注意点・活用ポイント】

承認担当者をFlow内で明確化する（役職ごとに分岐可能）

承認期限を設定し、期限前リマインドを自動化

通知文はGeminiでテンプレ化→個別対応の負荷減

承認履歴は1on1・評価面談でも利用価値が高い

【まとめ】 承認フローの自動化により、“承認待ちの渋滞”が完全に解消される。 管理職のボトルネックをなくすことで、チーム全体のプロジェクト速度が上がり、 ゼロタッチマネジメントの最後のピースが完成する。

で構成し直してほしい。

ただ、ここまでの追加情報（ステップとかスターターとかGeminiの活用とか）と、公式情報によって変更しなければいけないことがあれば、改善して、コースを作り替えて、その概要を新しいmdファイルに切り出してください。  
そして、Google Workspace Studioで“報告・承認・進捗管理”を自動化する！管理職のためのゼロタッチマネジメント　ディレクトリのコースを更新してください。  
また、カスタムステップを作ることもできるので、必要ならそれも紹介してほしい。  
ただ、せっかくノーコードのツールなのに、コーディングは元も子もないので、そこは注意してほしいです。  
[https://developers.google.com/workspace/add-ons/studio/quickstart-calculator?hl=ja\#next-steps](https://developers.google.com/workspace/add-ons/studio/quickstart-calculator?hl=ja#next-steps)

appscript.json

```json
{
 "timeZone": "America/Los_Angeles",
 "exceptionLogging": "STACKDRIVER",
 "runtimeVersion": "V8",
 "addOns": {
   "common": {
     "name": "Calculator",
     "logoUrl": "https://www.gstatic.com/images/branding/productlogos/calculator_search/v1/web-24dp/logo_calculator_search_color_1x_web_24dp.png",
     "useLocaleFromApp": true
   },
   "flows": {
     "workflowElements": [
       {
         "id": "actionElement",
         "state": "ACTIVE",
         "name": "Calculate",
         "description": "Asks the user for two values and a math operation, then performs the math operation on the values and outputs the result.",
         "workflowAction": {
           "inputs": [
             {
               "id": "value1",
               "description": "value1",
               "cardinality": "SINGLE",
               "dataType": {
                 "basicType": "INTEGER"
               }
             },
             {
               "id": "value2",
               "description": "value2",
               "cardinality": "SINGLE",
               "dataType": {
                 "basicType": "INTEGER"
               }
             },
             {
               "id": "operation",
               "description": "operation",
               "cardinality": "SINGLE",
               "dataType": {
                 "basicType": "STRING"
               }
             }
           ],
           "outputs": [
             {
               "id": "result",
               "description": "Calculated result",
               "cardinality": "SINGLE",
               "dataType": {
                 "basicType": "INTEGER"
               }
             }
           ],
           "onConfigFunction": "onConfigCalculateFunction",
           "onExecuteFunction": "onExecuteCalculateFunction"
         }
       }
     ]
   }
 }
}

```

Calculator.gs

```javascript
/**
* This script defines a custom step for Google Workspace Studio.
* The step, named "Calculate", takes two numbers and an operation as input
* and returns the result of the calculation.
*
* The script includes functions to:
*
* 1.  Define the configuration UI for the step using Card objects:
*
*     - `onConfigCalculateFunction()`: Generates the main configuration card.
*     - Helper functions like `pushCard()`, `saveButton()` to build card components.
*
* 2.  Handle the execution of the step.
*
*     - `onExecuteCalculateFunction()`: Retrieves inputs, performs the calculation,
*       and returns outputs.
*
* To learn more, see the following quickstart guide:
* https://developers.google.com/workspace/add-ons/studio/quickstart
*/

/**
* Creates an action response to push a new card onto the card stack.
*
* This function generates an action object that, when returned, causes the
* provided card to be pushed onto the card stack, making it the currently
* displayed card in the configuration UI.
* @param {Object} card The Card object to push.
* @return {Object} The action response object.
*/
function pushCard(card) {
 return {

     "action": {
       "navigations": [{
           "push_card": card
         }
       ]
     }  }; 
}

/**
* Creates an action response to update the currently displayed card.
*
* This function generates an action object that, when returned, causes the
* currently displayed card to be replaced with the provided card in the
* configuration UI.
* @param {Object} card The Card object to update.
* @return {Object} The render actions object.
*/
function updateCard(card) {
 return {
   "render_actions": {
     "action": {
       "navigations": [{
           "update_card": card
         }
       ]
     }
   }
 };
}

/**
* Creates a button configuration object for saving the step.
*
* This function generates a button definition that, when clicked, triggers
* a save action for the current step configuration.
* @return {Object} The button widget object.
*/
function saveButton() {
 return {
     "text": "Save",
     "onClick": {
       "hostAppAction" : {
         "workflowAction" : {
           "saveWorkflowAction" : {}
         }
       }
     },
   };
}

/**
* Creates a button configuration object for a refresh action.
*
* This function generates a button definition that, when clicked, triggers
* a function to refresh the current card.
* @param {string} functionName The name of the Apps Script function to call on click.
* @return {Object} The button widget object.
*/
function refreshButton(functionName) {
 return {
     "text": "Refresh",
     "onClick": {
       "action" : {
         "function" : functionName
       }
     },
   };
}


/**
* Generates and displays a configuration card for the sample calculation action.
*
* This function creates a card with input fields for two values and a dropdown
* for selecting an arithmetic operation. The card also includes a "Save"
* button to save the action configuration for the step.
*
* The input fields are configured to let the user select outputs from previous
* steps as input values using the `hostAppDataSource` property.
* This function is called when the user adds or edits the "Calculate" step in the UI.
* @return {Object} The action response object containing the card to display.
*/
function onConfigCalculateFunction() {
 var card = {
   "sections": [
     {
       "header": "Action sample: Calculate",
       "widgets": [
         {
           "textInput": {
             "name": "value1",
             "label": "First value",
             "hostAppDataSource" : {
               "workflowDataSource" : {
                 "includeVariables" : true
               }
             }
           }
         },
         {
           "selectionInput": {
             "name": "operation",
             "label": "Operation",
             "type": "DROPDOWN",
             "items": [
               {
                 "text": "+",
                 "value": "+",
               },
               {
                 "text": "-",
                 "value": "-",
               },
               {
                 "text": "x",
                 "value": "x",
               },
               {
                 "text": "/",
                 "value": "/",
               }
             ]
           }
         },
         {
           "textInput": {
             "name": "value2",
             "label": "Second value",
             "hostAppDataSource" : {
               "workflowDataSource" : {
                 "includeVariables" : true
               }
             }
           }
         }
       ]
     }
   ]
 };
 return pushCard(card);
}

/**
* Gets an integer value from variable data, handling both string and integer formats.
*
* This function attempts to extract an integer value from the provided variable data.
* It checks if the data contains string values and, if so, parses the first string
* as an integer. If integer values are present, it returns the first integer.
* @param {Object} variableData The variable data object from the event.
* @return {number} The extracted integer value.
*/
function getIntValue(variableData) {
 if (variableData.stringValues) {
   return parseInt(variableData.stringValues[0]);
 }
 return variableData.integerValues[0];
}

/**
* Returns output variables from a step.
*
* This function constructs an object that, when returned, sends the
* provided variable values as output from the current step.
* The variable values are logged to the console for debugging purposes.
*/
function outputVariables(variableDataMap) {
const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
  .setVariableDataMap(variableDataMap);

const hostAppAction = AddOnsResponseService.newHostAppAction()
  .setWorkflowAction(workflowAction);

const renderAction = AddOnsResponseService.newRenderActionBuilder()
  .setHostAppAction(hostAppAction)
  .build();

return renderAction;
}

/**
* Executes the calculation action based on the inputs from an event.
*
* This function retrieves input values ("value1", "value2") and the "operation"
* from the event, performs the calculation, and returns the "result" and
* "log" as output variables.
* This function is called when the agent reaches this custom step.
* @param {Object} event The event object passed by the runtime.
* @return {Object} The output variables object.
*/
function onExecuteCalculateFunction(event) {
console.log("output: " + JSON.stringify(event));
var calculatedValue = 0;
var value1 = event.workflow.actionInvocation.inputs["value1"].integerValues[0];
var value2 = event.workflow.actionInvocation.inputs["value2"].integerValues[0];
var operation = event.workflow.actionInvocation.inputs["operation"].stringValues[0];


if (operation == "+") {
  calculatedValue = value1 + value2;
} else if (operation == "-") {
  calculatedValue = value1 - value2;
} else if (operation == "x") {
  calculatedValue = value1 * value2;
} else if (operation == "/") {
  calculatedValue = value1 / value2;
}

const variableDataMap = { "result": AddOnsResponseService.newVariableData().addIntegerValue(calculatedValue) };

return outputVariables(variableDataMap);
}

```
