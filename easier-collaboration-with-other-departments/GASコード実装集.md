# Google Apps Script 実装コード集

## 🎯 デモ用実装コード（動画で実際に使用）

### **動画3: フォーム送信トリガー**

```javascript
/**
 * Googleフォーム送信時の自動処理
 * 動画3で実演するコード
 */
function onFormSubmit(e) {
  console.log('フォーム送信を検知しました');
  
  try {
    // 送信されたデータを取得
    const sheet = e.range.getSheet();
    const row = e.range.getRow();
    const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // データの構造化
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
    
    // データバリデーション
    if (validateEmployeeData(employeeData)) {
      // 成功ログ
      sheet.getRange(row, sheet.getLastColumn() + 1).setValue('処理完了: ' + new Date());
      
      // 次のステップトリガー（動画4で使用）
      // generateWelcomeEmail(employeeData);
    } else {
      // エラーログ
      sheet.getRange(row, sheet.getLastColumn() + 1).setValue('エラー: データ不正');
    }
    
  } catch (error) {
    console.error('処理エラー:', error);
  }
}

/**
 * データバリデーション関数
 */
function validateEmployeeData(data) {
  // 必須フィールドチェック
  if (!data.name || !data.email || !data.startDate) {
    console.log('必須項目が不足しています');
    return false;
  }
  
  // メールアドレス形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.log('メールアドレス形式が正しくありません');
    return false;
  }
  
  // 入社日チェック（未来日であること）
  const startDate = new Date(data.startDate);
  const today = new Date();
  if (startDate <= today) {
    console.log('入社日は未来の日付である必要があります');
    return false;
  }
  
  return true;
}
```

### **動画4: ChatGPT API連携**

```javascript
/**
 * ChatGPT APIを使った個別メール生成
 * 動画4で実演するコード
 */
function generateWelcomeEmail(employeeData) {
  console.log('歓迎メール生成を開始:', employeeData.name);
  
  try {
    // ChatGPT用プロンプト構築
    const prompt = createPersonalizedPrompt(employeeData);
    
    // ChatGPT API呼び出し
    const emailContent = callChatGPTAPI(prompt);
    
    // 生成されたメール内容を解析
    const parsedContent = parseEmailContent(emailContent);
    
    // スプレッドシートに結果を記録
    saveGeneratedContent(employeeData, parsedContent);
    
    // デモ用：コンソールに出力
    console.log('生成されたメール:', parsedContent);
    
    return parsedContent;
    
  } catch (error) {
    console.error('メール生成エラー:', error);
    throw error;
  }
}

/**
 * 個別化プロンプト作成
 */
function createPersonalizedPrompt(employeeData) {
  const prompt = `
あなたはライトアップ株式会社の優秀な人事担当者です。
以下の内定者情報に基づき、温かみのある歓迎メールを作成してください。

#内定者情報
・氏名：${employeeData.name}
・職種：${employeeData.position}
・入社日：${employeeData.startDate}
・配属部署：${employeeData.department}
・雇用形態：${employeeData.employmentType}

#制約条件
・メールは300字程度
・絵文字は使用しない
・職種に応じた具体的な内容を含める
・親しみやすくも丁寧な表現を心がける

#出力形式
【件名】
40字以内で作成

【本文】
挨拶→お祝い→入社日確認→準備事項→締めの流れ

【提出書類リスト】
・番号付きリスト形式
・職種に応じた必要書類

