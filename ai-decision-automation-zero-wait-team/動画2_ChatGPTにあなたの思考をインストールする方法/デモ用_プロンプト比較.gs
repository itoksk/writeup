// ================================================================================================
// 動画2デモ用: Google Apps Script版 プロンプト比較実演コード
// Before/After のプロンプト効果を実際に見せるためのデモ
// ================================================================================================

// デモ用のテストケース
const testCases = [
    {
        title: "営業ツール導入",
        request: "営業部の田中です。顧客管理システム（CRM）の導入費用20万円の承認をお願いします。現在の顧客情報がExcelで管理されており、営業効率が悪い状況です。",
        requester: "田中（営業部）",
        amount: 200000,
        category: "システム投資"
    },
    {
        title: "研修費用",
        request: "人事部の佐藤です。管理職向けマネジメント研修費用15万円の承認をお願いします。5名の課長職を対象とした2日間の外部研修です。",
        requester: "佐藤（人事部）", 
        amount: 150000,
        category: "人材育成"
    },
    {
        title: "高額投資案件",
        request: "IT部の鈴木です。基幹システムのリプレイス費用500万円の承認をお願いします。現行システムの保守期限が来年で切れるため、新システムへの移行が必要です。",
        requester: "鈴木（IT部）",
        amount: 5000000,
        category: "システム更新"
    }
];

// ================================================================================================
// 悪いプロンプト例（基本的すぎる）
// ================================================================================================
const badPrompt = `
以下の承認依頼について判断してください。
適切かどうか教えてください。

依頼内容: {request}
`;

// ================================================================================================
// 良いプロンプト例（最適化済み）
// ================================================================================================
const goodPrompt = `
あなたは経験豊富な管理職として、承認業務を担当します。
以下の判断基準に従って、公平で一貫した判断を行ってください。

## 判断基準
【金額基準】
- 10万円以下: 原則承認
- 10-50万円: 詳細検討（ROI・必要性重視）
- 50万円超: 段階的承認（役員承認必須）

【評価項目】
1. 投資回収期間（目標12ヶ月以内）
2. 業務効率化効果（定量的改善）
3. リスク評価（低/中/高）
4. 過去事例との整合性

## 出力フォーマット
【判断結果】承認/条件付き承認/却下/要追加情報
【判断根拠】
1. [具体的理由1]
2. [具体的理由2] 
3. [具体的理由3]
【注意事項】[実行時の留意点]
【信頼度】[0-100%]

## 承認依頼
依頼者: {requester}
内容: {request}
金額: {amount}円

上記について判断してください。
`;

// ================================================================================================
// GAS用のデモ実行関数
// ================================================================================================

// プロンプトにデータを埋め込む関数
function fillPrompt(template, data) {
  let filled = template;
  filled = filled.replace('{request}', data.request);
  filled = filled.replace('{requester}', data.requester);
  filled = filled.replace('{amount}', data.amount);
  return filled;
}

// デモ結果を生成する関数（実際のAPIコールの代わりにシミュレーション）
function getSimulatedResponse(testCase, isGoodPrompt) {
  const responses = {
    bad: {
      "営業ツール導入": "20万円のCRM導入についてですが、営業効率化は重要な課題ですね。金額的にはそれほど高額ではないので、検討する価値があると思います。ただし、具体的な効果の測定方法や、他の選択肢との比較も必要かもしれません。総合的に判断すると、前向きに検討してみても良いのではないでしょうか。",
      "研修費用": "15万円の管理職研修ですね。人材育成は会社の重要な投資だと思います。5名の課長職が対象ということなので、一人あたり3万円程度の計算になりますね。研修内容によりますが、妥当な金額かもしれません。ただ、効果の測定は難しいかもしれませんが、長期的には良い投資になりそうです。",
      "高額投資案件": "500万円は非常に大きな金額ですね。基幹システムの更新は確かに重要ですが、慎重な検討が必要です。保守期限の問題もあるということなので、緊急性は理解できます。ただし、他の選択肢や段階的な実施の可能性も検討した方が良いかもしれません。"
    },
    good: {
      "営業ツール導入": `【判断結果】条件付き承認
【判断根拠】
1. 金額20万円は中間レンジで要検討対象
2. 営業効率化は明確な課題で必要性が高い
3. CRM導入の類似事例で成功実績あり
【注意事項】導入前に具体的な効果測定指標の設定必須
【信頼度】85%`,
      "研修費用": `【判断結果】承認
【判断根拠】
1. 金額15万円は承認範囲内（一人3万円は適正）
2. 管理職スキル向上は組織力強化に直結
3. 人材育成投資の重要性が高い
【注意事項】研修後の効果測定とフォローアップを実施
【信頼度】92%`,
      "高額投資案件": `【判断結果】要追加情報
【判断根拠】
1. 金額500万円は段階的承認が必要な高額案件
2. 保守期限による緊急性は理解できる
3. システムリプレイスの詳細検討が不十分
【注意事項】複数業者見積もり、段階実施計画、ROI試算が必要
【信頼度】70%`
    }
  };
  
  return isGoodPrompt ? responses.good[testCase.title] : responses.bad[testCase.title];
}

