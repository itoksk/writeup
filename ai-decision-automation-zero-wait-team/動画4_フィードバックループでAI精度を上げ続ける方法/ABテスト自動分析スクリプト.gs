/**
 * A/Bテスト自動分析スクリプト
 * 動画4: フィードバックループでAI精度を上げ続ける方法
 * 
 * このスクリプトは週次で実行し、A/Bテストの結果を自動分析します
 */

// メイン関数：週次で自動実行
function analyzeABTest() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ABテスト管理');
  
  // 分析結果を記録するシートを取得（なければ作成）
  let resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('分析結果');
  if (!resultSheet) {
    resultSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('分析結果');
    setupResultSheet(resultSheet);
  }
  
  // 1. 基本的な精度計算
  const accuracyA = calculateAccuracy(sheet, 'プロンプトA');
  const accuracyB = calculateAccuracy(sheet, 'プロンプトB');
  const sampleSize = countValidSamples(sheet);
  
  // 2. カテゴリ別分析
  const categoryAnalysis = analyzeByCategorory(sheet);
  
  // 3. 失敗パターンの抽出
  const failurePatterns = extractFailurePatterns(sheet);
  
  // 4. 信頼度分析
  const confidenceAnalysis = analyzeConfidenceLevel(sheet);
  
  // 5. 時系列トレンド分析
  const trendAnalysis = analyzeTrend(sheet);
  
  // 6. 統計的有意性の判定
  const significance = checkStatisticalSignificance(accuracyA, accuracyB, sampleSize);
  
  // 7. レポート生成と保存
  const report = generateReport({
    accuracyA,
    accuracyB,
    sampleSize,
    categoryAnalysis,
    failurePatterns,
    confidenceAnalysis,
    trendAnalysis,
    significance
  });
  
  // 結果をシートに記録
  recordResults(resultSheet, report);
  
  // 8. 改善提案の生成
  const recommendations = generateRecommendations(report);
  
  // 9. Slackに通知（動画5で詳細を説明）
  if (significance.isSignificant) {
    notifySlack(report, recommendations);
  }
  
  return report;
}

// 精度計算関数
function calculateAccuracy(sheet, promptVersion) {
  const data = sheet.getDataRange().getValues();
  let correct = 0;
  let total = 0;
  
  console.log(`Calculating accuracy for ${promptVersion}`);
  console.log(`Total rows: ${data.length}`);
  
  // ヘッダー行をスキップ
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const prompt = row[2]; // C列: プロンプト版
    const result = row[6]; // G列: 正誤判定
    
    // デバッグ用ログ
    if (i === 1) {
      console.log(`Sample row: ${JSON.stringify(row)}`);
      console.log(`Prompt: ${prompt}, Result: ${result}`);
    }
    
    // 数値型でも文字列型でも対応
    const resultValue = typeof result === 'string' ? parseInt(result) : result;
    
    if (prompt === promptVersion && resultValue !== '' && !isNaN(resultValue)) {
      total++;
      if (resultValue === 1) {
        correct++;
      }
    }
  }
  
  console.log(`${promptVersion}: ${correct}/${total} = ${total > 0 ? correct / total : 0}`);
  
  return total > 0 ? correct / total : 0;
}

// 有効サンプル数のカウント
function countValidSamples(sheet) {
  const data = sheet.getDataRange().getValues();
  let count = 0;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][6] !== '') { // G列: 正誤判定が入力されている
      count++;
    }
  }
  
  return count;
}

