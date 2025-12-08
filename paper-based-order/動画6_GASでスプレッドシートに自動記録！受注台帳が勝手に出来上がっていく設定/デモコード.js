/**
 * 動画6: スプレッドシート自動記録システム
 * 動画1-5で構築した機能を統合し、完全自動化システムを完成させる
 */

// =============================================================================
// メイン統合処理関数（動画1-5の統合版）
// =============================================================================

/**
 * PDF注文書の完全自動処理（OCR → AI抽出 → スプレッドシート記録）
 * 動画6のメインデモ用統合関数
 */
function processOrderPDFComplete() {
  console.log('=== 動画6統合システム開始 ===');
  const startTime = new Date();
  
  try {
    // 1. 最新のPDFファイルを取得
    const latestFile = getLatestPDFFromFolder();
    if (!latestFile) {
      console.log('処理対象のPDFファイルが見つかりません');
      return;
    }
    
    console.log(`処理対象ファイル: ${latestFile.getName()}`);
    
    // 2. OCR処理（動画3の機能）
    console.log('OCR処理を開始...');
    const ocrText = performOCR(latestFile.getId());
    if (!ocrText) {
      throw new Error('OCR処理に失敗しました');
    }
    console.log('OCR処理完了');
    
    // 3. AI情報抽出（動画4-5の機能）
    console.log('AI情報抽出を開始...');
    const extractedData = extractOrderInfo(ocrText);
    if (!extractedData || extractedData.error) {
      throw new Error('AI情報抽出に失敗しました');
    }
    console.log('AI情報抽出完了');
    
    // 4. データ品質評価
    const qualityScore = calculateQualityScore(extractedData);
    console.log(`データ品質スコア: ${qualityScore}点`);
    
    // 5. スプレッドシートに自動記録（動画6の新機能）
    console.log('スプレッドシートに記録中...');
    const recordResult = saveToSpreadsheet(extractedData, latestFile.getName(), qualityScore);
    
    // 6. 処理済みフォルダに移動
    moveToProcessedFolder(latestFile);
    
    // 7. 処理時間計算
    const endTime = new Date();
    const processingTime = (endTime - startTime) / 1000;
    
    console.log(`=== 処理完了 ===`);
    console.log(`処理時間: ${processingTime}秒`);
    console.log(`会社名: ${extractedData.company}`);
    console.log(`記録行: ${recordResult.row}行目`);
    console.log('受注台帳が自動更新されました！');
    
    return {
      success: true,
      processingTime: processingTime,
      company: extractedData.company,
      qualityScore: qualityScore,
      recordRow: recordResult.row
    };
    
  } catch (error) {
    console.error('統合処理エラー:', error);
    // エラーログをスプレッドシートに記録
    logErrorToSpreadsheet(error, startTime);
    return { success: false, error: error.message };
  }
}

// =============================================================================
// スプレッドシート連携機能（動画6の核心機能）
// =============================================================================

/**
 * 抽出データをスプレッドシートに自動記録
 * 受注管理台帳への完全自動化記録システム
 */
function saveToSpreadsheet(extractedData, fileName, qualityScore) {
  console.log('スプレッドシート記録開始...');
  
  try {
    // アクティブなスプレッドシートを取得
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('受注管理台帳');
    
    // シートが存在しない場合は作成
    if (!sheet) {
      sheet = createOrderManagementSheet(spreadsheet);
    }
    
    // データ行を作成（12項目の詳細設計）
    const row = [
      new Date(),                           // A列: 処理日時
      getStatusByQualityScore(qualityScore), // B列: ステータス
      extractedData.company || '',          // C列: 会社名
      extractedData.contact_name || '',     // D列: 担当者名
      getMainProductName(extractedData.items), // E列: 商品名（主要商品）
      getTotalQuantity(extractedData.items),   // F列: 数量（合計）
      extractedData.total_amount || 0,      // G列: 合計金額
      qualityScore,                         // H列: 品質スコア
      extractedData.delivery_date || '',    // I列: 納期
      extractedData.contact_email || '',    // J列: メールアドレス
      extractedData.contact_phone || '',    // K列: 電話番号
      fileName                              // L列: ファイル名
    ];
    
    // 行を追加
    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();
    
    // 品質スコアに基づく色分け設定
    applyQualityColorCoding(sheet, lastRow, qualityScore);
    
    // 列幅自動調整
    sheet.autoResizeColumns(1, 12);
    
    console.log(`スプレッドシート記録完了: ${lastRow}行目`);
    
    return {
      success: true,
      row: lastRow,
      sheet: sheet.getName()
    };
    
  } catch (error) {
    console.error('スプレッドシート記録エラー:', error);
    throw new Error(`スプレッドシート記録失敗: ${error.message}`);
  }
}

