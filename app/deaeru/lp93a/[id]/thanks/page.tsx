"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import {
  GA4_EVENTS,
  restoreParamsForThanks,
  sendGa4Event,
} from "@/app/deaeru/lp93a/[id]/_utils/ga4";

export default function ThanksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gateway URLにパラメータを追加
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");
    const sidParam = searchParams.get("sid");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // 二重遷移を防ぐガード
    let hasRedirected = false;
    const redirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    // GA4: LINE導線への自動遷移直前イベント。
    // GA4 本体は layout の <GoogleAnalytics> が初期化済みのため gtag ロード待ちは不要。
    // beacon 送信し、発火完了(event_callback)で遷移する。
    sendGa4Event(
      GA4_EVENTS.LINE_GATEWAY_REDIRECT,
      {
        ...restoreParamsForThanks(),
        redirect_url: gatewayUrl,
      },
      { useBeacon: true, onComplete: redirect }
    );

    // 最終フォールバック: event_callback が来ない環境でも必ず遷移させる。
    const fallback = setTimeout(redirect, 3000);
    return () => clearTimeout(fallback);
  }, [searchParams]);

  return (
    <>
      {/* GA4 (G-0QL09NJ8ZS) は [id]/layout.tsx の <GoogleAnalytics> が設置するため、
          ここでは gtag.js base を設置しない（イベントは sendGa4Event=sendGAEvent 経由で送る）。 */}
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
      {/* X (Twitter) コンバージョン計測 ベースコード - 緒方ASP向け（全ページhead設置）
          rcrwm = 旧Xアカウント（BAN後復旧中・残置） / re139 = 新Xアカウント（2026-07-22追加・併設） */}
      <Script id="deaeru-x-pixel-ogata" strategy="afterInteractive">
        {`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','rcrwm');
/* 緒方 新Xアカウント（re139）*/
twq('config','re139');
        `}
      </Script>
      {/* TikTok Pixel - 緒方ASP向け（2026-07-31 TikTok運用開始に伴い設置）
          ベースコードとCVイベントを同一Script内に置き、load→page→track の順を保証する
          （別Scriptに分けると afterInteractive の実行順が保証されず track が先行して失敗しうる）。
          ※ 依頼書のイベントコードは fbq('track','CompleteRegistration') と記載されていたが、
             TikTok は ttq のため ttq.track に読み替えて設置している。 */}
      <Script id="deaeru-tiktok-pixel-ogata" strategy="afterInteractive">
        {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D9LGIARC77U59KIVU2P0');
  ttq.page();
  /* CV（フォーム回答完了）*/
  ttq.track('CompleteRegistration');
}(window, document, 'ttq');
        `}
      </Script>

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
