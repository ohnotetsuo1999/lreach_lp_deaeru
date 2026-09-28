import fs from "fs";
import { join } from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const articlesDir = join(process.cwd(), "content", "deaeru-articles");
const configPath = join(articlesDir, "articles.json");

let _config = null;

function getConfig() {
  if (!_config) {
    const raw = fs.readFileSync(configPath, "utf8");
    _config = JSON.parse(raw);
  }
  return _config;
}

function findMarkdownFile(articleId) {
  const paddedId = String(articleId).padStart(2, "0");
  const files = fs.readdirSync(articlesDir);
  const match = files.find(
    (f) => f.startsWith(`article_${paddedId}_`) && f.endsWith(".md")
  );
  return match || null;
}

function estimateReadTime(text) {
  const charCount = text.replace(/[<][^>]*[>]/g, "").length;
  const minutes = Math.max(1, Math.round(charCount / 600));
  return `${minutes}分`;
}

/** 本文冒頭からメタ description / JSON-LD 用（120〜155文字目安） */
function buildSeoDescription(raw, meta) {
  const fallback = `${meta.mainKW}について徹底解説。${meta.title}`;
  let body = raw
    .replace(/^#[^\n]+\n*/m, "")
    .replace(/<div[^>]*class="toc-block"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`#>\[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const fromContent = body.slice(0, 155);
  const base =
    fromContent.length >= 50 ? fromContent : fallback.slice(0, 155);
  if (base.length <= 155) return base;
  return `${base.slice(0, 152)}…`;
}

/**
 * 公開日: 2026年2月1日〜3月23日の範囲で、記事IDから決定的に疑似ランダムに割り当て（本日3/24より前）
 */
function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getPublishedDateForArticleId(id) {
  const rng = mulberry32((Number(id) || 0) * 2654435761 + 1234567);
  const u = rng();
  // 2026-02-01 〜 2026-03-23 まで（51日分）
  const dayOffset = Math.floor(u * 51);
  const d = new Date(Date.UTC(2026, 1, 1));
  d.setUTCDate(d.getUTCDate() + dayOffset);
  return d.toISOString().slice(0, 10);
}

export function getDeaeruArticleSlugs() {
  const config = getConfig();
  return config.articles.map((a) => a.slug);
}

export function getDeaeruArticleBySlug(slug) {
  const config = getConfig();
  const meta = config.articles.find((a) => a.slug === slug);
  if (!meta) return null;

  const filename = findMarkdownFile(meta.id);
  if (!filename) return null;

  const fullPath = join(articlesDir, filename);
  const raw = fs.readFileSync(fullPath, "utf8");

  const siloInfo = config.silos.find((s) => s.id === meta.siloId);
  const excerpt = `${meta.mainKW}について徹底解説。${meta.title}`;
  const seoDescription = meta.metaDescription || buildSeoDescription(raw, meta);

  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    excerpt,
    seoDescription,
    date: getPublishedDateForArticleId(meta.id),
    readTime: estimateReadTime(raw),
    category: siloInfo?.slug || "agent-guide",
    categoryName: siloInfo?.name || "転職エージェント",
    coverImage: `https://deaeru-agent.jp/ogp/article${String(meta.id).padStart(3, "0")}.png`,
    mainKW: meta.mainKW,
    subKW: meta.subKW || [],
    siloId: meta.siloId,
    isPillar: meta.isPillar,
    internalLinks: meta.internalLinks || [],
    ctaMid: meta.ctaMid,
    ctaEnd: meta.ctaEnd,
    schemaTypes: meta.schemaTypes || ["Article", "BreadcrumbList"],
    content: raw,
  };
}

function transformFaqBlocks(html) {
  let result = html.replace(
    /<p><strong>(Q\.[^<]+)<\/strong><\/p>\s*<p>(A\.[^<]+)<\/p>/g,
    (_, q, a) =>
      `<div class="faq-item"><div class="faq-question"><span class="faq-q">Q</span>${q.replace(/^Q\.\s*/, "")}</div><div class="faq-answer"><span class="faq-a">A</span>${a.replace(/^A\.\s*/, "")}</div></div>`
  );
  result = result.replace(
    /<h3>Q\d*[.:：\s]\s*([^<]+)<\/h3>\s*<p>([\s\S]*?)<\/p>/g,
    (_, q, rawA) => {
      const a = rawA.replace(/<\/?strong>/g, "").replace(/^A\d*[.:：]?\s*/, "").trim();
      if (!a) return `<h3>${q}</h3>`;
      return `<div class="faq-item"><div class="faq-question"><span class="faq-q">Q</span>${q.trim()}</div><div class="faq-answer"><span class="faq-a">A</span>${a}</div></div>`;
    }
  );
  return result;
}

function transformStepBlocks(html) {
  return html.replace(
    /<div\s+data-step-number="(\d+)"\s+data-step-title="([^"]*)"\s+class="step-block">([\s\S]*?)<\/div>/g,
    (_, num, title, body) => {
      const cleanBody = body.replace(/<\/?p>/g, "").trim();
      return `<div class="step-block"><div class="step-number">${num}</div><div class="step-content"><h4>${title}</h4><p>${cleanBody}</p></div></div>`;
    }
  );
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** expert 吹き出し：プレースホルダー名を公式2行表記と揃える */
const DEFAULT_EXPERT_SPEAKER =
  "出会えるエージェント公式キャリアコンサルタント";

