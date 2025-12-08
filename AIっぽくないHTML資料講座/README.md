# AIとGoogleサイトでつくる “AIっぽくない” HTML資料講座

## コース概要
- **目的**：AIが生成したHTML資料を、社内共有に耐える品質へ整え、Googleサイトで安全に公開できるようにする。
- **対象者**：社内研修・業務報告資料を短時間で仕上げたい企画担当／内製デザイナー。
- **想定成果**：要件ヒアリング → HTML生成 → Googleサイト埋め込みまでを1日で完結。

## モジュール構成（各10分以内）
1. **動画1：AIに資料を作らせる前にすべき1つのこと**  
   AIにヒアリングを任せるプロンプト設計と要件シート作成。
2. **動画2：“AIっぽくない”HTML資料の作り方**  
   literary-editorial-templateに沿ったプロンプトテンプレとデザイン仕上げ。
3. **動画3：Googleサイトで“使える”HTML資料に**  
   埋め込み方法・権限・レスポンシブ調整を通して社内展開を完結。

## ディレクトリ構成
```
AIっぽくないHTML資料講座/
├── README.md
├── 動画1_AIに資料を作らせる前にすべき1つのこと/
│   ├── script.md
│   ├── materials.html
│   ├── sample_prompts.md
│   ├── setup_guide.md
│   └── demo_prompts/
├── 動画2_AIっぽくないHTML資料の作り方/
│   ├── script.md
│   ├── materials.html
│   ├── sample_prompts.md
│   ├── setup_guide.md
│   └── demo_prompts/
└── 動画3_Googleサイトで使えるHTML資料に/
    ├── script.md
    ├── materials.html
    ├── sample_prompts.md
    ├── setup_guide.md
    └── demo_prompts/
```

## 各ファイルの役割
| ファイル | 役割 | 補足 |
| --- | --- | --- |
| `script.md` | 講師用台本 | 10分構成のタイムラインとトークスクリプト |
| `materials.html` | 受講者向け教材 | literary-editorial-template準拠／ダークモード・ドットナビ対応 |
| `sample_prompts.md` | 演習プロンプト集 | そのままAIに貼れる例をカテゴリ別に収録 |
| `setup_guide.md` | 環境構築ガイド | 動画の再現に必要なツール・事前準備をまとめたもの |
| `demo_prompts/` | 実演用プロンプト | 収録デモで使用するプロンプト・手順メモ |

## リリース前チェック
- [ ] script.mdは導入〜まとめまで10分構成が明確か
- [ ] materials.htmlでダークモード切り替えとセクションナビが動作するか
- [ ] code-blockに`white-space: pre-wrap`が指定されているか
- [ ] Googleサイトでの埋め込み手順がsetup_guide.mdに記載されているか
- [ ] sample_prompts.mdに即利用可能なプロンプトが3件以上あるか

## 推奨ワークフロー
1. 動画1のヒアリングプロンプトで要件シートを作成。
2. 動画2のテンプレートを使ってChatGPTにHTML生成を依頼し、ローカルで調整。
3. 動画3のガイドに沿ってGoogleサイトへ埋め込み、社内共有まで完了。

## 参考リソース
- `literary-editorial-template/` デザインシステムのスタイルとコンポーネント集
- Googleサイト公式ヘルプ：<https://support.google.com/sites/answer/6372880>
- Google Fonts：<https://fonts.google.com/>

---
本ディレクトリはAI研修教材作成システム（AIフロー）の標準構成に従います。改善提案があればREADME更新も合わせて行ってください。
