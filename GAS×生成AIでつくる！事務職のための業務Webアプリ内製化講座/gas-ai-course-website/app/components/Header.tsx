import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span className="text-2xl">📚</span>
            <span className="whitespace-nowrap">GAS×生成AI 講座</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm sm:text-base text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              ホーム
            </Link>
            <Link
              href="/lesson/1"
              className="text-sm sm:text-base bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-primary-700 font-medium transition-colors whitespace-nowrap"
            >
              講座を見る
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
