import { type Metadata } from "next";

import { LineDirectIntro } from "../../_shared/LineDirectIntro";
import { LP10_BODY_IMAGES, LP10_MID_CTAS } from "../../_shared/lp10BodyImages";

// ▼▼▼ 設定エリア（CTAの遷移先LINE/LIFFリンク） ▼▼▼
// lp10g 用 linkId（新基盤 lreach-line 発行・2026-07-22 受領）。
// インハウスX広告リストマーケ（記事LP lp11c の遷移先）。
// LIFF ID（2008193428-jBcEHiff）と to（e8f0d2d9-...）は08系共通を流用。
const CTA_URL =
  "https://liff.line.me/2008193428-jBcEHiff?linkId=da7e015a-6d04-41df-93e6-240dd5d5ebc0&to=e8f0d2d9-b9be-4055-8758-e6443e23b8be";
// ▲▲▲ 設定エリアここまで ▲▲▲

const LP_KEY = "deaeru-lp10g";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp10g/${id}`;

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

export default async function LP10gDeaeru({ params }: Props) {
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
