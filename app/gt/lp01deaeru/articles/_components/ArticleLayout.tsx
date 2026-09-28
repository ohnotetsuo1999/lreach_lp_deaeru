"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowRight, Home, Share2 } from "lucide-react";

interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  category: string;
  readTime: number;
  publishedDate: string;
  relatedArticles?: Array<{
    title: string;
    slug: string;
    category: string;
  }>;
}

export function ArticleLayout({
  children,
  title,
  category,
  readTime,
  publishedDate,
  relatedArticles = [],
}: ArticleLayoutProps) {
  const [showFixedCta, setShowFixedCta] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setReadProgress(scrollPercent);
      setShowFixedCta(scrollTop > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("シェアキャンセル");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* 読了進捗バー */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-200"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* ヘッダー */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/gt/lp01deaeru/articles" className="flex items-center gap-2">
              <img
                src="/deaeru-logo.png"
                alt="出会えるエージェント"
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">シェア</span>
            </button>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メイン記事エリア */}
          <main className="flex-1">
            {/* パンくずリスト */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-600">
              <Link href="/gt/lp01deaeru/articles" className="flex items-center gap-1 hover:text-green-600">
                <Home className="h-4 w-4" />
                <span>記事一覧</span>
              </Link>
              <span>/</span>
              <span className="text-green-600">{category}</span>
            </nav>

            {/* 記事メタ情報 */}
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-block rounded-full bg-gradient-to-r from-green-500 to-green-400 px-4 py-1 text-sm font-bold text-white">
                  {category}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readTime}分で読めます
                  </span>
                  <span>{publishedDate}</span>
                </div>
              </div>
            </div>

            {/* 記事本文 */}
            <article className="rounded-2xl bg-white p-6 md:p-10 shadow-sm border border-gray-100">
              {children}
            </article>

            {/* 記事下CTA */}
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-green-500 via-green-400 to-emerald-500 p-8 text-white shadow-xl">
              <div className="text-center">
                <p className="mb-2 text-sm font-semibold">\ 完全無料・30秒で完了 /</p>
                <h3 className="mb-4 text-2xl font-bold md:text-3xl">
                  あなたにピッタリのエージェントを<br />
                  今すぐ診断しよう！
                </h3>
                <p className="mb-6 text-sm opacity-95">
                  年収アップ、ホワイト企業への転職を実現。<br />
                  20代の転職成功率94%の実績
                </p>
                <Link
                  href="/gt/lp01deaeru/1"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-green-600 shadow-lg transition hover:scale-105 hover:bg-gray-50"
                >
                  無料診断をはじめる
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                  <span>✓ しつこい営業なし</span>
                  <span>✓ 相談だけでもOK</span>
                  <span>✓ LINE対応</span>
                </div>
              </div>
            </div>

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h3 className="mb-6 text-2xl font-bold text-gray-800">
                  あわせて読みたい
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {relatedArticles.map((article, index) => (
                    <Link
                      key={index}
                      href={`/gt/lp01deaeru/articles/${article.slug}`}
                      className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-green-300"
                    >
                      <span className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {article.category}
                      </span>
                      <h4 className="font-bold text-gray-800 group-hover:text-green-600 transition">
                        {article.title}
                      </h4>
                      <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-green-600">
                        <span>記事を読む</span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* サイドバー */}
          <aside className="lg:w-80">
            <div className="sticky top-20 space-y-6">
              {/* プロフィールCTA */}
              <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center justify-center">
                  <img
                    src="/deaeru-logo.png"
                    alt="出会えるエージェント"
                    className="h-12 w-auto brightness-0 invert"
                  />
                </div>
                <h3 className="mb-3 text-center text-lg font-bold">
                  あなたに合う<br />
                  エージェントを診断
                </h3>
                <p className="mb-4 text-center text-sm opacity-95">
                  たった30秒で、最適な転職エージェント3社が見つかります
                </p>
                <Link
                  href="/gt/lp01deaeru/1"
                  className="block w-full rounded-xl bg-white py-3 text-center font-bold text-green-600 shadow-md transition hover:bg-gray-50"
                >
                  無料診断をはじめる →
                </Link>
                <div className="mt-4 space-y-2 text-xs opacity-90">
                  <p className="flex items-center gap-2">
                    ✓ 完全無料・30秒で完了
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ 年収UP平均+87万円
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ 利用者満足度94%
                  </p>
                </div>
              </div>

              {/* 人気記事 */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  人気記事 TOP3
                </h3>
                <div className="space-y-4">
                  <Link
                    href="/gt/lp01deaeru/articles/20dai-first-tensyoku"
                    className="group block"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-xs font-bold text-white">
                        1
                      </span>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition">
                        初めての転職で年収90万UP！私が成功できた理由
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/gt/lp01deaeru/articles/20dai-nensyuu-up-himitsu"
                    className="group block"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-xs font-bold text-white">
                        2
                      </span>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition">
                        20代で年収100万UPさせる人がやってること
                      </p>
                    </div>
                  </Link>
                  <Link
                    href="/gt/lp01deaeru/articles/20dai-black-kigyo-sakekata"
                    className="group block"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-xs font-bold text-white">
                        3
                      </span>
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition">
                        ブラック企業を100%避ける転職術
                      </p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* SNSシェア */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="mb-4 text-lg font-bold text-gray-800">
                  この記事をシェア
                </h3>
                <button
                  onClick={handleShare}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 py-3 font-bold text-white transition hover:shadow-md flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  友達にシェアする
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 固定CTA（モバイル） */}
      {showFixedCta && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-4 shadow-lg lg:hidden">
          <Link
            href="/gt/lp01deaeru/1"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-400 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
          >
            無料診断をはじめる
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </div>
  );
}
