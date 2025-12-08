/**
 * 日報管理システム - 完成版
 * フォーム送信時に実行され、スプレッドシートに自動転記する
 *
 * 【トリガー設定方法】
 * 1. Apps Scriptエディタで、左メニューの「トリガー」（時計マーク）をクリック
 * 2. 右下の「トリガーを追加」ボタンをクリック
 * 3. 以下のように設定:
 *    - 実行する関数を選択: onFormSubmit
 *    - 実行するデプロイを選択: Head
 *    - イベントのソースを選択: フォームから
 *    - イベントの種類を選択: フォーム送信時
 * 4. 「保存」をクリック
 * 5. 権限の承認（初回のみ）
 *
 * 【Googleサイトでの公開方法】
 * 1. Google Sitesを開く（sites.google.com）
 * 2. 「新しいサイトを作成」
 * 3. サイト名: 業務日報 - チーム共有
 * 4. 右側の「挿入」メニューから「スプレッドシートのグラフ」を選択
 * 5. このスプレッドシートを選択
 * 6. 表示範囲を調整
 * 7. 右上の「公開」ボタンで、社内限定公開
 *
 * @param {Object} e - フォーム送信イベントオブジェクト
 */
function onFormSubmit(e) {
  try {
    // アクティブなスプレッドシートの「シート1」を取得
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');

    // 送信日時を取得
    var timestamp = new Date();

    // フォームの回答を取得
    var itemResponses = e.response.getItemResponses();

    // 各項目の値を取得
    var date = itemResponses[0].getResponse();        // 日付
    var name = itemResponses[1].getResponse();        // 氏名
    var content = itemResponses[2].getResponse();     // 業務内容
    var feedback = itemResponses[3].getResponse();    // 所感・気づき

    // スプレッドシートの最終行に追加
    sheet.appendRow([timestamp, date, name, content, feedback]);

    // データ範囲を取得してソート（日付降順）
    var lastRow = sheet.getLastRow();
    if (lastRow > 2) {  // ヘッダー行とデータが2行以上ある場合
      var range = sheet.getRange(2, 1, lastRow - 1, 5);
      range.sort({column: 2, ascending: false});  // B列（日付）で降順ソート
    }

    // ログに記録（デバッグ用）
    Logger.log('日報を追加しました: ' + name + ' - ' + date);

  } catch (error) {
    // エラーが発生した場合は、ログに記録
    Logger.log('エラーが発生しました: ' + error.toString());
    throw error;
  }
}

/**
 * スプレッドシートにヘッダー行を追加する関数（初回のみ実行）
 *
 * 使い方:
 * 1. この関数名を選択
 * 2. 「実行」ボタンをクリック
 */
function addHeader() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');

  // ヘッダー行を配列で定義
  var headers = ["送信日時", "日付", "氏名", "業務内容", "所感・気づき"];

  // 1行目にヘッダーを挿入
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ヘッダー行を太字にする
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");

  Logger.log("ヘッダー行を追加しました");
}
