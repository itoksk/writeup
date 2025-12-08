// ================================================================================================
// Slack AI承認ボット - Google Apps Script実装
// ChatGPT連携による自動承認判断システム
// ================================================================================================

// 設定情報（Google Apps Script Properties Storeに保存）
const CONFIG = {
  OPENAI_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY'),
  SLACK_BOT_TOKEN: PropertiesService.getScriptProperties().getProperty('SLACK_BOT_TOKEN'),
  SLACK_SIGNING_SECRET: PropertiesService.getScriptProperties().getProperty('SLACK_SIGNING_SECRET'),
  SHEETS_ID: PropertiesService.getScriptProperties().getProperty('APPROVAL_SHEETS_ID')
};

// ================================================================================================
// Slackからのイベント受信（Webhook エンドポイント）
// ================================================================================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Slack URL verification
    if (data.challenge) {
      return ContentService.createTextOutput(data.challenge);
    }
    
    // メンション受信時の処理
    if (data.event && data.event.type === 'app_mention') {
      handleApprovalRequest(data.event);
    }
    
    // リアクション受信時の処理（フィードバック用）
    if (data.event && data.event.type === 'reaction_added') {
      handleFeedback(data.event);
    }
    
    return ContentService.createTextOutput('OK');
    
  } catch (error) {
    console.error('doPost Error:', error);
    return ContentService.createTextOutput('Error: ' + error.message);
  }
}

// ================================================================================================
// 承認依頼の処理
// ================================================================================================
function handleApprovalRequest(event) {
  try {
    // メッセージからメンション部分を除去
    const message = event.text.replace(/<@.*?>/g, '').trim();
    const channel = event.channel;
    const userId = event.user;
    const timestamp = event.ts;
    
    console.log('承認依頼受信:', message);
    
    // 緊急度チェック
    const urgency = detectUrgency(message);
    
    // 特別コマンドの処理
    if (message.includes('履歴') || message.includes('検索')) {
      handleHistorySearch(channel, message);
      return;
    }
    
    if (message.includes('月報') || message.includes('レポート')) {
      handleMonthlyReport(channel);
      return;
    }
    
    // ChatGPT判断実行
    const judgment = callChatGPTAPI(message, urgency);
    
    // Slackに結果送信
    const response = formatSlackResponse(judgment, urgency);
    const messageTs = sendSlackMessage(channel, response);
    
    // Google Sheetsに記録
    recordApprovalHistory(message, judgment, userId, urgency, messageTs);
    
    // 緊急度が高い場合の特別処理
    if (urgency === 'HIGH') {
      notifyManagers(channel, message, judgment);
    }
    
  } catch (error) {
    console.error('handleApprovalRequest Error:', error);
    sendSlackMessage(event.channel, 
      '⚠️ システム障害が発生しました。手動で判断をお願いします。\n' +
      'エラー詳細: ' + error.message
    );
  }
}

// ================================================================================================
// ChatGPT API呼び出し
// ================================================================================================
function callChatGPTAPI(requestContent, urgency = 'NORMAL') {
  const prompt = getOptimizedPrompt(urgency);
  const fullPrompt = `${prompt}\n\n承認依頼: ${requestContent}`;
  
  const payload = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "あなたは承認業務の専門AIです。迅速かつ正確な判断を行ってください。"
      },
      {
        role: "user", 
        content: fullPrompt
      }
    ],
    max_tokens: 800,
    temperature: 0.3
  };
  
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + CONFIG.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", options);
  
  if (response.getResponseCode() !== 200) {
    throw new Error(`ChatGPT API Error: ${response.getResponseCode()}`);
  }
  
  const result = JSON.parse(response.getContentText());
  return result.choices[0].message.content;
}

// ================================================================================================
// プロンプト取得（緊急度に応じて調整）
// ================================================================================================
function getOptimizedPrompt(urgency = 'NORMAL') {
  let basePrompt = `
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
`;

  // 緊急度に応じた調整
  if (urgency === 'HIGH') {
    basePrompt += `\n## 緊急案件特別指示
この案件は緊急度が高いため、以下を重視してください：
- より迅速な判断（情報不足でも合理的推定で判断）
- リスクと緊急性のバランス考慮
- 段階的承認の提案（まず小規模実施等）`;
  }
  
  return basePrompt;
}

// ================================================================================================
// 緊急度検出
// ================================================================================================
function detectUrgency(message) {
  const urgentKeywords = ['緊急', '至急', '急ぎ', '今日中', '明日まで', 'ASAP', '即日'];
  const normalKeywords = ['来月', '来年', '検討中', '予定'];
  
  for (const keyword of urgentKeywords) {
    if (message.includes(keyword)) {
      return 'HIGH';
    }
  }
  
  for (const keyword of normalKeywords) {
    if (message.includes(keyword)) {
      return 'LOW';
    }
  }
  
  return 'NORMAL';
}