function normalizeExpertSpeakerName(speaker) {
  const s = (speaker || "").trim();
  if (!s) return DEFAULT_EXPERT_SPEAKER;
  if (/^(専門家|監修者?|アドバイザー)$/.test(s)) {
    return DEFAULT_EXPERT_SPEAKER;
  }
  return s;
}

/** user 吹き出し：記事テーマが誤って名前に付いた接頭辞を除去 */
function normalizeUserSpeakerName(speaker) {
  let s = (speaker || "").trim();
  if (!s) return s;
  // 「市場価値Jさん」→「Jさん」（英字イニシャル名の前のみ）
  s = s.replace(/^市場価値(?=[A-Za-zＡ-Ｚ])/, "");
  return s;
}

function transformSpeechBubbles(html) {
  return html.replace(
    /<div\s+([^>]*\bclass="speech-bubble"[^>]*)\s*>\s*([\s\S]*?)\s*<\/div>/g,
    (full, attrs, body) => {
      const speakerMatch = attrs.match(/data-speaker="([^"]*)"/);
      const typeMatch = attrs.match(/data-bubble-type="([^"]*)"/);
      if (!speakerMatch || !typeMatch) return full;

      let speaker = speakerMatch[1];
      const type = typeMatch[1];
      if (type === "expert") {
        speaker = normalizeExpertSpeakerName(speaker);
      } else if (type === "user") {
        speaker = normalizeUserSpeakerName(speaker);
      }
      const cleanBody = body.replace(/<\/?p>/g, "").trim();
      const modifier = type === "user" ? " speech-bubble--user" : "";

      // アドバイザーカード：expert は全記事で同一UI（バッジ文言・レイアウトは transform で統一）
      const isAdvisorExpertCard = type === "expert";

      if (isAdvisorExpertCard) {
        // 「出会えるエージェント公式キャリアコンサルタント」を2行に分割
        let nameLine1 = "";
        let nameLine2 = "";
        if (speaker.includes("公式")) {
          const parts = speaker.split("公式");
          nameLine1 = parts[0] || "";
          nameLine2 = parts[1] || "";
        } else {
          // 「公式」がない場合は元の文字列をそのまま使用
          nameLine1 = speaker;
        }
        const escapedLine1 = escapeHtml(nameLine1);
        const escapedLine2 = escapeHtml(nameLine2);
        const nameHtml = nameLine2 
          ? `<div class="speech-bubble-advisor-name-line1">${escapedLine1}</div><div class="speech-bubble-advisor-name-line2">${escapedLine2}</div>`
          : `<div class="speech-bubble-advisor-name-line1">${escapedLine1}</div>`;
        return `<div class="speech-bubble speech-bubble--advisor${modifier}"><div class="speech-bubble-advisor-inner"><div class="speech-bubble-advisor-left"><div class="speech-bubble-avatar" aria-hidden="true"><img src="/advisor-career-illustration.png" alt="キャリアアドバイザー" width="400" height="400" loading="lazy" decoding="async" /></div><div class="speech-bubble-advisor-name">${nameHtml}</div></div><div class="speech-bubble-advisor-content"><div class="speech-bubble-advisor-badge" role="note" aria-label="キャリアコンサルタントが伝える、プロ目線"><span class="speech-bubble-advisor-badge__lead">キャリアコンサルタントが伝える、</span><span class="speech-bubble-advisor-badge__accent">プロ目線</span></div><div class="speech-bubble-text">${cleanBody}</div></div></div></div>`;
      }

      if (type === "user") {
        let nameHtml = escapeHtml(speaker);
        const match = speaker.match(/^(.*?)（(.*?)）$/);
        if (match) {
          const heading = escapeHtml(match[1]);
          const inner = match[2];
          const parts = inner.split("・");
          let lineAgeGender = "";
          let lineJob = "";
          if (parts.length >= 3) {
            lineAgeGender = escapeHtml(`${parts[0]}・${parts[1]}`);
            lineJob = escapeHtml(parts.slice(2).join("・"));
          } else if (parts.length === 2) {
            lineAgeGender = escapeHtml(parts[0]);
            lineJob = escapeHtml(parts[1]);
          } else if (parts.length === 1) {
            lineAgeGender = escapeHtml(parts[0]);
          }
          const metaBlock =
            lineJob !== ""
              ? `<span class="speech-bubble-user-meta"><span class="speech-bubble-user-meta-line1">${lineAgeGender}</span><span class="speech-bubble-user-meta-line2">${lineJob}</span></span>`
              : `<span class="speech-bubble-user-meta"><span class="speech-bubble-user-meta-line1">${lineAgeGender}</span></span>`;
          nameHtml = `<span class="speech-bubble-user-name-heading">${heading}</span>${metaBlock}`;
        }
        return `<div class="speech-bubble speech-bubble--user-card"><div class="speech-bubble-user-inner"><div class="speech-bubble-user-left"><div class="speech-bubble-avatar" aria-hidden="true"><img src="/user-jobseeker-illustration.png" alt="転職者の声" width="400" height="400" loading="lazy" decoding="async" /></div><div class="speech-bubble-user-name">${nameHtml}</div></div><div class="speech-bubble-user-content"><div class="speech-bubble-tail"></div><div class="speech-bubble-text">${cleanBody}</div></div></div></div>`;
      }

      const escapedSpeaker = escapeHtml(speaker);
      return `<div class="speech-bubble${modifier}"><div class="speech-bubble-meta">${escapedSpeaker}</div><div class="speech-bubble-text">${cleanBody}</div></div>`;
    }
  );
}

