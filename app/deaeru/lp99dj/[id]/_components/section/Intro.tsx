"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp99dj";
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
    // Meta Lead（フォーム到達）- サイバーグリップ。TikTok と同じく「弊社経由の流入のみ」（ttclid / fbclid）。
    if (searchParams.get("ttclid") || searchParams.get("fbclid")) {
      const w = window as Window & {
        fbq?: (...args: unknown[]) => void;
        __cybergripMetaLeadPending?: boolean;
      };
      if (typeof w.fbq === "function") {
        w.fbq("trackSingle", "1929986731213993", "Lead");
      } else {
        // base スクリプト（afterInteractive）未実行なら保留し、base 実行時に送る
        w.__cybergripMetaLeadPending = true;
      }
    }
    // TikTok Lead（フォーム到達）- サイバーグリップ。先方依頼「弊社経由の流入のみ」に合わせ、
    // TikTok 広告の ttclid または Meta 広告の fbclid（lp99dj は Meta 用 LP）が URL にある場合だけ発火する
    if (searchParams.get("ttclid") || searchParams.get("fbclid")) {
      const w = window as Window & {
        ttq?: { instance?: (id: string) => { track: (event: string) => void } };
        __cybergripLeadPending?: boolean;
      };
      if (typeof w.ttq?.instance === "function") {
        w.ttq.instance("DA450T3C77U14HQM62NG").track("Lead");
      } else {
        // ページ表示直後の極端に速い押下で TikTok base スクリプト（afterInteractive）が
        // まだ実行されていない場合は保留し、base 実行時（下の <Script> 末尾）に送る
        w.__cybergripLeadPending = true;
      }
    }
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
        ASP: サイバーグリップ（新規ASP）向けLP。2026-09-03 に lp99dg（yaaha Google用・タグ中継状態）から複製。
        タグ構成（2026-09-08 先方支給タグ設置）: GTM＋自社Pixel 578175028373311
          ＋サイバーグリップ Meta Pixel（1639429097574124=base / 1929986731213993=イベント用）
          ＋サイバーグリップ TikTok Pixel（DA450T3C77U14HQM62NG。Meta 流入も TikTok に返す先方仕様）
        複製元にあった旧ASP固有の着地点タグ（ACS）は削除済み。
        発火設計（先方依頼「他社商流は除外」「弊社経由のみ」に対応。lp99di と同じ考え方）:
          - Meta base PageView / TikTok base / AddToWishlist（両方）: LP表示時に常時
          - Lead（両方）: CTA押下でフォームに切り替わった時。URL に fbclid（Meta広告）か ttclid（TikTok広告）がある流入のみ
          - CompleteRegistration（両方）: thanks ページ。同じく fbclid / ttclid（sid として引き継ぎ）がある流入のみ
        ※ 先方の Meta コードは base=1639… を init し、イベントは 1929… 宛て（init 記載なし）だったため 1929… の init を補完。
        追加（2026-09-09 先方依頼）: 1639429097574124 にも AddToWishlist / Lead / CR を送る。こちらは条件なし（常時）。
          - AddToWishlist: 本スクリプト内（LP表示時）
          - Lead: Page.tsx の「基本情報フォーム表示」useEffect から window.fbq を直接呼ぶ（base 未実行なら保留フラグで本スクリプト末尾が送る）
          - CR: thanks/page.tsx の useEffect から window.fbq を直接呼ぶ（同じく保留フラグあり）
          1929… 宛ての既存イベントと条件はそのまま残す。
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
      {/* Meta Pixel - 自社（578175028373311）＋サイバーグリップ（1639429097574124=base / 1929986731213993=イベント用）
          2026-09-08 先方支給タグ設置。3ピクセルを同一スクリプト内で init し、イベントはすべて trackSingle で
          該当ピクセルにだけ送る（自社 PageView が先方ピクセルへ、先方イベントが自社へ混ざらないようにする）。
          ※ 先方支給コードには 1929986731213993 の init が無かった（trackSingle 先だけ記載）ため補完している。
          AddToWishlist（通常LP到達）は LP 表示時に常時。Lead は CTA 押下時（handleCtaClick）、CR は thanks。
          1639429097574124 宛ての AddToWishlist / Lead / CR は 2026-09-09 先方依頼で追加（常時発火。Lead は Page.tsx、CR は thanks 側） */}
      <Script id="deaeru-meta-pixel" strategy="afterInteractive">{`
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
/* サイバーグリップ base（PageView 用）＋ AddToWishlist（2026-09-09 先方依頼で追加・常時） */
fbq('init', '1639429097574124');
fbq('trackSingle', '1639429097574124', 'PageView');
fbq('trackSingle', '1639429097574124', 'AddToWishlist');
/* サイバーグリップ イベント用（AddToWishlist / Lead / CR の送信先。init は補完） */
fbq('init', '1929986731213993');
fbq('trackSingle', '1929986731213993', 'AddToWishlist');
/* base 実行前に CTA が押された場合の保留 Lead を送る（handleCtaClick 参照） */
if (window.__cybergripMetaLeadPending) {
  fbq('trackSingle', '1929986731213993', 'Lead');
  window.__cybergripMetaLeadPending = false;
}
/* base 実行前にフォーム表示（Page.tsx の useEffect）まで進んだ場合の保留 Lead（1639…）を送る */
if (window.__cybergripMetaLeadPending1639) {
  fbq('trackSingle', '1639429097574124', 'Lead');
  window.__cybergripMetaLeadPending1639 = false;
}
      `}</Script>
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
          base（ttq.load + page）＋ AddToWishlist（通常LP到達）を LP 表示時に同一スクリプト内で発火。
          Lead はフォーム切替時（handleCtaClick）、CompleteRegistration は thanks で発火 */}
      <Script id="deaeru-tiktok-pixel-cybergrip" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('DA450T3C77U14HQM62NG');
  ttq.page();
  ttq.instance('DA450T3C77U14HQM62NG').track('AddToWishlist');
  /* base 実行前に CTA が押された場合の保留 Lead を送る（handleCtaClick 参照） */
  if (w.__cybergripLeadPending) {
    ttq.instance('DA450T3C77U14HQM62NG').track('Lead');
    w.__cybergripLeadPending = false;
  }
}(window, document, 'ttq');
      `}</Script>

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
