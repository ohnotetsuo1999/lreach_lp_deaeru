"use client";

import { useEffect, useRef, useState, type TouchEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";

import { MaxWidth } from "@/components/common";

const LP_KEY = "deaeru-lp01d";
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

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [weeklyDiagnosisCount, setWeeklyDiagnosisCount] = useState<number | null>(
    null
  );
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
    try {
      const getWeekKey = () => {
        const now = new Date();
        const year = now.getFullYear();
        const firstDay = new Date(year, 0, 1);
        const pastDaysOfYear = (now.getTime() - firstDay.getTime()) / 86400000;
        const week = Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
        return `${year}-w${week}`;
      };

      const STORAGE_KEY = "deaeru_weeklyDiagnosisCount_v1";
      const currentWeekKey = getWeekKey();

      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          weekKey: string;
          value: number;
        };
        if (parsed.weekKey === currentWeekKey && typeof parsed.value === "number") {
          setWeeklyDiagnosisCount(parsed.value);
          return;
        }
      }

      const min = 350;
      const max = 700;
      const value = Math.floor(Math.random() * (max - min + 1)) + min;

      setWeeklyDiagnosisCount(value);
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ weekKey: currentWeekKey, value })
      );
    } catch (e) {
      if (weeklyDiagnosisCount == null) {
        setWeeklyDiagnosisCount(500);
      }
    }
  }, [weeklyDiagnosisCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

      {/* FV: 画像ベース（LP01d - 診断パターン） */}
      <MaxWidth>
        <div className="relative">
          <img
            className="block w-full"
            src="/deaeru-lp01d-intro.png"
            alt="出会えるエージェント - 今週130人が診断"
          />
          <button
            ref={buttonRef}
            className="touch-manipulation absolute bottom-[7%] left-0 right-0 mx-auto block w-[82%]"
            onClick={handleCtaClick}
            onTouchStart={handleCtaTouchStart}
            onTouchEnd={handleCtaTouchEnd}
          >
            <img
              className="block w-full animate-button-bounce-no-shadow"
              src="/deaeru-lp01d-intro-button.png"
              alt="エージェント診断 START"
            />
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
                <img
                  className="block w-full animate-button-bounce-no-shadow"
                  src="/deaeru-lp01d-intro-button.png"
                  alt="エージェント診断 START"
                />
              </button>
            </div>
          </MaxWidth>
        </div>
      )}

      {/* === FV以降のセクション === */}

      <section className="py-8 md:py-12 bg-gradient-to-br from-[#00C853] via-[#00B54B] to-[#009624] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <div className="space-y-5 md:space-y-7">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                <span className="md:hidden">出会えるエージェント<br />なら</span>
                <span className="hidden md:inline">出会えるエージェントなら</span>
              </h2>
            </div>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg md:text-xl lg:text-2xl text-white font-bold leading-relaxed drop-shadow-md">
                <span className="md:hidden">
                  大手・上場企業から、
                  <br />
                  業界特化の専門エージェントまで。
                  <br />
                  約
                  <span className="text-white text-3xl font-black inline-block mx-2">
                    1,000名
                  </span>
                  の中から、
                  <br />
                  あなたに最適な
                  <br />
                  パートナーに出会える。
                </span>
                <span className="hidden md:inline">
                  大手・上場企業から、業界特化の専門エージェントまで。
                  <br />
                  約
                  <span className="text-white text-4xl font-black inline-block mx-2">
                    1,000名
                  </span>
                  の中から、あなたに最適なパートナーに出会える。
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="problem"
        className="py-4 md:py-24 bg-[#F9FAFB] relative border-t border-gray-100 overflow-hidden"
      >
        <img
          src="/Working-late-bro.svg"
          alt=""
          className="hidden md:block absolute right-0 top-0 w-32 sm:w-40 md:w-48 lg:w-64 xl:w-72 opacity-100 pointer-events-none select-none z-0"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <span className="text-[#00C853] font-bold text-sm tracking-wider uppercase block mb-2">
              Problem
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              転職活動で
              <br className="md:hidden" />
              こんな
              <span className="text-red-500 bg-red-50 px-1">失敗</span>
              していませんか？
            </h2>
          </div>
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
            {[
              {
                num: 1,
                emoji: "📉",
                title: "市場価値を知らない",
                desc: "自分の「本当の市場価値」を知らないまま活動している",
              },
              {
                num: 2,
                emoji: "🔍",
                title: "比較検討不足",
                desc: "複数のエージェントを「比較検討」せず、視野が狭くなっている",
              },
              {
                num: 3,
                emoji: "🏢",
                title: "内情を知らない",
                desc: "企業の「内情」を知らずに応募し、イメージだけで選んでいる",
              },
              {
                num: 4,
                emoji: "🎯",
                title: "対策不足",
                desc: "対策不足のまま「本命企業」に応募し、チャンスを潰している",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                    {item.num}
                  </div>
                  <div className="text-2xl opacity-20 grayscale group-hover:grayscale-0 transition-all">
                    {item.emoji}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="md:hidden px-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  num: 1,
                  emoji: "📉",
                  title: "市場価値を知らない",
                  desc: "自分の「本当の市場価値」を知らないまま活動している",
                },
                {
                  num: 2,
                  emoji: "🔍",
                  title: "比較検討不足",
                  desc: "複数のエージェントを「比較検討」せず、視野が狭くなっている",
                },
                {
                  num: 3,
                  emoji: "🏢",
                  title: "内情を知らない",
                  desc: "企業の「内情」を知らずに応募し、イメージだけで選んでいる",
                },
                {
                  num: 4,
                  emoji: "🎯",
                  title: "対策不足",
                  desc: "対策不足のまま「本命企業」に応募し、チャンスを潰している",
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 bg-red-50 rounded-full flex items-center justify-center text-red-500 font-bold text-xs">
                      {item.num}
                    </div>
                    <div className="text-lg">{item.emoji}</div>
                  </div>
                  <h3 className="font-bold text-xs text-gray-900 mb-1 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-8 md:h-16 bg-white hidden md:block"
          style={{
            clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
          }}
        ></div>
      </section>

      <section id="solution" className="py-8 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-green-50/20 to-white -z-10"></div>
        <img
          src="/Selecting-team-bro.svg"
          alt=""
          className="hidden md:block absolute left-0 top-0 w-32 sm:w-40 md:w-48 lg:w-64 xl:w-72 opacity-100 pointer-events-none select-none z-0"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-8 md:mb-10">
            <span className="text-[#00C853] font-bold text-sm tracking-wider uppercase block mb-2">
              Solution
            </span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              これらの課題、
              <br className="md:hidden" />
              <span className="text-[#00C853]">出会えるエージェント</span>で
              <br />
              すべて解決できます
            </h2>
            <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
              <span className="md:hidden">
                あなたに最適なエージェントとの
                <br />
                出会いが、転職活動のすべてを変えます
              </span>
              <span className="hidden md:inline">
                あなたに最適なエージェントとの出会いが、転職活動のすべてを変えます
              </span>
            </p>
          </div>

          <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                emoji: "📈",
                problem: "市場価値を知らない",
                title: "本当の市場価値がわかる",
                desc: "業界に精通したエージェントが、あなたのスキルや経験を客観的に分析。適正年収や市場での評価を正確に把握できます。",
              },
              {
                emoji: "🔄",
                problem: "比較検討不足",
                title: "最適なエージェントを比較",
                desc: "複数の優秀なエージェントから提案を受けられ、相性や専門性を比較検討。最も信頼できるパートナーを選べます。",
              },
              {
                emoji: "🔓",
                problem: "内情を知らない",
                title: "企業の内情を事前に把握",
                desc: "企業との太いパイプを持つエージェントが、社風・働き方・評価制度など、求人票には載らないリアルな情報を共有。",
              },
              {
                emoji: "🏆",
                problem: "対策不足",
                title: "万全の対策で本命を勝ち取る",
                desc: "書類添削・面接対策・条件交渉まで徹底サポート。本命企業への応募も、十分な準備を整えてから臨めます。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-5 md:p-6 rounded-2xl border border-green-100 relative group hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00C853] rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg shadow-green-200/50">
                    <span className="text-xl">{item.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded line-through">
                        {item.problem}
                      </span>
                      <ArrowRight size={14} className="text-[#00C853]" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden px-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  emoji: "📈",
                  problem: "市場価値を知らない",
                  title: "本当の市場価値がわかる",
                  desc: "業界に精通したエージェントがスキルを客観的に分析",
                },
                {
                  emoji: "🔄",
                  problem: "比較検討不足",
                  title: "最適なエージェントを比較",
                  desc: "複数の優秀なエージェントから提案を受けられる",
                },
                {
                  emoji: "🔓",
                  problem: "内情を知らない",
                  title: "企業の内情を事前に把握",
                  desc: "求人票には載らないリアルな情報を共有",
                },
                {
                  emoji: "🏆",
                  problem: "対策不足",
                  title: "万全の対策で本命を勝ち取る",
                  desc: "書類添削・面接対策・条件交渉まで徹底サポート",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-3 rounded-xl border border-green-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#00C853] rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                      <span className="text-sm">{item.emoji}</span>
                    </div>
                    <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded line-through">
                      {item.problem}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-4 md:py-24 bg-gray-50 border-t border-gray-200 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 max-w-5xl w-[85%] md:w-full relative z-10">
          <div className="text-center mb-8 md:mb-20">
            <h2 className="text-3xl font-bold text-gray-800">
              選ばれる<span className="text-[#00C853]">2つの理由</span>
            </h2>
            <div className="w-16 h-1 bg-[#00C853] mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="space-y-24">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 relative">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform -rotate-2 relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        >
                          {["A", "B", "C"][i]}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-800 font-bold text-sm mb-2">
                    「ユーザー評価が高いエージェントのみ厳選」
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="bg-green-100 text-[#00C853] px-2 py-0.5 rounded-full font-bold">
                      満足度98%以上
                    </span>
                    <span>のエージェントを紹介</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#00C853] rounded-2xl transform rotate-3 opacity-10 translate-y-4 translate-x-4"></div>
              </div>
              <div className="md:w-1/2 relative">
                <img
                  src="/Hired-bro.svg"
                  alt=""
                  className="hidden md:block absolute -top-8 sm:-top-12 md:-top-16 lg:-top-20 xl:-top-24 right-0 md:-right-8 lg:-right-12 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 opacity-100 pointer-events-none select-none z-0"
                  aria-hidden="true"
                />
                <span className="text-[#00C853] font-bold text-6xl opacity-20 font-serif block -mb-4 -ml-2 relative z-10">
                  01
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 relative z-10">
                  「ハズレなし」の
                  <br />
                  エージェント品質
                </h3>
                <p className="text-gray-600 leading-loose mb-6 font-medium relative z-10">
                  独自のユーザーアンケートで
                  <span className="text-gray-900 font-bold">
                    高評価を獲得したエージェントだけ
                  </span>
                  がマッチングに参加できる仕組み。評価が高いほど優先的にユーザーと出会えるため、
                  <span className="text-gray-900 font-bold">
                    エージェント側も本気でサポート
                  </span>
                  します。
                </p>
                <ul className="space-y-3 relative z-10">
                  {[
                    "ユーザー満足度で継続的に評価",
                    "低評価エージェントは自動的に除外",
                    "常に質の高いサポートを約束",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <CheckCircle2 size={18} className="text-[#00C853]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 relative">
              <div className="md:w-1/2 relative">
                <img
                  src="/Online-consulting-bro.svg"
                  alt=""
                  className="hidden md:block absolute -top-24 sm:-top-28 md:-top-32 lg:-top-36 xl:-top-40 left-1/2 -translate-x-1/2 w-32 sm:w-36 md:w-40 lg:w-48 xl:w-56 opacity-100 pointer-events-none select-none z-0"
                  aria-hidden="true"
                />
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform rotate-2 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#06C755] rounded-xl flex items-center justify-center">
                      <MessageCircle size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                        <p className="text-sm text-gray-700 font-medium">
                          年収400万以上で、未経験可の求人を探しています
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Clock size={12} className="text-[#00C853]" />
                    <span>1分後...</span>
                  </div>
                  <div className="bg-green-50 rounded-2xl rounded-tr-none p-3 border border-green-100">
                    <p className="text-sm text-gray-700 font-medium">
                      ✨ あなたにピッタリの3名のエージェントをご紹介します！
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-[#06C755] rounded-2xl transform -rotate-3 opacity-20 translate-y-4 -translate-x-4"></div>
              </div>
              <div className="md:w-1/2">
                <span className="text-[#00C853] font-bold text-6xl opacity-20 font-serif block -mb-4 -ml-2">
                  02
                </span>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  LINEで完結。
                  <br className="hidden md:block" />
                  驚くほど
                  <br className="md:hidden" />
                  「タイパ」がいい
                </h3>
                <p className="text-gray-600 leading-loose mb-6 font-medium">
                  <span className="text-gray-900 font-bold">
                    LINEで希望条件を伝えるだけ
                  </span>
                  で、あなたにマッチしたエージェントをすぐにご紹介。
                  <span className="text-gray-900 font-bold">
                    各日程調整もLINEで完結
                  </span>
                  。「とりあえず話だけ聞きたい」も、
                  <span className="text-gray-900 font-bold">電話1本</span>
                  でOKです。
                </p>
                <ul className="space-y-3">
                  {[
                    "LINEで気軽に相談OK",
                    "電話でも希望をヒアリング",
                    "最短1分でエージェント紹介",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-bold text-gray-700 bg-white p-3 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <CheckCircle2 size={18} className="text-[#00C853]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="usage-flow"
        className="py-4 md:py-24 bg-gradient-to-b from-green-50/50 via-white to-white border-t border-gray-100 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-white rounded-full px-6 py-2 mb-4 border-2 border-[#00C853] shadow-md">
              <p className="text-[#00C853] font-bold text-sm md:text-base">
                自分にぴったりの転職エージェントが見つかる
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              カンタン <span className="text-[#00C853]">3STEP</span>
            </h2>
            <p className="text-xl md:text-2xl font-bold text-gray-700">
              診断の流れ
            </p>
            <div className="w-24 h-1 bg-[#00C853] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-8 md:space-y-12">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-green-100 p-6 md:p-8 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 md:p-8 text-center">
                    <div className="text-5xl md:text-6xl font-extrabold text-[#00C853] mb-2">
                      STEP1
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-green-200">
                      <div className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="text-xs text-gray-500 mb-1 text-left">
                          診断
                        </div>
                        <div className="space-y-2">
                          {["職種", "業種", "経験年数"].map((item) => (
                            <div
                              key={item}
                              className="bg-green-100 rounded px-3 py-2 text-xs font-bold text-gray-700 border border-green-200"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    30秒で終わる質問に答える
                  </h3>
                  <p className="text-gray-600 text-lg md:text-xl font-medium mb-4">
                    あなたに合うエージェントを
                    <br />
                    分析します！
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                    <Clock size={16} className="text-[#00C853]" />
                    <span>所要時間：約30秒</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-green-100 p-6 md:p-8 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 md:p-8 text-center">
                    <div className="text-5xl md:text-6xl font-extrabold text-[#00C853] mb-2">
                      STEP2
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-green-200">
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-xs text-left">
                          <div className="text-gray-400 text-[10px] mb-1">
                            氏名
                          </div>
                          <div className="text-gray-700">山田 太郎</div>
                        </div>
                        <div className="bg-white border border-gray-300 rounded px-3 py-2 text-xs text-left">
                          <div className="text-gray-400 text-[10px] mb-1">
                            電話番号
                          </div>
                          <div className="text-gray-700">090-1234-5678</div>
                        </div>
                        <button className="w-full bg-[#00C853] text-white rounded-lg px-3 py-2 text-xs font-bold mt-2">
                          送信
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    簡単な情報を入力するだけ
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={16} className="text-[#00C853]" />
                    <span>個人情報は厳重に管理されます</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-2 border-green-100 p-6 md:p-8 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 md:p-8 text-center">
                    <div className="text-5xl md:text-6xl font-extrabold text-[#00C853] mb-2">
                      STEP3
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border-2 border-green-200">
                      <div className="bg-gray-900 rounded-lg p-3">
                        <div className="text-white text-xs mb-2 text-left">
                          12:00
                        </div>
                        <div className="bg-[#00C853] rounded-lg p-2 flex items-center gap-2">
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <MessageCircle size={12} className="text-[#00C853]" />
                          </div>
                          <div className="text-white text-[10px] font-bold">
                            診断結果が届いています
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    公式LINEを追加して
                    <br />
                    診断結果を受け取る
                  </h3>
                  <p className="text-gray-600 text-lg md:text-xl font-medium mb-4">
                    あなたにピッタリのエージェントが
                    <br />
                    LINEに届く！
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                    <MessageCircle size={16} className="text-[#00C853]" />
                    <span>LINEで気軽に相談OK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section
        id="faq"
        className="py-4 md:py-24 bg-white border-t border-gray-100 relative overflow-hidden"
      >
        <img
          src="/Online-consulting-bro.svg"
          alt=""
          className="hidden md:block absolute left-0 sm:left-8 md:left-16 lg:left-24 xl:left-32 top-0 w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 opacity-100 pointer-events-none select-none z-0"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <span className="text-[#00C853] font-bold text-sm tracking-wider uppercase block mb-2">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-800">よくある質問</h2>
            <div className="w-16 h-1 bg-[#00C853] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "本当に無料で利用できますか？",
                a: "はい、完全無料です。エージェントマッチングの利用から、エージェントへの相談、転職サポートまで一切費用はかかりません。費用はエージェントが企業側から受け取る成功報酬で賄われるため、求職者の方は安心してご利用いただけます。",
              },
              {
                q: "普通の転職サイトと何が違うのですか？",
                a: "一般的な転職サイトでは自分でエージェントを探す必要がありますが、出会えるエージェントでは「ユーザー評価の高いエージェントだけ」があなたにマッチングされます。ハズレを引くリスクがなく、質の高いサポートを受けられるのが最大の違いです。",
              },
              {
                q: "今すぐ転職する気がなくても大丈夫？",
                a: "もちろん大丈夫です。「まずは自分の市場価値を知りたい」「良い求人があれば考えたい」という方も多くご利用いただいています。無理に転職を勧められることはありませんので、情報収集としてお気軽にご相談ください。",
              },
              {
                q: "エージェントが合わなかった場合は変更できますか？",
                a: "はい、何度でも変更可能です。相性が合わないと感じたら、遠慮なくお申し付けください。別のエージェントを再度マッチングいたします。あなたにピッタリのパートナーが見つかるまでサポートします。",
              },
              {
                q: "紹介されるエージェントはどのように選ばれていますか？",
                a: "実際に利用したユーザーからのアンケート評価をもとに、満足度の高いエージェントのみを厳選しています。低評価が続くエージェントは自動的にマッチング対象から除外されるため、常に質の高いエージェントだけが紹介される仕組みです。",
              },
              {
                q: "どれくらいの時間でエージェントを紹介してもらえますか？",
                a: "LINEまたはお電話で希望条件をお伝えいただければ、最短1分〜数時間以内にあなたに合ったエージェントをご紹介します。お急ぎの場合はお電話でのご相談がおすすめです。",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#00C853] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      Q
                    </span>
                    <span className="font-bold text-gray-800 text-left">
                      {item.q}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform flex-shrink-0 ml-4${openFaqIndex === index ? " rotate-180" : ""}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-4 pt-2 border-t border-gray-200">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-[#00C853] rounded-full flex items-center justify-center text-sm font-bold mt-2">
                        A
                      </span>
                      <p className="text-gray-600 leading-relaxed font-medium pt-2">
                        {item.a}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      <footer className="bg-white border-t border-gray-100 py-12 text-sm">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/deaeru-logo.png"
                  alt="出会えるエージェント"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs leading-loose text-gray-400">
                出会える。いい人に、いい求人に。
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 text-gray-600 font-medium">
              <Link href="https://foresma.jp" className="hover:text-[#00C853] transition-colors">
                運営会社
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-400">
              © 2024 Meetable Agent. All Rights Reserved.
            </p>
            <div className="flex gap-4">
              <div className="w-6 h-6 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"></div>
              <div className="w-6 h-6 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
