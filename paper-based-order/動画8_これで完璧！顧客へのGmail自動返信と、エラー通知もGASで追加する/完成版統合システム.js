// 動画8: 完成版統合システム - 全機能統合コード
// 動画1-7の全機能を統合した最終版システム

/**
 * メイン自動実行関数：フォルダ監視と自動処理
 * 定期実行（トリガー設定）またはフォルダ変更時に実行
 */
function autoProcessNewOrders() {
  try {
    console.log('=== 自動処理開始 ===');
    
    // AI受注処理フォルダから新しいPDFファイルを取得
    const newFiles = getNewOrderFiles();
    
    if (newFiles.length === 0) {
      console.log('新しい注文書はありません');
      return;
    }
    
    console.log(`${newFiles.length}件の新しい注文書を発見`);
    
    // 各ファイルを処理
    newFiles.forEach(file => {
      console.log(`処理開始: ${file.getName()}`);
      processOrderPDF(file.getId());
    });
    
  } catch (error) {
    console.error('自動処理エラー:', error);
    handleSystemError(error);
  }
}

/**
 * 新しい注文書ファイルを取得
 * @returns {GoogleAppsScript.Drive.File[]} 新しいPDFファイルの配列
 */
function getNewOrderFiles() {
  try {
    const folders = DriveApp.getFoldersByName('AI受注処理');
    
    if (!folders.hasNext()) {
      // フォルダが存在しない場合は作成
      DriveApp.createFolder('AI受注処理');
      console.log('AI受注処理フォルダを作成しました');
      return [];
    }
    
    const folder = folders.next();
    const files = folder.getFilesByType(MimeType.PDF);
    const newFiles = [];
    
    while (files.hasNext()) {
      const file = files.next();
      // 最近作成されたファイル（24時間以内）を対象
      const createdTime = file.getDateCreated();
      const now = new Date();
      const timeDiff = now.getTime() - createdTime.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      
      if (hoursDiff <= 24) {
        newFiles.push(file);
      }
    }
    
    return newFiles;
    
  } catch (error) {
    console.error('ファイル取得エラー:', error);
    return [];
  }
}

/**
 * メイン処理：PDF注文書の完全自動処理
 * 動画1-7の全機能を統合した完成版
 * @param {string} fileId - Google DriveのファイルID
 */
function processOrderPDF(fileId) {
  let processingLog = [];
  const startTime = new Date();
  
  try {
    processingLog.push(`処理開始: ${startTime.toISOString()}`);
    
    // 1. ファイル情報取得（動画1-3の機能）
    const file = DriveApp.getFileById(fileId);
    const fileName = file.getName();
    processingLog.push(`ファイル取得: ${fileName}`);
    
    // 2. OCR処理（動画3の機能）
    processingLog.push('OCR処理開始');
    const ocrText = performOCR(file.getBlob());
    
    if (!ocrText) {
      throw new Error('OCR処理が失敗しました');
    }
    processingLog.push(`OCR処理完了: ${ocrText.length}文字抽出`);
    
    // 3. AI情報抽出（動画4-5の機能）
    processingLog.push('AI情報抽出開始');
    const orderData = extractOrderInfo(ocrText);
    
    if (orderData.extraction_failed) {
      throw new Error('情報抽出が失敗しました: ' + orderData.error);
    }
    processingLog.push('AI情報抽出完了');
    
    // 4. データ検証（動画6の機能）
    const validation = validateExtractedData(orderData);
    processingLog.push(`データ検証完了: スコア ${validation.score}`);
    
    // 5. スプレッドシートに保存（動画6の機能）
    processingLog.push('スプレッドシート保存開始');
    saveToSpreadsheet(orderData, fileName, validation);
    processingLog.push('スプレッドシート保存完了');
    
    // 6. Slack通知（動画7の機能）
    processingLog.push('Slack通知送信開始');
    notifySlack(orderData, validation);
    processingLog.push('Slack通知送信完了');
    
    // 7. 顧客への自動返信（動画8の新機能）
    if (orderData.contact_email) {
      processingLog.push('顧客メール送信開始');
      sendCustomerEmail(orderData);
      processingLog.push('顧客メール送信完了');
    }
    
    // 8. ファイルを処理済みフォルダに移動
    processingLog.push('ファイル移動開始');
    moveToProcessedFolder(file);
    processingLog.push('ファイル移動完了');
    
    // 9. 処理時間計算と完了ログ
    const endTime = new Date();
    const processingTime = (endTime.getTime() - startTime.getTime()) / 1000;
    const completionMessage = `注文処理完了: ${orderData.company || 'N/A'} - ${orderData.total_amount || 'N/A'}円 (処理時間: ${processingTime}秒)`;
    console.log(completionMessage);
    processingLog.push(completionMessage);
    
    // 成功通知をSlackに送信
    notifyProcessingSuccess(orderData, processingLog, processingTime);
    
  } catch (error) {
    // エラー時の緊急通知（動画8の拡張機能）
    console.error('注文処理エラー:', error);
    processingLog.push(`エラー発生: ${error.message}`);
    handleProcessingError(error, fileId, processingLog);
  }
}

