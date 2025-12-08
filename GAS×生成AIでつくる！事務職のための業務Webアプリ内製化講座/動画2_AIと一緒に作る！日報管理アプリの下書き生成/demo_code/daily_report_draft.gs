/**
 * フォーム送信時に実行される関数
 * フォームの回答データをスプレッドシートに自動転記する
 *
 * 実行方法：
 * 1. Googleフォームを作成（タイトル: 業務日報）
 * 2. フォーム項目を設定:
 *    - 日付（日付形式、必須）
 *    - 氏名（短い回答、必須）
 *    - 業務内容（段落形式、必須）
 *    - 所感・気づき（段落形式、任意）
 * 3. フォームの「回答」タブ→スプレッドシートアイコンをクリック
 * 4. 「新しいスプレッドシートを作成」
 * 5. 作成されたスプレッドシートで、「拡張機能」→「Apps Script」
 * 6. このコードを貼り付け
 * 7. トリガーは次回（第3回）で設定します
 *
 * @param {Object} e - フォーム送信イベントオブジェクト
 */
function onFormSubmit(e) {
  // アクティブなスプレッドシートの「シート1」を取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');

  // 送信日時を取得
  var timestamp = new Date();

  // フォームの回答を取得
  var itemResponses = e.response.getItemResponses();

  // 各項目の値を取得
  // 注意: フォーム項目の順番と一致している必要があります
  var date = itemResponses[0].getResponse();        // 日付
  var name = itemResponses[1].getResponse();        // 氏名
  var content = itemResponses[2].getResponse();     // 業務内容
  var feedback = itemResponses[3].getResponse();    // 所感・気づき

  // スプレッドシートの最終行に追加
  sheet.appendRow([timestamp, date, name, content, feedback]);

  // ログに記録（デバッグ用）
  Logger.log('日報を追加しました: ' + name + ' - ' + date);
}
