"use client";

/*
 * 緒方ASP 向け X（Twitter）コンバージョン計測タグ 共通部品（2026-09-10）
 *
 * 対象: lp93b / lp94c（新規）。lp94b は先方支給 xpixel.js 移植（useOgataVendorTags）が
 *       既にあるため、そちらに同じイベントを追加している（切り替え式は残置・2026-09-10 ユーザー判断）。
 *
 * X アカウント（緒方）:
 *   rcrwm = 旧アカウント（BAN後・残置。2026-09-10 依頼には登場しないが既存LPに合わせて残す）
 *   re139 = 既存アカウント（2026-07-22〜）
 *   rexm3 = 新アカウント（2026-09-10 依頼で追加）
 *
 * 発火設計（2026-09-08 版 依頼スプシ「修正依頼一覧」・3ページ共通）:
 *   - 本LP表示: tw-re139-re13b / tw-rexm3-rexm4（各1回・LP表示時）
 *   - LINEボタンクリック（フォーム最終送信ボタン「LINEで診断結果を受け取る」）:
 *       tw-rcrwm-rcrx1（既存踏襲）/ tw-re139-re13a / tw-rexm3-rexm9（各1回・1人1回）
 *   - thanks: config のみ（イベント発火なし。既存 lp93a / lp94b thanks と同じ）
 *
 * 「プレビューへは発火させない」（依頼スプシ注記）:
 *   本番ドメイン（deaeru-agent.jp / lp.lreach.jp）以外では base の読込ごと行わない。
 *   ローカル / -dev.vercel.app / Vercel Preview では twq が定義されず、イベントも送られない。
 *
 * 発火保証: base（uwt.js ローダー）はキュー機構付きで、ローダー実行後なら uwt.js ロード前でも
 *   イベントは失われない。ローダー実行前（afterInteractive 未実行）に React 側からクリックが来た場合は
 *   保留フラグ（__ogataXLineClickPending）を立て、base スクリプト末尾で送る。
 */

import Script from "next/script";

export const OGATA_X_ACCOUNTS = {
  legacy: "rcrwm",
  current: "re139",
  latest: "rexm3",
} as const;

export const OGATA_X_EVENTS = {
  view: {
    current: "tw-re139-re13b",
    latest: "tw-rexm3-rexm4",
  },
  lineClick: {
    legacy: "tw-rcrwm-rcrx1",
    current: "tw-re139-re13a",
    latest: "tw-rexm3-rexm9",
  },
} as const;

/** X イベントを実際に送ってよい本番ホスト。graxis 等の入稿リンクは lp.lreach.jp に着地するため両方含める */
export const OGATA_PRODUCTION_HOSTS = [
  "deaeru-agent.jp",
  "www.deaeru-agent.jp",
  "lp.lreach.jp",
] as const;

export function isOgataProductionHost(hostname?: string): boolean {
  const host = hostname ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return (OGATA_PRODUCTION_HOSTS as readonly string[]).includes(host);
}

type TwqFn = (command: string, id: string, params?: Record<string, unknown>) => void;

interface WindowWithOgataX extends Window {
  twq?: TwqFn;
  __ogataXLineClickPending?: boolean;
  __ogataXLineClickSent?: boolean;
}

const HOST_CHECK_JS = `[${OGATA_PRODUCTION_HOSTS.map((h) => `'${h}'`).join(",")}].indexOf(location.hostname)>-1`;

const LINE_CLICK_EVENTS_JS = `
  twq('event','${OGATA_X_EVENTS.lineClick.legacy}',{});
  twq('event','${OGATA_X_EVENTS.lineClick.current}',{});
  twq('event','${OGATA_X_EVENTS.lineClick.latest}',{});`;

interface OgataXPixelScriptProps {
  /** lp: base＋config＋本LP表示イベント / thanks: base＋config のみ */
  page: "lp" | "thanks";
  /** Script id（ページ内で一意に） */
  scriptId?: string;
}

/**
 * X base（uwt.js ローダー）＋ 3アカウントの config（＋本LP表示イベント）を1つの Script で設置する。
 * 同一スクリプト内で順序が確定するため、config → event の実行順が保証される。
 */
export function OgataXPixelScript({ page, scriptId = "deaeru-x-pixel-ogata" }: OgataXPixelScriptProps) {
  const viewEventsJs =
    page === "lp"
      ? `
/* 本LP表示（各1回） */
twq('event','${OGATA_X_EVENTS.view.current}',{});
twq('event','${OGATA_X_EVENTS.view.latest}',{});
/* base 実行前に LINEボタンが押された場合の保留クリックイベントを送る */
if (window.__ogataXLineClickPending) {${LINE_CLICK_EVENTS_JS}
  window.__ogataXLineClickPending = false;
}`
      : "";

  return (
    <Script id={scriptId} strategy="afterInteractive">{`
/* X (Twitter) コンバージョン計測 - 緒方ASP向け（rcrwm=旧 / re139=既存 / rexm3=新・2026-09-10追加）
   本番ドメイン以外（ローカル・develop・Preview）では読み込まない（依頼「プレビューへは発火させない」） */
if (${HOST_CHECK_JS}) {
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','${OGATA_X_ACCOUNTS.legacy}');
twq('config','${OGATA_X_ACCOUNTS.current}');
twq('config','${OGATA_X_ACCOUNTS.latest}');${viewEventsJs}
}
    `}</Script>
  );
}

/**
 * LINE遷移ボタン（フォーム最終送信ボタン）クリック時の X イベント。1ページ表示につき1回だけ送る。
 * 本番ドメイン以外では何もしない。twq 未定義（base 未実行）なら保留し、base 末尾で送る。
 */
export function fireOgataXLineButtonClick(): void {
  if (typeof window === "undefined") return;
  if (!isOgataProductionHost()) return;
  const w = window as WindowWithOgataX;
  if (w.__ogataXLineClickSent) return;
  w.__ogataXLineClickSent = true;

  if (typeof w.twq === "function") {
    w.twq("event", OGATA_X_EVENTS.lineClick.legacy, {});
    w.twq("event", OGATA_X_EVENTS.lineClick.current, {});
    w.twq("event", OGATA_X_EVENTS.lineClick.latest, {});
  } else {
    w.__ogataXLineClickPending = true;
  }
}
