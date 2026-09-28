import { Suspense } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getAllDeaeruArticles } from "@/lib/deaeru-posts";
import DeaeruArticleList from "@/components/deaeru/DeaeruArticleList";

const POPULAR_ARTICLE_IDS = [39, 4, 7, 8, 3];

export const metadata = {
  title: "出会えるマガジン｜転職エージェントの選び方・面接対策・キャリア情報",
  description:
    "出会えるエージェント編集部が届ける転職お役立ちメディア。転職エージェントの賢い選び方、面接対策、キャリア設計まで、20代の転職を成功に導く実践的な情報を発信しています。",
  alternates: {
    canonical: "https://deaeru-agent.jp/media/",
  },
  openGraph: {
    title: "出会えるマガジン｜転職エージェントの選び方・面接対策・キャリア情報",
    description:
      "出会えるエージェント編集部が届ける転職お役立ちメディア。失敗しないコツやエージェントの賢い頼り方など、20代に役立つヒントが満載です。",
    url: "https://deaeru-agent.jp/media/",
    siteName: "出会えるマガジン",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://deaeru-agent.jp/ogp/media-top.png",
        width: 1200,
        height: 630,
        alt: "出会えるマガジン｜いい転職は、いい情報から始まる。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "出会えるマガジン｜転職エージェントの選び方・面接対策・キャリア情報",
    description:
      "出会えるエージェント編集部が届ける転職お役立ちメディア。失敗しないコツやエージェントの賢い頼り方など、20代に役立つヒントが満載です。",
    images: ["https://deaeru-agent.jp/ogp/media-top.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DeaeruArticlesPage() {
  const allPosts = getAllDeaeruArticles();

  const popularPosts = POPULAR_ARTICLE_IDS.map((id) =>
    allPosts.find((p) => p.id === id)
  ).filter(Boolean);

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "出会えるマガジン",
    description:
      "出会えるエージェント編集部が届ける転職お役立ちメディア。転職エージェントの賢い選び方、面接対策、キャリア設計まで実践的な情報を発信。",
    url: "https://deaeru-agent.jp/media/",
    publisher: {
      "@type": "Organization",
      name: "foresma株式会社",
      url: "https://foresma.jp",
      logo: {
        "@type": "ImageObject",
        url: "https://deaeru-agent.jp/deaeru-magazine-logo.svg",
      },
    },
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "出会えるマガジン",
    description:
      "出会えるエージェント編集部が届ける転職お役立ちメディア。20代の転職成功に役立つ実践的な情報を発信しています。",
    url: "https://deaeru-agent.jp/media/",
    isPartOf: {
      "@type": "WebSite",
      name: "出会えるエージェント",
      url: "https://deaeru-agent.jp/",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allPosts.length,
      itemListElement: allPosts.map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://deaeru-agent.jp/media/${post.slug}/`,
        name: post.title,
      })),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://deaeru-agent.jp/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "メディア",
        item: "https://deaeru-agent.jp/media/",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0fdf4] via-white to-white" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00C853]/20 to-transparent" />
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#00C853]/[0.04] blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-100/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-400 mb-8 sm:mb-10" aria-label="パンくずリスト">
            <Link
              href="https://deaeru-agent.jp"
              className="hover:text-gray-600 transition-colors"
            >
              ホーム
            </Link>
            <span>/</span>
            <span className="text-[#00C853]">メディア</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 tracking-tight leading-[1.2] mb-5 sm:mb-6">
            いい転職は、
            <br className="sm:hidden" />
            いい<span className="text-[#00C853]">情報</span>から始まる。
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed">
            失敗しないエージェントの選び方から、年収UPの交渉術まで。
            <br className="hidden sm:block" />
            出会えるエージェント編集部が、あなたの転職をもっと確かなものにします。
          </p>
        </div>
      </section>

      {popularPosts.length > 0 && (
        <section className="bg-white pb-8 sm:pb-10 md:pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <TrendingUp size={18} className="text-[#00C853]" aria-hidden />
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                いま読まれている記事
              </h2>
            </div>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {popularPosts.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/media/${post.slug}/`}
                    className="group block rounded-xl border border-gray-100 bg-white p-4 sm:p-5 transition-all hover:border-[#00C853]/40 hover:shadow-[0_8px_24px_-12px_rgba(0,200,83,0.25)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#00C853]/10 text-xs font-bold text-[#00C853]">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1 truncate">
                          {post.categoryName}
                        </p>
                        <p className="text-sm sm:text-[15px] font-bold text-gray-900 group-hover:text-[#00C853] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-center text-gray-400">
            読み込み中...
          </div>
        }
      >
        <DeaeruArticleList allPosts={allPosts} />
      </Suspense>
    </>
  );
}
