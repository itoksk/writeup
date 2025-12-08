const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'GAS×AI Course';
pptx.title = 'GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座';

// Colors
const blue = '2563EB';
const purple = '7C3AED';
const green = '10B981';
const orange = 'F59E0B';
const gray = '6B7280';
const darkGray = '1F2937';

// Slide 1: Title
let slide = pptx.addSlide();
slide.background = { color: blue };
slide.addText('GAS×生成AIでつくる！\n事務職のための業務Webアプリ内製化講座', {
  x: 0.5, y: 1.5, w: 9, h: 2.5,
  fontSize: 40, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle'
});
slide.addText('プログラミング未経験でも47分で実用アプリが作れる', {
  x: 0.5, y: 4, w: 9, h: 0.6,
  fontSize: 20, color: 'FFFFFF', align: 'center'
});
slide.addText('全5回 | 各9-10分 | 無料で実践可能', {
  x: 0.5, y: 4.8, w: 9, h: 0.4,
  fontSize: 14, color: 'FFFFFF', align: 'center'
});

// Slide 2: Problems
slide = pptx.addSlide();
slide.addText('こんな課題を抱えていませんか？', {
  x: 0.5, y: 0.5, w: 9, h: 0.7,
  fontSize: 32, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.3, w: 9, h: 0.02, fill: { color: blue } });

const problems = [
  { icon: '📄', title: '紙やExcelで情報が分散', detail: '→ 必要な情報を探すだけで時間がかかる' },
  { icon: '⏰', title: '定型業務の手入力が多い', detail: '→ 日報・見積書で月12.3時間の非効率作業' },
  { icon: '❌', title: '転記ミスが発生する', detail: '→ 月3〜5件の記載漏れ・転記ミス' },
  { icon: '🔒', title: '業務が属人化している', detail: '→ 担当者しか分からず引き継ぎが困難' }
];

problems.forEach((p, i) => {
  slide.addText(p.icon + ' ' + p.title, {
    x: 0.7, y: 1.7 + i * 0.75, w: 8.5, h: 0.35,
    fontSize: 16, bold: true, color: darkGray
  });
  slide.addText(p.detail, {
    x: 0.7, y: 2 + i * 0.75, w: 8.5, h: 0.3,
    fontSize: 13, color: gray
  });
});

