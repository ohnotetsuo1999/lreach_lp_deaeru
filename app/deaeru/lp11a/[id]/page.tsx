import { type Metadata } from "next";

import { Lp11Article } from "../../_shared/Lp11Article";

// ▼▼▼ 設定エリア（CTAの遷移先＝本LP） ▼▼▼
// lp11a（記事LP・インハウスMeta広告リストマーケ）→ 本LP lp10e へ遷移。URL の [id] をそのまま引き継ぐ。
const CTA_BASE_URL = "https://deaeru-agent.jp/deaeru/lp10e/";
// ▲▲▲ 設定エリアここまで ▲▲▲

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title =
    "手取り43万・残業なしの神求人をもらって、初めての転職で大成功した話｜出会えるエージェント";
  const description =
    "実は、いい求人は転職サイトには載っていない。非公開求人を多数保有する優良エージェントを厳選紹介。完全無料でLINE追加するだけ。";
  const canonicalPath = `/deaeru/lp11a/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "article",
      siteName: "出会えるエージェント",
      url: canonicalPath,
      title,
      description,
    },
    title,
  };
}

export default async function LP11aDeaeru({ params }: Props) {
  const { id } = await params;

  return <Lp11Article lpKey="deaeru-lp11a" ctaUrl={`${CTA_BASE_URL}${id}`} />;
}
