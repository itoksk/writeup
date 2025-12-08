// 動画5: GASからChatGPTを動かす！注文書から会社名と数量を抜き出す実践コード

/*
 * 動画1-4までの統合コード
 * 動画1: 問題提起と全体像
 * 動画2: Google Cloud API設定
 * 動画3: Vision APIでOCR処理
 * 動画4: ChatGPTプロンプト設計とサンプルテキスト8種類での検証
 * 動画5: GASからChatGPT API連携の実装
 */

/**
 * 動画4で作成したプロンプトテンプレートを使用したChatGPT API情報抽出
 * @param {string} ocrText - 動画3のVision APIで抽出されたテキスト
 * @return {Object} 抽出された注文情報（JSON形式）
 */
function extractOrderInfo(ocrText) {
  try {
    console.log('ChatGPT による情報抽出開始');
    
    // APIキーの取得
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    
    if (!apiKey) {
      throw new Error('OpenAI API キーが設定されていません');
    }
    
    // 動画4で作成したプロンプトテンプレートで情報抽出
    const prompt = createOrderExtractionPrompt(ocrText);
    
    // ChatGPT APIリクエストの設定
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1  // 安定した結果のため低温度設定
    };
    
    // API呼び出し
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    // レスポンスの解析
    const result = JSON.parse(response.getContentText());
    
    if (result.error) {
      throw new Error('ChatGPT API エラー: ' + result.error.message);
    }
    
    // 抽出された情報をJSONとして解析
    let extractedText = result.choices[0].message.content;
    
    // ```json記法を除去（ChatGPTが勝手に追加する場合がある）
    extractedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const extractedInfo = JSON.parse(extractedText);
    
    console.log('情報抽出完了:', extractedInfo);
    return extractedInfo;
    
  } catch (error) {
    console.error('ChatGPT API エラー:', error);
    return {
      error: error.message,
      company: null,
      total_amount: null,
      items: [],
      extraction_failed: true
    };
  }
}

/**
 * 動画4で設計・検証した注文書情報抽出用プロンプトテンプレート
 * 8種類のサンプルテキストで検証済み
 * @param {string} ocrText - 動画3のOCR処理で抽出されたテキスト
 * @return {string} 最適化されたプロンプト
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
必ず以下のJSON形式で回答してください。JSONのみを返し、説明文やマークダウン記法は一切使用しないでください：
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
- 会社名は「株式会社」「有限会社」等の法人格も含める
- 複数商品がある場合は配列に全て含める
- 不明確な情報は推測せず null とする
- json記法や説明文は絶対に使用せず、JSONのみを回答として返してください

# 抽出対象テキスト
${ocrText}`;
}

/**
 * 動画1-5で構築したPDF処理の完全統合フロー
 * 動画2: フォルダ構成 → 動画3: OCR処理 → 動画4: プロンプト設計 → 動画5: ChatGPT API連携
 * @param {string} fileId - Google DriveのファイルID
 * @return {Object} OCR+AI抽出の統合結果
 */
