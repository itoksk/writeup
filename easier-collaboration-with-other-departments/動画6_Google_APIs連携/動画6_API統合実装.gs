/**
 * 完全統合版: フォーム送信処理 + AI歓迎メール生成システム + Google APIs統合連携
 * 全機能を含む完全版コード
 */

// ==================== 設定項目（必要に応じて変更） ====================

/**
 * 必須設定項目
 * これらの設定は最初に1回だけ行ってください
 */
const CONFIG = {
  // ChatGPT APIキー（AI歓迎メール機能を使用する場合のみ必須）
  // 設定方法: プロジェクトの設定 → スクリプトプロパティ → OPENAI_API_KEY を追加
  OPENAI_API_KEY: PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY'),
  
  // 会社情報（メールや書類で使用）
  COMPANY: {
    NAME: '株式会社サンプル',  // 会社名を変更してください
    HR_EMAIL: 'hr@company.com',  // 人事部のメールアドレスを変更してください
    HR_PHONE: '03-1234-5678',    // 人事部の電話番号を変更してください
  },
  
  // Google Chat通知設定（オプション：使用しない場合は空文字のまま）
  CHAT_WEBHOOKS: {
    IT_DEPT: PropertiesService.getScriptProperties().getProperty('IT_CHAT_WEBHOOK') || '',
    GA_DEPT: PropertiesService.getScriptProperties().getProperty('GA_CHAT_WEBHOOK') || ''
  },
  
  // フォルダ名設定
  FOLDERS: {
    EMPLOYEE_ROOT: '新入社員フォルダ',  // 従業員フォルダのルート名
    COMPANY_DOCS: '会社資料',          // 会社資料を格納するフォルダ名
  }
};

/**
 * 部署別マネージャー情報
 * 実際のマネージャー情報に変更してください
 */
const DEPARTMENT_MANAGERS = {
  '営業部': {
    name: '田中 営業部長',
    email: 'tanaka.sales@company.com'
  },
  '開発部': {
    name: '佐藤 開発部長', 
    email: 'sato.dev@company.com'
  },
  'マーケティング部': {
    name: '鈴木 マーケティング部長',
    email: 'suzuki.marketing@company.com'
  },
  '人事部': {
    name: '山田 人事部長',
    email: 'yamada.hr@company.com'
  },
  '総務部': {
    name: '高橋 総務部長',
    email: 'takahashi.ga@company.com'
  }
};

// ==================== メインフォーム送信処理 ====================

/**
 * フォーム送信時のメイン処理（統合版）
 * 既存の処理 + AI歓迎メール送信 + Google APIs連携
 */
function onFormSubmit(e) {
  console.log('=== 統合版: フォーム送信処理開始 ===');
  
  try {
    // 初回セットアップ確認
    ensureProperHeaders();
    
    // 送信データの取得と構造化（正しい方法）
    const formData = extractFormData(e);
    console.log('フォームデータ取得完了:', formData);
    
    // データバリデーション
    const validationResult = validateEmployeeData(formData);
    if (!validationResult.isValid) {
      logValidationError(e.range, validationResult.errors);
      return;
    }
    
    // データ加工・標準化
    const processedData = processAndStandardizeData(formData);
    
    // 拡張情報の自動追加
    addEnhancedInformation(e.range, processedData);
    
    // 【新機能】統合自動化実行（Gmail、Calendar、Chat、Drive）
    const integrationResults = executeIntegratedAutomation(processedData);
    
    // 処理成功ログ
    logProcessingSuccess(e.range, processedData);
    
    console.log('=== 統合版: 処理完了 ===');
    
  } catch (error) {
    console.error('統合版エラー:', error);
    logProcessingError(e.range, error);
  }
}

// ==================== Google APIs統合連携機能 ====================

/**
 * 統合自動化実行関数
 */
function executeIntegratedAutomation(employeeData) {
  console.log('=== 統合自動化実行開始 ===');
  
  try {
    // 並行処理で全API実行
    const results = {
      email: sendWelcomeEmailWithAttachments(employeeData),
      calendar: createMultipleCalendarEvents(employeeData),
      chat: sendDepartmentChatNotifications(employeeData),
      files: createEmployeeFolder(employeeData)
    };
    
    // 実行結果をログ
    logIntegrationResults(employeeData, results);
    
    console.log('=== 統合自動化完了 ===');
    return results;
    
  } catch (error) {
    console.error('統合処理エラー:', error);
    return { success: false, error: error.message };
  }
}

// ==================== Gmail API機能 ====================

/**
 * Gmail APIによる添付ファイル付きメール送信
 */
function sendWelcomeEmailWithAttachments(employeeData) {
  console.log('Gmail API実行:', employeeData.email);
  
  try {
    // メール内容生成（AI生成機能を活用）
    const emailContent = generatePersonalizedWelcomeEmail(employeeData);
    
    // 添付ファイル準備
    const attachments = prepareWelcomeAttachments(employeeData);
    
    // Gmail API でメール送信
    try {
      const emailPayload = {
        userId: 'me',
        resource: {
          raw: createRawEmailWithAttachments(
            employeeData.email,
            emailContent.subject,
            emailContent.body,
            attachments
          )
        }
      };
      
      const response = Gmail.Users.Messages.send(emailPayload);
      console.log('Gmail API送信成功:', response.id);
      
      return { success: true, messageId: response.id };
    } catch (gmailError) {
      console.log('Gmail APIが利用できないため、通常のメール送信を使用します');
      // 通常のメール送信にフォールバック
      return sendEmailWithAttachmentsViaMailApp(employeeData.email, emailContent, attachments);
    }
    
  } catch (error) {
    console.error('Gmail API エラー:', error);
    // フォールバック：通常のメール送信
    return generateAndSendWelcomeEmailFromForm(employeeData);
  }
}

/**
 * 添付ファイル準備（ファイル名で検索）
 */
function prepareWelcomeAttachments(employeeData) {
  const attachments = [];
  
  try {
    // 会社資料フォルダを取得（なければ作成）
    const companyDocsFolder = getOrCreateFolder(CONFIG.FOLDERS.COMPANY_DOCS);
    
    // 会社案内PDFを検索
    const companyGuideFiles = companyDocsFolder.getFilesByName('会社案内.pdf');
    if (companyGuideFiles.hasNext()) {
      const companyGuide = companyGuideFiles.next();
      // ファイル形式に応じて処理
      if (companyGuide.getMimeType() === 'application/pdf') {
        attachments.push({
          name: '会社案内.pdf',
          mimeType: 'application/pdf',
          content: Utilities.base64Encode(companyGuide.getBlob().getBytes())
        });
      } else {
        // PDFでない場合はスキップ（HTML等）
        console.log('会社案内はPDF形式ではないため、添付をスキップします');
      }
    } else {
      // 会社案内PDFがない場合は自動生成
      const newGuide = createCompanyGuideDocument(companyDocsFolder);
      if (newGuide) {
        // 生成されたファイルがPDFでない場合はスキップ
        console.log('会社案内ファイルを生成しましたが、PDF形式ではないため添付をスキップします');
      }
    }
    
    // 部署別資料を検索
    const deptGuideFileName = `${employeeData.department}_案内.pdf`;
    const deptGuideFiles = companyDocsFolder.getFilesByName(deptGuideFileName);
    if (deptGuideFiles.hasNext()) {
      const deptGuide = deptGuideFiles.next();
      attachments.push({
        name: deptGuideFileName,
        mimeType: 'application/pdf',
        content: Utilities.base64Encode(deptGuide.getBlob().getBytes())
      });
    }
    
  } catch (error) {
    console.error('添付ファイル準備エラー:', error);
  }
  
  return attachments;
}