【部署別準備事項】
・配属部署特有の準備内容
・初回オリエンテーション情報
`;

  return prompt;
}

/**
 * ChatGPT API呼び出し
 */
function callChatGPTAPI(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI APIキーが設定されていません');
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const payload = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'あなたは優秀な人事担当者として、親しみやすく丁寧な文章を作成します。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.7
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
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      throw new Error(`ChatGPT API エラー: ${data.error.message}`);
    }
    
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
}

/**
 * 生成されたメール内容を解析
 */
function parseEmailContent(content) {
  const sections = {
    subject: '',
    body: '',
    documents: '',
    preparation: ''
  };
  
  // 件名を抽出
  const subjectMatch = content.match(/【件名】\s*([^\n]+)/);
  if (subjectMatch) {
    sections.subject = subjectMatch[1].trim();
  }
  
  // 本文を抽出
  const bodyMatch = content.match(/【本文】\s*([\s\S]*?)(?=【|$)/);
  if (bodyMatch) {
    sections.body = bodyMatch[1].trim();
  }
  
  // 提出書類リストを抽出
  const documentsMatch = content.match(/【提出書類リスト】\s*([\s\S]*?)(?=【|$)/);
  if (documentsMatch) {
    sections.documents = documentsMatch[1].trim();
  }
  
  // 部署別準備事項を抽出
  const preparationMatch = content.match(/【部署別準備事項】\s*([\s\S]*?)(?=【|$)/);
  if (preparationMatch) {
    sections.preparation = preparationMatch[1].trim();
  }
  
  return sections;
}

/**
 * 生成内容をスプレッドシートに保存
 */
function saveGeneratedContent(employeeData, content) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('生成メール') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('生成メール');
  
  // ヘッダーがない場合は追加
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['日時', '氏名', '件名', '本文', '書類リスト', '準備事項']);
  }
  
  sheet.appendRow([
    new Date(),
    employeeData.name,
    content.subject,
    content.body,
    content.documents,
    content.preparation
  ]);
}
```

### **動画5: Webアプリ開発**

```javascript
/**
 * Code.gs - メインアプリケーションロジック
 * 動画5で実演するコード
 */

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('人事専用AIアシスタント')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * HTMLファイルをインクルード
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Webアプリからの歓迎メッセージ生成
 */
function generateWelcomeMessageFromWeb(name, position, startDate, department) {
  console.log('Webアプリからメッセージ生成要求:', { name, position, startDate, department });
  
  try {
    const employeeData = {
      name: name,
      position: position,
      startDate: startDate,
      department: department,
      email: '', // Webアプリでは省略
      employmentType: '正社員' // デフォルト値
    };
    
    // バリデーション
    if (!name || !position || !startDate) {
      throw new Error('必須項目が入力されていません');
    }
    
    // プロンプト作成
    const prompt = createPersonalizedPrompt(employeeData);
    
    // ChatGPT API呼び出し
    const content = callChatGPTAPI(prompt);
    
    // 結果をログに保存
    logWebAppUsage(employeeData, content);
    
    return {
      success: true,
      content: content
    };
    
  } catch (error) {
    console.error('Webアプリメール生成エラー:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Webアプリ使用ログ
 */
function logWebAppUsage(employeeData, content) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Webアプリログ') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('Webアプリログ');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['使用日時', '氏名', '職種', '入社日', '部署', '生成内容(抜粋)']);
  }
  
  sheet.appendRow([
    new Date(),
    employeeData.name,
    employeeData.position,
    employeeData.startDate,
    employeeData.department,
    content.substring(0, 100) + '...'
  ]);
}
```

