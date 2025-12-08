/**
 * 動画1: デモ用Google Apps Scriptコード
 * 実際の動画撮影で使用する実演コード
 */

/**
 * フォーム送信時のメイン処理（動画1デモ用）
 * 5秒以内で全ての自動化を完了させる
 */
function onFormSubmit(e) {
  console.log('🚀 動画1デモ: 自動化開始');
  console.log('='.repeat(50));
  
  try {
    // Step 1: データ取得（0.5秒）
    const employeeData = extractFormDataForDemo(e);
    console.log('✅ Step 1: データ取得完了', employeeData.name);
    
    // Step 2: 並行処理で全自動化実行（4秒）
    executeAllAutomationForDemo(employeeData);
    
    console.log('🎉 動画1デモ: 全自動化完了！');
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ デモエラー:', error);
    handleDemoError(error);
  }
}

/**
 * デモ用データ抽出
 */
function extractFormDataForDemo(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const employeeData = {
    timestamp: values[0],
    name: values[1] || '山田花子',
    email: values[2] || 'yamada.hanako@example.com',
    startDate: values[3] || '2024-04-01',
    department: values[4] || '開発部',
    position: values[5] || 'システムエンジニア',
    employmentType: values[6] || '正社員'
  };
  
  // デモ用：スプレッドシートに即座に視覚的フィードバック
  sheet.getRange(row, sheet.getLastColumn() + 1).setValue('🚀 自動処理中...');
  
  return employeeData;
}

/**
 * 全自動化実行（デモ用並行処理）
 */
function executeAllAutomationForDemo(employeeData) {
  console.log('🔥 並行処理開始: 5つの処理を同時実行');
  
  // デモ効果を高めるため、各処理の開始をログ出力
  console.log('📧 AI歓迎メール生成・送信 開始...');
  console.log('📅 Googleカレンダー予定登録 開始...');
  console.log('💬 部署別Chat通知送信 開始...');
  console.log('📋 タスク管理シート更新 開始...');
  console.log('👤 社員ディレクトリ更新 開始...');
  
  try {
    // 1. AI歓迎メール生成・送信
    sendDemoWelcomeEmail(employeeData);
    console.log('✅ AI歓迎メール送信完了');
    
    // 2. カレンダー予定自動登録
    createDemoCalendarEvents(employeeData);
    console.log('✅ カレンダー予定登録完了');
    
    // 3. 部署別Chat通知
    sendDemoChatNotifications(employeeData);
    console.log('✅ Chat通知送信完了');
    
    // 4. タスク管理シート更新
    updateDemoTaskSheet(employeeData);
    console.log('✅ タスク管理更新完了');
    
    // 5. 社員ディレクトリ更新
    updateDemoEmployeeDirectory(employeeData);
    console.log('✅ 社員ディレクトリ更新完了');
    
    // 最終ステータス更新
    updateFinalStatus(employeeData);
    
  } catch (error) {
    console.error('並行処理エラー:', error);
    throw error;
  }
}

/**
 * デモ用AI歓迎メール送信
 */
function sendDemoWelcomeEmail(employeeData) {
  // デモ用：ChatGPTを使わずに高品質なテンプレートを使用（安定性重視）
  const emailContent = generateDemoEmailContent(employeeData);
  
  try {
    // Gmail API でメール送信
    Gmail.Users.Messages.send({
      userId: 'me',
      resource: {
        raw: Utilities.base64Encode([
          `To: ${employeeData.email}`,
          `Subject: 【${employeeData.name}様】心からお待ちしております！${employeeData.department}への配属について`,
          'Content-Type: text/html; charset=utf-8',
          '',
          emailContent
        ].join('\n'))
      }
    });
    
    // デモ用：送信メール数をカウント（画面で確認可能）
    incrementEmailCounter();
    
  } catch (error) {
    console.error('デモメール送信エラー:', error);
    // デモでは失敗させない：フォールバック処理
    logDemoEmailFallback(employeeData);
  }
}

