Google Workspace Studio× Geminiで候補者連絡を自動化する！“CX向上型” 採用オペレーションフロー　ディレクトリのコースは、  
元々条件分岐で“現場仕様”にカスタム！Google Workspace Flows×Geminiで会議・依頼・タスクを自動整理する実務活用コース.mdが原本だったんだけど、

- 採用業務の手作業が消えない理由を見抜く！候補者連絡フローの全体像を理解する  
- 面接前準備を自動化！カレンダー × Gemini × Chatで候補者へ必要情報を自動送信する  
- 面接後作業をゼロにする！要約＆評価ポイントをGmail/Chatへ自動送信するフローを作る  
- 遅延しない採用運用！面接リマインド・評価提出リマインドを自動化する  
- 採用オペレーションを完全自動化！選考フロー全体をFlowで一本化する方法

のコース名となるように、

🔥【採用版：会議コースの中身を “採用コミュニケーション” に寄せたリメイク例】

※構造は 1mm も変えずに、言葉だけ採用向けに変更しています  
※講師にも負担ゼロ

＝＝＝＝＝＝＝＝＝＝＝＝＝＝  
✅第1本  
採用業務の手作業が消えない理由を見抜く！候補者連絡フローの全体像を理解する

（元：会議運営の手作業がなぜ消えないのか？の置換）

会議 → 採用 に置き換えるだけで文脈が自然に成立します。

連絡漏れ

日程調整地獄

評価共有の遅れ

など、採用の実務課題そのまま＝違和感なし。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝  
✅第2本  
面接前準備を自動化！カレンダー × Gemini × Chatで候補者へ必要情報を自動送信する

（元：会議前作業の自動化）

＝ 会議前の資料準備 → 面接前の案内・事前依頼 に転換するだけ。

自然に置き換えられる項目：

面接案内メール

事前課題の送付

面接担当者へのリマインド

面接ルームURLの自動配信

構造は完全一致 → 実務でも大きく刺さる。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝  
✅第3本  
面接後作業をゼロにする！要約＆評価ポイントをGmail/Chatへ自動送信するフローを作る

（元：会議後作業をゼロに）

元の会議後要約を  
面接のフィードバック要約 に転換するだけ。

面接の内容

候補者の強み・懸念

次アクション

合否判断に必要な要点

これらを Gemini が要約 → Flow が自動送信  
＝人事の最大の負担を削減できる。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝  
✅第4本  
遅延しない採用運用！面接リマインド・評価提出リマインドを自動化する

（元：遅延ゼロの会議運営）

会議のリマインダーを  
候補者連絡や評価提出リマインドに置換する。

例：

面接前日の候補者リマインド

面接担当者への「評価登録してください」通知

次面接日程確定を促すフォロー

→ 実際に超使えるやつ。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝  
✅第5本  
採用オペレーションを完全自動化！選考フロー全体をFlowで一本化する方法

（元：全フローの統合）

ここはそのままでも違和感ゼロ。  
採用は「工程が連鎖している」ので、統合する意味が強い。

書類選考 → 面接設定 → 評価共有 → 次面接 → 内定手続き  
を Flow でつなげる概要説明にすれば完璧。

で構成し直してほしい。

ただ、ここまでの追加情報（ステップとかスターターとかGeminiの活用とか）と、公式情報によって変更しなければいけないことがあれば、改善して、コースを作り替えて、その概要を新しいmdファイルに切り出してください。  
そして、Google Workspace Studio× Geminiで候補者連絡を自動化する！“CX向上型” 採用オペレーションフロー　ディレクトリのコースを更新してください。  
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
