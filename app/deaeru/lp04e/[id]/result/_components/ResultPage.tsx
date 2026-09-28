"use client";

import Link from "next/link";
import Script from "next/script";

const GTM_ID = "GTM-W7S9ZNV8";

interface Props {
  id: string;
}

export function ResultPage({ id }: Props) {
  const ctaUrl = `/deaeru/lp02e/${id}`;

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      <Script id="lp04e-result-gtm" strategy="afterInteractive">{`
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

      <div className="mx-auto max-w-[480px]">
        <img
          src="/deaeru-lp04e-result-header.png"
          alt="診断結果ヘッダー"
          className="block w-full"
        />

        <div className="relative">
          <img
            src="/deaeru-lp04e-result-page1.png"
            alt="診断結果 ページ1"
            className="block w-full"
          />
          <Link
            href={ctaUrl}
            className="absolute bottom-5 left-0 right-0 block animate-[pulse_2s_ease-in-out_infinite] px-6"
          >
            <img
              src="/deaeru-lp04e-result-cta-button.png"
              alt="公式サイトはこちら"
              className="block w-full"
            />
          </Link>
        </div>

        <div className="relative">
          <img
            src="/deaeru-lp04e-result-page2.png"
            alt="診断結果 ページ2"
            className="block w-full"
          />
          <Link
            href={ctaUrl}
            className="absolute bottom-5 left-0 right-0 block animate-[pulse_2s_ease-in-out_infinite] px-6"
          >
            <img
              src="/deaeru-lp04e-result-cta-button.png"
              alt="公式サイトはこちら"
              className="block w-full"
            />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
