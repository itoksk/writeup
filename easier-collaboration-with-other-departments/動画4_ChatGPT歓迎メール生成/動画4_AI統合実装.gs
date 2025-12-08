/**
 * 動画4: ChatGPT API + Google Apps Script 統合実装
 * AI生成による個別歓迎メール・タスクリスト自動生成
 */

/**
 * メイン処理：AI生成歓迎メール送信
 * 動画4の核心機能
 */
function generateAndSendWelcomeEmail(employeeData) {
  console.log('=== 動画4: AI歓迎メール生成開始 ===');
  
  try {
    // 1. AI歓迎メール生成
    const welcomeEmail = generatePersonalizedWelcomeEmail(employeeData);
    
    // 2. AIタスクリスト生成  
    const taskList = generatePersonalizedTaskList(employeeData);
    
    // 3. 最終メール組み立て
    const finalEmail = assembleCompleteEmail(welcomeEmail, taskList, employeeData);
    
    // 4. Gmail経由で送信
    const success = sendEmailViaGmail(employeeData.email, finalEmail, employeeData);
    
    if (success) {
      logEmailSuccess(employeeData);
      return { success: true, message: 'AI歓迎メール送信完了' };
    } else {
      throw new Error('メール送信に失敗しました');
    }
    
  } catch (error) {
    console.error('動画4エラー:', error);
    // フォールバック：テンプレートメール送信
    return sendFallbackEmail(employeeData);
  }
}

/**
 * ChatGPT API による個別歓迎メール生成
 * 動画4のハイライト機能
 */
function generatePersonalizedWelcomeEmail(employeeData) {
  console.log('AI歓迎メール生成中:', employeeData.name);
  
  // 部署別カスタマイズ情報
  const departmentContext = getDepartmentContext(employeeData.department);
  
  // ChatGPT用プロンプト構築
  const prompt = `
あなたは経験豊富で心温かい人事担当者です。
新入社員に感動的な歓迎メールを作成してください。

【内定者情報】
氏名: ${employeeData.name}
入社日: ${employeeData.startDateFormatted || employeeData.startDate}
配属部署: ${employeeData.department} 
職種: ${employeeData.position}
雇用形態: ${employeeData.employmentType}

【部署の特色】
${departmentContext.description}

【期待する成果】
${departmentContext.expectations}

【要求事項】
1. 温かみのある、しかしプロフェッショナルな口調
2. 職種・部署に特化した具体的な期待内容を含める
3. 会社への帰属意識を高める内容
4. 不安を和らげ、やる気を引き出す内容
5. 400-600文字程度
6. HTMLメール形式（簡潔なHTML構文）

メール件名も含めて生成してください。
`;

  try {
    const response = callChatGPTAPI(prompt);
    const generatedContent = JSON.parse(response.getContentText());
    
    console.log('AI歓迎メール生成完了');
    return parseEmailResponse(generatedContent.choices[0].message.content);
    
  } catch (error) {
    console.error('ChatGPT API エラー:', error);
    throw new Error('AI歓迎メール生成に失敗: ' + error.message);
  }
}

/**
 * ChatGPT API による個別タスクリスト生成
 */
function generatePersonalizedTaskList(employeeData) {
  console.log('AIタスクリスト生成中:', employeeData.position);
  
  const prompt = `
${employeeData.position}として${employeeData.department}に配属される新入社員のための、
入社前・入社後のタスクリストを生成してください。

【内定者情報】
職種: ${employeeData.position}
部署: ${employeeData.department}
入社日: ${employeeData.startDateFormatted || employeeData.startDate}

【要求事項】
1. 入社前タスク（3-5項目）
2. 入社初日タスク（3-4項目）  
3. 入社第1週タスク（4-6項目）
4. 各タスクに期限と重要度を設定
5. 実行可能で具体的な内容
6. JSON形式で構造化

出力形式：
{
  "beforeJoining": [
    {"task": "タスク名", "deadline": "期限", "priority": "高/中/低", "description": "詳細"}
  ],
  "firstDay": [...],
  "firstWeek": [...]
}
`;

  try {
    const response = callChatGPTAPI(prompt);
    const generatedContent = JSON.parse(response.getContentText());
    const taskListJson = generatedContent.choices[0].message.content;
    
    console.log('AIタスクリスト生成完了');
    return JSON.parse(taskListJson);
    
  } catch (error) {
    console.error('タスクリスト生成エラー:', error);
    return generateFallbackTaskList(employeeData);
  }
}

/**
 * ChatGPT API 呼び出し共通関数
 */
