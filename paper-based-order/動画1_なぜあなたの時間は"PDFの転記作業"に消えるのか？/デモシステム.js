/**
 * 動画1実演用デモシステム
 * Google Apps Script で動作するPDF自動処理システムのデモ版
 * 
 * セットアップ手順:
 * 1. Google Driveに「AI受注処理」「処理済み」フォルダを作成
 * 2. Googleスプレッドシートで「受注管理台帳」を作成
 * 3. このスクリプトをGoogle Apps Scriptプロジェクトにコピー
 * 4. 必要に応じてSlack Webhook URL、メールアドレスを設定
 */

// =============================================================================
// 1. メインの自動処理関数
// =============================================================================

/**
 * PDF処理のメイン関数（デモ版）
 * Drive APIのトリガーではなく、手動実行でデモを行う
 */
function demoProcessOrder() {
  console.log("=== デモ：PDF自動処理システム開始 ===");
  
  try {
    // 1. サンプルPDFデータを模擬（実際のOCR処理の代わり）
    const mockOcrText = getMockOcrText();
    console.log("✅ OCR処理完了（模擬）");
    
    // 2. AI情報抽出を模擬（実際のChatGPT APIの代わり）
    const orderData = extractOrderInfoMock(mockOcrText);
    console.log("✅ AI情報抽出完了（模擬）");
    
    // 3. スプレッドシートに保存
    saveToSpreadsheet(orderData, "サンプル注文書.pdf");
    console.log("✅ スプレッドシート記録完了");
    
    // 4. Slack通知（実際のWebhookまたは模擬）
    notifySlackDemo(orderData);
    console.log("✅ Slack通知完了");
    
    // 5. 顧客への自動返信（実際のGmailまたは模擬）
    sendCustomerEmailDemo(orderData);
    console.log("✅ 顧客メール送信完了");
    
    console.log("=== デモ：全処理完了！ ===");
    console.log(`処理時間: 約1分（従来の15分から93%削減）`);
    
    // 成功メッセージをスプレッドシートにも記録
    logDemoResult("成功", `${orderData.company}様の注文処理が完了しました`);
    
  } catch (error) {
    console.error("❌ デモ処理エラー:", error);
    logDemoResult("エラー", error.message);
  }
}

// =============================================================================
// 2. OCR処理（模擬版）
// =============================================================================

/**
 * OCR処理の模擬データ
 * 実際のVision APIの代わりに、サンプルの注文書テキストを返す
 */
function getMockOcrText() {
  return `
注文書

株式会社サンプル商事
〒100-0001 東京都千代田区丸の内1-1-1
TEL: 03-1234-5678

注文日: 2024年6月27日
注文番号: ORD-2024-001

ご担当者様

いつもお世話になっております。
下記の通り注文いたします。

【注文内容】
商品名: A型パーツ
品番: AP-001
数量: 50個
単価: ¥1,200
小計: ¥60,000

商品名: B型パーツ  
品番: BP-002
数量: 30個
単価: ¥800
小計: ¥24,000

合計金額: ¥84,000（税込）
希望納期: 2024年7月10日

担当者: 山田太郎
連絡先: yamada@sample-corp.co.jp

よろしくお願いいたします。
  `;
}

// =============================================================================
// 3. AI情報抽出（模擬版）
// =============================================================================

/**
 * ChatGPT API情報抽出の模擬版
 * 実際のAPI呼び出しの代わりに、パースされたデータを返す
 */
function extractOrderInfoMock(ocrText) {
  // 実際のChatGPT APIでは、プロンプトを使って構造化データを取得
  // ここでは模擬的に解析結果を返す
  
  return {
    company: "株式会社サンプル商事",
    contact: "山田太郎",
    contact_email: "yamada@sample-corp.co.jp",
    order_number: "ORD-2024-001",
    order_date: "2024-06-27",
    items: [
      {
        name: "A型パーツ",
        code: "AP-001",
        quantity: 50,
        price: 1200,
        subtotal: 60000
      },
      {
        name: "B型パーツ", 
        code: "BP-002",
        quantity: 30,
        price: 800,
        subtotal: 24000
      }
    ],
    total: 84000,
    delivery_date: "2024-07-10",
    processing_time: new Date()
  };
}

// =============================================================================
// 4. スプレッドシート記録機能
// =============================================================================

/**
 * 抽出された注文情報をスプレッドシートに記録
 */