function transformCalloutBoxes(html) {
  return html.replace(
    /<div\s+data-callout-type="([^"]*)"\s+class="callout-box">([\s\S]*?)<\/div>/g,
    (_, type, body) => {
      let inner = body.trim();
      inner = inner.replace(
        /^(?:<p>)?\s*<strong>([^<]+)<\/strong>\s*(?:<\/p>)?/,
        '<div class="callout-box-title">$1</div>'
      );
      const listItems = [];
      inner = inner.replace(/(?:^|\n)\s*[-•]\s+(.+)/g, (__, item) => {
        listItems.push(item.trim());
        return "";
      });
      if (listItems.length > 0) {
        inner +=
          '<ul class="callout-list">' +
          listItems.map((li) => `<li>${li}</li>`).join("") +
          "</ul>";
      }
      const className =
        type === "warning" ? "callout-box-warning" : "callout-box";
      return `<div class="${className}">${inner}</div>`;
    }
  );
}

function transformSourceBlocks(html) {
  html = html.replace(
    /<div\s+([^>]*\bclass="source-block"[^>]*)\s*>([\s\S]*?)<\/div>/g,
    (full, attrs, body) => {
      const srcMatch = attrs.match(/data-source="([^"]*)"/);
      if (!srcMatch) return full;
      const source = srcMatch[1];
      const urlMatch = attrs.match(/data-source-url="([^"]*)"/);
      const cleanBody = body.replace(/<\/?p>/g, "").trim();
      if (urlMatch && urlMatch[1]) {
        const url = urlMatch[1];
        return `<div class="source-block"><span class="source-label">出典: <a href="${url}" target="_blank" rel="noopener noreferrer">${source}</a></span>${cleanBody}</div>`;
      }
      return `<div class="source-block"><span class="source-label">出典: ${source}</span>${cleanBody}</div>`;
    }
  );
  return html;
}

