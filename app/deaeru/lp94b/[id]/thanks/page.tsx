"use client";

/*
 * lp94b thanks（緒方ASP）。lp94a thanks をベースに作成。
 * 緒方Meta Pixel（1333575804939284 / 1061213309566860）は
 * LP完成後に要否を再確認する方針のため未設置（2026-08-21 ユーザー判断）。
 * 設置する場合は lp94a/[id]/thanks/page.tsx を参照（trackSingle・自前ローダー方式）。
 * X Pixel base（rcrwm/re139 両config）は 2026-08-28 の追加依頼
 * 「lp94b配下の全ページ head に設置」に伴い設置（イベント発火はなし・configのみ）。
 */

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

import { OgataXPixelScript } from "@/app/deaeru/_shared/ogata/ogataXTags";

export default function ThanksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gateway URLにパラメータを追加
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

    // Meta Pixel CompleteRegistrationイベント発火後、2秒待ってリダイレクト
    setTimeout(() => {
      window.location.href = gatewayUrl;
    }, 2000);
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* X (Twitter) base config のみ（緒方 rcrwm / re139 / rexm3）。イベント発火なし。
          2026-09-10: 共通部品に置き換え（rexm3 追加・本番ドメイン限定） */}
      <OgataXPixelScript page="thanks" scriptId="deaeru-lp94b-thanks-x-pixel-ogata" />

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-10 text-green-500"
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

          <div className="inline-block size-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        </div>
      </div>
    </>
  );
}
