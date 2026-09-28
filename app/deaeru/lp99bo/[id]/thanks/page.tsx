"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

// チョクドリ（chokudori・ASP）経由 Meta Pixel（メディア不明）— lp99bo/009 のみ（2026-09-11 タグ設置依頼）
const CHOKUDORI_META_PIXEL_ID = "1652272609602528";

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id ?? "";

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
    // chokudori 用 ad_id を Gateway 経由で tracking まで引き継ぐ
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // タグ発火（Meta Pixel CompleteRegistration / Google Ads conversion）の
    // 送信時間を確保するため、リダイレクトをグローバルに公開して
    // gtag の event_callback から呼べるようにする。
    // event_callback が来なくても 2.5 秒後には必ず遷移するフォールバックを設定。
    let hasRedirected = false;
    const redirectToGateway = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    // gtag の conversion event_callback から参照する
    (window as Window & { __chokudoriRedirect?: () => void }).__chokudoriRedirect =
      redirectToGateway;

    const fallbackTimer = setTimeout(redirectToGateway, 2500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [searchParams]);

  return (
    <>
      {/* 引き継ぎタグ - chokudori経由メディア（ユニクエスト系 / ust-ad.com）2026-08-05 追加（LPの各ページに設置） */}
      <Script
        id="uniquest-cvsu"
        strategy="beforeInteractive"
        src="https://adjs.ust-ad.com/scripts/cvsu.js"
        data-custom-key="pbid"
      />
      {/*
        Meta Pixel（lp99bo/009 では 2 つの Pixel が同居するため、全イベントを trackSingle で宛先指定）
        - 578175028373311: 自社（foresm）向け — PageView ＋ CompleteRegistration
        - 1652272609602528: チョクドリ（chokudori・ASP）経由 / メディア不明 — **lp99bo/009 のみ**（ID限定発火）
          2026-09-11 タグ設置依頼。依頼どおり PageView ＋ Purchase（value 0.00 / JPY は先方コードのまま）
      */}
      <Script id="meta-pixel-foresm" strategy="afterInteractive">
        {`
/* Meta Pixel - 自社（foresm）向け */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '578175028373311');
fbq('trackSingle', '578175028373311', 'PageView');
fbq('trackSingle', '578175028373311', 'CompleteRegistration');
${
  id === "009"
    ? `/* Meta Pixel - チョクドリ（chokudori）経由・メディア不明 / lp99bo/009 のみ */
fbq('init', '${CHOKUDORI_META_PIXEL_ID}');
fbq('trackSingle', '${CHOKUDORI_META_PIXEL_ID}', 'PageView');
fbq('trackSingle', '${CHOKUDORI_META_PIXEL_ID}', 'Purchase', {value: 0.00, currency: 'JPY'});`
    : ""
}
        `}
      </Script>
      {/* Google タグ（gtag.js）- chokudori AW-1010340517（2026-06-12 追加） */}
      {/* base ロード完了(onLoad)後に config → conversion を同一フローで実行し、
          実行順の競合を防ぐ。conversion の event_callback でGatewayへ遷移する。 */}
      <Script
        id="gtag-chokudori-base"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-1010340517"
        onLoad={() => {
          const w = window as Window & {
            dataLayer?: unknown[];
            gtag?: (...args: unknown[]) => void;
            __chokudoriRedirect?: () => void;
          };
          w.dataLayer = w.dataLayer || [];
          // gtag は引数列を dataLayer に push する。Google Ads(gtag.js)は
          // dataLayer の各エントリを引数列として解釈するため、push(args) で動作する。
          const gtag = (...args: unknown[]) => {
            w.dataLayer!.push(args);
          };
          w.gtag = gtag;
          gtag("js", new Date());
          gtag("config", "AW-1010340517");
          // CV イベント（chokudori conversion）。発火完了後にGatewayへ遷移。
          gtag("event", "conversion", {
            send_to: "AW-1010340517/ssFjCM7hurgcEKWl4uED",
            value: 1.0,
            currency: "JPY",
            event_callback: () => {
              w.__chokudoriRedirect?.();
            },
          });
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
      {id === "009" && (
        <noscript>
          {/* Meta Pixel noscript: チョクドリ（chokudori）経由・メディア不明 / lp99bo/009 のみ */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${CHOKUDORI_META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      )}

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
