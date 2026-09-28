"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

import { MaxWidth } from "@/components/common";

import { ConditionPopupForm } from "./ConditionPopupForm";

const GTM_ID = "GTM-W7S9ZNV8";

const CTA_BUTTON_IMAGE = "/deaeru_lp96a_cta.png";

/** FV画像のデフォルト（lp02c由来）。fvImage prop で個別LPごとに差し替え可能 */
const DEFAULT_FV_IMAGE = "/deaeru-lp99a-intro.png";

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

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

interface Props {
  /** 行動分析用のLPキー（例: deaeru-lp08a） */
  lpKey: string;
  /** CTAボタンの遷移先（LIFF / LINEリンク。後で差し替え） */
  ctaUrl: string;
  /**
   * Wick GAS スプシに「CTA押下」を記録する場合の source 名（例: "lp96a"）。
   * 指定された場合のみ、CTA押下時に /api/spreadsheet/wick/ad-click へ送信する。
   * 未指定（lp08a〜d 等）の場合は送信しない。
   */
  wickSource?: string;
  /** Wick 送信時の重複抑制キーに使う識別子（URL の id パラメータ） */
  id?: string;
  /** メール配信 CTA 計測（mail-{campaignId}-{uid}） */
  mailTracking?: { campaignId: string; uid: string } | null;
  /** FV画像（未指定時は DEFAULT_FV_IMAGE = lp02c由来の画像） */
  fvImage?: string;
  /**
   * FV下の本文画像を上から順に差し替える（未指定時は lp02c/lp02a の共有スライス）。
   * 配列の最後の画像には運営会社リンクが重ねて表示される（従来の slice7 と同じ扱い）。
   * lp10系など個別デザインのLPで使用する。既存 lp07/lp08 は未指定のため無影響。
   */
  bodyImages?: string[];
  /**
   * 条件入力ポップアップを有効化する（lp08系）。
   * true の場合、CTAタップで直接LINEへ遷移せず、年齢/転職回数/希望勤務地の
   * ポップアップを表示し、回答をURLパラメータに付加してLINEへ遷移する。
   */
  conditionPopup?: boolean;
  /**
   * CTAボタン上の「＼ 今週◯人が診断！ ／」バッジの表示（未指定時は表示＝従来挙動）。
   * lp10系は非表示（false）。既存 lp07/lp08/lp96 は未指定のため無影響。
   */
  showDiagnosisCount?: boolean;
  /**
   * 最下部の着地用CTA（bodyImages 指定時のみ有効）。
   * true の場合、最後の本文画像（FAQ〜フッター）内のデザイン上の空白部分（top 80%付近）に
   * CTAを重ねて配置し、それが画面内に見えている間はフローティングCTAを非表示にする
   * （追従してきたボタンがその場に固定されたように見える）。lp10系で使用。
   */
  bottomCta?: boolean;
  /**
   * 本文画像の「途中」に置く着地用CTA（bodyImages 指定時のみ有効・複数可）。
   * imageIndex（bodyImages の添字）の画像に、画像高さ topPercent %（CTA中心）の位置でCTAを重ねる。
   * いずれかが半分以上画面内に見えている間はフローティングCTAを非表示にする
   * （追従してきたボタンがページ中腹の定位置で固定されたように見える）。
   * lp10系で使用。※ 呼び出し側はモジュール定数で渡すこと（毎レンダー新配列だとオブザーバーが再生成される）。
   */
  midCtas?: { imageIndex: number; topPercent: number }[];
  /**
   * CTAを外部LINE/LIFFリンクではなく「同一サイト内のフォームページ」へ遷移させる（lp12a系）。
   * true の場合、ctaUrl をそのまま href に使い（lpUrl パラメータ付加なし・別タブなし）、
   * LINE追加CV用のGTMイベント（line_add_listmarke）は発火しない。
   * 行動集計のCTAクリック記録は従来どおり行う。未指定（既存LP）は無影響。
   */
  internalCta?: boolean;
  /**
   * internalCta のCTA押下時に、ページ遷移せず呼び出し側へ通知する（lp12a/lp12b・2026-09-17）。
   * 指定時は href への遷移を preventDefault し、呼び出し側が同一ページ内でフォームに切り替える
   * （lp02c 系と同じ「URLが変わらない」挙動。Intro で読み込んだ GTM がフォーム中も生きる）。
   * 未指定なら従来どおり ctaUrl へ遷移する。href は残すので JS 無効時や新規タブ開きは従来どおり。
   */
  onInternalCtaClick?: () => void;
  /** CTAボタン画像（未指定時は従来のLINE診断ボタン）。lp12a系は面談予約ボタンに差し替える */
  ctaButtonImage?: string;
  /** CTAボタン画像のalt（未指定時は従来文言） */
  ctaButtonAlt?: string;
  /**
   * FV上のCTAボタンの縦位置（画像下端からの bottom %。未指定時は 7＝従来挙動）。
   * FV画像ごとにボタン設置スロットの位置が違うため、LP側で微調整できるようにする。
   * lp12a/lp12b（看護FV）はスロットが低めのため 4.2 を指定（7 だと評価ボックスに上端が重なる）。
   */
  fvCtaBottomPercent?: number;
  /**
   * FVブロックを画面1面（min-h-[100svh]）に広げて上下中央寄せするか（未指定時は true＝従来挙動）。
   * 縦長端末では FV 画像の上下に白い余白（レターボックス）が出るため、
   * lp12a/lp12b（看護）は false を指定して FV を上詰めにし、直後に次セクションを続ける。
   */
  fvFillViewport?: boolean;
}

