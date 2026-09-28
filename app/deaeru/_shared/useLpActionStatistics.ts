"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * LP行動集計シートへの行動計測ビーコン（共有フック）。
 *
 * 🚨 全LP（本LP・記事LP問わず）で必ず組み込むこと 🚨
 * これが無いLPは「LP行動集計シート」に一切記録されず、閲覧数・滞在時間・CTA率の
 * 集計対象から漏れる（lp09系・lp11系で実装漏れが発覚した 2026-07-24 の再発防止）。
 * 新規LP作成時のチェックリスト: .claude/docs/guides/新規LP作成チェックリスト.md
 *
 * 送信内容: lp_key / 流入日時 / 閲覧URL / 滞在時間(秒) / スクロール量・率 / CTAクリック有無
 * 送信先:   /api/spreadsheet/gt/action-statistics（ページ離脱時に sendBeacon で1回だけ）
 *
 * 使い方:
 *   const { markCtaClicked } = useLpActionStatistics("deaeru-lp11a");
 *   // CTAのクリックハンドラで markCtaClicked() を呼ぶ（is_cta_1_submitted に反映される）
 */
export function useLpActionStatistics(lpKey: string) {
  const startTimeRef = useRef<number>(Date.now());
  const scrollYRef = useRef<number>(0);
  const maxScrollYRef = useRef<number>(0);
  const isCtaClickedRef = useRef<boolean>(false);
  const hasSentRef = useRef<boolean>(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const inflowDatetime = formatDate(new Date());
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      maxScrollYRef.current =
        document.documentElement.scrollHeight - window.innerHeight;
    };

    const sendData = () => {
      if (hasSentRef.current) return; // 重複送信防止（pagehide と visibilitychange の両方から呼ばれるため）
      hasSentRef.current = true;

      const stayingTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const scrollRate =
        maxScrollYRef.current === 0
          ? 0
          : Math.round((scrollYRef.current / maxScrollYRef.current) * 100);

      const blob = new Blob(
        [
          JSON.stringify({
            lp_key: lpKey,
            inflow_datetime: inflowDatetime,
            current_url: currentUrl,
            staying_time: stayingTime,
            intro_scroll_y: scrollYRef.current,
            intro_scroll_rate: `${scrollRate}%`,
            is_cta_1_submitted: isCtaClickedRef.current,
            is_cta_2_submitted: false,
            is_cta_3_submitted: false,
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/spreadsheet/gt/action-statistics", blob);
    };

    const handlePagehide = () => sendData();
    // iOS Safari 対応: pagehide が飛ばないケースがあるため visibilitychange も併用
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendData();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lpKey]);

  /** CTAクリックを記録する（クリックハンドラから呼ぶ） */
  const markCtaClicked = useCallback(() => {
    isCtaClickedRef.current = true;
  }, []);

  return { markCtaClicked };
}

/** "YYYY-MM-DD HH:mm:ss" 形式（既存LPの inflow_datetime と同形式） */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
