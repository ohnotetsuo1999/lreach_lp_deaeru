import assert from "node:assert/strict";
import test from "node:test";

import { renderPublishedPage, renderTags } from "../../scripts/lp/render.mjs";

const design =
  "<!doctype html><html><head><title>Test</title></head><body>{{LREACH_FORM}}</body></html>";
const tags = [
  { name: "GTM", provider: "gtm", tag_identifier: "GTM-TEST12" },
  { name: "Meta", provider: "meta", tag_identifier: "1234567890" },
  {
    name: "TikTok",
    provider: "tiktok",
    tag_identifier: "D9OMD5BC77U1C011Q3MG",
  },
  {
    name: "Google",
    provider: "google_ads",
    tag_identifier: "AW-12345678",
    config: { conversionLabel: "label12" },
  },
  {
    name: "Other",
    provider: "custom",
    config: { html: "<script>window.customPixel=true</script>" },
  },
];
test("新LPは独自LPキーを維持しフォーム必須項目・成功時通知を生成", () => {
  const page = renderPublishedPage(
    { design, tags, code: "lp100a", title: "<新しいLP>" },
    "meta"
  );
  assert.match(page, /deaeru-lp100a-meta/);
  assert.match(page, /&lt;新しいLP&gt;/);
  assert.match(page, /name="phone_number"/);
  assert.match(page, /\/api\/lp\/v1\/submissions\//);
  assert.doesNotMatch(page, /connect.facebook.net/);
  assert.doesNotMatch(page, /customPixel/);
});
test("公開時だけ選択した計測タグを出力。Meta/TikTokの送信先を固定", () => {
  const page = renderPublishedPage(
    { design, tags, code: "lp100a", title: "LP" },
    "meta",
    {
      tracking: true,
    }
  );
  assert.match(page, /connect.facebook.net/);
  assert.match(page, /trackSingle/);
  assert.match(page, /analytics.tiktok.com/);
  assert.match(page, /instance\(tag.tag_identifier\)/);
  assert.match(page, /AW-12345678/);
  assert.match(page, /customPixel/);
});
test("フォームなし・不正タグ・重複タグ・パスの混入を拒否", () => {
  assert.throws(() =>
    renderPublishedPage(
      { design: "<html></html>", code: "lp100a", title: "LP" },
      "meta"
    )
  );
  assert.throws(() =>
    renderTags([
      { name: "bad", provider: "meta", tag_identifier: "123');alert(1)" },
    ])
  );
  assert.throws(() => renderTags([tags[0], tags[0]]));
  assert.throws(() =>
    renderPublishedPage({ design, code: "../evil", title: "LP" }, "meta")
  );
});

test("生成したフォーム・各広告タグのJavaScriptが構文として有効", () => {
  const page = renderPublishedPage(
    { design, tags, code: "lp100a", title: "LP" },
    "meta",
    {
      tracking: true,
    }
  );
  for (const [, script] of page.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))
    assert.doesNotThrow(() => new Function(script));
});