/** 診断LP（記事CTAのデフォルト遷移先） */
const DEFAULT_DEAERU_CTA_LP =
  "https://deaeru-agent.jp/deaeru/lp03z/default/?utm_source=deaeru-magazine&utm_medium=article&utm_campaign=inline-cta";

function normalizeDeaeruCtaUrl(url) {
  const u = (url || "").trim();
  if (!u || u === "https://deaeru-agent.jp/" || u === "https://deaeru-agent.jp") {
    return DEFAULT_DEAERU_CTA_LP;
  }
  return u;
}

function buildCtaBlockHtml(text, style, href) {
  const isPrimary = style === "primary";
  const heading = isPrimary
    ? "無料でエージェント診断"
    : "あなたに合うエージェントを見つけよう";
  const positionAttr = isPrimary ? "block-primary" : "block-secondary";
  return `<div class="cta-block ${isPrimary ? "cta-primary" : "cta-secondary"}"><p class="cta-block-title">${heading}</p><a href="${href}" data-gtm-event="media_cta_click" data-cta-position="${positionAttr}" data-cta-style="${style}">${text} →</a></div>`;
}

function transformCtaBlocks(html) {
  let out = html.replace(
    /<div\s+data-cta-text="([^"]*)"\s+data-cta-url="([^"]*)"\s+data-cta-style="([^"]*)"\s+class="cta-block"><\/div>/g,
    (_, text, url, style) =>
      buildCtaBlockHtml(text, style, normalizeDeaeruCtaUrl(url))
  );
  out = out.replace(
    /<div\s+data-cta-text="([^"]*)"\s+data-cta-style="([^"]*)"\s+class="cta-block"><\/div>/g,
    (_, text, style) => buildCtaBlockHtml(text, style, DEFAULT_DEAERU_CTA_LP)
  );
  return out;
}

/* ------------------------------------------------------------------ */
/*  blockquote 自動分類・変換                                          */
/* ------------------------------------------------------------------ */

const CONTENT_BQ_RE =
  /回答例|例文|言い換え例|記載例|インセンティブとは|ポートフォリオとは|約束】|データ】|逆質問集|（[PREP]）/;

const CTA_LABEL_RE =
  /^(?:【(?:最終)?CTA】|(?:最終)?CTA[：:\s]|(?:最終)?CTA$|▼)/;

const ADVISOR_LABEL_RE =
  /専門家コメント|キャリアコンサルタント|キャリアアドバイザー|現役エージェント|出会えるエージェント.*アドバイザー|E-E-A-T|アドバイザー['']s EYE/;

const USER_LABEL_RE = /利用者の声|転職成功者の声|コラム）】/;

function buildInlineCtaHtml() {
  return `<div class="deaeru-inline-cta"><span class="deaeru-inline-cta-label">あなたに合うエージェントを見つけよう</span><a href="${DEFAULT_DEAERU_CTA_LP}" class="deaeru-inline-cta-btn" data-gtm-event="media_cta_click" data-cta-position="inline">無料で診断する →</a></div>`;
}

