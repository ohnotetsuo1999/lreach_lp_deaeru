import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock } from "lucide-react";
import {
  getDeaeruArticleBySlug,
  getDeaeruPostHtml,
  getDeaeruArticleSlugs,
  getRelatedDeaeruArticles,
  getAllDeaeruArticles,
} from "@/lib/deaeru-posts";
import DeaeruCategoryBadge from "@/components/deaeru/DeaeruCategoryBadge";
import DeaeruServiceCTA from "@/components/deaeru/DeaeruServiceCTA";
import DeaeruRelatedArticles from "@/components/deaeru/DeaeruRelatedArticles";
import DeaeruAboutSection from "@/components/deaeru/DeaeruAboutSection";
import DeaeruPopularArticles from "@/components/deaeru/DeaeruPopularArticles";
import ArticleToc from "./ArticleToc";
import { resolveAboutInsertion } from "@/lib/deaeru-article-layout";

export async function generateStaticParams() {
  const slugs = getDeaeruArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getDeaeruArticleBySlug(slug);
  if (!post) return notFound();

  const canonicalUrl = `https://deaeru-agent.jp/media/${post.slug}/`;
  const ogImageFile = `article${String(post.id).padStart(3, "0")}.png`;
  const ogImageUrl = `https://deaeru-agent.jp/ogp/${ogImageFile}`;

  return {
    title: `${post.title} | 出会えるマガジン`,
    description: post.seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.seoDescription,
      url: canonicalUrl,
      siteName: "出会えるマガジン",
      locale: "ja_JP",
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seoDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function extractTocItems(html) {
  const matches = [
    ...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g),
  ];
  if (matches.length === 0) {
    const h2Matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)];
    return h2Matches.map((m, i) => {
      const id = `section-${i + 1}`;
      return { id, label: m[1].replace(/<[^>]*>/g, "") };
    });
  }
  return matches.map((m) => ({
    id: m[1],
    label: m[2].replace(/<[^>]*>/g, ""),
  }));
}

function addIdsToHeadings(html) {
  let index = 0;
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/g, (match, attrs, content) => {
    if (attrs.includes("id=")) return match;
    index++;
    const id = `section-${index}`;
    return `<h2${attrs} id="${id}">${content}</h2>`;
  });
}

/** script 内 JSON-LD の </script> 誤認識を防ぐ */
function jsonLdToHtml(obj) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

function buildArticleJsonLd(post, htmlContent) {
  const plainText = htmlContent.replace(/<[^>]*>/g, "");
  const ogImageUrl = `https://deaeru-agent.jp/ogp/article${String(post.id).padStart(3, "0")}.png`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription,
    image: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.date,
    wordCount: plainText.length,
    keywords: post.mainKW,
    inLanguage: "ja",
    author: {
      "@type": "Organization",
      name: "出会えるマガジン編集部",
      url: "https://deaeru-agent.jp/media/",
    },
    publisher: {
      "@type": "Organization",
      name: "foresma株式会社",
      url: "https://foresma.jp",
      logo: {
        "@type": "ImageObject",
        url: "https://deaeru-agent.jp/deaeru-magazine-logo.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://deaeru-agent.jp/media/${post.slug}/`,
    },
    isPartOf: {
      "@type": "Blog",
      name: "出会えるマガジン",
      url: "https://deaeru-agent.jp/media/",
    },
  };
}

function buildAggregateRatingJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "出会えるエージェント",
    description:
      "希望条件に合致した相性の良いキャリアアドバイザーや優良求人をご紹介する転職エージェントマッチングサービス",
    brand: {
      "@type": "Brand",
      name: "foresma株式会社",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "1000",
      reviewCount: "1000",
    },
  };
}

function buildBreadcrumbJsonLd(post) {
  return {
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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://deaeru-agent.jp/media/${post.slug}/`,
      },
    ],
  };
}

