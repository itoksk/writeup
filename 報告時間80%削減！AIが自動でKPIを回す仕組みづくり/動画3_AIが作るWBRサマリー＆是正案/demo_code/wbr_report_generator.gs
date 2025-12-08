/**
 * WBR（週次ビジネスレビュー）報告書自動生成スクリプト
 *
 * 機能：
 * - KPI台帳の最新データと変動理由を取得
 * - 営業日報、イベント情報などの関連データを取得
 * - ChatGPT APIでWBR報告書を生成
 * - 生成結果を『WBR報告書』シートに自動記入
 */

// OpenAI APIキー（Apps Scriptのプロパティストアに保存することを推奨）
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

/**
 * WBR報告書を自動生成
 */
function generateWBR() {
  try {
    // スプレッドシートとシートの取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const kpiSheet = ss.getSheetByName('KPI台帳');
    const salesLogSheet = ss.getSheetByName('営業日報');
    const eventSheet = ss.getSheetByName('イベント情報');
    const wbrSheet = ss.getSheetByName('WBR報告書');

    // シートの存在確認
    if (!kpiSheet || !salesLogSheet || !eventSheet) {
      throw new Error('必要なシート（KPI台帳、営業日報、イベント情報）が見つかりません');
    }

    // WBR報告書シートがなければ作成
    let wbrSheet2 = wbrSheet;
    if (!wbrSheet2) {
      wbrSheet2 = ss.insertSheet('WBR報告書');
      // ヘッダー行を作成
      wbrSheet2.getRange(1, 1, 1, 4).setValues([['期間', 'KPIサマリー', 'ハイライト', '次週へのアクション']]);
      wbrSheet2.getRange(1, 1, 1, 4).setFontWeight('bold');
    }

    // KPI台帳の最新行データを取得
    const kpiLastRow = kpiSheet.getLastRow();
    if (kpiLastRow < 2) {
      throw new Error('KPI台帳にデータがありません');
    }

    const latestKPI = kpiSheet.getRange(kpiLastRow, 1, 1, 8).getValues()[0];
    const [date, sales, contracts, inquiries, salesChange, contractsChange, inquiriesChange, reasonAnalysis] = latestKPI;

    // 前週データの取得
    let prevWeekKPI = null;
    if (kpiLastRow >= 3) {
      prevWeekKPI = kpiSheet.getRange(kpiLastRow - 1, 1, 1, 4).getValues()[0];
    }

    // 今週の開始日と終了日を計算
    const currentDate = new Date(date);
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - 6); // 7日前から今週とする

    // 営業日報データを取得（今週分のみ）
    const salesLogData = getSalesLogForWeek(salesLogSheet, weekStart, currentDate);

    // イベント情報を取得（今週分のみ）
    const eventData = getEventsForWeek(eventSheet, weekStart, currentDate);

    // ChatGPT APIでWBR報告書を生成
    const wbrReport = generateWBRThroughChatGPT(
      date,
      sales,
      contracts,
      inquiries,
      salesChange,
      contractsChange,
      inquiriesChange,
      reasonAnalysis,
      prevWeekKPI,
      salesLogData,
      eventData
    );

    // WBR報告書をパース（KPIサマリー、ハイライト、アクションに分割）
    const parsedReport = parseWBRReport(wbrReport);

    // WBR報告書シートに記入
    const wbrLastRow = wbrSheet2.getLastRow();
    const newRow = wbrLastRow + 1;

    const weekStartFormatted = Utilities.formatDate(weekStart, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const currentDateFormatted = Utilities.formatDate(currentDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const period = `${weekStartFormatted} 〜 ${currentDateFormatted}`;

    wbrSheet2.getRange(newRow, 1).setValue(period);
    wbrSheet2.getRange(newRow, 2).setValue(parsedReport.kpiSummary);
    wbrSheet2.getRange(newRow, 3).setValue(parsedReport.highlights);
    wbrSheet2.getRange(newRow, 4).setValue(parsedReport.actions);

    // セルを自動調整
    wbrSheet2.autoResizeColumns(1, 4);
    wbrSheet2.setRowHeight(newRow, 150); // 行の高さを調整

    // 成功ログ
    Logger.log('WBR報告書が正常に生成されました。');
    Logger.log(`期間: ${period}`);
    Logger.log(`生成内容:\n${wbrReport}`);

    return wbrReport;

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.message);

    // エラー時は『生成失敗』と記録
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let wbrSheet = ss.getSheetByName('WBR報告書');
    if (!wbrSheet) {
      wbrSheet = ss.insertSheet('WBR報告書');
      wbrSheet.getRange(1, 1, 1, 4).setValues([['期間', 'KPIサマリー', 'ハイライト', '次週へのアクション']]);
    }
    const wbrLastRow = wbrSheet.getLastRow();
    wbrSheet.getRange(wbrLastRow + 1, 1).setValue(new Date());
    wbrSheet.getRange(wbrLastRow + 1, 2).setValue('❌ 生成失敗：' + error.message);

    throw error;
  }
}

