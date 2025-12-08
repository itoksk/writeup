/**
 * 日報閲覧Webアプリ - バックエンドコード
 *
 * このコードは、スプレッドシートのデータを取得し、
 * HTMLアプリに渡す役割を果たします。
 *
 * 【Webアプリの公開方法】
 * 1. Apps Scriptエディタで、右上の「デプロイ」→「新しいデプロイ」
 * 2. 「種類の選択」→「ウェブアプリ」
 * 3. 説明: 日報閲覧アプリ
 * 4. 次のユーザーとして実行: 自分
 * 5. アクセスできるユーザー: 組織内の全員（または 自分のみ）
 * 6. 「デプロイ」をクリック
 * 7. WebアプリのURLをコピー
 * 8. このURLをGoogleサイトに埋め込む
 */

/**
 * Webアプリのメインページを表示
 * ユーザーがWebアプリURLにアクセスしたときに呼ばれる関数
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('業務日報 - 閲覧アプリ')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Googleサイトに埋め込み可能にする
}

/**
 * スプレッドシートから日報データを取得する関数
 * HTMLアプリから呼び出される
 *
 * @return {Array} 日報データの配列
 */
function getDailyReports() {
  try {
    // 【重要】ここにスプレッドシートIDを入力してください
    // スプレッドシートのURLから取得: https://docs.google.com/spreadsheets/d/【ここがID】/edit
    var SPREADSHEET_ID = '【ここにスプレッドシートIDを入力】';

    // スプレッドシートを開く
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName('シート1');

    // データ範囲を取得（ヘッダー行を除く）
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      // データがない場合は空配列を返す
      return [];
    }

    // A列〜E列のデータを取得（タイムスタンプ、日付、氏名、業務内容、所感）
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

    // データを整形して返す
    var reports = [];
    for (var i = 0; i < data.length; i++) {
      reports.push({
        timestamp: Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), 'yyyy/MM/dd HH:mm'),
        date: Utilities.formatDate(new Date(data[i][1]), Session.getScriptTimeZone(), 'yyyy/MM/dd'),
        name: data[i][2],
        content: data[i][3],
        feedback: data[i][4]
      });
    }

    // 日付の新しい順にソート
    reports.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    return reports;

  } catch (error) {
    // エラーが発生した場合は、エラーメッセージを返す
    Logger.log('エラーが発生しました: ' + error.toString());
    throw new Error('データの取得に失敗しました: ' + error.message);
  }
}

/**
 * 氏名のリストを取得する関数（フィルター用）
 * HTMLアプリから呼び出される
 *
 * @return {Array} 氏名の配列（重複なし）
 */
function getNameList() {
  try {
    // 【重要】getDailyReports関数と同じスプレッドシートIDを使用
    var SPREADSHEET_ID = '【ここにスプレッドシートIDを入力】';

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName('シート1');

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return [];
    }

    // C列（氏名）のデータを取得
    var names = sheet.getRange(2, 3, lastRow - 1, 1).getValues();

    // 重複を除いてソート
    var uniqueNames = [];
    var nameMap = {};
    for (var i = 0; i < names.length; i++) {
      var name = names[i][0];
      if (name && !nameMap[name]) {
        uniqueNames.push(name);
        nameMap[name] = true;
      }
    }

    uniqueNames.sort();
    return uniqueNames;

  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.toString());
    return [];
  }
}
