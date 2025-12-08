/**
 * 動画5: Google Apps Script WebApp開発
 * 人事専用AIアシスタント構築
 */

/**
 * WebApp メインエントリーポイント
 */
function doGet(e) {
  console.log('=== 動画5: WebApp アクセス ===');
  
  try {
    // HTMLテンプレートを読み込み
    const template = HtmlService.createTemplateFromFile('index');
    
    // 初期データの設定
    template.userEmail = Session.getActiveUser().getEmail();
    template.timestamp = new Date().toISOString();
    
    return template.evaluate()
      .setTitle('人事専用AIアシスタント')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
      
  } catch (error) {
    console.error('WebApp初期化エラー:', error);
    return HtmlService.createHtmlOutput('<h1>エラーが発生しました</h1><p>' + error.message + '</p>');
  }
}

/**
 * AI歓迎メッセージ生成（WebApp用）
 */
function generateWelcomeMessage(name, position, startDate, department) {
  console.log('AI歓迎メッセージ生成:', name);
  
  try {
    const prompt = `
あなたは経験豊富で温かい人事担当者です。
新入社員への歓迎メッセージを生成してください。

【情報】
氏名: ${name}
職種: ${position}
入社日: ${startDate}
部署: ${department}

【要件】
1. 温かく歓迎する口調
2. 職種・部署に特化した内容
3. 300-400文字程度
4. HTMLメール形式
5. 会社への期待感を高める内容

HTML形式で返してください。
`;

    const response = callChatGPTAPI(prompt);
    const result = JSON.parse(response.getContentText());
    
    return {
      success: true,
      content: result.choices[0].message.content,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('AI歓迎メッセージ生成エラー:', error);
    return {
      success: false,
      content: generateFallbackWelcomeMessage(name, position, startDate, department),
      error: error.message
    };
  }
}

/**
 * AI入社案内文書生成
 */
function generateOnboardingDocument(name, position, startDate, department) {
  console.log('AI入社案内文書生成:', name);
  
  const prompt = `
${name}さん（${position}、${department}）の入社案内文書を作成してください。

入社日: ${startDate}

以下の項目を含めた包括的な案内文書を作成：

1. 歓迎の挨拶
2. 入社初日のスケジュール
3. 必要な準備物
4. 会社の基本情報
5. 部署の紹介
6. 緊急連絡先
7. よくある質問と回答

プロフェッショナルで親しみやすい文書にしてください。
HTML形式で構造化して返してください。
`;

  try {
    const response = callChatGPTAPI(prompt);
    const result = JSON.parse(response.getContentText());
    
    return {
      success: true,
      content: result.choices[0].message.content,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('入社案内文書生成エラー:', error);
    return {
      success: false,
      content: generateFallbackOnboardingDoc(name, position, startDate, department),
      error: error.message
    };
  }
}

/**
 * AI業務質問回答
 */
function answerHRQuestion(question, context = '') {
  console.log('AI業務質問回答:', question);
  
  const prompt = `
あなたは経験豊富な人事担当者です。
以下の質問に対して、正確で役立つ回答を提供してください。

質問: ${question}
コンテキスト: ${context}

【回答要件】
1. 具体的で実用的な情報
2. 社内規定に基づく正確な内容
3. 必要に応じて関連部署への案内
4. 親切で分かりやすい説明
5. 200-300文字程度

人事業務の専門知識を活かした回答をお願いします。
`;

  try {
    const response = callChatGPTAPI(prompt);
    const result = JSON.parse(response.getContentText());
    
    return {
      success: true,
      answer: result.choices[0].message.content,
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('AI質問回答エラー:', error);
    return {
      success: false,
      answer: 'AIサービスが一時的に利用できません。人事部（hr@company.com）まで直接お問い合わせください。',
      error: error.message
    };
  }
}

/**
 * 生成結果をスプレッドシートに保存
 */
function saveGeneratedContent(type, inputData, outputData) {
  try {
    const logSheet = getOrCreateAILogSheet();
    
    logSheet.appendRow([
      new Date(),
      Session.getActiveUser().getEmail(),
      type,
      JSON.stringify(inputData),
      outputData.success ? 'Success' : 'Error',
      outputData.content || outputData.answer || '',
      outputData.error || ''
    ]);
    
    console.log('AI生成ログ保存完了');
    
  } catch (error) {
    console.error('ログ保存エラー:', error);
  }
}

/**
 * AIログシート取得/作成
 */
function getOrCreateAILogSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = spreadsheet.getSheetByName('AI生成ログ');
  
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet('AI生成ログ');
    logSheet.getRange(1, 1, 1, 7).setValues([
      ['生成日時', 'ユーザー', '生成タイプ', '入力データ', 'ステータス', '生成内容', 'エラー']
    ]);
    
    // ヘッダー行のスタイル設定
    const headerRange = logSheet.getRange(1, 1, 1, 7);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return logSheet;
}

/**
 * フォールバック歓迎メッセージ
 */
function generateFallbackWelcomeMessage(name, position, startDate, department) {
  return `
<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
  <h2 style="color: #4285f4;">🎉 ${name}様、ご入社おめでとうございます！</h2>
  
  <p>この度は、弊社${department}に${position}としてご入社いただき、誠にありがとうございます。</p>
  
  <div style="background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
    <h3 style="margin-top: 0;">📅 入社詳細</h3>
    <ul>
      <li><strong>入社日:</strong> ${startDate}</li>
      <li><strong>配属部署:</strong> ${department}</li>
      <li><strong>職種:</strong> ${position}</li>
    </ul>
  </div>
  
  <p>チーム一同、${name}様の豊富な経験と新鮮な視点を心待ちにしております。</p>
  <p>ご不明な点がございましたら、遠慮なく人事部までお声かけください。</p>
  
  <p style="color: #666; font-style: italic;">※ このメッセージはシステムで自動生成されています</p>
</div>
`;
}

/**
 * フォールバック入社案内文書
 */
function generateFallbackOnboardingDoc(name, position, startDate, department) {
  return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
  <header style="background: #4285f4; color: white; padding: 20px; text-align: center;">
    <h1>📋 入社案内文書</h1>
    <p>${name}様（${position}）</p>
  </header>
  
  <div style="padding: 20px;">
    <section style="margin-bottom: 30px;">
      <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 5px;">🎯 入社初日のスケジュール</h2>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
        <ul>
          <li><strong>9:00 AM</strong> - 受付にて入社手続き（1F受付）</li>
          <li><strong>9:30 AM</strong> - 人事部面談・オリエンテーション</li>
          <li><strong>10:30 AM</strong> - PC・備品の受け取り（IT部門）</li>
          <li><strong>11:30 AM</strong> - 部署紹介・席案内</li>
          <li><strong>14:00 PM</strong> - ${department}チームミーティング</li>
        </ul>
      </div>
    </section>
    
    <section style="margin-bottom: 30px;">
      <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 5px;">📦 必要な準備物</h2>
      <ul>
        <li>身分証明書（運転免許証など）</li>
        <li>印鑑（認印可）</li>
        <li>雇用契約書（署名済み）</li>
        <li>健康診断書</li>
        <li>緊急連絡先情報</li>
      </ul>
    </section>
    
    <section style="margin-bottom: 30px;">
      <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 5px;">🏢 ${department}について</h2>
      <p>当部署では、チームワークを重視し、一人ひとりの成長を支援する環境を整えています。</p>
      <p>経験豊富なメンバーがサポートしますので、安心してご入社ください。</p>
    </section>
    
    <section style="margin-bottom: 30px;">
      <h2 style="color: #333; border-bottom: 2px solid #4285f4; padding-bottom: 5px;">📞 緊急連絡先</h2>
      <div style="background: #fff3cd; padding: 15px; border-radius: 8px;">
        <ul>
          <li><strong>人事部:</strong> hr@company.com / 03-1234-5678</li>
          <li><strong>総務部:</strong> general@company.com / 03-1234-5679</li>
          <li><strong>IT部門:</strong> it-support@company.com / 03-1234-5680</li>
        </ul>
      </div>
    </section>
  </div>
  
  <footer style="background: #f5f5f5; padding: 20px; text-align: center; color: #666;">
    <p>入社日: ${startDate} | 人事部作成</p>
  </footer>
</div>
`;
}

/**
 * 部署別テンプレート取得
 */
function getDepartmentTemplates(department) {
  const templates = {
    '営業部': {
      welcome: '営業部チーム一同、お客様との架け橋となる新しい仲間をお迎えできることを心より楽しみにしています。',
      firstWeekGoals: ['顧客管理システム習得', 'ロールプレイング研修', '先輩営業同行'],
      tools: ['CRM', 'SalesForce', '提案資料テンプレート', 'Teams']
    },
    '開発部': {
      welcome: '開発部では、最新技術を駆使した革新的なソリューション開発に取り組んでいます。技術的な挑戦を共に楽しみましょう。',
      firstWeekGoals: ['開発環境セットアップ', 'コーディング規約習得', 'チーム開発フロー理解'],
      tools: ['GitHub', 'AWS', 'Docker', 'Slack', 'Jira']
    },
    'マーケティング部': {
      welcome: 'マーケティング部では、データ分析とクリエイティブな発想で市場を切り開いています。新しい視点を期待しています。',
      firstWeekGoals: ['市場分析ツール習得', 'ブランドガイドライン理解', 'キャンペーン企画参加'],
      tools: ['Google Analytics', 'HubSpot', 'Adobe Creative Suite', 'Tableau']
    }
  };
  
  return templates[department] || {
    welcome: 'チーム一同、新しい仲間をお迎えできることを楽しみにしています。',
    firstWeekGoals: ['業務システム習得', 'チームミーティング参加', '業務フロー理解'],
    tools: ['メール', 'カレンダー', '社内システム', 'Teams']
  };
}

/**
 * CSVエクスポート機能
 */
function exportAILogToCsv() {
  try {
    const logSheet = getOrCreateAILogSheet();
    const data = logSheet.getDataRange().getValues();
    
    let csvContent = '';
    data.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = Utilities.newBlob(csvContent, 'text/csv', 'AI生成ログ.csv');
    
    return {
      success: true,
      downloadUrl: blob.getDownloadUrl(),
      timestamp: new Date()
    };
    
  } catch (error) {
    console.error('CSVエクスポートエラー:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 統計情報取得
 */
function getAIUsageStats() {
  try {
    const logSheet = getOrCreateAILogSheet();
    const data = logSheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return { totalGenerations: 0, successRate: 0, topUsers: [] };
    }
    
    const logs = data.slice(1); // ヘッダー除外
    
    const stats = {
      totalGenerations: logs.length,
      successCount: logs.filter(row => row[4] === 'Success').length,
      successRate: Math.round((logs.filter(row => row[4] === 'Success').length / logs.length) * 100),
      typeBreakdown: {},
      userBreakdown: {},
      recentActivity: logs.slice(-10).reverse()
    };
    
    // タイプ別集計
    logs.forEach(row => {
      const type = row[2];
      stats.typeBreakdown[type] = (stats.typeBreakdown[type] || 0) + 1;
    });
    
    // ユーザー別集計
    logs.forEach(row => {
      const user = row[1];
      stats.userBreakdown[user] = (stats.userBreakdown[user] || 0) + 1;
    });
    
    return stats;
    
  } catch (error) {
    console.error('統計取得エラー:', error);
    return { error: error.message };
  }
}

/**
 * HTMLファイルインクルード
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}