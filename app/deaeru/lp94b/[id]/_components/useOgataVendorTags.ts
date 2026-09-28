"use client";

/*
 * lp94b 先方（緒方）支給タグのReact移植（2026-08-21）。
 * 元実装: 支給物 xpixel.js / track.js（2026-08-20版・静的2ページ前提）。
 * 発火条件・送信内容は元実装を変えず、SPA構成（1ルート内で intro/form 切替）に読み替えた:
 *   - 「register.html のページ読み込み」→「form 画面への切替」
 *   - body の data-track-page 属性 → view 状態から算出
 *
 * 【X Pixel（xpixel.js 移植）】URL の CRコードでアカウントを出し分け:
 *   - yui系 CR（例 yui024-2）→ 新アカ re139: 表示=tw-re139-re13b / CTAクリック=tw-re139-re13f
 *   - 数字CR（例 049-2）・CR無し → 旧アカ rcrwm: 表示イベントなし（Site visits自動計上）/ CTAクリック=tw-rcrwm-rczka
 *   イベントコードは先方指示どおり（2026-08-21 ユーザー確認済み。既存LPのコードとは別の新コード）。
 *   ※ 旧アカ rcrwm の凍結状況は先方から完了後に説明を受ける（発火自体は指示どおり実装）
 *   CTAクリックは1人1回のみ送信（元実装の sent フラグ相当）。
 *
 * 【2026-09-10 追加依頼（修正依頼一覧・3ページ共通）】切り替え式は残したまま、次を追加:
 *   - 本LP表示: tw-re139-re13b を CR に関係なく常時（従来は yui 系のみ）＋ 新アカ rexm3 の tw-rexm3-rexm4
 *   - LINEボタンクリック: 従来の rcrx1 / re13a に加え tw-rexm3-rexm9。1ページ表示につき1回（依頼「二重発火を防ぐ」）
 *   - rexm3 を config に追加
 *   - 「プレビューへは発火させない」: X は本番ドメイン（deaeru-agent.jp / lp.lreach.jp）以外では
 *     ローダーを読み込まず、イベントも送らない（ヒートマップは従来どおり）
 *
 * 【ヒートマップ（track.js 移植）】先方独自の行動計測。PIIなし:
 *   - yui系 CR → https://work-shift.xyz/deaeru-agent/heatmap_collect.php
 *   - それ以外 → https://career-deaeru.xyz/deaeru-agent/heatmap_collect.php
 *   イベント: 画面表示 / スクロール深度(25/50/75/100・画面ごとにリセット) / CTAクリック /
 *             フォームSTEP表示(survey_answer) / 送信完了(survey_result)
 */

import { useCallback, useEffect, useRef } from "react";

import {
  OGATA_X_EVENTS,
  isOgataProductionHost,
} from "@/app/deaeru/_shared/ogata/ogataXTags";

type TwqFn = (...args: unknown[]) => void;

interface WindowWithTwq extends Window {
  twq?: TwqFn & { exe?: TwqFn; queue?: unknown[]; version?: string };
}

interface HeatmapExtra {
  [key: string]: string | number;
}

