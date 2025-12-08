# 紙ベースの注文書類を1分で対応へ！OCR×通知自動化で営業事務を9割削減

## 🎯 コース概要

### 対象レベル
**初級〜中級者**: プログラミング経験不要。Google Apps Scriptとノーコードツールを中心とした実装しやすい構成

### 学習目標
手作業で15分かかっていたPDF注文書の処理を、わずか1分で自動化。営業事務の90%削減を実現する実用的なシステム構築

### システム設計
**Google Workspace + AI 連携型**
```
PDF投入 → Vision API(OCR) → ChatGPT(情報抽出) → スプレッドシート(DB) + Slack(通知) + Gmail(顧客対応)
```

---

## 📚 動画構成（8本×10分）

### 動画1: なぜあなたの時間は"PDFの転記作業"に消えるのか？
**学習目標**: 現状課題の理解と自動化システムの全体像把握

**導入フレーズ**: 
「毎朝、出社して最初にやることは何ですか？メールに添付されたPDFを開き、FAXの束を確認し、それをExcelに転記する…そんな日々を送っていませんか？あなたの時給は、その作業に見合っていますか？このコースは、単なるツールの使い方を教えるものではありません。あなたの貴重な時間を『あなたにしかできない仕事』に取り戻すための、未来への設計図です。」

**Before/After**:
- Before: 創造性のない単純作業に忙殺され、夕方にはぐったり。顧客への提案準備は後回しになり、残業も常態化
- After: 面倒な作業はすべてAIアシスタントに任せ、朝から戦略立案や顧客との対話に集中できる

**デモ内容**: 
完成形フローのダイジェスト実演。「ある営業担当者の1日」として、Google DriveにPDF投入→Slack通知→顧客メール送信→スプレッドシート記録までの全自動処理を紹介

**初級者対応のポイント**:
- 複雑な技術説明は避け、「なぜ必要か」に焦点
- 段階的アプローチの重要性を強調（いきなり完璧を目指さない）
- 10分で理解できる範囲の概要説明に留める

---

### 動画2: Google Cloud & GAS 3つの重要APIを有効化する方法
**学習目標**: 自動化の土台となるAPI環境構築

**導入フレーズ**:
「『API』『GCP』…なんだか難しそう？大丈夫です。ここは、未来の自分のために高速道路を建設するようなもの。一度作ってしまえば、あとは快適に走り続けるだけ。一つ一つ、画面を見ながら一緒に設定していけば、誰でも必ず完了できます。この10分で、あなたのGoogleアカウントを『自動化マシン』に変身させましょう！」

**簡素化された構築手順**:
1. **必須フォルダ作成**: 「AI受注処理」「処理済み」の2フォルダのみ
2. **スプレッドシート準備**: シンプルな「受注管理台帳」作成
3. **GAS環境構築**: スプレッドシートからApps Script起動
4. **3つのAPI有効化**: Drive API、Gmail API、Vision API（画面操作のみ）

**10分対応の調整**:
- GCPの詳細設定は省略、必要最小限の操作のみ
- トラブルシューティングは別資料として分離
- 成功体験を重視（まず動かすことを優先）

---

### 動画3: PDFの内容をAIに"読ませる" - Vision APIで全ての文字をテキスト化する
**学習目標**: OCR機能の実装とテスト

**導入フレーズ**:
「人間の目が画像を『風景』や『文字』と認識するように、AIにも"目"があります。今回は、前回有効化したGoogleのAIの"目"、Vision APIを使って、これまでただの画像の塊だったPDFに魔法をかけます。あなたの手で書いたコードが、AIを動かし、文字を認識する…プログラミングの醍醐味とAIの凄さを、ここで体感してください！」