```html
<!-- index.html - Webアプリのフロントエンド -->
<!DOCTYPE html>
<html>
  <head>
    <base target="_top">
    <meta charset="utf-8">
    <title>人事専用AIアシスタント</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      
      .container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      
      h1 {
        color: #2c3e50;
        text-align: center;
        margin-bottom: 30px;
      }
      
      .form-group {
        margin-bottom: 20px;
      }
      
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #34495e;
      }
      
      input, select {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        box-sizing: border-box;
      }
      
      .btn {
        background: #3498db;
        color: white;
        padding: 12px 30px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
      }
      
      .btn:hover {
        background: #2980b9;
      }
      
      .btn:disabled {
        background: #bdc3c7;
        cursor: not-allowed;
      }
      
      .result {
        margin-top: 30px;
        padding: 20px;
        background: #ecf0f1;
        border-radius: 5px;
        white-space: pre-wrap;
        display: none;
      }
      
      .error {
        background: #e74c3c;
        color: white;
      }
      
      .loading {
        text-align: center;
        color: #7f8c8d;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>🤖 人事専用AIアシスタント</h1>
      
      <form id="messageForm" onsubmit="generateMessage(); return false;">
        <div class="form-group">
          <label for="name">内定者氏名 *</label>
          <input type="text" id="name" placeholder="山田太郎" required>
        </div>
        
        <div class="form-group">
          <label for="position">職種 *</label>
          <select id="position" required>
            <option value="">選択してください</option>
            <option value="営業">営業</option>
            <option value="エンジニア">エンジニア</option>
            <option value="マーケター">マーケター</option>
            <option value="人事">人事</option>
            <option value="経理">経理</option>
            <option value="総務">総務</option>
            <option value="その他">その他</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="startDate">入社予定日 *</label>
          <input type="date" id="startDate" required>
        </div>
        
        <div class="form-group">
          <label for="department">配属部署 *</label>
          <select id="department" required>
            <option value="">選択してください</option>
            <option value="営業部">営業部</option>
            <option value="開発部">開発部</option>
            <option value="マーケティング部">マーケティング部</option>
            <option value="人事部">人事部</option>
            <option value="経理部">経理部</option>
            <option value="総務部">総務部</option>
          </select>
        </div>
        
        <button type="submit" class="btn" id="generateBtn">
          歓迎メッセージを生成
        </button>
      </form>
      
      <div id="result" class="result"></div>
    </div>

    <script>
      function generateMessage() {
        const name = document.getElementById('name').value;
        const position = document.getElementById('position').value;
        const startDate = document.getElementById('startDate').value;
        const department = document.getElementById('department').value;
        
        // UI状態変更
        const btn = document.getElementById('generateBtn');
        const result = document.getElementById('result');
        
        btn.disabled = true;
        btn.textContent = '生成中...';
        result.style.display = 'block';
        result.className = 'result loading';
        result.textContent = 'AI が歓迎メッセージを生成しています...\nしばらくお待ちください（30秒程度）';
        
        // Google Apps Script関数を呼び出し
        google.script.run
          .withSuccessHandler(displayResult)
          .withFailureHandler(displayError)
          .generateWelcomeMessageFromWeb(name, position, startDate, department);
      }
      
      function displayResult(response) {
        const result = document.getElementById('result');
        const btn = document.getElementById('generateBtn');
        
        if (response.success) {
          result.className = 'result';
          result.textContent = response.content;
        } else {
          result.className = 'result error';
          result.textContent = 'エラー: ' + response.error;
        }
        
        // UI状態を元に戻す
        btn.disabled = false;
        btn.textContent = '歓迎メッセージを生成';
      }
      
      function displayError(error) {
        const result = document.getElementById('result');
        const btn = document.getElementById('generateBtn');
        
        result.className = 'result error';
        result.textContent = 'システムエラーが発生しました: ' + error.message;
        
        // UI状態を元に戻す
        btn.disabled = false;
        btn.textContent = '歓迎メッセージを生成';
      }
      
      // 入社日のデフォルト値を来月に設定
      window.onload = function() {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        document.getElementById('startDate').value = nextMonth.toISOString().split('T')[0];
      };
    </script>
  </body>
</html>
```

### **動画6: Gmail & Calendar API連携**