function saveToSpreadsheet(orderData, fileName) {
  try {
    // スプレッドシートを取得（事前に作成が必要）
    const spreadsheet = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet, '受注管理台帳');
    
    // ヘッダー行がない場合は作成
    if (sheet.getLastRow() === 0) {
      const headers = [
        '処理日時', 'ステータス', '注文番号', '会社名', '担当者', 
        '商品名', '数量', '合計金額', '納期', 'ファイル名', 'メール'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    // データ行を追加
    const row = [
      new Date(),
      '処理完了',
      orderData.order_number,
      orderData.company,
      orderData.contact,
      orderData.items.map(item => `${item.name}(${item.quantity}個)`).join(', '),
      orderData.items.reduce((sum, item) => sum + item.quantity, 0),
      orderData.total,
      orderData.delivery_date,
      fileName,
      orderData.contact_email
    ];
    
    sheet.appendRow(row);
    
    // 最新行をハイライト
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, row.length).setBackground('#e8f5e8');
    
    console.log(`✅ スプレッドシートに記録完了: ${orderData.company}`);
    
  } catch (error) {
    console.error("❌ スプレッドシート記録エラー:", error);
    throw error;
  }
}

/**
 * スプレッドシートを取得または作成
 */
function getOrCreateSpreadsheet() {
  const fileName = '受注管理台帳_デモ';
  
  // 既存のファイルを検索
  const files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  }
  
  // 新規作成
  const spreadsheet = SpreadsheetApp.create(fileName);
  console.log(`📊 新規スプレッドシート作成: ${spreadsheet.getUrl()}`);
  return spreadsheet;
}

/**
 * シートを取得または作成
 */
function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

// =============================================================================
// 5. Slack通知機能
// =============================================================================

/**
 * Slack通知（デモ版）
 */
function notifySlackDemo(orderData) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  
  if (webhookUrl && webhookUrl !== 'YOUR_SLACK_WEBHOOK_URL') {
    // 実際のSlack通知
    notifySlackReal(orderData, webhookUrl);
  } else {
    // 模擬通知（ログ出力）
    notifySlackMock(orderData);
  }
}

/**
 * 実際のSlack通知
 */
function notifySlackReal(orderData, webhookUrl) {
  const message = {
    text: `🎉 新規受注のお知らせ`,
    attachments: [{
      color: 'good',
      fields: [
        { title: '会社名', value: orderData.company, short: true },
        { title: '担当者', value: orderData.contact, short: true },
        { title: '注文番号', value: orderData.order_number, short: true },
        { title: '合計金額', value: `¥${orderData.total.toLocaleString()}`, short: true },
        { title: '納期', value: orderData.delivery_date, short: true },
        { title: '商品点数', value: `${orderData.items.length}品目`, short: true }
      ],
      footer: 'PDF自動処理システム',
      ts: Math.floor(Date.now() / 1000)
    }]
  };
  
  try {
    UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(message)
    });
    console.log("✅ Slack通知送信完了");
  } catch (error) {
    console.error("❌ Slack通知エラー:", error);
    notifySlackMock(orderData); // フォールバック
  }
}

/**
 * Slack通知の模擬版
 */
function notifySlackMock(orderData) {
  console.log("📢 Slack通知（模擬）:");
  console.log(`🎉 新規受注のお知らせ`);
  console.log(`会社名: ${orderData.company}`);
  console.log(`担当者: ${orderData.contact}`);
  console.log(`注文番号: ${orderData.order_number}`);
  console.log(`合計金額: ¥${orderData.total.toLocaleString()}`);
  console.log(`納期: ${orderData.delivery_date}`);
  console.log(`処理時間: ${new Date().toLocaleTimeString()}`);
}

// =============================================================================
// 6. Gmail自動返信機能
// =============================================================================

/**
 * 顧客への自動返信（デモ版）
 */
function sendCustomerEmailDemo(orderData) {
  if (orderData.contact_email && orderData.contact_email !== 'yamada@sample-corp.co.jp') {
    // 実際のメール送信
    sendCustomerEmailReal(orderData);
  } else {
    // 模擬メール送信
    sendCustomerEmailMock(orderData);
  }
}

/**
 * 実際の顧客メール送信
 */
function sendCustomerEmailReal(orderData) {
  const subject = `【受注確認】${orderData.company}様 ご注文ありがとうございます`;
  const body = createCustomerEmailBody(orderData);
  
  try {
    GmailApp.sendEmail(orderData.contact_email, subject, body);
    console.log(`✅ 顧客メール送信完了: ${orderData.contact_email}`);
  } catch (error) {
    console.error("❌ メール送信エラー:", error);
    sendCustomerEmailMock(orderData); // フォールバック
  }
}

/**
 * 顧客メール送信の模擬版
 */
function sendCustomerEmailMock(orderData) {
  console.log("📧 顧客メール送信（模擬）:");
  console.log(`宛先: ${orderData.contact_email}`);
  console.log(`件名: 【受注確認】${orderData.company}様 ご注文ありがとうございます`);
  console.log("本文:");
  console.log(createCustomerEmailBody(orderData));
}

/**
 * 顧客メールの本文を作成
 */
