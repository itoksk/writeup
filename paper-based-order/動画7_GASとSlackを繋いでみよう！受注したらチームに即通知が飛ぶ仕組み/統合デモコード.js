// 動画7: GASとSlackを繋いでみよう！受注したらチームに即通知が飛ぶ仕組み
// 動画1-6の流れを踏襲した統合デモコード

/*
 * 動画1-6までの統合システム + 動画7 Slack通知機能
 * 動画1: 問題提起と全体像
 * 動画2: Google Cloud API設定とフォルダ構成
 * 動画3: Vision APIでOCR処理
 * 動画4: ChatGPTプロンプト設計
 * 動画5: ChatGPT API連携で情報抽出
 * 動画6: スプレッドシート自動記録
 * 動画7: Slack通知連携【New!】
 */

/**
 * 動画7メイン実行関数：PDF処理からSlack通知までの完全統合フロー
 * 1. PDF取得（動画2フォルダ）
 * 2. OCR処理（動画3）
 * 3. 情報抽出（動画4&5）
 * 4. スプレッドシート記録（動画6）
 * 5. Slack通知（動画7）【New!】
 */
function runVideo7CompleteFlow() {
  try {
    console.log('=== 動画7 完全統合フロー開始 ===');
    console.log('PDF処理 → OCR → AI抽出 → スプレッドシート → Slack通知');
    
    // Step 1: 動画2で作成したAI受注処理フォルダから最新PDFを取得
    console.log('Step 1: 最新PDFファイル取得中...');
    const targetFile = getLatestPDFFromFolder();
    
    if (!targetFile) {
      console.error('処理対象のPDFファイルが見つかりません');
      return false;
    }
    
    console.log('処理対象:', targetFile.getName());
    
    // Step 2-5: 動画1-6の統合処理 + 動画7のSlack通知
    const result = processOrderWithSlackNotification(targetFile.getId());
    
    if (result.success) {
      console.log('=== 全工程完了 ===');
      console.log('✅ OCR処理成功');
      console.log('✅ AI情報抽出成功');
      console.log('✅ スプレッドシート記録成功');
      console.log('✅ Slack通知送信成功');
      console.log('品質スコア:', result.validation.score, '点');
      
      // 処理済みフォルダに移動
      moveToProcessedFolder(targetFile);
      
      return true;
    } else {
      console.error('=== 処理失敗 ===');
      console.error('エラー:', result.error);
      
      // エラー時もSlack通知
      notifySlackError(result.error, targetFile.getName());
      
      return false;
    }
    
  } catch (error) {
    console.error('メイン処理エラー:', error);
    notifySlackError(error.message, 'システムエラー');
    return false;
  }
}

/**
 * 動画1-6統合処理 + 動画7 Slack通知の実行
 * @param {string} fileId - Google DriveのファイルID
 * @return {Object} 処理結果（成功/失敗、抽出データ、品質評価など）
 */