```javascript
/**
 * Gmail & Calendar API連携
 * 動画6で実演するコード
 */

/**
 * 自動メール送信（Gmail API使用）
 */
function sendWelcomeEmail(employeeData, emailContent) {
  console.log('歓迎メール送信開始:', employeeData.name);
  
  try {
    // メール本文をHTML形式で構築
    const htmlBody = createHtmlEmailBody(employeeData, emailContent);
    
    // Gmail APIでメール送信
    const message = {
      to: employeeData.email,
      subject: emailContent.subject,
      htmlBody: htmlBody,
      cc: 'hr@company.com' // 人事部にもCC送信
    };
    
    const messageId = sendGmailMessage(message);
    
    // 送信ログを記録
    logEmailSent(employeeData, messageId);
    
    console.log('メール送信完了:', messageId);
    return messageId;
    
  } catch (error) {
    console.error('メール送信エラー:', error);
    throw error;
  }
}

/**
 * HTMLメール本文作成
 */
function createHtmlEmailBody(employeeData, emailContent) {
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            ライトアップ株式会社
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${emailContent.body.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #27ae60;">📋 提出書類リスト</h3>
            <div style="background: #e8f5e8; padding: 15px; border-radius: 5px;">
              ${emailContent.documents.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #e74c3c;">🎯 ${employeeData.department} 特有の準備事項</h3>
            <div style="background: #ffebee; padding: 15px; border-radius: 5px;">
              ${emailContent.preparation.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #ecf0f1; border-radius: 5px;">
            <p style="margin: 0; color: #7f8c8d;">
              このメールに関するご質問は、人事部までお気軽にお問い合わせください。<br>
              📧 hr@company.com | 📞 03-1234-5678
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
  
  return html;
}

/**
 * Gmail API経由でメール送信
 */
function sendGmailMessage(message) {
  try {
    // メールのraw形式を作成
    const email = [
      `To: ${message.to}`,
      `Cc: ${message.cc}`,
      `Subject: ${message.subject}`,
      `Content-Type: text/html; charset=utf-8`,
      '',
      message.htmlBody
    ].join('\n');
    
    const base64Email = Utilities.base64Encode(email);
    
    // Gmail API呼び出し
    const response = Gmail.Users.Messages.send({
      userId: 'me',
      resource: {
        raw: base64Email
      }
    });
    
    return response.id;
    
  } catch (error) {
    console.error('Gmail API エラー:', error);
    throw error;
  }
}

/**
 * カレンダーイベント作成
 */
function createWelcomeEvent(employeeData) {
  console.log('カレンダーイベント作成:', employeeData.name);
  
  try {
    const startDate = new Date(employeeData.startDate);
    
    // ウェルカムランチの予定（入社日12:00-13:00）
    const lunchEvent = {
      summary: `【祝】${employeeData.name}さんウェルカムランチ`,
      description: `新入社員 ${employeeData.name}さん（${employeeData.department}配属）のウェルカムランチです。`,
      start: {
        dateTime: formatDateForCalendar(startDate, 12, 0),
        timeZone: 'Asia/Tokyo'
      },
      end: {
        dateTime: formatDateForCalendar(startDate, 13, 0),
        timeZone: 'Asia/Tokyo'
      },
      attendees: [
        {email: employeeData.email, displayName: employeeData.name},
        {email: 'hr@company.com', displayName: '人事部'},
        {email: getManagerEmail(employeeData.department), displayName: '部署責任者'}
      ],
      location: '社員食堂',
      reminders: {
        useDefault: false,
        overrides: [
          {method: 'email', minutes: 24 * 60}, // 1日前
          {method: 'popup', minutes: 30}       // 30分前
        ]
      }
    };
    
    // カレンダーにイベント作成
    const event = Calendar.Events.insert(lunchEvent, 'primary');
    
    console.log('カレンダーイベント作成完了:', event.id);
    return event.id;
    
  } catch (error) {
    console.error('カレンダーイベント作成エラー:', error);
    throw error;
  }
}

/**
 * 日付をカレンダー用にフォーマット
 */
function formatDateForCalendar(date, hour, minute) {
  const eventDate = new Date(date);
  eventDate.setHours(hour, minute, 0, 0);
  return eventDate.toISOString();
}

/**
 * 部署責任者のメールアドレス取得
 */
function getManagerEmail(department) {
  const managers = {
    '営業部': 'sales-manager@company.com',
    '開発部': 'dev-manager@company.com',
    'マーケティング部': 'marketing-manager@company.com',
    '人事部': 'hr-manager@company.com',
    '経理部': 'accounting-manager@company.com',
    '総務部': 'admin-manager@company.com'
  };
  
  return managers[department] || 'hr@company.com';
}

/**
 * メール送信ログ記録
 */
function logEmailSent(employeeData, messageId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('メール送信ログ') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('メール送信ログ');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['送信日時', '氏名', '宛先', 'Gmail Message ID', 'ステータス']);
  }
  
  sheet.appendRow([
    new Date(),
    employeeData.name,
    employeeData.email,
    messageId,
    '送信完了'
  ]);
}
```

### **動画7: Google Chat通知システム**