function callChatGPTAPI(prompt, model = 'gpt-4') {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません');
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: model,
    messages: [
      {
        role: 'system',
        content: 'あなたは経験豊富で心温かい人事担当者です。新入社員へのサポートと成長を最優先に考えています。'
      },
      {
        role: 'user', 
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`API Error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    return response;
    
  } catch (error) {
    console.error('ChatGPT API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * 部署別コンテキスト情報取得
 */
function getDepartmentContext(department) {
  const contexts = {
    '営業部': {
      description: '営業部では、お客様との関係構築と売上拡大が主要な使命です。チームワークを重視し、個人の成長と会社の発展を両立させる文化があります。',
      expectations: '顧客理解力、提案力、コミュニケーション能力の向上を期待しています。将来的には新規開拓や大型案件のクロージングで活躍していただきたいです。',
      tools: ['CRM', 'SalesForce', '提案資料テンプレート']
    },
    '開発部': {
      description: '開発部では、最新技術を活用した高品質なシステム開発に取り組んでいます。技術的な挑戦を歓迎し、継続的な学習と改善を重視する環境です。',
      expectations: 'プログラミングスキル、システム設計能力、チーム開発スキルの向上を期待しています。革新的なソリューションの創造で会社の技術力向上に貢献してください。',
      tools: ['GitHub', 'AWS', 'Docker', 'Slack']
    },
    'マーケティング部': {
      description: 'マーケティング部では、データ分析に基づく戦略的な市場開拓を推進しています。クリエイティブな発想と論理的な思考の両方を活かせる環境です。',
      expectations: 'マーケット分析力、企画立案能力、デジタルマーケティングスキルの習得を期待しています。ブランド価値向上と売上貢献を目指してください。',
      tools: ['Google Analytics', 'HubSpot', 'Adobe Creative Suite']
    },
    '人事部': {
      description: '人事部では、社員一人ひとりの成長と会社の発展を支える重要な役割を担っています。人を大切にする企業文化の推進者として活躍できます。',
      expectations: '人材マネジメント、組織開発、労務管理スキルの向上を期待しています。働きがいのある職場づくりに貢献してください。',
      tools: ['人事管理システム', 'Workday', '評価システム']
    },
    '総務部': {
      description: '総務部では、会社の基盤運営を支える多岐にわたる業務を担当します。効率化と品質向上を常に追求し、全部署をサポートする重要なポジションです。',
      expectations: '業務効率化、リスク管理、コンプライアンス対応能力の向上を期待しています。組織全体の生産性向上に貢献してください。',
      tools: ['総務管理システム', 'Microsoft Office', '契約管理システム']
    }
  };
  
  return contexts[department] || {
    description: '当社では、チームワークと個人の成長を重視し、やりがいのある仕事環境を提供しています。',
    expectations: '専門スキルの向上と会社への貢献を期待しています。',
    tools: ['基本業務ツール']
  };
}

/**
 * AIレスポンスからメール内容を解析
 */
function parseEmailResponse(aiResponse) {
  try {
    // 件名と本文を分離
    const lines = aiResponse.split('\n');
    let subject = '';
    let body = '';
    let inBody = false;
    
    for (const line of lines) {
      if (line.includes('件名:') || line.includes('Subject:')) {
        subject = line.replace(/件名:|Subject:/g, '').trim();
      } else if (line.includes('本文:') || line.includes('Body:')) {
        inBody = true;
      } else if (inBody && line.trim()) {
        body += line + '\n';
      }
    }
    
    // 件名が取得できない場合のフォールバック
    if (!subject) {
      subject = '心からお待ちしております！入社準備のご案内';
      body = aiResponse; // 全体を本文として使用
    }
    
    return {
      subject: subject,
      body: body.trim()
    };
    
  } catch (error) {
    console.error('メール解析エラー:', error);
    return {
      subject: '入社準備のご案内',
      body: aiResponse
    };
  }
}

/**
 * 完全なメール組み立て
 */
function assembleCompleteEmail(welcomeEmail, taskList, employeeData) {
  const taskListHtml = formatTaskListAsHtml(taskList);
  
  const completeEmail = {
    subject: `【${employeeData.name}様】${welcomeEmail.subject}`,
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #4285f4; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .task-section { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .task-item { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
        .priority-high { border-left: 4px solid #f44336; }
        .priority-medium { border-left: 4px solid #ff9800; }
        .priority-low { border-left: 4px solid #4caf50; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>✨ ご入社を心よりお待ちしております ✨</h1>
    </div>
    
    <div class="content">
        <div style="margin-bottom: 30px;">
            ${welcomeEmail.body}
        </div>
        
        <div class="task-section">
            <h2>📋 入社準備タスクリスト</h2>
            <p>スムーズな入社のため、以下のタスクをご確認ください：</p>
            ${taskListHtml}
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <h3>🤝 困った時は遠慮なくご連絡ください</h3>
            <p>ご不明な点やご質問がございましたら、いつでもお気軽にご連絡ください。</p>
            <p><strong>人事部:</strong> hr@company.com | 📞 03-1234-5678</p>
        </div>
    </div>
    
    <div class="footer">
        <p>このメールは自動生成されています。返信は人事部が確認いたします。</p>
        <p>© 2024 Company Name. All rights reserved.</p>
    </div>
</body>
</html>
    `
  };
  
  return completeEmail;
}

/**
 * タスクリストのHTML形式変換
 */
function formatTaskListAsHtml(taskList) {
  let html = '';
  
  const sections = [
    { key: 'beforeJoining', title: '🎯 入社前のお願い事項', icon: '📅' },
    { key: 'firstDay', title: '🌟 入社初日のスケジュール', icon: '⭐' },
    { key: 'firstWeek', title: '🚀 入社第1週の取り組み', icon: '📈' }
  ];
  
  sections.forEach(section => {
    if (taskList[section.key] && taskList[section.key].length > 0) {
      html += `<h3>${section.title}</h3>`;
      
      taskList[section.key].forEach(task => {
        const priorityClass = `priority-${task.priority === '高' ? 'high' : task.priority === '中' ? 'medium' : 'low'}`;
        html += `
        <div class="task-item ${priorityClass}">
            <strong>${section.icon} ${task.task}</strong>
            <br><small>期限: ${task.deadline} | 重要度: ${task.priority}</small>
            <br><span style="color: #666;">${task.description}</span>
        </div>
        `;
      });
    }
  });
  
  return html;
}

/**
 * Gmail経由でのメール送信
 */
function sendEmailViaGmail(recipient, emailContent, employeeData) {
  try {
    Gmail.Users.Messages.send({
      userId: 'me',
      resource: {
        raw: Utilities.base64Encode([
          `To: ${recipient}`,
          `Subject: ${emailContent.subject}`,
          'Content-Type: text/html; charset=utf-8',
          '',
          emailContent.html
        ].join('\n'))
      }
    });
    
    console.log(`✅ AI歓迎メール送信完了: ${recipient}`);
    return true;
    
  } catch (error) {
    console.error('Gmail送信エラー:', error);
    return false;
  }
}

/**
 * フォールバックタスクリスト生成
 */
function generateFallbackTaskList(employeeData) {
  return {
    beforeJoining: [
      {
        task: '入社書類の準備・提出',
        deadline: '入社日の1週間前',
        priority: '高',
        description: '雇用契約書、身元保証書等の必要書類をご準備ください'
      },
      {
        task: '健康診断の受診',
        deadline: '入社日の3日前',
        priority: '高', 
        description: '指定医療機関での健康診断を受診し、結果をご提出ください'
      }
    ],
    firstDay: [
      {
        task: '受付での入社手続き',
        deadline: '9:00AM',
        priority: '高',
        description: '1Fの受付にて入社手続きを行います'
      },
      {
        task: 'PC・設備の受け取り',
        deadline: '10:00AM',
        priority: '中',
        description: 'IT部門より業務用PCと必要な設備をお受け取りください'
      }
    ],
    firstWeek: [
      {
        task: '部署メンバーとの面談',
        deadline: '第3営業日',
        priority: '中',
        description: '配属部署のメンバーとの個別面談を実施します'
      },
      {
        task: '業務システムの基本操作研修',
        deadline: '第5営業日',
        priority: '中',
        description: '社内システムの基本的な使用方法を学習します'
      }
    ]
  };
}

/**
 * フォールバックメール送信
 */
function sendFallbackEmail(employeeData) {
  console.log('フォールバックメール送信:', employeeData.name);
  
  const fallbackEmail = {
    subject: `【${employeeData.name}様】ご入社を心よりお待ちしております`,
    html: `
    <h2>ご入社を心よりお待ちしております</h2>
    <p>この度は、弊社にご入社いただき、誠にありがとうございます。</p>
    <p><strong>入社詳細:</strong></p>
    <ul>
      <li>お名前: ${employeeData.name}</li>
      <li>入社日: ${employeeData.startDateFormatted || employeeData.startDate}</li>
      <li>配属部署: ${employeeData.department}</li>
      <li>職種: ${employeeData.position}</li>
    </ul>
    <p>入社に関するご質問がございましたら、お気軽にお声かけください。</p>
    `
  };
  
  try {
    const success = sendEmailViaGmail(employeeData.email, fallbackEmail, employeeData);
    return { success, message: 'フォールバックメール送信完了' };
  } catch (error) {
    return { success: false, message: 'メール送信失敗: ' + error.message };
  }
}

/**
 * メール送信成功ログ
 */
function logEmailSuccess(employeeData) {
  console.log(`📧 AI歓迎メール送信成功: ${employeeData.name} (${employeeData.email})`);
  
  // スプレッドシートにログ記録
  try {
    const logSheet = getOrCreateEmailLogSheet();
    logSheet.appendRow([
      new Date(),
      employeeData.name,
      employeeData.email,
      employeeData.department,
      'AI生成メール送信完了',
      'Success'
    ]);
  } catch (error) {
    console.error('ログ記録エラー:', error);
  }
}

/**
 * メールログシート取得/作成
 */
function getOrCreateEmailLogSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = spreadsheet.getSheetByName('メール送信ログ');
  
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet('メール送信ログ');
    logSheet.getRange(1, 1, 1, 6).setValues([
      ['送信日時', '氏名', 'メールアドレス', '部署', '内容', 'ステータス']
    ]);
  }
  
  return logSheet;
}