/**
 * 受注管理台帳シートを作成（初回セットアップ用）
 */
function createOrderManagementSheet(spreadsheet) {
  console.log('受注管理台帳シートを作成中...');
  
  const sheet = spreadsheet.insertSheet('受注管理台帳');
  
  // ヘッダー行を設定
  const headers = [
    '処理日時',      // A列
    'ステータス',    // B列
    '会社名',        // C列
    '担当者名',      // D列
    '商品名',        // E列
    '数量',          // F列
    '合計金額',      // G列
    '品質スコア',    // H列
    '納期',          // I列
    'メール',        // J列
    '電話番号',      // K列
    'ファイル名'     // L列
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // ヘッダー行のスタイル設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // 列幅の初期設定
  const columnWidths = [140, 80, 150, 100, 200, 80, 100, 80, 100, 180, 120, 200];
  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
  
  // 行の高さ設定
  sheet.setRowHeight(1, 30);
  
  console.log('受注管理台帳シート作成完了');
  return sheet;
}

/**
 * 品質スコアに基づく色分け適用
 */
function applyQualityColorCoding(sheet, row, qualityScore) {
  const range = sheet.getRange(row, 1, 1, 12); // 該当行全体
  
  if (qualityScore >= 80) {
    // 高品質（80点以上）: 薄い緑色
    range.setBackground('#d9ead3');
    sheet.getRange(row, 2).setValue('確認済み');
  } else if (qualityScore >= 60) {
    // 中品質（60-79点）: 薄い黄色
    range.setBackground('#fff2cc');
    sheet.getRange(row, 2).setValue('要確認');
  } else {
    // 低品質（60点未満）: 薄い赤色
    range.setBackground('#f4cccc');
    sheet.getRange(row, 2).setValue('要修正');
  }
  
  // 品質スコアセルの色分け
  const scoreCell = sheet.getRange(row, 8);
  if (qualityScore >= 80) {
    scoreCell.setBackground('#34a853').setFontColor('white');
  } else if (qualityScore >= 60) {
    scoreCell.setBackground('#fbbc04').setFontColor('black');
  } else {
    scoreCell.setBackground('#ea4335').setFontColor('white');
  }
}

// =============================================================================
// データ処理ヘルパー関数
// =============================================================================

/**
 * データ品質スコアを計算
 */
function calculateQualityScore(data) {
  let score = 0;
  let maxScore = 100;
  
  // 必須項目の存在チェック（各20点）
  if (data.company && data.company.trim()) score += 20;
  if (data.contact_name && data.contact_name.trim()) score += 20;
  if (data.items && data.items.length > 0) score += 20;
  if (data.total_amount && data.total_amount > 0) score += 20;
  
  // 追加項目の存在チェック（各5点）
  if (data.contact_email && data.contact_email.includes('@')) score += 5;
  if (data.contact_phone && data.contact_phone.trim()) score += 5;
  if (data.delivery_date && data.delivery_date.trim()) score += 5;
  if (data.order_date && data.order_date.trim()) score += 5;
  
  return Math.min(score, maxScore);
}

/**
 * 品質スコアに基づくステータス判定
 */
function getStatusByQualityScore(score) {
  if (score >= 80) return '確認済み';
  if (score >= 60) return '要確認';
  return '要修正';
}

/**
 * 主要商品名を取得
 */
function getMainProductName(items) {
  if (!items || items.length === 0) return '';
  return items[0].name || '';
}

/**
 * 合計数量を計算
 */
function getTotalQuantity(items) {
  if (!items || items.length === 0) return 0;
  return items.reduce((total, item) => total + (item.quantity || 0), 0);
}

// =============================================================================
// ファイル管理機能（動画3の機能を統合）
// =============================================================================

/**
 * 最新のPDFファイルを取得
 */
function getLatestPDFFromFolder() {
  try {
    const folder = DriveApp.getFoldersByName('AI受注処理').next();
    const files = folder.getFilesByType(MimeType.PDF);
    
    let latestFile = null;
    let latestDate = new Date(0);
    
    while (files.hasNext()) {
      const file = files.next();
      const createdDate = file.getDateCreated();
      if (createdDate > latestDate) {
        latestDate = createdDate;
        latestFile = file;
      }
    }
    
    return latestFile;
  } catch (error) {
    console.error('PDFファイル取得エラー:', error);
    return null;
  }
}

/**
 * 処理済みフォルダにファイルを移動
 */
function moveToProcessedFolder(file) {
  try {
    const processedFolder = DriveApp.getFoldersByName('処理済み').next();
    file.moveTo(processedFolder);
    console.log(`ファイル移動完了: ${file.getName()}`);
  } catch (error) {
    console.error('ファイル移動エラー:', error);
  }
}

// =============================================================================
// OCR機能（動画3の統合）
// =============================================================================

/**
 * Vision APIを使用したOCR処理
 */
function performOCR(fileId) {
  // テストモード用のサンプルデータ
  const testMode = true; // 実際のAPI使用時はfalseに変更
  
  if (testMode) {
    console.log('テストモード: サンプルOCRデータを使用');
    return getSampleOCRText();
  }
  
  try {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    if (!apiKey) {
      throw new Error('Vision API キーが設定されていません');
    }
    
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const payload = {
      requests: [{
        image: { content: Utilities.base64Encode(blob.getBytes()) },
        features: [{ type: 'TEXT_DETECTION' }]
      }]
    };
    
    const response = UrlFetchApp.fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    
    if (result.responses[0].error) {
      throw new Error(result.responses[0].error.message);
    }
    
    return result.responses[0].fullTextAnnotation?.text || '';
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    return null;
  }
}

/**
 * テスト用サンプルOCRテキスト
 */
function getSampleOCRText() {
  return `
注文書

株式会社テストサプライ
〒100-0001 東京都千代田区千代田1-1-1
TEL: 03-1234-5678
担当者: 田中太郎 (tanaka@testsupply.co.jp)

注文日: 2024-01-15
納期希望: 2024-01-25

商品名: プリンターインク BK-300
品番: INK-BK300
数量: 50個
単価: 1,200円
小計: 60,000円

商品名: コピー用紙 A4
品番: PAPER-A4-500
数量: 20箱
単価: 800円
小計: 16,000円

合計金額: 76,000円（税込）

特記事項: 至急対応をお願いします
  `;
}

// =============================================================================
// AI情報抽出機能（動画4-5の統合）
// =============================================================================

/**
 * ChatGPT APIを使用した情報抽出
 */
function extractOrderInfo(ocrText) {
  // テストモード用の処理
  const testMode = true; // 実際のAPI使用時はfalseに変更
  
  if (testMode) {
    console.log('テストモード: サンプル抽出データを使用');
    return getSampleExtractedData();
  }
  
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
      throw new Error(result.error.message);
    }
    
    const extractedInfo = JSON.parse(result.choices[0].message.content);
    return extractedInfo;
    
  } catch (error) {
    console.error('AI情報抽出エラー:', error);
    return { error: error.message };
  }
}