function buildAdvisorBubbleFromBq(body) {
  const clean = body
    .replace(/<\/?p>/g, " ")
    .replace(/<\/?blockquote>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  return (
    '<div class="speech-bubble speech-bubble--advisor">' +
    '<div class="speech-bubble-advisor-inner">' +
    '<div class="speech-bubble-advisor-left">' +
    '<div class="speech-bubble-avatar" aria-hidden="true">' +
    '<img src="/advisor-career-illustration.png" alt="キャリアアドバイザー" width="400" height="400" loading="lazy" decoding="async" />' +
    "</div>" +
    '<div class="speech-bubble-advisor-name">' +
    '<div class="speech-bubble-advisor-name-line1">出会えるエージェント</div>' +
    '<div class="speech-bubble-advisor-name-line2">キャリアコンサルタント</div>' +
    "</div></div>" +
    '<div class="speech-bubble-advisor-content">' +
    '<div class="speech-bubble-advisor-badge" role="note" aria-label="キャリアコンサルタントが伝える、プロ目線">' +
    '<span class="speech-bubble-advisor-badge__lead">キャリアコンサルタントが伝える、</span>' +
    '<span class="speech-bubble-advisor-badge__accent">プロ目線</span>' +
    "</div>" +
    `<div class="speech-bubble-text">${clean}</div>` +
    "</div></div></div>"
  );
}

function buildUserBubbleFromBq(label, body) {
  const clean = body
    .replace(/<\/?p>/g, " ")
    .replace(/<\/?blockquote>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[「『""]\s*/, "")
    .replace(/\s*[」』""]$/, "");
  if (!clean) return "";

  let nameHtml = escapeHtml(label);
  const m = label.match(/(?:利用者の声|転職成功者の声)[（(]([^）)]*)[）)]/);
  if (m) {
    const info = m[1];
    const parts = info.split("・");
    let metaLine1 = "";
    let metaLine2 = "";
    if (parts.length >= 3) {
      metaLine1 = escapeHtml(`${parts[0]}・${parts[1]}`);
      metaLine2 = escapeHtml(parts.slice(2).join("・"));
    } else if (parts.length === 2) {
      metaLine1 = escapeHtml(parts[0]);
      metaLine2 = escapeHtml(parts[1]);
    } else {
      metaLine1 = escapeHtml(parts[0]);
    }
    const heading = /転職成功者/.test(label) ? "転職成功者の声" : "利用者の声";
    const metaBlock =
      metaLine2 !== ""
        ? `<span class="speech-bubble-user-meta"><span class="speech-bubble-user-meta-line1">${metaLine1}</span><span class="speech-bubble-user-meta-line2">${metaLine2}</span></span>`
        : `<span class="speech-bubble-user-meta"><span class="speech-bubble-user-meta-line1">${metaLine1}</span></span>`;
    nameHtml = `<span class="speech-bubble-user-name-heading">${escapeHtml(heading)}</span>${metaBlock}`;
  }

  return (
    '<div class="speech-bubble speech-bubble--user-card">' +
    '<div class="speech-bubble-user-inner">' +
    '<div class="speech-bubble-user-left">' +
    '<div class="speech-bubble-avatar" aria-hidden="true">' +
    '<img src="/user-jobseeker-illustration.png" alt="転職者の声" width="400" height="400" loading="lazy" decoding="async" />' +
    "</div>" +
    `<div class="speech-bubble-user-name">${nameHtml}</div>` +
    "</div>" +
    '<div class="speech-bubble-user-content">' +
    '<div class="speech-bubble-tail"></div>' +
    `<div class="speech-bubble-text">${clean}</div>` +
    "</div></div></div>"
  );
}

function stripBqLabel(inner, labelRe) {
  let out = inner.replace(
    /<p>\s*<strong>([^<]*)<\/strong>\s*<\/p>/g,
    (match, text) => (labelRe.test(text) ? "" : match)
  );
  out = out.replace(/<strong>([^<]*)<\/strong>\s*/g, (match, text) =>
    labelRe.test(text) ? "" : match
  );
  return out;
}

function transformBlockquotes(html) {
  return html.replace(
    /<blockquote>\n?([\s\S]*?)\n?<\/blockquote>/g,
    (full, inner) => {
      const plainText = inner
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (CONTENT_BQ_RE.test(plainText)) return full;

      const firstStrongMatch = inner.match(/<strong>([^<]*)<\/strong>/);
      const firstStrong = firstStrongMatch ? firstStrongMatch[1] : "";

      if (
        CTA_LABEL_RE.test(firstStrong) ||
        CTA_LABEL_RE.test(plainText) ||
        /▼今すぐLINE|▼.*無料/.test(plainText)
      ) {
        return buildInlineCtaHtml();
      }

      if (ADVISOR_LABEL_RE.test(firstStrong)) {
        const body = stripBqLabel(inner, ADVISOR_LABEL_RE);
        const trimmed = body.replace(/<[^>]+>/g, "").trim();
        if (!trimmed) return buildInlineCtaHtml();
        return buildAdvisorBubbleFromBq(body);
      }

      if (USER_LABEL_RE.test(firstStrong)) {
        const label = firstStrong.replace(/【|】/g, "").trim();
        const body = stripBqLabel(inner, USER_LABEL_RE);
        return buildUserBubbleFromBq(label, body);
      }

      if (
        /出会えるエージェント/.test(plainText) &&
        !/約束|データ|調べ/.test(plainText) &&
        plainText.length < 250
      ) {
        return buildInlineCtaHtml();
      }

      if (
        plainText.length < 250 &&
        /まずはLINEで|LINEで(?:簡単|完結|気軽|.*無料|.*診断|.*相談)/.test(
          plainText
        ) &&
        !ADVISOR_LABEL_RE.test(plainText)
      ) {
        return buildInlineCtaHtml();
      }

      return full;
    }
  );
}