// カテゴリ別分析
function analyzeByCategorory(sheet) {
  const data = sheet.getDataRange().getValues();
  const categories = {};
  
  for (let i = 1; i < data.length; i++) {
    const category = data[i][7]; // H列: カテゴリ
    const prompt = data[i][2]; // C列: プロンプト版
    const result = data[i][6]; // G列: 正誤判定
    
    if (category && result !== '') {
      if (!categories[category]) {
        categories[category] = {
          promptA: { correct: 0, total: 0 },
          promptB: { correct: 0, total: 0 }
        };
      }
      
      const promptKey = prompt === 'プロンプトA' ? 'promptA' : 'promptB';
      categories[category][promptKey].total++;
      if (result === 1) {
        categories[category][promptKey].correct++;
      }
    }
  }
  
  // 精度を計算
  const analysis = {};
  for (const cat in categories) {
    analysis[cat] = {
      promptA: categories[cat].promptA.total > 0 
        ? categories[cat].promptA.correct / categories[cat].promptA.total 
        : null,
      promptB: categories[cat].promptB.total > 0 
        ? categories[cat].promptB.correct / categories[cat].promptB.total 
        : null,
      improvement: null
    };
    
    if (analysis[cat].promptA !== null && analysis[cat].promptB !== null) {
      analysis[cat].improvement = analysis[cat].promptB - analysis[cat].promptA;
    }
  }
  
  return analysis;
}

// 失敗パターンの抽出
function extractFailurePatterns(sheet) {
  const data = sheet.getDataRange().getValues();
  const failures = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const result = row[6]; // G列: 正誤判定
    
    if (result === 0) { // 失敗ケース
      failures.push({
        date: row[0],
        content: row[1],
        prompt: row[2],
        aiDecision: row[3],
        confidence: row[4],
        actualResult: row[5],
        category: row[7],
        amount: row[8],
        note: row[9]
      });
    }
  }
  
  // パターン分析
  const patterns = analyzeFailurePatterns(failures);
  
  return {
    failures: failures,
    patterns: patterns
  };
}

// 失敗パターンの詳細分析
function analyzeFailurePatterns(failures) {
  const patterns = {
    byCategory: {},
    byAmountRange: {},
    byConfidenceLevel: {},
    commonKeywords: {}
  };
  
  failures.forEach(failure => {
    // カテゴリ別
    if (!patterns.byCategory[failure.category]) {
      patterns.byCategory[failure.category] = 0;
    }
    patterns.byCategory[failure.category]++;
    
    // 金額レンジ別
    let amountValue = 0;
    if (typeof failure.amount === 'string') {
      amountValue = parseInt(failure.amount.replace(/[^0-9]/g, ''));
    } else if (typeof failure.amount === 'number') {
      amountValue = failure.amount;
    }
    const range = getAmountRange(amountValue);
    if (!patterns.byAmountRange[range]) {
      patterns.byAmountRange[range] = 0;
    }
    patterns.byAmountRange[range]++;
    
    // 信頼度レベル別
    let confidenceValue = 0;
    if (typeof failure.confidence === 'string') {
      confidenceValue = parseInt(failure.confidence.replace('%', ''));
    } else if (typeof failure.confidence === 'number') {
      confidenceValue = failure.confidence;
    }
    const confidenceRange = getConfidenceRange(confidenceValue);
    if (!patterns.byConfidenceLevel[confidenceRange]) {
      patterns.byConfidenceLevel[confidenceRange] = 0;
    }
    patterns.byConfidenceLevel[confidenceRange]++;
  });
  
  return patterns;
}

// 金額レンジの判定
function getAmountRange(amount) {
  if (amount < 300000) return '30万円未満';
  if (amount < 500000) return '30-50万円';
  if (amount < 1000000) return '50-100万円';
  return '100万円以上';
}

// 信頼度レンジの判定
function getConfidenceRange(confidence) {
  if (confidence < 60) return '低（60%未満）';
  if (confidence < 70) return '中低（60-70%）';
  if (confidence < 80) return '中（70-80%）';
  if (confidence < 90) return '中高（80-90%）';
  return '高（90%以上）';
}