```javascript
/**
 * Google Chat通知システム
 * 動画7で実演するコード
 */

/**
 * 新入社員タスクを作成してチーム通知
 */
function createTasksAndNotify(employeeData) {
  console.log('タスク作成＆通知開始:', employeeData.name);
  
  try {
    // 1. タスクリストを生成
    const tasks = generateEmployeeTasks(employeeData);
    
    // 2. スプレッドシートにタスクを記録
    const taskIds = saveTasks(tasks);
    
    // 3. 部署別にGoogle Chat通知
    notifyDepartments(employeeData, tasks);
    
    console.log('タスク作成＆通知完了');
    return { tasks, taskIds };
    
  } catch (error) {
    console.error('タスク作成＆通知エラー:', error);
    throw error;
  }
}

/**
 * 社員タスクリスト生成
 */
function generateEmployeeTasks(employeeData) {
  const startDate = new Date(employeeData.startDate);
  const threeDaysBefore = new Date(startDate.getTime() - (3 * 24 * 60 * 60 * 1000));
  const oneWeekBefore = new Date(startDate.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  const baseTasks = [
    {
      title: 'PC・アカウント準備',
      department: 'IT部門',
      dueDate: oneWeekBefore,
      priority: '高',
      description: `${employeeData.name}さん用のPC設定とアカウント作成`,
      status: '未着手'
    },
    {
      title: '座席・備品準備',
      department: '総務部',
      dueDate: threeDaysBefore,
      priority: '中',
      description: `${employeeData.name}さんの座席確保と備品準備`,
      status: '未着手'
    },
    {
      title: '入社書類確認',
      department: '人事部',
      dueDate: threeDaysBefore,
      priority: '高',
      description: `${employeeData.name}さんの提出書類確認と不備チェック`,
      status: '未着手'
    }
  ];
  
  // 職種特有のタスクを追加
  const positionSpecificTasks = getPositionSpecificTasks(employeeData);
  
  return [...baseTasks, ...positionSpecificTasks];
}

/**
 * 職種別特有タスク
 */
function getPositionSpecificTasks(employeeData) {
  const startDate = new Date(employeeData.startDate);
  const oneDayBefore = new Date(startDate.getTime() - (1 * 24 * 60 * 60 * 1000));
  
  const specificTasks = {
    '営業': [
      {
        title: '営業システムアカウント作成',
        department: 'IT部門',
        dueDate: oneDayBefore,
        priority: '高',
        description: 'CRM、SFAシステムへのアクセス権設定',
        status: '未着手'
      },
      {
        title: '営業資料準備',
        department: '営業部',
        dueDate: oneDayBefore,
        priority: '中',
        description: '製品カタログ、名刺、営業ツール準備',
        status: '未着手'
      }
    ],
    'エンジニア': [
      {
        title: '開発環境構築',
        department: 'IT部門',
        dueDate: oneDayBefore,
        priority: '高',
        description: 'GitHub、開発ツール、テスト環境アクセス',
        status: '未着手'
      },
      {
        title: 'コーディング規約説明',
        department: '開発部',
        dueDate: startDate,
        priority: '中',
        description: 'プロジェクト概要とコーディング規約説明',
        status: '未着手'
      }
    ]
  };
  
  return specificTasks[employeeData.position] || [];
}

/**
 * タスクをスプレッドシートに保存
 */
function saveTasks(tasks) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('タスク管理') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('タスク管理');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', '作成日時', 'タスク名', '担当部署', '期日', '優先度', '説明', 'ステータス', '完了日時']);
  }
  
  const taskIds = [];
  
  tasks.forEach(task => {
    const taskId = 'TASK_' + Utilities.getUuid().substr(0, 8);
    sheet.appendRow([
      taskId,
      new Date(),
      task.title,
      task.department,
      task.dueDate,
      task.priority,
      task.description,
      task.status,
      '' // 完了日時は空
    ]);
    taskIds.push(taskId);
  });
  
  return taskIds;
}

/**
 * 部署別Google Chat通知
 */
function notifyDepartments(employeeData, tasks) {
  // 部署別にタスクをグループ化
  const tasksByDepartment = {};
  
  tasks.forEach(task => {
    if (!tasksByDepartment[task.department]) {
      tasksByDepartment[task.department] = [];
    }
    tasksByDepartment[task.department].push(task);
  });
  
  // 各部署に通知送信
  Object.keys(tasksByDepartment).forEach(department => {
    sendChatNotification(department, employeeData, tasksByDepartment[department]);
  });
}

/**
 * Google Chat Webhook通知
 */
function sendChatNotification(department, employeeData, tasks) {
  const webhooks = {
    'IT部門': PropertiesService.getScriptProperties().getProperty('IT_CHAT_WEBHOOK'),
    '総務部': PropertiesService.getScriptProperties().getProperty('ADMIN_CHAT_WEBHOOK'),
    '人事部': PropertiesService.getScriptProperties().getProperty('HR_CHAT_WEBHOOK'),
    '営業部': PropertiesService.getScriptProperties().getProperty('SALES_CHAT_WEBHOOK'),
    '開発部': PropertiesService.getScriptProperties().getProperty('DEV_CHAT_WEBHOOK')
  };
  
  const webhookUrl = webhooks[department];
  if (!webhookUrl) {
    console.log(`${department}のWebhook URLが設定されていません`);
    return;
  }
  
  // Google Chat用メッセージ作成
  const message = createChatMessage(department, employeeData, tasks);
  
  try {
    const response = UrlFetchApp.fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(message)
    });
    
    console.log(`${department}への通知送信完了`);
    
  } catch (error) {
    console.error(`${department}への通知送信エラー:`, error);
  }
}

/**
 * Google Chat用メッセージ構築
 */
function createChatMessage(department, employeeData, tasks) {
  const taskList = tasks.map(task => {
    const priorityIcon = task.priority === '高' ? '🔴' : task.priority === '中' ? '🟡' : '🟢';
    const dueDateStr = Utilities.formatDate(task.dueDate, 'Asia/Tokyo', 'MM/dd');
    return `${priorityIcon} ${task.title} (期日: ${dueDateStr})`;
  }).join('\n');
  
  const message = {
    text: `🆕 **新入社員対応タスクのお知らせ**`,
    cards: [{
      header: {
        title: `${employeeData.name}さん 入社準備タスク`,
        subtitle: `${department} 担当分`,
        imageUrl: 'https://developers.google.com/chat/images/quickstart-app-avatar.png'
      },
      sections: [{
        widgets: [
          {
            keyValue: {
              topLabel: '新入社員情報',
              content: `氏名: ${employeeData.name}\n職種: ${employeeData.position}\n入社日: ${Utilities.formatDate(new Date(employeeData.startDate), 'Asia/Tokyo', 'yyyy/MM/dd')}\n配属: ${employeeData.department}`
            }
          },
          {
            keyValue: {
              topLabel: `${department} 担当タスク`,
              content: taskList
            }
          }
        ]
      }],
      actions: [{
        actionMethodName: 'viewTaskDetails',
        parameters: [{
          key: 'employee',
          value: employeeData.name
        }]
      }]
    }]
  };
  
  return message;
}
```

