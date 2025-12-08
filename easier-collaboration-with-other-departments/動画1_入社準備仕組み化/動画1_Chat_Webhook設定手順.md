# Google Chat Webhook 設定手順

## 🎯 Google Chat Webhook の取得方法

### **Step 1: Google Chat スペース作成**
1. Google Chat を開く
2. 「スペースを作成」をクリック
3. スペース名を設定：
   - 「IT部門-新入社員準備」
   - 「総務部-新入社員準備」

### **Step 2: Webhook の設定**
1. 作成したスペースを開く
2. スペース名の右にある「▼」をクリック
3. 「アプリと統合」→「Webhook を管理」
4. 「受信 Webhook を追加」をクリック
5. Webhook 名：「新入社員通知システム」
6. 「保存」をクリック
7. 生成されたWebhook URLをコピー

### **Step 3: Apps Script プロパティに設定**
```
IT_CHAT_WEBHOOK: https://chat.googleapis.com/v1/spaces/xxxxxx/messages?key=xxxxxx&token=xxxxxx
GENERAL_AFFAIRS_CHAT_WEBHOOK: https://chat.googleapis.com/v1/spaces/yyyyyy/messages?key=yyyyyy&token=yyyyyy
```

## 🔧 実際のWebhook送信コード

以下のコードを動画1に追加する必要があります：

```javascript
/**
 * 実際のChat Webhook送信（動画1用）
 */
function sendRealChatNotification(webhookUrl, message) {
  try {
    const payload = {
      text: message
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(webhookUrl, options);
    
    if (response.getResponseCode() === 200) {
      console.log('✅ Chat通知送信成功');
      return true;
    } else {
      console.error('❌ Chat通知送信失敗:', response.getContentText());
      return false;
    }
    
  } catch (error) {
    console.error('Chat通知エラー:', error);
    return false;
  }
}

/**
 * 改良版：実際のChat通知送信
 */
function sendDemoChatNotifications(employeeData) {
  const properties = PropertiesService.getScriptProperties();
  
  // IT部門通知
  const itWebhook = properties.getProperty('IT_CHAT_WEBHOOK');
  if (itWebhook) {
    const itMessage = `🆕 新入社員PC準備のお願い

👤 ${employeeData.name}様
📅 入社日: ${employeeData.startDate}
🏢 配属: ${employeeData.department}
💼 職種: ${employeeData.position}

📋 準備項目:
✅ PC・モニター・周辺機器
✅ メールアカウント・システム権限
✅ VPN・セキュリティ設定
✅ 開発環境（${employeeData.department}用）

⏰ 期限: ${employeeData.startDate}の前日まで`;

    sendRealChatNotification(itWebhook, itMessage);
  }
  
  // 総務部通知
  const gaWebhook = properties.getProperty('GENERAL_AFFAIRS_CHAT_WEBHOOK');
  if (gaWebhook) {
    const gaMessage = `🆕 新入社員受入準備のお願い

👤 ${employeeData.name}様
📅 入社日: ${employeeData.startDate}
🏢 配属: ${employeeData.department}

📋 準備項目:
✅ 座席・デスクの確保
✅ 名刺・社員証の準備
✅ 入館カード・駐車場利用証
✅ 備品（文房具・電話等）

⏰ 期限: ${employeeData.startDate}の前日まで`;

    sendRealChatNotification(gaWebhook, gaMessage);
  }
  
  incrementChatNotificationCounter();
}
```

## ⚠️ 注意事項

### **Webhook URL の管理**
- Webhook URLは機密情報として扱う
- Apps Script プロパティで安全に管理
- 定期的なローテーションを推奨

### **権限設定**
- Chat スペースに必要なメンバーを招待
- Webhook の送信テストを事前に実施

### **テスト方法**
```javascript
function testChatWebhook() {
  const properties = PropertiesService.getScriptProperties();
  const webhook = properties.getProperty('IT_CHAT_WEBHOOK');
  
  if (webhook) {
    const success = sendRealChatNotification(webhook, '🧪 テストメッセージ');
    console.log(success ? '✅ テスト成功' : '❌ テスト失敗');
  } else {
    console.log('❌ Webhook URLが設定されていません');
  }
}
```