**初級者向け実装**:
```javascript
// シンプル化されたOCR実装例
function processNewPDF(fileId) {
  try {
    // 1. ファイル取得
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    
    // 2. Vision API呼び出し（簡素化）
    const apiKey = PropertiesService.getScriptProperties().getProperty('VISION_API_KEY');
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    // 3. リクエスト作成
    const payload = {
      requests: [{
        image: { content: Utilities.base64Encode(blob.getBytes()) },
        features: [{ type: 'TEXT_DETECTION' }]
      }]
    };
    
    // 4. API実行
    const response = UrlFetchApp.fetch(visionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    const text = result.responses[0].fullTextAnnotation.text;
    
    console.log('抽出されたテキスト:', text);
    return text;
    
  } catch (error) {
    console.error('OCR処理エラー:', error);
    return null;
  }
}
```

**デモ内容**: 
複雑なレイアウトの注文書PDFで実演。手書き署名まで認識する精度の高さをアピール

---

### 動画4: 出力結果を左右する！必要情報を抽出するプロンプト作成術
**学習目標**: 効果的なプロンプト設計とChatGPT API連携

**導入フレーズ**:
「OCRで文字は取り出せました。しかし、それはまだ『素材』に過ぎません。この素材を『料理』し、意味のある『情報』に変えるシェフがChatGPTです。そして、そのシェフに最高の仕事をさせるための指示書が『プロンプト』。この回では、AIに『魂』を吹き込み、ただのチャットボットをあなたの意図を100%理解する超優秀な部下へと変貌させる、プロンプト設計の核心理論を学びます。」

**実用的プロンプトテンプレート**:
```
あなたは優秀な営業事務担当者です。
以下のOCRで抽出されたテキストから、注文書の重要情報を抽出してください。

# 抽出する情報
- 会社名
- 担当者名  
- 商品名・品番
- 数量
- 単価
- 合計金額
- 納期

# 出力形式
必ず以下のJSON形式で回答してください：
{
  "company": "会社名",
  "contact": "担当者名",
  "items": [
    {
      "name": "商品名",
      "code": "品番", 
      "quantity": 数量,
      "price": 単価
    }
  ],
  "total": 合計金額,
  "delivery_date": "納期"
}

# 制約条件
- 情報が見つからない場合は null を設定
- 数量・金額は数値のみ抽出
- 日付は YYYY-MM-DD 形式で統一

# 抽出対象テキスト
${ocrText}
```

**ChatGPT Web版でのデモ**: API連携前に、まずWeb版で効果を実感

---

### 動画5: GASからChatGPTを動かす！注文書から会社名と数量を抜き出す実践コード
**学習目標**: ChatGPT API連携の実装

**導入フレーズ**:
「お待たせしました、いよいよ実践編です！前回学んだ理論を元に、私たちの業務に特化した『魔法の呪文』、すなわち情報抽出プロンプトを構築します。この10分後、あなたはOCRで読み取っただけの混沌としたテキストを、完璧に構造化された宝の山に変えるスキルを手に入れます。コピペして少しカスタマイズするだけで、明日からあなたの現場でAIが即戦力として動き出します！」

**実装コード例**:
```javascript
function extractOrderInfo(ocrText) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  const prompt = createOrderExtractionPrompt(ocrText);
  
  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1000,
    temperature: 0.1
  };
  
  try {
    const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    });
    
    const result = JSON.parse(response.getContentText());
    const extractedInfo = JSON.parse(result.choices[0].message.content);
    
    console.log('抽出された情報:', extractedInfo);
    return extractedInfo;
    
  } catch (error) {
    console.error('ChatGPT API エラー:', error);
    return { error: error.message };
  }
}
```

**初級者サポート**:
- エラーハンドリングを必ず含める
- APIキーの安全な管理方法を重点説明
- 段階的テスト方法を提示

---

### 動画6: GASでスプレッドシートに自動記録！受注台帳が勝手に出来上がっていく設定
**学習目標**: データベース化とファイル管理の自動化

**導入フレーズ**:
「データは、ただそこにあるだけでは価値を生みません。整理され、蓄積され、誰もがアクセスできる状態になって初めて、ビジネスを加速させる『資産』に変わります。今回は、AIが抽出した情報を、私たちの業務の中心地であるスプレッドシートに自動で記録します。さらに、処理状況を管理する『ステータス』も追加し、プロレベルのデータベースを構築しましょう！」