/**
 * 営業日報データを取得（指定期間内）
 */
function getSalesLogForWeek(sheet, startDate, endDate) {
  const data = sheet.getDataRange().getValues();
  const salesLog = [];

  // ヘッダー行をスキップ
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const logDate = new Date(row[0]);

    // 日付が範囲内か確認
    if (logDate >= startDate && logDate <= endDate) {
      salesLog.push({
        date: Utilities.formatDate(logDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        dealName: row[1],
        amount: row[2],
        status: row[3],
        notes: row[4] || ''
      });
    }
  }

  return salesLog;
}

/**
 * イベント情報を取得（指定期間内）
 */
function getEventsForWeek(sheet, startDate, endDate) {
  const data = sheet.getDataRange().getValues();
  const events = [];

  // ヘッダー行をスキップ
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const eventDate = new Date(row[0]);

    // 日付が範囲内か確認
    if (eventDate >= startDate && eventDate <= endDate) {
      events.push({
        date: Utilities.formatDate(eventDate, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
        eventName: row[1],
        participants: row[2],
        newLeads: row[3]
      });
    }
  }

  return events;
}

/**
 * ChatGPT APIを使ってWBR報告書を生成
 */
function generateWBRThroughChatGPT(
  date,
  sales,
  contracts,
  inquiries,
  salesChange,
  contractsChange,
  inquiriesChange,
  reasonAnalysis,
  prevWeekKPI,
  salesLogData,
  eventData
) {
  // APIキーの確認
  if (OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    throw new Error('OpenAI APIキーが設定されていません。スクリプトの冒頭でAPIキーを設定してください。');
  }

  // プロンプトの構築
  const prompt = buildWBRPrompt(
    date,
    sales,
    contracts,
    inquiries,
    salesChange,
    contractsChange,
    inquiriesChange,
    reasonAnalysis,
    prevWeekKPI,
    salesLogData,
    eventData
  );

  // ChatGPT APIリクエスト
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'あなたは優秀なビジネスアナリストです。週次ビジネスレビュー（WBR）報告書を簡潔にまとめてください。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 800
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + OPENAI_API_KEY
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`API Error (${responseCode}): ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());
    const wbrReport = result.choices[0].message.content.trim();

    return wbrReport;

  } catch (error) {
    Logger.log('ChatGPT API呼び出しエラー: ' + error.message);
    throw new Error('ChatGPT API呼び出しに失敗しました: ' + error.message);
  }
}

/**
 * ChatGPT APIへのWBRプロンプトを構築
 */
function buildWBRPrompt(
  date,
  sales,
  contracts,
  inquiries,
  salesChange,
  contractsChange,
  inquiriesChange,
  reasonAnalysis,
  prevWeekKPI,
  salesLogData,
  eventData
) {
  let prompt = `以下のデータから、週次ビジネスレビュー（WBR）報告書を作成してください：\n\n`;

  // 今週のKPI
  prompt += `【KPIデータ】\n`;
  prompt += `- 日付：${Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), 'yyyy-MM-dd')}\n`;
  prompt += `- 売上：${sales.toLocaleString()}円（前週比${salesChange}）\n`;
  prompt += `- 成約件数：${contracts}件（前週比${contractsChange}）\n`;
  prompt += `- 問い合わせ数：${inquiries}件（前週比${inquiriesChange}）\n\n`;

  // 前週のKPI（比較用）
  if (prevWeekKPI) {
    const [prevDate, prevSales, prevContracts, prevInquiries] = prevWeekKPI;
    prompt += `【前週のKPI（比較用）】\n`;
    prompt += `- 売上：${prevSales.toLocaleString()}円\n`;
    prompt += `- 成約件数：${prevContracts}件\n`;
    prompt += `- 問い合わせ数：${prevInquiries}件\n\n`;
  }

  // 変動理由（既に分析済み）
  prompt += `【変動理由（既に分析済み）】\n`;
  prompt += `${reasonAnalysis}\n\n`;

  // 営業日報データ
  prompt += `【今週の営業日報】\n`;
  if (salesLogData.length === 0) {
    prompt += `- データなし\n`;
  } else {
    salesLogData.forEach(log => {
      prompt += `- ${log.date}：${log.dealName}、${log.amount.toLocaleString()}円、${log.status}`;
      if (log.notes) {
        prompt += `、${log.notes}`;
      }
      prompt += `\n`;
    });
  }
  prompt += `\n`;

  // イベント情報
  prompt += `【今週のイベント情報】\n`;
  if (eventData.length === 0) {
    prompt += `- データなし\n`;
  } else {
    eventData.forEach(event => {
      prompt += `- ${event.date}：${event.eventName}、参加者${event.participants}名、新規リード${event.newLeads}件\n`;
    });
  }
  prompt += `\n`;

  // 出力形式
  prompt += `【出力形式】\n`;
  prompt += `# 週次ビジネスレビュー（WBR）\n`;
  prompt += `期間：[期間]\n\n`;
  prompt += `## 📊 今週のKPIサマリー\n`;
  prompt += `- 売上：XXX円（前週比X% / +/-XXX円）\n`;
  prompt += `- 成約件数：XX件（前週比X% / +/-XX件）\n`;
  prompt += `- 問い合わせ数：XXX件（前週比X% / +/-XXX件）\n\n`;
  prompt += `## ✅ 今週のハイライト\n`;
  prompt += `【主要成果】\n`;
  prompt += `- [具体的な成果1]\n`;
  prompt += `- [具体的な成果2]\n\n`;
  prompt += `【注意すべき点】\n`;
  prompt += `- [注意点1]\n`;
  prompt += `- [注意点2]\n\n`;
  prompt += `## 💡 次週へのアクション\n`;
  prompt += `1. [具体的なアクション1]\n`;
  prompt += `2. [具体的なアクション2]\n`;
  prompt += `3. [具体的なアクション3]\n\n`;

  // 注意事項
  prompt += `【注意事項】\n`;
  prompt += `- 簡潔にまとめる（報告会議で使えるレベル）\n`;
  prompt += `- 数値や固有名詞を含めて具体的に\n`;
  prompt += `- アクションは実行可能で優先順位が明確なもの\n`;

  return prompt;
}

