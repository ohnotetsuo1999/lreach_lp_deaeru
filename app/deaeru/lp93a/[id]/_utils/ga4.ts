"use client";

/**
 * lp93a（出会えるエージェント本LP）専用 GA4 計測ユーティリティ
 *
 * 緒方ASP向けの依頼により、記事LP→本LP遷移後のフロー
 *   ①本LP表示 ②フォーム送信ボタン押下 ③送信成功 ④LINE導線への自動遷移
 * を GA4（G-0QL09NJ8ZS）へ計測する。
 *
 * GA4 本体（gtag.js のロードと config）は @next/third-parties の
 * <GoogleAnalytics gaId="G-0QL09NJ8ZS" />（[id]/layout.tsx で設置）が担う。
 * このアプリはルート layout の GTM と dataLayer を共有しており、自前 gtag('config') を
 * 後乗せすると measurement が起動せず collect が飛ばなかったため、公式コンポーネントに集約した。
 * イベント送信は公式の sendGAEvent を使う（初期化済みの同一 dataLayer に乗るため確実に送信される）。
 *
 * 方針:
 *  - 依頼パラメータは「URLにあればその値、なければ送らない（空）」を原則とする。
 *  - session_id / sid は URL になければブラウザ側で生成し localStorage に保持する。
 *  - lp_code は URL になければパス（/deaeru/lp93a/<lp_code>/）から取得する。
 *  - thanks ページには URL パラメータが引き継がれないため、本LPで集めたパラメータを
 *    localStorage に退避し、thanks 側で復元してイベントに付与する。
 *  - フォーム送信・自動遷移時はイベント欠損を防ぐため transport_type: 'beacon' を使う。
 */

import { sendGAEvent } from "@next/third-parties/google";

export const GA4_MEASUREMENT_ID = "G-0QL09NJ8ZS";

const SESSION_ID_STORAGE_KEY = "deaeru_lp93a_session_id";
const GA4_PARAMS_STORAGE_KEY = "deaeru_lp93a_ga4_params";

/** GA4 イベント名 */
export const GA4_EVENTS = {
  CLIENT_LP_VIEW: "deaeru_client_lp_view",
  FINAL_REGISTER_CLICK: "deaeru_final_register_click",
  FINAL_REGISTER_SUBMIT_SUCCESS: "deaeru_final_register_submit_success",
  LINE_GATEWAY_REDIRECT: "deaeru_line_gateway_redirect",
} as const;

/** 依頼でカスタムディメンション登録対象になっている、URLから取得するパラメータ群 */
const URL_PARAM_KEYS = [
  "source_lp",
  "article_key",
  "lp_code",
  "cr_id",
  "cr_name",
  "header_variant",
  "header_version",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "twclid",
  "cta_id",
  "cta_position",
  "cta_label",
] as const;

export type Ga4EventParams = Record<string, string>;

/** ランダムな session_id を生成する（crypto があれば UUID、なければ簡易フォールバック） */
function generateSessionId(): string {
  try {
    const c = (window as Window & { crypto?: Crypto }).crypto;
    if (c && typeof c.randomUUID === "function") {
      return c.randomUUID();
    }
  } catch {
    // crypto が使えない環境ではフォールバックへ
  }
  return `sid-${Date.now().toString(36)}-${Math.round(
    performance.now() * 1000
  ).toString(36)}`;
}

/**
 * session_id を取得する。
 * 優先順: URLの session_id → URLの sid → localStorage → 新規生成（localStorageへ保持）
 */
