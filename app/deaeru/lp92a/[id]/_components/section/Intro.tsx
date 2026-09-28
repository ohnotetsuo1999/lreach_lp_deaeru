"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp92a";
const REFERRER_STORAGE_KEY = "deaeru_lp_referrer_url";
const GTM_ID = "GTM-W7S9ZNV8";

/* FV画像（1500x2500）を実績バッジ下端（y=2000, 80%）で上下に分割し、
   間に提携エージェントのロゴ帯を挟む。数値は元画像のピクセル実測値。
   - 上部クロップ: 下 20%（= 幅の33.33%）を負マージンで隠す
   - 下部クロップ: 上 80%（= 幅の133.33%）を負マージンで隠す
   - #03BF52 は y=2000 付近の緑ベタの実測色（ぼかしグラデーション用） */
const FV_IMAGE_SRC = "/deaeru-lp99b-intro.png";
const FV_GREEN = "#03BF52";

interface AgentLogo {
  src: string;
  alt: string;
}

/* 提携エージェント全11社。上段6社/下段5社に分割して流す。
   逆方向マーキーで両段に同じ社を入れると、すれ違いで同一社が
   上下同時に見える瞬間を無くせないため、各社をどちらか一方の段のみに置く。
   各ロゴは均一枠（w-24 h-12）に object-contain で収め、
   1段あたり常時3社程度が見えるサイズ感に揃える */
const AGENT_LOGOS: AgentLogo[] = [
  { src: "/deaeru-lp92zz-logo-ibt.png", alt: "INBOUND TECHNOLOGY" },
  { src: "/deaeru-lp92zz-logo-engine.png", alt: "ENGINE" },
  { src: "/deaeru-lp92zz-logo-tobidai.png", alt: "トビダイ" },
  { src: "/deaeru-lp92zz-logo-mine.png", alt: "Mineエージェント" },
  { src: "/deaeru-lp92zz-logo-divers.png", alt: "DIVERS" },
  { src: "/deaeru-lp92zz-logo-unipo.png", alt: "UNIPO" },
  { src: "/deaeru-lp92zz-logo-novalis.png", alt: "NOVALIS" },
  { src: "/deaeru-lp92zz-logo-newgate.png", alt: "new gate" },
  { src: "/deaeru-lp92zz-logo-ruh.png", alt: "RUH" },
  { src: "/deaeru-lp92zz-logo-inosell.png", alt: "INOSELL" },
  { src: "/deaeru-lp92zz-logo-wc.png", alt: "提携エージェント" },
];