// 信頼度の分析
function analyzeConfidenceLevel(sheet) {
  const data = sheet.getDataRange().getValues();
  const analysis = {
    promptA: { totalConfidence: 0, count: 0, correctHighConfidence: 0, highConfidenceCount: 0 },
    promptB: { totalConfidence: 0, count: 0, correctHighConfidence: 0, highConfidenceCount: 0 }
  };
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const prompt = row[2];
    let confidence = 0;
    if (typeof row[4] === 'string') {
      confidence = parseInt(row[4].replace('%', ''));
    } else if (typeof row[4] === 'number') {
      confidence = row[4];
    }
    const result = row[6];
    
    if (prompt && confidence && result !== '') {
      const promptKey = prompt === 'プロンプトA' ? 'promptA' : 'promptB';
      analysis[promptKey].totalConfidence += confidence;
      analysis[promptKey].count++;
      
      if (confidence >= 80) {
        analysis[promptKey].highConfidenceCount++;
        if (result === 1) {
          analysis[promptKey].correctHighConfidence++;
        }
      }
    }
  }
  
  // 平均信頼度と高信頼度精度を計算
  return {
    promptA: {
      averageConfidence: analysis.promptA.count > 0 
        ? analysis.promptA.totalConfidence / analysis.promptA.count 
        : 0,
      highConfidenceAccuracy: analysis.promptA.highConfidenceCount > 0
        ? analysis.promptA.correctHighConfidence / analysis.promptA.highConfidenceCount
        : 0
    },
    promptB: {
      averageConfidence: analysis.promptB.count > 0 
        ? analysis.promptB.totalConfidence / analysis.promptB.count 
        : 0,
      highConfidenceAccuracy: analysis.promptB.highConfidenceCount > 0
        ? analysis.promptB.correctHighConfidence / analysis.promptB.highConfidenceCount
        : 0
    }
  };
}

// 時系列トレンド分析
function analyzeTrend(sheet) {
  const data = sheet.getDataRange().getValues();
  const weeklyData = {};
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = new Date(row[0]);
    const weekKey = getWeekKey(date);
    const prompt = row[2];
    const result = row[6];
    
    if (prompt && result !== '') {
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          promptA: { correct: 0, total: 0 },
          promptB: { correct: 0, total: 0 }
        };
      }
      
      const promptKey = prompt === 'プロンプトA' ? 'promptA' : 'promptB';
      weeklyData[weekKey][promptKey].total++;
      if (result === 1) {
        weeklyData[weekKey][promptKey].correct++;
      }
    }
  }
  
  // 週ごとの精度を計算
  const trend = [];
  for (const week in weeklyData) {
    trend.push({
      week: week,
      promptA: weeklyData[week].promptA.total > 0
        ? weeklyData[week].promptA.correct / weeklyData[week].promptA.total
        : null,
      promptB: weeklyData[week].promptB.total > 0
        ? weeklyData[week].promptB.correct / weeklyData[week].promptB.total
        : null
    });
  }
  
  return trend.sort((a, b) => a.week.localeCompare(b.week));
}

