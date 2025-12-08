# 第4回：現場で使うためのカスタマイズ術と知っておくべき注意点 - デモファイル

## 概要

第4回は、カスタマイズ方法、Apps Script連携、セキュリティ、トラブルシューティングを解説します。

## デモで使用する資料

### 1. カスタマイズ画面
- ステップ追加ボタン
- ドラッグ&ドロップによる順序変更
- 条件分岐の設定画面
- 変数選択画面

### 2. Apps Script連携
- 開発者向けドキュメント（developers.google.com/workspace/add-ons/studio）
- カスタムステップのコード例

### 3. セキュリティ設定
- Google管理コンソールのStudio設定画面
- アクセス制御の設定
- 監査ログの確認方法

### 4. トラブルシューティング
- よくあるエラーと対処法一覧

## サンプルコード

### Apps Script カスタムステップ例

```javascript
/**
 * カスタムステップの例：データ処理
 * @param {Object} input - エージェントからの入力
 * @return {Object} 処理結果
 */
function processData(input) {
  try {
    // 入力データを処理
    const result = {
      processed: true,
      summary: '処理完了',
      timestamp: new Date().toISOString(),
      data: input
    };
    return result;
  } catch (error) {
    return {
      processed: false,
      error: error.message
    };
  }
}

/**
 * カスタムステップの例：外部API連携
 * @param {string} endpoint - APIエンドポイント
 * @param {Object} payload - 送信データ
 * @return {Object} API応答
 */
function callExternalApi(endpoint, payload) {
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(endpoint, options);
    return JSON.parse(response.getContentText());
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

## 参考リンク

- [Extend Google Workspace Studio](https://developers.google.com/workspace/add-ons/studio)
- [Workspace Studio ヘルプ](https://support.google.com/workspace-studio/)
- [管理者向けヘルプ](https://support.google.com/a/answer/16703803)
- [セキュリティとプライバシー](https://workspace.google.com/security/)

## 講座全体の参考リンク

### 公式ドキュメント
- [Google Workspace Studio 公式](https://workspace.google.com/studio/)
- [公式ブログ発表](https://workspace.google.com/blog/product-announcements/introducing-google-workspace-studio-agents-for-everyday-work)
- [Workspace Updates ブログ](https://workspaceupdates.googleblog.com/2025/12/workspace-studio.html)

### ヘルプ・サポート
- [Workspace Studio ヘルプセンター](https://support.google.com/workspace-studio/)
- [Getting Started Guide](https://support.google.com/workspace-studio/answer/16444479)
- [Access Requirements](https://support.google.com/workspace-studio/answer/16782648)

### 開発者向け
- [Apps Script for Studio](https://developers.google.com/workspace/add-ons/studio)
- [Build a calculator step](https://developers.google.com/workspace/add-ons/studio/quickstart)

### コミュニティ
- [Google Workspace Community](https://www.googlecloudcommunity.com/gc/Workspace)