### **動画8: 時間ベーストリガー**

```javascript
/**
 * 時間ベース自動化システム
 * 動画8で実演するコード
 */

/**
 * 毎日の自動チェック設定
 */
function setupDailyTriggers() {
  console.log('毎日の自動トリガー設定開始');
  
  // 既存のトリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyEmployeeCheck') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // 新しいトリガーを設定（毎日朝9時）
  ScriptApp.newTrigger('dailyEmployeeCheck')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
    
  console.log('毎日9時の自動チェックトリガーを設定しました');
  
  // 週次トリガーも設定（毎週金曜17時）
  ScriptApp.newTrigger('weeklyProgressCheck')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(17)
    .create();
    
  console.log('毎週金曜17時の進捗チェックトリガーを設定しました');
}

/**
 * 毎日の入社日チェック
 */
function dailyEmployeeCheck() {
  console.log('毎日の入社日チェック開始:', new Date());
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('内定者情報');
    if (!sheet) {
      console.log('内定者情報シートが見つかりません');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    const header = data[0];
    const employees = data.slice(1);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 各種チェック実行
    employees.forEach((row, index) => {
      const employee = parseEmployeeRow(header, row);
      if (!employee.startDate) return;
      
      const startDate = new Date(employee.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));
      
      // 入社3日前チェック
      if (daysDiff === 3) {
        handle3DaysBefore(employee);
      }
      
      // 入社1週間前チェック
      if (daysDiff === 7) {
        handle1WeekBefore(employee);
      }
      
      // 入社当日チェック
      if (daysDiff === 0) {
        handleStartDay(employee);
      }
      
      // 入社1週間後チェック
      if (daysDiff === -7) {
        handle1WeekAfter(employee);
      }
    });
    
    console.log('毎日の入社日チェック完了');
    
  } catch (error) {
    console.error('毎日チェックエラー:', error);
    sendErrorNotification('毎日チェック', error);
  }
}

/**
 * 入社3日前の処理
 */
function handle3DaysBefore(employee) {
  console.log(`入社3日前処理: ${employee.name}`);
  
  try {
    // 1. ウェルカムランチ予定作成
    createWelcomeLunchEvent(employee);
    
    // 2. 最終確認メール送信
    sendFinalConfirmationEmail(employee);
    
    // 3. 部署への準備完了確認
    sendDepartmentPreparationCheck(employee);
    
    // 4. ログ記録
    logAutomationEvent('入社3日前処理', employee.name, '完了');
    
  } catch (error) {
    console.error(`入社3日前処理エラー(${employee.name}):`, error);
    logAutomationEvent('入社3日前処理', employee.name, `エラー: ${error.message}`);
  }
}

/**
 * 入社1週間前の処理
 */
function handle1WeekBefore(employee) {
  console.log(`入社1週間前処理: ${employee.name}`);
  
  try {
    // 1. IT部門への準備依頼
    sendITPreparationRequest(employee);
    
    // 2. 総務部への備品準備依頼
    sendAdminPreparationRequest(employee);
    
    // 3. オリエンテーション予定作成
    createOrientationEvent(employee);
    
    logAutomationEvent('入社1週間前処理', employee.name, '完了');
    
  } catch (error) {
    console.error(`入社1週間前処理エラー(${employee.name}):`, error);
    logAutomationEvent('入社1週間前処理', employee.name, `エラー: ${error.message}`);
  }
}

/**
 * 入社当日の処理
 */
function handleStartDay(employee) {
  console.log(`入社当日処理: ${employee.name}`);
  
  try {
    // 1. 歓迎メッセージ送信
    sendWelcomeMessage(employee);
    
    // 2. 1週間後フォローアップ予定作成
    createFollowUpEvent(employee);
    
    // 3. 人事部に入社通知
    notifyHROfArrival(employee);
    
    logAutomationEvent('入社当日処理', employee.name, '完了');
    
  } catch (error) {
    console.error(`入社当日処理エラー(${employee.name}):`, error);
    logAutomationEvent('入社当日処理', employee.name, `エラー: ${error.message}`);
  }
}

/**
 * 入社1週間後の処理
 */
function handle1WeekAfter(employee) {
  console.log(`入社1週間後処理: ${employee.name}`);
  
  try {
    // 1. フォローアップメール送信
    sendFollowUpEmail(employee);
    
    // 2. 上長に進捗確認依頼
    requestManagerCheckIn(employee);
    
    // 3. 1ヶ月後面談予定作成
    createOneMonthInterviewEvent(employee);
    
    logAutomationEvent('入社1週間後処理', employee.name, '完了');
    
  } catch (error) {
    console.error(`入社1週間後処理エラー(${employee.name}):`, error);
    logAutomationEvent('入社1週間後処理', employee.name, `エラー: ${error.message}`);
  }
}

/**
 * ウェルカムランチイベント作成
 */
function createWelcomeLunchEvent(employee) {
  const startDate = new Date(employee.startDate);
  
  const event = {
    summary: `【祝】${employee.name}さんウェルカムランチ 🎉`,
    description: `新入社員 ${employee.name}さん（${employee.department}・${employee.position}）のウェルカムランチです。\n\n温かくお迎えしましょう！`,
    start: {
      dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 12, 0).toISOString(),
      timeZone: 'Asia/Tokyo'
    },
    end: {
      dateTime: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 13, 0).toISOString(),
      timeZone: 'Asia/Tokyo'
    },
    attendees: [
      {email: employee.email, displayName: employee.name},
      {email: 'hr@company.com', displayName: '人事部'},
      {email: getManagerEmail(employee.department), displayName: '部署責任者'}
    ],
    location: '社員食堂',
    reminders: {
      useDefault: false,
      overrides: [
        {method: 'email', minutes: 24 * 60},
        {method: 'popup', minutes: 15}
      ]
    }
  };
  
  const createdEvent = Calendar.Events.insert(event, 'primary');
  console.log(`ウェルカムランチ予定作成完了: ${createdEvent.id}`);
  
  return createdEvent.id;
}

/**
 * 週次進捗チェック
 */
function weeklyProgressCheck() {
  console.log('週次進捗チェック開始:', new Date());
  
  try {
    // 1. 未完了タスクの確認
    checkPendingTasks();
    
    // 2. 新入社員の状況確認
    checkNewEmployeeStatus();
    
    // 3. 週次レポート作成
    generateWeeklyReport();
    
    console.log('週次進捗チェック完了');
    
  } catch (error) {
    console.error('週次進捗チェックエラー:', error);
    sendErrorNotification('週次進捗チェック', error);
  }
}

/**
 * 従業員データのパース
 */
function parseEmployeeRow(header, row) {
  const employee = {};
  header.forEach((col, index) => {
    switch(col) {
      case 'タイムスタンプ':
        employee.timestamp = row[index];
        break;
      case '氏名':
        employee.name = row[index];
        break;
      case 'メールアドレス':
        employee.email = row[index];
        break;
      case '入社予定日':
        employee.startDate = row[index];
        break;
      case '配属予定部署':
        employee.department = row[index];
        break;
      case '職種':
        employee.position = row[index];
        break;
      case '雇用形態':
        employee.employmentType = row[index];
        break;
    }
  });
  return employee;
}

/**
 * 自動化イベントログ
 */
function logAutomationEvent(eventType, employeeName, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('自動化ログ') || 
                SpreadsheetApp.getActiveSpreadsheet().insertSheet('自動化ログ');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['実行日時', 'イベント種別', '対象者', 'ステータス', '詳細']);
  }
  
  sheet.appendRow([
    new Date(),
    eventType,
    employeeName,
    status,
    ''
  ]);
}

/**
 * エラー通知
 */
function sendErrorNotification(process, error) {
  const message = `
