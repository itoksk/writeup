/**
 * 動画1: Google Workspace完結型自動化のメインスクリプト
 * 入社準備の仕組み化デモ用コード
 */

/**
 * フォーム送信時の基本処理（動画1でのデモ用）
 */
function onFormSubmit(e) {
  console.log('===== 動画1: 基本自動化処理開始 =====');
  
  try {
    // 送信データの取得
    const sheet = e.range.getSheet();
    const row = e.range.getRow();
    const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // データ構造化
    const employeeData = {
      timestamp: values[0],
      name: values[1],
      email: values[2],
      startDate: values[3],
      department: values[4],
      position: values[5],
      employmentType: values[6]
    };
    
    console.log('内定者データ:', employeeData);
    
    // Google Workspace内での完全自動化フロー
    if (validateEmployeeData(employeeData)) {
      // ステータス更新
      sheet.getRange(row, sheet.getLastColumn() + 1).setValue('処理完了: ' + new Date());
      
      // 即座に全ての処理を実行（動画1のデモ効果）
      executeAllAutomation(employeeData);
      
      console.log('===== 動画1: 自動化処理完了 =====');
    } else {
      sheet.getRange(row, sheet.getLastColumn() + 1).setValue('エラー: データ検証失敗');
    }
    
  } catch (error) {
    console.error('動画1処理エラー:', error);
  }
}

/**
 * 全自動化プロセス実行（動画1のクライマックス）
 */
function executeAllAutomation(employeeData) {
  // 1. 歓迎メール自動生成・送信
  sendWelcomeEmail(employeeData);
  
  // 2. Google Calendar に面談予定自動登録
  scheduleWelcomeMeeting(employeeData);
  
  // 3. 部署別Google Chat通知
  notifyDepartments(employeeData);
  
  // 4. タスク管理シートへ自動追加
  createTasks(employeeData);
  
  console.log(`${employeeData.name}さんの入社準備自動化が完了しました！`);
}

/**
 * データバリデーション
 */
function validateEmployeeData(data) {
  // 必須項目チェック
  if (!data.name || !data.email || !data.startDate) {
    console.log('必須項目不足');
    return false;
  }
  
  // メール形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.log('メール形式エラー');
    return false;
  }
  
  // 入社日チェック
  const startDate = new Date(data.startDate);
  const today = new Date();
  if (startDate <= today) {
    console.log('入社日は未来である必要があります');
    return false;
  }
  
  return true;
}

/**
 * AI生成歓迎メール送信
 */
function sendWelcomeEmail(employeeData) {
  try {
    // ChatGPT API での個別メール生成
    const emailContent = generatePersonalizedEmail(employeeData);
    
    // Gmail API でメール送信
    Gmail.Users.Messages.send({
      userId: 'me',
      resource: {
        raw: Utilities.base64Encode([
          `To: ${employeeData.email}`,
          `Subject: 【${employeeData.name}様】心からお待ちしております！入社準備のご案内`,
          'Content-Type: text/html; charset=utf-8',
          '',
          emailContent
        ].join('\n'))
      }
    });
    
    console.log(`歓迎メール送信完了: ${employeeData.email}`);
  } catch (error) {
    console.error('メール送信エラー:', error);
  }
}

/**
 * AI個別メール生成
 */
function generatePersonalizedEmail(employeeData) {
  const prompt = `
内定者情報:
- 氏名: ${employeeData.name}
- 職種: ${employeeData.position}
- 部署: ${employeeData.department}
- 入社日: ${employeeData.startDate}

この情報を基に、心温まる歓迎メールを生成してください。
職種に応じた期待や、入社準備の具体的な案内を含めてください。
`;

  try {
    const response = callChatGPTAPI(prompt);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  } catch (error) {
    console.error('AI生成エラー:', error);
    return generateFallbackEmail(employeeData);
  }
}

/**
 * ChatGPT API呼び出し
 */
function callChatGPTAPI(prompt) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-4',
    messages: [{role: 'user', content: prompt}],
    max_tokens: 500
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  return UrlFetchApp.fetch(url, options);
}

/**
 * ウェルカム面談スケジュール自動登録
 */
function scheduleWelcomeMeeting(employeeData) {
  try {
    const meetingDate = new Date(employeeData.startDate);
    meetingDate.setHours(10, 0, 0, 0); // 入社日の10:00AM
    
    const endTime = new Date(meetingDate);
    endTime.setHours(11, 0, 0, 0); // 11:00AMまで
    
    const event = {
      summary: `【ウェルカム面談】${employeeData.name}さん`,
      start: { dateTime: meetingDate.toISOString() },
      end: { dateTime: endTime.toISOString() },
      attendees: [
        {email: employeeData.email},
        {email: 'hr@company.com'},
        {email: getManagerEmail(employeeData.department)}
      ],
      description: `新入社員ウェルカム面談\n\n参加者: ${employeeData.name}さん\n職種: ${employeeData.position}\n部署: ${employeeData.department}`
    };
    
    Calendar.Events.insert(event, 'primary');
    console.log(`ウェルカム面談スケジュール登録完了: ${employeeData.name}さん`);
  } catch (error) {
    console.error('カレンダー登録エラー:', error);
  }
}

