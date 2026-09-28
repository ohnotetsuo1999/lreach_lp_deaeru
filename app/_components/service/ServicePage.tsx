"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ConditionPopupForm } from "@/app/deaeru/_shared/ConditionPopupForm";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ServiceCarousel";
import {
  SERVICE_PAGE_CTA_URL,
  buildServiceCanonicalLpUrl,
  buildServiceLpKey,
  type ServiceInflow,
} from "./service-inflow";
import { concerns, flowSteps, reviewStories, reviews, serviceReasons } from "./site-content";

import "./service.css";

/**
 * 出会えるエージェント サービスページ（deaeru-agent.jp/ および /<媒体>-<番号>/）。
 *
 * 2026-09-16 納品物（deaeru-agent-handoff/source）の app/page.tsx と components/* を Next.js 用に移植。
 * 納品からの変更点:
 *  - CTA（ヘッダー / FV / 最下部の 3 つ）: 外部 URL への <a> → lp08 系と同じ条件ポップアップ（年齢・転職回数・希望勤務地）を開き、
 *    回答後に LINE（LIFF）へ遷移する。lpUrl は service-inflow.ts の正規化 URL を渡す
 *  - 計測: GTM（W7S9ZNV8・現行トップと同じ）＋ LP 行動集計ビーコン（lp_key = deaeru-<媒体>-<番号>）
 *  - 画像・動画のパスは /service/images/ , /service/media/ に変更（既存の /media ルートとの衝突回避）
 *  - カルーセルは ServiceCarousel.tsx（embla 直接利用）に置換
 * 文言・構成・CSS クラスは納品どおり。マガジン（/media）への導線は納品どおり無し（必要になれば追加）。
 */

const GTM_ID = "GTM-W7S9ZNV8";

interface Props {
  inflow: ServiceInflow;
}

const flowIcons = [Clock3, MessageCircle, CalendarDays, Headphones, Users];

function BackgroundAtmosphere() {
  return (
    <div className="background-atmosphere" aria-hidden="true">
      <span className="atmosphere-ribbon atmosphere-ribbon-one" />
      <span className="atmosphere-ribbon atmosphere-ribbon-two" />
      <span className="atmosphere-fold" />
      <span className="atmosphere-hatching" />
    </div>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className={`brand ${inverse ? "brand-inverse" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand-image"
        src="/service/images/deaeru-agent-logo.png"
        alt="出会えるエージェント"
        width={1600}
        height={292}
      />
    </span>
  );
}

function ServiceVideo() {
  return (
    <div className="video-frame">
      <video controls playsInline preload="metadata" aria-label="出会えるエージェントのサービス紹介動画">
        <source src="/service/media/service-introduction.mp4" type="video/mp4" />
        お使いのブラウザでは動画を再生できません。
      </video>
    </div>
  );
}

function ServicePoints() {
  return (
    <Carousel
      className="service-points"
      opts={{ align: "start", breakpoints: { "(max-width: 680px)": { active: false } } }}
      aria-label="サービスの3つのポイント"
    >
      <CarouselContent className="point-slides">
        {serviceReasons.map((reason, index) => (
          <CarouselItem key={reason.title} className="point-slide">
            <article className="reason-card">
              <div className="point-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/service/images/service-point-${index + 1}.webp`}
                  alt=""
                  width={750}
                  height={500}
                  loading="lazy"
                />
              </div>
              <span className="point-number">POINT 0{index + 1}</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="point-controls">
        <CarouselPrevious aria-label="前のポイント" />
        <CarouselNext aria-label="次のポイント" />
      </div>
    </Carousel>
  );
}

