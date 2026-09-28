"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp94a";
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
}

export function Intro({ updateIsCta1Submitted }: Props) {
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
    // 画面遷移ではなく、同一ページ内の下のフォーム入力欄へスクロールする
    const formEl = document.getElementById("lp94a-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
    <div className="bg-[#effcf5] text-[#333] overflow-x-hidden">
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
      <Script id="deaeru-meta-pixel-ogata-banner" strategy="afterInteractive">{`
/* Meta Pixel - 緒方ASP / バナー広告向け（Pixel: 1333575804939284）*/
/* 各ブロックが自前ローダー(!function)を持つ＝Script実行順に依存せず確実に fbq を初期化（if(f.fbq)returnで冪等・複数あっても安全）*/
/* 自社Pixelと混ざらないよう trackSingle で当該Pixelに明示送信する */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1333575804939284');
fbq('trackSingle', '1333575804939284', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1333575804939284&ev=PageView&noscript=1"
        />
      </noscript>
      <Script id="deaeru-meta-pixel-ogata-new" strategy="afterInteractive">{`
/* Meta Pixel - 緒方ASP / 新広告アカウント（Pixel: 1061213309566860）2026-07-03 追加 */
/* 旧緒方Pixel(1333575804939284)と並行運用。自前ローダーで順序非依存・trackSingleで自Pixelのみに明示送信 */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1061213309566860');
fbq('trackSingle', '1061213309566860', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1061213309566860&ev=PageView&noscript=1"
        />
      </noscript>
      {/* X (Twitter) コンバージョン計測 ベースコード - 緒方ASP向け */}
      <Script id="deaeru-x-pixel-ogata" strategy="afterInteractive">{`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','rcrwm');
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

      {/* ===== tunaguba 記事デザイン（画像ベース） ===== */}
      <MaxWidth className="bg-white">
        {/* topbar */}
        <div className="sticky top-0 z-20 flex min-h-[54px] items-center justify-between border-b border-[#d8e8df] bg-white/95 px-[18px] py-[10px] backdrop-blur">
          <div className="flex items-center gap-2 text-base font-black">
            <span className="relative inline-block size-6 rounded-full bg-gradient-to-br from-[#00c45d] to-[#8dde13]" />
            出会えるエージェント
          </div>
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex min-h-[34px] min-w-[112px] items-center justify-center rounded-full bg-[#05c65d] px-[13px] py-[7px] text-[13px] font-black text-white shadow-[0_8px_18px_rgba(5,198,93,.25)]"
          >
            LINE登録
          </button>
        </div>

        {/* hero（FV）— ファーストビューのため即時読み込み（lazyにしない） */}
        <img
          className="block w-full"
          src="/deaeru_lp94a_hero.webp"
          alt="20代向け 非公開ホワイト求人に強い 転職エージェントを厳選紹介 完全無料・登録1分"
          fetchPriority="high"
          decoding="async"
        />

        {/* 非公開ホワイト求人とは */}
        <section className="px-5 py-5">
          <img
            className="block w-full rounded-[18px] shadow-[0_16px_36px_rgba(0,93,51,.14)]"
            src="/deaeru_lp94a_white_job.webp"
            alt="非公開ホワイト求人とは 優良エージェントのみが保有している市場に出回らない求人"
            loading="lazy"
            decoding="async"
          />
        </section>

        {/* 求人例（横スライド） */}
        <section className="px-5 py-5">
          <img
            className="mb-[18px] block w-full rounded-[12px]"
            src="/deaeru_lp94a_job_heading.webp"
            alt="こんな案件があります"
            loading="lazy"
            decoding="async"
          />
          <div className="-mx-5 flex snap-x snap-mandatory gap-[14px] overflow-x-auto px-5 pb-[10px] pt-1">
            <img
              className="block w-[82%] shrink-0 snap-start rounded-[18px] border border-[#d8e8df] shadow-[0_16px_36px_rgba(0,93,51,.14)]"
              src="/deaeru_lp94a_job_card1.webp"
              alt="求人A 営業職 IT・SaaS 年収450万〜600万 年間休日125日 土日祝休み 残業少なめ 有給取得しやすい"
              loading="lazy"
              decoding="async"
            />
            <img
              className="block w-[82%] shrink-0 snap-start rounded-[18px] border border-[#d8e8df] shadow-[0_16px_36px_rgba(0,93,51,.14)]"
              src="/deaeru_lp94a_job_card2.webp"
              alt="求人B 事務職 未経験OK 年収380万〜500万 年間休日120日以上 土日祝休み 残業少なめ 研修あり 資格取得支援あり"
              loading="lazy"
              decoding="async"
            />
            <img
              className="block w-[82%] shrink-0 snap-start rounded-[18px] border border-[#d8e8df] shadow-[0_16px_36px_rgba(0,93,51,.14)]"
              src="/deaeru_lp94a_job_card3.webp"
              alt="求人C カスタマーサポート 未経験OK 年収360万〜480万 完全週休2日制 残業少なめ 研修制度あり 賞与年2回 服装自由"
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* よくある質問 */}
        <section className="px-5 py-5">
          <img
            className="mb-[18px] block w-full rounded-[12px]"
            src="/deaeru_lp94a_faq_heading.webp"
            alt="よくある質問"
            loading="lazy"
            decoding="async"
          />
          <div className="grid gap-3">
            {[
              {
                q: "本当に無料で利用できますか？",
                a: "はい、完全無料です。エージェントへの相談、転職サポートまで一切費用はかかりません。",
              },
              {
                q: "普通の転職サイトと何が違うのですか？",
                a: "自分で探すのではなく、希望条件に合うエージェントとつながり、一般公開されていない非公開ホワイト求人の提案を受けられます。",
              },
              {
                q: "今すぐ転職する気がなくても大丈夫ですか？",
                a: "大丈夫です。まずは自分の市場価値や、今より良い条件の求人があるかを確認する目的でも利用できます。",
              },
              {
                q: "紹介されるエージェントはどう選ばれていますか？",
                a: "利用者の回答や希望条件をもとに、相性の良いエージェントを厳選して紹介します。",
              },
            ].map((item) => (
              <article
                key={item.q}
                className="rounded-[16px] border border-[#d8e8df] bg-white px-4 pb-[18px] pt-4 shadow-[0_10px_24px_rgba(0,93,51,.08)]"
              >
                <h3 className="flex items-start gap-2 text-base font-bold leading-[1.45] text-[#172033]">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#05c65d] text-sm font-black text-white">
                    Q
                  </span>
                  {item.q}
                </h3>
                <p className="mt-3 flex items-start gap-2 text-sm font-semibold leading-[1.7] text-[#2d3b37]">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#d9f7e7] text-xs font-black text-[#007a44]">
                    A
                  </span>
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 転職3ステップ */}
        <section className="px-5 py-5">
          <img
            className="block w-full rounded-[18px] shadow-[0_16px_36px_rgba(0,93,51,.14)]"
            src="/deaeru_lp94a_flow_steps.webp"
            alt="出会えるエージェントでの転職3ステップ LINE登録 希望条件を1分で入力 厳選されたエージェント3社とつながる 非公開ホワイト求人を紹介してもらう"
            loading="lazy"
            decoding="async"
          />
        </section>

        {/* CTAパネル */}
        <section className="px-4 pb-7 pt-5 text-center">
          <img
            className="block w-full overflow-hidden rounded-[20px] shadow-[0_16px_34px_rgba(0,91,55,.16)]"
            src="/deaeru_lp94a_cta_top.webp"
            alt="非公開ホワイト求人を持つ 厳選エージェント3社とつながる 費用は一切かかりません 完全無料で利用できます"
            loading="lazy"
            decoding="async"
          />
          <div className="mx-auto mt-6 text-[20px] font-bold leading-[1.35] text-[#007a44]">
            入力1分で登録
          </div>
          <img
            className="mx-auto mb-3 mt-1 block h-auto w-[min(124px,32vw)]"
            src="/deaeru_lp94a_cta_arrow.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          {/* この下に Page.tsx のフォームが直接続く（CTAボタンは置かない） */}
        </section>
      </MaxWidth>
    </div>
  );
}
