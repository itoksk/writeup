const pptxgen = require('pptxgenjs');
const html2pptx = require('/Users/keisuke/.claude/plugins/marketplaces/anthropics-skills/document-skills/pptx/scripts/html2pptx.js');
const fs = require('fs');

async function createSlides() {

  // Slide 1: Title
  fs.writeFileSync('slide-01.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex;
  background: #2563EB;
  align-items: center; justify-content: center; font-family: Arial, sans-serif; }
.content { text-align: center; color: #fff; padding: 40pt; }
h1 { font-size: 48pt; margin: 0 0 20pt 0; font-weight: bold; line-height: 1.2; }
h2 { font-size: 24pt; margin: 0 0 30pt 0; font-weight: normal; }
p { font-size: 16pt; margin: 5pt 0; }
</style></head><body>
<div class="content">
  <h1>GAS×生成AIでつくる！<br>事務職のための業務Webアプリ内製化講座</h1>
  <h2>プログラミング未経験でも47分で実用アプリが作れる</h2>
  <p>全5回 | 各9-10分 | 無料で実践可能</p>
</div>
</body></html>`);

  // Slide 2: Problems
  fs.writeFileSync('slide-02.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; font-family: Arial, sans-serif; }
.content { margin: 40pt; flex: 1; }
h1 { color: #2563EB; font-size: 36pt; margin: 0 0 30pt 0; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.problem { margin: 0 0 20pt 0; padding-left: 15pt; }
.problem h3 { color: #1F2937; font-size: 18pt; margin: 0 0 5pt 0; }
.problem p { color: #6B7280; font-size: 14pt; margin: 0; line-height: 1.4; }
</style></head><body>
<div class="content">
  <h1>こんな課題を抱えていませんか？</h1>
  <div class="problem">
    <h3>📄 紙やExcelで情報が分散している</h3>
    <p>→ 必要な情報を探すだけで時間がかかる</p>
  </div>
  <div class="problem">
    <h3>⏰ 定型業務の手入力が多い</h3>
    <p>→ 日報作成：月5時間 | 見積書作成：月3.3時間</p>
    <p>→ 合計：月12.3時間の非効率作業</p>
  </div>
  <div class="problem">
    <h3>❌ 転記ミスが発生する</h3>
    <p>→ 月3〜5件の記載漏れ・転記ミス</p>
  </div>
  <div class="problem">
    <h3>🔒 業務が属人化している</h3>
    <p>→ 担当者しか分からず引き継ぎが困難</p>
  </div>
</div>
</body></html>`);

  // Slide 3: Before/After
  fs.writeFileSync('slide-03.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 20pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.cols { display: flex; gap: 20pt; margin: 0 40pt; flex: 1; }
.col { flex: 1; }
.col h2 { font-size: 24pt; margin: 0 0 15pt 0; text-align: center; }
.before h2 { color: #DC2626; }
.after h2 { color: #10B981; }
.col ul { list-style: none; padding: 0; margin: 0; }
.col li { padding: 8pt 0; font-size: 14pt; line-height: 1.4; }
.highlight { background: #FEF3C7; padding: 15pt; margin-top: 15pt; border-left: 4pt solid #F59E0B; }
.highlight p { margin: 0; font-size: 16pt; font-weight: bold; color: #92400E; }
</style></head><body>
<h1>この講座で実現できること（Before / After）</h1>
<div class="cols">
  <div class="col before">
    <h2>❌ Before（現状）</h2>
    <ul>
      <li>日報作成：15分/回</li>
      <li>データ集計：30分/回</li>
      <li>見積書作成：20分/回</li>
      <li>転記ミス：月3〜5件</li>
      <li>属人化で引き継ぎ困難</li>
      <li>IT部門に依存</li>
    </ul>
  </div>
  <div class="col after">
    <h2>✅ After（受講後）</h2>
    <ul>
      <li>日報作成：10分/回（33%削減）</li>
      <li>データ集計：5分/回（83%削減）</li>
      <li>見積書作成：5分/回（75%削減）</li>
      <li>転記ミス：ほぼゼロ</li>
      <li>自分でアプリ内製可能</li>
      <li>IT部門不要</li>
    </ul>
  </div>
</div>
<div class="highlight" style="margin: 0 40pt 30pt;">
  <p>合計削減時間：月8.3時間 → 年間約100時間の業務削減！</p>
</div>
</body></html>`);

  // Slide 4: Overview
  fs.writeFileSync('slide-04.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 20pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.grid { display: flex; flex-wrap: wrap; gap: 15pt; margin: 0 40pt 30pt; }
.box { flex: 0 0 calc(50% - 7.5pt); background: #F3F4F6; padding: 15pt; border-left: 4pt solid #7C3AED; }
.box h2 { color: #1F2937; font-size: 18pt; margin: 0 0 10pt 0; }
.box ul { margin: 0; padding: 0 0 0 15pt; }
.box li { font-size: 13pt; color: #4B5563; line-height: 1.6; }
</style></head><body>
<h1>講座の概要</h1>
<div class="grid">
  <div class="box">
    <h2>📋 対象者</h2>
    <ul>
      <li>プログラミング未経験の事務職</li>
      <li>業務効率化に関心がある方</li>
      <li>Google Workspaceユーザー</li>
    </ul>
  </div>
  <div class="box">
    <h2>⏱️ 学習時間</h2>
    <ul>
      <li>全5回、合計47分</li>
      <li>1回あたり9〜10分</li>
      <li>スキマ時間で学習可能</li>
    </ul>
  </div>
  <div class="box">
    <h2>🛠️ 使用ツール（すべて無料）</h2>
    <ul>
      <li>Google Apps Script (GAS)</li>
      <li>ChatGPT / Gemini / Claude</li>
      <li>Googleフォーム、スプレッドシート</li>
    </ul>
  </div>
  <div class="box">
    <h2>💻 必要な環境</h2>
    <ul>
      <li>Webブラウザのみ</li>
      <li>Googleアカウント</li>
      <li>プログラミング経験：不要</li>
    </ul>
  </div>
</div>
</body></html>`);

  // Slide 5: Curriculum 1-3
  fs.writeFileSync('slide-05.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.lesson { background: #F9FAFB; margin: 0 40pt 12pt; padding: 15pt; border-left: 6pt solid #7C3AED; }
.lesson h2 { color: #1F2937; font-size: 16pt; margin: 0 0 8pt 0; }
.lesson p { color: #6B7280; font-size: 13pt; margin: 0; line-height: 1.5; }
.goal { color: #7C3AED; font-weight: bold; margin-bottom: 5pt; }
</style></head><body>
<h1>カリキュラム（全5回）</h1>
<div class="lesson">
  <h2>第1回：GAS×AIで業務アプリを構築！まず必要な準備とは？（9分）</h2>
  <p class="goal">🎯 目標：GAS×AIの全体像を理解し、開発の流れをイメージ</p>
  <p>現場の課題提示 | Before/Afterで変化を数値提示 | ChatGPT・Geminiで仕様案作成（デモ）</p>
</div>
<div class="lesson">
  <h2>第2回：AIと一緒に作る！日報管理アプリの下書き生成（10分）</h2>
  <p class="goal">🎯 目標：Googleフォーム作成、AIでGASコード生成</p>
  <p>Googleフォーム作成 | ChatGPTでGASコード生成 | コード解説：onFormSubmit、データ取得</p>
</div>
<div class="lesson">
  <h2>第3回：完成！GASで動く日報アプリとGoogleサイト公開（9分）</h2>
  <p class="goal">🎯 目標：トリガー設定で自動化を完成させ、公開</p>
  <p>トリガー設定 | 動作確認（フォーム送信→自動転記）| Googleサイト作成・公開</p>
</div>
</body></html>`);

  // Slide 6: Curriculum 4-5
  fs.writeFileSync('slide-06.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 20pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.lesson { background: #F9FAFB; margin: 0 40pt 20pt; padding: 20pt; border-left: 6pt solid #7C3AED; }
.lesson h2 { color: #1F2937; font-size: 18pt; margin: 0 0 10pt 0; }
.lesson p { color: #6B7280; font-size: 14pt; margin: 0; line-height: 1.6; }
.goal { color: #7C3AED; font-weight: bold; margin-bottom: 8pt; }
</style></head><body>
<h1>カリキュラム（全5回）- 続き</h1>
<div class="lesson">
  <h2>第4回：見積書をAIに作らせる！Docsテンプレート×GAS自動化（10分）</h2>
  <p class="goal">🎯 目標：Google Docsテンプレート、GASで自動差し込み・PDF生成</p>
  <p>Docsテンプレート作成（{{変数名}}形式）| ChatGPTでGASコード生成 | データ差し込み・PDF化・Drive保存 | 応用例：請求書、契約書など</p>
</div>
<div class="lesson">
  <h2>第5回：AIはどれが使いやすい？3ツール徹底比較（9分）</h2>
  <p class="goal">🎯 目標：Claude・Gemini・ChatGPTの特徴を理解し、使い分け</p>
  <p>3AI比較実演（GASコード生成・仕様書作成・トラブルシューティング）| 使い分けテーブル | ChatGPT：速く簡潔 | Gemini：日本語対応、表形式 | Claude：詳細で網羅的</p>
</div>
</body></html>`);

  // Slide 7: Learning Outcomes
  fs.writeFileSync('slide-07.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.step { margin: 0 40pt 15pt; padding: 15pt; background: #EFF6FF; border-left: 6pt solid #3B82F6; }
.step h2 { color: #1E40AF; font-size: 18pt; margin: 0 0 8pt 0; }
.step ul { margin: 0; padding: 0 0 0 15pt; }
.step li { font-size: 14pt; color: #1F2937; line-height: 1.6; }
.arrow { text-align: center; font-size: 24pt; color: #7C3AED; margin: 5pt 0; }
.final { background: #F0FDF4; border-left: 6pt solid #10B981; margin: 0 40pt 30pt; padding: 15pt; text-align: center; }
.final p { margin: 0; font-size: 18pt; font-weight: bold; color: #065F46; }
</style></head><body>
<h1>学習成果・到達目標</h1>
<div class="step">
  <h2>第1回受講後</h2>
  <ul>
    <li>GAS×AIの全体像を理解</li>
    <li>開発の流れをイメージ可能</li>
  </ul>
</div>
<div class="arrow">↓</div>
<div class="step">
  <h2>第3回受講後</h2>
  <ul>
    <li>日報アプリを自力で構築・公開可能</li>
    <li>Googleフォーム + GAS + スプレッドシートの連携をマスター</li>
  </ul>
</div>
<div class="arrow">↓</div>
<div class="step">
  <h2>第5回受講後（完走）</h2>
  <ul>
    <li>自分の業務に合わせたアプリを設計・構築可能</li>
    <li>ChatGPT / Gemini / Claudeの選択と使い分けが可能</li>
  </ul>
</div>
<div class="final">
  <p>🎓 事務職がIT部門に依存せず、自力で業務アプリを内製できるようになる</p>
</div>
</body></html>`);

  // Slide 8: Tech Stack
  fs.writeFileSync('slide-08.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
table { margin: 0 40pt; border-collapse: collapse; width: calc(100% - 80pt); }
th { background: #7C3AED; color: #fff; padding: 12pt; text-align: left; font-size: 16pt; border: 1pt solid #6D28D9; }
td { padding: 10pt; font-size: 14pt; border: 1pt solid #E5E7EB; }
tr:nth-child(even) { background: #F9FAFB; }
.highlight { background: #FEF3C7; padding: 12pt; margin: 15pt 40pt 30pt; border-left: 4pt solid #F59E0B; }
.highlight p { margin: 0; font-size: 14pt; font-weight: bold; color: #92400E; }
</style></head><body>
<h1>技術構成（すべて無料で利用可能）</h1>
<table>
  <tr><th>要素</th><th>ツール</th><th>特徴</th></tr>
  <tr><td>フロントエンド</td><td>Googleフォーム</td><td>無料、ノーコード、データ自動集計</td></tr>
  <tr><td>バックエンド</td><td>Google Apps Script</td><td>無料、JavaScript、Google Workspace連携</td></tr>
  <tr><td>データベース</td><td>Googleスプレッドシート</td><td>無料、自動集計、リアルタイム同期</td></tr>
  <tr><td>ドキュメント</td><td>Google Docs</td><td>無料、テンプレート機能、PDF変換</td></tr>
  <tr><td>公開</td><td>Googleサイト</td><td>無料、埋め込み機能、社内共有</td></tr>
  <tr><td>AI支援</td><td>ChatGPT/Gemini/Claude</td><td>コード生成、仕様案作成</td></tr>
</table>
<div class="highlight">
  <p>💡 すべてGoogle Workspaceの無料機能で実現 | 追加費用ゼロで実用的なアプリが作れる</p>
</div>
</body></html>`);

  // Slide 9: Implementation Patterns
  fs.writeFileSync('slide-09.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 20pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.patterns { display: flex; gap: 20pt; margin: 0 40pt; }
.pattern { flex: 1; background: #F9FAFB; padding: 20pt; border: 2pt solid #E5E7EB; }
.pattern h2 { color: #7C3AED; font-size: 18pt; margin: 0 0 15pt 0; text-align: center; }
.flow { list-style: none; padding: 0; margin: 0; }
.flow li { padding: 8pt; margin: 8pt 0; background: #fff; border-left: 4pt solid #10B981; font-size: 14pt; text-align: center; }
.arrow { text-align: center; font-size: 20pt; color: #10B981; margin: 5pt 0; }
</style></head><body>
<h1>実装パターン</h1>
<div class="patterns">
  <div class="pattern">
    <h2>パターン1：日報管理システム</h2>
    <ul class="flow">
      <li>Googleフォーム入力</li>
      <li class="arrow">↓</li>
      <li>トリガー起動</li>
      <li class="arrow">↓</li>
      <li>GASコード実行</li>
      <li class="arrow">↓</li>
      <li>スプレッドシート保存</li>
      <li class="arrow">↓</li>
      <li>Googleサイト表示</li>
    </ul>
  </div>
  <div class="pattern">
    <h2>パターン2：見積書自動生成</h2>
    <ul class="flow">
      <li>データ準備</li>
      <li class="arrow">↓</li>
      <li>GASコード実行</li>
      <li class="arrow">↓</li>
      <li>Docsテンプレート読込</li>
      <li class="arrow">↓</li>
      <li>データ差し込み</li>
      <li class="arrow">↓</li>
      <li>PDF化・Drive保存</li>
    </ul>
  </div>
</div>
</body></html>`);

  // Slide 10: Daily Report System
  fs.writeFileSync('slide-10.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 28pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.demo { display: flex; gap: 15pt; margin: 0 40pt 15pt; align-items: center; }
.box { flex: 1; background: #F3F4F6; padding: 15pt; border: 2pt solid #D1D5DB; min-height: 100pt; }
.box h2 { color: #1F2937; font-size: 14pt; margin: 0 0 10pt 0; text-align: center; }
.box p { font-size: 12pt; color: #4B5563; margin: 5pt 0; line-height: 1.4; }
.arrow { font-size: 24pt; color: #10B981; }
.results { background: #ECFDF5; padding: 12pt; margin: 0 40pt 20pt; border-left: 4pt solid #10B981; }
.results ul { margin: 5pt 0 0 0; padding: 0 0 0 15pt; }
.results li { font-size: 14pt; color: #065F46; line-height: 1.6; }
</style></head><body>
<h1>実装例1：日報管理システム</h1>
<div class="demo">
  <div class="box">
    <h2>📝 入力画面</h2>
    <p>日付：2025/10/27</p>
    <p>氏名：山田太郎</p>
    <p>業務内容：[入力欄]</p>
    <p>所感：[入力欄]</p>
    <p style="text-align: center; margin-top: 10pt;">[送信]</p>
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <h2>📊 集計画面</h2>
    <p>日付 | 氏名 | 業務内容 | 所感</p>
    <p style="border-top: 1pt solid #D1D5DB; padding-top: 5pt;">2025/10/27 | 山田太郎 | ...</p>
    <p>2025/10/27 | 佐藤花子 | ...</p>
  </div>
  <div class="arrow">→</div>
  <div class="box">
    <h2>🌐 閲覧画面</h2>
    <p>チーム全員が</p>
    <p>リアルタイムで</p>
    <p>閲覧可能</p>
  </div>
</div>
<div class="results">
  <p style="font-weight: bold; color: #065F46; margin: 0 0 5pt 0;">効果</p>
  <ul>
    <li>作成時間：33%削減</li>
    <li>集計時間：83%削減</li>
    <li>リアルタイム共有</li>
  </ul>
</div>
</body></html>`);

  // Slide 11: Quote Generator
  fs.writeFileSync('slide-11.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 28pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.demo { margin: 0 40pt 15pt; }
.step { display: flex; gap: 15pt; align-items: center; margin-bottom: 15pt; }
.box { flex: 1; background: #F3F4F6; padding: 15pt; border: 2pt solid #D1D5DB; }
.box h2 { color: #1F2937; font-size: 14pt; margin: 0 0 8pt 0; text-align: center; }
.box p { font-size: 12pt; color: #4B5563; margin: 3pt 0; line-height: 1.3; }
.arrow { font-size: 20pt; color: #10B981; }
.results { background: #ECFDF5; padding: 12pt; margin: 0 40pt 20pt; border-left: 4pt solid #10B981; }
.results ul { margin: 5pt 0 0 0; padding: 0 0 0 15pt; }
.results li { font-size: 14pt; color: #065F46; line-height: 1.6; }
</style></head><body>
<h1>実装例2：見積書自動生成システム</h1>
<div class="demo">
  <div class="step">
    <div class="box">
      <h2>📊 データ準備</h2>
      <p>顧客名 | 商品 | 数量 | 単価</p>
      <p style="border-top: 1pt solid #D1D5DB; padding-top: 3pt;">A社 | 商品X | 10 | 1000</p>
    </div>
    <div class="arrow">→</div>
    <div class="box">
      <h2>📝 テンプレート</h2>
      <p>見積書</p>
      <p>{{顧客名}} 御中</p>
      <p>商品：{{商品}}</p>
      <p>合計：{{合計}}円</p>
    </div>
  </div>
  <div class="arrow" style="text-align: center; margin: 10pt 0;">↓</div>
  <div class="box" style="max-width: 300pt; margin: 0 auto;">
    <h2>📄 PDF出力</h2>
    <p style="text-align: center;">完成したPDFが</p>
    <p style="text-align: center;">Google Driveに自動保存</p>
  </div>
</div>
<div class="results">
  <p style="font-weight: bold; color: #065F46; margin: 0 0 5pt 0;">効果</p>
  <ul>
    <li>作成時間：75%削減</li>
    <li>転記ミス：ほぼゼロ</li>
    <li>一括生成可能</li>
  </ul>
</div>
</body></html>`);

  // Slide 12: AI Comparison
  fs.writeFileSync('slide-12.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 28pt; margin: 25pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.comparison { display: flex; gap: 15pt; margin: 0 40pt 15pt; }
.ai { flex: 1; background: #F9FAFB; padding: 15pt; border-top: 4pt solid #7C3AED; }
.ai h2 { color: #7C3AED; font-size: 18pt; margin: 0 0 10pt 0; text-align: center; }
.ai ul { margin: 0; padding: 0 0 0 15pt; }
.ai li { font-size: 13pt; color: #1F2937; line-height: 1.6; }
table { margin: 0 40pt; border-collapse: collapse; width: calc(100% - 80pt); font-size: 12pt; }
th { background: #7C3AED; color: #fff; padding: 8pt; text-align: left; border: 1pt solid #6D28D9; }
td { padding: 8pt; border: 1pt solid #E5E7EB; }
tr:nth-child(even) { background: #F9FAFB; }
</style></head><body>
<h1>AI使い分けガイド</h1>
<div class="comparison">
  <div class="ai">
    <h2>ChatGPT</h2>
    <ul>
      <li>速く簡潔</li>
      <li>コード生成が得意</li>
      <li>実用的な回答</li>
    </ul>
  </div>
  <div class="ai">
    <h2>Gemini</h2>
    <ul>
      <li>日本語対応が自然</li>
      <li>表形式で分かりやすい</li>
      <li>Google連携</li>
    </ul>
  </div>
  <div class="ai">
    <h2>Claude</h2>
    <ul>
      <li>詳細で網羅的</li>
      <li>セキュリティ配慮</li>
      <li>丁寧な説明</li>
    </ul>
  </div>
</div>
<table>
  <tr><th>目的</th><th>推奨AI</th><th>理由</th></tr>
  <tr><td>コード生成</td><td>ChatGPT</td><td>簡潔で実用的</td></tr>
  <tr><td>仕様書作成</td><td>Gemini</td><td>表形式、日本語自然</td></tr>
  <tr><td>詳細説明・学習</td><td>Claude</td><td>セキュリティ配慮、丁寧</td></tr>
</table>
</body></html>`);

  // Slide 13: Target Audience
  fs.writeFileSync('slide-13.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.cols { display: flex; gap: 20pt; margin: 0 40pt 15pt; }
.col { flex: 1; }
.col h2 { color: #1F2937; font-size: 20pt; margin: 0 0 15pt 0; }
.col ul { margin: 0; padding: 0 0 0 15pt; }
.col li { font-size: 14pt; line-height: 1.8; color: #4B5563; }
.ok { color: #10B981; }
.no { color: #DC2626; }
.required { background: #DBEAFE; padding: 15pt; margin: 0 40pt 30pt; border-left: 4pt solid #2563EB; }
.required h2 { color: #1E40AF; font-size: 18pt; margin: 0 0 10pt 0; }
.required ul { margin: 0; padding: 0 0 0 15pt; }
.required li { font-size: 14pt; color: #1E40AF; line-height: 1.6; }
</style></head><body>
<h1>受講対象者</h1>
<div class="cols">
  <div class="col">
    <h2>こんな方におすすめ</h2>
    <ul>
      <li><span class="ok">✅</span> 事務職で業務効率化に関心がある方</li>
      <li><span class="ok">✅</span> プログラミング未経験だが学んでみたい方</li>
      <li><span class="ok">✅</span> Google Workspaceを使用している方</li>
      <li><span class="ok">✅</span> 日報・見積書を自動化したい方</li>
      <li><span class="ok">✅</span> IT部門に依存せず改善したい方</li>
    </ul>
  </div>
  <div class="col">
    <h2>不要なスキル・環境</h2>
    <ul>
      <li><span class="no">❌</span> プログラミング経験</li>
      <li><span class="no">❌</span> IT専門知識</li>
      <li><span class="no">❌</span> 有料ツール・ソフト</li>
      <li><span class="no">❌</span> 高スペックPC</li>
      <li><span class="no">❌</span> IT部門のサポート</li>
    </ul>
  </div>
</div>
<div class="required">
  <h2>必要なもの</h2>
  <ul>
    <li>Webブラウザ</li>
    <li>Googleアカウント</li>
    <li>学ぶ意欲</li>
  </ul>
</div>
</body></html>`);

  // Slide 14: FAQ 1
  fs.writeFileSync('slide-14.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 25pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.qa { margin: 0 40pt 15pt; padding: 15pt; background: #F9FAFB; border-left: 4pt solid #7C3AED; }
.qa h2 { color: #7C3AED; font-size: 16pt; margin: 0 0 8pt 0; }
.qa p { color: #1F2937; font-size: 14pt; margin: 0; line-height: 1.5; }
</style></head><body>
<h1>よくある質問（Q&A）</h1>
<div class="qa">
  <h2>Q1. プログラミング経験がなくても大丈夫ですか？</h2>
  <p>A1. はい、大丈夫です。AIがコードを生成してくれるので、コピー&ペーストができれば実装可能です。動画で丁寧に解説しているため、未経験者でも安心して学べます。</p>
</div>
<div class="qa">
  <h2>Q2. 費用はかかりますか？</h2>
  <p>A2. 無料で受講できます。使用するツールもすべてGoogle Workspaceの無料機能なので、追加費用は一切かかりません。</p>
</div>
<div class="qa">
  <h2>Q3. どれくらいの時間で学習できますか？</h2>
  <p>A3. 全5回、合計47分です。1回あたり9〜10分なので、通勤時間やお昼休みなど、スキマ時間で学習を進められます。</p>
</div>
<div class="qa">
  <h2>Q4. 自分の業務にも応用できますか？</h2>
  <p>A4. はい、応用できます。日報・見積書の例を学べば、請求書、勤怠管理、在庫管理など他の業務アプリにも応用可能です。</p>
</div>
</body></html>`);

  // Slide 15: FAQ 2
  fs.writeFileSync('slide-15.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 25pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.qa { margin: 0 40pt 15pt; padding: 15pt; background: #F9FAFB; border-left: 4pt solid #7C3AED; }
.qa h2 { color: #7C3AED; font-size: 16pt; margin: 0 0 8pt 0; }
.qa p { color: #1F2937; font-size: 14pt; margin: 0; line-height: 1.5; }
</style></head><body>
<h1>よくある質問（Q&A）- 続き</h1>
<div class="qa">
  <h2>Q5. どのAIを使えばいいですか？</h2>
  <p>A5. 第5回の講座で3つのAI（ChatGPT / Gemini / Claude）を徹底比較します。目的別の使い分け方が分かるので、最適なAIを選べるようになります。</p>
</div>
<div class="qa">
  <h2>Q6. IT部門の承認は必要ですか？</h2>
  <p>A6. Google Workspaceを使用している企業であれば、多くの場合は不要です。ただし、企業のポリシーにより異なる場合があるため、事前に確認することを推奨します。</p>
</div>
<div class="qa">
  <h2>Q7. 作成したアプリを他の人と共有できますか？</h2>
  <p>A7. はい、可能です。Googleサイトやスプレッドシートの共有機能を使えば、チームメンバーや部門全体に簡単に共有できます。</p>
</div>
<div class="qa">
  <h2>Q8. 講座のサポートはありますか？</h2>
  <p>A8. 各動画には受講者用教材とAIプロンプト集が付属しています。これらを活用して、復習や実践に役立ててください。</p>
</div>
</body></html>`);

  // Slide 16: Learning Flow
  fs.writeFileSync('slide-16.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.steps { margin: 0 auto; max-width: 500pt; }
.step { margin: 0 0 15pt 0; padding: 15pt; background: #EFF6FF; border-left: 6pt solid #3B82F6; }
.step h2 { color: #1E40AF; font-size: 18pt; margin: 0 0 5pt 0; }
.step p { color: #1F2937; font-size: 14pt; margin: 0; line-height: 1.5; }
.arrow { text-align: center; font-size: 24pt; color: #7C3AED; margin: 5pt 0; }
.tips { background: #FEF3C7; padding: 15pt; margin: 15pt 40pt 30pt; border-left: 4pt solid #F59E0B; }
.tips ul { margin: 5pt 0 0 0; padding: 0 0 0 15pt; }
.tips li { font-size: 14pt; color: #92400E; line-height: 1.6; }
</style></head><body>
<h1>受講の流れ</h1>
<div class="steps">
  <div class="step">
    <h2>STEP 1：動画視聴</h2>
    <p>各動画（9〜10分）を視聴し、全体の流れを把握</p>
  </div>
  <div class="arrow">↓</div>
  <div class="step">
    <h2>STEP 2：教材確認</h2>
    <p>動画と合わせて受講者用教材で復習</p>
  </div>
  <div class="arrow">↓</div>
  <div class="step">
    <h2>STEP 3：実践</h2>
    <p>AIプロンプト集を使って実際に構築</p>
  </div>
  <div class="arrow">↓</div>
  <div class="step">
    <h2>STEP 4：動作確認</h2>
    <p>作成したアプリが正しく動くかテスト</p>
  </div>
  <div class="arrow">↓</div>
  <div class="step">
    <h2>STEP 5：応用</h2>
    <p>学んだ知識を自分の業務に応用</p>
  </div>
</div>
<div class="tips">
  <ul>
    <li>💡 動画を見ながら一緒に手を動かすことを推奨</li>
    <li>💡 分からない箇所は繰り返し視聴できます</li>
  </ul>
</div>
</body></html>`);

  // Slide 17: Summary
  fs.writeFileSync('slide-17.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 15pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.benefits { margin: 0 40pt 15pt; }
.benefits ul { margin: 0; padding: 0 0 0 15pt; }
.benefits li { font-size: 16pt; color: #1F2937; line-height: 1.8; }
.value { background: #F0FDF4; padding: 20pt; margin: 0 40pt 15pt; border-left: 6pt solid #10B981; text-align: center; }
.value h2 { color: #065F46; font-size: 20pt; margin: 0 0 10pt 0; }
.value p { color: #065F46; font-size: 16pt; margin: 0; line-height: 1.6; }
.cta { background: #EFF6FF; padding: 15pt; margin: 0 40pt 30pt; text-align: center; border: 3pt solid #3B82F6; }
.cta p { margin: 0; font-size: 20pt; font-weight: bold; color: #1E40AF; }
</style></head><body>
<h1>まとめ</h1>
<div class="benefits">
  <p style="font-weight: bold; color: #1F2937; margin: 0 0 10pt 0;">この講座で得られること：</p>
  <ul>
    <li>✅ プログラミング未経験でも業務アプリを自力で構築できる</li>
    <li>✅ 月12.3時間の非効率業務を削減（年間約100時間）</li>
    <li>✅ 日報・見積書アプリを47分で習得</li>
    <li>✅ IT部門に依存せず、自分で改善できる力</li>
    <li>✅ ChatGPT / Gemini / Claudeの使い分けスキル</li>
    <li>✅ すべて無料で実践可能</li>
  </ul>
</div>
<div class="value">
  <h2>【最大の価値】</h2>
  <p>事務職が自らITツールを使いこなし、業務を効率化できる「自走力」が身につく</p>
</div>
<div class="cta">
  <p>👉 今すぐ第1回から始めてみましょう！</p>
</div>
</body></html>`);

  // Slide 18: Contact
  fs.writeFileSync('slide-18.html', `<!DOCTYPE html>
<html><head><style>
html { background: #fff; }
body { width: 720pt; height: 405pt; margin: 0; padding: 0; display: flex; flex-direction: column; font-family: Arial, sans-serif; }
h1 { color: #2563EB; font-size: 32pt; margin: 30pt 40pt 20pt; border-bottom: 4pt solid #2563EB; padding-bottom: 10pt; }
.grid { display: flex; flex-direction: column; gap: 15pt; margin: 0 40pt 30pt; }
.box { background: #F9FAFB; padding: 20pt; border-left: 6pt solid #7C3AED; }
.box h2 { color: #1F2937; font-size: 20pt; margin: 0 0 10pt 0; }
.box ul { margin: 0; padding: 0 0 0 15pt; }
.box li { font-size: 14pt; color: #4B5563; line-height: 1.6; }
.box p { font-size: 14pt; color: #4B5563; margin: 5pt 0; line-height: 1.6; }
</style></head><body>
<h1>お問い合わせ・リソース</h1>
<div class="grid">
  <div class="box">
    <h2>📁 講座リソース</h2>
    <ul>
      <li>講座動画：全5回（合計47分）</li>
      <li>受講者用教材：materials.html（各動画フォルダ内）</li>
      <li>AIプロンプト集：prompts.txt（各動画フォルダ内）</li>
      <li>サンプルコード：demo_code/（各動画フォルダ内）</li>
    </ul>
  </div>
  <div class="box">
    <h2>💻 推奨環境</h2>
    <ul>
      <li>Webブラウザ（Chrome、Edge、Safari等）</li>
      <li>Googleアカウント</li>
      <li>インターネット接続</li>
    </ul>
  </div>
</div>
</body></html>`);

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'GAS×AI Course';
  pptx.title = 'GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座';

  for (let i = 1; i <= 18; i++) {
    const file = `slide-${String(i).padStart(2, '0')}.html`;
    console.log(`Processing ${file}...`);
    await html2pptx(file, pptx);
  }

  await pptx.writeFile({ fileName: 'GAS-AI-Course-Presentation.pptx' });
  console.log('Presentation created successfully!');
}

createSlides().catch(console.error);