/* 元実装と同じ正規表現で URL パスから CR コードを抽出する */
function extractCr(pathname: string): string {
  const m = pathname.match(/\/(yui\d{3}|\d{3,4})(?:-\d+)?\//) || [];
  return m[1] || "";
}

/* 元実装 track.js と同じセッションID（sessionStorage 'lp94b_sid'） */
function getHeatmapSessionId(): string {
  try {
    const key = "lp94b_sid";
    let v = sessionStorage.getItem(key);
    if (!v) {
      v =
        "s" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(key, v);
    }
    return v;
  } catch {
    return "na";
  }
}

interface UseOgataVendorTagsParams {
  /* 現在の画面。intro=訴求（旧index.html相当）/ form=フォーム（旧register.html相当） */
  view: "intro" | "form";
}

interface UseOgataVendorTagsResult {
  /* CTAクリック計測（X: 1人1回 / ヒートマップ: 毎回）。訴求CTA・フォーム最終ボタンのクリック時に呼ぶ */
  fireCtaClick: (ctaId: string, elementText: string) => void;
  /* LINE遷移ボタン（フォーム最終送信ボタン）クリック時のXイベント（2026-08-28 追加依頼）。
     CR に関わらず両アカウントへ送る。lp93a の fireXConversionEvent と同一イベントコード */
  fireLineRegisterClick: () => void;
  /* フォームSTEP表示計測（旧register.js の survey_answer 相当） */
  fireSurveyAnswer: (step: number) => void;
  /* 送信完了計測（旧register.js の survey_result 相当） */
  fireSurveyResult: () => void;
}

export function useOgataVendorTags({
  view,
}: UseOgataVendorTagsParams): UseOgataVendorTagsResult {
  const crRef = useRef<string>("");
  const isYuiRef = useRef<boolean>(false);
  const xCtaSentRef = useRef<boolean>(false);
  /* 2026-09-10: 本LP表示イベント（re13b / rexm4）と LINEボタンクリック（rcrx1 / re13a / rexm9）の1回限りガード */
  const xViewSentRef = useRef<boolean>(false);
  const xLineClickSentRef = useRef<boolean>(false);
  const startedRef = useRef<number>(Date.now());
  const scrollDepthsRef = useRef<Record<number, boolean>>({});
  /* 旧2ページ構成の data-track-page 相当（index=訴求 / register=フォーム）。表示計測時に更新 */
  const pageSuffixRef = useRef<"index" | "register">("index");

  /* ── ヒートマップ送信（track.js の send() 移植） ── */
  const sendHeatmap = useCallback((ev: string, extra?: HeatmapExtra) => {
    if (typeof window === "undefined") return;
    const cr = crRef.current;
    const isYui = isYuiRef.current;
    const endpoint = isYui
      ? "https://work-shift.xyz/deaeru-agent/heatmap_collect.php"
      : "https://career-deaeru.xyz/deaeru-agent/heatmap_collect.php";
    // data-track-page 相当（deaeru_d1_lp94b_index / deaeru_d1_lp94b_register）
    // は呼び出し時点の view から算出できないため、body 属性の代わりに
    // 最後に表示計測した画面名を pageSuffixRef で保持している
    const base = `deaeru_d1_lp94b_${pageSuffixRef.current}`;
    const key = cr
      ? `deaeru_${isYui ? "yui" : "d1"}_lp94b_${cr}_${pageSuffixRef.current}`
      : base;
    const sid = getHeatmapSessionId();
    const d = document.documentElement;
    const body = JSON.stringify({
      event_id:
        sid +
        "_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 8),
      event: ev,
      page: key,
      lp_code: "lp94b",
      cr_id: cr || "",
      path: location.pathname,
      url: location.href.slice(0, 280),
      viewport_w: innerWidth || 0,
      viewport_h: innerHeight || 0,
      doc_h: Math.max(d.scrollHeight || 0, document.body.scrollHeight || 0),
      scroll_y: scrollY || 0,
      time_on_page_sec: Math.max(
        0,
        Math.round((Date.now() - startedRef.current) / 1000)
      ),
      session_id: sid,
      source: "deaeru_lp94b_tracking",
      source_lp: key,
      ...(extra || {}),
    });
    try {
      if (
        navigator.sendBeacon &&
        navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" })
        )
      )
        return;
    } catch {
      /* fallthrough */
    }
    try {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "omit",
      }).catch(() => {});
    } catch {
      /* noop */
    }
  }, []);

  /* ── 初期化: CR判定 + X Pixel base(config) 読み込み ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const cr = extractCr(location.pathname);
    crRef.current = cr;
    isYuiRef.current = /^yui/i.test(cr);

    // 2026-09-10: X は本番ドメイン以外では読み込まない（依頼「プレビューへは発火させない」）。
    // twq が定義されないため、以降の twq?.() はすべて no-op になる
    if (!isOgataProductionHost()) return;

    // X Pixel ローダー（xpixel.js の uwt.js bootstrap 移植）
    const w = window as WindowWithTwq;
    if (!w.twq) {
      const s: TwqFn & { exe?: TwqFn; queue?: unknown[]; version?: string } = (
        ...args: unknown[]
      ) => {
        if (s.exe) {
          s.exe(...args);
        } else {
          s.queue?.push(args);
        }
      };
      s.version = "1.1";
      s.queue = [];
      w.twq = s;
      const u = document.createElement("script");
      u.async = true;
      u.src = "https://static.ads-twitter.com/uwt.js";
      const a = document.getElementsByTagName("script")[0];
      a?.parentNode?.insertBefore(u, a);
    }
    const pix = isYuiRef.current ? "re139" : "rcrwm";
    w.twq?.("config", pix);
    // 2026-08-28 追加依頼（緒方・LINE追加計測）: CR別出し分けに加えて、
    // もう片方のアカウントも常時 config する（既存タグの削除・変更はせず追加のみ）。
    // 結果として rcrwm / re139 の両方が全ページで config される
    w.twq?.("config", isYuiRef.current ? "rcrwm" : "re139");
    // 2026-09-10 追加依頼: 新Xアカウント rexm3 も config
    w.twq?.("config", "rexm3");
  }, []);

  /* ── 画面表示イベント（元実装は「ページ読み込みごと」。SPAでは view 切替ごとに読み替え） ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    pageSuffixRef.current = view === "intro" ? "index" : "register";
    // スクロール深度は画面（旧ページ）単位でリセット（元実装のページ読み込みごと初期化に対応）
    scrollDepthsRef.current = {};

    // ヒートマップ: 画面表示
    sendHeatmap("deaeru_article_lp_view", {});

    // X Pixel: 本LP表示イベント。
    // 2026-09-10 依頼で「re13b は CR に関係なく常時」「新アカ rexm4 も併設」「1回発火」に変更
    // （従来は yui 系 CR のときだけ re13b を view 切替ごとに送っていた）。
    if (view === "intro" && !xViewSentRef.current) {
      xViewSentRef.current = true;
      const w = window as WindowWithTwq;
      w.twq?.("event", OGATA_X_EVENTS.view.current, {
        lp_code: "lp94b",
        cr_id: crRef.current,
      });
      w.twq?.("event", OGATA_X_EVENTS.view.latest, {
        lp_code: "lp94b",
        cr_id: crRef.current,
      });
    }
  }, [view, sendHeatmap]);

  /* ── スクロール深度（track.js の scroll_depth 移植） ── */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const d = document.documentElement;
      const h =
        Math.max(d.scrollHeight, document.body.scrollHeight) - innerHeight;
      if (h <= 0) return;
      const p = Math.round((scrollY / h) * 100);
      [25, 50, 75, 100].forEach((mark) => {
        if (p >= mark && !scrollDepthsRef.current[mark]) {
          scrollDepthsRef.current[mark] = true;
          sendHeatmap("scroll_depth", { scroll_depth: mark });
        }
      });
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [sendHeatmap]);

  /* ── CTAクリック（X: sent-once / ヒートマップ: 毎回） ── */
  const fireCtaClick = useCallback(
    (ctaId: string, elementText: string) => {
      sendHeatmap("cta_click", {
        cta_id: ctaId,
        element_text: elementText.slice(0, 60),
      });

      if (!xCtaSentRef.current) {
        xCtaSentRef.current = true;
        const w = window as WindowWithTwq;
        const evCta = isYuiRef.current ? "tw-re139-re13f" : "tw-rcrwm-rczka";
        w.twq?.("event", evCta, {
          lp_code: "lp94b",
          cr_id: crRef.current,
          cta_id: ctaId,
        });
      }
    },
    [sendHeatmap]
  );

  /* ── LINE遷移ボタン（フォーム最終送信ボタン）クリック時のXイベント（2026-08-28 追加依頼）──
     既存のCR別CTAイベント（tw-re139-re13f / tw-rcrwm-rczka）は変更せず、これに加えて
     両アカウントの LINE追加計測イベントを送る。
     2026-09-10 依頼: 新アカ rexm3（tw-rexm3-rexm9）を追加し、「クリック時に1回発火・二重発火を防ぐ」に合わせて
     1ページ表示につき1回に変更（従来は毎クリック） */
  const fireLineRegisterClick = useCallback(() => {
    if (xLineClickSentRef.current) return;
    xLineClickSentRef.current = true;
    const w = window as WindowWithTwq;
    w.twq?.("event", OGATA_X_EVENTS.lineClick.legacy, {});
    // 緒方 既存Xアカウント（re139）- LINEボタンクリック
    w.twq?.("event", OGATA_X_EVENTS.lineClick.current, {});
    // 緒方 新Xアカウント（rexm3）- LINEボタンクリック（2026-09-10 追加）
    w.twq?.("event", OGATA_X_EVENTS.lineClick.latest, {});
  }, []);

  const fireSurveyAnswer = useCallback(
    (step: number) => {
      sendHeatmap("survey_answer", {
        step,
        answer_key: `lp94b_step${step}`,
      });
    },
    [sendHeatmap]
  );

  const fireSurveyResult = useCallback(() => {
    sendHeatmap("survey_result", { result_key: "lp94b_complete" });
  }, [sendHeatmap]);

  return { fireCtaClick, fireLineRegisterClick, fireSurveyAnswer, fireSurveyResult };
}
