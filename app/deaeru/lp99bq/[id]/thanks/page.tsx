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

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // Gateway への遷移タイミング（2026-09-14: 固定2秒待ちから変更 / 2026-09-18: Yahoo!広告 ytag.js の読込完了を条件に追加）
    //  - 最低 2 秒は滞在する（同居する Meta / TikTok Pixel の送信時間を従来どおり確保）
    //  - かつ Google 広告（AW-18175526274）conversion の event_callback を待ってから遷移する
    //  - かつ Google 広告（AW-18463299655）conversion の event_callback を待ってから遷移する（2026-09-25 追加）
    //  - かつ Yahoo!広告 ytag.js の読込完了（onLoad）を待ってから遷移する（Yahoo には送信完了コールバックが無いため読込完了で代替）
    //  - event_callback / onLoad が来ない環境（gtag.js・ytag.js ブロック等）に備え、2.5 秒で必ず遷移する（フォールバック）
    //  - 重複遷移は hasRedirected でガード
    let hasRedirected = false;
    let minDwellPassed = false;
    let conversionDone = false;
    let conversion18463Done = false;
    let yahooLoaded = false;
    const redirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };
    const tryRedirect = () => {
      if (minDwellPassed && conversionDone && conversion18463Done && yahooLoaded) redirect();
    };
    const w = window as Window & {
      __sarucrewGoogleAdsRedirect?: () => void;
      __sarucrewGoogleAds18463Redirect?: () => void;
      __sarucrewYahooAdsLoaded?: () => void;
    };
    w.__sarucrewGoogleAdsRedirect = () => {
      conversionDone = true;
      tryRedirect();
    };
    w.__sarucrewGoogleAds18463Redirect = () => {
      conversion18463Done = true;
      tryRedirect();
    };
    w.__sarucrewYahooAdsLoaded = () => {
      yahooLoaded = true;
      tryRedirect();
    };

    const minDwellTimer = window.setTimeout(() => {
      minDwellPassed = true;
      tryRedirect();
    }, 2000);
    const fallbackTimer = window.setTimeout(redirect, 2500);

    return () => {
      window.clearTimeout(minDwellTimer);
      window.clearTimeout(fallbackTimer);
      // アンマウント後に遅れて event_callback / onLoad が来ても遷移しないよう参照を外す
      delete w.__sarucrewGoogleAdsRedirect;
      delete w.__sarucrewGoogleAds18463Redirect;
      delete w.__sarucrewYahooAdsLoaded;
    };
  }, [searchParams]);

  return (
    <>
      {/* Yahoo!広告 ytag - サルクルー（コンバージョン B6IQKM6CKFVYOP1DCR1379561）2026-09-18 追加・全LP（thanks）。
          Yahoo には送信完了コールバックが無いため、ytag.js の読込完了（onLoad）を Gateway 遷移の待ち条件に加える
          （読込後は yjDataLayer のキューが即時処理され送信される。フォールバックは useEffect の 2.5秒タイマー） */}
      <Script
        id="deaeru-thanks-yahoo-ads-sarucrew-ytag"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
        onLoad={() => {
          const w = window as Window & { __sarucrewYahooAdsLoaded?: () => void };
          w.__sarucrewYahooAdsLoaded?.();
        }}
      />
      <Script id="deaeru-thanks-yahoo-ads-sarucrew-cookie" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});
      `}</Script>
      <Script id="deaeru-thanks-yahoo-ads-sarucrew-conversion" strategy="afterInteractive">{`