/**
 * フォルダ取得または作成
 */
function getOrCreateFolder(folderName, parentFolder = null) {
  const parent = parentFolder || DriveApp.getRootFolder();
  const folders = parent.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    console.log(`フォルダ「${folderName}」を作成します`);
    return parent.createFolder(folderName);
  }
}

/**
 * 会社案内ドキュメントの自動生成（簡易版）
 */
function createCompanyGuideDocument(folder) {
  try {
    // HTMLで簡易的な会社案内を作成
    const htmlContent = `
      <h1>${CONFIG.COMPANY.NAME} 会社案内</h1>
      <h2>会社概要</h2>
      <p>会社名: ${CONFIG.COMPANY.NAME}</p>
      <p>人事部連絡先: ${CONFIG.COMPANY.HR_EMAIL}</p>
      <p>電話番号: ${CONFIG.COMPANY.HR_PHONE}</p>
      
      <h2>企業理念</h2>
      <p>私たちは、革新的なソリューションを通じて社会に価値を提供し続けます。</p>
      
      <h2>新入社員の皆様へ</h2>
      <p>当社へようこそ！皆様の入社を心よりお待ちしております。</p>
    `;
    
    // HTMLをBlobとして作成（PDFの代わりにHTML形式で保存）
    const blob = Utilities.newBlob(htmlContent, 'text/html', '会社案内.html');
    const file = folder.createFile(blob);
    
    console.log('会社案内ファイルを自動生成しました');
    return file;
    
  } catch (error) {
    console.error('会社案内生成エラー:', error);
    return null;
  }
}

/**
 * Raw形式のメール作成（添付ファイル付き）
 */
