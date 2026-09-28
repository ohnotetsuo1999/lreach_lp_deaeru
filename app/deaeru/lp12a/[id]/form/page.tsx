import { type Metadata } from "next";
import Script from "next/script";

import { FormPage } from "@/app/deaeru/lp12a/[id]/_components";

// 直アクセス・新規タブ開き用の GTM（通常導線は lp12a/[id]/page.tsx の同一ページ内切替で Intro の GTM が生きる）。
// 2026-09-17: フォームページに W7S9ZNV8 が無く、/form 直アクセス時にタグが動かなかったため設置。
const GTM_ID = "GTM-W7S9ZNV8";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント看護";
  const description =
    "あなたの希望条件に合った看護師転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp12a/${id}/form`;

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

export default async function LP12aDeaeruForm({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
      <FormPage id={id} />
    </>
  );
}
