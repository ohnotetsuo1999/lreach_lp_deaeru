/**
 * 記事HTML内の最初の .cta-block を検出して前後に分割する。
 */
export function splitHtmlAtFirstCtaBlock(html) {
  if (!html) {
    return { before: "", cta: null, after: null };
  }
  const re = /<div class="cta-block[^"]*"[^>]*>[\s\S]*?<\/div>/;
  const m = html.match(re);
  if (!m || m.index === undefined) {
    return { before: html, cta: null, after: null };
  }
  const idx = m.index;
  return {
    before: html.slice(0, idx),
    cta: m[0],
    after: html.slice(idx + m[0].length),
  };
}

/** 先頭の cta-block 1つを HTML から削除（重複CTA回避） */
export function stripFirstCtaBlock(html) {
  if (!html) return html;
  return html.replace(
    /<div class="cta-block[^"]*"[^>]*>[\s\S]*?<\/div>/,
    ""
  );
}

/**
 * 【CTA】を含む最初の blockquote の直後で分割する。
 * マッチしない場合は after: null
 */
export function splitHtmlAfterCtaBlockquote(html) {
  if (!html) {
    return { before: "", after: null };
  }
  let searchStart = 0;
  while (true) {
    const open = html.indexOf("<blockquote", searchStart);
    if (open === -1) break;
    const close = html.indexOf("</blockquote>", open);
    if (close === -1) break;
    const closeEnd = close + "</blockquote>".length;
    const inner = html.slice(open, closeEnd);
    if (inner.includes("【CTA】")) {
      return {
        before: html.slice(0, closeEnd),
        after: html.slice(closeEnd),
      };
    }
    searchStart = closeEnd;
  }
  return { before: html, after: null };
}

/**
 * About セクション挿入位置を決定（全記事共通ルール）
 * 1) 【CTA】を含む最初の blockquote の直後（その手前の本文内に cta-block があれば除去）
 * 2) それ以外は最初の cta-block の位置（cta は描画しない）
 */
export function resolveAboutInsertion(html) {
  if (!html) {
    return { before: "", after: null, mode: "none" };
  }
  const bq = splitHtmlAfterCtaBlockquote(html);
  if (bq.after !== null) {
    return {
      before: stripFirstCtaBlock(bq.before),
      after: bq.after,
      mode: "blockquote",
    };
  }
  const cta = splitHtmlAtFirstCtaBlock(html);
  if (cta.cta) {
    return {
      before: cta.before,
      after: cta.after,
      mode: "cta",
    };
  }
  return { before: html, after: null, mode: "none" };
}