/**
 * 部署別Google Chat通知
 */
function notifyDepartments(employeeData) {
  const notifications = [
    {
      department: 'IT部門',
      message: `🆕 新入社員のPC準備をお願いします\n\n👤 ${employeeData.name}さん\n📅 入社日: ${employeeData.startDate}\n💼 職種: ${employeeData.position}\n\n必要な準備:\n• PC・周辺機器の準備\n• アカウント発行\n• セキュリティ設定`,
      webhook: PropertiesService.getScriptProperties().getProperty('IT_CHAT_WEBHOOK')
    },
    {
      department: '総務部',
      message: `🆕 新入社員の入社準備をお願いします\n\n👤 ${employeeData.name}さん\n📅 入社日: ${employeeData.startDate}\n\n必要な準備:\n• 座席の確保\n• 名刺の準備\n• 入社書類の確認`,
      webhook: PropertiesService.getScriptProperties().getProperty('GENERAL_AFFAIRS_CHAT_WEBHOOK')
    }
  ];
  
  notifications.forEach(notification => {
    if (notification.webhook) {
      sendChatNotification(notification.webhook, notification.message);
    }
  });
}

/**
 * Google Chat通知送信
 */
function sendChatNotification(webhook, message) {
  try {
    const payload = { text: message };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(webhook, options);
    console.log('Chat通知送信完了');
  } catch (error) {
    console.error('Chat通知エラー:', error);
  }
}

/**
 * タスク管理シートへの自動追加
 */
function createTasks(employeeData) {
  try {
    const taskSheet = SpreadsheetApp.openById(
      PropertiesService.getScriptProperties().getProperty('TASK_SHEET_ID')
    ).getActiveSheet();
    
    const tasks = [
      ['PC準備', 'IT部門', employeeData.startDate, '未着手'],
      ['座席準備', '総務部', employeeData.startDate, '未着手'],
      ['名刺作成', '総務部', employeeData.startDate, '未着手'],
      ['ウェルカム面談', '人事部', employeeData.startDate, '予定済み']
    ];
    
    tasks.forEach(task => {
      taskSheet.appendRow([
        new Date(),
        employeeData.name,
        employeeData.department,
        task[0], // タスク名
        task[1], // 担当部署
        task[2], // 期限
        task[3]  // ステータス
      ]);
    });
    
    console.log(`タスク管理シート更新完了: ${employeeData.name}さん`);
  } catch (error) {
    console.error('タスク管理エラー:', error);
  }
}

/**
 * 部署管理者メール取得
 */
function getManagerEmail(department) {
  const managers = {
    '営業部': 'sales-manager@company.com',
    '開発部': 'dev-manager@company.com',
    'マーケティング部': 'marketing-manager@company.com',
    '人事部': 'hr-manager@company.com'
  };
  
  return managers[department] || 'hr-manager@company.com';
}

/**
 * フォールバック用メール生成
 */
function generateFallbackEmail(employeeData) {
  return `
<html>
<body>
<h2>${employeeData.name}様、入社を心よりお待ちしております！</h2>

<p>この度は、弊社にご入社いただき、誠にありがとうございます。</p>

<p><strong>入社詳細:</strong></p>
<ul>
<li>入社日: ${employeeData.startDate}</li>
<li>配属部署: ${employeeData.department}</li>
<li>職種: ${employeeData.position}</li>
</ul>

<p>入社に向けた準備は、私どもで自動的に進めさせていただきます。<br>
ご不明な点がございましたら、お気軽にお声かけください。</p>

<p>それでは、${employeeData.name}様にお会いできる日を楽しみにしております！</p>

<br>
<p>人事部</p>
</body>
</html>
`;
}

/**
 * 初回セットアップ用関数
 */
function setupInitialConfiguration() {
  // 必要なAPIキーとWebhook URLの設定
  const properties = PropertiesService.getScriptProperties();
  
  // 以下の値は実際の環境に合わせて設定
  properties.setProperties({
    'OPENAI_API_KEY': 'your-openai-api-key-here',
    'IT_CHAT_WEBHOOK': 'your-it-chat-webhook-url',
    'GENERAL_AFFAIRS_CHAT_WEBHOOK': 'your-general-affairs-webhook-url',
    'TASK_SHEET_ID': 'your-task-management-sheet-id'
  });
  
  console.log('初期設定完了');
}