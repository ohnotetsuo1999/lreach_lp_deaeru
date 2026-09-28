"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

// ▼▼▼ 設定エリア（女性用 lp05e） ▼▼▼
const SITE_CONFIG = {
  CTA_BASE_URL: "https://deaeru-agent.jp/deaeru/lp03e/",
};
// ▲▲▲ 設定エリアここまで ▲▲▲

// 日付フォーマット関数
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

// 日付計算関数（閲覧日の3日前を計算）
const getThreeDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 3); // 3日引く
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 型定義の回避（any）
type AnyProps = any;

// 画像アセット定義 (⚠️ここは女性用なので -man はつきません！)
const ASSETS = {
  INTRO: {
    TROUBLE: { src: "/images/intro-trouble.jpg", alt: "女性の悩むイメージ" },
    LIFESTYLE: {
      src: "/images/intro-lifestyle.jpg",
      alt: "成功後のライフスタイル",
    },
  },
  SERVICE: {
    BENEFITS: { src: "/images/service-benefits.jpg", alt: "カフェラテ" },
    PHONE: { src: "/images/service-phone.jpg", alt: "スマホ見る女性" },
    CROSSROADS: {
      src: "/images/service-crossroads.jpg",
      alt: "分かれ道で悩む女性",
    },
    LP_FV: {
      src: "/images/service-deaeru-lp-fv.jpg",
      alt: "出会えるエージェントLPのファーストビュー",
    },
    AGENT_CHOICE: {
      src: "/images/service-agent-choice.jpg",
      alt: "選択肢選びに悩む女性",
    },
    BIAS_DIAGRAM: {
      src: "/images/service-bias-diagram.jpg",
      alt: "求人の偏りの図解",
    },
    VACATION: {
      src: "/images/service-vacation.jpg",
      alt: "有給を使わずに転職活動",
    },
    OFFICE: { src: "/images/service-office.jpg", alt: "快適なオフィスワーク" },
  },
  TIPS: {
    AGE_KEY: {
      src: "/images/tips-age-key.jpg",
      alt: "20代のうちに転職することが大事",
    },
    CHANCE: {
      src: "/images/tips-chance.jpg",
      alt: "いつか転職したいなら今がチャンス",
    },
  },
  CONCLUSION: {
    FUTURE: {
      src: "/images/conclusion-future.jpg",
      alt: "希望に満ちた転職後の姿",
    },
    REVIEW_PLACEHOLDER: {
      src: "/images/service-user-voice.jpg",
      alt: "利用者の声のスクリーンショット",
    },
  },
};

const TEXT_DATA = {
  INTRO_CHECK_LIST: [
    "3年働いているのに給料が一切上がらない",
    "肉体労働がキツくて40歳以降も働くのは無理...",
    "自分の本当にやりたいことを仕事にできていない…",
  ],
  CONCLUSION_RECOMMENDED: [
    "転職したいけど、最初の1歩が踏み出せない",
    "今の会社より好条件の会社に転職したい",
    "転職って何から始めればいいかわからない",
    "転職について誰かに相談したい",
  ],
};

// ユーティリティ
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

