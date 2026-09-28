import { type Metadata } from "next";

import { LineDirectIntro } from "../../_shared/LineDirectIntro";

// ▼▼▼ 設定エリア（CTAの遷移先LINE/LIFFリンク。リストマーケ向け） ▼▼▼
const CTA_URL =
  "https://liff.line.me/2008193428-jBcEHiff?linkId=570bee63-df32-4656-8bc9-9c45aefc4efb&to=e8f0d2d9-b9be-4055-8758-e6443e23b8be";
// ▲▲▲ 設定エリアここまで ▲▲▲

const LP_KEY = "deaeru-lp07d";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp07d/${id}`;

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

export default async function LP07dDeaeru({ params }: Props) {
  await params;

  return (
    <LineDirectIntro
      lpKey={LP_KEY}
      ctaUrl={CTA_URL}
      fvImage="/deaeru_lp07c_FV.png"
    />
  );
}
