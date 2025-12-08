import Link from 'next/link';

const lessons = [
  {
    id: 1,
    title: 'GAS×AIで業務アプリを構築！まず必要な準備とは？',
    duration: '9分',
    description: 'GAS×AIの全体像、できること・できないこと、開発の流れを学びます',
  },
  {
    id: 2,
    title: 'AIと一緒に作る！日報管理アプリの下書き生成',
    duration: '10分',
    description: 'Googleフォーム作成、AIでGASコード生成、下書きを完成',
  },
  {
    id: 3,
    title: '完成！GASで動く日報アプリとGoogleサイト公開',
    duration: '9分',
    description: 'トリガー設定、自動転記、Googleサイトで部内共有',
  },
  {
    id: 4,
    title: '見積書をAIに作らせる！Docsテンプレート×GAS自動化',
    duration: '10分',
    description: 'Docsテンプレート作成、データ差し込み、PDF自動生成',
  },
  {
    id: 5,
    title: 'AIはどれが使いやすい？3ツール徹底比較でわかる実務活用の勘所',
    duration: '9分',
    description: 'Claude/Gemini/ChatGPTの比較、使い分けのコツ',
  },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヒーローセクション */}
      <section className="mb-12 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          GAS×生成AIでつくる！<br />
          事務職のための業務Webアプリ内製化講座
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-6">
          プログラミング未経験でも、AIの力を借りて業務アプリを自分で作れるようになる
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white/20 rounded px-4 py-2">
            <span className="font-semibold">全5回・合計47分</span>
          </div>
          <div className="bg-white/20 rounded px-4 py-2">
            <span className="font-semibold">完全無料</span>
          </div>
          <div className="bg-white/20 rounded px-4 py-2">
            <span className="font-semibold">実務で即活用</span>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Before / After</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-800 mb-4">❌ Before（現状）</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 日報作成に毎回15分、月5時間のロス</li>
              <li>• 見積書作成で転記ミス月3件発生</li>
              <li>• 紙・Excelでバラバラ管理、集計に30分</li>
              <li>• 「プログラミングは無理」と諦めている</li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4">✅ After（理想の状態）</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 作業時間20～30%削減を実現</li>
              <li>• 転記ミス・記載漏れゼロ</li>
              <li>• 自動集計・即座に検索可能</li>
              <li>• 自分で業務アプリを内製できる</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 講座一覧 */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">全5回の講座内容</h2>
        <div className="space-y-4">
          {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary-300 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded font-semibold text-sm">
                    第{lesson.id}回
                  </span>
                  <span className="text-gray-500 text-sm">{lesson.duration}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h3>
              <p className="text-gray-600">
                {lesson.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 使用ツール */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">使用ツール・技術</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Google Workspace</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• Google Apps Script</li>
              <li>• Googleフォーム</li>
              <li>• Googleスプレッドシート</li>
              <li>• Google Docs</li>
              <li>• Googleサイト</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">生成AIツール</h3>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• ChatGPT（コード生成）</li>
              <li>• Gemini（日本語説明）</li>
              <li>• Claude（詳細学習）</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">すべて無料</h3>
            <p className="text-gray-600 text-sm">
              使用するツールはすべて無料プランで対応可能。追加費用なしで学習できます。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">さっそく始めましょう！</h2>
          <p className="text-gray-600 mb-6">
            第1回から順番に学習することをおすすめします
          </p>
          <Link
            href="/lesson/1"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            第1回：準備編を見る →
          </Link>
        </div>
      </section>
    </div>
  );
}