/**
 * 注文情報抽出用プロンプト生成
 */
function createOrderExtractionPrompt(ocrText) {
  return `あなたは優秀な営業事務担当者です。
以下のOCRで抽出されたテキストから、注文書の重要情報を抽出してください。

# 抽出する情報
- 会社名
- 担当者名
- メールアドレス
- 電話番号
- 商品情報（商品名、品番、数量、単価）
- 合計金額
- 注文日
- 納期
- 特記事項

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
      "price": 単価
    }
  ],
  "total_amount": 合計金額,
  "order_date": "注文日(YYYY-MM-DD)",
  "delivery_date": "納期(YYYY-MM-DD)",
  "notes": "特記事項"
}

# 制約条件
- 情報が見つからない場合は null を設定
- 数量・金額は数値のみ抽出
- 日付は YYYY-MM-DD 形式で統一
- 複数商品がある場合は配列で記載

# 抽出対象テキスト
${ocrText}`;
}

/**
 * テスト用サンプル抽出データ
 */
function getSampleExtractedData() {
  return {
    "company": "株式会社テストサプライ",
    "contact_name": "田中太郎",
    "contact_email": "tanaka@testsupply.co.jp",
    "contact_phone": "03-1234-5678",
    "items": [
      {
        "name": "プリンターインク BK-300",
        "code": "INK-BK300",
        "quantity": 50,
        "price": 1200
      },
      {
        "name": "コピー用紙 A4",
        "code": "PAPER-A4-500",
        "quantity": 20,
        "price": 800
      }
    ],
    "total_amount": 76000,
    "order_date": "2024-01-15",
    "delivery_date": "2024-01-25",
    "notes": "至急対応をお願いします"
  };
}

