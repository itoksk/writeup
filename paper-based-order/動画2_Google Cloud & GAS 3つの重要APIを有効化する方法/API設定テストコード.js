/**
 * 動画2: API設定テストコード集
 * PDF自動処理システムの基盤となる3つのAPIの動作確認用コード
 */

// ==============================================
// 基本設定テスト
// ==============================================

/**
 * スプレッドシート基本接続テスト
 * Apps Scriptとスプレッドシートの連携確認
 */
function testBasicSetup() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const timestamp = new Date();
    
    // A2セルにテスト日時を記録
    sheet.getRange('A2').setValue('基本テスト実行: ' + timestamp);
    
    console.log('✅ スプレッドシート接続: OK');
    console.log('実行時刻: ' + timestamp);
    
    return true;
  } catch (error) {
    console.error('❌ スプレッドシート接続エラー:', error);
    return false;
  }
}

// ==============================================
// Drive API テスト
// ==============================================

/**
 * Drive API動作確認テスト
 * フォルダ検索とファイル操作の確認
 */
function testDriveAPI() {
  try {
    console.log('=== Drive API テスト開始 ===');
    
    // 1. AI受注処理フォルダの検索
    const aiProcessingFolders = DriveApp.getFoldersByName('AI受注処理');
    if (aiProcessingFolders.hasNext()) {
      const folder = aiProcessingFolders.next();
      console.log('✅ AI受注処理フォルダ発見');
      console.log('フォルダID: ' + folder.getId());
      
      // フォルダ内のファイル数を確認
      const files = folder.getFiles();
      let fileCount = 0;
      while (files.hasNext()) {
        files.next();
        fileCount++;
      }
      console.log('フォルダ内ファイル数: ' + fileCount);
    } else {
      console.log('⚠️ AI受注処理フォルダが見つかりません');
    }
    
    // 2. 処理済みフォルダの検索
    const processedFolders = DriveApp.getFoldersByName('処理済み');
    if (processedFolders.hasNext()) {
      const folder = processedFolders.next();
      console.log('✅ 処理済みフォルダ発見');
      console.log('フォルダID: ' + folder.getId());
    } else {
      console.log('⚠️ 処理済みフォルダが見つかりません');
    }
    
    // 3. 基本的なDrive操作権限の確認
    const rootFolders = DriveApp.getFolders();
    console.log('✅ Drive API基本操作: OK');
    
    console.log('=== Drive API テスト完了 ===');
    return true;
    
  } catch (error) {
    console.error('❌ Drive APIエラー:', error);
    return false;
  }
}

// ==============================================
// Gmail API テスト
// ==============================================

/**
 * Gmail API接続テスト
 * 読み取り権限の確認（実際のメール送信はしない）
 */
function testGmailAPI() {
  try {
    console.log('=== Gmail API テスト開始 ===');
    
    // 受信トレイの基本情報を取得（メール送信せずに権限確認）
    const threads = GmailApp.getInboxThreads(0, 1);
    console.log('✅ Gmail API読み取り権限: OK');
    console.log('受信トレイアクセス可能');
    
    // 送信権限の確認（実際には送信しない）
    const drafts = GmailApp.getDrafts();
    console.log('✅ Gmail API下書き機能: OK');
    
    console.log('=== Gmail API テスト完了 ===');
    return true;
    
  } catch (error) {
    console.error('❌ Gmail APIエラー:', error);
    console.log('Gmail APIの有効化または権限設定を確認してください');
    return false;
  }
}

// ==============================================
// Vision API テスト
// ==============================================

/**
 * Vision API設定確認テスト
 * APIキーの設定と接続準備状況を確認
 */
function testVisionAPIConnection() {
  try {
    console.log('=== Vision API 設定テスト開始 ===');
    
    // 1. APIキーの存在確認
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    
    if (!apiKey) {
      console.error('❌ Vision APIキーが設定されていません');
      console.log('設定方法:');
      console.log('1. プロジェクトの設定 → スクリプト プロパティ');
      console.log('2. プロパティ名: VISION_API_KEY');
      console.log('3. 値: Google Cloud ConsoleのAPIキー');
      return false;
    }
    
    // 2. APIキーの基本形式確認
    if (apiKey.length < 30) {
      console.error('❌ APIキーの形式が正しくない可能性があります');
      console.log('APIキー長: ' + apiKey.length + ' 文字');
      return false;
    }
    
    console.log('✅ Vision APIキー設定済み');
    console.log('APIキー長: ' + apiKey.length + ' 文字');
    
    // 3. エンドポイントURL構築確認
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    console.log('✅ Vision API エンドポイント準備完了');
    
    // 4. 簡単な接続テスト（実際のリクエストは送信しない）
    console.log('✅ Vision API 接続準備: OK');
    console.log('次回の動画で実際のOCR処理を実装します');
    
    console.log('=== Vision API 設定テスト完了 ===');
    return true;
    
  } catch (error) {
    console.error('❌ Vision API設定エラー:', error);
    return false;
  }
}

// ==============================================
// 総合テスト
// ==============================================

/**
 * システム全体の統合テスト
 * すべてのAPIと基本設定の動作確認
 */