**シンプル化された実装**:
```javascript
function saveToSpreadsheet(extractedData, fileName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('受注管理台帳');
  
  // 基本的なデータ行作成
  const row = [
    new Date(),                    // 処理日時
    '完了',                       // ステータス
    extractedData.company,         // 会社名
    extractedData.contact,         // 担当者
    extractedData.items[0]?.name,  // 商品名
    extractedData.items[0]?.quantity, // 数量
    extractedData.total,           // 合計金額
    fileName                       // ファイル名
  ];
  
  sheet.appendRow(row);
  
  // 処理済みフォルダに移動
  moveToProcessedFolder(fileName);
}

function moveToProcessedFolder(fileName) {
  try {
    const files = DriveApp.getFilesByName(fileName);
    if (files.hasNext()) {
      const file = files.next();
      const processedFolder = DriveApp.getFoldersByName('処理済み').next();
      file.moveTo(processedFolder);
    }
  } catch (error) {
    console.error('ファイル移動エラー:', error);
  }
}
```

**魔法的デモ**: PDF投入後、スプレッドシートの行が自動追加される様子をリアルタイム表示

---

### 動画7: GASとSlackを繋いでみよう！受注したらチームに即通知が飛ぶ仕組み
**学習目標**: チーム連携とリアルタイム通知

**導入フレーズ**:
「『〇〇さん、あの件どうなりました？』…オフィスで最も無駄な会話の一つかもしれません。情報共有のタイムラグが、チームのスピードを奪っています。この回では、私たちが作った自動化フローに『報告機能』を搭載します。受注が発生した瞬間、関係者全員に情報が届く。そんな理想の連携プレーを、Slackを使って実現しましょう！」

**簡潔な Slack 連携実装**:
```javascript
function notifySlack(orderData) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  
  const message = {
    text: `🎉 新規受注のお知らせ`,
    attachments: [{
      color: 'good',
      fields: [
        { title: '会社名', value: orderData.company, short: true },
        { title: '商品', value: orderData.items[0]?.name, short: true },
        { title: '数量', value: orderData.items[0]?.quantity, short: true },
        { title: '金額', value: `¥${orderData.total}`, short: true }
      ]
    }]
  };
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(message)
  });
}
```

**劇的デモ**: PDF投入とSlack通知の同時画面表示で即座性をアピール

---

### 動画8: これで完璧！顧客へのGmail自動返信と、エラー通知もGASで追加する
**学習目標**: 顧客対応自動化とシステムの安定性確保

**導入フレーズ**:
「おめでとうございます！いよいよ最終回です。完璧に見える自動化フローにも、最後の仕上げが必要です。それは、お客様への感謝を伝える『おもてなしの心』と、予期せぬ事態に備える『プロの備え』。この回では、顧客へのサンキューメール自動送信と、万が一のエラー発生時に即座に対応できる仕組みを組み込み、私たちのAIアシスタントを真の『最終形態』へと進化させます！」

**統合システム完成版**:
```javascript
function processOrderPDF(fileId) {
  try {
    // 1. OCR処理
    const ocrText = performOCR(fileId);
    
    // 2. AI情報抽出
    const orderData = extractOrderInfo(ocrText);
    
    // 3. スプレッドシートに保存
    saveToSpreadsheet(orderData, DriveApp.getFileById(fileId).getName());
    
    // 4. Slack通知
    notifySlack(orderData);
    
    // 5. 顧客への自動返信
    if (orderData.contact_email) {
      sendCustomerEmail(orderData);
    }
    
    console.log('注文処理完了:', orderData.company);
    
  } catch (error) {
    // エラー時の緊急通知
    handleProcessingError(error, fileId);
  }
}

function sendCustomerEmail(orderData) {
  const subject = `【受注確認】${orderData.company}様 ご注文ありがとうございます`;
  const body = `${orderData.company} ご担当者様

