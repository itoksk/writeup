import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "GAS×生成AIでつくる！事務職のための業務Webアプリ内製化講座",
  description: "Google Apps ScriptとChatGPT/Gemini/Claudeを活用して、プログラミング未経験でも業務アプリを自分で作れるようになる講座",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className={notoSansJP.className}>
        <Header />
        <main className="min-h-screen pt-0">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2025 GAS×生成AI 業務Webアプリ内製化講座
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