function processOrderPDFComplete(fileId) {
  try {
    console.log('=== PDF処理統合フロー開始 ===');
    
    // Step 1: 動画3のVision API OCR処理
    console.log('Step 1: 動画3 Vision API OCR処理開始');
    const ocrText = performOCRFromVideo3(fileId);
    
    if (!ocrText) {
      throw new Error('OCR処理が失敗しました');
    }
    
    console.log('OCR処理完了。文字数:', ocrText.length);
    
    // Step 2: 動画4のプロンプトでChatGPT情報抽出
    console.log('Step 2: 動画4プロンプトでChatGPT情報抽出開始');
    const extractedInfo = extractOrderInfo(ocrText);
    
    if (extractedInfo.extraction_failed) {
      throw new Error('情報抽出が失敗しました: ' + extractedInfo.error);
    }
    
    console.log('情報抽出完了');
    
    // Step 3: 結果の検証
    const validationResult = validateExtractedData(extractedInfo);
    
    return {
      success: true,
      file_id: fileId,
      ocr_text: ocrText,
      extracted_info: extractedInfo,
      validation: validationResult,
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
 * 抽出データの検証
 * @param {Object} data - 抽出されたデータ
 * @return {Object} 検証結果
 */
function validateExtractedData(data) {
  const issues = [];
  let score = 100;
  
  // 必須項目チェック
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
  
  // データ整合性チェック
  if (data.items && data.items.length > 0 && data.total_amount) {
    const calculatedTotal = data.items.reduce((sum, item) => {
      return sum + (item.subtotal || (item.quantity * item.unit_price) || 0);
    }, 0);
    
    const difference = Math.abs(calculatedTotal - data.total_amount);
    const tolerance = data.total_amount * 0.05; // 5%の誤差許容
    
    if (difference > tolerance) {
      issues.push(`金額計算に不整合があります（計算値: ${calculatedTotal}, 記載値: ${data.total_amount}）`);
      score -= 15;
    }
  }
  
  // 日付の妥当性チェック
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
 * 動画4のサンプルテキストでの統合テストデモ
 * 動画4のサンプル1（標準的注文書）でテスト
 */
function demonstrateIntegratedProcessing() {
  console.log('=== 統合処理デモンストレーション ===');
  
  // 動画4のサンプル1（標準的注文書）でのテスト
  const sampleOCRText = `
注文書

株式会社山田商事
〒100-0001 東京都千代田区千代田1-1-1
TEL: 03-1234-5678
Email: yamada@yamada-corp.co.jp

注文日: 2024/12/15
納期: 2024/12/25
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
  
  console.log('サンプルテキストでの抽出テスト');
  const result = extractOrderInfo(sampleOCRText);
  
  console.log('抽出結果:', JSON.stringify(result, null, 2));
  
  const validation = validateExtractedData(result);
  console.log('検証結果:', JSON.stringify(validation, null, 2));
}

/**
 * OpenAI APIキー設定用ヘルパー関数
 * 動画5で取得したAPIキーを安全に保存
 */
function setOpenAIAPIKey() {
  const apiKey = 'YOUR_OPENAI_API_KEY_HERE'; // 実際のAPIキーに置き換え
  
  if (apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
    console.log('⚠️ APIキーを実際の値に変更してください');
    console.log('OpenAI アカウント → API Keys → Create new secret key');
    console.log('動画5で取得したAPIキーをコード内で置き換えてください');
    return;
  }
  
  PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', apiKey);
  console.log('✅ OpenAI API キーを設定しました');
  console.log('💡 セキュリティのため、コード内のAPIキーは削除することをお勧めします');
}

/**
 * 動画5用エラーハンドリングテスト
 * APIキー未設定、不正データなどのエラー状況をシミュレーション
 */
function testErrorHandling() {
  console.log('=== エラーハンドリングテスト ===');
  
  // 1. 不正なJSONレスポンスのシミュレーション
  console.log('1. 不正なOCRテキストでのテスト');
  const invalidResult = extractOrderInfo('これは注文書ではない不正なテキストです');
  console.log('結果:', invalidResult);
  
  // 2. 空のテキストでのテスト
  console.log('2. 空テキストでのテスト');
  const emptyResult = extractOrderInfo('');
  console.log('結果:', emptyResult);
  
  // 3. APIキー未設定でのテスト
  console.log('3. APIキー未設定でのテスト');
  const originalKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  PropertiesService.getScriptProperties().deleteProperty('OPENAI_API_KEY');
  
  const noKeyResult = extractOrderInfo('テストテキスト');
  console.log('結果:', noKeyResult);
  
  // APIキーを復元
  if (originalKey) {
    PropertiesService.getScriptProperties().setProperty('OPENAI_API_KEY', originalKey);
  }
}

/**
 * ChatGPT APIのパフォーマンス・コスト測定テスト
 * 処理時間、トークン使用量、APIコストの概算
 */
function testPerformance() {
  console.log('=== パフォーマンステスト ===');
  
  const startTime = new Date();
  
  const sampleText = '株式会社テスト 商品A 10個 1000円 合計10000円';
  const result = extractOrderInfo(sampleText);
  
  const endTime = new Date();
  const processingTime = endTime - startTime;
  
  console.log('処理時間:', processingTime + 'ms');
  console.log('結果:', result);
  
  // API使用量の概算
  const estimatedTokens = sampleText.length / 4; // 大まかな推定
  console.log('推定トークン使用量:', estimatedTokens);
  
  // コスト概算 (gpt-4o-mini: $0.15 per 1M input tokens)
  const estimatedCost = (estimatedTokens / 1000000) * 0.15;
  console.log('推定コスト:', estimatedCost.toFixed(6), 'USD');
  console.log('日本円換算（150円/USD）:', (estimatedCost * 150).toFixed(3), '円');
}

/**
 * 動画1-5の総合設定確認（全機能統合チェック）
 * 動画2: API設定、動画3: Vision API、動画4: プロンプト、動画5: ChatGPT API
 */
function checkAllSetup() {
  console.log('=== 総合設定確認 ===');
  
  // 1. 必要なAPIキーの確認
  const visionKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
  const openaiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  console.log('Vision API キー:', visionKey ? '✅ 設定済み' : '❌ 未設定 (動画2で設定)');
  console.log('OpenAI API キー:', openaiKey ? '✅ 設定済み' : '❌ 未設定 (動画5で設定)');
  
  // 2. Google サービスへのアクセス確認
  try {
    DriveApp.getRootFolder();
    console.log('Google Drive アクセス: OK');
  } catch (error) {
    console.log('Google Drive アクセス: エラー', error.message);
  }
  
  try {
    SpreadsheetApp.getActiveSpreadsheet();
    console.log('スプレッドシート アクセス: OK');
  } catch (error) {
    console.log('スプレッドシート アクセス: エラー', error.message);
  }
  
  // 3. 動画1-5統合テスト
  if (visionKey && openaiKey) {
    console.log('動画1-5統合テスト実行中...');
    demonstrateIntegratedProcessing();
  } else {
    console.log('APIキーが未設定のため統合テストをスキップ');
    console.log('動画2でVision APIキー、動画5でOpenAI APIキーを設定してください');
  }
}

// ==============================================
// 動画3のVision API OCR関数を統合
// ==============================================

/**
 * 動画3のVision API OCR処理関数（統合版）
 * @param {string} fileId - Google DriveのファイルID
 * @return {string} 抽出されたテキスト
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
 * Vision API OCR処理（動画3版）
 * @param {Blob} blob - ファイルのBlob
 * @return {string} 抽出されたテキスト
 */
function performOCR(blob) {
  try {
    // APIキーの取得（動画2で設定）
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    
    if (!apiKey) {
      throw new Error('Vision API キーが設定されていません。動画2の手順で設定してください。');
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
 * PDFを画像に変換してOCR処理（動画3版）
 */
function convertPDFToImageAndOCR(file) {
  try {
    console.log('🔄 PDF→画像変換処理を開始');
    
    const fileId = file.getId();
    
    // Google Drive APIでPDFのサムネイルを取得（画像形式）
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
        return null;
      }
      
    } catch (error) {
      console.error('❌ PDF変換エラー:', error);
      return null;
    }
    
  } catch (error) {
    console.error('❌ PDF変換処理エラー:', error);
    return null;
  }
}

/**
 * 模擬OCR結果を返す（課金設定前のテスト用）
 * 動画4のサンプル1（標準的注文書）をベースにしたテストデータ
 * @return {string} サンプルの注文書テキスト
 */
function getMockOCRResult() {
  return `
注文書

株式会社山田商事
〒100-0001 東京都千代田区千代田1-1-1
TEL: 03-1234-5678
Email: yamada@yamada-corp.co.jp

注文日: 2024/12/15
納期: 2024/12/25
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

// ==============================================
// 動画4の8種類サンプルテキストでのテスト関数
// ==============================================

/**
 * 動画4のサンプルテキスト８種類での包括テスト
 * プロンプトの効果を実証するためのテスト関数
 */
function testAllSampleTexts() {
  console.log('=== 動画4サンプルテキスト8種類での包括テスト ===');
  
  const samples = getSampleTextsFromVideo4();
  
  samples.forEach((sample, index) => {
    console.log(`\n--- サンプル${index + 1}: ${sample.name} ---`);
    console.log('テキストプレビュー:', sample.text.substring(0, 100) + '...');
    
    try {
      const result = extractOrderInfo(sample.text);
      console.log('抽出結果:', JSON.stringify(result, null, 2));
      
      const validation = validateExtractedData(result);
      console.log('品質スコア:', validation.score + '点');
      console.log('信頼性レベル:', validation.confidence_level);
      
      if (validation.issues.length > 0) {
        console.log('発見された問題:', validation.issues);
      }
      
    } catch (error) {
      console.error('エラー:', error.message);
    }
  });
  
  console.log('\n=== テスト完了 ===');
}

/**
 * 動画4で作成した8種類のサンプルテキストを取得
 * @return {Array} サンプルテキストの配列
 */
function getSampleTextsFromVideo4() {
  return [
    {
      name: '標準的注文書',
      text: `
注文書

株式会社山田商事
〒100-0001 東京都千代田区千代田1-1-1
TEL: 03-1234-5678
Email: yamada@yamada-corp.co.jp

注文日: 2024/12/15
納期: 2024/12/25
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
      `
    },
    {
      name: '手書き混在（OCR誤認識含む）',
      text: `
発注書

有限会社 鈴木工業
住所: 大阪府大阪市北区梅田2-2-2
電話: 06-9876-543l (←「1」が「l」に誤認識)
担当: 佐藤花子

発注日: 2024/l2/20 (←「1」が「l」に誤認識)
希望納期: 2024年12月30目 (←「日」が「目」に誤認識)

商品リスト:
・スチール棚 S丁-200 x 3台 @20,OOO円 = 60,OOO円 (←「T」「O」に誤認識)
・作業台 WB-lOO x 2台 @35,OOO円 = 70,OOO円 (←「l」「O」に誤認識)
・工具箱 TB-50 x 5個 @8,OOO円 = 40,OOO円 (←「O」に誤認識)

総計: l70,OOO円 (税別) (←「1」「O」に誤認識)

※至急対応お願いします
      `
    },
    {
      name: '情報不足の注文書',
      text: `
注文書

田中商店

商品:
・椅子 10脚
・机 5台

合計: 15万円

12月中にお願いします。

連絡先: 090-xxxx-xxxx
      `
    },
    {
      name: '製造業特化の部品発注書',
      text: `
部品発注書

発注No: PO-2024-1215-001

発注先: 株式会社精密パーツ
発注者: 株式会社アルファ製作所
        技術部 調達課 山田太郎
        TEL: 042-123-4567
        Email: yamada@alpha-mfg.co.jp

発注日: 2024/12/15
納期: 2025/01/15

┌─────────────────────────────────────────┐
│品番      │品名              │材質      │数量│単価  │金額    │
├─────────────────────────────────────────┤
│AB-001    │ボルト M8×20      │SUS304    │1000│   50 │ 50,000 │
│CD-002    │ワッシャー φ8     │SS400     │1000│   10 │ 10,000 │
│EF-003    │プレート t=2.0    │A5052     │ 100│  800 │ 80,000 │
│GH-004    │シャフト φ20×100 │S45C      │  50│1,200 │ 60,000 │
└─────────────────────────────────────────┘

小計: 200,000円
消費税: 20,000円
合計: 220,000円

図面番号: DRW-2024-1215
検査基準: JIS B 0401
ロット管理: 必要
      `
    },
    {
      name: '飲食業の仕入れ発注書',
      text: `
食材発注書

仕入先: 株式会社フレッシュフーズ
発注者: レストラン美味亭
        料理長 佐藤シェフ
        TEL: 03-7777-8888

発注日: 2024年12月15日
納期: 2024年12月18日 午前中必着

商品名              産地      数量    単価    小計      保存
─────────────────────────────────────────
国産牛サーロイン    宮崎県    2kg     4,000   8,000     冷蔵
天然真鯛            愛媛県    3匹     1,500   4,500     冷蔵  
有機野菜セット      千葉県    1箱     2,500   2,500     冷蔵
国産小麦粉          北海道    10kg      800   8,000     常温
生クリーム35%       北海道    6本       450   2,700     冷蔵
卵（赤玉Lサイズ）   茨城県    5パック   380   1,900     冷蔵

合計: 27,600円（税込）

特記事項:
・消費期限3日以上のもの
・アレルギー表示確認済み
・配送時間厳守（仕込み時間の関係上）
      `
    }
  ];
}

// ==============================================
// 実際の運用用メイン関数
// ==============================================

/**
 * 動画5メイン実行関数：最新PDFを自動処理
 * 動画2のフォルダ構成から動画5のChatGPT API連携までの統合フロー
 */
function runVideo5MainProcess() {
  try {
    console.log('=== 動画5 メイン処理開始 ===');
    console.log('動画2フォルダ → 動画3 OCR → 動画4プロンプト → 動画5 ChatGPT API');
    
    // 動画2で作成したAI受注処理フォルダを取得
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
    
    // 動画1-5統合処理実行
    const result = processOrderPDFComplete(pdfFile.getId());
    
    if (result.success) {
      console.log('=== 動画1-5統合処理成功 ===');
      console.log('OCRテキスト長:', result.ocr_text.length, '文字');
      console.log('抽出された情報:', JSON.stringify(result.extracted_info, null, 2));
      console.log('品質スコア:', result.validation.score, '点');
      
      // 処理済みフォルダに移動
      moveToProcessedFolder(pdfFile);
      
    } else {
      console.log('=== 処理失敗 ===');
      console.log('エラー:', result.error);
    }
    
  } catch (error) {
    console.error('メイン処理エラー:', error);
  }
}

/**
 * 処理済みファイルを「処理済み」フォルダに移動
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