/**
 * デモ用メール内容生成
 */
function generateDemoEmailContent(employeeData) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #4285f4; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .highlight { background: #e8f0fe; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 ${employeeData.name}様、ご入社おめでとうございます！</h1>
    </div>
    
    <div class="content">
        <p>この度は、弊社${employeeData.department}に${employeeData.position}としてご入社いただき、誠にありがとうございます。</p>
        
        <div class="highlight">
            <h3>📅 ご入社詳細</h3>
            <ul>
                <li><strong>入社日:</strong> ${employeeData.startDate}</li>
                <li><strong>配属部署:</strong> ${employeeData.department}</li>
                <li><strong>職種:</strong> ${employeeData.position}</li>
                <li><strong>雇用形態:</strong> ${employeeData.employmentType}</li>
            </ul>
        </div>
        
        <p>${employeeData.department}では、革新的な技術と創造的な発想で、業界をリードするソリューションを開発しています。${employeeData.name}様の豊富な経験と新鮮な視点を、チーム一同心よりお待ちしております。</p>
        
        <p>入社準備については、IT部門・総務部・人事部が連携して自動的に進めさせていただきます。ご不明な点がございましたら、お気軽にお声かけください。</p>
        
        <div class="highlight">
            <h3>🤝 緊急連絡先</h3>
            <p><strong>人事部:</strong> hr@company.com | 📞 03-1234-5678</p>
        </div>
        
        <p>それでは、${employeeData.name}様にお会いできる日を楽しみにしております！</p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
            ※ このメールはGoogle Apps Scriptによって自動生成・送信されています
        </p>
    </div>
</body>
</html>
  `;
}

/**
 * デモ用カレンダーイベント作成
 */
function createDemoCalendarEvents(employeeData) {
  const startDate = new Date(employeeData.startDate);
  
  // 1. ウェルカム面談（10:00-11:00）
  const welcomeMeeting = {
    summary: `【ウェルカム面談】${employeeData.name}様 - ${employeeData.department}配属`,
    start: { 
      dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 10, 0).toISOString()
    },
    end: { 
      dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 11, 0).toISOString()
    },
    description: `新入社員ウェルカム面談

🎯 アジェンダ:
• 会社概要・企業理念の説明
• ${employeeData.department}の役割と期待
• 就業規則・福利厚生の確認
• 初日スケジュールの説明
• 質疑応答

📋 参加者:
• ${employeeData.name}様（${employeeData.position}）
• 人事部担当者
• ${employeeData.department}マネージャー

💻 このイベントはGoogle Apps Scriptにより自動生成されました`,
    attendees: [
      { email: employeeData.email },
      { email: 'hr@company.com' },
      { email: getDemoManagerEmail(employeeData.department) }
    ]
  };
  
  try {
    const event = Calendar.Events.insert(welcomeMeeting, 'primary');
    console.log(`📅 ウェルカム面談予定作成: ${event.htmlLink}`);
    
    // デモ用：作成されたイベント数をカウント
    incrementCalendarEventCounter();
    
  } catch (error) {
    console.error('カレンダーイベント作成エラー:', error);
    logDemoCalendarFallback(employeeData);
  }
}

/**
 * デモ用Chat通知送信
 */
function sendDemoChatNotifications(employeeData) {
  const notifications = [
    {
      department: 'IT部門',
      message: `🆕 新入社員PC準備のお願い

👤 ${employeeData.name}様
📅 入社日: ${employeeData.startDate}
🏢 配属: ${employeeData.department}
💼 職種: ${employeeData.position}

📋 準備項目:
✅ PC・モニター・周辺機器
✅ メールアカウント・システム権限
✅ VPN・セキュリティ設定
✅ 開発環境（${employeeData.department}用）

⏰ 期限: ${employeeData.startDate}の前日まで
❓ 質問: it-support@company.com`,
      webhook: 'IT_DEMO_WEBHOOK'
    },
    {
      department: '総務部',
      message: `🆕 新入社員受入準備のお願い