// ================================================================================================
// Slack応答フォーマット
// ================================================================================================
function formatSlackResponse(judgment, urgency) {
  const urgencyEmoji = {
    'HIGH': '🚨',
    'NORMAL': '✅',
    'LOW': '📝'
  };
  
  const emoji = urgencyEmoji[urgency] || '✅';
  const recordId = generateRecordId();
  
  return `${emoji} **AI承認判断完了**

${judgment}

**記録ID:** #${recordId}
**処理時間:** ${new Date().toLocaleString('ja-JP')}
📊 詳細履歴はGoogle Sheetsに自動記録済み

*判断に疑問がある場合は 👍👎 でフィードバックをお願いします*`;
}

// ================================================================================================
// Slackメッセージ送信
// ================================================================================================
function sendSlackMessage(channel, message) {
  const payload = {
    channel: channel,
    text: message,
    as_user: false,
    username: "承認AI",
    icon_emoji: ":robot_face:",
    parse: "full"
  };
  
  const options = {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + CONFIG.SLACK_BOT_TOKEN,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
  const result = JSON.parse(response.getContentText());
  
  if (!result.ok) {
    throw new Error(`Slack API Error: ${result.error}`);
  }
  
  return result.ts; // タイムスタンプを返す（記録用）
}

// ================================================================================================
// Google Sheetsに履歴記録
// ================================================================================================
function recordApprovalHistory(message, judgment, userId, urgency, messageTs) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEETS_ID).getSheetByName('承認履歴');
    
    const recordId = generateRecordId();
    const timestamp = new Date();
    
    // 判断結果から構造化データを抽出
    const structuredJudgment = parseJudgment(judgment);
    
    const rowData = [
      timestamp,                           // A: 日時
      recordId,                           // B: 記録ID
      message,                            // C: 依頼内容
      structuredJudgment.decision,        // D: 判断結果
      structuredJudgment.confidence,      // E: 信頼度
      urgency,                           // F: 緊急度
      userId,                            // G: 依頼者ID
      messageTs,                         // H: SlackメッセージTS
      '',                                // I: 実際の結果（後で更新）
      '',                                // J: 正誤判定（後で更新）
      structuredJudgment.reasoning.join('|'), // K: 判断根拠
      judgment                           // L: 完全な判断内容
    ];
    
    sheet.appendRow(rowData);
    
    console.log('記録完了:', recordId);
    
  } catch (error) {
    console.error('recordApprovalHistory Error:', error);
  }
}

// ================================================================================================
// 判断結果の構造化解析
// ================================================================================================
function parseJudgment(judgment) {
  const result = {
    decision: '不明',
    confidence: 0,
    reasoning: []
  };
  
  // 判断結果の抽出
  const decisionMatch = judgment.match(/【判断結果】\s*(.+)/);
  if (decisionMatch) {
    result.decision = decisionMatch[1].trim();
  }
  
  // 信頼度の抽出
  const confidenceMatch = judgment.match(/【信頼度】\s*(\d+)%?/);
  if (confidenceMatch) {
    result.confidence = parseInt(confidenceMatch[1]);
  }
  
  // 判断根拠の抽出
  const reasoningSection = judgment.match(/【判断根拠】\s*([\s\S]*?)【/);
  if (reasoningSection) {
    const reasons = reasoningSection[1].split(/\d+\./).filter(r => r.trim());
    result.reasoning = reasons.map(r => r.trim());
  }
  
  return result;
}

// ================================================================================================
// 履歴検索機能
// ================================================================================================
function handleHistorySearch(channel, query) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEETS_ID).getSheetByName('承認履歴');
    const data = sheet.getDataRange().getValues();
    
    const searchTerm = query.replace(/履歴|検索/g, '').trim();
    const matches = [];
    
    for (let i = 1; i < data.length; i++) { // ヘッダー行をスキップ
      const row = data[i];
      if (row[2] && row[2].toString().includes(searchTerm)) { // 依頼内容で検索
        matches.push({
          date: row[0],
          content: row[2],
          decision: row[3],
          confidence: row[4]
        });
      }
    }
    
    let response = `🔍 **検索結果: "${searchTerm}"**\n\n`;
    
    if (matches.length === 0) {
      response += '該当する履歴が見つかりませんでした。';
    } else {
      matches.slice(0, 5).forEach((match, index) => { // 最大5件表示
        response += `**${index + 1}.** ${match.date.toLocaleDateString()}\n`;
        response += `内容: ${match.content.substring(0, 100)}...\n`;
        response += `判断: ${match.decision} (信頼度: ${match.confidence}%)\n\n`;
      });
      
      if (matches.length > 5) {
        response += `*他 ${matches.length - 5} 件の結果があります*`;
      }
    }
    
    sendSlackMessage(channel, response);
    
  } catch (error) {
    console.error('handleHistorySearch Error:', error);
    sendSlackMessage(channel, '❌ 検索中にエラーが発生しました。');
  }
}