/**
 * スプレッドシートへのデータ保存（拡張版）
 * @param {Object} orderData - 抽出された注文データ
 * @param {string} fileName - 元ファイル名
 * @param {Object} validation - 検証結果
 */
function saveToSpreadsheet(orderData, fileName, validation) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('受注管理台帳');
    
    if (!sheet) {
      throw new Error('受注管理台帳シートが見つかりません');
    }
    
    // 基本データ行の作成
    const row = [
      new Date(),                              // 処理日時
      validation.is_valid ? '完了' : '要確認',   // ステータス
      orderData.company || '不明',             // 会社名
      orderData.contact_name || '',            // 担当者
      orderData.items[0]?.name || '',          // 商品名（最初の1件）
      orderData.items[0]?.quantity || '',      // 数量
      orderData.total_amount || '',            // 合計金額
      fileName,                                // ファイル名
      validation.score,                        // 品質スコア
      orderData.delivery_date || '',           // 納期
      orderData.contact_email || '',           // メールアドレス
      orderData.contact_phone || ''            // 電話番号
    ];
    
    sheet.appendRow(row);
    
    // 品質スコアに応じて行の色を設定
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, row.length);
    
    if (validation.score >= 80) {
      range.setBackground('#d4edda'); // 緑（高品質）
    } else if (validation.score >= 60) {
      range.setBackground('#fff3cd'); // 黄（中品質）
    } else {
      range.setBackground('#f8d7da'); // 赤（低品質）
    }
    
  } catch (error) {
    console.error('スプレッドシート保存エラー:', error);
    throw error;
  }
}

/**
 * Slack通知（品質情報付き）
 * @param {Object} orderData - 注文データ
 * @param {Object} validation - 検証結果
 */
function notifySlack(orderData, validation) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    
    if (!webhookUrl) {
      console.log('Slack Webhook URLが設定されていません');
      return;
    }
    
    // 品質に応じた絵文字とメッセージ
    let emoji = '✅';
    let statusText = '正常処理';
    
    if (validation.score < 80) {
      emoji = '⚠️';
      statusText = '要確認';
    }
    
    if (validation.score < 60) {
      emoji = '🚨';
      statusText = '緊急確認';
    }
    
    const message = {
      text: `${emoji} 新規受注のお知らせ - ${statusText}`,
      attachments: [{
        color: validation.score >= 80 ? 'good' : validation.score >= 60 ? 'warning' : 'danger',
        fields: [
          { title: '会社名', value: orderData.company || '不明', short: true },
          { title: '金額', value: orderData.total_amount ? `¥${orderData.total_amount.toLocaleString()}` : '不明', short: true },
          { title: '商品', value: orderData.items[0]?.name || '不明', short: true },
          { title: '数量', value: orderData.items[0]?.quantity || '不明', short: true },
          { title: '納期', value: orderData.delivery_date || '不明', short: true },
          { title: '品質スコア', value: `${validation.score}/100`, short: true }
        ],
        footer: validation.issues.length > 0 ? `確認事項: ${validation.issues.join(', ')}` : '品質チェック: 問題なし'
      }]
    };
    
    UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(message)
    });
    
  } catch (error) {
    console.error('Slack通知エラー:', error);
  }
}

/**
 * 顧客への自動確認メール送信
 * @param {Object} orderData - 注文データ
 */