function ReviewList() {
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paused) return undefined;
    const timer = window.setTimeout(() => setPaused(false), 6000);
    return () => window.clearTimeout(timer);
  }, [paused]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    if (region.current) observer.observe(region.current);
    return () => {
      media.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!api || paused || hovered || focused || reduced || !visible) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) api.scrollNext();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [api, paused, hovered, focused, reduced, visible]);

  const move = (direction: number) => {
    setPaused(true);
    if (direction > 0) api?.scrollNext();
    else api?.scrollPrev();
  };

  return (
    <div ref={region} className="voice-stories">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, slidesToScroll: 1 }}
        aria-label="利用者アンケート10件"
      >
        <CarouselContent
          className="voice-story-track"
          onPointerDown={() => setPaused(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
          }}
        >
          {reviews.map((review, index) => {
            const story = reviewStories[index];
            return (
              <CarouselItem
                key={review.title}
                className="voice-story-slide"
                aria-label={`${index + 1} / ${reviews.length}`}
              >
                <article className="voice-story-card">
                  <div className="review-card-label">VOICE {String(index + 1).padStart(2, "0")}</div>
                  <h3>{review.title}</h3>
                  <div className="voice-story-art">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/service/images/review-character-${story.image}.webp`}
                      alt=""
                      width={750}
                      height={500}
                      loading="lazy"
                    />
                  </div>
                  <div className="voice-change" aria-label="相談内容と相談後の感想">
                    <div className="voice-before">
                      <span>相談前・相談したこと</span>
                      <p>{story.before}</p>
                    </div>
                    <ArrowRight aria-hidden="true" size={22} />
                    <div className="voice-after">
                      <span>相談してみて</span>
                      <p>{story.after}</p>
                    </div>
                  </div>
                  <blockquote className="voice-original">{review.body}</blockquote>
                  <footer>サービス利用者アンケートより</footer>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="voice-story-controls">
          <button type="button" onClick={() => move(-1)} aria-label="前の口コミ">
            <ArrowLeft size={20} />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="次の口コミ">
            <ArrowRight size={20} />
          </button>
        </div>
      </Carousel>
    </div>
  );
}

/** スクロール連動の段階表示・読了バー・FV パララックス（納品 page-motion.tsx そのまま） */
function PageMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".philosophy-copy, .section-heading, .concern-card, .concern-conclusion, .selection-visual, .reason-card, .compare-panel, .video-block, .review-card, .flow-list li, .final-content"
      )
    );
    let observer: IntersectionObserver | undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const heroHeight = document.querySelector(".hero")?.clientHeight || window.innerHeight;
      const progress = Math.min(window.scrollY / heroHeight, 1);
      root.style.setProperty("--hero-offset", reduced.matches ? "0px" : `${progress * 120}px`);
      root.style.setProperty(
        "--page-progress",
        `${window.scrollY / Math.max(1, root.scrollHeight - window.innerHeight)}`
      );
      root.classList.toggle("past-hero", window.scrollY > heroHeight - 100);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const setup = () => {
      observer?.disconnect();
      targets.forEach((element) => element.classList.remove("reveal-pending"));
      if (!reduced.matches && "IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.remove("reveal-pending");
                observer?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08 }
        );
        targets.forEach((element) => {
          element.classList.add("reveal-item");
          const siblings = Array.from(element.parentElement?.children || []);
          const isCard = element.matches(".concern-card, .reason-card, .review-card");
          element.style.setProperty("--reveal-delay", isCard ? `${siblings.indexOf(element) * 100}ms` : "0ms");
          if (element.getBoundingClientRect().top >= window.innerHeight) {
            element.classList.add("reveal-pending");
            observer?.observe(element);
          }
        });
      }
      update();
    };
    setup();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduced.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", setup);
      targets.forEach((element) => element.classList.remove("reveal-pending", "reveal-item"));
      root.classList.remove("past-hero");
      root.style.removeProperty("--hero-offset");
      root.style.removeProperty("--page-progress");
    };
  }, []);

  return <div className="reading-progress" aria-hidden="true" />;
}

export function ServicePage({ inflow }: Props) {
  const lpKey = buildServiceLpKey(inflow);
  const canonicalLpUrl = buildServiceCanonicalLpUrl(inflow);
  const { markCtaClicked } = useLpActionStatistics(lpKey);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = useCallback(() => setIsPopupOpen(true), []);

  // ポップアップ内の LINE CTA 押下時（LineDirectIntro.fireCtaTracking と同じ計測）
  const handleConfirm = useCallback(() => {
    markCtaClicked();
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "line_add_listmarke" });
  }, [markCtaClicked]);

  const CtaButton = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <button type="button" className={`cta-button ${className}`} onClick={openPopup}>
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </button>
  );

  return (
    <div className="service-site" data-lp-key={lpKey}>
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

      <main>
        <PageMotion />
        <header className="site-header">
          <a className="brand-link" href="#top" aria-label="出会えるエージェント トップへ">
            <Brand />
          </a>
          <div className="header-menu">
            <nav aria-label="ページ内メニュー">
              <a href="#service">サービスについて</a>
              <a href="#voice">利用者の声</a>
              <a href="#flow">利用の流れ</a>
            </nav>
            <CtaButton className="header-cta">無料で相談する</CtaButton>
          </div>
        </header>

        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/service/images/career-green-canopy-wide.webp" alt="" fetchPriority="high" />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-light hero-light-one" aria-hidden="true" />
          <div className="hero-light hero-light-two" aria-hidden="true" />
          <div className="hero-copy">
            <h1 id="hero-title">
              <span>
                相談して<br className="mobile-only" />よかったと
              </span>
              <span>
                心から思える<br className="mobile-only" />出会いを
              </span>
            </h1>
            <p className="hero-sub">
              <span className="copy-phrase">3万社以上の</span>
              <span className="copy-phrase">転職エージェント会社から、</span>
              <br />
              <span className="copy-phrase">あなたに合う3社を</span>
              <span className="copy-phrase">厳選してご紹介。</span>
            </p>
            <div className="hero-actions">
              <CtaButton>自分に合うエージェントに出会う</CtaButton>
            </div>
            <div className="trust-row" aria-label="サービスの特徴">
              <span>
                <Check size={15} aria-hidden="true" /> 完全無料
              </span>
              <span>
                <Check size={15} aria-hidden="true" /> 15分で相談
              </span>
            </div>
          </div>
          <a className="hero-scroll" href="#concerns">
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown size={20} aria-hidden="true" />
          </a>
        </section>

        <section className="concerns section-dark" id="concerns">
          <div className="concern-intro">
            <BackgroundAtmosphere />
            <div className="section-heading light-heading">
              <p className="eyebrow">YOUR CONCERNS</p>
              <h2 className="concern-heading">
                <span className="copy-phrase">転職でこんな悩みは</span>
                <span className="copy-phrase">ありませんか？</span>
              </h2>
            </div>
            <ul className="concern-grid">
              {concerns.map((concern, index) => (
                <li className="concern-card" key={concern}>
                  <span className="concern-number">0{index + 1}</span>
                  <p>{concern}</p>
                </li>
              ))}
            </ul>
            <p className="concern-reassurance">
              <span className="copy-phrase">その悩み、</span>
              <span className="copy-phrase">一人で抱えなくて大丈夫。</span>
            </p>
          </div>
          <div className="concern-answer" aria-labelledby="concern-answer-title">
            <div className="concern-answer-card">
              <h3 id="concern-answer-title">
                <span>
                  <span className="copy-phrase">自分に合うエージェントとの</span>
                  <span className="copy-phrase">出会いが、</span>
                </span>
                <span>
                  <em className="copy-phrase">納得できる転職</em>
                  <span className="copy-phrase">への第一歩。</span>
                </span>
              </h3>
              <div className="concern-answer-rule" aria-hidden="true" />
              <p>
                あなたの希望や不安を理解し、<wbr />一緒に可能性を探してくれる。
                <br className="desktop-only" />
                そんな<strong>転職のパートナー</strong>と出会うことで、<wbr />
                一人では見つけられなかった<strong>最高のキャリア</strong>が見つかります。
              </p>
            </div>
          </div>
        </section>

        <section className="service section-light" id="service">
          <BackgroundAtmosphere />
          <div className="section-heading">
            <p className="eyebrow">ABOUT THE SERVICE</p>
            <h2>
              <span className="copy-line">求人を探す前に、</span>
              <span className="copy-phrase">信頼できる</span>
              <span className="copy-phrase">エージェントと出会う。</span>
            </h2>
            <p>
              <strong className="service-emphasis">
                たまたま担当になった一人に、<br className="mobile-only" />転職の選択肢を委ねないために。
              </strong>
              私たちは希望を丁寧に伺い、異なる強みを持つ3社をご紹介します。
            </p>
          </div>

          <div className="selection-visual">
            <div className="selection-source">
              <span>紹介候補</span>
              <strong>
                30,000<span>社以上</span>
              </strong>
              <p>転職エージェント会社</p>
            </div>
            <div className="selection-path" aria-hidden="true">
              <ArrowRight size={28} />
            </div>
            <div className="selection-result">
              <span>あなたに合う</span>
              <strong>
                3<span>社</span>
              </strong>
              <p>を厳選してご紹介</p>
            </div>
          </div>

          <ServicePoints />

          <div className="agent-benefits" aria-labelledby="agent-benefits-title">
            <BackgroundAtmosphere />
            <h3 id="agent-benefits-title">
              <span className="copy-phrase">
                エージェントを<span className="benefits-count">3社以上</span>
              </span>
              <span className="copy-phrase">利用するメリット</span>
            </h3>
            <p className="agent-benefits-intro">
              <strong>実はエージェントによって</strong>
            </p>
            <ul className="agent-differences">
              <li>
                <span aria-hidden="true">01</span>
                <strong>紹介できる求人</strong>
              </li>
              <li>
                <span aria-hidden="true">02</span>
                <strong>得意な業界</strong>
              </li>
              <li>
                <span aria-hidden="true">03</span>
                <strong>担当者の熱量</strong>
              </li>
            </ul>
            <p className="agent-differences-caption">が全く異なります</p>
            <p className="agent-single-risk">
              たまたま利用した1社だと、<wbr />その担当者次第で<strong>人生を左右されてしまうリスク</strong>があります。
            </p>
            <div className="agent-benefits-answer">
              <span className="agent-benefits-bridge">だからこそ</span>
              <p>
                <strong>
                  <span className="copy-phrase">強みの異なる3社以上の</span>
                  <span className="copy-phrase">エージェントを利用して、</span>
                </strong>
                <span className="copy-phrase">自分の転職に合った</span>
                <span className="copy-phrase">パートナーを</span>
                <strong className="agent-benefits-highlight">
                  <span className="copy-phrase">比較して選ぶことが</span>
                  <span className="copy-phrase">大切です。</span>
                </strong>
              </p>
            </div>
          </div>

          <div className="video-block">
            <div className="video-copy">
              <p className="eyebrow">SERVICE MOVIE</p>
              <h3>
                <span>1分でわかる</span>
                <span className="movie-service-name">出会えるエージェント</span>
              </h3>
              <p>サービスの仕組みと、3社をご紹介する理由を動画でわかりやすくご案内します。</p>
            </div>
            <ServiceVideo />
          </div>
        </section>

        <section className="voices" id="voice">
          <BackgroundAtmosphere />
          <div className="section-heading">
            <p className="eyebrow">USER VOICES</p>
            <h2>
              <span className="copy-line">出会いが変わると、</span>
              <span className="copy-phrase">転職の可能性が広がる。</span>
            </h2>
          </div>
          <ReviewList />
          <p className="review-note">
            ※利用者アンケートの高評価コメントから抜粋しています。見出し・図解は感想の要約、人物はイメージです。サービスおよび紹介先エージェントへの個人の感想であり、転職結果を保証するものではありません。
          </p>
        </section>

        <section className="flow section-light" id="flow">
          <BackgroundAtmosphere />
          <div className="section-heading">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2>ご紹介までの流れ</h2>
            <p>最初の登録からエージェントとの面談まで、オンラインで進められます。</p>
          </div>
          <ol className="flow-list">
            {flowSteps.map((step, index) => {
              const Icon = flowIcons[index];
              return (
                <li key={step.title}>
                  <div className="flow-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="flow-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <div className="flow-content">
                    <span>STEP {index + 1}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="final-cta" id="entry">
          <div className="final-orb final-orb-one" />
          <div className="final-orb final-orb-two" />
          <div className="final-content">
            <Brand inverse />
            <h2>
              <span className="copy-line">出会えるエージェントは</span>
              <span className="copy-line">
                <span className="copy-phrase">「働くって楽しい」</span>
                <span className="copy-phrase">と思える</span>
              </span>
              <span className="copy-line">明日を共に創ります</span>
            </h2>
            <p className="final-lead">
              「転職の相談がしたい」という段階でもご相談いただけます。まずはあなたの理想の転職をお聞かせください。
            </p>
            <CtaButton className="final-button">無料でエージェントを紹介してもらう</CtaButton>
            <div className="entry-facts">
              <span>
                <ShieldCheck size={17} aria-hidden="true" /> 利用料0円
              </span>
              <span>
                <Clock3 size={17} aria-hidden="true" /> 15分のオンライン相談
              </span>
            </div>
            <p className="eligibility">
              現在の主なサポート対象は20〜34歳、東京都・神奈川県・埼玉県・千葉県・愛知県・京都府・大阪府・兵庫県・福岡県で勤務を希望する方です。詳しい条件は申込画面でご確認ください。
            </p>
          </div>
        </section>

        <footer className="site-footer">
          <Brand />
          <div className="footer-links">
            <a href="https://foresma.jp/">運営会社</a>
            <a href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94?source=copy_link">
              利用規約
            </a>
            <a href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec?source=copy_link">
              プライバシーポリシー
            </a>
          </div>
          <p>© foresma Inc.</p>
        </footer>
      </main>

      {/* CTA 押下後の条件ポップアップ（lp08 系と同じ。回答後に LINE へ） */}
      <ConditionPopupForm
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        ctaUrl={SERVICE_PAGE_CTA_URL}
        lpUrl={canonicalLpUrl}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