/* ------------------------------------------------------------------ */
/*  ＞＞ インラインCTAリンク変換                                       */
/* ------------------------------------------------------------------ */

const BARE_BRACKET_CTA_RE =
  /LINE|無料|相談|診断|登録|エージェント|キャリア|出会える/;

function transformInlineCtaLinks(html) {
  html = html.replace(
    /<p>\s*(?:<strong>)?\s*(?:<a[^>]*>)?\s*(?:\[)?＞＞[\s\S]*?(?:\])?\s*(?:<\/a>)?\s*(?:<\/strong>)?\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  // ▼...▼ standalone CTA-like paragraphs
  html = html.replace(
    /<p>\s*(?:<strong>)?\s*▼[\s\S]*?▼\s*(?:<\/strong>)?\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  html = html.replace(
    /<p>\s*<strong>\[([^\]]*)\]\(https?:\/\/deaeru-agent\.jp[^)]*\)<\/strong>\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  html = html.replace(
    /<p>\s*\[([^\]]*)\]\(https?:\/\/deaeru-agent\.jp[^)]*\)\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  html = html.replace(
    /<p>\s*<strong><a\s+href="https?:\/\/deaeru-agent\.jp[^"]*"[^>]*>[^<]*<\/a><\/strong>\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  html = html.replace(
    /<p>\s*<a\s+href="https?:\/\/deaeru-agent\.jp[^"]*"[^>]*>[^<]*<\/a>\s*<\/p>/g,
    () => buildInlineCtaHtml()
  );

  // [text]() — empty-URL markdown links rendered as <a href="">
  html = html.replace(
    /<p>\s*(?:<strong>)?\s*<a\s+href=""[^>]*>([^<]*)<\/a>\s*(?:<\/strong>)?\s*<\/p>/g,
    (_, text) => (BARE_BRACKET_CTA_RE.test(text) ? buildInlineCtaHtml() : `<p>${text}</p>`)
  );

  // [text] — bare brackets that remark leaves as literal text (no URL)
  html = html.replace(
    /<p>\s*(?:<strong>)?\s*\[([^\]]{4,})\]\s*(?:<\/strong>)?\s*<\/p>/g,
    (full, text) => (BARE_BRACKET_CTA_RE.test(text) ? buildInlineCtaHtml() : full)
  );

  // > [text]() or > [text] inside blockquote (already converted to <blockquote><p>...)
  html = html.replace(
    /<blockquote>\s*<p>\s*(?:<code>)?\s*\[([^\]]*)\](?:\([^)]*\))?\s*(?:<\/code>)?\s*<\/p>\s*<\/blockquote>/g,
    (full, text) => (BARE_BRACKET_CTA_RE.test(text) ? buildInlineCtaHtml() : full)
  );

  html = html.replace(
    /(<h[2-4][^>]*>)([\s\S]*?)【(?:最終)?CTA】([\s\S]*?)(<\/h[2-4]>)/g,
    "$1$2$3$4"
  );

  return html;
}

let _kebabToSlugMap = null;

function getKebabSlugMap() {
  if (_kebabToSlugMap) return _kebabToSlugMap;
  _kebabToSlugMap = {};
  const files = fs.readdirSync(articlesDir);
  for (const f of files) {
    const m = f.match(/^article_(\d+)_(.+)\.md$/);
    if (m) {
      const id = parseInt(m[1], 10);
      const kebab = m[2];
      _kebabToSlugMap[kebab] = `article${String(id).padStart(3, "0")}`;
    }
  }
  return _kebabToSlugMap;
}

function transformRelatedLinks(html) {
  const map = getKebabSlugMap();
  return html.replace(
    /<div\s+([^>]*\bclass="related-link"[^>]*)\s*>\s*<\/div>/g,
    (full, attrs) => {
      const slugMatch = attrs.match(/data-related-slug="([^"]*)"/);
      const titleMatch = attrs.match(/data-related-title="([^"]*)"/);
      if (!slugMatch || !titleMatch) return full;
      const slug = slugMatch[1];
      const title = titleMatch[1];
      const resolved = map[slug] || slug;
      const safeTitle = escapeHtml(title);
      return `<div class="related-link"><a href="/media/${resolved}/">関連記事：${safeTitle}</a></div>`;
    }
  );
}

