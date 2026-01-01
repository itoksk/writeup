Google Workspace Studio× Gmail × Geminiで “追客漏れゼロ” を実現する営業パイプライン自動化フロー　ディレクトリのコースは、  
元々条件分岐で“現場仕様”にカスタム！Google Workspace Flows×Geminiで会議・依頼・タスクを自動整理する実務活用コース.mdが原本だったんだけど、

- 案件メール地獄から脱出する！Google Workspace Studioで“営業メール仕事”を分解する  
- 見込み顧客メールを10分で把握！要約・重要顧客優先・緊急案件アラートの自動化  
- 追客漏れゼロの受信トレイ！要対応案件メールの自動ラベル化＆次アクション設計  
- 提案資料と見積書を完全自動整理！Drive保存 × 定期送信フローで営業資料を整流化  
- キーワード監視で確度高い案件を逃さない！“使える営業フロー” に仕上げる最終調整

のコース名となるように、

✅【営業向けタイトルに合わせた “営業文脈版” 中身リメイク】

タイトル  
Google Workspace Studio × Gmail × Geminiで “追客漏れゼロ” を実現する営業パイプライン自動化フロー

第1本  
案件メール地獄から脱出する！Google Workspace Flowで“営業メール仕事”を分解する

（元：メール地獄 → 営業メールに置換）

「案件返信メール」「問い合わせ」「見込み顧客メール」  
など営業シーンに寄せるだけで、内容はそのまま活かせる

第2本  
見込み顧客メールを10分で把握！要約・重要顧客優先・緊急案件アラートの自動化

（元：未読メール → 見込み顧客メールに置換）

重要人物 → 重要顧客 / キーアカウント

緊急アラート → 期限迫る案件アラート

第3本  
追客漏れゼロの受信トレイ！要対応案件メールの自動ラベル化＆次アクション設計

（元：アクション漏れ → 追客漏れ に置換）

要対応メール → 要アクション案件メール

フォローアップ → 追客プロセス に言い換え

第4本  
提案資料と見積書を完全自動整理！Drive保存 × 定期送信フローで営業資料を整流化

（元：添付ファイル → 提案資料・見積書に置換）

Drive保存 → 案件フォルダ自動整理 として営業文脈に自然にマッチ

第5本  
キーワード監視で確度高い案件を逃さない！“使える営業フロー” に仕上げる最終調整

（元：実運用 → 営業運用へ寄せる）

「◯◯提案」「見積もり依頼」「契約書」など  
営業固有のキーワード を監視対象に変更可能

で構成し直してほしい。

ただ、ここまでの追加情報（ステップとかスターターとかGeminiの活用とか）と、公式情報によって変更しなければいけないことがあれば、改善して、コースを作り替えて、その概要を新しいmdファイルに切り出してください。  
そして、Google Workspace Studio× Gmail × Geminiで “追客漏れゼロ” を実現する営業パイプライン自動化フロー　ディレクトリのコースを更新してください。  
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