自動化プロセスでエラーが発生しました：

プロセス: ${process}
発生時刻: ${new Date()}
エラー内容: ${error.message}

確認をお願いします。
  `;
  
  // 人事部にメール通知
  MailApp.sendEmail({
    to: 'hr@company.com',
    subject: '[重要] 人事自動化システムエラー',
    body: message
  });
}
```

## 🔧 セットアップ用コード

```javascript
/**
 * 初期セットアップ関数
 * 動画で使用する初期設定を一括実行
 */
function initialSetup() {
  console.log('初期セットアップ開始');
  
  try {
    // 1. 必要なAPIの有効化確認
    checkRequiredAPIs();
    
    // 2. プロパティの設定確認
    checkRequiredProperties();
    
    // 3. スプレッドシートの初期化
    initializeSheets();
    
    // 4. トリガーの設定
    setupDailyTriggers();
    
    console.log('初期セットアップ完了');
    
  } catch (error) {
    console.error('初期セットアップエラー:', error);
    throw error;
  }
}

/**
 * 必要なAPI有効化の確認
 */
function checkRequiredAPIs() {
  const requiredAPIs = ['Gmail API', 'Calendar API', 'Drive API'];
  console.log('必要なAPI:', requiredAPIs.join(', '));
  // 実際のチェックロジックは手動で確認
}

/**
 * 必要なプロパティの設定確認
 */
function checkRequiredProperties() {
  const properties = PropertiesService.getScriptProperties();
  const requiredProps = ['OPENAI_API_KEY', 'IT_CHAT_WEBHOOK', 'HR_CHAT_WEBHOOK'];
  
  requiredProps.forEach(prop => {
    if (!properties.getProperty(prop)) {
      console.warn(`${prop} が設定されていません`);
    }
  });
}

/**
 * スプレッドシートの初期化
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 必要なシートが存在しない場合は作成
  const requiredSheets = [
    '内定者情報',
    '生成メール',
    'タスク管理',
    'メール送信ログ',
    '自動化ログ'
  ];
  
  requiredSheets.forEach(sheetName => {
    if (!ss.getSheetByName(sheetName)) {
      ss.insertSheet(sheetName);
      console.log(`${sheetName} シートを作成しました`);
    }
  });
}
```

このコード集により、実際の動画デモで使用可能な実装例を提供できます。各動画で段階的に機能を追加していく構成になっています。