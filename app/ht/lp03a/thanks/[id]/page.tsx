import { type Metadata } from "next";
import Script from "next/script";

import { Main } from "@/app/ht/lp03a/thanks/[id]/_components";

export const metadata: Metadata = {
  title: "株式会社HRteam　中途採用エントリーフォーム　送信完了",
};

export default function Thanks() {
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
      <Main />
      <footer></footer>
    </>
  );
}