/**
 * WBR報告書をパース（KPIサマリー、ハイライト、アクションに分割）
 */
function parseWBRReport(wbrReport) {
  const sections = {
    kpiSummary: '',
    highlights: '',
    actions: ''
  };

  // セクションを分割
  const kpiMatch = wbrReport.match(/## 📊 今週のKPIサマリー\n([\s\S]*?)(?=##|$)/);
  const highlightsMatch = wbrReport.match(/## ✅ 今週のハイライト\n([\s\S]*?)(?=##|$)/);
  const actionsMatch = wbrReport.match(/## 💡 次週へのアクション\n([\s\S]*?)(?=\n\n|$)/);

  if (kpiMatch) {
    sections.kpiSummary = kpiMatch[1].trim();
  }
  if (highlightsMatch) {
    sections.highlights = highlightsMatch[1].trim();
  }
  if (actionsMatch) {
    sections.actions = actionsMatch[1].trim();
  }

  // 分割できなかった場合は、全文をハイライトに入れる
  if (!sections.kpiSummary && !sections.highlights && !sections.actions) {
    sections.highlights = wbrReport;
  }

  return sections;
}

/**
 * テスト実行用関数
 */
function testGenerateWBR() {
  Logger.log('=== テスト実行開始 ===');
  const result = generateWBR();
  Logger.log('=== テスト実行完了 ===');
  Logger.log('WBR報告書:\n' + result);
}
