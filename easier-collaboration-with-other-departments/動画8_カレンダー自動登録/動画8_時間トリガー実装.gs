/**
 * 動画8: 時間ベーストリガー + Google Calendar API実装
 * 入社日をトリガーにした完全自動化システム完成
 */

/**
 * 毎日実行：入社日チェック・自動処理
 * 動画8の核心：時間ベーストリガーによる日次自動化
 */
function dailyEmployeeCheck() {
  console.log('=== 動画8: 日次入社日チェック開始 ===');
  
  try {
    const today = new Date();
    
    // 1. 今日入社の社員をチェック
    const newEmployeesToday = checkTodayNewEmployees(today);
    
    // 2. 入社予定者の事前準備チェック
    const upcomingEmployees = checkUpcomingEmployees(today);
    
    // 3. 入社後フォローアップが必要な社員
    const followUpEmployees = checkFollowUpRequired(today);
    
    // 4. 各種自動処理実行
    processNewEmployees(newEmployeesToday);
    processUpcomingReminders(upcomingEmployees);
    processFollowUps(followUpEmployees);
    
    // 5. 処理結果をレポート
    generateDailyReport(newEmployeesToday, upcomingEmployees, followUpEmployees);
    
    console.log('=== 動画8: 日次処理完了 ===');
    
  } catch (error) {
    console.error('動画8エラー:', error);
    sendErrorNotification(error);
  }
}

/**
 * 今日入社の社員チェック
 */
function checkTodayNewEmployees(today) {
  console.log('今日入社の社員チェック中');
  
  const employeeSheet = SpreadsheetApp.getActiveSheet();
  const data = employeeSheet.getDataRange().getValues();
  
  const todayEmployees = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const startDate = new Date(row[3]); // 入社日列
    
    if (isSameDate(startDate, today)) {
      const employee = {
        name: row[1],
        email: row[2],
        startDate: startDate,
        department: row[4],
        position: row[5],
        employmentType: row[6],
        rowIndex: i + 1,
        isNewEmployeeToday: true
      };
      
      todayEmployees.push(employee);
    }
  }
  
  console.log(`今日入社: ${todayEmployees.length}名`);
  return todayEmployees;
}

/**
 * 入社予定者の事前チェック
 */
function checkUpcomingEmployees(today) {
  console.log('入社予定者チェック中');
  
  const employeeSheet = SpreadsheetApp.getActiveSheet();
  const data = employeeSheet.getDataRange().getValues();
  
  const upcomingEmployees = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const startDate = new Date(row[3]);
    const daysDiff = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    
    // 1週間前、3日前、1日前にチェック
    if ([7, 3, 1].includes(daysDiff)) {
      const employee = {
        name: row[1],
        email: row[2],
        startDate: startDate,
        department: row[4],
        position: row[5],
        employmentType: row[6],
        daysUntilStart: daysDiff,
        rowIndex: i + 1
      };
      
      upcomingEmployees.push(employee);
    }
  }
  
  console.log(`入社予定（準備必要）: ${upcomingEmployees.length}名`);
  return upcomingEmployees;
}

/**
 * フォローアップ対象者チェック
 */
function checkFollowUpRequired(today) {
  console.log('フォローアップ対象者チェック中');
  
  const employeeSheet = SpreadsheetApp.getActiveSheet();
  const data = employeeSheet.getDataRange().getValues();
  
  const followUpEmployees = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const startDate = new Date(row[3]);
    const daysSinceStart = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    
    // 入社後1週間、1ヶ月、3ヶ月にフォローアップ
    if ([7, 30, 90].includes(daysSinceStart) && startDate <= today) {
      const employee = {
        name: row[1],
        email: row[2],
        startDate: startDate,
        department: row[4],
        position: row[5],
        daysSinceStart: daysSinceStart,
        followUpType: daysSinceStart === 7 ? '1週間後' : daysSinceStart === 30 ? '1ヶ月後' : '3ヶ月後',
        rowIndex: i + 1
      };
      
      followUpEmployees.push(employee);
    }
  }
  
  console.log(`フォローアップ対象: ${followUpEmployees.length}名`);
  return followUpEmployees;
}

/**
 * 新入社員の自動処理実行
 */