function transformTocBlock(html) {
  return html.replace(
    /<div\s+class="toc-block"\s+data-toc="auto"><\/div>/g,
    ""
  );
}

/* ------------------------------------------------------------------ */
/*  CTA 重複除去 & 数量制限                                            */
/* ------------------------------------------------------------------ */

const CTA_ELEMENT_RE =
  /<div class="(?:cta-block[^"]*|deaeru-inline-cta)"[\s\S]*?<\/div>/g;

function deduplicateAndCapCtas(html) {
  const matches = [];
  let m;
  while ((m = CTA_ELEMENT_RE.exec(html)) !== null) {
    matches.push({ idx: m.index, end: m.index + m[0].length, text: m[0] });
  }
  if (matches.length === 0) return html;

  const toRemove = new Set();

  for (let i = 1; i < matches.length; i++) {
    const between = html
      .slice(matches[i - 1].end, matches[i].idx)
      .replace(/<[^>]+>/g, "")
      .trim();
    if (between.length < 80) {
      const isFirstInline = matches[i - 1].text.includes("deaeru-inline-cta");
      const isSecondInline = matches[i].text.includes("deaeru-inline-cta");
      if (isFirstInline) {
        toRemove.add(i - 1);
      } else if (isSecondInline) {
        toRemove.add(i);
      } else {
        toRemove.add(i);
      }
    }
  }

  let inlineCount = 0;
  const MAX_INLINE = 2;
  for (let i = 0; i < matches.length; i++) {
    if (toRemove.has(i)) continue;
    if (matches[i].text.includes("deaeru-inline-cta")) {
      inlineCount++;
      if (inlineCount > MAX_INLINE) {
        toRemove.add(i);
      }
    }
  }

  if (toRemove.size === 0) return html;

  const sorted = [...toRemove].sort((a, b) => matches[b].idx - matches[a].idx);
  let out = html;
  for (const ri of sorted) {
    const { idx, end } = matches[ri];
    out = out.slice(0, idx) + out.slice(end);
  }
  return out;
}

export async function getDeaeruPostHtml(content) {
  // 記事ページ側でタイトル(H1)を描画しているため、Markdown先頭H1は重複を避けて除去する
  const withoutLeadingH1 = content.replace(/^#\s+.+\n+/m, "");
  const preprocessed = withoutLeadingH1.replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>"
  );
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(preprocessed);
  let html = result.toString();
  html = transformTocBlock(html);
  html = transformFaqBlocks(html);
  html = transformStepBlocks(html);
  html = transformSpeechBubbles(html);
  html = transformBlockquotes(html);
  html = transformCalloutBoxes(html);
  html = transformSourceBlocks(html);
  html = transformCtaBlocks(html);
  html = transformInlineCtaLinks(html);
  html = transformRelatedLinks(html);
  html = deduplicateAndCapCtas(html);
  return html;
}

export function getAllDeaeruArticles() {
  const config = getConfig();
  return config.articles
    .map((meta) => {
      const filename = findMarkdownFile(meta.id);
      if (!filename) return null;
      const fullPath = join(articlesDir, filename);
      const raw = fs.readFileSync(fullPath, "utf8");
      const siloInfo = config.silos.find((s) => s.id === meta.siloId);
      return {
        id: meta.id,
        slug: meta.slug,
        title: meta.title,
        excerpt: `${meta.mainKW}について徹底解説。${meta.title}`,
        date: getPublishedDateForArticleId(meta.id),
        readTime: estimateReadTime(raw),
        category: siloInfo?.slug || "agent-guide",
        categoryName: siloInfo?.name || "転職エージェント",
        coverImage: `https://deaeru-agent.jp/ogp/article${String(meta.id).padStart(3, "0")}.png`,
        mainKW: meta.mainKW,
        siloId: meta.siloId,
        isPillar: meta.isPillar,
        phase: meta.phase,
      };
    })
    .filter(Boolean);
}

export function getRelatedDeaeruArticles(currentSlug, category, count = 3) {
  return getAllDeaeruArticles()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, count);
}

export function getDeaeruSilos() {
  return getConfig().silos;
}