function resolveSessionId(urlParams: URLSearchParams): string {
  const fromUrl = urlParams.get("session_id") || urlParams.get("sid");
  if (fromUrl) {
    try {
      window.localStorage.setItem(SESSION_ID_STORAGE_KEY, fromUrl);
    } catch {
      // 保存できなくても値は返す
    }
    return fromUrl;
  }

  try {
    const stored = window.localStorage.getItem(SESSION_ID_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // localStorage 不可
  }

  const generated = generateSessionId();
  try {
    window.localStorage.setItem(SESSION_ID_STORAGE_KEY, generated);
  } catch {
    // 保存不可でも生成値を返す
  }
  return generated;
}

/**
 * lp_code を取得する。
 * 優先順: URLの lp_code → パス /deaeru/lp93a/<lp_code>/ の該当セグメント
 */
function resolveLpCode(urlParams: URLSearchParams, pathname: string): string {
  const fromUrl = urlParams.get("lp_code");
  if (fromUrl) return fromUrl;

  // /deaeru/lp93a/001/ や /deaeru/lp93a/001/thanks の <lp_code> を取り出す
  const match = pathname.match(/\/deaeru\/lp93a\/([^/]+)/);
  return match?.[1] ?? "";
}

/**
 * 本LP（client lp）側で、URL・パスから依頼パラメータを収集する。
 * 収集結果は localStorage にも退避し、thanks ページで復元できるようにする。
 * 空文字のパラメータは GA4 へ送らない（依頼方針: URLにあれば送る・なければ空）。
 */
export function collectClientLpParams(): Ga4EventParams {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const params: Ga4EventParams = {};

  // URL にあるものだけ採用（空は載せない）
  for (const key of URL_PARAM_KEYS) {
    const value = urlParams.get(key);
    if (value) params[key] = value;
  }

  // session_id / sid（生成フォールバックあり）
  const sessionId = resolveSessionId(urlParams);
  params.session_id = sessionId;
  const sid = urlParams.get("sid");
  if (sid) params.sid = sid;

  // lp_code（パスからのフォールバックあり）
  const lpCode = resolveLpCode(urlParams, window.location.pathname);
  if (lpCode) params.lp_code = lpCode;

  // source_lp は依頼上 URL 由来だが、未指定時も本LP自体を識別できるよう補完しない
  // （依頼方針「URLにあれば送る・なければ空」に忠実に従う）。

  // 実URL系（自明な値はコード側で補完）
  params.client_lp_url = window.location.href;

  // thanks へ引き継ぐため localStorage に退避
  try {
    window.localStorage.setItem(GA4_PARAMS_STORAGE_KEY, JSON.stringify(params));
  } catch {
    // 退避できなくても本LP側の計測は成立する
  }

  return params;
}

/**
 * thanks ページ側で、本LPが退避したパラメータを localStorage から復元する。
 * thanks 自身の URL に来ているパラメータ（sid 等）があれば上書き優先する。
 */
export function restoreParamsForThanks(): Ga4EventParams {
  if (typeof window === "undefined") return {};

  let params: Ga4EventParams = {};
  try {
    const raw = window.localStorage.getItem(GA4_PARAMS_STORAGE_KEY);
    if (raw) params = JSON.parse(raw) as Ga4EventParams;
  } catch {
    params = {};
  }

  const urlParams = new URLSearchParams(window.location.search);

  // thanks の URL に来ている値で補強（sid / session_id / lp_code 等）
  const sessionId = resolveSessionId(urlParams);
  params.session_id = sessionId;
  const sid = urlParams.get("sid");
  if (sid) params.sid = sid;

  const lpCode = resolveLpCode(urlParams, window.location.pathname);
  if (lpCode) params.lp_code = lpCode;

  // 本LP→thanks の遷移時に getRedirectUrl が付与する識別子を拾う
  // （クエリ名は lpSessionsId / usersId / sid）
  const lpSessionsId = urlParams.get("lpSessionsId");
  if (lpSessionsId) params.lp_sessions_id = lpSessionsId;
  const usersId = urlParams.get("usersId");
  if (usersId) params.users_id = usersId;

  // thanks の実URLを補完
  params.thanks_url = window.location.href;

  return params;
}

/**
 * GA4 へイベントを送る。空文字パラメータは除去する。
 * 送信は @next/third-parties の sendGAEvent を使う（GoogleAnalytics が初期化した
 * dataLayer に積むため measurement が確実に処理し collect が送信される）。
 * transport_type:'beacon' / event_callback もパラメータとして渡せる。
 * 遷移系イベント（onComplete 指定）では、event_callback が来ない環境に備え、
 * 呼び出し側で必ずフォールバックタイマーによる遷移を併用すること。
 */
export function sendGa4Event(
  eventName: string,
  params: Ga4EventParams,
  options?: { useBeacon?: boolean; onComplete?: () => void }
): void {
  if (typeof window === "undefined") return;

  const cleanParams: Ga4EventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value !== undefined && value !== null) {
      cleanParams[key] = value;
    }
  }

  const eventParams: Record<string, unknown> = { ...cleanParams };

  if (options?.useBeacon) {
    eventParams.transport_type = "beacon";
  }

  let didCallback = false;
  if (options?.onComplete) {
    eventParams.event_callback = () => {
      if (didCallback) return;
      didCallback = true;
      options.onComplete?.();
    };
  }

  sendGAEvent("event", eventName, eventParams);
}