function comprehensiveTest() {
  console.log('');
  console.log('🚀 ========================================');
  console.log('    PDF自動処理システム 総合テスト');
  console.log('========================================');
  console.log('');
  
  const results = {
    basic: false,
    drive: false,
    gmail: false,
    vision: false
  };
  
  // 1. 基本設定テスト
  console.log('【1/4】基本設定テスト実行中...');
  results.basic = testBasicSetup();
  console.log('');
  
  // 2. Drive APIテスト
  console.log('【2/4】Drive APIテスト実行中...');
  results.drive = testDriveAPI();
  console.log('');
  
  // 3. Gmail APIテスト
  console.log('【3/4】Gmail APIテスト実行中...');
  results.gmail = testGmailAPI();
  console.log('');
  
  // 4. Vision APIテスト
  console.log('【4/4】Vision APIテスト実行中...');
  results.vision = testVisionAPIConnection();
  console.log('');
  
  // 結果まとめ
  console.log('📊 ========== テスト結果まとめ ==========');
  console.log('基本設定        : ' + (results.basic ? '✅ 正常' : '❌ 要修正'));
  console.log('Drive API      : ' + (results.drive ? '✅ 正常' : '❌ 要修正'));
  console.log('Gmail API      : ' + (results.gmail ? '✅ 正常' : '❌ 要修正'));
  console.log('Vision API     : ' + (results.vision ? '✅ 正常' : '❌ 要修正'));
  console.log('==========================================');
  
  const successCount = Object.values(results).filter(r => r).length;
  const totalCount = Object.keys(results).length;
  
  if (successCount === totalCount) {
    console.log('');
    console.log('🎉 おめでとうございます！');
    console.log('すべての設定が正常に完了しました。');
    console.log('次回の動画でOCR実装に進めます。');
    console.log('');
  } else {
    console.log('');
    console.log('⚠️ 一部の設定に問題があります。');
    console.log('エラーメッセージを確認して修正してください。');
    console.log('');
  }
  
  return successCount === totalCount;
}

// ==============================================
// 個別トラブルシューティング
// ==============================================

/**
 * フォルダ作成チェック
 * 必要なフォルダが存在しない場合の対処
 */
function checkAndCreateFolders() {
  console.log('=== フォルダ存在確認 ===');
  
  const requiredFolders = ['AI受注処理', '処理済み'];
  const createdFolders = [];
  
  requiredFolders.forEach(folderName => {
    const folders = DriveApp.getFoldersByName(folderName);
    if (!folders.hasNext()) {
      // フォルダが存在しない場合は作成
      const newFolder = DriveApp.createFolder(folderName);
      createdFolders.push(folderName);
      console.log('📁 フォルダを作成しました: ' + folderName);
      console.log('   ID: ' + newFolder.getId());
    } else {
      console.log('✅ フォルダ存在確認: ' + folderName);
    }
  });
  
  if (createdFolders.length > 0) {
    console.log('');
    console.log('新しく作成されたフォルダ: ' + createdFolders.join(', '));
  }
  
  console.log('フォルダチェック完了');
}

/**
 * スプレッドシートヘッダー設定確認
 * 必要なヘッダーが正しく設定されているかチェック
 */
function checkSpreadsheetHeaders() {
  try {
    console.log('=== スプレッドシートヘッダー確認 ===');
    
    const sheet = SpreadsheetApp.getActiveSheet();
    const headers = ['処理日時', 'ステータス', '会社名', '担当者名', '商品名', '数量', '合計金額', 'ファイル名'];
    
    // 現在のヘッダーを確認
    const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
    
    let needsUpdate = false;
    headers.forEach((header, index) => {
      if (currentHeaders[index] !== header) {
        needsUpdate = true;
      }
    });
    
    if (needsUpdate) {
      // ヘッダーを設定
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      console.log('📊 スプレッドシートヘッダーを設定しました');
      
      // ヘッダー行の書式設定
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
      
      console.log('✨ ヘッダーの書式も適用しました');
    } else {
      console.log('✅ ヘッダー設定: 正常');
    }
    
    // 設定されたヘッダーを表示
    console.log('設定済みヘッダー: ' + headers.join(' | '));
    
  } catch (error) {
    console.error('❌ ヘッダー設定エラー:', error);
  }
}

// ==============================================
// 初期セットアップ用一括実行関数
// ==============================================

/**
 * 初回セットアップ用の一括実行関数
 * フォルダ作成からヘッダー設定まで自動実行
 */
function initialSetup() {
  console.log('🚀 初期セットアップを開始します...');
  console.log('');
  
  // 1. フォルダ作成・確認
  checkAndCreateFolders();
  console.log('');
  
  // 2. スプレッドシートヘッダー設定
  checkSpreadsheetHeaders();
  console.log('');
  
  // 3. 総合テスト実行
  const testResult = comprehensiveTest();
  
  if (testResult) {
    console.log('🎉 初期セットアップが完了しました！');
    console.log('次回の動画でOCR実装に進んでください。');
  } else {
    console.log('⚠️ 一部設定に問題があります。');
    console.log('各エラーメッセージを確認して修正してください。');
  }
}