// 動画3デモ用コード: Vision API OCR実装

/**
 * メイン関数：新しいPDFファイルの処理
 * @param {string} fileId - Google DriveのファイルID
 */
function processNewPDF(fileId) {
  try {
    console.log('PDF処理開始:', fileId);
    
    // 1. ファイル取得
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    console.log('ファイル取得完了:', file.getName());
    console.log('ファイルタイプ:', blob.getContentType());
    
    // 2. PDFから画像への変換チェック
    if (blob.getContentType() === 'application/pdf') {
      console.log('PDFファイルを検出 - 画像変換が必要です');
      console.log('⚠️ 現在の実装はテストモードを使用してください');
      
      // テストモードでない場合は、PDF変換が必要である旨を表示
      const testMode = PropertiesService.getScriptProperties().getProperty('TEST_MODE');
      if (testMode !== 'true') {
        console.log('💡 enableTestMode() を実行してテストモードを有効にしてください');
        return null;
      }
    }
    
    // 3. Vision API呼び出し
    const extractedText = performOCR(blob);
    
    if (extractedText) {
      console.log('OCR処理完了');
      console.log('抽出されたテキスト:', extractedText.substring(0, 200) + '...');
      return extractedText;
    } else {
      console.error('OCR処理失敗');
      return null;
    }
    
  } catch (error) {
    console.error('PDF処理エラー:', error);
    return null;
  }
}

/**
 * Vision API OCR処理（シンプル版）
 * @param {Blob} blob - PDFファイルのBlob
 * @return {string} 抽出されたテキスト
 */
