import Link from 'next/link';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import TabNavigation from '@/app/components/TabNavigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as cheerio from 'cheerio';

const lessons = [
  {
    id: 1,
    title: 'GAS×AIで業務アプリを構築！まず必要な準備とは？',
    duration: '9分',
    folder: '動画1_GAS×AIで業務アプリを構築！まず必要な準備とは？',
  },
  {
    id: 2,
    title: 'AIと一緒に作る！日報管理アプリの下書き生成',
    duration: '10分',
    folder: '動画2_AIと一緒に作る！日報管理アプリの下書き生成',
  },
  {
    id: 3,
    title: '完成！GASで動く日報アプリとGoogleサイト公開',
    duration: '9分',
    folder: '動画3_完成！GASで動く日報アプリとGoogleサイト公開',
  },
  {
    id: 4,
    title: '見積書をAIに作らせる！Docsテンプレート×GAS自動化',
    duration: '10分',
    folder: '動画4_見積書をAIに作らせる！Docsテンプレート×GAS自動化',
  },
  {
    id: 5,
    title: 'AIはどれが使いやすい？3ツール徹底比較でわかる実務活用の勘所',
    duration: '9分',
    folder: '動画5_AIはどれが使いやすい？3ツール徹底比較でわかる実務活用の勘所',
  },
];

function getLessonData(id: number) {
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return null;

  const basePath = path.join(process.cwd(), '..', lesson.folder);

  try {
    const script = fs.readFileSync(path.join(basePath, 'script.md'), 'utf-8');
    const materialsRaw = fs.readFileSync(path.join(basePath, 'materials.html'), 'utf-8');
    const prompts = fs.readFileSync(path.join(basePath, 'prompts.txt'), 'utf-8');

    // Extract styles and content from materials.html, removing only nav elements
    const $ = cheerio.load(materialsRaw);

    // Remove only the navigation element (keep styles and other content)
    $('nav').remove();

    // Extract styles from head
    const styles = $('head style').html() || '';

    // Get body content
    const bodyContent = $('body').html() || materialsRaw;

    // Combine styles and content
    const materials = `<style>${styles}</style>${bodyContent}`;

    return {
      ...lesson,
      script,
      materials,
      prompts,
    };
  } catch (error) {
    console.error('Error loading lesson data:', error);
    return null;
  }
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    id: lesson.id.toString(),
  }));
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const lessonData = getLessonData(id);

  if (!lessonData) {
    notFound();
  }

  const tabs = [
    { id: 'materials', label: '教材', icon: '📖' },
    { id: 'prompts', label: 'プロンプト集', icon: '🤖' },
  ];

  const prevLesson = id > 1 ? id - 1 : null;
  const nextLesson = id < lessons.length ? id + 1 : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm">
            第{id}回
          </span>
          <span className="text-gray-500 font-medium">{lessonData.duration}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
          {lessonData.title}
        </h1>
      </div>

      {/* タブコンテンツ */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8 mt-4">
        <TabNavigation tabs={tabs}>
          {/* 教材 */}
          <div className="prose-custom max-w-none">
            <div
              className="materials-content"
              dangerouslySetInnerHTML={{ __html: lessonData.materials }}
            />
          </div>

          {/* プロンプト集 */}
          <div className="max-w-none">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-600 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h3 className="text-lg font-bold text-gray-900 m-0">AI生成プロンプト集</h3>
              </div>
              <p className="text-sm text-gray-600 m-0">
                ChatGPT、Gemini、Claudeで使えるプロンプト例です。コピーして使用してください
              </p>
            </div>
            <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed">
              <pre className="whitespace-pre-wrap m-0">{lessonData.prompts}</pre>
            </div>
          </div>
        </TabNavigation>
      </div>

      {/* ナビゲーション */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 rounded-lg p-6">
        <div className="w-full sm:w-auto">
          {prevLesson ? (
            <Link
              href={`/lesson/${prevLesson}`}
              className="flex items-center justify-center sm:justify-start gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>←</span>
              <span>前の講座</span>
            </Link>
          ) : (
            <div className="w-full sm:w-24"></div>
          )}
        </div>
        <Link
          href="/"
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          講座一覧に戻る
        </Link>
        <div className="w-full sm:w-auto">
          {nextLesson ? (
            <Link
              href={`/lesson/${nextLesson}`}
              className="flex items-center justify-center sm:justify-end gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              <span>次の講座</span>
              <span>→</span>
            </Link>
          ) : (
            <div className="w-full sm:w-24"></div>
          )}
        </div>
      </div>
    </div>
  );
}