function createRawEmailWithAttachments(to, subject, body, attachments) {
  const boundary = '----boundary----';
  
  let message = 
    `To: ${to}\r\n` +
    `Subject: =?UTF-8?B?${Utilities.base64Encode(subject)}?=\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;
  
  // HTML本文
  message += 
    `--${boundary}\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n` +
    `Content-Transfer-Encoding: base64\r\n\r\n` +
    `${Utilities.base64Encode(body)}\r\n\r\n`;
  
  // 添付ファイル
  attachments.forEach(attachment => {
    message += 
      `--${boundary}\r\n` +
      `Content-Type: ${attachment.mimeType}; name="${attachment.name}"\r\n` +
      `Content-Disposition: attachment; filename="${attachment.name}"\r\n` +
      `Content-Transfer-Encoding: base64\r\n\r\n` +
      `${attachment.content}\r\n\r\n`;
  });
  
  message += `--${boundary}--`;
  
  return Utilities.base64EncodeWebSafe(message);
}

// ==================== Calendar API機能 ====================

/**
 * Calendar APIによる複数イベント自動作成
 */
function createMultipleCalendarEvents(employeeData) {
  console.log('Calendar API実行:', employeeData.name);
  
  const events = generateCalendarEvents(employeeData);
  const createdEvents = [];
  
  events.forEach(eventData => {
    try {
      const event = Calendar.Events.insert(eventData.event, eventData.calendarId);
      createdEvents.push({
        eventId: event.id,
        summary: event.summary,
        calendarId: eventData.calendarId
      });
      console.log(`イベント作成成功: ${event.summary}`);
    } catch (eventError) {
      console.error(`イベント作成失敗: ${eventData.event.summary}`, eventError);
    }
  });
  
  return { 
    success: true, 
    createdEvents: createdEvents, 
    count: createdEvents.length 
  };
}

/**
 * カレンダーイベント生成
 */
function generateCalendarEvents(employeeData) {
  const startDate = new Date(employeeData.startDate);
  const events = [];
  
  // 1. ウェルカム面談（人事カレンダー）
  events.push({
    calendarId: 'primary',
    event: {
      summary: `【ウェルカム面談】${employeeData.name}様`,
      start: { dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 10, 0).toISOString() },
      end: { dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 11, 0).toISOString() },
      attendees: [
        { email: employeeData.email },
        { email: CONFIG.COMPANY.HR_EMAIL },
        { email: getDepartmentManager(employeeData.department).email }
      ],
      conferenceData: {
        createRequest: { requestId: `welcome-${employeeData.name}-${Date.now()}` }
      }
    }
  });
  
  // 2. 部署オリエンテーション（部署カレンダー）
  events.push({
    calendarId: getDepartmentCalendarId(employeeData.department),
    event: {
      summary: `${employeeData.department} オリエンテーション - ${employeeData.name}様`,
      start: { dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 14, 0).toISOString() },
      end: { dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 15, 30).toISOString() },
      attendees: getDepartmentMembers(employeeData.department)
    }
  });
  
  // 3. 1週間後フォローアップ
  const followUpDate = new Date(startDate);
  followUpDate.setDate(followUpDate.getDate() + 7);
  
  events.push({
    calendarId: 'primary',
    event: {
      summary: `【1週間フォローアップ】${employeeData.name}様`,
      start: { dateTime: new Date(followUpDate.getFullYear(), followUpDate.getMonth(), followUpDate.getDate(), 16, 0).toISOString() },
      end: { dateTime: new Date(followUpDate.getFullYear(), followUpDate.getMonth(), followUpDate.getDate(), 16, 30).toISOString() },
      attendees: [
        { email: employeeData.email },
        { email: getDepartmentManager(employeeData.department).email }
      ]
    }
  });
  
  return events;
}

/**
 * 部署別カレンダーID取得（全てデフォルトカレンダーを使用）
 */
function getDepartmentCalendarId(department) {
  // 設定を簡略化するため、全てデフォルトカレンダーを使用
  return 'primary';
}

/**
 * 部署メンバー取得
 */
function getDepartmentMembers(department) {
  // 実際の運用では、スプレッドシートや外部DBから取得
  const members = {
    '営業部': [
      { email: 'sales-team@company.com' }
    ],
    '開発部': [
      { email: 'dev-team@company.com' }
    ],
    'マーケティング部': [
      { email: 'marketing-team@company.com' }
    ]
  };
  
  return members[department] || [];
}

// ==================== Chat API機能 ====================

/**
 * Chat APIによる部署別通知送信
 */
function sendDepartmentChatNotifications(employeeData) {
  console.log('Chat API実行');
  
  const notifications = [
    {
      department: 'IT部門',
      webhook: CONFIG.CHAT_WEBHOOKS.IT_DEPT,
      message: createITDepartmentMessage(employeeData)
    },
    {
      department: '総務部',
      webhook: CONFIG.CHAT_WEBHOOKS.GA_DEPT,
      message: createGADepartmentMessage(employeeData)
    }
  ];
  
  const results = [];
  
  notifications.forEach(notification => {
    if (notification.webhook) {
      const result = sendRichChatMessage(notification.webhook, notification.message);
      results.push({
        department: notification.department,
        success: result.success
      });
    } else {
      console.log(`${notification.department}のWebhook URLが設定されていないため、通知をスキップします`);
    }
  });
  
  return results;
}

/**
 * IT部門向けメッセージ作成
 */
function createITDepartmentMessage(employeeData) {
  return {
    text: `🆕 新入社員PC準備のお願い`,
    cards: [{
      header: {
        title: `IT部門への新入社員準備依頼`,
        subtitle: `${employeeData.name}様（${employeeData.position}）`,
        imageUrl: 'https://developers.google.com/chat/images/quickstart-app-avatar.png'
      },
      sections: [{
        widgets: [{
          textParagraph: {
            text: `<b>新入社員情報:</b><br>
👤 氏名: ${employeeData.name}<br>
📅 入社日: ${employeeData.startDateFormatted}<br>
🏢 部署: ${employeeData.department}<br>
💼 職種: ${employeeData.position}<br>
📧 メール: ${employeeData.email}`
          }
        }]
      }, {
        header: `📋 IT部門担当タスク`,
        widgets: [{
          textParagraph: {
            text: `• <b>PC・周辺機器の準備</b><br>
• <b>メールアカウント・システム権限設定</b><br>
• <b>VPN・セキュリティ設定</b><br>
• <b>開発環境構築（${employeeData.department}用）</b>`
          }
        }]
      }, {
        widgets: [{
          buttons: [{
            textButton: {
              text: 'タスク管理シートを開く',
              onClick: {
                openLink: {
                  url: getTaskSheetUrl()
                }
              }
            }
          }]
        }]
      }]
    }]
  };
}

/**
 * 総務部向けメッセージ作成
 */
function createGADepartmentMessage(employeeData) {
  return {
    text: `🆕 新入社員準備のお願い`,
    cards: [{
      header: {
        title: `総務部への新入社員準備依頼`,
        subtitle: `${employeeData.name}様（${employeeData.position}）`
      },
      sections: [{
        widgets: [{
          textParagraph: {
            text: `<b>新入社員情報:</b><br>
👤 氏名: ${employeeData.name}<br>
📅 入社日: ${employeeData.startDateFormatted}<br>
🏢 部署: ${employeeData.department}<br>
📧 メール: ${employeeData.email}`
          }
        }]
      }, {
        header: `📋 総務部担当タスク`,
        widgets: [{
          textParagraph: {
            text: `• <b>座席・ロッカーの準備</b><br>
• <b>入館証・社員証の発行</b><br>
• <b>名刺の作成</b><br>
• <b>備品の準備（文房具等）</b>`
          }
        }]
      }]
    }]
  };
}

/**
 * リッチカードメッセージ送信
 */
function sendRichChatMessage(webhookUrl, message) {
  try {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(message)
    };
    
    const response = UrlFetchApp.fetch(webhookUrl, options);
    
    return { 
      success: response.getResponseCode() === 200,
      response: response.getContentText() 
    };
    
  } catch (error) {
    console.error('Chat送信エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * タスク管理シートURL取得
 */
function getTaskSheetUrl() {
  return PropertiesService.getScriptProperties().getProperty('TASK_SHEET_URL') || 
         SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

// ==================== Drive API機能 ====================

/**
 * 個人フォルダ作成
 */
function createEmployeeFolder(employeeData) {
  console.log('Drive API実行:', employeeData.name);
  
  try {
    // 新入社員フォルダを取得（なければ作成）
    const rootFolder = getOrCreateFolder(CONFIG.FOLDERS.EMPLOYEE_ROOT);
    
    // 個人フォルダ作成
    const folderName = `${employeeData.name}_${employeeData.startDateFormatted.replace(/[年月日]/g, '')}`;
    const employeeFolder = rootFolder.createFolder(folderName);
    
    // サブフォルダ作成
    const subfolders = ['契約書類', '研修資料', '業務資料', '個人情報'];
    subfolders.forEach(subfolder => {
      employeeFolder.createFolder(subfolder);
    });
    
    // 権限設定
    employeeFolder.addEditor(employeeData.email);
    
    // ウェルカムドキュメント作成
    createWelcomeDocument(employeeFolder, employeeData);
    
    console.log('個人フォルダ作成完了:', employeeFolder.getUrl());
    
    return {
      success: true,
      folderId: employeeFolder.getId(),
      folderUrl: employeeFolder.getUrl()
    };
    
  } catch (error) {
    console.error('Drive API エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * ウェルカムドキュメント作成（テキストファイル版）
 */
function createWelcomeDocument(folder, employeeData) {
  try {
    const content = `
${employeeData.name}様のウェルカムガイド
=====================================

入社日: ${employeeData.startDateFormatted}
配属部署: ${employeeData.department}
職種: ${employeeData.position}

重要な連絡先
-----------------
人事部: ${CONFIG.COMPANY.HR_EMAIL} | ${CONFIG.COMPANY.HR_PHONE}
IT ヘルプデスク: it-help@company.com | 内線: 1111
総務部: ${CONFIG.COMPANY.HR_EMAIL} | 内線: 2222

オンボーディングスケジュール
-----------------
1. 入社初日: 入社手続き、PCセットアップ
2. 第1週: 部署オリエンテーション、研修開始
3. 第2週: 実務研修、メンターとの面談

${CONFIG.COMPANY.NAME}へようこそ！
`;
    
    // テキストファイルとして作成
    const blob = Utilities.newBlob(content, 'text/plain', `${employeeData.name}様_ウェルカムガイド.txt`);
    folder.createFile(blob);
    
    console.log('ウェルカムドキュメントを作成しました');
  } catch (error) {
    console.error('ウェルカムドキュメント作成エラー:', error);
  }
}

// ==================== 統合ログ機能 ====================

/**
 * 統合実行結果のログ記録
 */
function logIntegrationResults(employeeData, results) {
  const logSheet = getOrCreateIntegrationLogSheet();
  
  logSheet.appendRow([
    new Date(),
    employeeData.name,
    employeeData.email,
    results.email.success ? '成功' : '失敗',
    results.calendar.count || 0,
    results.chat.filter(r => r.success).length,
    results.files.success ? '成功' : '失敗',
    JSON.stringify(results)
  ]);
}

/**
 * 統合ログシート取得/作成
 */
function getOrCreateIntegrationLogSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = spreadsheet.getSheetByName('統合実行ログ');
  
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet('統合実行ログ');
    logSheet.getRange(1, 1, 1, 8).setValues([
      ['実行日時', '氏名', 'メール', 'Gmail', 'Calendar件数', 'Chat成功数', 'Drive', '詳細']
    ]);
    
    // ヘッダー装飾
    const headerRange = logSheet.getRange(1, 1, 1, 8);
    headerRange.setBackground('#1a73e8');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return logSheet;
}

// ==================== ヘッダー・列管理 ====================

/**
 * ヘッダーの存在確認と設定
 * 列の重複作成を防ぐ重要な機能
 */
function ensureProperHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const expectedHeaders = [
    'タイムスタンプ',
    '氏名', 
    'メールアドレス',
    '入社日',
    '部署',
    '職種',
    '雇用形態',
    '社員ID',
    '直属上司名',
    '上司メールアドレス', 
    'オンボーディング期間(日)',
    '処理ステータス',
    '処理完了時刻'
  ];
  
  const currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // 必要な列が不足している場合のみ追加
  if (currentHeaders.length < expectedHeaders.length) {
    console.log('ヘッダー不足を検出、必要な列を追加します');
    
    // 不足している列のみ追加
    const missingHeaders = expectedHeaders.slice(currentHeaders.length);
    const startColumn = currentHeaders.length + 1;
    
    sheet.getRange(1, startColumn, 1, missingHeaders.length).setValues([missingHeaders]);
    
    // 新しく追加したヘッダーのスタイル設定
    const newHeaderRange = sheet.getRange(1, startColumn, 1, missingHeaders.length);
    newHeaderRange.setBackground('#4285f4');
    newHeaderRange.setFontColor('white');
    newHeaderRange.setFontWeight('bold');
    
    console.log('ヘッダー追加完了:', missingHeaders);
  }
}

/**
 * 列番号の取得
 * ヘッダー名から列番号を動的に取得
 */
function getColumnIndex(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.indexOf(headerName);
  console.log(`列検索: "${headerName}" → インデックス: ${index} → 列番号: ${index >= 0 ? index + 1 : null}`);
  return index >= 0 ? index + 1 : null;
}

/**
 * ヘッダー行の設定
 * 初回セットアップ用（手動実行）
 */
function setupSpreadsheetHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  const headers = [
    'タイムスタンプ',
    '氏名', 
    'メールアドレス',
    '入社日',
    '部署',
    '職種',
    '雇用形態',
    '社員ID',
    '直属上司名',
    '上司メールアドレス', 
    'オンボーディング期間(日)',
    '処理ステータス',
    '処理完了時刻'
  ];
  
  // ヘッダー行に設定
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // ヘッダー行のスタイル設定
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('white');
  headerRange.setFontWeight('bold');
  
  console.log('スプレッドシートヘッダー設定完了');
}

// ==================== データ抽出・処理 ====================

/**
 * フォームデータの抽出と構造化
 */
function extractFormData(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  console.log('=== フォームデータ抽出 ===');
  console.log('Row:', row);
  console.log('Values:', values);
  
  // フォーム項目の構造化（列番号を動的に取得）
  const formData = {
    timestamp: values[getColumnIndex(sheet, 'タイムスタンプ') - 1],
    name: values[getColumnIndex(sheet, '氏名') - 1],
    email: values[getColumnIndex(sheet, 'メールアドレス') - 1], 
    startDate: values[getColumnIndex(sheet, '入社日') - 1],
    department: values[getColumnIndex(sheet, '部署') - 1],
    position: values[getColumnIndex(sheet, '職種') - 1],
    employmentType: values[getColumnIndex(sheet, '雇用形態') - 1],
    rowNumber: row,
    sheet: sheet
  };
  
  console.log('抽出されたフォームデータ:', formData);
  console.log('抽出されたメールアドレス:', formData.email);
  
  return formData;
}

/**
 * 高度なデータバリデーション
 */
function validateEmployeeData(data) {
  const errors = [];
  
  // 必須項目チェック
  if (!data.name || data.name.trim() === '') {
    errors.push('氏名が入力されていません');
  }
  
  if (!data.email || data.email.trim() === '') {
    errors.push('メールアドレスが入力されていません');
  }
  
  if (!data.startDate) {
    errors.push('入社日が選択されていません');
  }
  
  // メールアドレス形式チェック
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('メールアドレスの形式が正しくありません');
    }
  }
  
  // 入社日妥当性チェック
  if (data.startDate) {
    const startDate = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate <= today) {
      errors.push('入社日は今日より後の日付を選択してください');
    }
    
    // 6ヶ月以上先の日付は警告
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);
    if (startDate > sixMonthsLater) {
      errors.push('警告: 入社日が6ヶ月以上先に設定されています');
    }
  }
  
  // 氏名の妥当性チェック
  if (data.name) {
    if (data.name.length < 2) {
      errors.push('氏名は2文字以上で入力してください');
    }
    if (data.name.length > 50) {
      errors.push('氏名は50文字以内で入力してください');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * データの加工・標準化処理
 */
function processAndStandardizeData(data) {
  const processed = {...data};
  
  // 氏名の標準化
  if (processed.name) {
    processed.name = processed.name.trim();
  }
  
  // メールアドレスの正規化
  if (processed.email) {
    processed.email = processed.email.trim().toLowerCase();
  }
  
  // 部署名の標準化
  const departmentMapping = {
    '営業': '営業部',
    '開発': '開発部', 
    'エンジニア': '開発部',
    'マーケ': 'マーケティング部',
    'マーケティング': 'マーケティング部',
    '人事': '人事部'
  };
  
  if (processed.department && departmentMapping[processed.department]) {
    processed.department = departmentMapping[processed.department];
  }
  
  // 入社日の標準化
  if (processed.startDate) {
    processed.startDate = new Date(processed.startDate);
    processed.startDateFormatted = Utilities.formatDate(
      processed.startDate, 
      Session.getScriptTimeZone(), 
      'yyyy年MM月dd日'
    );
  }
  
  console.log('標準化後データ:', processed);
  return processed;
}

// ==================== 拡張情報追加 ====================

/**
 * 拡張情報の自動追加
 */
function addEnhancedInformation(range, data) {
  const sheet = range.getSheet();
  const row = range.getRow();
  
  // 一意ID生成
  const uniqueId = generateUniqueEmployeeId(data);
  
  // 部署マネージャー情報取得
  const managerInfo = getDepartmentManager(data.department);
  
  // 推定オンボーディング期間計算
  const onboardingDays = calculateOnboardingDays(data.position);
  
  try {
    // 既存の列に情報を書き込み（列番号を動的に取得）
    const employeeIdCol = getColumnIndex(sheet, '社員ID');
    const managerNameCol = getColumnIndex(sheet, '直属上司名');
    const managerEmailCol = getColumnIndex(sheet, '上司メールアドレス');
    const onboardingCol = getColumnIndex(sheet, 'オンボーディング期間(日)');
    const statusCol = getColumnIndex(sheet, '処理ステータス');
    const timestampCol = getColumnIndex(sheet, '処理完了時刻');
    
    if (employeeIdCol) sheet.getRange(row, employeeIdCol).setValue(uniqueId);
    if (managerNameCol) sheet.getRange(row, managerNameCol).setValue(managerInfo.name);
    if (managerEmailCol) sheet.getRange(row, managerEmailCol).setValue(managerInfo.email);
    if (onboardingCol) sheet.getRange(row, onboardingCol).setValue(onboardingDays);
    if (statusCol) sheet.getRange(row, statusCol).setValue('自動処理完了');
    if (timestampCol) sheet.getRange(row, timestampCol).setValue(new Date());
    
    console.log('拡張情報追加完了:', uniqueId);
  } catch (error) {
    console.error('拡張情報追加エラー:', error);
  }
}

/**
 * 社員ID自動生成
 */
function generateUniqueEmployeeId(data) {
  const year = data.startDate.getFullYear();
  const month = String(data.startDate.getMonth() + 1).padStart(2, '0');
  
  // 部署コード
  const deptCodes = {
    '営業部': 'SAL',
    '開発部': 'DEV', 
    'マーケティング部': 'MKT',
    '人事部': 'HR',
    '総務部': 'GA'
  };
  
  const deptCode = deptCodes[data.department] || 'GEN';
  
  // 連番生成（その月の何人目か）
  const sequence = getMonthlySequence(year, month, data.department);
  
  return `${year}${month}${deptCode}${String(sequence).padStart(3, '0')}`;
}

/**
 * 月次連番取得
 */
function getMonthlySequence(year, month, department) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const startDateCol = getColumnIndex(sheet, '入社日') - 1;
  const departmentCol = getColumnIndex(sheet, '部署') - 1;
  
  let count = 0;
  for (let i = 1; i < data.length; i++) {
    if (startDateCol !== null && departmentCol !== null) {
      const rowDate = new Date(data[i][startDateCol]);
      if (rowDate.getFullYear() === year && 
          rowDate.getMonth() + 1 === parseInt(month) &&
          data[i][departmentCol] === department) {
        count++;
      }
    }
  }
  
  return count;
}

/**
 * 部署マネージャー情報取得
 */
function getDepartmentManager(department) {
  return DEPARTMENT_MANAGERS[department] || {
    name: '未設定',
    email: CONFIG.COMPANY.HR_EMAIL
  };
}

/**
 * オンボーディング期間計算
 */
function calculateOnboardingDays(position) {
  const onboardingPeriods = {
    'エンジニア': 14,
    'システムエンジニア': 14,
    '営業': 7,
    'マーケティング': 10,
    '人事': 7,
    '総務': 5,
    '管理職': 3,
    'マネージャー': 3
  };
  
  // 職種による期間算出
  for (const [key, days] of Object.entries(onboardingPeriods)) {
    if (position && position.includes(key)) {
      return days;
    }
  }
  
  return 7; // デフォルト期間
}

// ==================== ログ機能 ====================

/**
 * バリデーションエラーログ
 */
function logValidationError(range, errors) {
  const sheet = range.getSheet();
  const row = range.getRow();
  
  const errorMessage = 'データエラー: ' + errors.join(', ');
  
  // 既存の列を使用してエラー情報を記録
  const statusCol = getColumnIndex(sheet, '処理ステータス');
  const timestampCol = getColumnIndex(sheet, '処理完了時刻');
  
  if (statusCol) sheet.getRange(row, statusCol).setValue(errorMessage);
  if (timestampCol) sheet.getRange(row, timestampCol).setValue(new Date());
  
  // エラー行の背景色を変更
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#ffebee');
  
  console.error('バリデーションエラー:', errors);
}

/**
 * 処理成功ログ
 */
function logProcessingSuccess(range, data) {
  console.log(`✅ 処理成功: ${data.name}さん (${data.email})`);
  
  // 成功行の背景色を変更
  const sheet = range.getSheet();
  const row = range.getRow();
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#e8f5e8');
}

/**
 * 処理エラーログ
 */
function logProcessingError(range, error) {
  const sheet = range.getSheet();
  const row = range.getRow();
  
  const errorMessage = 'システムエラー: ' + error.message;
  
  // 既存の列を使用してエラー情報を記録
  const statusCol = getColumnIndex(sheet, '処理ステータス');
  const timestampCol = getColumnIndex(sheet, '処理完了時刻');
  
  if (statusCol) sheet.getRange(row, statusCol).setValue(errorMessage);
  if (timestampCol) sheet.getRange(row, timestampCol).setValue(new Date());
  
  // エラー行の背景色を変更
  sheet.getRange(row, 1, 1, sheet.getLastColumn()).setBackground('#ffcdd2');
}

// ==================== AI歓迎メール生成部分 ====================

/**
 * フォームデータからAI歓迎メール生成・送信
 * 正しいデータ構造を使用
 */
function generateAndSendWelcomeEmailFromForm(formData) {
  console.log('=== AI歓迎メール生成開始（フォームデータ使用） ===');
  
  try {
    // フォームデータをAI歓迎メール用の形式に変換
    const employeeData = {
      name: formData.name,
      email: formData.email,  // フォームから正しく取得されたメールアドレス
      department: formData.department,
      position: formData.position,
      employmentType: formData.employmentType,
      startDate: formData.startDate,
      startDateFormatted: formData.startDateFormatted
    };
    
    console.log('AI用データ変換完了:', employeeData);
    console.log('使用するメールアドレス:', employeeData.email);
    
    // AI歓迎メール生成・送信実行
    const result = generateAndSendWelcomeEmail(employeeData);
    console.log('AI歓迎メール送信結果:', result);
    
    return result;
    
  } catch (error) {
    console.error('AI歓迎メール生成エラー:', error);
    // フォールバック：簡単な歓迎メールを送信
    return sendFallbackEmailFromForm(formData);
  }
}

/**
 * メイン処理：AI生成歓迎メール送信
 */
function generateAndSendWelcomeEmail(employeeData) {
  console.log('=== AI歓迎メール生成開始 ===');
  
  try {
    // 従業員データの検証と補完
    const validatedData = validateAndCompleteEmployeeData(employeeData);
    console.log('検証済み従業員データ:', validatedData);
    
    // 1. AI歓迎メール生成
    const welcomeEmail = generatePersonalizedWelcomeEmail(validatedData);
    
    // 2. AIタスクリスト生成  
    const taskList = generatePersonalizedTaskList(validatedData);
    
    // 3. 最終メール組み立て
    const finalEmail = assembleCompleteEmail(welcomeEmail, taskList, validatedData);
    
    // 4. Gmail経由で送信
    const success = sendEmailViaGmail(validatedData.email, finalEmail, validatedData);
    
    if (success) {
      logEmailSuccess(validatedData);
      return { success: true, message: 'AI歓迎メール送信完了' };
    } else {
      throw new Error('メール送信に失敗しました');
    }
    
  } catch (error) {
    console.error('AI歓迎メールエラー:', error);
    // フォールバック：テンプレートメール送信
    return sendFallbackEmail(employeeData);
  }
}

/**
 * 従業員データの検証と補完（修正版）
 */
function validateAndCompleteEmployeeData(employeeData) {
  console.log('=== 従業員データ検証 ===');
  console.log('受信データ:', employeeData);
  
  // メールアドレスの存在確認
  if (!employeeData || !employeeData.email || employeeData.email.trim() === '') {
    console.error('❌ メールアドレスが提供されていません');
    throw new Error('メールアドレスが必須です');
  }
  
  // メールアドレスの形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(employeeData.email)) {
    throw new Error(`無効なメールアドレス形式です: ${employeeData.email}`);
  }
  
  // データ補完
  const validated = {
    name: employeeData.name || '新入社員様',
    email: employeeData.email, // フォームから取得した正しいメールアドレス
    department: employeeData.department || '総務部',
    position: employeeData.position || '一般職',
    employmentType: employeeData.employmentType || '正社員',
    startDate: employeeData.startDate || new Date(),
    startDateFormatted: employeeData.startDateFormatted || formatDate(employeeData.startDate || new Date())
  };
  
  console.log('✅ 検証済みデータ:', validated);
  return validated;
}

/**
 * 日付フォーマット関数
 */
function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// ==================== ChatGPT API機能 ====================

/**
 * ChatGPT API による個別歓迎メール生成（完全版）
 */
function generatePersonalizedWelcomeEmail(employeeData) {
  console.log('AI歓迎メール生成中:', employeeData.name);
  
  // APIキーの確認
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (!apiKey) {
    console.log('OpenAI APIキーが未設定のため、簡易版を使用します');
    return generateSimpleWelcomeEmail(employeeData);
  }
  
  // 部署別カスタマイズ情報
  const departmentContext = getDepartmentContext(employeeData.department);
  
  // ChatGPT用プロンプト構築
  const prompt = `
あなたは経験豊富で心温かい人事担当者です。
新入社員に感動的な歓迎メールを作成してください。

【内定者情報】
氏名: ${employeeData.name}
入社日: ${employeeData.startDateFormatted}
配属部署: ${employeeData.department} 
職種: ${employeeData.position}
雇用形態: ${employeeData.employmentType}

【部署の特色】
${departmentContext.description}

【期待する成果】
${departmentContext.expectations}

【重要】以下の形式で必ず出力してください：
件名: [ここに件名を記載]
本文:
[ここに本文を記載]

【要求事項】
1. 温かみのある、しかしプロフェッショナルな口調
2. 職種・部署に特化した具体的な期待内容を含める
3. 会社への帰属意識を高める内容
4. 不安を和らげ、やる気を引き出す内容
5. 400-600文字程度
`;

  try {
    const response = callChatGPTAPI(prompt);
    const generatedContent = JSON.parse(response.getContentText());
    
    console.log('ChatGPT API生成完了');
    console.log('生成された内容:', generatedContent.choices[0].message.content);
    
    return parseEmailResponse(generatedContent.choices[0].message.content);
    
  } catch (error) {
    console.error('ChatGPT API エラー:', error);
    console.log('フォールバックとして簡易版歓迎メールを使用');
    return generateSimpleWelcomeEmail(employeeData);
  }
}

/**
 * ChatGPT API による個別タスクリスト生成（完全版）
 */
function generatePersonalizedTaskList(employeeData) {
  console.log('AIタスクリスト生成中:', employeeData.position);
  
  // APIキーの確認
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (!apiKey) {
    console.log('OpenAI APIキーが未設定のため、簡易版を使用します');
    return generateSimpleTaskList(employeeData);
  }
  
  const prompt = `
${employeeData.position}として${employeeData.department}に配属される新入社員のための、
入社前・入社後のタスクリストを生成してください。

【内定者情報】
職種: ${employeeData.position}
部署: ${employeeData.department}
入社日: ${employeeData.startDateFormatted}

【重要】必ず以下のJSONフォーマットで出力してください。他の文章は一切含めないでください：

{
  "beforeJoining": [
    {"task": "タスク名", "deadline": "期限", "priority": "高", "description": "詳細説明"}
  ],
  "firstDay": [
    {"task": "タスク名", "deadline": "期限", "priority": "中", "description": "詳細説明"}
  ],
  "firstWeek": [
    {"task": "タスク名", "deadline": "期限", "priority": "低", "description": "詳細説明"}
  ]
}

【要求事項】
1. 入社前タスク（3項目）
2. 入社初日タスク（3項目）  
3. 入社第1週タスク（4項目）
4. priorityは「高」「中」「低」のいずれか
5. 実行可能で具体的な内容
6. 純粋なJSONのみを出力
`;

  try {
    const response = callChatGPTAPI(prompt);
    const generatedContent = JSON.parse(response.getContentText());
    let taskListText = generatedContent.choices[0].message.content;
    
    // JSONの抽出（前後の余分なテキストを除去）
    const jsonMatch = taskListText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      taskListText = jsonMatch[0];
    }
    
    console.log('生成されたタスクリストJSON:', taskListText);
    const taskList = JSON.parse(taskListText);
    
    console.log('ChatGPT タスクリスト生成完了');
    return taskList;
    
  } catch (error) {
    console.error('ChatGPT タスクリスト生成エラー:', error);
    console.log('フォールバックとして簡易版タスクリストを使用');
    return generateSimpleTaskList(employeeData);
  }
}

/**
 * ChatGPT API 呼び出し共通関数
 */
function callChatGPTAPI(prompt, model = 'gpt-4') {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません。スクリプトプロパティでOPENAI_API_KEYを設定してください。');
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: model,
    messages: [
      {
        role: 'system',
        content: 'あなたは経験豊富で心温かい人事担当者です。新入社員へのサポートと成長を最優先に考え、指定された形式で正確に回答します。'
      },
      {
        role: 'user', 
        content: prompt
      }
    ],
    max_tokens: 1500,
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
    console.log('ChatGPT API呼び出し中...');
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`API Error: ${response.getResponseCode()} - ${response.getContentText()}`);
    }
    
    console.log('ChatGPT API呼び出し成功');
    return response;
    
  } catch (error) {
    console.error('ChatGPT API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * AIレスポンスからメール内容を解析
 */
function parseEmailResponse(aiResponse) {
  try {
    console.log('ChatGPT メール解析中:', aiResponse);
    
    let subject = '';
    let body = '';
    
    // 件名の抽出
    const subjectMatch = aiResponse.match(/件名[:：]\s*(.+)/);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
    }
    
    // 本文の抽出
    const bodyMatch = aiResponse.match(/本文[:：]\s*([\s\S]+)/);
    if (bodyMatch) {
      body = bodyMatch[1].trim();
    }
    
    // フォールバック処理
    if (!subject && !body) {
      const lines = aiResponse.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        subject = lines[0].replace(/^件名[:：]?\s*/, '');
        body = lines.slice(1).join('\n');
      }
    }
    
    // 最終的なフォールバック
    if (!subject) {
      subject = 'ご入社を心からお待ちしております！';
    }
    if (!body) {
      body = aiResponse;
    }
    
    const result = {
      subject: subject,
      body: body.trim()
    };
    
    console.log('ChatGPT メール解析結果:', result);
    return result;
    
  } catch (error) {
    console.error('ChatGPT メール解析エラー:', error);
    return {
      subject: 'ご入社準備のご案内',
      body: aiResponse
    };
  }
}

/**
 * 部署別コンテキスト情報取得（拡張版）
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

// ==================== 簡易版・フォールバック機能 ====================

/**
 * 簡易版歓迎メール生成（バックアップ用）
 */
function generateSimpleWelcomeEmail(employeeData) {
  console.log('簡易版歓迎メール生成');
  
  return {
    subject: `ご入社おめでとうございます！${employeeData.department}でのご活躍を期待しております`,
    body: `
${employeeData.name}様

この度は、弊社にご入社いただき、誠にありがとうございます。
${employeeData.department}のメンバー一同、${employeeData.name}様をお迎えできることを大変嬉しく思っております。

【ご入社詳細】
・お名前: ${employeeData.name}様
・入社日: ${employeeData.startDateFormatted}
・配属部署: ${employeeData.department}
・職種: ${employeeData.position}
・雇用形態: ${employeeData.employmentType}

${employeeData.department}では、チームワークを大切にし、一人ひとりの成長を支援する環境があります。
新しい環境への不安もあるかと思いますが、私たちが全力でサポートいたします。

ご質問やご不明な点がございましたら、いつでもお気軽にご連絡ください。

人事部一同
    `
  };
}

/**
 * 簡易版タスクリスト生成（バックアップ用）
 */
function generateSimpleTaskList(employeeData) {
  console.log('簡易版タスクリスト生成');
  
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
      },
      {
        task: '通勤経路の確認',
        deadline: '入社日の前日',
        priority: '中',
        description: '最寄り駅からオフィスまでの経路と所要時間をご確認ください'
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
        priority: '高',
        description: 'IT部門より業務用PCと必要な設備をお受け取りください'
      },
      {
        task: '職場見学・挨拶回り',
        deadline: '11:00AM',
        priority: '中',
        description: 'オフィス内の案内と各部署への挨拶を行います'
      }
    ],
    firstWeek: [
      {
        task: '部署メンバーとの面談',
        deadline: '第3営業日',
        priority: '高',
        description: '配属部署のメンバーとの個別面談を実施します'
      },
      {
        task: '業務システムの基本操作研修',
        deadline: '第3営業日',
        priority: '高',
        description: '社内システムの基本的な使用方法を学習します'
      },
      {
        task: '新人研修プログラムの受講',
        deadline: '第5営業日',
        priority: '中',
        description: '会社方針や業務フローに関する研修を受講します'
      },
      {
        task: '初回1on1ミーティング',
        deadline: '第5営業日',
        priority: '中',
        description: '直属の上司との個別面談を実施します'
      }
    ]
  };
}

/**
 * フォールバック歓迎メール送信（フォームデータ版）
 */
function sendFallbackEmailFromForm(formData) {
  console.log('フォールバック歓迎メール送信（フォームデータ版）');
  
  const emailContent = {
    subject: `【${formData.name}様】ご入社を心よりお待ちしております`,
    html: `
    <h2>ご入社を心よりお待ちしております</h2>
    <p>${formData.name}様</p>
    <p>この度は、弊社にご入社いただき、誠にありがとうございます。</p>
    
    <h3>入社詳細</h3>
    <ul>
      <li><strong>お名前:</strong> ${formData.name}</li>
      <li><strong>入社日:</strong> ${formData.startDateFormatted}</li>
      <li><strong>配属部署:</strong> ${formData.department}</li>
      <li><strong>職種:</strong> ${formData.position}</li>
      <li><strong>雇用形態:</strong> ${formData.employmentType}</li>
    </ul>
    
    <p>入社に関するご質問がございましたら、お気軽にお声かけください。</p>
    <p>人事部一同、${formData.name}様との出会いを楽しみにしております。</p>
    
    <hr>
    <p><small>人事部 | ${CONFIG.COMPANY.HR_EMAIL} | ${CONFIG.COMPANY.HR_PHONE}</small></p>
    `
  };
  
  try {
    const success = sendEmailViaGmail(formData.email, emailContent, formData);
    return { success, message: 'フォールバック歓迎メール送信完了' };
  } catch (error) {
    console.error('フォールバック送信エラー:', error);
    return { success: false, message: 'メール送信失敗: ' + error.message };
  }
}

/**
 * フォールバックメール送信
 */
function sendFallbackEmail(employeeData) {
  console.log('フォールバックメール送信:', employeeData?.name || 'Unknown');
  
  const validatedData = validateAndCompleteEmployeeData(employeeData);
  
  const fallbackEmail = {
    subject: `【${validatedData.name}様】ご入社を心よりお待ちしております`,
    html: `
    <h2>ご入社を心よりお待ちしております</h2>
    <p>この度は、弊社にご入社いただき、誠にありがとうございます。</p>
    <p><strong>入社詳細:</strong></p>
    <ul>
      <li>お名前: ${validatedData.name}</li>
      <li>入社日: ${validatedData.startDateFormatted}</li>
      <li>配属部署: ${validatedData.department}</li>
      <li>職種: ${validatedData.position}</li>
    </ul>
    <p>入社に関するご質問がございましたら、お気軽にお声かけください。</p>
    `
  };
  
  try {
    const success = sendEmailViaGmail(validatedData.email, fallbackEmail, validatedData);
    return { success, message: 'フォールバックメール送信完了' };
  } catch (error) {
    return { success: false, message: 'メール送信失敗: ' + error.message };
  }
}

// ==================== メール送信・組み立て ====================

/**
 * 通常のメール送信（添付ファイル付き）フォールバック
 */
function sendEmailWithAttachmentsViaMailApp(recipient, emailContent, attachments) {
  try {
    const blobs = [];
    
    // 添付ファイルをBlobに変換
    attachments.forEach(attachment => {
      const blob = Utilities.newBlob(
        Utilities.base64Decode(attachment.content),
        attachment.mimeType,
        attachment.name
      );
      blobs.push(blob);
    });
    
    // MailAppで送信
    MailApp.sendEmail({
      to: recipient,
      subject: emailContent.subject,
      htmlBody: emailContent.body,
      attachments: blobs
    });
    
    console.log('MailApp経由でメール送信完了（添付ファイル付き）');
    return { success: true, message: 'MailApp送信完了' };
    
  } catch (error) {
    console.error('MailApp送信エラー:', error);
    // 添付ファイルなしで再試行
    return generateAndSendWelcomeEmailFromForm(employeeData);
  }
}

/**
 * 完全なメール組み立て
 */
function assembleCompleteEmail(welcomeEmail, taskList, employeeData) {
  const taskListHtml = formatTaskListAsHtml(taskList);
  
  return {
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
            ${welcomeEmail.body.replace(/\n/g, '<br>')}
        </div>
        
        <div class="task-section">
            <h2>📋 入社準備タスクリスト</h2>
            <p>スムーズな入社のため、以下のタスクをご確認ください：</p>
            ${taskListHtml}
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e8f5e8; border-radius: 8px;">
            <h3>🤝 困った時は遠慮なくご連絡ください</h3>
            <p>ご不明な点やご質問がございましたら、いつでもお気軽にご連絡ください。</p>
            <p><strong>人事部:</strong> ${CONFIG.COMPANY.HR_EMAIL} | 📞 ${CONFIG.COMPANY.HR_PHONE}</p>
        </div>
    </div>
    
    <div class="footer">
        <p>このメールは自動生成されています。返信は人事部が確認いたします。</p>
        <p>© 2024 ${CONFIG.COMPANY.NAME}. All rights reserved.</p>
    </div>
</body>
</html>
    `
  };
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
    MailApp.sendEmail({
      to: recipient,
      subject: emailContent.subject,
      htmlBody: emailContent.html
    });
    
    console.log(`✅ メール送信完了: ${recipient}`);
    return true;
    
  } catch (error) {
    console.error('Gmail送信エラー:', error);
    
    // Gmail API を使用する代替方法
    try {
      GmailApp.sendEmail(
        recipient,
        emailContent.subject,
        '', // プレーンテキスト（空）
        {
          htmlBody: emailContent.html
        }
      );
      
      console.log(`✅ Gmail API経由でメール送信完了: ${recipient}`);
      return true;
      
    } catch (gmailError) {
      console.error('Gmail API送信エラー:', gmailError);
      return false;
    }
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

// ==================== 設定・初期化関数 ====================

/**
 * プロジェクト設定画面用：必要なプロパティリスト表示
 */
function listRequiredProperties() {
  console.log('=== 必要なスクリプトプロパティ一覧 ===');
  console.log('');
  console.log('【必須設定】');
  console.log('OPENAI_API_KEY: OpenAI APIキー（ChatGPT機能を使用する場合）');
  console.log('');
  console.log('【オプション設定】');
  console.log('--- Gmail API用 ---');
  console.log('COMPANY_GUIDE_FILE_ID: 会社案内PDFのファイルID');
  console.log('SALES_GUIDE_FILE_ID: 営業部ガイドのファイルID');
  console.log('DEV_GUIDE_FILE_ID: 開発部ガイドのファイルID');
  console.log('MKT_GUIDE_FILE_ID: マーケティング部ガイドのファイルID');
  console.log('HR_GUIDE_FILE_ID: 人事部ガイドのファイルID');
  console.log('GA_GUIDE_FILE_ID: 総務部ガイドのファイルID');
  console.log('');
  console.log('--- Calendar API用 ---');
  console.log('SALES_CALENDAR_ID: 営業部カレンダーID');
  console.log('DEV_CALENDAR_ID: 開発部カレンダーID');
  console.log('MKT_CALENDAR_ID: マーケティング部カレンダーID');
  console.log('HR_CALENDAR_ID: 人事部カレンダーID');
  console.log('GA_CALENDAR_ID: 総務部カレンダーID');
  console.log('');
  console.log('--- Chat API用 ---');
  console.log('IT_CHAT_WEBHOOK: IT部門ChatのWebhook URL');
  console.log('GA_CHAT_WEBHOOK: 総務部ChatのWebhook URL');
  console.log('');
  console.log('--- Drive API用 ---');
  console.log('EMPLOYEE_ROOT_FOLDER_ID: 従業員フォルダのルートフォルダID');
  console.log('TASK_SHEET_URL: タスク管理シートのURL');
}

// ==================== テスト・デバッグ機能 ====================

/**
 * デバッグ用: 手動テスト関数
 */
function testIntegratedSystem() {
  console.log('=== 統合システム手動テスト ===');
  
  const mockFormData = {
    name: '田中太郎',
    email: 'test@example.com',
    department: '開発部',
    position: 'エンジニア',
    employmentType: '正社員',
    startDate: new Date('2024-07-01'),
    startDateFormatted: '2024年7月1日'
  };
  
  console.log('テスト用フォームデータ:', mockFormData);
  
  try {
    const result = executeIntegratedAutomation(mockFormData);
    console.log('テスト結果:', result);
  } catch (error) {
    console.error('テストエラー:', error);
  }
}

/**
 * APIキー設定状況確認用関数
 */
function checkAPIKeySetup() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (apiKey) {
    console.log('✅ OpenAI APIキーが設定されています');
    console.log('API使用可能: ChatGPT機能が有効です');
    return true;
  } else {
    console.log('❌ OpenAI APIキーが設定されていません');
    console.log('簡易版テンプレートを使用します');
    console.log('');
    console.log('【GPT機能を有効にする手順】');
    console.log('1. Google Apps Script画面で「プロジェクトの設定」をクリック');
    console.log('2. 「スクリプト プロパティ」セクションで「プロパティを追加」');
    console.log('3. プロパティ: OPENAI_API_KEY');
    console.log('4. 値: あなたのOpenAI APIキー');
    console.log('5. 保存');
    return false;
  }
}

