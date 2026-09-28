"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp99w";
const REFERRER_STORAGE_KEY = "deaeru_lp_referrer_url";
const GTM_ID = "GTM-W7S9ZNV8";

const buildReferrerUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.searchParams.has("lp")) {
      parsedUrl.searchParams.set("lp", LP_KEY);
    }
    return parsedUrl.toString();
  } catch (error) {
    return url;
  }
};

interface Props {
  updateIsCta1Submitted: (isCta1Submitted: boolean) => void;
  updateIsIntroVisible: (isIntroVisible: boolean) => void;
}

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const [showFixedButton, setShowFixedButton] = useState(false);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const referrerUrl = buildReferrerUrl(window.location.href);
      window.localStorage.setItem(REFERRER_STORAGE_KEY, referrerUrl);
    } catch (error) {
      // localStorageが使えない場合は何もしない
    }
  }, []);


  useEffect(() => {
    const target = buttonRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedButton(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  useEffect(() => {
    const source = searchParams.get("source") || searchParams.get("utm_source");
    const medium = searchParams.get("medium") || searchParams.get("utm_medium");
    const campaign =
      searchParams.get("campaign") || searchParams.get("utm_campaign");
    const adId = searchParams.get("ad_id");

    if (source || medium || campaign || adId) {
      const trackingData = {
        source: source || "direct",
        medium: medium || null,
        campaign: campaign || null,
        adId: adId || null,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      localStorage.setItem("ad_tracking", JSON.stringify(trackingData));

      const history = JSON.parse(
        localStorage.getItem("ad_tracking_history") || "[]"
      ) as typeof trackingData[];
      history.push(trackingData);
      if (history.length > 100) history.shift();
      localStorage.setItem("ad_tracking_history", JSON.stringify(history));
    }
  }, [searchParams]);

  const handleCtaClick = () => {
    updateIsCta1Submitted(true);
    updateIsIntroVisible(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleCtaTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    touchStartYRef.current = event.touches[0].clientY;
  };

  const handleCtaTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    const touchEndY = event.changedTouches[0].clientY;
    const touchStartY = touchStartYRef.current;
    if (touchStartY !== null && Math.abs(touchEndY - touchStartY) > 8) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = null;
    event.preventDefault();
    handleCtaClick();
  };

  return (
    <div className="min-h-screen bg-white text-[#333] overflow-x-hidden">
      {/* Google 広告 gtag - サルクルー（AW-17539380368）2026-06-22 追加 */}
      <Script
        id="deaeru-google-ads-sarucrew"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17539380368"
      />
      <Script id="deaeru-google-ads-sarucrew-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17539380368');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18175526274）2026-09-14 追加。既存 AW-17539380368 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="deaeru-google-ads-sarucrew-18175"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18175526274"
      />
      <Script id="deaeru-google-ads-sarucrew-18175-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18175526274');
      `}</Script>
      {/* TikTok Pixel - サルクルー（D8BQHIJC77UANKFS41C0）2026-09-17 追加・全ページ base＋page（LPトップ）。
          依頼スニペットは素の ttq.page() だが、同居する他 TikTok Pixel へ page が重複送信されないよう
          ttq.instance() で送信先を本Pixelに固定する（2026-08-06 D9OMD5 と同方針） */}
      <Script id="deaeru-tiktok-pixel-sarucrew-d8bqhi" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D8BQHIJC77UANKFS41C0');
  ttq.instance('D8BQHIJC77UANKFS41C0').page();
}(window, document, 'ttq');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18444590797）2026-09-17 追加・全ページ（LPトップ）。既存 AW-17539380368 / AW-18175526274 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="deaeru-google-ads-sarucrew-18444"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18444590797"
      />
      <Script id="deaeru-google-ads-sarucrew-18444-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18444590797');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18463299655）2026-09-25 追加・全商流（LPトップ）。既存 AW-17539380368 / AW-18175526274 / AW-18444590797 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="deaeru-google-ads-sarucrew-18463"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18463299655"
      />
      <Script id="deaeru-google-ads-sarucrew-18463-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18463299655');
      `}</Script>
      {/* Meta Pixel - サルクルー経由（メディア未確認）（1761460088419219）2026-09-25 追加・全商流（LPトップのみ・PageView のみ）。
          2026-09-08 に lp99bl のみへ設置 → 過剰発火防止のため一度削除（2026-09-25 マージ済み）してから全商流へ再設置。trackSingle で本Pixel限定 */}
      <Script id="deaeru-meta-pixel-sarucrew-1761" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1761460088419219');
fbq('trackSingle','1761460088419219','PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1761460088419219&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Yahoo!広告 ytag - サルクルー（コンバージョン 5O536T30DR1K15BANQ1379558 ／ サイトリターゲティング 60M3FSXJ2H）2026-09-18 追加・全LP（LPトップ）。
          依頼文どおり ytag.js 読込と ytag 定義を2回記載（next/script は同一 src を1回しか読み込まず、ytag.js 自体も2回目は no-op なので実害なし）。
          ytag() は yjDataLayer へのキュー投入で、ytag.js 読込後に順次処理されるため実行順に依存しない */}
      <Script
        id="deaeru-yahoo-ads-sarucrew-ytag"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
      />
      <Script id="deaeru-yahoo-ads-sarucrew-cookie" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});
      `}</Script>
      <Script id="deaeru-yahoo-ads-sarucrew-conversion" strategy="afterInteractive">{`
ytag({
  "type":"yjad_conversion",
  "config":{
    "yahoo_ydn_conv_io": "d7aaTRVbD9UpmIEuKTbRgA..",
    "yahoo_ydn_conv_label": "5O536T30DR1K15BANQ1379558",
    "yahoo_ydn_conv_transaction_id": "",
    "yahoo_ydn_conv_value": "0",
    "yahoo_email": "",
    "yahoo_phone_number": ""
  }
});
      `}</Script>
      <Script
        id="deaeru-yahoo-ads-sarucrew-ytag-2"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
      />
      <Script id="deaeru-yahoo-ads-sarucrew-retargeting" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({
  "type":"yjad_retargeting",
  "config":{
    "yahoo_retargeting_id": "60M3FSXJ2H",
    "yahoo_retargeting_label": "",
    "yahoo_retargeting_page_type": "",
    "yahoo_retargeting_items":[
      {item_id: '', category_id: '', price: '', quantity: ''}
    ]
  }
});
      `}</Script>
      {/* Meta Pixel - サルクルー（1021752120329261）2026-06-22 追加 */}
      <Script id="deaeru-meta-pixel-sarucrew-1021" strategy="afterInteractive">{`
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
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1021752120329261&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（2363966233988993）2026-06-30 追加 */}
      <Script id="deaeru-meta-pixel-sarucrew-2363" strategy="afterInteractive">{`
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
fbq('track', 'ViewContent');
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
      <Script id="deaeru-meta-pixel-sarucrew-1911" strategy="afterInteractive">{`
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
fbq('trackSingle','1911173825727819','ViewContent');
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
      <Script id="deaeru-meta-pixel-sarucrew-8948" strategy="afterInteractive">{`
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
fbq('trackSingle','894859009685893','ViewContent');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=894859009685893&ev=PageView&noscript=1"
        />
      </noscript>
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <Script id="deaeru-meta-pixel" strategy="afterInteractive">{`
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
      `}</Script>
      <Script id="deaeru-tiktok-pixel" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D6PTPQBC77UC2AGNVOMG');
  ttq.page();
  ttq.track('CompleteRegistration')
  ttq.track('CompletePayment')
}(window, document, 'ttq');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        @keyframes button-bounce-no-shadow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(8px);
          }
        }
        .animate-button-bounce-no-shadow {
          animation: button-bounce-no-shadow 1.5s infinite;
        }
      `}</style>

      {/* FV: 画像ベース（インハウス lp01b パターン） */}
      <MaxWidth>
        <div className="relative">
          <img
            className="block w-full"
            src="/deaeru-lp99a-intro.png"
            alt="出会えるエージェント - 転職こそ、タイパの時代。"
          />
          <button
            ref={buttonRef}
            className="touch-manipulation absolute bottom-[7%] left-0 right-0 mx-auto block w-[82%]"
            onClick={handleCtaClick}
            onTouchStart={handleCtaTouchStart}
            onTouchEnd={handleCtaTouchEnd}
          >
            <div className="relative animate-button-bounce-no-shadow">
              <img
                className="block w-full"
                src="/deaeru-lp99a-cta-button.png"
                alt="エージェント診断START"
              />
            </div>
          </button>
        </div>
      </MaxWidth>

      {/* フローティングCTAボタン */}
      {showFixedButton && (
        <div className="fixed bottom-[8%] left-0 right-0 z-50">
          <MaxWidth>
            <div className="flex justify-center">
              <button
                className="touch-manipulation mx-auto block w-[92%]"
                onClick={handleCtaClick}
                onTouchStart={handleCtaTouchStart}
                onTouchEnd={handleCtaTouchEnd}
              >
                <div className="relative animate-button-bounce-no-shadow">
                  <img
                    className="block w-full"
                    src="/deaeru-lp99a-cta-button.png"
                    alt="エージェント診断START"
                  />
                </div>
              </button>
            </div>
          </MaxWidth>
        </div>
      )}


      {/* FV下のSlice画像エリア */}
      <MaxWidth>
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice1.png"
          alt=""
        />
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice2.png"
          alt=""
        />
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice3.png"
          alt=""
        />
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice4.png"
          alt=""
        />
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice5.png"
          alt=""
        />
        <img
          className="block w-full"
          src="/deaeru-lp02a-slice6.png"
          alt=""
        />
        {/* Slice7 + 運営会社リンク */}
        <div className="relative">
          <img
            className="block w-full"
            src="/deaeru-lp02a-slice7.png"
            alt=""
          />
          <Link
            href="https://foresma.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[6%] left-4 text-sm font-bold text-[#333] hover:opacity-70 transition-opacity"
          >
            運営会社
          </Link>
        </div>
      </MaxWidth>
    </div>
  );
}