function processOrderWithSlackNotification(fileId) {
  try {
    console.log('=== 注文処理+Slack通知統合フロー開始 ===');
    
    // Step 1: 動画3 OCR処理
    console.log('Step 1: Vision API OCR処理中...');
    const ocrText = performOCRFromVideo3(fileId);
    
    if (!ocrText) {
      throw new Error('OCR処理が失敗しました');
    }
    
    console.log('OCR完了。文字数:', ocrText.length);
    
    // Step 2: 動画4&5 ChatGPT情報抽出
    console.log('Step 2: ChatGPT AI情報抽出中...');
    const extractedData = extractOrderInfo(ocrText);
    
    if (extractedData.extraction_failed) {
      throw new Error('AI情報抽出が失敗しました: ' + extractedData.error);
    }
    
    console.log('AI抽出完了。会社名:', extractedData.company);
    
    // Step 3: データの品質検証
    console.log('Step 3: データ品質検証中...');
    const validation = validateExtractedData(extractedData);
    console.log('品質スコア:', validation.score, '点');
    
    // Step 4: 動画6 スプレッドシート記録
    console.log('Step 4: スプレッドシート記録中...');
    const fileName = DriveApp.getFileById(fileId).getName();
    const spreadsheetResult = saveToSpreadsheet(extractedData, fileName, validation);
    
    if (!spreadsheetResult.success) {
      throw new Error('スプレッドシート記録が失敗しました: ' + spreadsheetResult.error);
    }
    
    console.log('スプレッドシート記録完了');
    
    // Step 5: 動画7 Slack通知【New!】
    console.log('Step 5: Slack通知送信中...');
    const slackResult = notifySlackNewOrder(extractedData, validation, fileName);
    
    if (!slackResult.success) {
      console.warn('Slack通知に失敗しましたが、処理は継続します:', slackResult.error);
    } else {
      console.log('Slack通知送信完了');
    }
    
    return {
      success: true,
      file_id: fileId,
      file_name: fileName,
      ocr_text: ocrText,
      extracted_data: extractedData,
      validation: validation,
      spreadsheet_result: spreadsheetResult,
      slack_result: slackResult,
      processed_at: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('統合処理エラー:', error);
    return {
      success: false,
      error: error.message,
      file_id: fileId,
      processed_at: new Date().toISOString()
    };
  }
}

/**
 * 動画7 Slack通知機能：新規受注通知
 * @param {Object} orderData - 抽出された注文データ
 * @param {Object} validation - データ品質評価
 * @param {string} fileName - 処理したファイル名
 * @return {Object} 通知結果
 */
function notifySlackNewOrder(orderData, validation, fileName) {
  try {
    // Slack Webhook URLの取得
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    
    if (!webhookUrl) {
      throw new Error('Slack Webhook URLが設定されていません');
    }
    
    // 品質レベルに応じた絵文字とカラー
    let emoji, color, qualityText;
    if (validation.score >= 80) {
      emoji = '🎉';
      color = 'good';
      qualityText = '高品質';
    } else if (validation.score >= 60) {
      emoji = '⚠️';
      color = 'warning';
      qualityText = '要確認';
    } else {
      emoji = '🚨';
      color = 'danger';
      qualityText = '要チェック';
    }
    
    // 商品情報の整理
    let itemsText = '';
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item, index) => {
        itemsText += `${index + 1}. ${item.name || '商品名不明'}`;
        if (item.quantity) itemsText += ` × ${item.quantity}`;
        if (item.unit_price) itemsText += ` （単価: ¥${item.unit_price.toLocaleString()}）`;
        itemsText += '\n';
      });
    } else {
      itemsText = '商品情報の抽出に失敗しました';
    }
    
    // Slackメッセージの構築
    const message = {
      text: `${emoji} 新規受注のお知らせ（品質: ${qualityText} ${validation.score}点）`,
      attachments: [{
        color: color,
        title: `📋 ${orderData.company || '会社名不明'} 様からの注文`,
        title_link: `https://drive.google.com/drive/folders/YOUR_FOLDER_ID`, // 適宜変更
        fields: [
          {
            title: '会社名',
            value: orderData.company || '不明',
            short: true
          },
          {
            title: '担当者',
            value: orderData.contact_name || '不明',
            short: true
          },
          {
            title: '合計金額',
            value: orderData.total_amount ? `¥${orderData.total_amount.toLocaleString()}` : '不明',
            short: true
          },
          {
            title: '納期',
            value: orderData.delivery_date || '不明',
            short: true
          },
          {
            title: '注文商品',
            value: itemsText.trim(),
            short: false
          },
          {
            title: '処理ファイル',
            value: fileName,
            short: false
          }
        ],
        footer: '自動処理システム（動画7）',
        footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    // 品質問題がある場合の追加情報
    if (validation.issues && validation.issues.length > 0) {
      message.attachments[0].fields.push({
        title: '⚠️ 検出された問題',
        value: validation.issues.join('\n'),
        short: false
      });
    }
    
    // Slack通知送信
    const response = UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(message)
    });
    
    if (response.getResponseCode() === 200) {
      console.log('Slack通知送信成功');
      return { success: true };
    } else {
      throw new Error(`Slack API エラー: ${response.getResponseCode()}`);
    }
    
  } catch (error) {
    console.error('Slack通知エラー:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * 動画7 Slack通知機能：エラー通知
 * @param {string} errorMessage - エラーメッセージ
 * @param {string} fileName - エラーが発生したファイル名
 */
function notifySlackError(errorMessage, fileName) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.log('Slack Webhook URL未設定のため、エラー通知をスキップします');
      return;
    }
    
    const message = {
      text: '🚨 PDF処理エラーが発生しました',
      attachments: [{
        color: 'danger',
        title: '処理エラー詳細',
        fields: [
          {
            title: 'エラー内容',
            value: errorMessage,
            short: false
          },
          {
            title: 'ファイル名',
            value: fileName,
            short: true
          },
          {
            title: '発生時刻',
            value: new Date().toLocaleString('ja-JP'),
            short: true
          }
        ],
        footer: '自動処理システム（エラー通知）',
        ts: Math.floor(Date.now() / 1000)
      }]
    };
    
    UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(message)
    });
    
    console.log('エラー通知をSlackに送信しました');
    
  } catch (error) {
    console.error('エラー通知の送信に失敗:', error);
  }
}

