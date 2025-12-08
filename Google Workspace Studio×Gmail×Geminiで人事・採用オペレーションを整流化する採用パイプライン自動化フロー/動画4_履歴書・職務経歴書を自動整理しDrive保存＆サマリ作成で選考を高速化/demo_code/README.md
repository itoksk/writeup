# 第4回：採用書類自動整理エージェント - デモファイル

## エージェント構成

```
[応募メール受信（ラベル付与）]
        ↓
[Google Drive: ファイル保存]
        ↓
[Gemini: サマリ作成]
        ↓
[Google Sheets: 候補者一覧に追記]
```

## 出力例：候補者サマリ

```
【候補者サマリ】
■ 基本情報
氏名：山田太郎
学歴：〇〇大学 工学部 2018年卒

■ 職務経歴
株式会社ABC（2018-2022）：Webエンジニア
株式会社DEF（2022-現在）：シニアエンジニア

■ スキル
言語：JavaScript, Python, Go
資格：AWS SAA, 基本情報

■ 適合度：High
募集要件のフロントエンド経験3年以上を満たし、
バックエンド経験もあり即戦力として期待。

■ 特記事項
・チームリーダー経験あり
・転職回数：1回（標準的）
```

## スプレッドシート列構成

| 列 | 内容 |
|---|---|
| A | 応募日 |
| B | 候補者名 |
| C | 応募職種 |
| D | メールアドレス |
| E | 書類リンク（Drive） |
| F | サマリ |
| G | 適合度 |
| H | ステータス |

## 参考リンク

- [Google Drive API](https://developers.google.com/drive)
- [Google Sheets API](https://developers.google.com/sheets)
- [Google Workspace Studio](https://studio.workspace.google.com)
