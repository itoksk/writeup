// ================================================================================================
// 動画1デモ用: AI承認システム（プラットフォーム中立版）
// 2:30-5:00のデモシーンで使用
// 承認依頼 → AIが分析・判断 → 3秒後に結果通知
// ================================================================================================

/**
 * メイン実行関数（動画デモ用）
 * 承認依頼を監視し、AIで自動判断して返信
 */
async function runApprovalDemo() {
  console.log("=".repeat(60));
  console.log("   🚀 AI承認システム デモンストレーション");
  console.log("   マルチプラットフォーム対応版");
  console.log("=".repeat(60) + "\n");
  
  // デモ用の承認依頼データ
  const demoRequest = {
    from: "田中（営業部）",
    subject: "【承認依頼】新規顧客向けキャンペーン費用30万円",
    body: "お疲れ様です。\n\n新規顧客向けキャンペーン費用30万円の承認をお願いします。\n\n田中",
    timestamp: new Date()
  };
  
  // デモ実行
  console.log("📧 承認依頼が届きました");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`From: ${demoRequest.from}`);
  console.log(`件名: ${demoRequest.subject}`);
  console.log(`本文: ${demoRequest.body}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // AI分析シミュレーション
  await simulateAIAnalysis(demoRequest);
}

/**
 * AI分析シミュレーション（マルチAI対応）
 */
async function simulateAIAnalysis(request) {
  console.log("🤖 AI承認システムが分析を開始します...\n");
  
  // ステップ1: 過去データ確認
  await sleep(1000);
  console.log("📊 過去の類似案件を検索中...");
  const similarCases = await searchSimilarCases();
  console.log(`   → ${similarCases.length}件の類似案件を発見\n`);
  
  // ステップ2: 予算・効果分析
  await sleep(1000);
  console.log("💰 予算・効果の妥当性を分析中...");
  const budgetAnalysis = await analyzeBudget(request);
  console.log(`   → ${budgetAnalysis}\n`);
  
  // ステップ3: リスク評価
  await sleep(1000);
  console.log("⚠️  リスク評価を実施中...");
  const riskLevel = await evaluateRisk(request);
  console.log(`   → リスクレベル: ${riskLevel}\n`);
  
  // 判断結果
  const decision = makeDecision(similarCases, budgetAnalysis, riskLevel);
  
  // 結果表示
  console.log("\n📧 自動返信");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(formatReply(decision));
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  
  // データベースに記録
  console.log("📝 承認履歴をデータベースに自動記録しました");
  console.log("   → 記録ID: AP-2024-0115-001");
  
  console.log("\n✨ これが皆さんが手に入れる未来です");
  console.log("   もう悩む必要はありません\n");
}

/**
 * 類似案件検索（デモ用）
 */
async function searchSimilarCases() {
  // 実際はデータベースやスプレッドシートから取得
  return [
    {
      date: "2023/12/15",
      request: "新規顧客向けキャンペーン費用28万円",
      decision: "承認",
      roi: 280
    },
    {
      date: "2023/11/20",
      request: "既存顧客向けキャンペーン費用32万円",
      decision: "承認",
      roi: 275
    }
  ];
}

/**
 * 予算分析（デモ用）
 */
async function analyzeBudget(request) {
  // 実際はAI APIで分析
  const amount = extractAmount(request.subject);
  if (amount <= 300000) {
    return "予算範囲内（月間マーケティング予算の15%）";
  }
  return "要検討";
}

/**
 * リスク評価（デモ用）
 */
async function evaluateRisk(request) {
  const amount = extractAmount(request.subject);
  if (amount <= 200000) return "低";
  if (amount <= 500000) return "中";
  return "高";
}

/**
 * 金額抽出
 */
function extractAmount(text) {
  const match = text.match(/(\d+)万円/);
  return match ? parseInt(match[1]) * 10000 : 0;
}

/**
 * 承認判断（デモ用）
 */
function makeDecision(similarCases, budgetAnalysis, riskLevel) {
  // 動画シナリオ通り承認
  const avgROI = similarCases.reduce((sum, c) => sum + c.roi, 0) / similarCases.length;
  
  return {
    decision: "承認",
    reasoning: `過去の同規模キャンペーンで平均ROI ${Math.round(avgROI)}%を記録。予算範囲内で妥当と判断`,
    confidence: 95,
    processingTime: "3秒"
  };
}

/**
 * 返信フォーマット
 */
function formatReply(decision) {
  const emoji = decision.decision === "承認" ? "✅" : "❌";
  
  return `To: 田中（営業部）
件名: Re: 【承認依頼】新規顧客向けキャンペーン費用30万円

田中さん

お疲れ様です。
AI承認システムによる判断結果をお知らせします。

${emoji} 【${decision.decision}】

■ 判断根拠
${decision.reasoning}

■ AI信頼度: ${decision.confidence}%
■ 処理時間: ${decision.processingTime}

承認コード: AP-2024-0115-001

---
AI承認システム v1.0`;
}

/**
 * スリープ関数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================================================================================
// プラットフォーム別実装例
// ================================================================================================

/**
 * AI APIを呼び出す汎用関数
 * @param {string} provider - AI提供者（'openai', 'anthropic', 'gemini'）
 * @param {string} prompt - プロンプト
 * @returns {Promise<string>} - AI応答
 */
async function callAI(provider, prompt) {
  // 実際の実装では各AIプロバイダーのAPIを呼び出す
  const providers = {
    openai: async (prompt) => {
      // ChatGPT APIの呼び出し
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {...});
      return "ChatGPTからの応答";
    },
    anthropic: async (prompt) => {
      // Claude APIの呼び出し
      // const response = await fetch('https://api.anthropic.com/v1/messages', {...});
      return "Claudeからの応答";
    },
    gemini: async (prompt) => {
      // Gemini APIの呼び出し
      // const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {...});
      return "Geminiからの応答";
    }
  };
  
  return providers[provider] ? await providers[provider](prompt) : "デモ応答";
}

/**
 * データストレージへの記録（汎用版）
 * @param {Object} data - 記録するデータ
 * @param {string} storage - ストレージタイプ（'spreadsheet', 'database', 'notion'）
 */
async function recordToStorage(data, storage) {
  const storageHandlers = {
    spreadsheet: async (data) => {
      // スプレッドシートへの記録
      console.log("スプレッドシートに記録:", data);
    },
    database: async (data) => {
      // PostgreSQL/MySQLなどへの記録
      console.log("データベースに記録:", data);
    },
    notion: async (data) => {
      // Notion APIでの記録
      console.log("Notionに記録:", data);
    }
  };
  
  if (storageHandlers[storage]) {
    await storageHandlers[storage](data);
  }
}

/**
 * 通知送信（汎用版）
 * @param {Object} notification - 通知内容
 * @param {string} channel - 通知チャネル（'slack', 'teams', 'email'）
 */
async function sendNotification(notification, channel) {
  const notificationHandlers = {
    slack: async (data) => {
      // Slack Webhook/API
      console.log("Slackに通知:", data);
    },
    teams: async (data) => {
      // Microsoft Teams Webhook
      console.log("Teamsに通知:", data);
    },
    email: async (data) => {
      // メール送信
      console.log("メール送信:", data);
    }
  };
  
  if (notificationHandlers[channel]) {
    await notificationHandlers[channel](notification);
  }
}

// ================================================================================================
// Web UIデモ用
// ================================================================================================

/**
 * Web UIでのデモ表示
 */
function createWebDemo() {
  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>AI承認システム デモ</title>
    <style>
        body {
            font-family: 'Hiragino Kaku Gothic ProN', sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .demo-container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .request-form {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .result {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            display: none;
        }
        .button {
            background: #2196f3;
            color: white;
            border: none;
            padding: 10px 30px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        .button:hover {
            background: #1976d2;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <h1>🤖 AI承認システム デモ</h1>
        
        <div class="request-form">
            <h3>承認依頼</h3>
            <p><strong>依頼者:</strong> 田中（営業部）</p>
            <p><strong>件名:</strong> 新規顧客向けキャンペーン費用30万円の承認</p>
            <p><strong>内容:</strong> お疲れ様です。新規顧客向けキャンペーン費用30万円の承認をお願いします。</p>
            <button class="button" onclick="processRequest()">AI分析を実行</button>
        </div>
        
        <div class="result" id="result">
            <h3>✅ 承認</h3>
            <p><strong>判断根拠:</strong> 過去の同規模キャンペーンで平均ROI 280%を記録。予算範囲内で妥当と判断</p>
            <p><strong>処理時間:</strong> 3秒</p>
            <p><strong>承認コード:</strong> AP-2024-0115-001</p>
        </div>
    </div>
    
    <script>
        function processRequest() {
            const button = document.querySelector('.button');
            const result = document.getElementById('result');
            
            button.disabled = true;
            button.textContent = 'AI分析中...';
            
            setTimeout(() => {
                result.style.display = 'block';
                button.textContent = '完了';
            }, 3000);
        }
    </script>
</body>
</html>
  `;
  
  return html;
}

// ================================================================================================
// 動画撮影用の実行
// ================================================================================================
// 実行方法：
// 1. Node.js環境で実行: node デモ用_AI承認システム.js
// 2. ブラウザ環境で実行: HTMLファイルとして保存して開く
// 3. 各プラットフォームのスクリプト環境に合わせて調整

// Node.js環境での実行
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  runApprovalDemo();
}