// =============================================================================
// エラーログ機能
// =============================================================================

/**
 * エラーログをスプレッドシートに記録
 */
function logErrorToSpreadsheet(error, startTime) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let errorSheet = spreadsheet.getSheetByName('エラーログ');
    
    if (!errorSheet) {
      errorSheet = spreadsheet.insertSheet('エラーログ');
      errorSheet.getRange(1, 1, 1, 4).setValues([['発生日時', 'エラー内容', '処理時間', 'ファイル名']]);
    }
    
    const endTime = new Date();
    const processingTime = (endTime - startTime) / 1000;
    
    errorSheet.appendRow([
      new Date(),
      error.message,
      `${processingTime}秒`,
      'システムエラー'
    ]);
    
  } catch (logError) {
    console.error('エラーログ記録失敗:', logError);
  }
}

// =============================================================================
// デモ用テスト関数
// =============================================================================

/**
 * 動画6デモ用メイン関数
 * 完全自動処理のデモンストレーション
 */
function demo6_CompleteAutomation() {
  console.log('🎬 動画6デモ開始: 完全自動処理システム');
  console.log('PDFからスプレッドシートまでの一気通貫処理を実演します');
  
  const result = processOrderPDFComplete();
  
  if (result.success) {
    console.log('✅ デモ成功！');
    console.log(`⏱️  処理時間: ${result.processingTime}秒`);
    console.log(`🏢 処理会社: ${result.company}`);
    console.log(`📊 品質スコア: ${result.qualityScore}点`);
    console.log(`📝 記録行: ${result.recordRow}行目`);
    console.log('');
    console.log('🎉 受注台帳が自動更新されました！');
    console.log('スプレッドシートを確認してください。');
  } else {
    console.log('❌ デモ失敗:', result.error);
  }
}

/**
 * スプレッドシート初期化（初回セットアップ用）
 */
function demo6_InitializeSpreadsheet() {
  console.log('📊 受注管理台帳の初期化...');
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 既存のシートを削除
  const existingSheet = spreadsheet.getSheetByName('受注管理台帳');
  if (existingSheet) {
    spreadsheet.deleteSheet(existingSheet);
  }
  
  // 新しいシートを作成
  const newSheet = createOrderManagementSheet(spreadsheet);
  
  console.log('✅ 受注管理台帳の初期化完了');
  console.log('デモの準備が整いました！');
}