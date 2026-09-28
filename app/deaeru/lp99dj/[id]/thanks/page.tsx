"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

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
    // ad_id を Gateway 経由で tracking まで引き継ぐ
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // タグ発火（Meta CompleteRegistration）の送信時間を確保するため、
    // 2.5 秒後に必ず Gateway へ遷移する。
    let hasRedirected = false;
    const redirectToGateway = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    const fallbackTimer = setTimeout(redirectToGateway, 2500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [searchParams]);

  /* Meta CompleteRegistration（サイバーグリップ base ピクセル 1639429097574124）- 「ご回答ありがとうございます！」表示時に発火。
     2026-09-09 先方依頼: 「表示を制御している React コンポーネントに直接 window.fbq('trackSingle', '1639…', 'CompleteRegistration') を追加」。
     1929… 宛ての CR（sid あり時のみ）とは別に、こちらは条件なしで常時送る。
     base スクリプト（下の <Script>・afterInteractive）が未実行で fbq が無い場合は保留フラグを立て、base 末尾で送る（発火保証） */
  useEffect(() => {
    const w = window as Window & {
      fbq?: (...args: unknown[]) => void;
      __cybergripMetaCrPending1639?: boolean;
    };
    if (typeof w.fbq === "function") {
      w.fbq("trackSingle", "1639429097574124", "CompleteRegistration");
    } else {
      w.__cybergripMetaCrPending1639 = true;
    }
  }, []);

  return (
    <>
      {/*
        ASP: サイバーグリップ（新規ASP）向け thanks。2026-09-03 に lp99dg（yaaha Google用・タグ中継状態）から複製。
        タグ構成（2026-09-08 先方支給タグ設置）: 自社Pixel 578175028373311（PageView＋CR）
          ＋サイバーグリップ Meta Pixel（1639429097574124=base PageView＋CR（2026-09-09 追加・常時） / 1929986731213993=CR。sid（fbclid/ttclid）あり時のみ CR）
          ＋サイバーグリップ TikTok Pixel（DA450T3C77U14HQM62NG。base＋CR。sid あり時のみ CR）
        複製元にあった旧ASP固有の成果地点タグ（ACS）は削除済み。
      */}
      {/* Meta Pixel - 自社（578175028373311）＋サイバーグリップ（1639429097574124=base / 1929986731213993=イベント用）
          自社 CR は従来どおり常時。先方の CR は「弊社経由のみ」に合わせ、thanks に引き継がれた sid（= fbclid / ttclid）がある場合だけ。
          すべて trackSingle で該当ピクセル限定（自社の CR が先方 base へ混ざらないよう track→trackSingle に変更） */}
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
/* 自社 */
fbq('init', '578175028373311');
fbq('trackSingle', '578175028373311', 'PageView');
fbq('trackSingle', '578175028373311', 'CompleteRegistration');
/* サイバーグリップ base（PageView 用） */
fbq('init', '1639429097574124');
fbq('trackSingle', '1639429097574124', 'PageView');
/* 1639… 宛て CR（2026-09-09 先方依頼・常時）: useEffect 側が base 未実行で保留した場合はここで送る */
if (window.__cybergripMetaCrPending1639) {
  fbq('trackSingle', '1639429097574124', 'CompleteRegistration');
  window.__cybergripMetaCrPending1639 = false;
}
/* サイバーグリップ イベント用（init は補完）: CR は弊社経由（sid あり）のみ */
fbq('init', '1929986731213993');
if (new URLSearchParams(window.location.search).get('sid')) {
  fbq('trackSingle', '1929986731213993', 'CompleteRegistration');
}
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
        {/* Meta Pixel noscript: サイバーグリップ base（1639429097574124） */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1639429097574124&ev=PageView&noscript=1"
        />
      </noscript>
      {/* TikTok Pixel - サイバーグリップ（DA450T3C77U14HQM62NG）2026-09-04 先方支給タグ設置
          base（ttq.load + page）＋ CompleteRegistration（登録完了）。
          CR は先方依頼「弊社経由の流入のみ」に合わせ、thanks に引き継がれた sid（= ttclid）がある場合だけ発火。
          base と CR を同一スクリプト内で実行し順序を保証する（CLAUDE.md タグ発火保証ルール） */}
      <Script id="deaeru-thanks-tiktok-pixel-cybergrip" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('DA450T3C77U14HQM62NG');
  ttq.page();
  if (new URLSearchParams(window.location.search).get('sid')) {
    ttq.instance('DA450T3C77U14HQM62NG').track('CompleteRegistration');
  }
}(window, document, 'ttq');
      `}</Script>

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
