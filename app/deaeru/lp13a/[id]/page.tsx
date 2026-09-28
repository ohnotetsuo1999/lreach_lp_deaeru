import { type Metadata } from "next";

import { Lp13Article } from "../../_shared/Lp13Article";

// ▼▼▼ 設定エリア（CTAの遷移先＝本LP） ▼▼▼
// lp13a（看護・記事LP・インハウスMeta広告）→ 本LP lp12b へ遷移。URL の [id] をそのまま引き継ぐ。
const CTA_BASE_URL = "https://deaeru-agent.jp/deaeru/lp12b/";
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
  const canonicalPath = `/deaeru/lp13a/${id}`;

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

export default async function LP13aDeaeru({ params }: Props) {
  const { id } = await params;

  return <Lp13Article lpKey="deaeru-lp13a" ctaUrl={`${CTA_BASE_URL}${id}`} />;
}
