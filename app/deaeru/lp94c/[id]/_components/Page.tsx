"use client";

/*
 * lp94c（緒方ASP・lp94b のパープル版）— 2026-09-10 作成
 * - 見た目・構成は先方支給の完成ZIP lp94c/index.html（2026-09-08版）を移植:
 *   hero → CTA → 「パープル企業とは？」 → 「ふつうは出回らないのですが・・・」＋非公開求人 → 選ばれる理由（求人カードカルーセル）
 *   → ご利用の流れ → CTA → FAQ → 末尾CTA → 運営会社フッター。追従CTA（follow94）あり
 * - フォーム: 共通部品 OgataEntryForm（先方 register.html 移植・テーマ紫）
 * - 配管: 共通フック useOgataLpPipeline（DB保存 / Slack「緒方」/ 行動集計 / thanks 遷移）
 * - タグ: GTM ＋ 自社 Meta Pixel 578175028373311 ＋ X（rcrwm / re139 / rexm3・共通部品）。
 *   lp94b にある先方ヒートマップ送信（track.js 移植）と CR 別 X 切り替えは持ち込まない（2026-09-10 ユーザー判断）
 */

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

import { LoadingModal } from "@/app/deaeru/form01a/_components/ui";
import { OgataEntryForm } from "@/app/deaeru/_shared/ogata/OgataEntryForm";
import { useOgataLpPipeline } from "@/app/deaeru/_shared/ogata/useOgataLpPipeline";
import {
  OgataXPixelScript,
  fireOgataXLineButtonClick,
} from "@/app/deaeru/_shared/ogata/ogataXTags";

const GTM_ID = "GTM-W7S9ZNV8";
const LP_CODE = "lp94c";

interface Props {
  id: string;
  uuid?: string;
}