function sendCustomerEmail(orderData) {
  try {
    const subject = `【受注確認】${orderData.company}様 ご注文ありがとうございます`;
    
    // メール本文の構築
    let itemsText = '';
    if (orderData.items && orderData.items.length > 0) {
      itemsText = orderData.items.map(item => 
        `・${item.name} ${item.quantity}個 @¥${item.unit_price?.toLocaleString() || '未確定'}`
      ).join('\n');
    } else {
      itemsText = '詳細は後日ご連絡いたします';
    }
    
    const body = `${orderData.company} ${orderData.contact_name || 'ご担当者'}様

いつもお世話になっております。

この度は貴重なご注文をいただき、誠にありがとうございます。
以下の内容で承りました。

■ご注文内容
${itemsText}

合計金額: ¥${orderData.total_amount?.toLocaleString() || '後日確定'}
ご希望納期: ${orderData.delivery_date || '後日調整'}

■今後の流れ
1. 在庫確認・製造手配（1-2営業日）
2. 正式な納期回答（3営業日以内）
3. 製造・発送準備
4. 納品

詳細につきましては、改めて担当者よりご連絡いたします。
ご不明な点がございましたら、お気軽にお問い合わせください。

今後ともよろしくお願いいたします。

---
この確認メールは自動送信されています。
システムに関するお問い合わせ: system@yourcompany.com`;

    GmailApp.sendEmail(orderData.contact_email, subject, body);
    
  } catch (error) {
    console.error('顧客メール送信エラー:', error);
    throw error;
  }
}

/**
 * ファイルを処理済みフォルダに移動
 * @param {GoogleAppsScript.Drive.File} file - 移動するファイル
 */
function moveToProcessedFolder(file) {
  try {
    const processedFolders = DriveApp.getFoldersByName('処理済み');
    
    if (processedFolders.hasNext()) {
      const processedFolder = processedFolders.next();
      
      // 現在の親フォルダから削除
      const parents = file.getParents();
      while (parents.hasNext()) {
        const parent = parents.next();
        parent.removeFile(file);
      }
      
      // 処理済みフォルダに追加
      processedFolder.addFile(file);
      
    } else {
      console.log('処理済みフォルダが見つかりません');
    }
    
  } catch (error) {
    console.error('ファイル移動エラー:', error);
  }
}

/**
 * Vision API OCR処理（動画3の機能を統合）
 * @param {GoogleAppsScript.Base.Blob} blob - PDFファイルのBlob
 * @returns {string} 抽出されたテキスト
 */
function performOCR(blob) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    
    if (!apiKey) {
      throw new Error('Vision API キーが設定されていません');
    }
    
    // PDFを画像に変換（Googleのサムネイル機能を利用）
    const tempFile = DriveApp.createFile(blob);
    const thumbnailBlob = tempFile.getThumbnail();
    DriveApp.getFileById(tempFile.getId()).setTrashed(true);
    
    // Vision API呼び出し
    const base64Image = Utilities.base64Encode(thumbnailBlob.getBytes());
    
    const payload = {
      requests: [{
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }]
      }]
    };
    
    const response = UrlFetchApp.fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(payload)
      }
    );
    
    const result = JSON.parse(response.getContentText());
    
    if (result.responses && result.responses[0] && result.responses[0].textAnnotations) {
      return result.responses[0].textAnnotations[0].description;
    }
    
    throw new Error('テキストが検出されませんでした');
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    throw error;
  }
}

/**
 * ChatGPT API情報抽出（動画4-5の機能を統合）
 * @param {string} ocrText - OCRで抽出されたテキスト
 * @returns {Object} 抽出された注文情報
 */
function extractOrderInfo(ocrText) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OpenAI API キーが設定されていません');
    }
    
    // 動画4で設計されたプロンプトテンプレート
    const prompt = `以下の注文書のテキストから、必要な情報をJSON形式で抽出してください。

【抽出する項目】
- company: 会社名
- contact_name: 担当者名
- contact_email: メールアドレス
- contact_phone: 電話番号
- items: 商品情報の配列 [{ name: 商品名, quantity: 数量, unit_price: 単価 }]
- total_amount: 合計金額（数値）
- delivery_date: 納期
- order_date: 注文日
- notes: 特記事項

【注文書テキスト】
${ocrText}

【出力形式】
純粋なJSONのみを出力してください。説明文は不要です。
情報が不明な場合はnullまたは空文字列を設定してください。`;
    
    const payload = {
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: prompt
      }],
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
    
    if (result.choices && result.choices[0] && result.choices[0].message) {
      const content = result.choices[0].message.content.trim();
      return JSON.parse(content);
    }
    
    throw new Error('ChatGPT APIの応答が不正です');
    
  } catch (error) {
    console.error('情報抽出エラー:', error);
    return { extraction_failed: true, error: error.message };
  }
}