function processNewEmployees(employees) {
  console.log('新入社員自動処理実行中');
  
  employees.forEach(employee => {
    try {
      // 1. ウェルカムイベント作成
      createWelcomeEvents(employee);
      
      // 2. 歓迎メール送信（既存の関数を利用）
      generateAndSendWelcomeEmail(employee);
      
      // 3. 部署通知送信
      notifyDepartmentOfArrival(employee);
      
      // 4. 初日スケジュール自動生成
      createFirstDaySchedule(employee);
      
      // 5. 処理ステータス更新
      updateEmployeeStatus(employee, '入社日処理完了');
      
      console.log(`✅ ${employee.name}さんの入社日処理完了`);
      
    } catch (error) {
      console.error(`${employee.name}さんの処理エラー:`, error);
      updateEmployeeStatus(employee, `処理エラー: ${error.message}`);
    }
  });
}

/**
 * ウェルカムイベント自動作成
 */
function createWelcomeEvents(employee) {
  console.log('ウェルカムイベント作成:', employee.name);
  
  const events = [
    // 1. 朝のウェルカム面談
    {
      summary: `【ウェルカム面談】${employee.name}さん`,
      start: getTimeSlot(employee.startDate, 9, 0),
      end: getTimeSlot(employee.startDate, 10, 0),
      attendees: [
        employee.email,
        'hr@company.com',
        getDepartmentManager(employee.department).email
      ],
      description: `新入社員ウェルカム面談\n\n• 会社概要説明\n• 就業規則確認\n• 質問対応\n• 初日スケジュール説明`,
      conferenceData: {
        createRequest: {
          requestId: `welcome-${employee.name}-${Date.now()}`
        }
      }
    },
    
    // 2. 部署オリエンテーション
    {
      summary: `${employee.department} オリエンテーション - ${employee.name}さん`,
      start: getTimeSlot(employee.startDate, 14, 0),
      end: getTimeSlot(employee.startDate, 15, 30),
      attendees: [
        employee.email,
        ...getDepartmentMembers(employee.department).map(m => m.email)
      ],
      description: `部署オリエンテーション\n\n• チーム紹介\n• 業務概要説明\n• 今後のスケジュール\n• 質疑応答`,
      location: `${employee.department}会議室`
    },
    
    // 3. ウェルカムランチ
    {
      summary: `🍽️ ${employee.name}さん ウェルカムランチ`,
      start: getTimeSlot(employee.startDate, 12, 0),
      end: getTimeSlot(employee.startDate, 13, 30),
      attendees: [
        employee.email,
        getDepartmentManager(employee.department).email,
        'hr@company.com'
      ],
      description: `歓迎ランチ会\n\n新しい職場での第一印象を大切に、\nリラックスした雰囲気で交流を深めましょう。`,
      location: '社員食堂 または 近隣レストラン'
    }
  ];
  
  // イベント作成実行
  events.forEach(eventData => {
    try {
      const event = Calendar.Events.insert(eventData, 'primary');
      console.log(`📅 イベント作成成功: ${event.summary}`);
    } catch (error) {
      console.error(`イベント作成失敗: ${eventData.summary}`, error);
    }
  });
}

/**
 * 初日スケジュール詳細作成
 */
function createFirstDaySchedule(employee) {
  console.log('初日スケジュール作成:', employee.name);
  
  const schedule = [
    { time: '9:00-9:30', activity: '受付・入社手続き', location: '1F受付' },
    { time: '9:30-10:00', activity: 'ウェルカム面談', location: '人事部会議室' },
    { time: '10:00-10:30', activity: 'PC・備品受け取り', location: 'IT部門' },
    { time: '10:30-11:30', activity: '社内ツール設定', location: '自席' },
    { time: '11:30-12:00', activity: '安全衛生説明', location: '総務部' },
    { time: '12:00-13:30', activity: 'ウェルカムランチ', location: '社員食堂' },
    { time: '13:30-14:00', activity: '自席案内・環境設定', location: employee.department },
    { time: '14:00-15:30', activity: '部署オリエンテーション', location: `${employee.department}会議室` },
    { time: '15:30-16:30', activity: '業務システム説明', location: '自席' },
    { time: '16:30-17:30', activity: '初日振り返り面談', location: '人事部' }
  ];
  
  // Googleスプレッドシートに初日スケジュール保存
  const scheduleSheet = getOrCreateScheduleSheet();
  
  schedule.forEach(item => {
    scheduleSheet.appendRow([
      employee.name,
      employee.startDate,
      item.time,
      item.activity,
      item.location,
      '予定',
      new Date()
    ]);
  });
  
  // メール通知用のスケジュール表作成
  const scheduleHtml = createScheduleEmailContent(employee, schedule);
  
  // スケジュール確認メール送信
  sendScheduleConfirmationEmail(employee, scheduleHtml);
}

/**
 * 入社予定者へのリマインダー処理
 */
