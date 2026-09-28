"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp99g";
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
              <img
                className="block w-full"
                src="/deaeru-lp99d-cta-button.png"
                alt="今すぐ相談する"
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
                    src="/deaeru-lp99d-cta-button.png"
                    alt="今すぐ相談する"
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