/**
 * データ検証（動画6の機能を統合）
 * @param {Object} orderData - 抽出されたデータ
 * @returns {Object} 検証結果
 */
function validateExtractedData(orderData) {
  const validation = {
    score: 0,
    is_valid: false,
    issues: []
  };
  
  // 必須項目チェック（各20点）
  if (orderData.company) validation.score += 20;
  else validation.issues.push('会社名不明');
  
  if (orderData.items && orderData.items.length > 0) validation.score += 20;
  else validation.issues.push('商品情報不明');
  
  if (orderData.total_amount) validation.score += 20;
  else validation.issues.push('金額不明');
  
  // 追加項目チェック（各10点）
  if (orderData.contact_name) validation.score += 10;
  if (orderData.contact_email) validation.score += 10;
  if (orderData.delivery_date) validation.score += 10;
  if (orderData.order_date) validation.score += 10;
  
  validation.is_valid = validation.score >= 60;
  
  return validation;
}

/**
 * 処理成功の詳細通知
 * @param {Object} orderData - 注文データ
 * @param {Array} processingLog - 処理ログ
 * @param {number} processingTime - 処理時間（秒）
 */
function notifyProcessingSuccess(orderData, processingLog, processingTime) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    
    if (!webhookUrl) return;
    
    const logText = processingLog.slice(-5).join('\n');
    
    const message = {
      text: '🎉 注文処理完了報告',
      attachments: [{
        color: 'good',
        title: `${orderData.company || '不明'} - 処理完了`,
        text: `金額: ¥${orderData.total_amount?.toLocaleString() || '不明'}\n処理時間: ${processingTime}秒\n処理ログ:\n${logText}`,
        footer: `処理時刻: ${new Date().toLocaleString()}`
      }]
    };
    
    UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(message)
    });
    
  } catch (error) {
    console.error('成功通知エラー:', error);
  }
}

/**
 * システム全体エラー処理
 * @param {Error} error - システムエラー
 */
function handleSystemError(error) {
  try {
    console.error('システムエラー:', error);
    
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
    
    // Slack緊急通知
    if (webhookUrl) {
      const message = {
        text: '🚨 システム全体エラー発生',
        attachments: [{
          color: 'danger',
          title: 'システム全体の異常 - 緊急確認必要',
          text: `エラー内容: ${error.message}\n発生時刻: ${new Date().toLocaleString()}`
        }]
      };
      
      UrlFetchApp.fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(message)
      });
    }
    
    // 管理者メール
    if (adminEmail) {
      GmailApp.sendEmail(
        adminEmail,
        '【緊急】PDF注文処理システム 全体エラー',
        `システム全体でエラーが発生しました。\n\nエラー: ${error.message}\nスタック: ${error.stack}`
      );
    }
    
  } catch (notificationError) {
    console.error('システムエラー通知失敗:', notificationError);
  }
}

/**
 * エラー処理・緊急通知（動画8の拡張機能）
 * @param {Error} error - 発生したエラー
 * @param {string} fileId - エラーが発生したファイルID
 * @param {Array} processingLog - 処理ログ
 */
function handleProcessingError(error, fileId, processingLog) {
  try {
    const errorDetails = {
      error_message: error.message,
      file_id: fileId,
      occurred_at: new Date().toISOString(),
      processing_log: processingLog,
      stack_trace: error.stack
    };
    
    // Slack緊急通知
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
    
    if (webhookUrl) {
      const message = {
        text: '🚨 注文処理エラー発生',
        attachments: [{
          color: 'danger',
          title: 'システムエラー - 緊急対応が必要です',
          fields: [
            { title: 'ファイルID', value: fileId, short: true },
            { title: 'エラー内容', value: error.message, short: false },
            { title: '発生時刻', value: new Date().toLocaleString(), short: true }
          ],
          text: `処理ログ:\n${processingLog.join('\n')}`
        }]
      };
      
      UrlFetchApp.fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(message)
      });
    }
    
    // 管理者への緊急メール通知（動画8の新機能）
    const adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
    
    if (adminEmail) {
      const subject = '【緊急】PDF注文処理システム エラー発生';
      const body = `PDF注文処理システムでエラーが発生しました。

エラー詳細:
${JSON.stringify(errorDetails, null, 2)}

至急確認をお願いします。`;
      
      GmailApp.sendEmail(adminEmail, subject, body);
    }
    
    // エラーログをスプレッドシートに記録
    logErrorToSpreadsheet(errorDetails);
    
  } catch (notificationError) {
    console.error('エラー通知の送信に失敗:', notificationError);
  }
}

