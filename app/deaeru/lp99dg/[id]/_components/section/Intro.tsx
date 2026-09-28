"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp99dg";
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

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const [showFixedButton, setShowFixedButton] = useState(false);
  // 最終スライス(FAQ)とフッター(出会えるエージェント)の間に来たら、
  // フローティングCTAを画面下固定から解除し、その位置に留める（ドック）。
  const [isDocked, setIsDocked] = useState(false);
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
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

  /* ドック判定: dockRef(最終質問とフッターの間の位置)が
     フローティングボタンの高さぶん画面下から手前に到達したら留める。 */
  useEffect(() => {
    const target = dockRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDocked(entry.isIntersecting);
      },
      { root: null, rootMargin: "0px 0px -14% 0px", threshold: 0 }
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

  // フローティング／ドック共通のCTAボタン（診断バッジ付き）。
  const floatingCtaButton = (
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
  );

  return (
    <div className="min-h-screen bg-white text-[#333] overflow-x-hidden">
      {/*
        ASP: yaaha（新規・Google用）向けLP。2026-08-28 に lp99cr（タグ中継状態）から複製。
        yaahaの正式タグ未受領のため、GTM と自社Pixel 578175028373311 のみ残す中継状態。
        複製元にあった旧ASP固有の着地点タグ（ACS）は削除済み。
        yaahaのタグ受領後に本ブロックへ追加すること。
      */}
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
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
      {/* Meta Pixel - 自社（578175028373311）※yaahaタグ未受領期間の中継用 */}
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
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
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

      {/* FV: 画像ベース（LP01hパターン） */}
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

      {/* フローティングCTAボタン（ドック前のみ画面下に固定） */}
      {showFixedButton && !isDocked && (
        <div className="fixed bottom-[8%] left-0 right-0 z-50">
          <MaxWidth>{floatingCtaButton}</MaxWidth>
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
          {/* ドック位置センチネル: 最終質問(約78%)とフッター(約87%)の間の余白帯の中央 */}
          <div
            ref={dockRef}
            className="pointer-events-none absolute left-0 right-0 top-[83%] h-px"
          />
          {/* ドック時はここにCTAボタンが留まる（画面下固定を解除して着地） */}
          {isDocked && (
            <div className="absolute left-0 right-0 top-[83%] z-40 -translate-y-1/2">
              {floatingCtaButton}
            </div>
          )}
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