// 週のキーを生成
function getWeekKey(date) {
  const year = date.getFullYear();
  const weekNumber = getWeekNumber(date);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// 週番号を取得
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// 統計的有意性の確認
function checkStatisticalSignificance(accuracyA, accuracyB, sampleSize) {
  // 簡易的な判定（本来はカイ二乗検定などを使用）
  const difference = Math.abs(accuracyB - accuracyA);
  const threshold = 1.96 * Math.sqrt((accuracyA * (1 - accuracyA) + accuracyB * (1 - accuracyB)) / sampleSize);
  
  return {
    isSignificant: sampleSize >= 30 && difference > threshold,
    sampleSize: sampleSize,
    difference: difference,
    threshold: threshold,
    winner: accuracyB > accuracyA ? 'プロンプトB' : 'プロンプトA'
  };
}

// レポート生成
function generateReport(data) {
  const report = {
    date: new Date(),
    overallAccuracy: {
      promptA: data.accuracyA,
      promptB: data.accuracyB,
      improvement: data.accuracyB - data.accuracyA
    },
    sampleSize: data.sampleSize,
    categoryAnalysis: data.categoryAnalysis,
    failurePatterns: data.failurePatterns,
    confidenceAnalysis: data.confidenceAnalysis,
    trendAnalysis: data.trendAnalysis,
    significance: data.significance
  };
  
  return report;
}

// 改善提案の生成
function generateRecommendations(report) {
  const recommendations = [];
  
  // 1. 有意差がある場合の提案
  if (report.significance.isSignificant) {
    recommendations.push({
      priority: '高',
      type: '実装',
      message: `${report.significance.winner}が統計的に有意に優れています。本番環境への適用を推奨します。`,
      improvement: `精度が${(report.overallAccuracy.improvement * 100).toFixed(1)}%向上します。`
    });
  }
  
  // 2. カテゴリ別の提案
  for (const category in report.categoryAnalysis) {
    const catData = report.categoryAnalysis[category];
    if (catData.improvement && catData.improvement < -0.05) {
      recommendations.push({
        priority: '中',
        type: 'カテゴリ最適化',
        message: `${category}カテゴリではプロンプトBの精度が低下しています。`,
        action: `${category}専用のプロンプト調整を検討してください。`
      });
    }
  }
  
  // 3. 失敗パターンに基づく提案
  const failurePatterns = report.failurePatterns.patterns;
  for (const range in failurePatterns.byAmountRange) {
    if (failurePatterns.byAmountRange[range] > 5) {
      recommendations.push({
        priority: '中',
        type: '金額レンジ最適化',
        message: `${range}の案件で失敗が多発しています（${failurePatterns.byAmountRange[range]}件）。`,
        action: 'この金額帯の判断基準を見直してください。'
      });
    }
  }
  
  // 4. 信頼度に基づく提案
  const confA = report.confidenceAnalysis.promptA;
  const confB = report.confidenceAnalysis.promptB;
  if (confB.averageConfidence < confA.averageConfidence - 5) {
    recommendations.push({
      priority: '低',
      type: '信頼度改善',
      message: 'プロンプトBの平均信頼度が低下しています。',
      action: '判断根拠の明確化を検討してください。'
    });
  }
  
  return recommendations;
}

// 結果をシートに記録
function recordResults(sheet, report) {
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  
  // ヘッダーがない場合は追加
  if (lastRow === 0) {
    sheet.getRange(1, 1, 1, 8).setValues([[
      '分析日時', '全体精度A', '全体精度B', '改善率', 'サンプル数', 
      '統計的有意性', '勝者', '主な改善提案'
    ]]);
  }
  
  // データを記録
  sheet.getRange(newRow, 1, 1, 8).setValues([[
    report.date,
    (report.overallAccuracy.promptA * 100).toFixed(1) + '%',
    (report.overallAccuracy.promptB * 100).toFixed(1) + '%',
    (report.overallAccuracy.improvement * 100).toFixed(1) + '%',
    report.sampleSize,
    report.significance.isSignificant ? '有意' : '非有意',
    report.significance.winner,
    '詳細は分析レポート参照'
  ]]);
}

// 分析結果シートのセットアップ
function setupResultSheet(sheet) {
  sheet.getRange(1, 1, 1, 8).setValues([[
    '分析日時', '全体精度A', '全体精度B', '改善率', 'サンプル数', 
    '統計的有意性', '勝者', '主な改善提案'
  ]]);
  
  // ヘッダーのスタイル設定
  const headerRange = sheet.getRange(1, 1, 1, 8);
  headerRange.setBackground('#667eea');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
}

// Slack通知（動画5で詳細実装）
function notifySlack(report, recommendations) {
  // 動画5でWebhook URLを設定して実装
  const message = `
🎉 A/Bテスト分析完了

📊 結果サマリー:
- プロンプトA精度: ${(report.overallAccuracy.promptA * 100).toFixed(1)}%
- プロンプトB精度: ${(report.overallAccuracy.promptB * 100).toFixed(1)}%
- 改善率: ${(report.overallAccuracy.improvement * 100).toFixed(1)}%
- サンプル数: ${report.sampleSize}

🏆 勝者: ${report.significance.winner}

📋 推奨アクション:
${recommendations.slice(0, 3).map(r => `- ${r.message}`).join('\n')}
  `;
  
  // console.log(message); // 動画5で実際のSlack送信に置き換え
}

// 手動実行用のテスト関数
function testAnalysis() {
  const report = analyzeABTest();
  console.log('分析完了:', report);
}

// 週次トリガーの設定関数
function setupWeeklyTrigger() {
  ScriptApp.newTrigger('analyzeABTest')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}