/**
 * エラーログのスプレッドシート記録
 * @param {Object} errorDetails - エラー詳細
 */
function logErrorToSpreadsheet(errorDetails) {
  try {
    let errorSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('エラーログ');
    
    // エラーログシートが存在しない場合は作成
    if (!errorSheet) {
      errorSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('エラーログ');
      errorSheet.appendRow(['発生時刻', 'ファイルID', 'エラーメッセージ', '処理ログ', 'スタックトレース']);
    }
    
    errorSheet.appendRow([
      errorDetails.occurred_at,
      errorDetails.file_id,
      errorDetails.error_message,
      errorDetails.processing_log.join(' | '),
      errorDetails.stack_trace
    ]);
    
  } catch (error) {
    console.error('エラーログ記録失敗:', error);
  }
}

/**
 * 初期セットアップ：必要なフォルダとシートを自動作成（動画2の機能統合）
 */
function initialSystemSetup() {
  console.log('=== システム初期セットアップ開始 ===');
  
  try {
    // 1. 必要フォルダの作成
    createRequiredFolders();
    
    // 2. スプレッドシートのセットアップ
    setupSpreadsheets();
    
    // 3. システム設定の確認
    checkSystemConfiguration();
    
    console.log('✅ システム初期セットアップ完了');
    
  } catch (error) {
    console.error('❌ セットアップエラー:', error);
    throw error;
  }
}

/**
 * 必要フォルダの作成
 */
function createRequiredFolders() {
  const requiredFolders = ['AI受注処理', '処理済み'];
  
  requiredFolders.forEach(folderName => {
    const folders = DriveApp.getFoldersByName(folderName);
    if (!folders.hasNext()) {
      DriveApp.createFolder(folderName);
      console.log(`📁 ${folderName}フォルダを作成しました`);
    } else {
      console.log(`📁 ${folderName}フォルダは既に存在します`);
    }
  });
}

/**
 * スプレッドシートのセットアップ
 */
function setupSpreadsheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 受注管理台帳シートの作成
  let orderSheet = spreadsheet.getSheetByName('受注管理台帳');
  if (!orderSheet) {
    orderSheet = spreadsheet.insertSheet('受注管理台帳');
    orderSheet.appendRow([
      '処理日時', 'ステータス', '会社名', '担当者', '商品名',
      '数量', '合計金額', 'ファイル名', '品質スコア', '納期',
      'メールアドレス', '電話番号'
    ]);
    
    // ヘッダー行のフォーマット
    const headerRange = orderSheet.getRange(1, 1, 1, 12);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    console.log('📊 受注管理台帳シートを作成しました');
  }
  
  // エラーログシートの作成
  let errorSheet = spreadsheet.getSheetByName('エラーログ');
  if (!errorSheet) {
    errorSheet = spreadsheet.insertSheet('エラーログ');
    errorSheet.appendRow(['発生時刻', 'ファイルID', 'エラーメッセージ', '処理ログ', 'スタックトレース']);
    
    const headerRange = errorSheet.getRange(1, 1, 1, 5);
    headerRange.setBackground('#ea4335');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    console.log('📊 エラーログシートを作成しました');
  }
}

/**
 * システム管理用：各種設定値の一括設定
 */
function setupSystemConfiguration() {
  const properties = PropertiesService.getScriptProperties();
  
  // 設定項目の例（実際の値に置き換えてください）
  const configs = {
    'VISION_API_KEY': 'your_vision_api_key_here',
    'OPENAI_API_KEY': 'your_openai_api_key_here',
    'SLACK_WEBHOOK_URL': 'your_slack_webhook_url_here',
    'ADMIN_EMAIL': 'admin@yourcompany.com'
  };
  
  properties.setProperties(configs);
  console.log('✅ システム設定完了');
  
  // 設定確認
  checkSystemConfiguration();
}

/**
 * システム設定確認
 */