/**
 * ChatGPT API テスト用関数
 */
function testChatGPTAPI() {
  console.log('=== ChatGPT API接続テスト ===');
  
  if (!checkAPIKeySetup()) {
    return;
  }
  
  const testPrompt = `
簡単なテストです。
以下の形式で返答してください：

件名: テスト成功
本文: ChatGPT APIの接続が正常に動作しています。
`;
  
  try {
    const response = callChatGPTAPI(testPrompt);
    const result = JSON.parse(response.getContentText());
    
    console.log('✅ ChatGPT API接続成功！');
    console.log('レスポンス:', result.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ ChatGPT API接続失敗:', error);
  }
}

/**
 * テストデータ生成（デモ用）
 */
function generateTestData() {
  const testData = [
    ['2024-01-15 10:30:00', '山田花子', 'yamada.hanako@example.com', '2024-04-01', '開発部', 'システムエンジニア', '正社員'],
    ['2024-01-16 14:45:00', '田中太郎', 'tanaka.taro@example.com', '2024-04-01', '営業部', '営業', '正社員'],
    ['2024-01-17 09:15:00', '佐藤美咲', 'sato.misaki@example.com', '2024-04-15', 'マーケティング部', 'マーケティング', '契約社員']
  ];
  
  const sheet = SpreadsheetApp.getActiveSheet();
  const startRow = sheet.getLastRow() + 1;
  
  sheet.getRange(startRow, 1, testData.length, testData[0].length).setValues(testData);
  
  console.log('テストデータ生成完了');
}

/**
 * API有効化チェック
 */
function checkRequiredAPIs() {
  console.log('=== 必要なAPI有効化チェック ===');
  
  const apis = [
    { name: 'Gmail API', test: () => { try { Gmail.Users.getProfile('me'); return true; } catch { return false; } } },
    { name: 'Calendar API', test: () => { try { Calendar.CalendarList.list(); return true; } catch { return false; } } },
    { name: 'Drive API', test: () => { try { DriveApp.getRootFolder(); return true; } catch { return false; } } }
  ];
  
  apis.forEach(api => {
    const status = api.test() ? '✅ 有効' : '❌ 無効';
    console.log(`${api.name}: ${status}`);
  });
  
  console.log('');
  console.log('【API有効化方法】');
  console.log('1. Apps Script エディタで「サービス」をクリック');
  console.log('2. 必要なAPIを検索して追加');
  console.log('3. 「追加」ボタンをクリック');
}