// ================================================================================================
// 月次レポート生成
// ================================================================================================
function handleMonthlyReport(channel) {
  try {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEETS_ID).getSheetByName('承認履歴');
    const data = sheet.getDataRange().getValues();
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyData = data.filter(row => {
      if (row[0] instanceof Date) {
        return row[0].getMonth() === currentMonth && row[0].getFullYear() === currentYear;
      }
      return false;
    });
    
    const stats = {
      total: monthlyData.length,
      approved: monthlyData.filter(row => row[3] === '承認').length,
      conditional: monthlyData.filter(row => row[3] === '条件付き承認').length,
      rejected: monthlyData.filter(row => row[3] === '却下').length,
      avgConfidence: monthlyData.reduce((sum, row) => sum + (row[4] || 0), 0) / monthlyData.length
    };
    
    const response = `📊 **${currentYear}年${currentMonth + 1}月 承認状況レポート**

**📈 総件数:** ${stats.total}件
**✅ 承認:** ${stats.approved}件 (${Math.round(stats.approved/stats.total*100)}%)
**⚠️ 条件付き承認:** ${stats.conditional}件 (${Math.round(stats.conditional/stats.total*100)}%)
**❌ 却下:** ${stats.rejected}件 (${Math.round(stats.rejected/stats.total*100)}%)

**🎯 平均信頼度:** ${Math.round(stats.avgConfidence)}%

📋 詳細データはGoogle Sheetsでご確認ください`;
    
    sendSlackMessage(channel, response);
    
  } catch (error) {
    console.error('handleMonthlyReport Error:', error);
    sendSlackMessage(channel, '❌ レポート生成中にエラーが発生しました。');
  }
}

// ================================================================================================
// フィードバック処理
// ================================================================================================
function handleFeedback(event) {
  try {
    if (event.reaction === '+1' || event.reaction === '-1') {
      const feedback = event.reaction === '+1' ? 'positive' : 'negative';
      
      // フィードバックをSheetに記録
      const sheet = SpreadsheetApp.openById(CONFIG.SHEETS_ID).getSheetByName('フィードバック');
      sheet.appendRow([
        new Date(),
        event.user,
        event.item.ts,
        feedback,
        event.item.channel
      ]);
      
      console.log('フィードバック記録:', feedback);
    }
  } catch (error) {
    console.error('handleFeedback Error:', error);
  }
}

// ================================================================================================
// 管理職への通知（緊急案件）
// ================================================================================================
function notifyManagers(channel, message, judgment) {
  const managerChannel = '#management'; // 管理職用チャンネル
  
  const notification = `🚨 **緊急案件の承認判断が完了しました**

**元チャンネル:** <#${channel}>
**内容:** ${message.substring(0, 200)}...
**AI判断:** ${judgment.split('\n')[0]}

詳細は元チャンネルでご確認ください。`;
  
  sendSlackMessage(managerChannel, notification);
}

// ================================================================================================
// ユーティリティ関数
// ================================================================================================
function generateRecordId() {
  const date = new Date();
  const dateStr = date.getFullYear().toString() + 
                  (date.getMonth() + 1).toString().padStart(2, '0') + 
                  date.getDate().toString().padStart(2, '0');
  const timeStr = date.getHours().toString().padStart(2, '0') + 
                  date.getMinutes().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${dateStr}-${timeStr}-${random}`;
}

// 設定値の初期化（初回実行時のみ）
function initializeProperties() {
  const properties = PropertiesService.getScriptProperties();
  
  // 以下の値を実際のキーに置き換えてください
  properties.setProperties({
    'OPENAI_API_KEY': 'your_openai_api_key_here',
    'SLACK_BOT_TOKEN': 'xoxb-your-slack-bot-token-here',
    'SLACK_SIGNING_SECRET': 'your_slack_signing_secret_here',
    'APPROVAL_SHEETS_ID': 'your_google_sheets_id_here'
  });
  
  console.log('設定値を初期化しました');
}