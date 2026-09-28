import { type Metadata } from "next";
import Script from "next/script";

import { LineDirectIntro } from "../../_shared/LineDirectIntro";
import { LP10_BODY_IMAGES, LP10_MID_CTAS } from "../../_shared/lp10BodyImages";

// ▼▼▼ 設定エリア（CTAの遷移先LINE/LIFFリンク） ▼▼▼
// lp10e 用 linkId（新基盤 lreach-line 発行・2026-07-22 受領）。
// インハウスMeta広告リストマーケ（記事LP lp11a の遷移先）。
// LIFF ID（2008193428-jBcEHiff）と to（e8f0d2d9-...）は08系共通を流用。
const CTA_URL =
  "https://liff.line.me/2008193428-jBcEHiff?linkId=7955a795-cee1-469c-b758-221c188d6da5&to=e8f0d2d9-b9be-4055-8758-e6443e23b8be";
// ▲▲▲ 設定エリアここまで ▲▲▲

const LP_KEY = "deaeru-lp10e";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp10e/${id}`;

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

export default async function LP10eDeaeru({ params }: Props) {
  await params;

  return (
    <>
      {/* Meta Pixel - 自社（インハウスMeta広告）向け。lp10e のみ設置（lp10f〜h はX広告用のため設置なし） */}
      <Script id="deaeru-meta-pixel-inhouse-lp10e" strategy="afterInteractive">{`
/* Meta Pixel - 自社（インハウスMeta広告）向け */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '578175028373311');
fbq('track', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
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
    </>
  );
}
