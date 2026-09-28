"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp99s";
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
  id: string;
  updateIsCta1Submitted: (isCta1Submitted: boolean) => void;
  updateIsIntroVisible: (isIntroVisible: boolean) => void;
}

const DAILY_DIAGNOSIS_COUNTS: Record<number, number> = {
  1: 114,
  2: 131,
  3: 152,
  4: 173,
  5: 187,
  6: 209,
  0: 225,
};

function getDailyDiagnosisCount(): number {
  const day = new Date().getDay();
  return DAILY_DIAGNOSIS_COUNTS[day] ?? 152;
}

export function Intro({ id, updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    setDailyCount(getDailyDiagnosisCount());
  }, []);

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
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      {/*
        Meta Pixel 統合スクリプト
        - 578175028373311: メインPixel（PageView）
        - 962935206619250: Sparkle Ark（広告主・レントラックスASP経由）— PageView/ViewContent/AddToCart は trackSingle で発火
        - 1002095592354055: メディア不明（2026-05-29 タグ設置依頼）— 誤発火防止のため trackSingle で PageView 発火
        - 1039600745502589: 出会えるエージェント_68733_AD（メディア・レントラックスASP経由・2026-09-03 タグ設置依頼）
          — **lp99s/004 のみ**（ID限定発火）。依頼どおり PageView のみを trackSingle で発火
        ※ <Script strategy="afterInteractive"> を複数に分けると実行順序が保証されず init が失敗するため、
          必ず1つの<Script>内で連続initすること。
      */}
      <Script id="deaeru-meta-pixel" strategy="afterInteractive">{`
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
fbq('init', '962935206619250');
fbq('trackSingle', '962935206619250', 'PageView');
fbq('trackSingle', '962935206619250', 'ViewContent');
fbq('trackSingle', '962935206619250', 'AddToCart');
fbq('init', '1002095592354055');
fbq('trackSingle', '1002095592354055', 'PageView');
${
  id === "004"
    ? `/* Meta Pixel - 出会えるエージェント_68733_AD（レントラックス経由）/ lp99s/004 のみ */
fbq('init', '1039600745502589');
fbq('trackSingle', '1039600745502589', 'PageView');`
    : ""
}
      `}</Script>
      {/* TikTok Pixel - メディア不明（2026-05-29 タグ設置依頼） */}
      <Script id="deaeru-tiktok-pixel-unknown" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D89T8ABC77UE9S4B1V90');
  ttq.page();
}(window, document, 'ttq');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
        {/* Meta Pixel noscript: メインPixel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
          alt=""
        />
        {/* Meta Pixel noscript: Sparkle Ark（広告主・レントラックスASP経由）向け */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=962935206619250&ev=PageView&noscript=1"
          alt=""
        />
        {/* Meta Pixel noscript: メディア不明（2026-05-29 タグ設置依頼）向け */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1002095592354055&ev=PageView&noscript=1"
          alt=""
        />
        {id === "004" && (
          <>
            {/* Meta Pixel noscript: 出会えるエージェント_68733_AD（レントラックス経由）/ lp99s/004 のみ */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1039600745502589&ev=PageView&noscript=1"
              alt=""
            />
          </>
        )}
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
            src="/deaeru-lp99b-intro.png"
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
              {dailyCount !== null && (
                <div className="absolute -top-[48%] left-1/2 -translate-x-1/2 z-10">
                  <div className="relative bg-white border-2 border-[#E8641A] rounded-full px-4 py-1 whitespace-nowrap shadow-sm">
                    <span className="text-[#E8641A] font-bold text-sm tracking-wide">
                      ＼ 今週 <span className="text-[#E8641A] font-black text-base">{dailyCount}</span>人が診断！ ／
                    </span>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#E8641A]" />
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                  </div>
                </div>
              )}
              <img
                className="block w-full"
                src="/deaeru-lp99b-cta-button.png"
                alt="今すぐ面談を予約する"
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
                  {dailyCount !== null && (
                    <div className="absolute -top-[48%] left-1/2 -translate-x-1/2 z-10">
                      <div className="relative bg-white border-2 border-[#E8641A] rounded-full px-4 py-1 whitespace-nowrap shadow-sm">
                        <span className="text-[#E8641A] font-bold text-sm tracking-wide">
                          ＼ 今週 <span className="text-[#E8641A] font-black text-base">{dailyCount}</span>人が診断！ ／
                        </span>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#E8641A]" />
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                      </div>
                    </div>
                  )}
                  <img
                    className="block w-full"
                    src="/deaeru-lp99b-floating-cta-button.png"
                    alt="今すぐ面談を予約する"
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
