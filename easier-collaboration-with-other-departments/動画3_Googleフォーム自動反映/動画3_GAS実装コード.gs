/**
 * 動画3: Googleフォーム → スプレッドシート自動反映 + GAS拡張
 * 手動転記からの完全解放
 */

/**
 * フォーム送信時のメイン処理
 * 動画3の核心機能
 */
function onFormSubmit(e) {
  console.log('=== 動画3: フォーム送信処理開始 ===');
  
  try {
    // 送信データの取得と構造化
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
    
    // 処理成功ログ
    logProcessingSuccess(e.range, processedData);
    
    console.log('=== 動画3: 処理完了 ===');
    
  } catch (error) {
    console.error('動画3エラー:', error);
    logProcessingError(e.range, error);
  }
}

/**
 * フォームデータの抽出と構造化
 */
function extractFormData(e) {
  const sheet = e.range.getSheet();
  const row = e.range.getRow();
  const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // フォーム項目の構造化
  const formData = {
    timestamp: values[0],
    name: values[1],
    email: values[2], 
    startDate: values[3],
    department: values[4],
    position: values[5],
    employmentType: values[6],
    rowNumber: row,
    sheet: sheet
  };
  
  return formData;
}

/**
 * 高度なデータバリデーション
 * 動画3の品質管理機能
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
  processed.name = processed.name.trim();
  
  // メールアドレスの正規化
  processed.email = processed.email.trim().toLowerCase();
  
  // 部署名の標準化
  const departmentMapping = {
    '営業': '営業部',
    '開発': '開発部', 
    'エンジニア': '開発部',
    'マーケ': 'マーケティング部',
    'マーケティング': 'マーケティング部',
    '人事': '人事部'
  };
  
  if (departmentMapping[processed.department]) {
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
  
  return processed;
}

/**
 * 拡張情報の自動追加
 * 動画3の付加価値機能
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
  
  // 自動計算された情報を追加
  const lastColumn = sheet.getLastColumn();
  
  try {
    // 新しい列に情報を追加
    sheet.getRange(row, lastColumn + 1).setValue(uniqueId); // 社員ID
    sheet.getRange(row, lastColumn + 2).setValue(managerInfo.name); // 直属上司
    sheet.getRange(row, lastColumn + 3).setValue(managerInfo.email); // 上司メール
    sheet.getRange(row, lastColumn + 4).setValue(onboardingDays); // オンボーディング期間
    sheet.getRange(row, lastColumn + 5).setValue('自動処理完了'); // 処理ステータス
    sheet.getRange(row, lastColumn + 6).setValue(new Date()); // 処理完了時刻
    
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
  
  let count = 0;
  for (let i = 1; i < data.length; i++) { // ヘッダー行をスキップ
    const rowDate = new Date(data[i][3]); // 入社日列
    if (rowDate.getFullYear() === year && 
        rowDate.getMonth() + 1 === parseInt(month) &&
        data[i][4] === department) { // 部署列
      count++;
    }
  }
  
  return count;
}

/**
 * 部署マネージャー情報取得
 */
function getDepartmentManager(department) {
  const managers = {
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
  
  return managers[department] || {
    name: '未設定',
    email: 'hr@company.com'
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
    if (position.includes(key)) {
      return days;
    }
  }
  
  return 7; // デフォルト期間
}

/**
 * バリデーションエラーログ
 */
function logValidationError(range, errors) {
  const sheet = range.getSheet();
  const row = range.getRow();
  const lastColumn = sheet.getLastColumn();
  
  const errorMessage = 'データエラー: ' + errors.join(', ');
  sheet.getRange(row, lastColumn + 1).setValue(errorMessage);
  sheet.getRange(row, lastColumn + 2).setValue(new Date());
  
  // エラー行の背景色を変更
  sheet.getRange(row, 1, 1, lastColumn).setBackground('#ffebee');
  
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
  const lastColumn = sheet.getLastColumn();
  
  sheet.getRange(row, lastColumn + 1).setValue('システムエラー: ' + error.message);
  sheet.getRange(row, lastColumn + 2).setValue(new Date());
  
  // エラー行の背景色を変更
  sheet.getRange(row, 1, 1, lastColumn).setBackground('#ffcdd2');
}

/**
 * ヘッダー行の設定
 * 初回セットアップ用
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