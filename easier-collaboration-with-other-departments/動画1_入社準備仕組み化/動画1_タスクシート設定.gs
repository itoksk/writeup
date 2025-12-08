/**
 * 動画1: タスク管理シート自動作成・設定
 */

/**
 * タスク管理シートの作成と設定
 */
function setupTaskManagementSheet() {
  console.log('📋 タスク管理シート設定開始');
  
  try {
    // 新しいスプレッドシートを作成
    const taskSpreadsheet = SpreadsheetApp.create('新入社員タスク管理シート');
    const taskSheet = taskSpreadsheet.getActiveSheet();
    
    // シート名を変更
    taskSheet.setName('📋 タスク管理');
    
    // ヘッダー行を設定
    const headers = [
      '作成日時',
      '対象者名',
      '部署',
      'タスク名',
      '担当部署',
      '担当者',
      '優先度',
      '期限',
      'ステータス',
      '完了日時',
      'カテゴリ',
      '備考'
    ];
    
    taskSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // ヘッダーのスタイル設定
    const headerRange = taskSheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // 列幅の調整
    taskSheet.setColumnWidth(1, 150); // 作成日時
    taskSheet.setColumnWidth(2, 100); // 対象者名
    taskSheet.setColumnWidth(3, 80);  // 部署
    taskSheet.setColumnWidth(4, 200); // タスク名
    taskSheet.setColumnWidth(5, 80);  // 担当部署
    taskSheet.setColumnWidth(6, 100); // 担当者
    taskSheet.setColumnWidth(7, 60);  // 優先度
    taskSheet.setColumnWidth(8, 100); // 期限
    taskSheet.setColumnWidth(9, 80);  // ステータス
    taskSheet.setColumnWidth(10, 150);// 完了日時
    taskSheet.setColumnWidth(11, 80); // カテゴリ
    taskSheet.setColumnWidth(12, 150);// 備考
    
    // データ検証ルールの設定
    setupDataValidation(taskSheet);
    
    // 条件付き書式の設定
    setupConditionalFormatting(taskSheet);
    
    // スプレッドシートIDを取得
    const sheetId = taskSpreadsheet.getId();
    
    // スクリプトプロパティに保存
    PropertiesService.getScriptProperties().setProperty('TASK_SHEET_ID', sheetId);
    
    console.log('✅ タスク管理シート作成完了');
    console.log(`📋 シートID: ${sheetId}`);
    console.log(`🔗 URL: ${taskSpreadsheet.getUrl()}`);
    
    return {
      success: true,
      sheetId: sheetId,
      url: taskSpreadsheet.getUrl()
    };
    
  } catch (error) {
    console.error('❌ タスクシート設定エラー:', error);
    return { success: false, error: error.message };
  }
}

/**
 * データ検証ルールの設定
 */
function setupDataValidation(sheet) {
  // G列（優先度）の検証ルール
  const priorityRange = sheet.getRange('G2:G1000');
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['高', '中', '低'])
    .setAllowInvalid(false)
    .build();
  priorityRange.setDataValidation(priorityRule);
  
  // I列（ステータス）の検証ルール
  const statusRange = sheet.getRange('I2:I1000');
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['未着手', '進行中', '完了', '保留'])
    .setAllowInvalid(false)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // E列（担当部署）の検証ルール
  const deptRange = sheet.getRange('E2:E1000');
  const deptRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['IT部門', '総務部', '人事部', '営業部', '開発部', 'マーケティング部'])
    .setAllowInvalid(false)
    .build();
  deptRange.setDataValidation(deptRule);
}

/**
 * 条件付き書式の設定
 */
function setupConditionalFormatting(sheet) {
  // 優先度「高」の行を赤背景
  const highPriorityRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('高')
    .setBackground('#ffebee')
    .setRanges([sheet.getRange('G2:G1000')])
    .build();
  
  // ステータス「完了」の行を緑背景
  const completedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('完了')
    .setBackground('#e8f5e8')
    .setRanges([sheet.getRange('I2:I1000')])
    .build();
  
  // 期限切れの行を警告色
  const overdueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenDateBefore(new Date())
    .setBackground('#fff3cd')
    .setRanges([sheet.getRange('H2:H1000')])
    .build();
  
  const rules = sheet.getConditionalFormatRules();
  rules.push(highPriorityRule, completedRule, overdueRule);
  sheet.setConditionalFormatRules(rules);
}