// Slide 3: Before/After
slide = pptx.addSlide();
slide.addText('この講座で実現できること（Before / After）', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

slide.addText('❌ Before（現状）', {
  x: 0.5, y: 1.5, w: 4.3, h: 0.4,
  fontSize: 20, bold: true, color: 'DC2626', align: 'center'
});
slide.addText('✅ After（受講後）', {
  x: 5.2, y: 1.5, w: 4.3, h: 0.4,
  fontSize: 20, bold: true, color: green, align: 'center'
});

const beforeItems = [
  '日報作成：15分/回',
  'データ集計：30分/回',
  '見積書作成：20分/回',
  '転記ミス：月3〜5件',
  '属人化で引き継ぎ困難',
  'IT部門に依存'
];

const afterItems = [
  '日報作成：10分/回（33%削減）',
  'データ集計：5分/回（83%削減）',
  '見積書作成：5分/回（75%削減）',
  '転記ミス：ほぼゼロ',
  '自分でアプリ内製可能',
  'IT部門不要'
];

beforeItems.forEach((item, i) => {
  slide.addText('• ' + item, {
    x: 0.7, y: 2 + i * 0.35, w: 4, h: 0.3,
    fontSize: 13, color: darkGray
  });
});

afterItems.forEach((item, i) => {
  slide.addText('• ' + item, {
    x: 5.4, y: 2 + i * 0.35, w: 4, h: 0.3,
    fontSize: 13, color: darkGray
  });
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.4, w: 9, h: 0.7,
  fill: { color: 'FEF3C7' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.4, w: 0.04, h: 0.7,
  fill: { color: orange }
});
slide.addText('合計削減時間：月8.3時間 → 年間約100時間の業務削減！', {
  x: 0.7, y: 4.5, w: 8.6, h: 0.5,
  fontSize: 16, bold: true, color: '92400E', valign: 'middle'
});

// Slide 4: Overview
slide = pptx.addSlide();
slide.addText('講座の概要', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

const boxes = [
  { title: '📋 対象者', items: ['プログラミング未経験の事務職', '業務効率化に関心がある方', 'Google Workspaceユーザー'] },
  { title: '⏱️ 学習時間', items: ['全5回、合計47分', '1回あたり9〜10分', 'スキマ時間で学習可能'] },
  { title: '🛠️ 使用ツール', items: ['Google Apps Script (GAS)', 'ChatGPT / Gemini / Claude', 'Googleフォーム等（すべて無料）'] },
  { title: '💻 必要な環境', items: ['Webブラウザのみ', 'Googleアカウント', 'プログラミング経験：不要'] }
];

boxes.forEach((box, i) => {
  const x = i % 2 === 0 ? 0.5 : 5.2;
  const y = 1.6 + Math.floor(i / 2) * 1.5;

  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 4.3, h: 1.3,
    fill: { color: 'F3F4F6' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w: 0.04, h: 1.3,
    fill: { color: purple }
  });

  slide.addText(box.title, {
    x: x + 0.2, y: y + 0.1, w: 3.9, h: 0.3,
    fontSize: 15, bold: true, color: darkGray
  });

  box.items.forEach((item, j) => {
    slide.addText('• ' + item, {
      x: x + 0.2, y: y + 0.5 + j * 0.25, w: 3.9, h: 0.23,
      fontSize: 11, color: gray
    });
  });
});

// Slide 5: Curriculum 1-3
slide = pptx.addSlide();
slide.addText('カリキュラム（全5回）', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const lessons1 = [
  { title: '第1回：GAS×AIで業務アプリを構築！まず必要な準備とは？（9分）', goal: '🎯 GAS×AIの全体像を理解し、開発の流れをイメージ' },
  { title: '第2回：AIと一緒に作る！日報管理アプリの下書き生成（10分）', goal: '🎯 Googleフォーム作成、AIでGASコード生成' },
  { title: '第3回：完成！GASで動く日報アプリとGoogleサイト公開（9分）', goal: '🎯 トリガー設定で自動化を完成させ、公開' }
];

lessons1.forEach((lesson, i) => {
  const y = 1.3 + i * 1.15;
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 1,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 0.06, h: 1,
    fill: { color: purple }
  });

  slide.addText(lesson.title, {
    x: 0.7, y: y + 0.1, w: 8.6, h: 0.35,
    fontSize: 14, bold: true, color: darkGray
  });

  slide.addText(lesson.goal, {
    x: 0.7, y: y + 0.5, w: 8.6, h: 0.4,
    fontSize: 11, color: purple
  });
});

// Slide 6: Curriculum 4-5
slide = pptx.addSlide();
slide.addText('カリキュラム（全5回）- 続き', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

const lessons2 = [
  { title: '第4回：見積書をAIに作らせる！Docsテンプレート×GAS自動化（10分）', goal: '🎯 Google Docsテンプレート、GASで自動差し込み・PDF生成', desc: 'Docsテンプレート作成 | ChatGPTでGASコード生成 | 応用例：請求書、契約書など' },
  { title: '第5回：AIはどれが使いやすい？3ツール徹底比較（9分）', goal: '🎯 Claude・Gemini・ChatGPTの特徴を理解し、使い分け', desc: '3AI比較実演 | ChatGPT：速く簡潔 | Gemini：日本語対応 | Claude：詳細で網羅的' }
];

lessons2.forEach((lesson, i) => {
  const y = 1.6 + i * 1.5;
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 1.3,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 0.06, h: 1.3,
    fill: { color: purple }
  });

  slide.addText(lesson.title, {
    x: 0.7, y: y + 0.1, w: 8.6, h: 0.35,
    fontSize: 15, bold: true, color: darkGray
  });

  slide.addText(lesson.goal, {
    x: 0.7, y: y + 0.5, w: 8.6, h: 0.3,
    fontSize: 12, color: purple
  });

  slide.addText(lesson.desc, {
    x: 0.7, y: y + 0.85, w: 8.6, h: 0.35,
    fontSize: 11, color: gray
  });
});

