"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

// ▼▼▼ 設定エリア（lp97a: encolor → lp99bf） ▼▼▼
const SITE_CONFIG = {
  CTA_BASE_URL: "https://deaeru-agent.jp/deaeru/lp99bf/",
};
// ▲▲▲ 設定エリアここまで ▲▲▲

// 画像アセット（順番に表示）
const ARTICLE_IMAGES = [
  { src: "/deaeru_like_note_lp_1.png", alt: "" },
  { src: "/deaeru_like_note_lp_2.png", alt: "" },
  { src: "/deaeru_like_note_lp_3.png", alt: "" },
  { src: "/deaeru_like_note_lp_4.png", alt: "" },
  { src: "/deaeru_like_note_lp_5.png", alt: "" },
];
const CTA_BUTTON_IMAGE = "/deaeru_like_note_lp_CTA_button_new.png";

// 日付フォーマット関数（行動分析ログ用）
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * CTAボタン（画像 + 拍動アニメーション）
 * - 画像を表示しつつ scale で拍動させる
 * - href で本LPに遷移、クリック計測コールバックを呼ぶ
 * - overlapClass で「直上の画像にどれだけ被せるか」を指定（負のマージン）
 *   - 例: "-mt-12" (48px), "-mt-32" (128px)
 *   - Tailwind の JIT が拾えるように完全クラス名で渡すこと
 */
const CtaButton = ({
  href,
  onClick,
  overlapClass = "-mt-12",
}: {
  href: string;
  onClick?: () => void;
  overlapClass?: string;
}) => (
  <div className={`relative w-full ${overlapClass} group z-10`}>
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
      .animate-pulse-scale {
        animation: pulse-scale 1.5s ease-in-out infinite;
      }
    `}</style>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      role="button"
      onClick={onClick}
      className="block w-full animate-pulse-scale active:translate-y-1 transition-transform duration-150"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CTA_BUTTON_IMAGE}
        alt="無料面談を予約する"
        className="block w-full h-auto"
      />
    </a>
  </div>
);

// メインコンポーネント
export default function ArticleLP() {
  const params = useParams();
  const id = params?.id || "001";
  const ctaUrl = `${SITE_CONFIG.CTA_BASE_URL}${id}`;

  // 行動分析用のstate
  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState("");
  const [isCta1Clicked, setIsCta1Clicked] = useState(false);
  const [isCta2Clicked, setIsCta2Clicked] = useState(false);

  // 行動分析用のref
  const startTimeRef = useRef<number>(Date.now());
  const scrollYRef = useRef<number>(0);
  const maxScrollYRef = useRef<number>(0);

  const getStayingTime = (): number => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  const calculateScrollRate = (): number => {
    if (maxScrollYRef.current === 0) return 0;
    return Math.round((scrollYRef.current / maxScrollYRef.current) * 100);
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date()));
  }, []);

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

  const hasSentRef = useRef(false);

  useEffect(() => {
    const sendData = () => {
      if (hasSentRef.current) return;
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
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendData();
    };

    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  const handleCta1Click = () => setIsCta1Clicked(true);
  const handleCta2Click = () => setIsCta2Clicked(true);

  return (
    <div className="font-sans text-gray-800 bg-[#f9f9f9] min-h-screen pb-12">
      <div className="max-w-lg mx-auto bg-white shadow-xl min-h-screen">
        <main>
          {ARTICLE_IMAGES.map((img, idx) => (
            <React.Fragment key={img.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                // 3枚目（idx===2）はCTA①と文字が近くなりがちなので上に少し余白
                className={`block w-full h-auto ${idx === 2 ? "mt-4" : ""}`}
              />
              {/* 2枚目の画像の下に1つ目のCTA（軽く被せる: -mt-12 ≈ 48px） */}
              {idx === 1 && (
                <div className="px-5" onClick={handleCta1Click}>
                  <CtaButton
                    href={ctaUrl}
                    onClick={handleCta1Click}
                    overlapClass="-mt-8"
                  />
                </div>
              )}
              {/* 5枚目（最後）の画像の下に2つ目のCTA（しっかり上に: -mt-32 ≈ 128px） */}
              {idx === ARTICLE_IMAGES.length - 1 && (
                <div className="px-5 pb-6" onClick={handleCta2Click}>
                  <CtaButton
                    href={ctaUrl}
                    onClick={handleCta2Click}
                    overlapClass="-mt-32"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </main>

        <footer className="text-center text-xs text-gray-400 py-8 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-center gap-4 mb-2 mt-2">
            <span>プライバシーポリシー</span>
            <span>特定商取引法に基づく表記</span>
          </div>
          <p>© 2026 出会えるエージェントログ</p>
        </footer>
      </div>
    </div>
  );
}
