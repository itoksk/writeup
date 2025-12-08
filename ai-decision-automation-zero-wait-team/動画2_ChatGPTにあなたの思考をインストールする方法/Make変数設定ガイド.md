# Make変数設定ガイド - プロンプト管理の効率化

## 🎯 なぜMake変数を使うのか？

プロンプトをMakeシナリオ内に直接書くと：
- ❌ 修正のたびにシナリオを編集
- ❌ バージョン管理が困難
- ❌ 複数シナリオで同じプロンプトを使い回せない

Make変数を使えば：
- ✅ プロンプトを外部で一元管理
- ✅ 更新が即座に反映
- ✅ A/Bテストが簡単
- ✅ チーム共有が容易

## 📋 設定手順

### Step 1: Data Storeの作成

1. Makeダッシュボードで「Data stores」を選択
2. 「Add data store」をクリック
3. 設定：
   ```
   Data store name: AI承認プロンプト管理
   Data structure: 新規作成
   ```

4. Data structureの設定：
   ```
   フィールド1:
   - Name: prompt_id
   - Type: text
   - Required: Yes
   
   フィールド2:
   - Name: prompt_content
   - Type: text
   - Required: Yes
   
   フィールド3:
   - Name: version
   - Type: text
   - Required: Yes
   
   フィールド4:
   - Name: updated_at
   - Type: date
   - Required: Yes
   ```

### Step 2: プロンプトの登録

1. 作成したData Storeを開く
2. 「Add item」でプロンプトを追加：
   ```
   prompt_id: approval_v2
   prompt_content: [プロンプト全文を貼り付け]
   version: 2.0
   updated_at: [現在の日時]
   ```

### Step 3: シナリオでの使用

#### 3.1 Data Store検索モジュールを追加
1. シナリオの最初に「Data store - Search Records」を追加
2. 設定：
   ```
   Data store: AI承認プロンプト管理
   Filter: prompt_id = approval_v2
   Limit: 1
   ```

#### 3.2 ChatGPTモジュールで変数を参照
1. System Messageフィールドで：
   ```
   {{1.prompt_content}}
   ```
   （1はData Storeモジュールの番号）

## 🔄 Variables機能を使った簡易版

### より簡単な方法：Scenario Variables

1. シナリオ設定画面で「Variables」タブを開く
2. 「Add variable」をクリック
3. 設定：
   ```
   Variable name: APPROVAL_PROMPT
   Variable value: [プロンプト全文]
   ```

4. ChatGPTモジュールで使用：
   ```
   {{var.APPROVAL_PROMPT}}
   ```

## 📊 A/Bテストの実装

### 複数バージョンの管理

1. Data Storeに複数バージョンを登録：
   - approval_v2_conservative（保守的判断）
   - approval_v2_aggressive（積極的判断）

2. Routerモジュールで振り分け：
   ```
   Route 1: 50%の確率 → approval_v2_conservative
   Route 2: 50%の確率 → approval_v2_aggressive
   ```

3. 結果を記録して比較分析

## 🛠️ 実践的な活用例

### 環境別プロンプト管理

```javascript
// 開発環境
prompt_id: approval_dev
content: デバッグ情報を含む詳細なプロンプト

// 本番環境  
prompt_id: approval_prod
content: 最適化された本番用プロンプト
```

### 部署別カスタマイズ

```javascript
// 営業部用
prompt_id: approval_sales
content: 売上重視の判断基準

// 技術部用
prompt_id: approval_tech
content: 技術的価値を重視した判断基準
```

## 💡 ベストプラクティス

### 1. バージョン管理
- セマンティックバージョニング（2.0.1）を使用
- 変更履歴をコメントで記録
- 重要な変更は新しいprompt_idで作成

### 2. バックアップ
- 定期的にプロンプトをエクスポート
- Gitなどでテキストファイルとしても管理
- 変更前に必ず現行版を保存

### 3. テスト
- 新バージョンは必ず少数でテスト
- 段階的にトラフィックを増やす
- KPIを設定して効果測定

## 🔧 トラブルシューティング

### よくある問題

| 問題 | 原因 | 解決方法 |
|------|------|----------|
| 変数が反映されない | キャッシュ | シナリオを再起動 |
| 文字化け | エンコーディング | UTF-8で保存 |
| 変数が見つからない | スコープ違い | 変数の参照方法を確認 |
| 更新が遅い | 同期タイミング | 手動で再実行 |

### デバッグ方法

1. **変数の中身を確認**
   ```
   一時的にSetVariableモジュールで出力
   ```

2. **ログで追跡**
   ```
   各モジュールの実行履歴で変数の値を確認
   ```

## 📈 効果測定

### メトリクス例
- プロンプト更新頻度: 週___回
- A/Bテスト実施数: 月___回
- 判断精度の改善率: ___%
- メンテナンス時間削減: ___%

### ROI計算
```
導入前: プロンプト修正に30分 × 週5回 = 150分/週
導入後: 一括更新5分 × 週1回 = 5分/週
削減時間: 145分/週 = 月580分の削減
```

---

これで、プロンプトの管理が格段に楽になり、継続的な改善が可能になります！