// アイコン類
const CalendarIcon = ({ className }: AnyProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
const UserIcon = ({ className }: AnyProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const CheckIcon = ({ className }: AnyProps) => (
  <span className={cn("text-green-500 font-bold", className)}>✅</span>
);
const WideArrowIcon = ({ className }: AnyProps) => (
  <svg viewBox="0 0 60 55" className={cn("fill-current", className)}>
    <path d="M20 0 H40 V25 H60 L30 55 L0 25 H20 V0 Z" />
  </svg>
);

// UIコンポーネント
const Marker = ({ children, color = "yellow" }: AnyProps) => {
  const colorVariants: any = {
    yellow: "from-yellow-200/80",
    red: "from-red-200/80",
    blue: "from-blue-200/80",
    green: "from-green-200/80",
  };
  return (
    <span
      className={cn(
        "bg-gradient-to-t to-transparent from-40% bg-no-repeat font-bold px-1",
        colorVariants[color] || colorVariants.yellow
      )}
    >
      {children}
    </span>
  );
};

const SectionTitle = ({ children, className }: AnyProps) => (
  <h2
    className={cn(
      "font-bold bg-green-50 border-l-4 border-green-500 p-3 mb-6",
      className || "text-xl"
    )}
  >
    {children}
  </h2>
);

const PointBox = ({ title, children, type = "normal" }: AnyProps) => {
  const variants: any = {
    normal: "border-gray-300 bg-gray-50",
    check: "border-green-400 bg-green-50",
    alert: "border-red-400 bg-red-50",
  };
  return (
    <div
      className={cn(
        "border-2 rounded-lg p-6 mb-8 relative",
        variants[type] || variants.normal
      )}
    >
      {title && (
        <span className="absolute -top-3 left-4 bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {title}
        </span>
      )}
      {children}
    </div>
  );
};

const LocalImage = ({ src, alt, className }: AnyProps) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) {
    return (
      <div
        className={cn(
          "bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-4 min-h-[200px] mb-4 rounded-lg",
          className
        )}
      >
        <span className="text-4xl mb-2">🖼️</span>
        <span className="text-sm font-bold text-gray-500 mb-1">{alt}</span>
        <span className="text-xs font-mono break-all text-center text-gray-400">
          {src}
        </span>
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={cn("mb-4 object-cover", className)}
      onError={() => setError(true)}
    />
  );
};

// 修正：2行表示対応、矢印位置調整のためのCtaButton変更
const CtaButton = ({
  href,
  children,
  badgeText = "完全無料",
  className,
}: AnyProps) => (
  <div className="relative w-full mt-8 group">
    <style jsx>{`
      @keyframes pulse-scale {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
      @keyframes badge-bounce {
        0%,
        100% {
          transform: rotate(-6deg) scale(1);
        }
        50% {
          transform: rotate(-6deg) scale(1.05);
        }
      }
      .animate-pulse-scale {
        animation: pulse-scale 1.5s ease-in-out infinite;
      }
      .animate-badge-bounce {
        animation: badge-bounce 1.5s ease-in-out infinite;
      }
    `}</style>
    <span className="absolute -top-6 left-4 z-10 bg-yellow-300 text-red-600 border-2 border-yellow-400 font-black text-lg px-4 py-1 rounded-full shadow-[0_4px_0_rgb(202,138,4)] animate-badge-bounce group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
      {badgeText}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-3 h-3 bg-yellow-300 border-r-2 border-b-2 border-yellow-400 transform rotate-45"></span>
    </span>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      role="button"
      className={cn(
        "w-full bg-gradient-to-r from-green-400 to-green-600 border-b-4 border-green-700",
        "hover:border-green-600 hover:translate-y-0.5 active:translate-y-1 active:border-none",
        "text-white font-bold py-4 px-2 rounded-full shadow-xl text-lg",
        "flex flex-col items-center justify-center transition-all duration-150 text-center cursor-pointer no-underline leading-tight",
        "animate-pulse-scale",
        className
      )}
    >
      {/* childrenをそのまま表示（矢印は呼び出し側で制御） */}
      {children}
    </a>
  </div>
);

// メインコンポーネント
export default function ArticleLP() {
  const params = useParams();
  const id = params?.id || "001";
  const ctaUrl = `${SITE_CONFIG.CTA_BASE_URL}${id}`;

  // 行動分析用のstate
  const [dateStr, setDateStr] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState("");
  const [isCta1Clicked, setIsCta1Clicked] = useState(false);
  const [isCta2Clicked, setIsCta2Clicked] = useState(false);

  // 行動分析用のref
  const startTimeRef = useRef<number>(Date.now());
  const scrollYRef = useRef<number>(0);
  const maxScrollYRef = useRef<number>(0);

  // 滞在時間を取得（秒単位）
  const getStayingTime = (): number => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  // スクロール率を計算
  const calculateScrollRate = (): number => {
    if (maxScrollYRef.current === 0) return 0;
    return Math.round((scrollYRef.current / maxScrollYRef.current) * 100);
  };

  // ページ読み込み時に実行
  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date()));
    setDateStr(getThreeDaysAgo());
  }, []);

  // スクロール量を記録
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollYRef.current = currentScrollY;
      maxScrollYRef.current = maxScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ページ離脱時にデータを送信（重複送信防止フラグ）
  const hasSentRef = useRef(false);

  useEffect(() => {
    const sendData = () => {
      if (hasSentRef.current) return; // 重複送信防止
      hasSentRef.current = true;

      const blob = new Blob(
        [
          JSON.stringify({
            inflow_datetime: inflowDatetime,
            current_url: currentUrl,
            staying_time: getStayingTime(),
            intro_scroll_y: scrollYRef.current,
            intro_scroll_rate: `${calculateScrollRate()}%`,
            is_cta_1_submitted: isCta1Clicked,
            is_cta_2_submitted: isCta2Clicked,
            is_cta_3_submitted: false,
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/spreadsheet/gt/action-statistics", blob);
    };

    const handlePagehide = () => sendData();

    // iOS Safari対応: visibilitychangeイベントも使用
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendData();
      }
    };

    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  // CTAクリック時の処理
  const handleCta1Click = () => {
    setIsCta1Clicked(true);
  };

  const handleCta2Click = () => {
    setIsCta2Clicked(true);
  };

  return (
    <div className="font-sans text-gray-800 bg-[#f9f9f9] min-h-screen pb-24">
      <div className="max-w-lg mx-auto bg-white shadow-xl min-h-screen pt-6">
        {/* ヘッダー */}
        <header>
          <div className="p-5 pb-2">
            <h1 className="text-2xl font-bold leading-relaxed text-gray-900 mb-4 text-center">
              新卒3年目で職歴のない私でも
              <br />
              <span className="text-red-500 bg-yellow-100 px-2 py-1 mx-1 rounded">
                (私にとっての)神企業
              </span>
              に<br />
              転職できた理由
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {dateStr || "2026..."}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                みお（25）
              </div>
            </div>
          </div>
          <div className="px-5 mb-6">
            <p className="text-right text-xs text-gray-400 mb-1">
              PR：出会えるエージェント
            </p>
            <hr className="border-t-4 border-green-500 rounded opacity-70" />
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="px-5 text-[15px] leading-7 text-gray-700">
          {/* IntroProblem */}
          <p className="mb-6 font-bold text-gray-800">
            突然ですがあなたは、
            <br />
            「一生働きたい！」と本気で考え
            <br />
            <span className="text-red-500 border-b-2 border-red-200 text-lg">
              『自分の価値観に合った会社』
            </span>
            で<br />
            働いていますか？
          </p>
          <PointBox type="normal">
            <ul className="space-y-3">
              {TEXT_DATA.INTRO_CHECK_LIST.map((text, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <CheckIcon className="flex-shrink-0 mt-1" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-center font-bold mt-6 text-base">
              1つでも当てはまることは、
              <br />
              ありませんか？
            </p>
          </PointBox>
          <div className="my-8">
            <LocalImage
              {...ASSETS.INTRO.TROUBLE}
              className="rounded-xl w-full h-auto"
            />
          </div>

          {/* 修正①：改行調整 */}
          <p className="mb-6 leading-8">
            実は<b>約3か月前まで</b>、<br />
            今の職場に不満があって
            <br />
            <b>転職したい</b>ってずっと思っていたのに、
            <br />
            1年以上も転職から目を背けていた、
            <br />
            ただの<b>「会社員」だった私(25歳)</b>は...
          </p>

          {/* IntroHook */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-10 text-gray-800">
            <p className="font-bold">
              ある転職相談がきっかけで、
              <br />
              <span className="text-red-500 text-xl">
                『この会社でずっと働きたい！』
              </span>
              と思い
              <br />
              「自分の価値観に合った会社」に転職大成功して
              <br />
              <Marker>年収が90万も上がりました</Marker>
            </p>
          </div>
          <div className="mb-10">
            <LocalImage
              {...ASSETS.INTRO.LIFESTYLE}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>

          {/* StoryBeforeAfter */}
          {/* 修正①：改行調整 */}
          <div className="mb-10">
            <p className="mb-6 text-gray-700">
              毎日やりがいがなくて
              <br />
              「早く仕事辞めたい」
              <br />
              「もっと楽しい仕事があったらいいのに」
              <br />
              こんな辛い思いをしていた私ですが、、
            </p>
            <p className="font-bold text-gray-800 mb-4">転職がきっかけで</p>
            <ul className="space-y-3 mb-6 text-gray-800 text-base border-l-4 border-green-400 pl-4 py-1">
              <li className="font-bold">
                ・働き方大改善！(立ち仕事→事務作業)
                <span className="block text-sm text-gray-600 font-normal pl-4">
                  ※週1~2在宅勤務
                </span>
              </li>
              <li className="font-bold">・年収90万アップ！(290万→380万)</li>
            </ul>
            <LocalImage
              {...ASSETS.SERVICE.BENEFITS}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* StoryTransition */}
          {/* 修正②：改行調整 */}
          <div className="mb-12">
            <p className="mb-6">
              今回は、この記事を見た方だけに。
              <br />
              <span className="font-bold border-b border-yellow-300">
                初めての転職で「自分の価値観に合った会社」を見つけて
                <br />
                年収UP・働き方改善ができた理由を
                <br />
                特別にご紹介したいと思います♪
              </span>
            </p>
            <div className="flex justify-center gap-4 animate-bounce mt-10">
              {[...Array(3)].map((_, i) => (
                <WideArrowIcon
                  key={i}
                  className="w-16 h-auto text-yellow-400 drop-shadow-sm"
                />
              ))}
            </div>
          </div>

          {/* StoryStruggle */}
          {/* 修正⑥：見出しサイズ・改行調整（サイズ指定なし＝デフォルトのまま、改行で調整） */}
          <SectionTitle>
            好条件の会社に転職したいけど・・・
            <br />
            どうやって転職すればいいの??
          </SectionTitle>
          <div className="mb-6 text-sm leading-relaxed">
            <p className="font-bold text-gray-800 mb-3">
              「給料高い会社に転職したいけど、めんどうくさい...」
            </p>
            <p className="leading-8">
              実は私、ずっと転職したいと思ってたのに、
              <br />
              転職サイトにたくさん登録するだけで
              <br />
              <span className="text-blue-600 font-bold text-xl">
                1年以上の間、転職活動を何もしていませんでした。
              </span>
            </p>
          </div>
          <div className="my-6">
            <LocalImage
              {...ASSETS.SERVICE.PHONE}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="mb-8 leading-8">
            そんな中、ちょうど3ヶ月前、
            <br />
            1番仲の良かった同期が
            <br />
            <Marker>「転職先決まった！」</Marker>
            <br />
            <Marker>「今より給料も高くて残業ほぼ0だよ！」</Marker>
            <br />
            といきなり伝えられて、
            <br />
            その時私は
            <span className="text-red-500 font-bold text-xl">
              「私も転職したい...!!!」
            </span>
            と強く思いました。
            <br />
            <br />
            それでもそれ以上に、
            <br />
            <span className="text-blue-600 font-bold">
              「転職活動って何から始めればいいの？」
            </span>
            <br />
            <span className="text-blue-600 font-bold">
              「私の職歴じゃ年収UPなんて無理そう...」
            </span>
            <br />
            そんな気持ちが強くて
            <br />
            <span className="text-blue-600 font-bold text-lg">
              「転職活動の最初の1歩」
            </span>
            が踏み出せませんでした。
          </p>
          <div className="my-8">
            <LocalImage
              {...ASSETS.SERVICE.CROSSROADS}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* ServiceDiscovery */}
          <div className="mb-10 text-left">
            <p className="text-base mb-2">そんな時にインスタを見ていて、</p>
            <p className="text-base mb-2">パッと目についたのが、</p>
            <p className="text-base mb-2">
              <span className="font-bold text-red-500 text-xl">
                『出会えるエージェント』
              </span>
              という、
            </p>
            <p className="text-base mb-4">20代向けの転職サービスでした</p>
            <LocalImage
              {...ASSETS.SERVICE.LP_FV}
              className="w-full h-auto rounded-lg my-6"
            />
          </div>
          <div className="mb-8">
            <p className="mb-4 text-sm leading-7">
              このサービス、みんながよく知っている
              <br />
              「転職エージェント」じゃなくて
              <br />
              <span className="text-red-500 font-bold">
                自分の転職条件や価値観に合った転職エージェントを
                <br />
                3社紹介してくれる転職サービス
              </span>
              なの。
            </p>
            {/* 修正③：改行調整 */}
            <p>
              なぜ3社？って思った人もいると思うんだけど
              <br />
              実は転職エージェントにも当たりはずれとか、
              <br />
              合う合わないがあるんだって。
            </p>
          </div>
          <div className="mb-6">
            <LocalImage
              {...ASSETS.SERVICE.AGENT_CHOICE}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="mb-4">普通に、転職エージェントを1社しか使わないと...</p>
          <div className="mb-6 text-sm font-bold text-blue-600 leading-relaxed pl-2">
            ・紹介される求人に偏りが出る
            <br />
            ・担当者との相性が悪くて前向きに進められなくなる
          </div>
          <div className="mb-8">
            <LocalImage
              {...ASSETS.SERVICE.BIAS_DIAGRAM}
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="mb-8 font-normal leading-8 text-gray-700">
            <p className="mb-4">
              でもこの『出会えるエージェント』は、
              <br />
              一人一人の転職希望条件や価値観に合わせて
              <br />
              <span className="font-bold">
                <span className="text-red-500 text-lg">
                  自分にぴったりの転職エージェントを
                  <br />
                  3社も一気に紹介してくれるから
                </span>
              </span>
            </p>
            <p>
              「大変そうです…」って思ってた転職活動も、
              <br />
              悩まず
              <span className="text-red-500 font-bold text-lg">
                スムーズに進められる！
              </span>
            </p>
          </div>

          {/* ServiceResult */}
          <div className="mb-10 px-4">
            <LocalImage
              {...ASSETS.SERVICE.VACATION}
              className="w-full h-auto rounded-xl shadow-lg border-4 border-gray-800"
            />
          </div>
          {/* 修正④：文字サイズ縮小(text-sm)・改行調整 */}
          <p className="mb-8 leading-8 font-bold text-sm">
            こんな神サービスを使って私も転職活動を進めて
            <br />
            初めての転職なのに
            <br />
            <span className="text-red-500 text-lg">
              <Marker>年収90万UP・週2在宅勤務</Marker>
              <br />
              <Marker>の私にぴったりな会社に転職できたんです😭✨</Marker>
            </span>
          </p>
          <div className="mb-12">
            <LocalImage
              {...ASSETS.SERVICE.OFFICE}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* TipsSection */}
          {/* 修正⑦：見出し改行調整 */}
          <SectionTitle>
            最初の転職でも失敗しないための
            <br />
            ポイント！
          </SectionTitle>
          <div className="mb-12">
            <p className="mb-4 leading-8">
              実は、私が転職大成功できたのは
              <br />
              経験が良かったからでも、資格があったからでもありません。
              <br />
              ただ<span className="text-red-500">“20代前半”</span>
              だったからなんです。
              <br />
              (採用担当に言われました。笑)
            </p>

            <div className="text-center font-bold text-gray-800 text-lg mb-4 p-2 border-b-2 border-red-200 inline-block mx-auto">
              転職は<span className="text-red-600">「20代のうちが大事」</span>
            </div>
            <div className="mt-4">
              <LocalImage
                {...ASSETS.TIPS.AGE_KEY}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
          <p className="mb-4 text-gray-700">まだ若いと転職が有利といっても、</p>
          <PointBox type="normal">
            <div className="space-y-4 text-sm leading-relaxed text-gray-700 -mt-2 -mb-2">
              <p>
                <Marker>１． 未経験でもポテンシャル採用される</Marker>
                <br />
                30代になると「即戦力」が求められる。でも20代なら、経験よりも「これからの成長」で判断される。
              </p>
              <p>
                <Marker>２． 求人がたくさんある</Marker>
                <br />
                30代以降に比べて、求人数が多いから好条件の会社を見つけやすい。
              </p>
              <p>
                <Marker>３． 年収アップのチャンスが多い</Marker>
                <br />
                業績の良い人材不足の会社が見つかれば、同じ業務内容でも環境を変えるだけで給料が上がることがある。
              </p>
            </div>
          </PointBox>
          <p className="mt-4 mb-10 text-gray-700">からです。</p>
          <div className="mb-12 relative">
            <LocalImage
              {...ASSETS.TIPS.CHANCE}
              className="w-full h-auto rounded-xl mb-4 shadow-md"
            />

            <p className="mb-4 font-bold leading-8 text-gray-800">
              だから、少しでも転職を考えているなら
              <br />
              <span className="text-red-500 text-lg">
                今すぐ転職活動を始めることが大事です！
              </span>
            </p>

            <p className="mb-4 leading-8 text-gray-700">
              「転職って何から始めれば良いかわからない...」って人は
              <br />
              私が使った
              <span className="font-bold text-red-500 text-lg">
                『出会えるエージェント』
              </span>
              を使って
              <br />
              <span className="font-bold text-red-500 text-lg">
                「自分にぴったりの転職エージェント」
              </span>
              を見つけてみてください！
            </p>
            <p className="mb-4 font-bold leading-8 text-gray-700">
              希望条件を入力するだけで、
              <br />
              条件を満たしてくれる転職エージェントがすぐ見つかるよ！
              <br />
              たった30秒でできるからやってみて 👇
            </p>

            {/* 修正⑧：CTAボタンの改行・矢印位置調整 */}
            <div
              id="cta-section-simple"
              className="text-center"
              onClick={handleCta1Click}
            >
              <CtaButton href={ctaUrl}>
                <span>自分にぴったりのエージェントを</span>
                <span className="flex items-center justify-center mt-1">
                  見つけてみる <span className="text-2xl ml-1">👉</span>
                </span>
              </CtaButton>
            </div>
          </div>

          {/* ClosingSection */}
          <SectionTitle>
            出会えるエージェントってどんなサービスなの・・・？
          </SectionTitle>
          <div className="mb-4">
            <LocalImage
              {...ASSETS.CONCLUSION.REVIEW_PLACEHOLDER}
              className="w-full h-auto rounded-xl shadow-md"
            />
          </div>

          {/* ConclusionSection */}
          <SectionTitle>最後に・・・</SectionTitle>
          <PointBox type="normal">
            <h3 className="font-bold text-center mb-6 text-xl text-blue-600">
              『出会えるエージェント』は
              <br /> こんな方におすすめです✨
            </h3>
            <ul className="space-y-3 mb-0 text-base font-bold text-gray-700">
              {TEXT_DATA.CONCLUSION_RECOMMENDED.map((text, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckIcon />
                  {text}
                </li>
              ))}
            </ul>
          </PointBox>
          {/* 修正⑤：文字サイズ縮小(text-sm)・改行調整 */}
          <p className="mb-6 leading-8 text-sm">
            私は『出会えるエージェント』を使って転職したことで、
            <br />
            転職活動について何も分からない状態から
            <br />
            たった2ヶ月で
            <br />
            <Marker>「生涯ずっと働きたい！」と本気で思える</Marker>
            <br />
            <Marker>『自分の価値観に合った会社』に転職できました！</Marker>
          </p>
          <div className="mb-6">
            <LocalImage
              {...ASSETS.CONCLUSION.FUTURE}
              className="w-full h-48 object-cover rounded-lg shadow"
            />
          </div>
          <p className="font-bold text-center mb-6 text-gray-800 text-lg">
            少しでも転職しようか悩んでいるなら
            <br />
            全て無料で利用できるから
            <br />
            <span className="text-red-500 text-xl">1番若い今のうちに</span>
            <br />
            転職活動を始めてみましょう✨
          </p>
          {/* 修正⑧：CTAボタンの改行・矢印位置調整 */}
          <div onClick={handleCta2Click}>
            <CtaButton href={ctaUrl}>
              <span>自分にぴったりのエージェントを</span>
              <span className="flex items-center justify-center mt-1">
                見つけてみる <span className="text-2xl ml-1">👉</span>
              </span>
            </CtaButton>
          </div>
        </main>

        <footer className="text-center text-xs text-gray-400 py-8 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-center gap-4 mb-2">
            <span>プライバシーポリシー</span>
            <span>特定商取引法に基づく表記</span>
          </div>
          <p>© 2025 出会えるエージェントログ</p>
        </footer>
      </div>
    </div>
  );
}
