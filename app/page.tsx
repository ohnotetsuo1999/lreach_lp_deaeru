// export default async function Home() {
//   return null;
// }

import { type Metadata } from "next";
import { headers } from "next/headers";

import { ServicePage } from "./_components/service/ServicePage";
import { SERVICE_PAGE_TOP_INFLOW } from "./_components/service/service-inflow";
import ArticleLP from "./gt/lp02b/[id]/page";

export async function generateMetadata(): Promise<Metadata> {
  // 2026-09-18 サービスページ刷新（納品物 deaeru-agent-handoff の layout.tsx metadata を採用）
  const title = "出会えるエージェント｜あなたに合う転職エージェント3社を厳選紹介";
  const description =
    "3万社以上の転職エージェント会社から、あなたの希望に合う3社を厳選してご紹介。15分のオンライン相談で始められる完全無料のサービスです。";

  return {
    alternates: {
      canonical: "https://deaeru-agent.jp/",
    },
    description,
    openGraph: {
      type: "website",
      siteName: "出会えるエージェント",
      url: "https://deaeru-agent.jp/",
      title,
      description,
    },
    title,
  };
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";

  // 本番ドメインとローカル（localhost / 127.0.0.1）では同じ LP を出す（それ以外は別 LP）
  const showDeaeruIntro =
    host.includes("deaeru-agent.jp") ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1");

  if (showDeaeruIntro) {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: "出会えるエージェント",
          alternateName: ["deaeru-agent.jp", "deaeru agent"],
          url: "https://deaeru-agent.jp/",
          publisher: {
            "@type": "Organization",
            name: "foresma株式会社",
            url: "https://foresma.jp",
          },
        },
        {
          "@type": "Organization",
          name: "出会えるエージェント",
          url: "https://deaeru-agent.jp/",
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* 2026-09-18: 納品デザインのサービスページへ差し替え（番号なしの / は媒体 top 扱い） */}
        <ServicePage inflow={SERVICE_PAGE_TOP_INFLOW} />
      </>
    );
  }

  return <ArticleLP />;
}