/**
 * タスク管理シートにデータを追加する関数
 */
function addTaskToSheet(employeeData) {
  const properties = PropertiesService.getScriptProperties();
  const taskSheetId = properties.getProperty('TASK_SHEET_ID');
  
  if (!taskSheetId) {
    console.error('❌ TASK_SHEET_ID が設定されていません');
    return false;
  }
  
  try {
    const taskSpreadsheet = SpreadsheetApp.openById(taskSheetId);
    const taskSheet = taskSpreadsheet.getActiveSheet();
    
    // 基本タスクを生成
    const tasks = generateBasicTasks(employeeData);
    
    // 各タスクをシートに追加
    tasks.forEach(task => {
      taskSheet.appendRow([
        new Date(), // 作成日時
        employeeData.name, // 対象者名
        employeeData.department, // 部署
        task.title, // タスク名
        task.assignedDept, // 担当部署
        task.assignedPerson, // 担当者
        task.priority, // 優先度
        task.dueDate, // 期限
        '未着手', // ステータス
        '', // 完了日時
        task.category, // カテゴリ
        `${employeeData.name}様の入社準備` // 備考
      ]);
    });
    
    console.log(`✅ タスク${tasks.length}件をシートに追加`);
    return true;
    
  } catch (error) {
    console.error('❌ タスク追加エラー:', error);
    return false;
  }
}

/**
 * 基本タスクを生成
 */
function generateBasicTasks(employeeData) {
  const startDate = new Date(employeeData.startDate);
  
  return [
    {
      title: 'PC・周辺機器の準備',
      assignedDept: 'IT部門',
      assignedPerson: 'IT管理者',
      priority: '高',
      dueDate: new Date(startDate.getTime() - 3 * 24 * 60 * 60 * 1000), // 3日前
      category: 'ハードウェア'
    },
    {
      title: 'アカウント・権限設定',
      assignedDept: 'IT部門',
      assignedPerson: 'システム管理者',
      priority: '高',
      dueDate: new Date(startDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2日前
      category: 'システム'
    },
    {
      title: '座席・デスクの確保',
      assignedDept: '総務部',
      assignedPerson: '総務担当',
      priority: '高',
      dueDate: new Date(startDate.getTime() - 5 * 24 * 60 * 60 * 1000), // 5日前
      category: 'オフィス環境'
    },
    {
      title: '名刺・社員証の準備',
      assignedDept: '総務部',
      assignedPerson: '庶務担当',
      priority: '中',
      dueDate: new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      category: '身分証明'
    },
    {
      title: 'ウェルカムランチ予約',
      assignedDept: '人事部',
      assignedPerson: '人事担当',
      priority: '低',
      dueDate: new Date(startDate.getTime() - 1 * 24 * 60 * 60 * 1000), // 1日前
      category: 'イベント'
    }
  ];
}

/**
 * タスクシートURLを取得
 */
function getTaskSheetUrl() {
  const properties = PropertiesService.getScriptProperties();
  const taskSheetId = properties.getProperty('TASK_SHEET_ID');
  
  if (taskSheetId) {
    return `https://docs.google.com/spreadsheets/d/${taskSheetId}/edit`;
  }
  
  return null;
}

/**
 * 設定確認用関数
 */
function checkSetupStatus() {
  const properties = PropertiesService.getScriptProperties();
  
  console.log('🔍 設定状況確認:');
  console.log(`OPENAI_API_KEY: ${properties.getProperty('OPENAI_API_KEY') ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`IT_CHAT_WEBHOOK: ${properties.getProperty('IT_CHAT_WEBHOOK') ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`GENERAL_AFFAIRS_CHAT_WEBHOOK: ${properties.getProperty('GENERAL_AFFAIRS_CHAT_WEBHOOK') ? '✅ 設定済み' : '❌ 未設定'}`);
  console.log(`TASK_SHEET_ID: ${properties.getProperty('TASK_SHEET_ID') ? '✅ 設定済み' : '❌ 未設定'}`);
  
  // タスクシートの存在確認
  const taskSheetId = properties.getProperty('TASK_SHEET_ID');
  if (taskSheetId) {
    try {
      const taskSpreadsheet = SpreadsheetApp.openById(taskSheetId);
      console.log(`📋 タスクシート: ✅ アクセス可能 - ${taskSpreadsheet.getName()}`);
    } catch (error) {
      console.log('📋 タスクシート: ❌ アクセス不可');
    }
  }
}