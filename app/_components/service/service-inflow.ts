/**
 * サービスページ（deaeru-agent.jp/）の流入パラメータと lp_key の取り決め。
 *
 * 記事サイト側は次のどちらかの形でリンクを付ける。
 *   (a) `https://deaeru-agent.jp/<媒体>-<番号>/`（例: /note-001/）
 *       - 媒体: 半角英小文字のみ（数字・ハイフン不可。`lp` 始まりと既存ページ名は不可）
 *       - 番号: 半角数字 3 桁
 *   (b) `https://deaeru-agent.jp/<番号>/`（例: /001/）… 媒体名なし。内部では「top 媒体の番号」として扱う（2026-09-21 追加）
 * サービスページはこれを「媒体・番号」に読み替え、
 *   - lp_key:            (a) deaeru-note-001 / (b) deaeru-top-001 / `/` 直は deaeru-top
 *   - LINE へ渡す流入元: (a) https://deaeru-agent.jp/deaeru/note/001/ / (b) .../deaeru/top/001/ / `/` 直は .../deaeru/top/
 * として扱う。同じ記事に (a) と (b) を混在させると別の lp_key に分かれるので、記事ごとにどちらかへ統一してもらう。流入元 URL をこの形に正規化するのは、新基盤（lreach-line）の lp_key 生成と
 * 旧基盤（bot / hub）の LP コード抽出が「/deaeru/<コード>/<id>/」を前提にしているため。
 *
 * 旧基盤側の対応: apps/lreach_bot/lib/line-webhook/follow/lp-routing.ts（isServicePageLpKey）と
 * apps/lreach_hub/src/lib/line-webhook/new-platform-lp-codes.ts に同じ規則を置き、
 * `lp` で始まらない媒体コードを「サービスページ経由＝新基盤配信」と判定する。
 */

export const SERVICE_PAGE_BASE_URL = "https://deaeru-agent.jp";

/** 番号なし（`/` 直）のときの媒体コード */
export const SERVICE_PAGE_TOP_MEDIA = "top";

/** URL 末尾パラメータ（"note-001"）の形式 */
const SERVICE_PARAM_PATTERN = /^([a-z]+)-(\d{3})$/;
/** URL 末尾パラメータが番号だけ（"001"）の形式。媒体は top 扱い */
const SERVICE_NUMBER_ONLY_PATTERN = /^(\d{3})$/;

export interface ServiceInflow {
  /** 媒体コード（"note" / "top"） */
  media: string;
  /** 番号（"001"）。`/` 直は null */
  num: string | null;
}

/** URL 末尾パラメータをサービスページの流入情報として解釈する。形式外なら null（配信リンク等の別ルート） */
export function parseServicePageParam(param: string | undefined | null): ServiceInflow | null {
  if (!param) return null;
  const numberOnly = param.match(SERVICE_NUMBER_ONLY_PATTERN);
  if (numberOnly) return { media: SERVICE_PAGE_TOP_MEDIA, num: numberOnly[1] };
  const m = param.match(SERVICE_PARAM_PATTERN);
  if (!m) return null;
  const media = m[1];
  // `lp` 始まりは既存 LP コードと衝突するため媒体名として認めない
  if (media.startsWith("lp")) return null;
  return { media, num: m[2] };
}

export const SERVICE_PAGE_TOP_INFLOW: ServiceInflow = { media: SERVICE_PAGE_TOP_MEDIA, num: null };

/** 行動集計・DB に記録する lp_key（deaeru-note-001 / deaeru-top） */
export function buildServiceLpKey(inflow: ServiceInflow): string {
  return inflow.num ? `deaeru-${inflow.media}-${inflow.num}` : `deaeru-${inflow.media}`;
}

/** LINE（LIFF）へ lpUrl として渡す正規化 URL（https://deaeru-agent.jp/deaeru/note/001/） */
export function buildServiceCanonicalLpUrl(inflow: ServiceInflow): string {
  return inflow.num
    ? `${SERVICE_PAGE_BASE_URL}/deaeru/${inflow.media}/${inflow.num}/`
    : `${SERVICE_PAGE_BASE_URL}/deaeru/${inflow.media}/`;
}

// ▼▼▼ 設定エリア（CTA の遷移先 LINE/LIFF リンク） ▼▼▼
// サービスページ用 linkId（新基盤 lreach-line 発行・2026-09-18 受領）。
// LIFF ID（2008193428-jBcEHiff）と to（e8f0d2d9-...）は lp08/lp10 系共通を流用、linkId のみ固有。
// この linkId に紐づく follow トリガーで lp10 系と同じ「リストマーケ診断シナリオ」が新基盤側から配信される。
export const SERVICE_PAGE_CTA_URL =
  "https://liff.line.me/2008193428-jBcEHiff?linkId=296f292a-4338-40df-8ba1-7aba94be5865&to=e8f0d2d9-b9be-4055-8758-e6443e23b8be";
// ▲▲▲ 設定エリアここまで ▲▲▲
