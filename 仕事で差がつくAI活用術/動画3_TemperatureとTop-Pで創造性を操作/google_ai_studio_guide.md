# Google AI Studio での Temperature & Top-P 設定ガイド

## Google AI Studio へのアクセス

1. **アクセス方法**
   - ブラウザで [Google AI Studio](https://aistudio.google.com/) にアクセス
   - Googleアカウントでログイン
   - 無料で利用可能（API利用制限あり）

## パラメータ設定方法

### 設定場所
Google AI Studioの右側パネル「Run settings」内で調整可能

### Temperature設定
- **場所**: Run settings → Temperature
- **範囲**: 0.0 〜 2.0
- **デフォルト**: 1.0
- **スライダー**で直感的に調整可能

### Top-P設定
- **場所**: Run settings → Top-P
- **範囲**: 0.0 〜 1.0
- **デフォルト**: 0.95
- **数値入力**またはスライダーで調整

### Top-K設定（Google AI Studio特有）
- **場所**: Run settings → Top-K
- **範囲**: 1 〜 40
- **デフォルト**: 40
- **説明**: 選択可能な単語数を制限

## 実践演習：Google AI Studio版

### 演習1：アイスクリームフレーバー生成

#### ステップ1：保守的な設定
```
設定:
- Model: Gemini 1.5 Flash または Gemini 1.5 Pro
- Temperature: 0.2
- Top-P: 0.3
- Top-K: 10

プロンプト:
新しいアイスクリームのフレーバーを5つ提案してください。
```

**期待される結果**: 一般的で安全なフレーバー（バニラ、チョコレート、ストロベリーなど）

#### ステップ2：バランス設定
```
設定:
- Temperature: 0.7
- Top-P: 0.5
- Top-K: 20

同じプロンプトを実行
```

**期待される結果**: 日本らしい独創的なフレーバー（抹茶ラテ、黒ごまきなこなど）

#### ステップ3：創造的な設定
```
設定:
- Temperature: 1.5
- Top-P: 0.9
- Top-K: 40

同じプロンプトを実行
```

**期待される結果**: 斬新で予想外のフレーバー（わさびチョコ、味噌カラメルなど）

---

## Google AI Studio 特有の機能

### 1. モデル選択
```
推奨設定:
- Gemini 1.5 Flash: 高速レスポンス重視
- Gemini 1.5 Pro: 品質重視
```

### 2. System Instructions（システム指示）
```
例:
あなたは創造的なマーケティング専門家です。
斬新でインパクトのあるアイデアを提案してください。
```

### 3. Safety Settings（安全性設定）
- Harassment: Block none / Block few / Block some / Block most
- Hate Speech: 同上
- Sexually Explicit: 同上
- Dangerous Content: 同上

創造的な出力が必要な場合は「Block few」に設定

---

## タスク別推奨設定（Google AI Studio）

### 正確性重視タスク

#### 契約書・法的文書
```yaml
Model: Gemini 1.5 Pro
Temperature: 0.1
Top-P: 0.2
Top-K: 5
Safety: Block most（全カテゴリ）
```

#### 技術文書・マニュアル
```yaml
Model: Gemini 1.5 Pro
Temperature: 0.3
Top-P: 0.3
Top-K: 10
Safety: Block most
```

### バランス型タスク

#### ビジネスメール
```yaml
Model: Gemini 1.5 Flash
Temperature: 0.5
Top-P: 0.5
Top-K: 20
Safety: Block some
```

#### 報告書・プレゼン資料
```yaml
Model: Gemini 1.5 Pro
Temperature: 0.7
Top-P: 0.6
Top-K: 25
Safety: Block some
```

### 創造性重視タスク

#### マーケティングコピー
```yaml
Model: Gemini 1.5 Pro
Temperature: 1.0
Top-P: 0.8
Top-K: 30
Safety: Block few
```

#### アイデアブレインストーミング
```yaml
Model: Gemini 1.5 Flash
Temperature: 1.5
Top-P: 0.95
Top-K: 40
Safety: Block few
```

---

## 実践ワークショップ

### ワーク1：段階的調整の体験

**題材**: 新商品のキャッチコピー作成

1. **第1段階**: デフォルト設定で生成
   ```
   Temperature: 1.0, Top-P: 0.95, Top-K: 40
   ```

2. **第2段階**: 保守的に調整
   ```
   Temperature: 0.3, Top-P: 0.4, Top-K: 10
   ```

3. **第3段階**: 創造的に調整
   ```
   Temperature: 1.5, Top-P: 0.9, Top-K: 40
   ```

4. **第4段階**: 最適値を探る
   ```
   あなたのタスクに最適な値を見つける
   ```

### ワーク2：同一プロンプト比較実験

**プロンプト**:
```
会社の新年会の企画アイデアを3つ提案してください。
```

**実験パターン**:
| パターン | Temperature | Top-P | Top-K | 期待される出力 |
|---------|------------|-------|-------|--------------|
| A | 0.2 | 0.3 | 10 | 定番の安全な企画 |
| B | 0.7 | 0.6 | 20 | バランスの取れた企画 |
| C | 1.3 | 0.9 | 35 | 斬新で個性的な企画 |

### ワーク3：最適化チャレンジ

**課題**: 以下のタスクに最適な設定を見つける

1. **社内向け業務改善提案書**
   - 目標: 実現可能で具体的な提案
   - ヒント: Temperature低め、Top-P中程度

2. **SNSバズ投稿文**
   - 目標: 話題性とインパクト
   - ヒント: Temperature高め、Top-P高め

3. **顧客向け謝罪メール**
   - 目標: 誠実で型通りな文面
   - ヒント: Temperature最低、Top-P低め

---

## Google AI Studio の Tips

### 1. プロンプトの保存
- 「Save」ボタンで保存可能
- 後で設定込みで呼び出せる

### 2. 履歴機能
- 過去の生成結果を確認可能
- 設定値も記録される

### 3. 比較実験
- 複数タブを開いて並行実験
- 設定の違いを比較しやすい

### 4. エクスポート機能
- コード（Python/JavaScript）として出力
- APIでの実装に活用可能

---

## トラブルシューティング

### 問題: 出力が単調
**解決策**:
1. Temperatureを0.2〜0.3上げる
2. Top-Pを0.1〜0.2上げる
3. Top-Kを10〜15増やす

### 問題: 出力が支離滅裂
**解決策**:
1. Temperatureを0.3〜0.5下げる
2. Top-Pを0.2〜0.3下げる
3. Top-Kを10〜20減らす

### 問題: 同じ出力の繰り返し
**解決策**:
1. 「Generate」を複数回クリック
2. Temperature を少し上げる（+0.1）
3. Random seedを変更（Advanced settings）

---

## まとめ：効果的な活用のために

### 基本原則
1. **目的を明確に**: タスクの性質を理解
2. **段階的に調整**: 極端な値から始めない
3. **複数回生成**: 同じ設定でも結果は変わる
4. **記録を残す**: 最適な設定をメモ

### 実務での活用
- **定型業務**: 低Temperature設定をテンプレート化
- **創造的業務**: 高Temperature設定を基準に微調整
- **品質管理**: 複数の設定で生成し、最良を選択

### 継続的な改善
- 設定値と結果の記録
- チーム内でのベストプラクティス共有
- タスク別の設定ガイドライン作成