いつもお世話になっております。

この度は貴重なご注文をいただき、誠にありがとうございます。
以下の内容で承りました。

■ご注文内容
商品名: ${orderData.items[0]?.name}
数量: ${orderData.items[0]?.quantity}個
ご希望納期: ${orderData.delivery_date}

詳細につきましては、改めて担当者よりご連絡いたします。

今後ともよろしくお願いいたします。`;

  GmailApp.sendEmail(orderData.contact_email, subject, body);
}

function handleProcessingError(error, fileId) {
  const errorMessage = `🚨 注文処理エラー発生
ファイルID: ${fileId}
エラー内容: ${error.message}
発生時刻: ${new Date()}`;

  // Slack緊急通知
  const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify({ text: errorMessage })
  });
  
  // 管理者メール通知
  GmailApp.sendEmail('admin@company.com', '注文処理エラー', errorMessage);
}
```

**2つの感動デモ**: 
1. 顧客Gmail受信箱での感謝メール受信
2. わざとエラー発生させての緊急アラート実演

---

## 🛠️ 調整された技術スタック

### Core Components（必須）
- **Google Apps Script**: メイン開発環境（コスト0円）
- **Google Drive API**: ファイル監視・管理
- **Vision API**: OCR処理（従量課金、月数百円程度）
- **ChatGPT API**: 情報抽出（従量課金、月1000円程度）
- **Gmail API**: 自動メール送信
- **Slack Webhook**: チーム通知（無料）

### Optional Tools（選択制）
- **Googleスプレッドシート**: データベース（無料）
- **Google Calendar API**: スケジュール管理（上級者向け）

### 初級者向け調整ポイント
- **段階的構築**: 各動画で1つの機能に集中
- **エラー対策**: 豊富なtry-catch実装例
- **コピペ対応**: そのまま使えるコードテンプレート
- **トラブル解決**: よくある問題と解決法を動画内で説明

---

## 📊 現実的な効果目標

### 段階別効果
- **動画1-3完了**: 手作業15分 → 10分（33%削減）
- **動画4-6完了**: 10分 → 3分（80%削減）  
- **動画7-8完了**: 3分 → 1分（93%削減）

### 定性効果
- **ストレス軽減**: 転記ミス・確認漏れの不安から解放
- **品質向上**: 一貫した高品質な顧客対応
- **時間創出**: 戦略的業務への集中時間確保

---

## 💡 初級〜中級者対応の特徴

### 学習しやすい工夫
- **10分集中**: 各動画で達成可能な現実的目標
- **視覚的デモ**: 動作する様子を最初に見せて理解促進
- **段階的複雑化**: シンプルから始めて徐々に高度化
- **失敗対策**: つまづきポイントと解決法を事前説明

### 実装サポート
- **完成コード提供**: コピペで動作するサンプルコード
- **エラー対応**: 豊富な例外処理とデバッグ方法
- **カスタマイズガイド**: 各企業の環境に合わせた調整方法

### 継続学習支援
- **応用アイデア**: 他業務への展開方法
- **スキルアップ**: より高度な機能への発展ルート
- **コミュニティ**: 受講者同士の情報交換場所

---

## 🎯 コース修了後の展開

### 習得スキル
1. **Google Apps Script**: Google Workspace自動化の中核技術
2. **API連携**: 外部サービスとの効率的な連携手法  
3. **AI活用**: ChatGPTを業務に実践応用する技術
4. **プロンプトエンジニアリング**: AIから最適な結果を引き出す技術

### 応用可能な業務
- **請求書処理**: PDF請求書の自動データ化
- **問い合わせ管理**: メール内容の自動分類・転送
- **日報作成**: 活動記録の自動集計とレポート生成
- **契約管理**: 契約書の期限管理と更新アラート

この調整版では、懸念点で指摘された「初級〜中級者でも実装可能」「10分動画に適した内容」「現実的な効果目標」を重視し、元のタイトル構成を維持しながら実用性を大幅に向上させました。