function createCustomerEmailBody(orderData) {
  const itemList = orderData.items.map(item => 
    `・${item.name}（${item.code}）: ${item.quantity}個 × ¥${item.price.toLocaleString()} = ¥${item.subtotal.toLocaleString()}`
  ).join('\n');
  
  return `${orderData.company} ${orderData.contact}様

いつもお世話になっております。

この度は貴重なご注文をいただき、誠にありがとうございます。
以下の内容で承りました。

■ご注文内容
注文番号: ${orderData.order_number}
注文日: ${orderData.order_date}

${itemList}

合計金額: ¥${orderData.total.toLocaleString()}（税込）
ご希望納期: ${orderData.delivery_date}

詳細につきましては、改めて担当者よりご連絡いたします。
ご不明な点がございましたら、お気軽にお問い合わせください。

今後ともよろしくお願いいたします。

---
このメールは自動送信されています。
PDF自動処理システム`;
}

// =============================================================================
// 7. ユーティリティ機能
// =============================================================================

/**
 * デモ実行結果をログとして記録
 */
function logDemoResult(status, message) {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    const logSheet = getOrCreateSheet(spreadsheet, 'デモログ');
    
    // ヘッダーがない場合は作成
    if (logSheet.getLastRow() === 0) {
      const headers = ['実行日時', 'ステータス', 'メッセージ'];
      logSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      logSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    }
    
    const row = [new Date(), status, message];
    logSheet.appendRow(row);
    
    // ステータスに応じて色分け
    const lastRow = logSheet.getLastRow();
    const color = status === '成功' ? '#e8f5e8' : '#ffe8e8';
    logSheet.getRange(lastRow, 1, 1, row.length).setBackground(color);
    
  } catch (error) {
    console.error("ログ記録エラー:", error);
  }
}

/**
 * デモ用設定の初期化
 */
function setupDemo() {
  console.log("=== デモ環境セットアップ開始 ===");
  
  try {
    // スプレッドシート作成
    const spreadsheet = getOrCreateSpreadsheet();
    console.log(`✅ スプレッドシート準備完了: ${spreadsheet.getUrl()}`);
    
    // 必要なフォルダをチェック（存在しない場合はログに記録）
    checkRequiredFolders();
    
    console.log("✅ デモ環境セットアップ完了");
    console.log("次のステップ:");
    console.log("1. demoProcessOrder() を実行してデモを開始");
    console.log("2. Slack通知を有効にするには SLACK_WEBHOOK_URL を設定");
    console.log("3. 実際のメール送信テストを行う場合は適切なメールアドレスを設定");
    
  } catch (error) {
    console.error("❌ セットアップエラー:", error);
  }
}

/**
 * 必要なフォルダの存在確認
 */
function checkRequiredFolders() {
  const requiredFolders = ['AI受注処理', '処理済み'];
  
  requiredFolders.forEach(folderName => {
    const folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      console.log(`✅ フォルダ確認: ${folderName}`);
    } else {
      console.log(`⚠️  フォルダ未作成: ${folderName}`);
    }
  });
}

/**
 * 設定値の確認
 */
function checkConfiguration() {
  console.log("=== 設定確認 ===");
  
  const properties = PropertiesService.getScriptProperties();
  const slackUrl = properties.getProperty('SLACK_WEBHOOK_URL');
  
  console.log(`Slack Webhook: ${slackUrl ? '設定済み' : '未設定'}`);
  
  // Gmail API権限の確認
  try {
    const labels = Gmail.Users.Labels.list('me');
    console.log("✅ Gmail API権限: 利用可能");
  } catch (error) {
    console.log("⚠️  Gmail API権限: 未設定または利用不可");
  }
}

// =============================================================================
// 8. 管理者向け機能
// =============================================================================

/**
 * テストデータをクリア
 */
function clearDemoData() {
  try {
    const spreadsheet = getOrCreateSpreadsheet();
    
    // 受注管理台帳をクリア
    const mainSheet = spreadsheet.getSheetByName('受注管理台帳');
    if (mainSheet && mainSheet.getLastRow() > 1) {
      mainSheet.getRange(2, 1, mainSheet.getLastRow() - 1, mainSheet.getLastColumn()).clear();
      console.log("✅ 受注管理台帳クリア完了");
    }
    
    // デモログをクリア
    const logSheet = spreadsheet.getSheetByName('デモログ');
    if (logSheet && logSheet.getLastRow() > 1) {
      logSheet.getRange(2, 1, logSheet.getLastRow() - 1, logSheet.getLastColumn()).clear();
      console.log("✅ デモログクリア完了");
    }
    
    console.log("✅ デモデータクリア完了");
    
  } catch (error) {
    console.error("❌ データクリアエラー:", error);
  }
}

// =============================================================================
// 9. 実行用メニュー関数
// =============================================================================

/**
 * Google Apps Scriptのメニューから実行可能な関数群
 */

// メイン実行
function メイン_デモ実行() {
  demoProcessOrder();
}

// セットアップ
function セットアップ_初期設定() {
  setupDemo();
}

// 設定確認
function 管理_設定確認() {
  checkConfiguration();
}

// データクリア
function 管理_データクリア() {
  clearDemoData();
}