function buildHowToJsonLd(post, htmlContent) {
  if (!post.schemaTypes || !post.schemaTypes.includes("HowTo")) return null;

  const steps = [];

  const h2Regex =
    /<h2[^>]*>(?:.*?(?:ステップ|STEP|Step)\s*\d*[：:]?\s*)(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  let match;
  while ((match = h2Regex.exec(htmlContent)) !== null) {
    const name = match[1].replace(/<[^>]*>/g, "").trim();
    const text = match[2].replace(/<[^>]*>/g, "").trim().slice(0, 300);
    if (name) steps.push({ "@type": "HowToStep", name, text });
  }

  if (steps.length === 0) {
    const h3Regex =
      /<h3[^>]*>(?:.*?(?:ステップ|STEP|Step)\s*\d*[：:]?\s*)(.*?)<\/h3>([\s\S]*?)(?=<h[23]|$)/gi;
    while ((match = h3Regex.exec(htmlContent)) !== null) {
      const name = match[1].replace(/<[^>]*>/g, "").trim();
      const text = match[2].replace(/<[^>]*>/g, "").trim().slice(0, 300);
      if (name) steps.push({ "@type": "HowToStep", name, text });
    }
  }

  if (steps.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.title,
    description: post.seoDescription,
    step: steps,
  };
}

function buildFaqJsonLd(htmlContent) {
  const faqMatches = [
    ...htmlContent.matchAll(
      /<div class="faq-question">.*?<\/span>([\s\S]*?)<\/div>\s*<div class="faq-answer">.*?<\/span>([\s\S]*?)<\/div>/g
    ),
  ];
  if (faqMatches.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqMatches.map((m) => ({
      "@type": "Question",
      name: m[1].replace(/<[^>]*>/g, "").trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: m[2].replace(/<[^>]*>/g, "").trim(),
      },
    })),
  };
}

function splitHtmlForCTA(html) {
  const matomeRegex = /<h2([^>]*)>(.*?まとめ.*?)<\/h2>/;
  const matomeMatch = html.match(matomeRegex);

  let beforeMatome = html;
  let matomeAndAfter = "";

  if (matomeMatch) {
    const idx = html.indexOf(matomeMatch[0]);
    beforeMatome = html.substring(0, idx);
    matomeAndAfter = html.substring(idx);
  }

  return {
    beforeMatome: matomeMatch ? beforeMatome : null,
    matomeAndAfter: matomeAndAfter || null,
    fullContent: !matomeMatch ? html : null,
  };
}