function processUpcomingReminders(employees) {
  console.log('入社予定者リマインダー処理中');
  
  employees.forEach(employee => {
    try {
      if (employee.daysUntilStart === 7) {
        // 1週間前：詳細準備案内
        send1WeekReminderEmail(employee);
        notifyDepartmentPreparation(employee, '1週間前');
        
      } else if (employee.daysUntilStart === 3) {
        // 3日前：最終確認
        send3DayReminderEmail(employee);
        checkPreparationStatus(employee);
        
      } else if (employee.daysUntilStart === 1) {
        // 1日前：明日準備完了確認
        send1DayReminderEmail(employee);
        createTomorrowPreparationChecklist(employee);
      }
      
      console.log(`✅ ${employee.name}さんの${employee.daysUntilStart}日前処理完了`);
      
    } catch (error) {
      console.error(`${employee.name}さんのリマインダー処理エラー:`, error);
    }
  });
}

/**
 * フォローアップ処理
 */
function processFollowUps(employees) {
  console.log('フォローアップ処理中');
  
  employees.forEach(employee => {
    try {
      if (employee.followUpType === '1週間後') {
        // 1週間後フォローアップ
        createWeeklyFollowUpMeeting(employee);
        sendWeeklyCheckEmail(employee);
        
      } else if (employee.followUpType === '1ヶ月後') {
        // 1ヶ月後フォローアップ
        createMonthlyReviewMeeting(employee);
        sendMonthlyFeedbackRequest(employee);
        
      } else if (employee.followUpType === '3ヶ月後') {
        // 3ヶ月後フォローアップ
        createQuarterlyEvaluation(employee);
        sendQuarterlyReviewInvitation(employee);
      }
      
      console.log(`✅ ${employee.name}さんの${employee.followUpType}フォローアップ完了`);
      
    } catch (error) {
      console.error(`${employee.name}さんのフォローアップエラー:`, error);
    }
  });
}

/**
 * 1週間後フォローアップミーティング作成
 */
function createWeeklyFollowUpMeeting(employee) {
  const meetingDate = new Date();
  meetingDate.setHours(16, 0, 0, 0); // 今日の16:00
  
  const meetingEnd = new Date(meetingDate);
  meetingEnd.setHours(16, 30, 0, 0);
  
  const event = {
    summary: `【1週間フォローアップ】${employee.name}さん`,
    start: { dateTime: meetingDate.toISOString() },
    end: { dateTime: meetingEnd.toISOString() },
    description: `入社1週間後のフォローアップミーティング\n\n確認事項:\n• 業務理解度\n• 職場適応状況\n• 困っていること\n• サポートが必要な点\n• 今後の目標設定`,
    attendees: [
      { email: employee.email },
      { email: getDepartmentManager(employee.department).email },
      { email: 'hr@company.com' }
    ]
  };
  
  Calendar.Events.insert(event, 'primary');
  console.log(`📅 1週間フォローアップ作成: ${employee.name}`);
}

/**
 * 日次レポート生成
 */
function generateDailyReport(newEmployees, upcomingEmployees, followUpEmployees) {
  console.log('日次レポート生成中');
  
  const report = {
    date: new Date(),
    newEmployeesToday: newEmployees.length,
    upcomingEmployees: upcomingEmployees.length,
    followUpEmployees: followUpEmployees.length,
    totalProcessed: newEmployees.length + upcomingEmployees.length + followUpEmployees.length
  };
  
  if (report.totalProcessed > 0) {
    // 人事部にサマリー通知
    sendDailyReportToHR(report, newEmployees, upcomingEmployees, followUpEmployees);
  }
  
  // レポートシートに記録
  const reportSheet = getOrCreateReportSheet();
  reportSheet.appendRow([
    report.date,
    report.newEmployeesToday,
    report.upcomingEmployees,
    report.followUpEmployees,
    report.totalProcessed,
    JSON.stringify({
      newEmployees: newEmployees.map(e => e.name),
      upcoming: upcomingEmployees.map(e => `${e.name}(${e.daysUntilStart}日前)`),
      followUp: followUpEmployees.map(e => `${e.name}(${e.followUpType})`)
    })
  ]);
  
  console.log('✅ 日次レポート完了');
}

/**
 * 初期セットアップ：トリガー設定
 */
function setupDailyTriggers() {
  console.log('日次トリガー設定中');
  
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyEmployeeCheck') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを設定（毎日朝8時）
  ScriptApp.newTrigger('dailyEmployeeCheck')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  
  console.log('✅ 日次トリガー設定完了');
}