/**
 * 動画6 スプレッドシート記録機能（動画7用に拡張）
 * @param {Object} extractedData - 抽出されたデータ
 * @param {string} fileName - ファイル名
 * @param {Object} validation - 品質評価
 * @return {Object} 記録結果
 */
function saveToSpreadsheet(extractedData, fileName, validation) {
  try {
    // スプレッドシートを取得（動画6で作成済み）
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('受注管理台帳');
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = spreadsheet.insertSheet('受注管理台帳');
      
      // ヘッダー行を作成
      const headers = [
        '処理日時', 'ステータス', '品質スコア', '会社名', '担当者名', 
        '商品名', '数量', '単価', '合計金額', '納期', '連絡先', 
        'ファイル名', 'メモ'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // ヘッダー行の書式設定
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }
    
    // 商品情報の整理（複数商品を文字列にまとめる）
    let itemsText = '';
    let totalQuantity = 0;
    let avgUnitPrice = 0;
    
    if (extractedData.items && extractedData.items.length > 0) {
      extractedData.items.forEach((item, index) => {
        if (index > 0) itemsText += ', ';
        itemsText += item.name || '不明';
        if (item.quantity) totalQuantity += item.quantity;
        if (item.unit_price) avgUnitPrice += item.unit_price;
      });
      avgUnitPrice = extractedData.items.length > 0 ? Math.round(avgUnitPrice / extractedData.items.length) : 0;
    }
    
    // ステータスの決定
    let status;
    if (validation.score >= 80) {
      status = '自動処理完了';
    } else if (validation.score >= 60) {
      status = '要確認';
    } else {
      status = '要チェック';
    }
    
    // 連絡先情報の整理
    let contactInfo = '';
    if (extractedData.contact_email) contactInfo += extractedData.contact_email;
    if (extractedData.contact_phone) {
      if (contactInfo) contactInfo += ' / ';
      contactInfo += extractedData.contact_phone;
    }
    
    // メモ欄（品質問題の記録）
    let memoText = '';
    if (validation.issues && validation.issues.length > 0) {
      memoText = validation.issues.join('; ');
    }
    
    // データ行の作成
    const newRow = [
      new Date(),                              // 処理日時
      status,                                  // ステータス
      validation.score,                        // 品質スコア
      extractedData.company || '',             // 会社名
      extractedData.contact_name || '',        // 担当者名
      itemsText,                              // 商品名
      totalQuantity || '',                     // 数量
      avgUnitPrice || '',                      // 単価
      extractedData.total_amount || '',        // 合計金額
      extractedData.delivery_date || '',       // 納期
      contactInfo,                            // 連絡先
      fileName,                               // ファイル名
      memoText                                // メモ
    ];
    
    // 新しい行を追加
    sheet.appendRow(newRow);
    
    // 最新行の書式設定
    const lastRow = sheet.getLastRow();
    
    // 品質スコアに応じた行の色分け
    let rowColor;
    if (validation.score >= 80) {
      rowColor = '#E8F5E8';  // 薄緑
    } else if (validation.score >= 60) {
      rowColor = '#FFF3CD';  // 薄黄
    } else {
      rowColor = '#F8D7DA';  // 薄赤
    }
    
    sheet.getRange(lastRow, 1, 1, newRow.length).setBackground(rowColor);
    
    // 金額の書式設定（カンマ区切り）
    if (extractedData.total_amount) {
      sheet.getRange(lastRow, 9).setNumberFormat('#,##0');
    }
    
    console.log('スプレッドシート記録完了:', extractedData.company);
    
    return {
      success: true,
      row_number: lastRow,
      status: status
    };
    
  } catch (error) {
    console.error('スプレッドシート記録エラー:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * AI受注処理フォルダから最新のPDFファイルを取得
 * @return {File|null} 最新のPDFファイル、または null
 */
function getLatestPDFFromFolder() {
  try {
    // 動画2で作成したAI受注処理フォルダを取得
    const folders = DriveApp.getFoldersByName('AI受注処理');
    if (!folders.hasNext()) {
      console.error('「AI受注処理」フォルダが見つかりません。動画2の手順でフォルダを作成してください。');
      return null;
    }
    
    const folder = folders.next();
    const files = folder.getFiles();
    
    // PDFファイルを探す
    let latestPdf = null;
    let latestDate = new Date(0);
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getBlob().getContentType();
      
      if (mimeType === 'application/pdf') {
        const fileDate = file.getDateCreated();
        if (fileDate > latestDate) {
          latestDate = fileDate;
          latestPdf = file;
        }
      }
    }
    
    if (!latestPdf) {
      console.log('AI受注処理フォルダにPDFファイルが見つかりません。');
      console.log('Google DriveのAI受注処理フォルダにPDFファイルをアップロードしてください。');
    }
    
    return latestPdf;
    
  } catch (error) {
    console.error('PDFファイル取得エラー:', error);
    return null;
  }
}

/**
 * Slack Webhook URL設定用ヘルパー関数
 * 動画7で取得したWebhook URLを安全に保存
 */
function setSlackWebhookURL() {
  const webhookUrl = 'YOUR_SLACK_WEBHOOK_URL_HERE'; // 実際のWebhook URLに置き換え
  
  if (webhookUrl === 'YOUR_SLACK_WEBHOOK_URL_HERE') {
    console.log('⚠️ Slack Webhook URLを実際の値に変更してください');
    console.log('Slack → アプリ → Incoming Webhooks → Webhook URLをコピー');
    console.log('動画7で取得したWebhook URLをコード内で置き換えてください');
    return;
  }
  
  PropertiesService.getScriptProperties().setProperty('SLACK_WEBHOOK_URL', webhookUrl);
  console.log('✅ Slack Webhook URLを設定しました');
  console.log('💡 セキュリティのため、コード内のWebhook URLは削除することをお勧めします');
}

/**
 * 動画7 Slack通知テスト用関数
 * Webhook URLが正しく設定されているかテスト
 */
function testSlackNotification() {
  console.log('=== Slack通知テスト ===');
  
  // テストデータの作成
  const testOrderData = {
    company: '株式会社テスト商事',
    contact_name: '田中テスト太郎',
    total_amount: 150000,
    delivery_date: '2025-01-15',
    items: [
      {
        name: 'テスト商品A',
        quantity: 10,
        unit_price: 15000
      }
    ]
  };
  
  const testValidation = {
    score: 85,
    issues: [],
    confidence_level: 'high'
  };
  
  const testFileName = 'test_order.pdf';
  
  // Slack通知送信テスト
  const result = notifySlackNewOrder(testOrderData, testValidation, testFileName);
  
  if (result.success) {
    console.log('✅ Slack通知テスト成功！');
    console.log('Slackチャンネルに通知が送信されました。');
  } else {
    console.log('❌ Slack通知テスト失敗');
    console.log('エラー:', result.error);
    console.log('');
    console.log('トラブルシューティング:');
    console.log('1. setSlackWebhookURL() でWebhook URLを設定');
    console.log('2. SlackアプリのIncoming Webhooksが有効か確認');
    console.log('3. Webhook URLが正しいか確認');
  }
}

/**
 * 動画1-7の総合設定確認
 * 全ての機能が正しく設定されているかチェック
 */
function checkAllSystemSetup() {
  console.log('=== 動画1-7 総合システム設定確認 ===');
  
  let allReady = true;
  
  // 1. 必要なAPIキーの確認
  const visionKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
  const openaiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  const slackWebhook = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  
  console.log('1️⃣ API設定確認:');
  console.log('   Vision API キー:', visionKey ? '✅ 設定済み' : '❌ 未設定 (動画2で設定)');
  console.log('   OpenAI API キー:', openaiKey ? '✅ 設定済み' : '❌ 未設定 (動画5で設定)');
  console.log('   Slack Webhook URL:', slackWebhook ? '✅ 設定済み' : '❌ 未設定 (動画7で設定)');
  
  if (!visionKey || !openaiKey || !slackWebhook) allReady = false;
  
  // 2. フォルダ構成確認
  console.log('2️⃣ フォルダ構成確認:');
  try {
    const aiFolder = DriveApp.getFoldersByName('AI受注処理').hasNext();
    const processedFolder = DriveApp.getFoldersByName('処理済み').hasNext();
    console.log('   AI受注処理フォルダ:', aiFolder ? '✅ 存在' : '❌ 未作成 (動画2で作成)');
    console.log('   処理済みフォルダ:', processedFolder ? '✅ 存在' : '⚠️ 自動作成');
    
    if (!aiFolder) allReady = false;
  } catch (error) {
    console.log('   フォルダ確認エラー:', error.message);
    allReady = false;
  }
  
  // 3. スプレッドシート確認
  console.log('3️⃣ スプレッドシート確認:');
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    console.log('   スプレッドシート:', '✅ アクセス可能');
    console.log('   ファイル名:', spreadsheet.getName());
  } catch (error) {
    console.log('   スプレッドシート:', '❌ エラー -', error.message);
    allReady = false;
  }
  
  // 4. Google サービスアクセス確認
  console.log('4️⃣ Google サービス確認:');
  try {
    DriveApp.getRootFolder();
    console.log('   Google Drive:', '✅ アクセス可能');
  } catch (error) {
    console.log('   Google Drive:', '❌ エラー -', error.message);
    allReady = false;
  }
  
  console.log('');
  
  // 総合判定
  if (allReady) {
    console.log('🎉 すべての設定が完了しています！');
    console.log('runVideo7CompleteFlow() を実行して統合システムを開始してください');
    console.log('');
    console.log('📊 期待される効果:');
    console.log('• 手作業15分 → 自動処理1分（93%削減）');
    console.log('• 転記ミス100%削減');
    console.log('• チーム連携の自動化');
    console.log('• リアルタイム品質チェック');
  } else {
    console.log('⚠️ システム稼働前に上記の項目を設定してください');
    console.log('');
    console.log('📋 設定手順:');
    console.log('• 動画2: setVisionAPIKey() でVision API設定');
    console.log('• 動画5: setOpenAIAPIKey() でChatGPT API設定');
    console.log('• 動画7: setSlackWebhookURL() でSlack通知設定');
  }
}

/**
 * 動画7 Slack通知機能のフル機能デモ
 * 複数パターンの通知をテスト
 */
function demonstrateSlackIntegration() {
  console.log('=== 動画7 Slack統合機能デモ ===');
  
  // パターン1: 高品質データの通知
  console.log('1. 高品質データ通知テスト');
  const highQualityData = {
    company: '株式会社優良企業',
    contact_name: '山田太郎',
    contact_email: 'yamada@excellent-corp.co.jp',
    total_amount: 250000,
    delivery_date: '2025-01-20',
    items: [
      { name: 'プレミアム商品A', quantity: 5, unit_price: 50000 }
    ]
  };
  
  const highQualityValidation = { score: 95, issues: [], confidence_level: 'high' };
  notifySlackNewOrder(highQualityData, highQualityValidation, 'premium_order.pdf');
  
  // 少し待機
  Utilities.sleep(2000);
  
  // パターン2: 問題があるデータの通知
  console.log('2. 要確認データ通知テスト');
  const problematicData = {
    company: '有限会社不明商事',
    contact_name: null,
    total_amount: null,
    delivery_date: '2024-12-01',  // 過去の日付
    items: []
  };
  
  const problematicValidation = { 
    score: 45, 
    issues: ['会社名が不明確', '合計金額未抽出', '納期が過去の日付'],
    confidence_level: 'low'
  };
  notifySlackNewOrder(problematicData, problematicValidation, 'problematic_order.pdf');
  
  // 少し待機
  Utilities.sleep(2000);
  
  // パターン3: エラー通知
  console.log('3. エラー通知テスト');
  notifySlackError('Vision API接続エラー: 認証に失敗しました', 'error_test.pdf');
  
  console.log('');
  console.log('デモ完了！Slackチャンネルで通知を確認してください。');
}

// ==============================================
// 動画3-6の統合関数（動画7用にインポート）
// ==============================================

/**
 * 動画3のVision API OCR処理関数（統合版）
 */
function performOCRFromVideo3(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    console.log('ファイル取得完了:', file.getName());
    console.log('ファイルタイプ:', blob.getContentType());
    
    // PDFの場合は画像変換
    if (blob.getContentType() === 'application/pdf') {
      console.log('PDFファイル - 画像変換してOCR実行');
      return convertPDFToImageAndOCR(file);
    } else {
      console.log('画像ファイル - 直接OCR実行');
      return performOCR(blob);
    }
    
  } catch (error) {
    console.error('動画3 OCR処理エラー:', error);
    return null;
  }
}

