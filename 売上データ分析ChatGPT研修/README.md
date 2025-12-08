# 売上データ分析×ChatGPT：需要予測とLooker Studioでのダッシュボード構築

## 1. 想定する現場課題

営業管理部門において、売上データの分析が毎月手作業で実施されており、以下の課題が発生している：
- 月次売上レポート作成に平均4時間/月を要する
- Excel作業による属人化（担当者不在時の対応困難）
- 前年同月比や季節変動の把握が主観的判断に依存
- 予測精度の低さによる在庫管理ミス（月平均15%の誤差）
- 部門間での情報共有遅延（更新から共有まで平均2日）

## 2. 理想の状態（Before/After）

### Before：
- 作業時間：月次レポート作成に4時間、グラフ作成に1時間
- 分析手法：Excelピボットテーブルとフィルター機能による手動集計
- 予測方法：前年同月実績の目視確認と担当者の経験則
- 共有方法：PowerPointスライド作成後、メール配布
- エラー率：データ転記ミス月1〜2件、計算式エラー月1件程度

### After：
- 作業時間：ChatGPTとの対話で30分、ダッシュボード自動更新
- 分析手法：AI支援による傾向分析と異常値検出の自動化
- 予測精度：統計モデルによる予測で誤差を10%以内に改善
- 共有方法：Looker Studioダッシュボードのリアルタイム共有
- エラー率：自動化によりデータ転記ミスゼロ、計算エラー削減

## 3. コース名
売上データ分析×ChatGPT：需要予測とLooker Studioでのダッシュボード構築

## 4. 改善方針

### 技術範囲：
- ChatGPT（GPT-4推奨）：データ分析、コード生成、予測モデル構築支援
- Google Sheets：データ管理基盤
- Looker Studio：ダッシュボード構築
- Python（任意）：ChatGPT生成コードの実行環境

### 段階的導入：
1. CSVデータの基本分析から開始（技術ハードル最小化）
2. 可視化・予測へ段階的に拡張
3. 最終的に自動更新ダッシュボードで運用効率化

### 制約事項：
- 各動画10分以内での実装完結
- 特殊なツール導入不要（無料/既存環境で実現）
- プログラミング未経験者でも実践可能

## 5. 動画タイトル一覧

1. **動画1**：Excelに頼らずChatGPTで売上CSVを読ませる初めの一歩（9分）
2. **動画2**：グラフもAIにおまかせPythonコードをChatGPTに書かせる技術（10分）
3. **動画3**：来月の売上を当てろChatGPTに予測させるプロンプト術（10分）
4. **動画4**：作業ゼロで見える化LookerStudioで自動更新ダッシュボード（9分）
5. **動画5**：ChatGPTがうまく働かない指示ミスを防ぐ5つの型（8分）

## 6. ディレクトリ構造

```
売上データ分析ChatGPT研修/
├── README.md
├── 動画1_Excelに頼らずChatGPTで売上CSVを読ませる初めの一歩/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       └── sales_data_monthly.csv
├── 動画2_グラフもAIにおまかせPythonコードをChatGPTに書かせる技術/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       ├── visualization.py
│       └── sales_data_monthly.csv
├── 動画3_来月の売上を当てろChatGPTに予測させるプロンプト術/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       ├── prediction_model.py
│       └── sales_data_monthly.csv
├── 動画4_作業ゼロで見える化LookerStudioで自動更新ダッシュボード/
│   ├── script.md
│   ├── materials.html
│   ├── prompts.txt
│   └── demo_code/
│       └── dashboard_config.txt
└── 動画5_ChatGPTがうまく働かない指示ミスを防ぐ5つの型/
    ├── script.md
    ├── materials.html
    ├── prompts.txt
    └── demo_code/
        └── prompt_templates.txt
```

## 7. 使用ツール・技術要素

### 必須ツール：
- ChatGPT（GPT-4推奨、GPT-3.5でも可）
- Google Sheets（無料）
- Looker Studio（無料）
- Webブラウザ

### 任意ツール：
- Google Colab（Pythonコード実行用、無料）
- Visual Studio Code（コード編集用）

### 学習技術：
- プロンプトエンジニアリング基礎
- CSV/データ分析の基本概念
- 簡易的な予測モデルの理解
- ダッシュボード設計の基礎

## 8. 作成ファイル一覧

### 共通ファイル：
- **script.md**：講師用台本（導入から締めまでの詳細セリフ）
- **materials.html**：受講者配布用教材（スライド形式）
- **prompts.txt**：実践用プロンプト集
- **demo_code/**：デモンストレーション用ファイル群

### 特殊ファイル：
- **sales_data_monthly.csv**：サンプル売上データ
- **visualization.py**：グラフ化コード例
- **prediction_model.py**：予測モデルコード例
- **dashboard_config.txt**：Looker Studio設定手順
- **prompt_templates.txt**：プロンプトテンプレート集

## 9. 期待される成果

### 定量的成果：
- レポート作成時間：80%削減（4時間→45分）
- 予測精度向上：誤差率15%→10%以内
- 情報共有速度：2日→即時反映

### 定性的成果：
- データドリブンな意思決定文化の醸成
- 部門間コミュニケーションの活性化
- 分析業務の標準化と属人化解消
- AI活用スキルの組織内展開