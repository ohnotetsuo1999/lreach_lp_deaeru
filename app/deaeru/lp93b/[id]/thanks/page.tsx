"use client";

/*
 * lp93b thanks（緒方ASP）。lp93a thanks を元に作成（2026-09-10）。
 * タグ: 自社 Meta Pixel 578175028373311（PageView＋CompleteRegistration）＋ X base config（rcrwm / re139 / rexm3・イベント発火なし）。
 * lp93a にある TikTok Pixel（CompleteRegistration）と GA4 は持ち込まない（2026-09-10 ユーザー判断）。
 * タグ送信の時間を確保するため 2.5 秒後に Gateway へ遷移する。
 */

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

import { OgataXPixelScript } from "@/app/deaeru/_shared/ogata/ogataXTags";

export default function ThanksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");
    const sidParam = searchParams.get("sid");
    const adIdParam = searchParams.get("ad_id");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? "?" + params.toString() : ""}`;

    let hasRedirected = false;
    const redirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    const fallback = setTimeout(redirect, 2500);
    return () => clearTimeout(fallback);
  }, [searchParams]);

  return (
    <>
      {/* Meta Pixel - 自社(foresm)向け */}
      <Script id="meta-pixel-foresm" strategy="afterInteractive">
        {`
/* Meta Pixel - 自社(foresm)向け */
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
fbq('track', 'CompleteRegistration');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
      {/* X (Twitter) base config のみ（緒方 3アカウント）。イベント発火なし・本番ドメイン限定 */}
      <OgataXPixelScript page="thanks" scriptId="deaeru-lp93b-thanks-x-pixel-ogata" />

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-purple-100">
              <svg
                className="size-10 text-[#883fc0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-xl font-bold text-gray-800">
            ご回答ありがとうございます！
          </h1>

          <p className="mb-8 text-gray-600">
            LINE登録ページへ移動しています...
          </p>

          <div className="inline-block size-12 animate-spin rounded-full border-4 border-[#883fc0] border-t-transparent" />
        </div>
      </div>
    </>
  );
}
