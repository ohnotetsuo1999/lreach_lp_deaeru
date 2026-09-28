"use client";

/*
 * lp93b（緒方ASP・lp93a のパープル版）訴求画面。
 * 2026-09-10 に lp93a（緑）を元に作成。先方支給の完成ZIP（lp93b/index.html・2026-09-08版）に合わせて:
 *   - FV / スライス2・3・4・7 をパープル配色の画像に差し替え（public/deaeru-lp93b-*.png。lp93a の画像は無変更）
 *   - スライス6 は無くなり、代わりに「カンタン３STEP / カウンセリングの流れ」セクション（見出し＋STEP画像）を追加
 *   - CTA（FV内 / 追従 / 末尾ドック）と「今週◯人が診断」バッジ、動きは lp93a と同じ
 * タグ: GTM ＋ 自社 Meta Pixel 578175028373311（ここ）＋ X（rcrwm / re139 / rexm3・共通部品 OgataXPixelScript は Page.tsx 側）。
 *       lp93a にある TikTok Pixel と GA4 は持ち込まない（2026-09-10 ユーザー判断。先方指示に無いため）。
 */

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp93b";
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
  onCtaClick: () => void;
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

export function Intro({ onCtaClick }: Props) {
  const [showFixedButton, setShowFixedButton] = useState(false);
  // 最終スライス(FAQ)とフッターの間に来たら、追従CTAを画面下固定から解除しその位置に留める（ドック）
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
    return () => observer.unobserve(target);
  }, []);

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
    return () => observer.unobserve(target);
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
    onCtaClick();
  };

  const diagnosisBadge =
    dailyCount !== null ? (
      <div className="absolute -top-[48%] left-1/2 -translate-x-1/2 z-10">
        <div className="relative bg-white border-2 border-[#E8641A] rounded-full px-4 py-1 whitespace-nowrap shadow-sm">
          <span className="text-[#E8641A] font-bold text-sm tracking-wide">
            ＼ 今週 <span className="text-[#E8641A] font-black text-base">{dailyCount}</span>人が診断！ ／
          </span>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#E8641A]" />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
        </div>
      </div>
    ) : null;

  // 追従／ドック共通のCTAボタン（診断バッジ付き）
  const floatingCtaButton = (
    <div className="flex justify-center">
      <button
        className="touch-manipulation mx-auto block w-[92%]"
        onClick={onCtaClick}
        onTouchStart={handleCtaTouchStart}
        onTouchEnd={handleCtaTouchEnd}
      >
        <div className="relative animate-button-bounce-no-shadow">
          {diagnosisBadge}
          <img
            className="block w-full"
            src="/deaeru-lp93b-floating-cta-button.png"
            alt="今すぐ面談を予約する"
          />
        </div>
      </button>
    </div>
  );

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
      {/* Meta Pixel - 自社(foresm)向け。緒方の Meta Pixel は設置しない（lp93a と同じ） */}
      <Script id="deaeru-meta-pixel-foresm" strategy="afterInteractive">{`
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
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
      {/* X (Twitter) タグは Page.tsx のトップレベル（Intro / フォーム共通）で設置。
          Intro 内に置くとフォーム表示時にアンマウントされ、base 未実行時の保留クリックイベントを消費できないため */}

      <style jsx global>{`
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

      {/* FV: 画像ベース（パープル版） */}
      <MaxWidth>
        <div className="relative">
          <img
            className="block w-full"
            src="/deaeru-lp93b-fv.png"
            alt="転職こそ、タイパの時代。非公開求人でパープル企業への転職"
          />
          <button
            ref={buttonRef}
            className="touch-manipulation absolute bottom-[7%] left-0 right-0 mx-auto block w-[82%]"
            onClick={onCtaClick}
            onTouchStart={handleCtaTouchStart}
            onTouchEnd={handleCtaTouchEnd}
          >
            <div className="relative animate-button-bounce-no-shadow">
              {diagnosisBadge}
              <img
                className="block w-full"
                src="/deaeru-lp93b-cta-button.png"
                alt="今すぐ面談を予約する"
              />
            </div>
          </button>
        </div>
      </MaxWidth>

      {/* 追従CTAボタン（ドック前のみ画面下に固定） */}
      {showFixedButton && !isDocked && (
        <div className="fixed bottom-[8%] left-0 right-0 z-50">
          <MaxWidth>{floatingCtaButton}</MaxWidth>
        </div>
      )}

      {/* FV下のスライス画像（パープル版・貼り付け順）。lp93a のスライス6 は無く、3STEP セクションに置き換わる */}
      <MaxWidth>
        <img className="block w-full" src="/deaeru-lp93b-slice2.png" alt="" loading="lazy" />
        <img className="block w-full" src="/deaeru-lp93b-slice3.png" alt="" loading="lazy" />
        <img className="block w-full" src="/deaeru-lp93b-slice4.png" alt="" loading="lazy" />

        {/* カンタン３STEP（先方 index.html の .steps93 セクション移植） */}
        <section className="bg-[#edfff5]">
          <header className="px-3 pb-5 pt-6 text-center text-[#17202c]">
            <h2 className="m-0 text-[clamp(26px,7vw,36px)] font-extrabold text-[#7300ce]">
              カンタン３STEP
            </h2>
            <p className="mb-6 mt-3 text-[clamp(17px,4.5vw,23px)] font-bold">
              カウンセリングの流れ
            </p>
            <span className="mx-auto block h-1 w-[16%] rounded-[9px] bg-[#7300ce]" />
          </header>
          <img
            className="block w-full"
            src="/deaeru-lp93b-steps.png"
            alt="基本情報を入力、LINEのお友だち登録、15分の面談を予約"
            loading="lazy"
          />
        </section>

        {/* 最終スライス（FAQ + フッター）+ 運営会社リンク */}
        <div className="relative">
          <img className="block w-full" src="/deaeru-lp93b-slice7.png" alt="よくある質問とご案内" loading="lazy" />
          {/* ドック位置センチネル: 最終質問とフッターの間の余白帯（lp93a と同じ 83%） */}
          <div
            ref={dockRef}
            className="pointer-events-none absolute left-0 right-0 top-[83%] h-px"
          />
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
