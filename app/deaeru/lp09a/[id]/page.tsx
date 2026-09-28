import { type Metadata } from "next";

import { Lp09Article } from "../../_shared/Lp09Article";

const LP_KEY = "deaeru-lp09a";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp09a/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "website",
      siteName: "出会えるエージェント",
      url: canonicalPath,
      title,
      description,
    },
    title,
  };
}

export default async function LP09aDeaeru({ params }: Props) {
  const { id } = await params;

  // 記事LP -> 本LP（lp08f）へ id を引き継いで遷移
  return <Lp09Article lpKey={LP_KEY} ctaHref={`/deaeru/lp08f/${id}`} />;
}
