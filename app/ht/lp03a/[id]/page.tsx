import { type Metadata } from "next";
import Script from "next/script";

import { Main } from "@/app/ht/lp03a/[id]/_components";

export const metadata: Metadata = {
  title: "株式会社貴瞬　中途採用エントリーフォーム",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LP03A({ params }: Props) {
  const { id } = await params;

  return (
    <>
      {/* Google Tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17676212788"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17676212788');
        `}
      </Script>
      <header></header>
      <Main id={id} />
      <footer></footer>
    </>
  );
}