export default async function DeaeruArticlePage({ params }) {
  const { slug } = await params;
  const post = getDeaeruArticleBySlug(slug);
  if (!post) return notFound();

  let htmlContent = await getDeaeruPostHtml(post.content);
  htmlContent = addIdsToHeadings(htmlContent);
  const tocItems = extractTocItems(htmlContent);
  const relatedPosts = getRelatedDeaeruArticles(slug, post.category);
  const popularPosts = getAllDeaeruArticles()
    .filter((p) => p.isPillar && p.slug !== slug)
    .slice(0, 5);

  const contentParts = splitHtmlForCTA(htmlContent);

  /** About 挿入: ①【CTA】blockquote 直後 ②なければ先頭 cta-block 位置（まとめ前の本文を優先） */
  const beforeMatomeAbout = contentParts.beforeMatome
    ? resolveAboutInsertion(contentParts.beforeMatome)
    : { mode: "none", before: "", after: null };
  const matomeAbout =
    contentParts.matomeAndAfter && beforeMatomeAbout.mode === "none"
      ? resolveAboutInsertion(contentParts.matomeAndAfter)
      : null;
  const fullNoMatomeAbout = contentParts.fullContent
    ? resolveAboutInsertion(contentParts.fullContent)
    : { mode: "none", before: "", after: null };

  const articleJsonLd = buildArticleJsonLd(post, htmlContent);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(htmlContent);
  const howToJsonLd = buildHowToJsonLd(post, htmlContent);
  const aggregateRatingJsonLd = buildAggregateRatingJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToHtml(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToHtml(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdToHtml(faqJsonLd) }}
        />
      )}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdToHtml(howToJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdToHtml(aggregateRatingJsonLd),
        }}
      />

      {/* Article Header */}
      <section className="bg-gray-50 border-b border-gray-100 pt-20 sm:pt-24 md:pt-28 pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 md:pb-10">
          <nav
            className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-gray-400 mb-4 sm:mb-6"
            aria-label="パンくずリスト"
          >
            <Link
              href="https://deaeru-agent.jp"
              className="hover:text-gray-600 transition-colors shrink-0"
            >
              ホーム
            </Link>
            <span>/</span>
            <Link
              href="/media"
              className="hover:text-gray-600 transition-colors shrink-0"
            >
              メディア
            </Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{post.title}</span>
          </nav>

          <DeaeruCategoryBadge categoryId={post.category} size="md" />

          <h1 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl lg:text-[2.1rem] font-bold text-gray-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-400">
              <time dateTime={post.date}>{post.date}</time>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* OGP Hero Image */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-t-2xl border border-b-0 border-gray-200 shadow-sm">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
        <div className="flex gap-0 lg:gap-10">
          {/* Sidebar TOC (desktop) */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
                <ArticleToc items={tocItems} />
                <DeaeruPopularArticles articles={popularPosts} />
                <Link
                  href="/media"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#00C853] transition-colors"
                >
                  <ArrowLeft size={14} />
                  記事一覧に戻る
                </Link>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {contentParts.matomeAndAfter ? (
              <>
                {beforeMatomeAbout.mode !== "none" ? (
                  <>
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: beforeMatomeAbout.before,
                      }}
                    />
                    <DeaeruAboutSection />
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: beforeMatomeAbout.after,
                      }}
                    />
                    <DeaeruServiceCTA />
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: contentParts.matomeAndAfter,
                      }}
                    />
                  </>
                ) : matomeAbout && matomeAbout.mode !== "none" ? (
                  <>
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: contentParts.beforeMatome,
                      }}
                    />
                    <DeaeruServiceCTA />
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: matomeAbout.before,
                      }}
                    />
                    <DeaeruAboutSection />
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: matomeAbout.after,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: contentParts.beforeMatome,
                      }}
                    />
                    <DeaeruServiceCTA />
                    <DeaeruAboutSection />
                    <div
                      className="prose-deaeru"
                      dangerouslySetInnerHTML={{
                        __html: contentParts.matomeAndAfter,
                      }}
                    />
                  </>
                )}
              </>
            ) : fullNoMatomeAbout.mode !== "none" ? (
              <>
                <div
                  className="prose-deaeru"
                  dangerouslySetInnerHTML={{
                    __html: fullNoMatomeAbout.before,
                  }}
                />
                <DeaeruAboutSection />
                <div
                  className="prose-deaeru"
                  dangerouslySetInnerHTML={{
                    __html: fullNoMatomeAbout.after,
                  }}
                />
                <DeaeruServiceCTA />
              </>
            ) : (
              <>
                <div
                  className="prose-deaeru"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
                <DeaeruAboutSection />
                <DeaeruServiceCTA />
              </>
            )}

            {/* Mobile TOC */}
            {tocItems.length > 0 && (
              <div className="lg:hidden mt-8 sm:mt-10 bg-gray-50 rounded-xl p-4 sm:p-5">
                <ArticleToc items={tocItems} />
              </div>
            )}
          </article>
        </div>
      </div>

      {/* Related Articles */}
      <DeaeruRelatedArticles articles={relatedPosts} />

      {/* Back to Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <Link
          href="/media"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#00C853] transition-colors"
        >
          <ArrowLeft size={14} />
          記事一覧に戻る
        </Link>
      </div>
    </>
  );
}