/* 求人カードの自動横流しカルーセル（先方 page.js の実装を React 移植・lp94b と同じ） */
function JobCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let half = 0;
    let rafId = 0;
    const measure = () => {
      half = el.scrollWidth / 2;
    };
    measure();
    const measureTimer = setTimeout(measure, 800);

    const tick = () => {
      if (!pausedRef.current && half > 0) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      setTimeout(() => {
        if (half > 0) {
          el.scrollLeft = ((el.scrollLeft % half) + half) % half;
        }
        pausedRef.current = false;
      }, 1200);
    };
    const pauseEvents = ["touchstart", "pointerdown", "mousedown"] as const;
    const resumeEvents = ["touchend", "touchcancel", "pointerup", "mouseup", "mouseleave"] as const;
    pauseEvents.forEach((ev) => el.addEventListener(ev, pause, { passive: true }));
    resumeEvents.forEach((ev) => el.addEventListener(ev, resume, { passive: true }));

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(measureTimer);
      pauseEvents.forEach((ev) => el.removeEventListener(ev, pause));
      resumeEvents.forEach((ev) => el.removeEventListener(ev, resume));
    };
  }, []);

  const cards = [1, 2, 3, 1, 2, 3];
  return (
    <div className="job-carousel" ref={carouselRef} aria-label="求人カード">
      {cards.map((n, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${n}-${i}`}
          className="job-card"
          src={`/deaeru_lp94c_job_card${n}.webp`}
          alt={`求人カード${n}`}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

/**
 * 追従CTA（先方 follow94.js 移植）:
 * 最初のCTAを通り過ぎたら表示。どれかのCTAが画面内にある間と、末尾CTAが見えたら隠す。
 */
function useFollowCta(active: boolean) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const ctas = Array.from(document.querySelectorAll<HTMLElement>(".lp94c-scope .lp-cta"));
    if (!ctas.length) return;
    const inView = new Set<Element>();

    const render = () => {
      const passed = ctas[0].getBoundingClientRect().bottom < 0;
      const final = document.querySelector<HTMLElement>(".lp94c-scope .final94");
      const reachedEnd = !!final && final.getBoundingClientRect().top < window.innerHeight;
      setVisible(passed && inView.size === 0 && !reachedEnd);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target);
          else inView.delete(e.target);
        }
        render();
      },
      { threshold: 0 }
    );
    ctas.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("pageshow", render);
    render();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", render);
      window.removeEventListener("pageshow", render);
    };
  }, [active]);

  return visible;
}

export function Page({ id, uuid }: Props) {
  const {
    isIntroVisible,
    isSubmitting,
    showForm,
    showIntro,
    submit,
    setFormDataForBeacon,
    redirectUrl,
    linkRef,
  } = useOgataLpPipeline({ lpCode: LP_CODE, id, uuid });

  const isFollowVisible = useFollowCta(isIntroVisible);

  const ctaButton = (
    <div className="lp-cta">
      <button type="button" className="lp-cta-button lp-cta-img" onClick={showForm}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/deaeru_lp94b_cta_button.webp"
          alt="無料・15分のオンライン面談で ぴったりのエージェントを紹介してもらう"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </button>
    </div>
  );

  return (
    <div className="lp94c-scope">
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
      {/* Meta Pixel - 自社（578175028373311）。緒方の Meta Pixel は設置しない（lp94b と同じ） */}
      <Script id="deaeru-meta-pixel-foresm" strategy="afterInteractive">{`
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* X (Twitter) - 緒方ASP向け共通部品。base＋config（rcrwm / re139 / rexm3）＋本LP表示イベント。本番ドメイン限定 */}
      <OgataXPixelScript page="lp" />

      {isIntroVisible && (
        <>
          <main className="site-shell lp-shell">
            <h1 className="sr-only">あなたに合うパープル企業をご紹介</h1>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lp-image"
              src="/deaeru_lp94c_hero_fv.webp"
              alt="あなたに合うパープル企業を入力1分で紹介。20代限定、完全無料。"
            />

            {ctaButton}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lp-image"
              src="/deaeru_lp94c_purple_company.png"
              alt="パープル企業とは？"
              loading="lazy"
              decoding="async"
            />
            <p className="purple-intro-line">ふつうは出回らないのですが・・・</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lp-image"
              src="/deaeru_lp94c_nonpublic_jobs.png"
              alt="公開求人と非公開求人。出会えるエージェントの優良エージェントは多数保有"
              loading="lazy"
            />

            <section className="lp-image-stack" aria-label="出会えるエージェントが選ばれる理由">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lp-image"
                src="/deaeru_lp94c_job_heading.webp"
                alt="出会えるエージェントが選ばれる理由"
                loading="lazy"
                decoding="async"
              />
              <JobCarousel />
            </section>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="lp-image"
              src="/deaeru_lp94c_flow_steps.png"
              alt="ご利用の流れ"
              loading="lazy"
              decoding="async"
            />

            {ctaButton}

            <section className="lp-faq" aria-labelledby="faq-title">
              <h2 id="faq-title" className="sr-only">よくある質問</h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lp-image"
                src="/deaeru_lp94c_faq_heading.webp"
                alt="よくある質問"
                loading="lazy"
                decoding="async"
              />
              <div className="faq-list lp-faq-list">
                <details className="faq-card" open>
                  <summary>
                    <span className="qa-mark q-mark">Q</span>
                    <span>本当に無料で利用できますか？</span>
                  </summary>
                  <div className="faq-answer">
                    <span className="qa-mark a-mark">A</span>
                    <p>はい、完全無料です。エージェントへの相談、転職サポートまで一切費用はかかりません。</p>
                  </div>
                </details>
                <details className="faq-card">
                  <summary>
                    <span className="qa-mark q-mark">Q</span>
                    <span>普通の転職サイトと何が違うのですか？</span>
                  </summary>
                  <div className="faq-answer">
                    <span className="qa-mark a-mark">A</span>
                    <p>自分で探すのではなく、希望条件に合うエージェントとつながり、一般公開されていない非公開求人の提案を受けられます。</p>
                  </div>
                </details>
                <details className="faq-card">
                  <summary>
                    <span className="qa-mark q-mark">Q</span>
                    <span>今すぐ転職する気がなくても大丈夫ですか？</span>
                  </summary>
                  <div className="faq-answer">
                    <span className="qa-mark a-mark">A</span>
                    <p>大丈夫です。まずは自分の市場価値や、今より良い条件の求人があるかを確認する目的でも利用できます。</p>
                  </div>
                </details>
                <details className="faq-card">
                  <summary>
                    <span className="qa-mark q-mark">Q</span>
                    <span>紹介されるエージェントはどう選ばれていますか？</span>
                  </summary>
                  <div className="faq-answer">
                    <span className="qa-mark a-mark">A</span>
                    <p>利用者の回答や希望条件をもとに、相性の良いエージェントを厳選して紹介します。</p>
                  </div>
                </details>
              </div>
            </section>

            {/* 末尾CTA（.final94）＋ 運営会社フッター（.company94） */}
            <div className="lp-cta final94">
              <button type="button" className="lp-cta-button lp-cta-img" onClick={showForm}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/deaeru_lp94b_cta_button.webp"
                  alt="無料・15分のオンライン面談で ぴったりのエージェントを紹介してもらう"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </button>
            </div>
            <footer className="company94">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="company94-logo" src="/deaeru-logo.png" alt="出会えるエージェント" />
              <p className="company94-tagline">出会える。いい人に、いい求人に。</p>
              <a href="https://foresma.jp/" target="_blank" rel="noopener noreferrer">
                運営会社
              </a>
              <small>© 2024 Meetable Agent. All Rights Reserved.</small>
            </footer>
          </main>

          {/* 追従CTA（follow94） */}
          <aside className="follow94" hidden={!isFollowVisible} aria-label="面談のお申し込み">
            <button type="button" onClick={showForm} aria-label="ぴったりのエージェントを紹介してもらう">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/deaeru_lp94b_cta_button.webp"
                alt="無料・15分のオンライン面談で ぴったりのエージェントを紹介してもらう"
              />
            </button>
          </aside>
        </>
      )}

      {!isIntroVisible && (
        <>
          <OgataEntryForm
            theme="purple"
            lpCode={LP_CODE}
            isSubmitting={isSubmitting}
            onFormDataChange={setFormDataForBeacon}
            onSubmit={submit}
            onLineButtonClick={fireOgataXLineButtonClick}
            onBrandClick={showIntro}
          />
          {/* thanks への遷移用（送信成功後に programmatically click） */}
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <a ref={linkRef} href={redirectUrl} hidden aria-hidden="true" />
          <LoadingModal isLoading={isSubmitting} />
        </>
      )}
    </div>
  );
}