/**
 * ユーティリティ関数群
 */
function isSameDate(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

function getTimeSlot(date, hour, minute) {
  const timeSlot = new Date(date);
  timeSlot.setHours(hour, minute, 0, 0);
  return { dateTime: timeSlot.toISOString() };
}

function updateEmployeeStatus(employee, status) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const statusColumn = sheet.getLastColumn() + 1;
    sheet.getRange(employee.rowIndex, statusColumn).setValue(status);
    sheet.getRange(employee.rowIndex, statusColumn + 1).setValue(new Date());
  } catch (error) {
    console.error('ステータス更新エラー:', error);
  }
}

function getOrCreateScheduleSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('初日スケジュール');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('初日スケジュール');
    sheet.getRange(1, 1, 1, 7).setValues([
      ['氏名', '入社日', '時間', '活動', '場所', 'ステータス', '作成日時']
    ]);
  }
  
  return sheet;
}

function getOrCreateReportSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName('日次処理レポート');
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet('日次処理レポート');
    sheet.getRange(1, 1, 1, 6).setValues([
      ['処理日', '新入社員数', '入社予定者数', 'フォローアップ数', '合計処理数', '詳細']
    ]);
  }
  
  return sheet;
}

function sendErrorNotification(error) {
  const hrWebhook = PropertiesService.getScriptProperties().getProperty('HR_CHAT_WEBHOOK');
  
  if (hrWebhook) {
    const errorMessage = {
      text: `⚠️ 自動化システムエラー`,
      cards: [{
        header: {
          title: 'システムエラー発生',
          subtitle: '日次処理でエラーが発生しました'
        },
        sections: [{
          widgets: [{
            textParagraph: {
              text: `<b>エラー内容:</b>\n${error.message}\n\n<b>発生時刻:</b>\n${new Date()}\n\n<b>対応:</b>\n人事部で手動確認をお願いします。`
            }
          }]
        }]
      }]
    };
    
    UrlFetchApp.fetch(hrWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(errorMessage)
    });
  }
}

/**
 * 部署への新入社員到着通知
 */