const AGENT_LOGOS_ROW_TOP: AgentLogo[] = AGENT_LOGOS.slice(0, 6);
const AGENT_LOGOS_ROW_BOTTOM: AgentLogo[] = AGENT_LOGOS.slice(6);

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



  /* フローティングCTAの表示判定（2026-09-15 改修・lp92zz/lp92a 共通）
     従来は IntersectionObserver（threshold 0）のみで、FV 内CTAが1pxでもレイアウトビューポートに入れば
     フローティングを消していたが、企業ロゴ帯で FV 内CTAが初期画面の下端付近に来る本LPでは、
     アプリ内ブラウザ（LINE 等）のツールバーに隠れた領域を「見えている」と誤判定し、
     FV 内CTAとフローティングが同時に見える状態が実機で確認された。
     → 表示判定を「visualViewport（実際に見えている領域）に FV 内CTAの 1/3 以上が入っているか」に変更し、
       IntersectionObserver に加えて scroll / resize / visualViewport の変化・画像ロード後にも再評価する。
       画面サイズ・ブラウザ種別に依存せず「どちらか一方だけ表示」になる。 */
  useEffect(() => {
    const target = buttonRef.current;
    if (!target) return undefined;

    const evaluate = () => {
      const rect = target.getBoundingClientRect();
      const vv = window.visualViewport;
      const viewTop = vv ? vv.offsetTop : 0;
      const viewBottom = viewTop + (vv ? vv.height : window.innerHeight);
      const visibleHeight = Math.min(rect.bottom, viewBottom) - Math.max(rect.top, viewTop);
      const visibleRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
      setShowFixedButton(visibleRatio < 1 / 3);
    };

    const observer = new IntersectionObserver(evaluate, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    observer.observe(target);

    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", evaluate);
    vv?.addEventListener("resize", evaluate);
    // FV 画像のロードで CTA の位置が動くため、ロード後にも再評価する
    const fvImages = Array.from(document.images);
    fvImages.forEach((img) => img.addEventListener("load", evaluate));
    evaluate();

    return () => {
      observer.unobserve(target);
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
      vv?.removeEventListener("scroll", evaluate);
      vv?.removeEventListener("resize", evaluate);
      fvImages.forEach((img) => img.removeEventListener("load", evaluate));
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
      {/* Meta Pixel - 自社（578175028373311）。A8（LINE追加成果・サーバー側キックバック）のためページ内 ASP タグ不要
          2026-09-15 に lp92zz（インハウス・就業制限/既往歴設問・企業ロゴ帯）から複製 */}
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

      {/* styled-jsx（<style jsx global>）はこのアプリでは適用されない（レジストリ未設定のため
          SSR・クライアントとも注入されず、アニメーションが動かない）。
          styled-jsxの変換対象にならない dangerouslySetInnerHTML で素の<style>を確実に出力する */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes lp92a-button-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
.animate-button-bounce-no-shadow {
  animation: lp92a-button-bounce 1.5s infinite;
}
@keyframes lp92a-marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes lp92a-marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
/* 1周の距離＝上段6社=約624px/下段5社=約520px（ロゴ80px＋間隔24px）。
   下段520pxはコンテナ最大幅512px（max-w-lg）以上なのでループの継ぎ目は見えない */
.animate-lp92a-marquee-left {
  animation: lp92a-marquee-left 20s linear infinite;
}
.animate-lp92a-marquee-right {
  animation: lp92a-marquee-right 24s linear infinite;
}
`,
        }}
      />

      {/* FV: 画像ベース。実績バッジ下で上下に分割し、企業ロゴ帯を挿入 */}
      <MaxWidth>
        {/* FV上部: 元画像の上80%（ヘッダー〜実績バッジ） */}
        <div className="overflow-hidden">
          <img
            className="block w-full"
            style={{ marginBottom: "-33.34%" }}
            src={FV_IMAGE_SRC}
            alt="出会えるエージェント - 転職こそ、タイパの時代。"
          />
        </div>

        {/* 企業ロゴ帯（2段マーキー・上段左流れ/下段右流れ・手動スクロール不可）
            緑と白の境目はぼかしグラデーション */}
        {/* ファーストビュー内にCTAまで収めるため、帯の上下余白・段間は最小限にする */}
        <div
          className="pt-3 pb-3"
          style={{
            background: `linear-gradient(to bottom, ${FV_GREEN} 0px, #ffffff 16px, #ffffff calc(100% - 16px), ${FV_GREEN} 100%)`,
          }}
        >
          <p className="text-center text-[12px] font-bold tracking-wide text-gray-500">
            ご紹介する提携エージェント
            <span className="text-[10px]">（一部）</span>
          </p>
          <div
            className="mt-2 flex flex-col gap-y-2 pointer-events-none select-none"
            aria-hidden="true"
          >
            <div className="overflow-hidden">
              <div className="flex w-max animate-lp92a-marquee-left">
                {[0, 1].map((setIndex) => (
                  <div
                    key={`logo-top-${setIndex}`}
                    className="flex items-center gap-x-6 pr-6"
                  >
                    {AGENT_LOGOS_ROW_TOP.map((logo) => (
                      <img
                        key={`${setIndex}-${logo.src}`}
                        className="block h-9 w-20 object-contain"
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="flex w-max animate-lp92a-marquee-right">
                {[0, 1].map((setIndex) => (
                  <div
                    key={`logo-bottom-${setIndex}`}
                    className="flex items-center gap-x-6 pr-6"
                  >
                    {AGENT_LOGOS_ROW_BOTTOM.map((logo) => (
                      <img
                        key={`${setIndex}-${logo.src}`}
                        className="block h-9 w-20 object-contain"
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FV下部: 元画像の下20%（緑ベタ + 利用料完全無料）。CTAを重ねる */}
        <div className="relative overflow-hidden">
          <img
            className="block w-full"
            style={{ marginTop: "-133.33%" }}
            src={FV_IMAGE_SRC}
            alt=""
          />
          <button
            ref={buttonRef}
            className="touch-manipulation absolute bottom-[32%] left-0 right-0 mx-auto block w-[82%]"
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

      {/* フローティングCTAボタン
          位置: 画面下 10% ＋ iPhone のホームバー領域（safe-area-inset-bottom）。
          従来の 8% はアプリ内ブラウザのツールバーに被って半透明に見えたため少し上げた（2026-09-15） */}
      {showFixedButton && (
        <div
          className="fixed left-0 right-0 z-50"
          style={{ bottom: "calc(10% + env(safe-area-inset-bottom, 0px))" }}
        >
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