function performOCR(blob) {
  try {
    // APIキーの取得（事前にScript Propertiesに設定）
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    
    if (!apiKey) {
      throw new Error('Vision API キーが設定されていません');
    }
    
    // テストモード：課金が有効でない場合のデモ用OCR結果を返す
    const testMode = PropertiesService.getScriptProperties().getProperty('TEST_MODE');
    if (testMode === 'true') {
      console.log('⚠️ テストモード：模擬OCR結果を返します');
      return getMockOCRResult();
    }
    
    // Vision API エンドポイント
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    // リクエストペイロードの構築
    const payload = {
      requests: [{
        image: {
          content: Utilities.base64Encode(blob.getBytes())
        },
        features: [{
          type: 'TEXT_DETECTION',
          maxResults: 1
        }]
      }]
    };
    
    // Vision API呼び出し
    const response = UrlFetchApp.fetch(visionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    // レスポンス解析
    const result = JSON.parse(response.getContentText());
    
    // エラーチェック
    if (result.responses[0].error) {
      throw new Error('Vision API エラー: ' + result.responses[0].error.message);
    }
    
    // テキスト抽出
    const textAnnotation = result.responses[0].fullTextAnnotation;
    
    if (textAnnotation && textAnnotation.text) {
      return textAnnotation.text;
    } else {
      console.log('テキストが検出されませんでした');
      return null;
    }
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    return null;
  }
}

/**
 * AI受注処理フォルダ内の最新PDFファイルを自動処理
 * 動画3のメイン実行関数：この関数を実行してください
 */
function processLatestPDF() {
  try {
    console.log('=== AI受注処理フォルダの最新PDF処理開始 ===');
    
    // AI受注処理フォルダを取得
    const folders = DriveApp.getFoldersByName('AI受注処理');
    if (!folders.hasNext()) {
      console.error('「AI受注処理」フォルダが見つかりません。動画2の手順でフォルダを作成してください。');
      return;
    }
    
    const folder = folders.next();
    const files = folder.getFiles();
    
    // PDFファイルを探す
    let pdfFile = null;
    let latestDate = new Date(0);
    
    while (files.hasNext()) {
      const file = files.next();
      const mimeType = file.getBlob().getContentType();
      
      // PDFファイルかチェック
      if (mimeType === 'application/pdf') {
        const fileDate = file.getDateCreated();
        if (fileDate > latestDate) {
          latestDate = fileDate;
          pdfFile = file;
        }
      }
    }
    
    if (!pdfFile) {
      console.log('AI受注処理フォルダにPDFファイルが見つかりません。');
      console.log('Google DriveのAI受注処理フォルダにPDFファイルをアップロードしてから再実行してください。');
      return;
    }
    
    console.log('処理対象PDF:', pdfFile.getName(), '(', pdfFile.getId(), ')');
    
    // システム設定確認
    const testMode = PropertiesService.getScriptProperties().getProperty('TEST_MODE');
    if (testMode === 'true') {
      console.log('🧪 テストモードで実行中');
    } else {
      console.log('🚀 本格運用モードで実行中');
    }
    
    // PDF処理実行（本格版を使用）
    const result = processNewPDFAdvanced(pdfFile.getId());
    
    if (result) {
      console.log('=== OCR成功 ===');
      console.log('抽出されたテキスト全文:');
      console.log(result);
      
      // テキスト解析の簡単なデモ
      analyzeExtractedText(result);
      
      // 処理済みフォルダに移動
      moveToProcessedFolder(pdfFile);
      
    } else {
      console.log('=== OCR失敗 ===');
      console.log('エラーログを確認してください。');
    }
    
  } catch (error) {
    console.error('処理実行エラー:', error);
  }
}

/**
 * 処理済みファイルを「処理済み」フォルダに移動
 * @param {File} file - 移動するファイル
 */
function moveToProcessedFolder(file) {
  try {
    const processedFolders = DriveApp.getFoldersByName('処理済み');
    if (!processedFolders.hasNext()) {
      console.log('「処理済み」フォルダが見つかりません。フォルダを作成します。');
      const processedFolder = DriveApp.createFolder('処理済み');
      file.moveTo(processedFolder);
    } else {
      const processedFolder = processedFolders.next();
      file.moveTo(processedFolder);
    }
    console.log('ファイルを処理済みフォルダに移動しました:', file.getName());
  } catch (error) {
    console.error('ファイル移動エラー:', error);
  }
}

/**
 * デモ用：特定のファイルIDでテスト（上級者向け）
 * 使用方法：
 * 1. Google Driveでファイルを右クリック→「リンクを取得」
 * 2. URLからファイルIDを抽出して下記に設定
 */
function testOCRDemo() {
  try {
    // デモ用：ファイルIDを直接指定（実際のIDに置き換えてください）
    const testFileId = 'YOUR_FILE_ID_HERE';
    
    console.log('=== OCRデモ開始 ===');
    console.log('⚠️ 警告: testFileId を実際のファイルIDに変更してください');
    
    if (testFileId === 'YOUR_FILE_ID_HERE') {
      console.log('❌ ファイルIDが設定されていません');
      console.log('代わりに processLatestPDF() 関数を実行することをお勧めします');
      return;
    }
    
    const result = processNewPDF(testFileId);
    
    if (result) {
      console.log('=== OCR成功 ===');
      console.log('抽出されたテキスト全文:');
      console.log(result);
      
      // テキスト解析の簡単なデモ
      analyzeExtractedText(result);
      
    } else {
      console.log('=== OCR失敗 ===');
    }
    
  } catch (error) {
    console.error('デモ実行エラー:', error);
  }
}

/**
 * 抽出されたテキストの簡単な解析（デモ用）
 * @param {string} text - OCRで抽出されたテキスト
 */
function analyzeExtractedText(text) {
  console.log('=== テキスト解析デモ ===');
  
  // 基本的な情報抽出の例
  const lines = text.split('\n');
  console.log('総行数:', lines.length);
  console.log('総文字数:', text.length);
  
  // 会社名らしき行を探す（簡易版）
  const companyPattern = /(株式会社|有限会社|合同会社|合資会社)/;
  const companyLines = lines.filter(line => companyPattern.test(line));
  console.log('会社名候補:', companyLines);
  
  // 金額らしき行を探す（簡易版）
  const pricePattern = /[0-9,]+円/;
  const priceLines = lines.filter(line => pricePattern.test(line));
  console.log('金額候補:', priceLines);
  
  // 日付らしき行を探す（簡易版）
  const datePattern = /\d{4}年\d{1,2}月\d{1,2}日|\d{4}\/\d{1,2}\/\d{1,2}/;
  const dateLines = lines.filter(line => datePattern.test(line));
  console.log('日付候補:', dateLines);
}

/**
 * APIキー設定用ヘルパー関数
 * 実行前に一度だけ実行してAPIキーを設定
 */
function setVisionAPIKey() {
  const apiKey = 'YOUR_VISION_API_KEY_HERE'; // 実際のAPIキーに置き換え
  
  if (apiKey === 'YOUR_VISION_API_KEY_HERE') {
    console.log('⚠️ APIキーを実際の値に変更してください');
    console.log('Google Cloud Console → 認証情報 → APIキー作成');
    console.log('動画2で取得したAPIキーをコード内で置き換えてください');
    return;
  }
  
  PropertiesService.getScriptProperties().setProperty('VISION_API_KEY', apiKey);
  console.log('✅ Vision API キーを設定しました');
  console.log('💡 セキュリティのため、コード内のAPIキーは削除することをお勧めします');
}

/**
 * 本格運用に必要な全設定の確認
 */
function checkProductionReadiness() {
  console.log('=== 本格運用準備チェック ===');
  console.log('');
  
  // 1. APIキー確認
  const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
  console.log('1️⃣ Vision API キー:', apiKey ? '✅ 設定済み' : '❌ 未設定');
  if (!apiKey) {
    console.log('   → setVisionAPIKey() を実行してAPIキーを設定してください');
  }
  
  // 2. フォルダ確認
  try {
    const aiFolder = DriveApp.getFoldersByName('AI受注処理').hasNext();
    const processedFolder = DriveApp.getFoldersByName('処理済み').hasNext();
    console.log('2️⃣ フォルダ構成:');
    console.log('   AI受注処理フォルダ:', aiFolder ? '✅ 存在' : '❌ 未作成');
    console.log('   処理済みフォルダ:', processedFolder ? '✅ 存在' : '⚠️ 実行時に自動作成');
  } catch (error) {
    console.log('2️⃣ フォルダ確認エラー:', error.message);
  }
  
  // 3. テストモード確認
  const testMode = PropertiesService.getScriptProperties().getProperty('TEST_MODE');
  console.log('3️⃣ テストモード:', testMode === 'true' ? '⚠️ 有効' : '✅ 無効');
  if (testMode === 'true') {
    console.log('   → 本格運用前に disableTestMode() を実行してください');
  }
  
  // 4. Drive API確認
  try {
    DriveApp.getRootFolder();
    console.log('4️⃣ Drive API:', '✅ 利用可能');
  } catch (error) {
    console.log('4️⃣ Drive API:', '❌ エラー -', error.message);
  }
  
  console.log('');
  
  // 総合判定
  const allReady = apiKey && !testMode;
  if (allReady) {
    console.log('🎉 本格運用の準備が完了しています！');
    console.log('   processLatestPDF() を実行して開始してください');
  } else {
    console.log('⚠️ 本格運用前に上記の項目を確認してください');
    console.log('   準備ができたら showProductionSetupGuide() で詳細手順を確認');
  }
}

/**
 * フォルダとファイルの詳細調査
 */
function investigateFolderContents() {
  console.log('=== フォルダ・ファイル詳細調査 ===');
  console.log('');
  
  // 1. AI受注処理フォルダの調査
  console.log('🔍 AI受注処理フォルダの調査:');
  try {
    const folders = DriveApp.getFoldersByName('AI受注処理');
    
    if (!folders.hasNext()) {
      console.log('❌ 「AI受注処理」フォルダが見つかりません');
      console.log('💡 解決策: Google Driveで手動作成するか、以下を実行');
      console.log('   DriveApp.createFolder("AI受注処理")');
      return;
    }
    
    const folder = folders.next();
    console.log('✅ フォルダ発見 - ID:', folder.getId());
    console.log('   URL:', folder.getUrl());
    
    // フォルダ内の全ファイルを調査
    const files = folder.getFiles();
    let fileCount = 0;
    let pdfCount = 0;
    
    console.log('');
    console.log('📁 フォルダ内のファイル一覧:');
    
    while (files.hasNext()) {
      const file = files.next();
      fileCount++;
      
      const name = file.getName();
      const mimeType = file.getBlob().getContentType();
      const size = file.getSize();
      const dateCreated = file.getDateCreated();
      
      console.log(`${fileCount}. ${name}`);
      console.log(`   タイプ: ${mimeType}`);
      console.log(`   サイズ: ${size} bytes`);
      console.log(`   作成日: ${dateCreated}`);
      console.log(`   ファイルID: ${file.getId()}`);
      
      if (mimeType === 'application/pdf') {
        pdfCount++;
        console.log('   ✅ PDFファイルです');
      } else {
        console.log('   ⚠️ PDFファイルではありません');
      }
      console.log('');
    }
    
    console.log('📊 ファイル統計:');
    console.log(`   総ファイル数: ${fileCount}`);
    console.log(`   PDFファイル数: ${pdfCount}`);
    
    if (fileCount === 0) {
      console.log('❌ フォルダは存在しますが、ファイルがありません');
      console.log('💡 Google Driveで「AI受注処理」フォルダにPDFをアップロードしてください');
    } else if (pdfCount === 0) {
      console.log('⚠️ ファイルはありますが、PDFファイルがありません');
      console.log('💡 PDFファイルをアップロードするか、ファイル形式を確認してください');
    }
    
  } catch (error) {
    console.error('❌ フォルダ調査エラー:', error);
  }
  
  // 2. 処理済みフォルダの調査
  console.log('');
  console.log('🔍 処理済みフォルダの調査:');
  try {
    const processedFolders = DriveApp.getFoldersByName('処理済み');
    if (processedFolders.hasNext()) {
      const processedFolder = processedFolders.next();
      console.log('✅ 処理済みフォルダ存在 - ID:', processedFolder.getId());
      
      const processedFiles = processedFolder.getFiles();
      let processedCount = 0;
      
      while (processedFiles.hasNext()) {
        processedFiles.next();
        processedCount++;
      }
      console.log(`   処理済みファイル数: ${processedCount}`);
    } else {
      console.log('⚠️ 処理済みフォルダ未作成（実行時に自動作成されます）');
    }
  } catch (error) {
    console.error('❌ 処理済みフォルダ調査エラー:', error);
  }
}

/**
 * 「AI受注処理」フォルダを手動作成
 */
function createAIProcessingFolder() {
  try {
    console.log('📁 AI受注処理フォルダを作成中...');
    
    // 既存フォルダチェック
    const existingFolders = DriveApp.getFoldersByName('AI受注処理');
    if (existingFolders.hasNext()) {
      console.log('⚠️ 「AI受注処理」フォルダは既に存在します');
      const folder = existingFolders.next();
      console.log('   フォルダURL:', folder.getUrl());
      return folder;
    }
    
    // 新規作成
    const newFolder = DriveApp.createFolder('AI受注処理');
    console.log('✅ フォルダ作成完了');
    console.log('   フォルダID:', newFolder.getId());
    console.log('   フォルダURL:', newFolder.getUrl());
    console.log('');
    console.log('💡 このフォルダにPDFファイルをアップロードしてください');
    
    return newFolder;
    
  } catch (error) {
    console.error('❌ フォルダ作成エラー:', error);
    return null;
  }
}

/**
 * 設定確認用関数
 */
function checkSetup() {
  console.log('=== 設定確認 ===');
  
  // APIキーの確認
  const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
  console.log('Vision API キー:', apiKey ? '設定済み' : '未設定');
  
  // Google Drive アクセス確認
  try {
    const folders = DriveApp.getFolders();
    console.log('Google Drive アクセス: OK');
  } catch (error) {
    console.log('Google Drive アクセス: エラー', error);
  }
  
  // スプレッドシート アクセス確認
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    console.log('スプレッドシート アクセス: OK');
  } catch (error) {
    console.log('スプレッドシート アクセス: エラー', error);
  }
  
  console.log('');
  console.log('🔍 詳細調査が必要な場合は investigateFolderContents() を実行してください');
}