function notifyDepartmentOfArrival(employee) {
  console.log(`部署通知送信: ${employee.department} - ${employee.name}`);
  
  const manager = getDepartmentManager(employee.department);
  const subject = `【新入社員入社】${employee.name}さん（${employee.position}）が本日入社されました`;
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4285f4; color: white; padding: 20px; border-radius: 5px 5px 0 0;">
        <h2 style="margin: 0;">新入社員入社のお知らせ</h2>
      </div>
      
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>お疲れ様です。</p>
        
        <p>本日、${employee.department}に新しいメンバーが入社されました。</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">入社者情報</h3>
          <ul style="list-style: none; padding: 0;">
            <li>📝 <strong>氏名:</strong> ${employee.name}</li>
            <li>💼 <strong>役職:</strong> ${employee.position}</li>
            <li>📧 <strong>メール:</strong> ${employee.email}</li>
            <li>📅 <strong>入社日:</strong> ${Utilities.formatDate(employee.startDate, 'JST', 'yyyy年MM月dd日')}</li>
            <li>👥 <strong>雇用形態:</strong> ${employee.employmentType}</li>
          </ul>
        </div>
        
        <h3>本日のスケジュール</h3>
        <ul>
          <li>9:00-10:00: ウェルカム面談（人事部）</li>
          <li>14:00-15:30: 部署オリエンテーション（${employee.department}会議室）</li>
        </ul>
        
        <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0;">部署でのサポートのお願い</h4>
          <p>新入社員が早期に職場になじめるよう、以下のサポートをお願いします：</p>
          <ul>
            <li>チームメンバーへの紹介</li>
            <li>業務の概要説明</li>
            <li>メンター・バディの設定</li>
            <li>必要なツール・システムへのアクセス権限付与</li>
          </ul>
        </div>
        
        <p>ご協力よろしくお願いいたします。</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
          このメールは自動送信されています。<br>
          ご不明な点がございましたら、人事部までお問い合わせください。
        </p>
      </div>
    </div>
  `;
  
  // 部署マネージャーに通知
  if (manager && manager.email) {
    GmailApp.sendEmail(
      manager.email,
      subject,
      '本メールはHTML形式で送信されています。',
      {
        htmlBody: htmlBody,
        cc: 'hr@company.com',
        name: '人事システム'
      }
    );
  }
  
  // 部署のチャットにも通知（もし設定されていれば）
  const deptWebhook = PropertiesService.getScriptProperties().getProperty(`${employee.department}_WEBHOOK`);
  if (deptWebhook) {
    const chatMessage = {
      text: `🎉 ${employee.name}さん（${employee.position}）が本日入社されました！\n14:00から部署オリエンテーションを予定しています。温かくお迎えください。`
    };
    
    try {
      UrlFetchApp.fetch(deptWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(chatMessage)
      });
    } catch (error) {
      console.error('チャット通知エラー:', error);
    }
  }
}

/**
 * 人事部への日次レポート送信
 */
function sendDailyReportToHR(report, newEmployees, upcomingEmployees, followUpEmployees) {
  console.log('人事部への日次レポート送信');
  
  const subject = `【日次レポート】入社者管理システム ${Utilities.formatDate(report.date, 'JST', 'yyyy/MM/dd')}`;
  
  // 新入社員セクション
  let newEmployeeSection = '';
  if (newEmployees.length > 0) {
    const newEmpList = newEmployees.map(emp => 
      `<li>${emp.name} (${emp.department} - ${emp.position})</li>`
    ).join('');
    newEmployeeSection = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1a73e8;">🎊 本日入社（${newEmployees.length}名）</h3>
        <ul>${newEmpList}</ul>
      </div>
    `;
  }
  
  // 入社予定者セクション
  let upcomingSection = '';
  if (upcomingEmployees.length > 0) {
    const upcomingList = upcomingEmployees.map(emp => 
      `<li>${emp.name} - ${emp.daysUntilStart}日前リマインダー送信済み (${emp.department})</li>`
    ).join('');
    upcomingSection = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #fbbc04;">📅 入社準備対応（${upcomingEmployees.length}名）</h3>
        <ul>${upcomingList}</ul>
      </div>
    `;
  }
  
  // フォローアップセクション
  let followUpSection = '';
  if (followUpEmployees.length > 0) {
    const followUpList = followUpEmployees.map(emp => 
      `<li>${emp.name} - ${emp.followUpType}フォローアップ実施 (${emp.department})</li>`
    ).join('');
    followUpSection = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #34a853;">✅ フォローアップ実施（${followUpEmployees.length}名）</h3>
        <ul>${followUpList}</ul>
      </div>
    `;
  }
  
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333; margin-top: 0;">入社者管理システム 日次レポート</h2>
        <p style="color: #666;">処理日時: ${Utilities.formatDate(report.date, 'JST', 'yyyy年MM月dd日 HH:mm')}</p>
      </div>
      
      <div style="padding: 20px;">
        <div style="background-color: #e8f0fe; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">📊 処理サマリー</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">本日入社</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${report.newEmployeesToday}名</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">入社準備</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${report.upcomingEmployees}名</strong></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">フォローアップ</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;"><strong>${report.followUpEmployees}名</strong></td>
            </tr>
            <tr style="background-color: #f0f0f0;">
              <td style="padding: 8px;"><strong>合計処理数</strong></td>
              <td style="padding: 8px; text-align: right;"><strong>${report.totalProcessed}件</strong></td>
            </tr>
          </table>
        </div>
        
        ${newEmployeeSection}
        ${upcomingSection}
        ${followUpSection}
        
        ${report.totalProcessed === 0 ? '<p style="text-align: center; color: #666;">本日は処理対象がありませんでした。</p>' : ''}
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
          このレポートは毎日朝8時に自動生成されています。<br>
          詳細はGoogleスプレッドシートの「日次処理レポート」シートをご確認ください。
        </p>
      </div>
    </div>
  `;
  
  // メール送信
  const hrEmail = PropertiesService.getScriptProperties().getProperty('HR_EMAIL') || 'hr@company.com';
  GmailApp.sendEmail(
    hrEmail,
    subject,
    '本メールはHTML形式で送信されています。',
    {
      htmlBody: htmlBody,
      name: '入社者管理システム'
    }
  );
  
  // Chatへの通知（サマリーのみ）
  const hrWebhook = PropertiesService.getScriptProperties().getProperty('HR_CHAT_WEBHOOK');
  if (hrWebhook && report.totalProcessed > 0) {
    const chatMessage = {
      text: `📊 日次レポート: 本日${report.totalProcessed}件の処理を完了しました（新入社員${report.newEmployeesToday}名、準備${report.upcomingEmployees}名、フォローアップ${report.followUpEmployees}名）`
    };
    
    try {
      UrlFetchApp.fetch(hrWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        payload: JSON.stringify(chatMessage)
      });
    } catch (error) {
      console.error('Chat通知エラー:', error);
    }
  }
}