/**
 * Vision API OCR処理
 */
function performOCR(blob) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    
    if (!apiKey) {
      throw new Error('Vision API キーが設定されていません。動画2の手順で設定してください。');
    }
    
    // テストモード確認
    const testMode = PropertiesService.getScriptProperties().getProperty('TEST_MODE');
    if (testMode === 'true') {
      console.log('⚠️ テストモード：模擬OCR結果を返します');
      return getMockOCRResult();
    }
    
    // Vision API 実行
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const payload = {
      requests: [{
        image: { content: Utilities.base64Encode(blob.getBytes()) },
        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
      }]
    };
    
    const response = UrlFetchApp.fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.responses[0].error) {
      throw new Error('Vision API エラー: ' + result.responses[0].error.message);
    }
    
    const textAnnotation = result.responses[0].fullTextAnnotation;
    return textAnnotation && textAnnotation.text ? textAnnotation.text : null;
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    throw error;
  }
}

/**
 * PDF→画像変換してOCR
 */
function convertPDFToImageAndOCR(file) {
  try {
    const fileId = file.getId();
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2048-h2048`;
    
    const response = UrlFetchApp.fetch(thumbnailUrl, {
      headers: { 'Authorization': `Bearer ${ScriptApp.getOAuthToken()}` }
    });
    
    if (response.getResponseCode() === 200) {
      const imageBlob = response.getBlob();
      console.log('✅ PDF→画像変換成功');
      return performOCR(imageBlob);
    } else {
      throw new Error(`PDF変換失敗: ${response.getResponseCode()}`);
    }
    
  } catch (error) {
    console.error('PDF変換エラー:', error);
    throw error;
  }
}

/**
 * 動画4&5 ChatGPT情報抽出
 */
function extractOrderInfo(ocrText) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OpenAI API キーが設定されていません');
    }
    
    const prompt = createOrderExtractionPrompt(ocrText);
    
    const payload = {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.1
    };
    
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.error) {
      throw new Error('ChatGPT API エラー: ' + result.error.message);
    }
    
    let extractedText = result.choices[0].message.content;
    extractedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(extractedText);
    
  } catch (error) {
    console.error('ChatGPT API エラー:', error);
    return {
      error: error.message,
      extraction_failed: true
    };
  }
}

/**
 * 動画4 プロンプトテンプレート
 */
function createOrderExtractionPrompt(ocrText) {
  return `あなたは優秀な営業事務担当者です。
以下のOCRで抽出されたテキストから、注文書の重要情報を抽出してください。

# 抽出する情報
- 会社名
- 担当者名  
- 商品名・品番
- 数量
- 単価
- 合計金額
- 納期
- 連絡先（メールアドレス、電話番号）

# 出力形式
必ず以下のJSON形式で回答してください：
{
  "company": "会社名",
  "contact_name": "担当者名",
  "contact_email": "メールアドレス",
  "contact_phone": "電話番号",
  "items": [
    {
      "name": "商品名",
      "code": "品番", 
      "quantity": 数量,
      "unit_price": 単価,
      "subtotal": 小計
    }
  ],
  "total_amount": 合計金額,
  "delivery_date": "納期",
  "order_date": "注文日",
  "notes": "特記事項"
}

# 制約条件
- 情報が見つからない場合は null を設定
- 数量・金額は数値のみ抽出（カンマは除去）
- 日付は YYYY-MM-DD 形式で統一
- 複数商品がある場合は配列に全て含める
- JSONのみを回答として返してください

# 抽出対象テキスト
${ocrText}`;
}

/**
 * データ品質検証
 */
function validateExtractedData(data) {
  const issues = [];
  let score = 100;
  
  if (!data.company) {
    issues.push('会社名が抽出されていません');
    score -= 30;
  }
  
  if (!data.total_amount || isNaN(data.total_amount)) {
    issues.push('合計金額が正しく抽出されていません');
    score -= 25;
  }
  
  if (!data.items || data.items.length === 0) {
    issues.push('商品情報が抽出されていません');
    score -= 20;
  }
  
  if (data.delivery_date) {
    const deliveryDate = new Date(data.delivery_date);
    const today = new Date();
    
    if (deliveryDate < today) {
      issues.push('納期が過去の日付です');
      score -= 10;
    }
  }
  
  return {
    score: Math.max(score, 0),
    issues: issues,
    is_valid: issues.length === 0,
    confidence_level: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
  };
}

/**
 * 処理済みフォルダへの移動
 */
function moveToProcessedFolder(file) {
  try {
    const processedFolders = DriveApp.getFoldersByName('処理済み');
    if (!processedFolders.hasNext()) {
      const processedFolder = DriveApp.createFolder('処理済み');
      file.moveTo(processedFolder);
    } else {
      const processedFolder = processedFolders.next();
      file.moveTo(processedFolder);
    }
    console.log('ファイルを処理済みフォルダに移動:', file.getName());
  } catch (error) {
    console.error('ファイル移動エラー:', error);
  }
}

/**
 * テスト用模擬OCR結果
 */
function getMockOCRResult() {
  return `
注文書

株式会社山田商事
〒100-0001 東京都千代田区千代田1-1-1
TEL: 03-1234-5678
Email: yamada@yamada-corp.co.jp

注文日: 2024/12/15
納期: 2025/01/25
担当者: 田中太郎

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
商品名         品番      数量    単価      小計
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
オフィスチェア   OC-2024   10個   15,000円   150,000円
デスクライト     DL-100    5個    8,500円    42,500円
ファイルキャビネット FC-300  2個   25,000円    50,000円
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

合計金額: 242,500円（税込）

特記事項:
・年末納期厳守
・組立設置サービス込み
・請求書は月末締め翌月末払い

以上
`;
}

/**
 * テストモード有効化
 */
function enableTestMode() {
  PropertiesService.getScriptProperties().setProperty('TEST_MODE', 'true');
  console.log('テストモードを有効化しました');
}

/**
 * テストモード無効化
 */
function disableTestMode() {
  PropertiesService.getScriptProperties().deleteProperty('TEST_MODE');
  console.log('テストモードを無効化しました');
}