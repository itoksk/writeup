/**
 * GPTsからスプレッドシートを読み書きするためのWeb API
 */

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // シート名が指定されている場合はそのシートを取得、なければアクティブシート
    const sheetName = e.parameter.sheet;
    const sheet = sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet not found: ' + sheetName
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 範囲指定がある場合はその範囲、なければ最新10行のみ
    let data;
    if (e.parameter.range) {
      data = sheet.getRange(e.parameter.range).getValues();
    } else {
      // デフォルトは最新10行（見出し含む）
      const lastRow = sheet.getLastRow();
      const startRow = Math.max(1, lastRow - 9); // 最新10行
      const numColumns = sheet.getLastColumn();
      data = sheet.getRange(startRow, 1, lastRow - startRow + 1, numColumns).getValues();
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: data,
      sheet: sheet.getName()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // データの書き込み
    if (params.row && params.column && params.value) {
      sheet.getRange(params.row, params.column).setValue(params.value);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data written successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