// Slide 7: Learning Outcomes
slide = pptx.addSlide();
slide.addText('学習成果・到達目標', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const outcomes = [
  { stage: '第1回受講後', items: ['GAS×AIの全体像を理解', '開発の流れをイメージ可能'] },
  { stage: '第3回受講後', items: ['日報アプリを自力で構築・公開可能', 'Googleフォーム + GAS連携をマスター'] },
  { stage: '第5回受講後', items: ['自分の業務に合わせたアプリを設計・構築可能', 'ChatGPT / Gemini / Claudeの使い分けが可能'] }
];

let yPos = 1.3;
outcomes.forEach((outcome, i) => {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: yPos, w: 8.6, h: 0.9,
    fill: { color: 'EFF6FF' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.7, y: yPos, w: 0.06, h: 0.9,
    fill: { color: '3B82F6' }
  });

  slide.addText(outcome.stage, {
    x: 0.9, y: yPos + 0.1, w: 8.2, h: 0.3,
    fontSize: 15, bold: true, color: '1E40AF'
  });

  outcome.items.forEach((item, j) => {
    slide.addText('• ' + item, {
      x: 0.9, y: yPos + 0.45 + j * 0.23, w: 8.2, h: 0.2,
      fontSize: 12, color: darkGray
    });
  });

  yPos += 1.05;
  if (i < outcomes.length - 1) {
    slide.addText('↓', {
      x: 4.5, y: yPos - 0.1, w: 1, h: 0.2,
      fontSize: 20, color: purple, align: 'center'
    });
    yPos += 0.05;
  }
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 4.4, w: 8.6, h: 0.6,
  fill: { color: 'F0FDF4' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 4.4, w: 0.06, h: 0.6,
  fill: { color: green }
});
slide.addText('🎓 事務職がIT部門に依存せず、自力で業務アプリを内製できるようになる', {
  x: 0.9, y: 4.5, w: 8.2, h: 0.4,
  fontSize: 15, bold: true, color: '065F46', valign: 'middle'
});

// Slide 8: Tech Stack
slide = pptx.addSlide();
slide.addText('技術構成（すべて無料で利用可能）', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 26, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const tableData = [
  [
    { text: '要素', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } },
    { text: 'ツール', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } },
    { text: '特徴', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } }
  ],
  ['フロントエンド', 'Googleフォーム', '無料、ノーコード、データ自動集計'],
  ['バックエンド', 'Google Apps Script', '無料、JavaScript、連携'],
  ['データベース', 'Googleスプレッドシート', '無料、自動集計、同期'],
  ['ドキュメント', 'Google Docs', '無料、テンプレート、PDF変換'],
  ['公開', 'Googleサイト', '無料、埋め込み、社内共有'],
  ['AI支援', 'ChatGPT/Gemini/Claude', 'コード生成、仕様案作成']
];

