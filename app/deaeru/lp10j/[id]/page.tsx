import { type Metadata } from "next";

import { LineDirectIntro } from "../../_shared/LineDirectIntro";
import { LP10_BODY_IMAGES, LP10_MID_CTAS } from "../../_shared/lp10BodyImages";

// ▼▼▼ 設定エリア（CTAの遷移先LINE/LIFFリンク） ▼▼▼
// lp10j 用 linkId（新基盤 lreach-line 発行・2026-08-19 受領）。
// インハウス リストマーケ（診断）シナリオ。lp10i 複製。
// LIFF ID（2008193428-jBcEHiff）と to（e8f0d2d9-...）は08系共通を流用。
const CTA_URL =
  "https://liff.line.me/2008193428-jBcEHiff?linkId=3f016f18-59f1-43d3-9ba7-7ed127cc4383&to=e8f0d2d9-b9be-4055-8758-e6443e23b8be";
// ▲▲▲ 設定エリアここまで ▲▲▲

const LP_KEY = "deaeru-lp10j";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp10j/${id}`;

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

export default async function LP10jDeaeru({ params }: Props) {
  await params;

  return (
    <LineDirectIntro
      lpKey={LP_KEY}
      ctaUrl={CTA_URL}
      fvImage="/deaeru-lp10-fv.png"
      bodyImages={LP10_BODY_IMAGES}
      conditionPopup
      showDiagnosisCount={false}
      bottomCta
      midCtas={LP10_MID_CTAS}
    />
  );
}