/**
 * 模擬OCR結果を返す（課金設定前のテスト用）
 * @return {string} サンプルの注文書テキスト
 */
function getMockOCRResult() {
  return `
注文書

株式会社サンプル商事
〒123-4567 東京都渋谷区サンプル1-2-3
担当者：田中 太郎
電話：03-1234-5678
メール：tanaka@sample-corp.co.jp

注文日：2025年6月27日
納期希望：2025年7月15日

商品明細：
1. オフィス用品セットA
   品番：OFS-001
   数量：50個
   単価：2,500円
   金額：125,000円

2. プリンター用紙 A4
   品番：PPR-A4-500
   数量：20箱
   単価：800円
   金額：16,000円

小計：141,000円
消費税：14,100円
合計：155,100円

備考：
配送先は本社と同じ住所でお願いします。
請求書は経理部宛にお送りください。

以上、よろしくお願いいたします。
`;
}

/**
 * テストモードを有効化（課金設定前のテスト用）
 */
function enableTestMode() {
  PropertiesService.getScriptProperties().setProperty('TEST_MODE', 'true');
  console.log('テストモードを有効化しました');
  console.log('課金設定前でもOCRテストが可能になります');
}

/**
 * テストモードを無効化（課金設定後の本番用）
 */
function disableTestMode() {
  PropertiesService.getScriptProperties().deleteProperty('TEST_MODE');
  console.log('テストモードを無効化しました');
  console.log('実際のVision APIを使用します');
}