/**
 * lp02cのファーストビューの見た目を踏襲しつつ、
 * CTAボタンをLINEボタン画像にし、クリックでフォームを挟まず
 * 直接LINE（LIFF）リンクへ遷移する直リンク型LP。
 */
export function LineDirectIntro({
  lpKey,
  ctaUrl,
  wickSource,
  id,
  mailTracking,
  fvImage = DEFAULT_FV_IMAGE,
  bodyImages,
  conditionPopup = false,
  showDiagnosisCount = true,
  bottomCta = false,
  midCtas,
  internalCta = false,
  onInternalCtaClick,
  ctaButtonImage = CTA_BUTTON_IMAGE,
  ctaButtonAlt = "LINEで診断してみる",
  fvCtaBottomPercent = 7,
  fvFillViewport = true,
}: Props) {
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [isBottomCtaVisible, setIsBottomCtaVisible] = useState(false);
  const bottomCtaRef = useRef<HTMLDivElement | null>(null);
  const [isMidCtaVisible, setIsMidCtaVisible] = useState(false);
  const midCtaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dailyCount, setDailyCount] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLElement | null>(null);
  const setButtonRef = useCallback((el: HTMLElement | null) => {
    buttonRef.current = el;
  }, []);

  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState("");
  const [isCtaClicked, setIsCtaClicked] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const scrollYRef = useRef<number>(0);
  const maxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);
  const isCtaClickedRef = useRef<boolean>(false);
  const sendDataRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setDailyCount(getDailyDiagnosisCount());
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date()));
  }, []);

  useEffect(() => {
    if (!mailTracking) return;
    fetch("/api/mail/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId: mailTracking.campaignId,
        uid: mailTracking.uid,
        type: "click",
      }),
      keepalive: true,
    }).catch((err) => {
      console.warn("[mail-events] click beacon failed:", err);
    });
  }, [mailTracking]);

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

  // 着地用CTA（bottomCta）が半分以上見えている間はフローティングCTAを非表示にし、
  // 追従してきたボタンが最下部の定位置に「固定」されたように見せる
  useEffect(() => {
    if (!bottomCta) return undefined;
    const target = bottomCtaRef.current;
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBottomCtaVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [bottomCta]);

  // 途中着地用CTA（midCtas）のいずれかが半分以上見えている間もフローティングCTAを非表示にし、
  // 追従してきたボタンがページ中腹の定位置で「固定」されたように見せる
  useEffect(() => {
    if (!midCtas || midCtas.length === 0) return undefined;
    const targets = midCtaRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (targets.length === 0) return undefined;

    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTargets.add(entry.target);
          } else {
            visibleTargets.delete(entry.target);
          }
        });
        setIsMidCtaVisible(visibleTargets.size > 0);
      },
      { threshold: 0.5 }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [midCtas]);

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      maxScrollYRef.current =
        document.documentElement.scrollHeight - window.innerHeight;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      ) as (typeof trackingData)[];
      history.push(trackingData);
      if (history.length > 100) history.shift();
      localStorage.setItem("ad_tracking_history", JSON.stringify(history));
    }
  }, [searchParams]);

  useEffect(() => {
    const getStayingTime = () =>
      Math.floor((Date.now() - startTimeRef.current) / 1000);
    const calculateScrollRate = () =>
      maxScrollYRef.current === 0
        ? 0
        : Math.round((scrollYRef.current / maxScrollYRef.current) * 100);

    const sendData = () => {
      if (hasSentBeaconRef.current) return;
      hasSentBeaconRef.current = true;
      // 同一ページ内切替（onInternalCtaClick）では CTA 押下直後にこのコンポーネントが外れるため、
      // state（isCtaClicked）の再描画を待たずに ref で押下済みを反映する
      const ctaClicked = isCtaClicked || isCtaClickedRef.current;

      const blob = new Blob(
        [
          JSON.stringify({
            lp_key: lpKey,
            inflow_datetime: inflowDatetime,
            current_url: currentUrl,
            staying_time: getStayingTime(),
            intro_scroll_y: scrollYRef.current,
            intro_scroll_rate: `${calculateScrollRate()}%`,
            is_cta_1_submitted: ctaClicked,
            is_cta_2_submitted: false,
            is_cta_3_submitted: false,
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/spreadsheet/gt/action-statistics", blob);
    };

    const handlePagehide = () => sendData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendData();
    };
    // アンマウント時送信用に最新の sendData を保持
    sendDataRef.current = sendData;

    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lpKey, inflowDatetime, currentUrl, isCtaClicked]);

  // 同一ページ内でフォームへ切り替える LP（lp12a/lp12b）では pagehide が起きないまま Intro が外れるため、
  // アンマウント時にも行動集計を送る（既に送信済みなら sendData 側で無視される）。
  // CTA 押下後のアンマウントに限定する（開発時 StrictMode の擬似アンマウントや通常LPの離脱で
  // 早期送信して pagehide 時の本送信を潰さないため）。
  useEffect(() => {
    return () => {
      if (isCtaClickedRef.current) sendDataRef.current?.();
    };
  }, []);

  const appendLpUrlToCta = (baseUrl: string, lpUrl: string) =>
    `${baseUrl}&lpUrl=${encodeURIComponent(lpUrl)}`;

  // LINE追加CTAの計測処理（直リンク／ポップアップ経由 共通）
  const fireCtaTracking = () => {
    setIsCtaClicked(true);
    isCtaClickedRef.current = true;

    // GTM CV計測（リストマーケ導線のLINE追加CTA専用カスタムイベント）。
    // このCTAは liff.line.me へ直接遷移する「LINE追加の最終アクション」なので、
    // GTMの自動クリック計測の取りこぼし対策として onClick で明示的に dataLayer へ push する。
    // target="_blank" のため現ページは遷移せず、遷移より前に呼べばよい。
    // internalCta（フォーム遷移型）はLINE追加ではないため発火しない（CVはthanksのPixelで計測）。
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    w.dataLayer = w.dataLayer || [];
    if (!internalCta) {
      w.dataLayer.push({ event: "line_add_listmarke" });
    }

    // Wick GAS スプシに「CTA押下」を記録（wickSource 指定時のみ。lp96a 等）
    // 同一セッション内の重複送信は localStorage で抑制（1セッション1回）
    if (wickSource) {
      const storageKey = `wick_ad_click_${wickSource}_${id ?? ""}`;
      if (!window.localStorage.getItem(storageKey)) {
        window.localStorage.setItem(storageKey, new Date().toISOString());
        fetch("/api/spreadsheet/wick/ad-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: wickSource,
            id: id ?? null,
            at: new Date().toISOString(),
          }),
          keepalive: true,
        }).catch((err) => {
          console.warn(`[${wickSource}] wick ad-click 送信失敗（無視）:`, err);
        });
      }
    }
  };

  // 直リンク型CTA（ポップアップ無効時）のクリック処理
  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // internalCta はサイト内フォームへの相対遷移のため lpUrl パラメータを付加しない
    if (!internalCta) {
      event.currentTarget.href = appendLpUrlToCta(ctaUrl, window.location.href);
    }
    fireCtaTracking();
    // 同一ページ内切替（lp12a/lp12b）: 修飾キー付き・中クリックは新規タブ等の既定動作に任せ、
    // 通常クリックだけ遷移を止めて呼び出し側でフォームに切り替える（URLは変わらない）
    if (
      internalCta &&
      onInternalCtaClick &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      onInternalCtaClick();
    }
  };

  const resolvedCtaUrl = internalCta
    ? ctaUrl
    : currentUrl !== ""
      ? appendLpUrlToCta(ctaUrl, currentUrl)
      : ctaUrl;

  const renderCtaInner = (
    <div className="relative animate-button-bounce-no-shadow">
      {showDiagnosisCount && dailyCount !== null && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10">
          <div className="relative bg-white border-2 border-[#E8641A] rounded-full px-4 py-1 whitespace-nowrap shadow-sm">
            <span className="text-[#E8641A] font-bold text-sm tracking-wide">
              ＼ 今週{" "}
              <span className="text-[#E8641A] font-black text-base">
                {dailyCount}
              </span>
              人が診断！ ／
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#E8641A]" />
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </div>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="block w-full" src={ctaButtonImage} alt={ctaButtonAlt} />
    </div>
  );

  const renderCtaButton = (attachRef = false) => {
    // lp08系: CTAタップでポップアップを開く
    if (conditionPopup) {
      return (
        <button
          ref={attachRef ? setButtonRef : undefined}
          type="button"
          onClick={() => setIsPopupOpen(true)}
          className="touch-manipulation block w-full"
        >
          {renderCtaInner}
        </button>
      );
    }
    // 通常: 直接LINE（LIFF）へ遷移。internalCta はサイト内フォームへ同一タブで遷移
    return (
      <a
        ref={attachRef ? setButtonRef : undefined}
        href={resolvedCtaUrl}
        {...(internalCta ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        onClick={handleCtaClick}
        className="touch-manipulation block w-full"
      >
        {renderCtaInner}
      </a>
    );
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
        @keyframes button-bounce-no-shadow {
          0%,
          100% {
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

      {/* FV: lp02cと同じ画像 + LINE CTAボタン（曜日別動的人数バッジ付き）
          lp08系（conditionPopup）は同意文言をFVに置かないため、
          min-h/justify-center による画像下の余白を作らない。
          fvFillViewport=false（lp12a/lp12b）も同様に min-h を付けず上詰めにする
          （縦長端末で画像上下に白余白が出るのを防ぐ）。 */}
      <MaxWidth
        className={
          conditionPopup || !fvFillViewport
            ? ""
            : "flex min-h-[100svh] flex-col justify-center"
        }
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="block w-full"
            src={fvImage}
            alt="出会えるエージェント - 転職こそ、タイパの時代。"
          />
          <div
            className="absolute left-0 right-0 mx-auto block w-[82%]"
            style={{ bottom: `${fvCtaBottomPercent}%` }}
          >
            {renderCtaButton(true)}
          </div>
        </div>
        {/* 直リンク型LP（ポップアップ無し）のみFVに同意文言を表示。
            lp08系（conditionPopup）はポップアップのCTAボタン下に表示する。
            internalCta（フォーム遷移型）はボタン押下＝同意ではないため表示しない
            （同意はフォーム送信側で取る）。 */}
        {!conditionPopup && !internalCta && (
          <div className="shrink-0 px-6 pt-3 pb-3">
            <p className="text-center text-[10px] leading-tight text-[#9a9a9a]">
              上記ボタンを押すことで、以下にご同意いただいたものとみなします。
            </p>
            <ul className="mt-1 mx-auto max-w-[300px] text-[10px] leading-tight text-[#9a9a9a]">
              <li className="flex items-start gap-1">
                <span className="shrink-0 text-[#bdbdbd]">・</span>
                <span>
                  <a
                    href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#777]"
                  >
                    利用規約
                  </a>
                  および
                  <a
                    href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec?source=copy_link"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#777]"
                  >
                    プライバシーポリシー
                  </a>
                </span>
              </li>
              <li className="mt-1 flex items-start gap-1">
                <span className="shrink-0 text-[#bdbdbd]">・</span>
                <span>
                  現在、業務遂行に支障となる健康問題がなく、
                  <span className="text-[#e60012]">通院中</span>ではない
                </span>
              </li>
              <li className="mt-1 flex items-start gap-1">
                <span className="shrink-0 text-[#bdbdbd]">・</span>
                <span>
                  現在<span className="text-[#e60012]">学生の方</span>、
                  <span className="text-[#e60012]">リモート勤務</span>希望、および
                  <span className="text-[#e60012]">時短勤務</span>希望ではない
                </span>
              </li>
            </ul>
          </div>
        )}
      </MaxWidth>

      {/* フローティングCTAボタン（最下部/途中の着地用CTAが見えている間は非表示） */}
      {showFixedButton && !isBottomCtaVisible && !isMidCtaVisible && (
        <div className="fixed bottom-[8%] left-0 right-0 z-50">
          <MaxWidth>
            <div className="flex justify-center">
              <div className="w-[92%]">{renderCtaButton(false)}</div>
            </div>
          </MaxWidth>
        </div>
      )}

      {/* FV下のSlice画像エリア */}
      <MaxWidth>
        {bodyImages ? (
          // 個別デザインのLP（lp10系等）: 渡された本文画像を上から順に描画。
          // 最後の画像には従来の slice7 と同じく運営会社リンクを重ねる。
          bodyImages.map((src, index) => {
            if (index === bodyImages.length - 1) {
              return (
                <div className="relative" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="block w-full" src={src} alt="" />
                  {bottomCta && (
                    // 着地用CTA: 最終画像内のFAQとフッターの間の空白（デザイン上のCTA枠）に重ねる
                    <div
                      ref={bottomCtaRef}
                      className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[92%]"
                    >
                      {renderCtaButton(false)}
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
              );
            }
            const midCta = midCtas?.find((m) => m.imageIndex === index);
            if (midCta) {
              return (
                <div className="relative" key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="block w-full" src={src} alt="" />
                  {/* 途中着地用CTA: 画像内のデザイン空白（topPercent%＝CTA中心）に重ねる */}
                  <div
                    ref={(el) => {
                      midCtaRefs.current[index] = el;
                    }}
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%]"
                    style={{ top: `${midCta.topPercent}%` }}
                  >
                    {renderCtaButton(false)}
                  </div>
                </div>
              );
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="block w-full" src={src} alt="" key={src} />
            );
          })
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="block w-full"
              src="/deaeru-lp02c-slice0.png"
              alt="タイパ転職説明"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice1.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice2.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice3.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice4.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice5.png" alt="" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="block w-full" src="/deaeru-lp02a-slice6.png" alt="" />
            {/* Slice7 + 運営会社リンク */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="block w-full" src="/deaeru-lp02a-slice7.png" alt="" />
              <Link
                href="https://foresma.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-[6%] left-4 text-sm font-bold text-[#333] hover:opacity-70 transition-opacity"
              >
                運営会社
              </Link>
            </div>
          </>
        )}
      </MaxWidth>

      {/* lp08系: 条件入力ポップアップ */}
      {conditionPopup && (
        <ConditionPopupForm
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          ctaUrl={ctaUrl}
          lpUrl={currentUrl || (typeof window !== "undefined" ? window.location.href : "")}
          onConfirm={fireCtaTracking}
        />
      )}
    </div>
  );
}