ytag({
  "type":"yjad_conversion",
  "config":{
    "yahoo_ydn_conv_io": "d7aaTRVbD9UpmIEuKTbRgA..",
    "yahoo_ydn_conv_label": "B6IQKM6CKFVYOP1DCR1379561",
    "yahoo_ydn_conv_transaction_id": "",
    "yahoo_ydn_conv_value": "0",
    "yahoo_email": "",
    "yahoo_phone_number": ""
  }
});
      `}</Script>
      {/* TikTok Pixel - サルクルー（D8BQHIJC77UANKFS41C0）2026-09-17 追加・全ページ base＋page（thanks）。
          依頼スニペットは素の ttq.page() だが、同居する他 TikTok Pixel へ page が重複送信されないよう
          ttq.instance() で送信先を本Pixelに固定する（2026-08-06 D9OMD5 と同方針） */}
      <Script id="deaeru-thanks-tiktok-pixel-sarucrew-d8bqhi" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D8BQHIJC77UANKFS41C0');
  ttq.instance('D8BQHIJC77UANKFS41C0').page();
}(window, document, 'ttq');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18444590797）2026-09-17 追加・全ページ（thanks）。既存 AW-17539380368 / AW-18175526274 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18444"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18444590797"
      />
      <Script id="deaeru-thanks-google-ads-sarucrew-18444-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18444590797');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18463299655）2026-09-25 追加・全商流 thanks（「出会えるエージェント」conversion）。既存 AW-17539380368 / AW-18175526274 / AW-18444590797 とは別アカウント・追加並存 */}
      {/* base ロード完了(onLoad)後に config → conversion を同一フローで実行し、実行順の競合（gtag 未定義での無音失敗）を防ぐ。
          conversion の event_callback は Gateway 遷移の待ち条件のひとつ（useEffect 側の __sarucrewGoogleAds18463Redirect。フォールバックは 2.5 秒タイマー）。 */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18463"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18463299655"
        onLoad={() => {
          const w = window as Window & {
            dataLayer?: unknown[];
            gtag?: (...args: unknown[]) => void;
            __sarucrewGoogleAds18463Redirect?: () => void;
          };
          w.dataLayer = w.dataLayer || [];
          // Google 公式スニペットと同じく arguments オブジェクトを dataLayer に push する
          const gtag = function (..._args: unknown[]) {
            w.dataLayer!.push(arguments);
          };
          w.gtag = gtag;
          gtag("js", new Date());
          gtag("config", "AW-18463299655");
          gtag("event", "conversion", {
            send_to: "AW-18463299655/AhZNCP-Suf4cEMew_uNE",
            transaction_id: "",
            event_callback: () => {
              w.__sarucrewGoogleAds18463Redirect?.();
            },
          });
        }}
      />
      {/* Google 広告 gtag - サルクルー（AW-18175526274）2026-09-14 追加・thanks（「出会えるエージェント」conversion）。既存 AW-17539380368 とは別アカウント・追加並存 */}
      {/* base ロード完了(onLoad)後に config → conversion を同一フローで実行し、
          実行順の競合（gtag 未定義での無音失敗）を防ぐ。conversion の event_callback で Gateway へ遷移する（フォールバックは useEffect の 2.5秒タイマー）。 */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18175"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18175526274"
        onLoad={() => {
          const w = window as Window & {
            dataLayer?: unknown[];
            gtag?: (...args: unknown[]) => void;
            __sarucrewGoogleAdsRedirect?: () => void;
          };
          w.dataLayer = w.dataLayer || [];
          // Google 公式スニペットと同じく arguments オブジェクトを dataLayer に push する
          const gtag = function (..._args: unknown[]) {
            w.dataLayer!.push(arguments);
          };
          w.gtag = gtag;
          gtag("js", new Date());
          gtag("config", "AW-18175526274");
          gtag("event", "conversion", {
            send_to: "AW-18175526274/7OliCM7a7_YcEIKL4tpD",
            transaction_id: "",
            event_callback: () => {
              w.__sarucrewGoogleAdsRedirect?.();
            },
          });
        }}
      />
      {/* TikTok Pixel - サルクルー（D9OMD5BC77U1C011Q3MG）2026-08-06 追加・thanks限定（page + CompleteRegistration + Purchase） */}
      {/* 依頼スニペットは素の ttq.track だが、lp99bl/lp99bu には既存TikTok Pixel（D8JO34RC77U7JESGMHNG）が
          同居しており、素の track/page は読み込み済み全Pixelへ一斉送信されて誤発火するため、
          全LPで ttq.instance() により送信先を本Pixelに固定する（Meta trackSingle 統一と同方針） */}
      <Script id="deaeru-thanks-tiktok-pixel-sarucrew-d9omd5" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D9OMD5BC77U1C011Q3MG');
  ttq.instance('D9OMD5BC77U1C011Q3MG').page();
  ttq.instance('D9OMD5BC77U1C011Q3MG').track('CompleteRegistration');
  ttq.instance('D9OMD5BC77U1C011Q3MG').track('Purchase');
}(window, document, 'ttq');
      `}</Script>
      {/* Meta Pixel - サルクルー（2363966233988993）2026-07-01 追加・CompleteRegistration（thanks） */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-2363" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2363966233988993');
fbq('track', 'PageView');
fbq('trackSingle','2363966233988993','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2363966233988993&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（1911173825727819）2026-07-24 追加 */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-1911" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1911173825727819');
fbq('trackSingle','1911173825727819','PageView');
fbq('trackSingle','1911173825727819','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1911173825727819&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（894859009685893）2026-07-24 追加 */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-8948" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '894859009685893');
fbq('trackSingle','894859009685893','PageView');
fbq('trackSingle','894859009685893','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=894859009685893&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel Code - 自社(foresm)向け */}
      <Script id="meta-pixel-foresm" strategy="afterInteractive">
        {`
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