/**
 * PDFを画像に変換してOCR処理（本格版）
 * 本格運用時の PDF → 画像変換 → Vision API OCR
 */
function convertPDFToImageAndOCR(file) {
  try {
    console.log('🔄 PDF→画像変換処理を開始');
    
    const fileId = file.getId();
    
    // 方法1: Google Drive APIでPDFのサムネイルを取得（画像形式）
    // 高解像度でサムネイルを取得
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2048-h2048`;
    
    try {
      const response = UrlFetchApp.fetch(thumbnailUrl, {
        headers: {
          'Authorization': `Bearer ${ScriptApp.getOAuthToken()}`
        }
      });
      
      if (response.getResponseCode() === 200) {
        const imageBlob = response.getBlob();
        console.log('✅ PDF→画像変換成功 (', imageBlob.getContentType(), ')');
        
        // 変換された画像でVision API OCR実行
        return performOCR(imageBlob);
        
      } else {
        console.error('❌ PDF→画像変換失敗 - レスポンスコード:', response.getResponseCode());
        console.log('💡 ファイルがPDFでない可能性があります');
        return null;
      }
      
    } catch (error) {
      console.error('❌ PDF変換エラー:', error);
      console.log('🔧 トラブルシューティング:');
      console.log('1. ファイルがGoogle Drive上にあることを確認');
      console.log('2. ファイルのアクセス権限を確認');
      console.log('3. Drive APIが有効化されていることを確認');
      return null;
    }
    
  } catch (error) {
    console.error('❌ PDF変換処理エラー:', error);
    return null;
  }
}

/**
 * 本格運用への移行手順を案内する関数
 */
function showProductionSetupGuide() {
  console.log('=== 本格運用セットアップガイド ===');
  console.log('');
  console.log('📋 必要な設定手順:');
  console.log('');
  console.log('1️⃣ Google Cloud Console で課金を有効化');
  console.log('   https://console.cloud.google.com');
  console.log('   - 左メニュー「請求」→「請求先アカウントをリンク」');
  console.log('   - クレジットカード情報を入力');
  console.log('   - Vision API は月1,000回まで無料');
  console.log('');
  console.log('2️⃣ テストモードを無効化');
  console.log('   実行: disableTestMode()');
  console.log('');
  console.log('3️⃣ 本格運用開始');
  console.log('   実行: processLatestPDF()');
  console.log('');
  console.log('💰 料金目安:');
  console.log('   - Vision API: 1,000回/月まで無料');
  console.log('   - 追加: $1.50 per 1,000 requests');
  console.log('   - 月50件処理なら実質無料');
  console.log('');
  console.log('✅ 現在の設定状況:');
  console.log('   テストモード:', PropertiesService.getScriptProperties().getProperty('TEST_MODE') === 'true' ? '有効' : '無効');
  console.log('   Vision API キー:', PropertiesService.getScriptProperties().getProperty('VISION_API_KEY') ? '設定済み' : '未設定');
}

/**
 * 高度なPDF処理関数（画像変換対応版）
 */
function processNewPDFAdvanced(fileId) {
  try {
    console.log('PDF処理開始（高度版）:', fileId);
    
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    console.log('ファイル取得完了:', file.getName());
    console.log('ファイルタイプ:', blob.getContentType());
    
    let extractedText;
    
    if (blob.getContentType() === 'application/pdf') {
      console.log('PDFファイル - 画像変換してOCR実行');
      extractedText = convertPDFToImageAndOCR(file);
    } else {
      console.log('画像ファイル - 直接OCR実行');
      extractedText = performOCR(blob);
    }
    
    if (extractedText) {
      console.log('OCR処理完了');
      console.log('抽出されたテキスト:', extractedText.substring(0, 200) + '...');
      return extractedText;
    } else {
      console.error('OCR処理失敗');
      return null;
    }
    
  } catch (error) {
    console.error('PDF処理エラー:', error);
    return null;
  }
}

/**
 * エラーハンドリングのデモ
 */
function demonstrateErrorHandling() {
  console.log('=== エラーハンドリングデモ ===');
  
  // 存在しないファイルIDでテスト
  try {
    const result = processNewPDF('invalid_file_id');
    console.log('結果:', result);
  } catch (error) {
    console.log('期待通りエラーをキャッチ:', error.message);
  }
  
  // APIキー未設定でのテスト
  const originalKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
  PropertiesService.getScriptProperties().deleteProperty('VISION_API_KEY');
  
  try {
    const blob = Utilities.newBlob('test', 'image/jpeg', 'test.jpg');
    const result = performOCR(blob);
    console.log('結果:', result);
  } catch (error) {
    console.log('APIキーエラーをキャッチ:', error.message);
  }
  
  // APIキーを復元
  if (originalKey) {
    PropertiesService.getScriptProperties().setProperty('VISION_API_KEY', originalKey);
  }
}