// スプレッドシートに結果を出力する関数
function outputToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // ヘッダー行を作成
  sheet.clear();
  sheet.getRange(1, 1, 1, 7).setValues([
    ['テストケース', '依頼者', '金額', '内容', '基本プロンプト結果', '最適化プロンプト結果', '改善効果']
  ]);
  sheet.getRange(1, 1, 1, 7).setBackground('#4285f4').setFontColor('#ffffff').setFontWeight('bold');
  
  // 各テストケースの結果を出力
  testCases.forEach((testCase, index) => {
    const row = index + 2;
    const badResponse = getSimulatedResponse(testCase, false);
    const goodResponse = getSimulatedResponse(testCase, true);
    
    sheet.getRange(row, 1).setValue(testCase.title);
    sheet.getRange(row, 2).setValue(testCase.requester);
    sheet.getRange(row, 3).setValue(testCase.amount).setNumberFormat('¥#,##0');
    sheet.getRange(row, 4).setValue(testCase.request).setWrap(true);
    sheet.getRange(row, 5).setValue(badResponse).setWrap(true).setBackground('#f8d7da');
    sheet.getRange(row, 6).setValue(goodResponse).setWrap(true).setBackground('#d1edff');
    sheet.getRange(row, 7).setValue('明確性↑ 構造化↑ 再現性↑').setBackground('#d4edda');
  });
  
  // 列幅を調整
  sheet.setColumnWidth(1, 120);
  sheet.setColumnWidth(2, 100);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 300);
  sheet.setColumnWidth(5, 350);
  sheet.setColumnWidth(6, 350);
  sheet.setColumnWidth(7, 150);
  
  // 行の高さを調整
  for (let i = 2; i <= testCases.length + 1; i++) {
    sheet.setRowHeight(i, 150);
  }
}

// ================================================================================================
// Google Gemini APIを使用した実際のデモ（上級者向け）
// ================================================================================================

// Gemini APIを使用してプロンプトを実行
function callGeminiAPI(prompt) {
  // Gemini APIキーを設定（Script Propertiesから取得）
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    return 'APIキーが設定されていません。Script Propertiesに GEMINI_API_KEY を設定してください。';
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());
    
    if (json.candidates && json.candidates[0].content.parts[0].text) {
      return json.candidates[0].content.parts[0].text;
    } else {
      return 'エラー: レスポンスが期待される形式ではありません。';
    }
  } catch (error) {
    return `エラー: ${error.toString()}`;
  }
}

// 実際のAPIを使用したデモ実行
function runLiveDemo() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  
  // ヘッダー
  sheet.getRange(1, 1).setValue('🎬 Gemini API実行デモ').setFontSize(16).setFontWeight('bold');
  
  testCases.forEach((testCase, index) => {
    const startRow = (index * 10) + 3;
    
    // テストケース情報
    sheet.getRange(startRow, 1).setValue(`テストケース ${index + 1}: ${testCase.title}`).setFontWeight('bold');
    sheet.getRange(startRow + 1, 1).setValue(`依頼者: ${testCase.requester}`);
    sheet.getRange(startRow + 2, 1).setValue(`金額: ¥${testCase.amount.toLocaleString()}`);
    
    // 基本プロンプト実行
    sheet.getRange(startRow + 3, 1).setValue('❌ 基本プロンプト:').setFontColor('#dc3545');
    const badFilledPrompt = fillPrompt(badPrompt, testCase);
    const badResult = callGeminiAPI(badFilledPrompt);
    sheet.getRange(startRow + 4, 1).setValue(badResult).setWrap(true);
    
    // 最適化プロンプト実行
    sheet.getRange(startRow + 5, 1).setValue('✅ 最適化プロンプト:').setFontColor('#0084ff');
    const goodFilledPrompt = fillPrompt(goodPrompt, testCase);
    const goodResult = callGeminiAPI(goodFilledPrompt);
    sheet.getRange(startRow + 6, 1).setValue(goodResult).setWrap(true);
    
    // 区切り線
    sheet.getRange(startRow + 7, 1).setValue('-'.repeat(80));
    
    Utilities.sleep(1000); // API制限対策
  });
  
  sheet.autoResizeColumn(1);
}

// ================================================================================================
// メニュー作成
// ================================================================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎯 プロンプト比較デモ')
    .addItem('📊 シミュレーション結果を表示', 'outputToSheet')
    .addItem('🚀 Gemini APIで実行（要APIキー）', 'runLiveDemo')
    .addSeparator()
    .addItem('⚙️ APIキーを設定', 'showApiKeyDialog')
    .addToUi();
}

// APIキー設定ダイアログ
function showApiKeyDialog() {
  const html = HtmlService.createHtmlOutput(`
    <div style="padding: 20px;">
      <h3>Gemini APIキーの設定</h3>
      <p>Google AI Studioでキーを取得してください：</p>
      <p><a href="https://makersuite.google.com/app/apikey" target="_blank">APIキー取得ページ</a></p>
      <br>
      <input type="text" id="apiKey" placeholder="APIキーを入力" style="width: 300px; padding: 5px;">
      <br><br>
      <button onclick="saveApiKey()" style="padding: 5px 15px;">保存</button>
      <div id="message" style="margin-top: 10px; color: green;"></div>
    </div>
    <script>
      function saveApiKey() {
        const apiKey = document.getElementById('apiKey').value;
        google.script.run.withSuccessHandler(function() {
          document.getElementById('message').textContent = '保存しました！';
        }).saveApiKey(apiKey);
      }
    </script>
  `).setWidth(400).setHeight(250);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'APIキー設定');
}

// APIキーを保存
function saveApiKey(apiKey) {
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', apiKey);
}