function checkSystemConfiguration() {
  const properties = PropertiesService.getScriptProperties();
  const requiredKeys = ['VISION_API_KEY', 'OPENAI_API_KEY', 'SLACK_WEBHOOK_URL', 'ADMIN_EMAIL'];
  
  console.log('=== システム設定確認 ===');
  requiredKeys.forEach(key => {
    const value = properties.getProperty(key);
    console.log(`${key}: ${value ? '✅ 設定済み' : '❌ 未設定'}`);
  });
}

/**
 * システム健全性チェック
 */
function systemHealthCheck() {
  console.log('=== システム健全性チェック ===');
  
  const checks = [
    { name: 'Vision API Key', check: () => PropertiesService.getScriptProperties().getProperty('VISION_API_KEY') },
    { name: 'OpenAI API Key', check: () => PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY') },
    { name: 'Slack Webhook', check: () => PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL') },
    { name: 'Admin Email', check: () => PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL') },
    { name: 'Drive Access', check: () => DriveApp.getRootFolder() },
    { name: 'Spreadsheet Access', check: () => SpreadsheetApp.getActiveSpreadsheet() },
    { name: 'AI受注処理フォルダ', check: () => DriveApp.getFoldersByName('AI受注処理').hasNext() },
    { name: '処理済みフォルダ', check: () => DriveApp.getFoldersByName('処理済み').hasNext() }
  ];
  
  checks.forEach(check => {
    try {
      const result = check.check();
      console.log(`✅ ${check.name}: ${result ? 'OK' : 'NG'}`);
    } catch (error) {
      console.log(`❌ ${check.name}: エラー - ${error.message}`);
    }
  });
}

/**
 * 定期実行トリガーの設定
 */
function setupTriggers() {
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // 5分間隔で自動処理を実行
  ScriptApp.newTrigger('autoProcessNewOrders')
    .timeBased()
    .everyMinutes(5)
    .create();
  
  console.log('✅ 自動実行トリガーを設定しました（5分間隔）');
}

/**
 * テスト用：サンプルデータでの動作確認
 */
function testWithSampleData() {
  console.log('=== サンプルデータテスト開始 ===');
  
  // サンプル注文データ
  const sampleOrderData = {
    company: '株式会社テストカンパニー',
    contact_name: '田中太郎',
    contact_email: 'tanaka@test-company.com',
    contact_phone: '03-1234-5678',
    items: [
      { name: 'テスト商品A', quantity: 10, unit_price: 1000 },
      { name: 'テスト商品B', quantity: 5, unit_price: 2000 }
    ],
    total_amount: 20000,
    delivery_date: '2024-01-15',
    order_date: '2024-01-01',
    notes: 'テスト注文です'
  };
  
  // データ検証テスト
  const validation = validateExtractedData(sampleOrderData);
  console.log('検証結果:', validation);
  
  // スプレッドシート保存テスト
  try {
    saveToSpreadsheet(sampleOrderData, 'test_order.pdf', validation);
    console.log('✅ スプレッドシート保存テスト成功');
  } catch (error) {
    console.error('❌ スプレッドシート保存テスト失敗:', error);
  }
  
  // Slack通知テスト
  try {
    notifySlack(sampleOrderData, validation);
    console.log('✅ Slack通知テスト送信');
  } catch (error) {
    console.error('❌ Slack通知テスト失敗:', error);
  }
  
  // 顧客メールテスト
  if (sampleOrderData.contact_email) {
    try {
      console.log('📧 顧客メールテスト（実際の送信はスキップ）');
      console.log('メール宛先:', sampleOrderData.contact_email);
      // sendCustomerEmail(sampleOrderData); // 実際の送信はコメントアウト
    } catch (error) {
      console.error('❌ 顧客メールテスト失敗:', error);
    }
  }
  
  console.log('=== サンプルデータテスト完了 ===');
}

/**
 * デモンストレーション用：完全なフロー実行
 */
function demonstrateCompleteFlow() {
  console.log('=== 完全フローデモンストレーション ===');
  
  // 1. システム初期セットアップ
  initialSystemSetup();
  
  // 2. システムヘルスチェック
  systemHealthCheck();
  
  // 3. サンプルデータテスト
  testWithSampleData();
  
  // 4. トリガー設定
  setupTriggers();
  
  console.log('🎉 完全フローデモンストレーション完了！');
  console.log('実際のファイル処理は autoProcessNewOrders() が自動実行します');
  console.log('手動テストは processOrderPDF("file_id") で実行可能です');
}