slide.addTable(tableData, {
  x: 0.5, y: 1.4, w: 9, h: 2.5,
  colW: [1.8, 2.4, 4.8],
  border: { pt: 1, color: 'E5E7EB' },
  fontSize: 12,
  align: 'left',
  valign: 'middle'
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 9, h: 0.6,
  fill: { color: 'FEF3C7' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 0.04, h: 0.6,
  fill: { color: orange }
});
slide.addText('💡 すべてGoogle Workspaceの無料機能で実現 | 追加費用ゼロで実用的なアプリが作れる', {
  x: 0.7, y: 4.3, w: 8.6, h: 0.4,
  fontSize: 14, bold: true, color: '92400E', valign: 'middle'
});

// Slide 9: Implementation Patterns
slide = pptx.addSlide();
slide.addText('実装パターン', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

const patterns = [
  { title: 'パターン1：日報管理', steps: ['Googleフォーム入力', 'トリガー起動', 'GASコード実行', 'スプレッドシート保存', 'Googleサイト表示'] },
  { title: 'パターン2：見積書生成', steps: ['データ準備', 'GASコード実行', 'Docsテンプレート読込', 'データ差し込み', 'PDF化・Drive保存'] }
];

patterns.forEach((pattern, i) => {
  const x = i === 0 ? 0.5 : 5.2;

  slide.addShape(pptx.ShapeType.rect, {
    x, y: 1.6, w: 4.3, h: 3.2,
    fill: { color: 'F9FAFB' },
    line: { color: 'E5E7EB', width: 2 }
  });

  slide.addText(pattern.title, {
    x, y: 1.7, w: 4.3, h: 0.4,
    fontSize: 16, bold: true, color: purple, align: 'center'
  });

  pattern.steps.forEach((step, j) => {
    const stepY = 2.2 + j * 0.55;

    slide.addShape(pptx.ShapeType.rect, {
      x: x + 0.2, y: stepY, w: 3.9, h: 0.4,
      fill: { color: 'FFFFFF' }
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: x + 0.2, y: stepY, w: 0.04, h: 0.4,
      fill: { color: green }
    });

    slide.addText(step, {
      x: x + 0.35, y: stepY, w: 3.65, h: 0.4,
      fontSize: 12, color: darkGray, align: 'center', valign: 'middle'
    });

    if (j < pattern.steps.length - 1) {
      slide.addText('↓', {
        x: x + 1.9, y: stepY + 0.42, w: 0.5, h: 0.1,
        fontSize: 16, color: green, align: 'center'
      });
    }
  });
});

// Slide 10-18 will be similar structure...
// For brevity, I'll create simplified versions

// Slide 10: Daily Report Demo
slide = pptx.addSlide();
slide.addText('実装例1：日報管理システム', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 26, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

slide.addText('📝 入力 → 📊 集計 → 🌐 共有', {
  x: 1, y: 2, w: 8, h: 0.6,
  fontSize: 20, bold: true, color: darkGray, align: 'center'
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.5, w: 8.6, h: 0.9,
  fill: { color: 'ECFDF5' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.5, w: 0.06, h: 0.9,
  fill: { color: green }
});
slide.addText('効果：作成時間33%削減 | 集計時間83%削減 | リアルタイム共有', {
  x: 1, y: 3.7, w: 8, h: 0.5,
  fontSize: 14, bold: true, color: '065F46', valign: 'middle'
});

// Slide 11: Quote Generator Demo
slide = pptx.addSlide();
slide.addText('実装例2：見積書自動生成システム', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 26, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

slide.addText('📊 データ準備 → 📝 テンプレート → 📄 PDF出力', {
  x: 1, y: 2, w: 8, h: 0.6,
  fontSize: 20, bold: true, color: darkGray, align: 'center'
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.5, w: 8.6, h: 0.9,
  fill: { color: 'ECFDF5' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.5, w: 0.06, h: 0.9,
  fill: { color: green }
});
slide.addText('効果：作成時間75%削減 | 転記ミスほぼゼロ | 一括生成可能', {
  x: 1, y: 3.7, w: 8, h: 0.5,
  fontSize: 14, bold: true, color: '065F46', valign: 'middle'
});

// Slide 12: AI Comparison
slide = pptx.addSlide();
slide.addText('AI使い分けガイド', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const aiData = [
  [
    { text: '目的', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } },
    { text: '推奨AI', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } },
    { text: '理由', options: { fill: { color: purple }, color: 'FFFFFF', bold: true } }
  ],
  ['コード生成', 'ChatGPT', '簡潔で実用的'],
  ['仕様書作成', 'Gemini', '表形式、日本語自然'],
  ['詳細説明・学習', 'Claude', 'セキュリティ配慮、丁寧']
];

slide.addTable(aiData, {
  x: 0.5, y: 1.4, w: 9, h: 1.6,
  colW: [3, 3, 3],
  border: { pt: 1, color: 'E5E7EB' },
  fontSize: 14,
  align: 'center',
  valign: 'middle'
});

const aiBoxes = [
  { name: 'ChatGPT', features: ['速く簡潔', 'コード生成が得意', '実用的な回答'] },
  { name: 'Gemini', features: ['日本語対応が自然', '表形式で分かりやすい', 'Google連携'] },
  { name: 'Claude', features: ['詳細で網羅的', 'セキュリティ配慮', '丁寧な説明'] }
];

aiBoxes.forEach((ai, i) => {
  const x = 0.7 + i * 3.1;
  slide.addShape(pptx.ShapeType.rect, {
    x, y: 3.3, w: 2.9, h: 1.3,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x, y: 3.3, w: 2.9, h: 0.04,
    fill: { color: purple }
  });

  slide.addText(ai.name, {
    x, y: 3.4, w: 2.9, h: 0.35,
    fontSize: 16, bold: true, color: purple, align: 'center'
  });

  ai.features.forEach((f, j) => {
    slide.addText('• ' + f, {
      x: x + 0.2, y: 3.8 + j * 0.25, w: 2.5, h: 0.23,
      fontSize: 11, color: darkGray
    });
  });
});

// Slide 13: Target Audience
slide = pptx.addSlide();
slide.addText('受講対象者', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

slide.addText('こんな方におすすめ', {
  x: 0.7, y: 1.5, w: 4.1, h: 0.4,
  fontSize: 18, bold: true, color: darkGray
});
slide.addText('不要なスキル・環境', {
  x: 5.2, y: 1.5, w: 4.1, h: 0.4,
  fontSize: 18, bold: true, color: darkGray
});

const recommended = [
  '事務職で業務効率化に関心がある方',
  'プログラミング未経験だが学んでみたい方',
  'Google Workspaceを使用している方',
  'IT部門に依存せず改善したい方'
];

const notNeeded = [
  'プログラミング経験',
  'IT専門知識',
  '有料ツール・ソフト',
  'IT部門のサポート'
];

recommended.forEach((item, i) => {
  slide.addText('✅ ' + item, {
    x: 0.9, y: 2 + i * 0.35, w: 3.7, h: 0.3,
    fontSize: 13, color: gray
  });
});

notNeeded.forEach((item, i) => {
  slide.addText('❌ ' + item, {
    x: 5.4, y: 2 + i * 0.35, w: 3.7, h: 0.3,
    fontSize: 13, color: gray
  });
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 4.1, w: 8.6, h: 0.7,
  fill: { color: 'DBEAFE' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 4.1, w: 0.06, h: 0.7,
  fill: { color: blue }
});
slide.addText('必要なもの：Webブラウザ | Googleアカウント | 学ぶ意欲', {
  x: 1, y: 4.2, w: 8.1, h: 0.5,
  fontSize: 14, bold: true, color: '1E40AF', valign: 'middle'
});

// Slide 14: FAQ 1
slide = pptx.addSlide();
slide.addText('よくある質問（Q&A）', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const faq1 = [
  { q: 'Q1. プログラミング経験がなくても大丈夫ですか？', a: 'A1. はい、大丈夫です。AIがコードを生成してくれるので、コピー&ペーストができれば実装可能です。' },
  { q: 'Q2. 費用はかかりますか？', a: 'A2. 無料で受講できます。使用するツールもすべて無料なので、追加費用は一切かかりません。' },
  { q: 'Q3. どれくらいの時間で学習できますか？', a: 'A3. 全5回、合計47分です。1回あたり9〜10分なので、スキマ時間で学習を進められます。' },
  { q: 'Q4. 自分の業務にも応用できますか？', a: 'A4. はい、応用できます。請求書、勤怠管理、在庫管理など他の業務アプリにも応用可能です。' }
];

faq1.forEach((qa, i) => {
  const y = 1.3 + i * 0.9;
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 0.8,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 0.06, h: 0.8,
    fill: { color: purple }
  });

  slide.addText(qa.q, {
    x: 0.7, y: y + 0.1, w: 8.6, h: 0.3,
    fontSize: 13, bold: true, color: purple
  });

  slide.addText(qa.a, {
    x: 0.7, y: y + 0.45, w: 8.6, h: 0.3,
    fontSize: 12, color: darkGray
  });
});

// Slide 15: FAQ 2
slide = pptx.addSlide();
slide.addText('よくある質問（Q&A）- 続き', {
  x: 0.5, y: 0.4, w: 9, h: 0.5,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1, w: 9, h: 0.02, fill: { color: blue } });

const faq2 = [
  { q: 'Q5. どのAIを使えばいいですか？', a: 'A5. 第5回の講座で3つのAIを徹底比較します。目的別の使い分け方が分かります。' },
  { q: 'Q6. IT部門の承認は必要ですか？', a: 'A6. Google Workspaceを使用している企業であれば、多くの場合は不要です。' },
  { q: 'Q7. 作成したアプリを他の人と共有できますか？', a: 'A7. はい、可能です。Googleの共有機能を使えば、簡単に共有できます。' },
  { q: 'Q8. 講座のサポートはありますか？', a: 'A8. 各動画には受講者用教材とAIプロンプト集が付属しています。' }
];

faq2.forEach((qa, i) => {
  const y = 1.3 + i * 0.9;
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 0.8,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 0.06, h: 0.8,
    fill: { color: purple }
  });

  slide.addText(qa.q, {
    x: 0.7, y: y + 0.1, w: 8.6, h: 0.3,
    fontSize: 13, bold: true, color: purple
  });

  slide.addText(qa.a, {
    x: 0.7, y: y + 0.45, w: 8.6, h: 0.3,
    fontSize: 12, color: darkGray
  });
});

// Slide 16: Learning Flow
slide = pptx.addSlide();
slide.addText('受講の流れ', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

const steps = [
  { name: 'STEP 1：動画視聴', desc: '各動画（9〜10分）を視聴し、全体の流れを把握' },
  { name: 'STEP 2：教材確認', desc: '動画と合わせて受講者用教材で復習' },
  { name: 'STEP 3：実践', desc: 'AIプロンプト集を使って実際に構築' },
  { name: 'STEP 4：動作確認', desc: '作成したアプリが正しく動くかテスト' },
  { name: 'STEP 5：応用', desc: '学んだ知識を自分の業務に応用' }
];

let stepY = 1.5;
steps.forEach((step, i) => {
  slide.addShape(pptx.ShapeType.rect, {
    x: 2, y: stepY, w: 6, h: 0.6,
    fill: { color: 'EFF6FF' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 2, y: stepY, w: 0.06, h: 0.6,
    fill: { color: '3B82F6' }
  });

  slide.addText(step.name, {
    x: 2.2, y: stepY + 0.05, w: 5.6, h: 0.25,
    fontSize: 15, bold: true, color: '1E40AF'
  });

  slide.addText(step.desc, {
    x: 2.2, y: stepY + 0.32, w: 5.6, h: 0.23,
    fontSize: 12, color: darkGray
  });

  stepY += 0.7;

  if (i < steps.length - 1) {
    slide.addText('↓', {
      x: 4.7, y: stepY - 0.07, w: 0.6, h: 0.1,
      fontSize: 20, color: purple, align: 'center'
    });
  }
});

// Slide 17: Summary
slide = pptx.addSlide();
slide.addText('まとめ', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

slide.addText('この講座で得られること：', {
  x: 0.7, y: 1.5, w: 8.6, h: 0.3,
  fontSize: 15, bold: true, color: darkGray
});

const benefits = [
  'プログラミング未経験でも業務アプリを自力で構築できる',
  '月12.3時間の非効率業務を削減（年間約100時間）',
  '日報・見積書アプリを47分で習得',
  'IT部門に依存せず、自分で改善できる力',
  'ChatGPT / Gemini / Claudeの使い分けスキル',
  'すべて無料で実践可能'
];

benefits.forEach((benefit, i) => {
  slide.addText('✅ ' + benefit, {
    x: 0.9, y: 1.9 + i * 0.3, w: 8.4, h: 0.27,
    fontSize: 14, color: darkGray
  });
});

slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.8, w: 8.6, h: 0.7,
  fill: { color: 'F0FDF4' }
});
slide.addShape(pptx.ShapeType.rect, {
  x: 0.7, y: 3.8, w: 0.06, h: 0.7,
  fill: { color: green }
});
slide.addText('【最大の価値】事務職が自らITツールを使いこなし、\n業務を効率化できる「自走力」が身につく', {
  x: 1, y: 3.85, w: 8, h: 0.6,
  fontSize: 15, bold: true, color: '065F46', align: 'center', valign: 'middle'
});

slide.addShape(pptx.ShapeType.rect, {
  x: 2, y: 4.7, w: 6, h: 0.5,
  fill: { color: 'EFF6FF' },
  line: { color: '3B82F6', width: 3 }
});
slide.addText('👉 今すぐ第1回から始めてみましょう！', {
  x: 2, y: 4.7, w: 6, h: 0.5,
  fontSize: 17, bold: true, color: '1E40AF', align: 'center', valign: 'middle'
});

// Slide 18: Contact
slide = pptx.addSlide();
slide.addText('お問い合わせ・リソース', {
  x: 0.5, y: 0.5, w: 9, h: 0.6,
  fontSize: 28, bold: true, color: blue
});
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.2, w: 9, h: 0.02, fill: { color: blue } });

const resources = [
  { title: '📁 講座リソース', items: ['講座動画：全5回（合計47分）', '受講者用教材：materials.html', 'AIプロンプト集：prompts.txt', 'サンプルコード：demo_code/'] },
  { title: '💻 推奨環境', items: ['Webブラウザ（Chrome、Edge、Safari等）', 'Googleアカウント', 'インターネット接続'] }
];

resources.forEach((box, i) => {
  const y = 1.6 + i * 1.5;

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 9, h: 1.2,
    fill: { color: 'F9FAFB' }
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y, w: 0.06, h: 1.2,
    fill: { color: purple }
  });

  slide.addText(box.title, {
    x: 0.7, y: y + 0.1, w: 8.6, h: 0.3,
    fontSize: 17, bold: true, color: darkGray
  });

  box.items.forEach((item, j) => {
    slide.addText('• ' + item, {
      x: 0.9, y: y + 0.5 + j * 0.2, w: 8.4, h: 0.18,
      fontSize: 12, color: gray
    });
  });
});

pptx.writeFile({ fileName: 'GAS-AI-Course-Presentation.pptx' }).then(() => {
  console.log('✓ Presentation created successfully!');
}).catch(err => {
  console.error('Error:', err);
});
