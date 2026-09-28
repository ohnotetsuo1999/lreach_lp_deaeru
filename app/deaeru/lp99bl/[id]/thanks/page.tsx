"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ThanksPage() {
  const searchParams = useSearchParams();
  // LP ID（/deaeru/lp99bl/[id]/thanks の id）。ID限定発火の判定に使う（現在 thanks では未使用・Intro と対称のため残置）
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id ?? "";

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
  }, [searchParams, id]);

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
      {/* Google 広告 gtag - サルクルー（AW-17539380368）2026-06-22 追加 */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17539380368"
      />
      <Script id="deaeru-thanks-google-ads-sarucrew-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17539380368');
      `}</Script>
      {/* Event snippet for 出会えるエージェント_LINE登録完了 conversion page - サルクルー */}
      <Script id="deaeru-thanks-google-ads-sarucrew-conversion" strategy="afterInteractive">{`
gtag('event', 'conversion', {'send_to': 'AW-17539380368/-0FCCMr7jcEcEJDptqtB'});
      `}</Script>
      {/* Meta Pixel - サルクルー（1021752120329261）2026-06-22 追加・Purchase */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-1021" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1021752120329261');
fbq('track', 'PageView');
fbq('trackSingle','1021752120329261','Purchase');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1021752120329261&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（2363966233988993）2026-06-30 追加・CompleteRegistration */}
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
      {/* Meta Pixel - サルクルー（25871587842496179）2026-07-10 追加・Purchase */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-2587" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '25871587842496179');
fbq('trackSingle','25871587842496179','PageView');
fbq('trackSingle','25871587842496179','Purchase',{value: 0.00, currency: 'JPY'});
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=25871587842496179&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（1541561610975319）2026-07-10 追加・CompleteRegistration。autoConfig=false 指定あり */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-1541" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('set', 'autoConfig', false, '1541561610975319');
fbq('init', '1541561610975319');
fbq('trackSingle','1541561610975319','PageView');
fbq('trackSingle','1541561610975319','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1541561610975319&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（2468416596919531）2026-07-14 追加・base（PageViewのみ・CVイベント未指定） */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-2468" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2468416596919531');
fbq('trackSingle','2468416596919531','PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2468416596919531&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel Code */}
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
fbq('init', '2150859532314009');
fbq('track', 'PageView');
fbq('init', '578175028373311');
fbq('track', 'PageView');
fbq('trackSingle','2150859532314009','CompleteRegistration');
fbq('trackSingle','578175028373311','CompleteRegistration');
        `}
      </Script>
      <Script id="deaeru-tiktok-pixel-sarucrew-2026-06" strategy="afterInteractive">{`
/* TikTok Pixel - サルクルー（D8JO34RC77U7JESGMHNG）2026-06-12 追加 */
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D8JO34RC77U7JESGMHNG');
  ttq.page();
}(window, document, 'ttq');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2150859532314009&ev=PageView&noscript=1"
        />
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（2170221810229200）2026-09-18 追加 / thanks のみ・PageView＋CompleteRegistration（依頼どおり）。
          同居する他 Pixel に乗らないよう trackSingle で本Pixel限定。
          ※ 旧来の自社＋2150 ブロック（meta-pixel-init）は素の fbq('track') で「その時点で init 済みの全Pixel」に送るため、本ブロックはその後ろに置く（重複防止） */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-2170" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2170221810229200');
fbq('trackSingle','2170221810229200','PageView');
fbq('trackSingle','2170221810229200','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2170221810229200&ev=PageView&noscript=1"
        />
      </noscript>
      {/* X conversion tracking base code - サルクルー向け */}
      <Script id="deaeru-x-conversion-sarucrew-base" strategy="afterInteractive">{`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','rcpi0');
      `}</Script>
      {/* X conversion tracking event code - サルクルー向け */}
      <Script id="deaeru-x-conversion-sarucrew-event" strategy="afterInteractive">{`
twq('event', 'tw-rcpi0-rcpi1', {
  value: null,
  currency: null,
  contents: [
    {
      content_type: null,
      content_id: null,
      content_name: null,
      content_price: null,
      num_items: null,
      content_group_id: null
    }
  ],
  status: null,
  conversion_id: null,
  email_address: null,
  phone_number: null
});
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
