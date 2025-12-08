/**
 * 動画7: Google Chat API統合実装
 * 部署別リマインド通知とタスク管理の自動化
 */

/**
 * 部署別Google Chat通知のメイン実行
 * 動画7の核心：スプレッドシート → Google Chat 自動化
 */
function createTasksAndSendNotifications(employeeData) {
  console.log('=== 動画7: Chat通知 + タスク管理開始 ===');
  
  try {
    // 1. タスク管理シートに追加
    const tasks = createEmployeeTasks(employeeData);
    
    // 2. 部署別通知送信
    const notifications = sendDepartmentNotifications(employeeData, tasks);
    
    // 3. 進捗追跡の設定
    setupProgressTracking(employeeData, tasks);
    
    console.log('=== 動画7: 処理完了 ===');
    return { 
      success: true, 
      tasksCreated: tasks.length,
      notificationsSent: notifications.length 
    };
    
  } catch (error) {
    console.error('動画7エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 社員別タスク自動生成・管理シート追加
 */
function createEmployeeTasks(employeeData) {
  console.log('タスク生成中:', employeeData.name);
  
  const taskSheet = getOrCreateTaskSheet();
  const tasks = generateDepartmentTasks(employeeData);
  
  const createdTasks = [];
  
  tasks.forEach(task => {
    const taskRow = [
      new Date(), // 作成日時
      employeeData.name, // 対象者
      employeeData.department, // 部署
      employeeData.position, // 職種
      task.title, // タスク名
      task.description, // 説明
      task.assignedDept, // 担当部署
      task.assignedPerson, // 担当者
      task.priority, // 優先度
      task.dueDate, // 期限
      '未着手', // ステータス
      '', // 完了日時
      task.category // カテゴリ
    ];
    
    taskSheet.appendRow(taskRow);
    createdTasks.push({...task, row: taskSheet.getLastRow()});
  });
  
  console.log(`✅ タスク${tasks.length}件を生成`);
  return createdTasks;
}

/**
 * 部署別Google Chat通知送信
 */
function sendDepartmentNotifications(employeeData, tasks) {
  console.log('部署別通知送信中');
  
  const notifications = [];
  const departmentTasks = groupTasksByDepartment(tasks);
  
  Object.keys(departmentTasks).forEach(department => {
    const deptTasks = departmentTasks[department];
    const webhookUrl = getDepartmentWebhook(department);
    
    if (webhookUrl && deptTasks.length > 0) {
      try {
        const message = createDepartmentMessage(employeeData, deptTasks, department);
        const result = sendChatMessage(webhookUrl, message);
        
        notifications.push({
          department: department,
          taskCount: deptTasks.length,
          success: result.success,
          timestamp: new Date()
        });
        
        console.log(`📢 ${department}通知送信: ${result.success ? '成功' : '失敗'}`);
        
      } catch (error) {
        console.error(`${department}通知エラー:`, error);
      }
    }
  });
  
  return notifications;
}

/**
 * 部署別タスク生成
 */
function generateDepartmentTasks(employeeData) {
  const baseTasks = [
    // IT部門タスク
    {
      title: 'PC・周辺機器の準備',
      description: `${employeeData.name}さん用のPC、モニター、キーボード、マウスの準備`,
      assignedDept: 'IT部門',
      assignedPerson: 'IT管理者',
      priority: '高',
      dueDate: getDateBefore(employeeData.startDate, 3),
      category: 'ハードウェア'
    },
    {
      title: 'アカウント・権限設定',
      description: '社内システム、メール、VPNアカウントの発行と権限設定',
      assignedDept: 'IT部門', 
      assignedPerson: 'システム管理者',
      priority: '高',
      dueDate: getDateBefore(employeeData.startDate, 2),
      category: 'アカウント'
    },
    {
      title: 'セキュリティ設定・研修',
      description: 'セキュリティポリシー説明とウイルス対策ソフト設定',
      assignedDept: 'IT部門',
      assignedPerson: 'セキュリティ担当',
      priority: '中',
      dueDate: employeeData.startDate,
      category: 'セキュリティ'
    },
    
    // 総務部タスク
    {
      title: '座席・デスクの確保',
      description: `${employeeData.department}エリアでの座席確保と備品準備`,
      assignedDept: '総務部',
      assignedPerson: '総務担当',
      priority: '高',
      dueDate: getDateBefore(employeeData.startDate, 5),
      category: 'オフィス環境'
    },
    {
      title: '名刺・社員証の準備',
      description: '名刺作成、社員証発行、入館カード準備',
      assignedDept: '総務部',
      assignedPerson: '庶務担当',
      priority: '中',
      dueDate: getDateBefore(employeeData.startDate, 1),
      category: '身分証明'
    },
    {
      title: '入社書類の確認・回収',
      description: '雇用契約書、身元保証書等の確認と原本回収',
      assignedDept: '総務部',
      assignedPerson: '労務担当',
      priority: '高',
      dueDate: employeeData.startDate,
      category: '書類管理'
    },
    
    // 人事部タスク
    {
      title: 'オリエンテーション準備',
      description: '会社概要、就業規則、福利厚生の説明資料準備',
      assignedDept: '人事部',
      assignedPerson: '人事担当',
      priority: '中',
      dueDate: getDateBefore(employeeData.startDate, 1),
      category: '研修'
    },
    {
      title: 'ウェルカムランチの手配',
      description: `${employeeData.name}さんの歓迎ランチ会場・参加者調整`,
      assignedDept: '人事部',
      assignedPerson: '人事企画',
      priority: '低',
      dueDate: employeeData.startDate,
      category: '歓迎イベント'
    }
  ];
  
  // 部署固有タスクを追加
  const deptSpecificTasks = getDepartmentSpecificTasks(employeeData);
  
  return [...baseTasks, ...deptSpecificTasks];
}

/**
 * 部署固有タスク生成
 */
function getDepartmentSpecificTasks(employeeData) {
  const deptTasks = {
    '営業部': [
      {
        title: 'CRM・営業システム登録',
        description: 'SalesForce、顧客管理システムのアカウント設定',
        assignedDept: '営業部',
        assignedPerson: '営業マネージャー',
        priority: '高',
        dueDate: employeeData.startDate,
        category: '営業ツール'
      },
      {
        title: '顧客情報共有・引き継ぎ',
        description: '担当予定顧客の情報共有と引き継ぎ準備',
        assignedDept: '営業部',
        assignedPerson: '先輩営業',
        priority: '中',
        dueDate: getDateAfter(employeeData.startDate, 3),
        category: '業務引き継ぎ'
      }
    ],
    '開発部': [
      {
        title: '開発環境セットアップ',
        description: 'GitHub、AWS、開発ツールのアクセス権限設定',
        assignedDept: '開発部',
        assignedPerson: 'テックリード',
        priority: '高', 
        dueDate: employeeData.startDate,
        category: '開発環境'
      },
      {
        title: 'プロジェクト配属・説明',
        description: '参加プロジェクトの決定と技術仕様の説明',
        assignedDept: '開発部',
        assignedPerson: 'プロジェクトマネージャー',
        priority: '中',
        dueDate: getDateAfter(employeeData.startDate, 2),
        category: 'プロジェクト'
      }
    ],
    'マーケティング部': [
      {
        title: 'マーケティングツール登録',
        description: 'HubSpot、Google Analytics等のツールアクセス設定',
        assignedDept: 'マーケティング部',
        assignedPerson: 'マーケティングマネージャー',
        priority: '高',
        dueDate: employeeData.startDate,
        category: 'マーケティングツール'
      }
    ]
  };
  
  return deptTasks[employeeData.department] || [];
}

/**
 * 部署別メッセージ作成
 */
function createDepartmentMessage(employeeData, tasks, department) {
  const taskList = tasks.map(task => 
    `• <b>${task.title}</b>\n  担当: ${task.assignedPerson} | 期限: ${formatDate(task.dueDate)} | 優先度: ${task.priority}`
  ).join('\n\n');
  
  const message = {
    text: `🆕 新入社員準備のお願い`,
    cards: [{
      header: {
        title: `${department}への新入社員準備依頼`,
        subtitle: `${employeeData.name}さん（${employeeData.position}）`,
        imageUrl: 'https://developers.google.com/chat/images/quickstart-app-avatar.png'
      },
      sections: [{
        widgets: [{
          textParagraph: {
            text: `<b>新入社員情報:</b>\n👤 氏名: ${employeeData.name}\n📅 入社日: ${formatDate(employeeData.startDate)}\n🏢 部署: ${employeeData.department}\n💼 職種: ${employeeData.position}\n📧 メール: ${employeeData.email}`
          }
        }]
      }, {
        header: `📋 ${department}担当タスク（${tasks.length}件）`,
        widgets: [{
          textParagraph: {
            text: taskList
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
          }, {
            textButton: {
              text: '人事部に質問',
              onClick: {
                openLink: {
                  url: 'mailto:hr@company.com?subject=新入社員準備について'
                }
              }
            }
          }]
        }]
      }]
    }]
  };
  
  return message;
}

/**
 * Google Chat メッセージ送信
 */
function sendChatMessage(webhookUrl, message) {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(message)
    };
    
    const response = UrlFetchApp.fetch(webhookUrl, options);
    
    if (response.getResponseCode() === 200) {
      console.log('✅ Chat通知送信成功');
      return { success: true, response: response.getContentText() };
    } else {
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
  } catch (error) {
    console.error('Chat送信エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 進捗追跡設定
 */
function setupProgressTracking(employeeData, tasks) {
  console.log('進捗追跡設定中');
  
  try {
    // リマインダートリガー設定
    const reminderDate = getDateBefore(employeeData.startDate, 1);
    
    ScriptApp.newTrigger('sendTaskReminders')
      .timeBased()
      .at(reminderDate)
      .create();
    
    // 完了確認トリガー設定
    const followUpDate = getDateAfter(employeeData.startDate, 3);
    
    ScriptApp.newTrigger('checkTaskCompletion')
      .timeBased()
      .at(followUpDate)
      .create();
    
    console.log('✅ 進捗追跡設定完了');
    
  } catch (error) {
    console.error('進捗追跡設定エラー:', error);
  }
}

/**
 * タスクリマインダー送信
 */
function sendTaskReminders() {
  console.log('タスクリマインダー送信中');
  
  const taskSheet = getOrCreateTaskSheet();
  const data = taskSheet.getDataRange().getValues();
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // 明日が期限のタスクを抽出
  const urgentTasks = data.slice(1).filter(row => {
    const dueDate = new Date(row[9]); // 期限列
    const status = row[10]; // ステータス列
    return dueDate.toDateString() === tomorrow.toDateString() && status !== '完了';
  });
  
  if (urgentTasks.length > 0) {
    const groupedTasks = groupTasksByDepartment(urgentTasks.map(row => ({
      assignedDept: row[6],
      title: row[4],
      assignedPerson: row[7],
      priority: row[8],
      dueDate: row[9]
    })));
    
    Object.keys(groupedTasks).forEach(dept => {
      const webhookUrl = getDepartmentWebhook(dept);
      if (webhookUrl) {
        const reminderMessage = createReminderMessage(groupedTasks[dept], dept);
        sendChatMessage(webhookUrl, reminderMessage);
      }
    });
  }
}

/**
 * タスク完了確認
 */
function checkTaskCompletion() {
  console.log('タスク完了確認中');
  
  const taskSheet = getOrCreateTaskSheet();
  const data = taskSheet.getDataRange().getValues();
  
  // 未完了タスクを確認
  const incompleteTasks = data.slice(1).filter(row => {
    const status = row[10]; // ステータス列
    const dueDate = new Date(row[9]); // 期限列
    return status !== '完了' && dueDate < new Date();
  });
  
  if (incompleteTasks.length > 0) {
    // 人事部に未完了タスク報告
    const hrWebhook = getDepartmentWebhook('人事部');
    if (hrWebhook) {
      const completionReport = createCompletionReport(incompleteTasks);
      sendChatMessage(hrWebhook, completionReport);
    }
  }
}

/**
 * リマインダーメッセージ作成
 */
function createReminderMessage(tasks, department) {
  const taskList = tasks.map(task => 
    `🔥 <b>${task.title}</b> - ${task.assignedPerson}（明日期限）`
  ).join('\n');
  
  return {
    text: `⚠️ 明日期限のタスクリマインダー`,
    cards: [{
      header: {
        title: `${department} - 明日期限タスク`,
        subtitle: `${tasks.length}件のタスクが明日期限です`
      },
      sections: [{
        widgets: [{
          textParagraph: {
            text: taskList
          }
        }]
      }]
    }]
  };
}

/**
 * ユーティリティ関数群
 */
function groupTasksByDepartment(tasks) {
  return tasks.reduce((groups, task) => {
    const dept = task.assignedDept;
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(task);
    return groups;
  }, {});
}

function getDateBefore(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function getDateAfter(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy年MM月dd日');
}

function getDepartmentWebhook(department) {
  const webhooks = {
    'IT部門': PropertiesService.getScriptProperties().getProperty('IT_CHAT_WEBHOOK'),
    '総務部': PropertiesService.getScriptProperties().getProperty('GA_CHAT_WEBHOOK'), 
    '人事部': PropertiesService.getScriptProperties().getProperty('HR_CHAT_WEBHOOK'),
    '営業部': PropertiesService.getScriptProperties().getProperty('SALES_CHAT_WEBHOOK'),
    '開発部': PropertiesService.getScriptProperties().getProperty('DEV_CHAT_WEBHOOK'),
    'マーケティング部': PropertiesService.getScriptProperties().getProperty('MKT_CHAT_WEBHOOK')
  };
  
  return webhooks[department];
}

function getTaskSheetUrl() {
  const spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
}

function getOrCreateTaskSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let taskSheet = spreadsheet.getSheetByName('タスク管理');
  
  if (!taskSheet) {
    taskSheet = spreadsheet.insertSheet('タスク管理');
    taskSheet.getRange(1, 1, 1, 13).setValues([
      ['作成日時', '対象者', '部署', '職種', 'タスク名', '説明', '担当部署', '担当者', '優先度', '期限', 'ステータス', '完了日時', 'カテゴリ']
    ]);
    
    // ヘッダースタイル
    const headerRange = taskSheet.getRange(1, 1, 1, 13);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
  }
  
  return taskSheet;
}