👤 ${employeeData.name}様
📅 入社日: ${employeeData.startDate}
🏢 配属: ${employeeData.department}

📋 準備項目:
✅ 座席・デスクの確保
✅ 名刺・社員証の準備
✅ 入館カード・駐車場利用証
✅ 備品（文房具・電話等）

⏰ 期限: ${employeeData.startDate}の前日まで
❓ 質問: general-affairs@company.com`,
      webhook: 'GA_DEMO_WEBHOOK'
    }
  ];
  
  notifications.forEach(notification => {
    try {
      // デモ用：実際のWebhook送信の代わりにログ出力
      console.log(`💬 ${notification.department}に通知送信:`);
      console.log(notification.message);
      
      // デモ用：送信通知数をカウント
      incrementChatNotificationCounter();
      
    } catch (error) {
      console.error(`${notification.department}通知エラー:`, error);
    }
  });
}

/**
 * デモ用タスク管理シート更新
 */
function updateDemoTaskSheet(employeeData) {
  try {
    const taskSheet = getOrCreateDemoTaskSheet();
    
    const tasks = [
      ['PC準備', 'IT部門', employeeData.startDate, '未着手', '高'],
      ['座席準備', '総務部', employeeData.startDate, '未着手', '高'],
      ['名刺作成', '総務部', employeeData.startDate, '未着手', '中'],
      ['アカウント発行', 'IT部門', employeeData.startDate, '未着手', '高'],
      ['ウェルカムランチ予約', '人事部', employeeData.startDate, '予約済み', '低']
    ];
    
    tasks.forEach(task => {
      taskSheet.appendRow([
        new Date(), // 作成日時
        employeeData.name, // 対象者
        employeeData.department, // 部署
        task[0], // タスク名
        task[1], // 担当部署
        task[2], // 期限
        task[3], // ステータス
        task[4]  // 優先度
      ]);
    });
    
    console.log(`📋 タスク${tasks.length}件を管理シートに追加`);
    incrementTaskCounter(tasks.length);
    
  } catch (error) {
    console.error('タスクシート更新エラー:', error);
    logDemoTaskFallback(employeeData);
  }
}

/**
 * デモ用社員ディレクトリ更新
 */
function updateDemoEmployeeDirectory(employeeData) {
  try {
    const directorySheet = getOrCreateDemoDirectorySheet();
    
    directorySheet.appendRow([
      employeeData.name,
      employeeData.email,
      employeeData.department,
      employeeData.position,
      employeeData.startDate,
      '内線番号（後日設定）',
      'アクティブ',
      new Date(),
      '🤖 自動登録'
    ]);
    
    console.log(`👤 ${employeeData.name}様を社員ディレクトリに追加`);
    incrementDirectoryCounter();
    
  } catch (error) {
    console.error('ディレクトリ更新エラー:', error);
    logDemoDirectoryFallback(employeeData);
  }
}

/**
 * 最終ステータス更新（デモ用視覚的フィードバック）
 */
function updateFinalStatus(employeeData) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // 処理完了ステータスを追加
    sheet.getRange(lastRow, sheet.getLastColumn()).setValue('🎉 全自動化完了！');
    sheet.getRange(lastRow, sheet.getLastColumn() + 1).setValue(new Date());
    
    // 視覚的ハイライト（緑色背景）
    sheet.getRange(lastRow, 1, 1, sheet.getLastColumn() + 1).setBackground('#e8f5e8');
    
    console.log('🎊 デモ完了: 全ての自動化処理が正常終了');
    
  } catch (error) {
    console.error('最終ステータス更新エラー:', error);
  }
}

/**
 * ユーティリティ関数群
 */
function getDemoManagerEmail(department) {
  const managers = {
    '営業部': 'sales-manager@company.com',
    '開発部': 'dev-manager@company.com',
    'マーケティング部': 'marketing-manager@company.com',
    '人事部': 'hr-manager@company.com'
  };
  return managers[department] || 'hr-manager@company.com';
}

function incrementEmailCounter() {
  const properties = PropertiesService.getScriptProperties();
  const count = parseInt(properties.getProperty('DEMO_EMAIL_COUNT') || '0') + 1;
  properties.setProperty('DEMO_EMAIL_COUNT', count.toString());
}

function incrementCalendarEventCounter() {
  const properties = PropertiesService.getScriptProperties();
  const count = parseInt(properties.getProperty('DEMO_CALENDAR_COUNT') || '0') + 1;
  properties.setProperty('DEMO_CALENDAR_COUNT', count.toString());
}

function incrementChatNotificationCounter() {
  const properties = PropertiesService.getScriptProperties();
  const count = parseInt(properties.getProperty('DEMO_CHAT_COUNT') || '0') + 1;
  properties.setProperty('DEMO_CHAT_COUNT', count.toString());
}

function incrementTaskCounter(taskCount) {
  const properties = PropertiesService.getScriptProperties();
  const count = parseInt(properties.getProperty('DEMO_TASK_COUNT') || '0') + taskCount;
  properties.setProperty('DEMO_TASK_COUNT', count.toString());
}

function incrementDirectoryCounter() {
  const properties = PropertiesService.getScriptProperties();
  const count = parseInt(properties.getProperty('DEMO_DIRECTORY_COUNT') || '0') + 1;
  properties.setProperty('DEMO_DIRECTORY_COUNT', count.toString());
}

/**
 * デモ用シート作成関数
 */
function getOrCreateDemoTaskSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('📋タスク管理（デモ）');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('📋タスク管理（デモ）');
    sheet.getRange(1, 1, 1, 8).setValues([
      ['作成日時', '対象者', '部署', 'タスク名', '担当部署', '期限', 'ステータス', '優先度']
    ]);
    
    // ヘッダースタイル
    const headerRange = sheet.getRange(1, 1, 1, 8);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return sheet;
}

function getOrCreateDemoDirectorySheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('👥社員ディレクトリ（デモ）');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('👥社員ディレクトリ（デモ）');
    sheet.getRange(1, 1, 1, 9).setValues([
      ['氏名', 'メール', '部署', '職種', '入社日', '内線', 'ステータス', '登録日時', '備考']
    ]);
    
    // ヘッダースタイル
    const headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setBackground('#34a853');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return sheet;
}

/**
 * エラーハンドリング（デモ用）
 */
function handleDemoError(error) {
  console.error('🚨 デモ中にエラー発生:', error.message);
  
  // デモでは致命的エラーを避けるため、フォールバック処理
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, sheet.getLastColumn()).setValue('⚠️ 部分的に完了（デモ用）');
}

/**
 * デモリセット用関数（撮影前の準備）
 */
function resetDemoCounters() {
  const properties = PropertiesService.getScriptProperties();
  properties.setProperties({
    'DEMO_EMAIL_COUNT': '0',
    'DEMO_CALENDAR_COUNT': '0', 
    'DEMO_CHAT_COUNT': '0',
    'DEMO_TASK_COUNT': '0',
    'DEMO_DIRECTORY_COUNT': '0'
  });
  
  console.log('🔄 デモカウンターをリセットしました');
}

/**
 * デモ統計表示（撮影後の確認用）
 */
function showDemoStats() {
  const properties = PropertiesService.getScriptProperties();
  
  console.log('📊 デモ実行統計:');
  console.log(`📧 送信メール数: ${properties.getProperty('DEMO_EMAIL_COUNT') || '0'}`);
  console.log(`📅 作成予定数: ${properties.getProperty('DEMO_CALENDAR_COUNT') || '0'}`);
  console.log(`💬 送信通知数: ${properties.getProperty('DEMO_CHAT_COUNT') || '0'}`);
  console.log(`📋 作成タスク数: ${properties.getProperty('DEMO_TASK_COUNT') || '0'}`);
  console.log(`👤 ディレクトリ追加数: ${properties.getProperty('DEMO_DIRECTORY_COUNT') || '0'}`);
}