const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]
  );
export const templates = [
  {
    id: "career-simple",
    name: "相談LP / シンプル",
    description: "見出し・サービス紹介・相談フォームを縦に配置",
  },
  {
    id: "career-cards",
    name: "相談LP / 特徴カード",
    description: "特徴を3枚のカードで紹介して相談フォームへ案内",
  },
];
export function renderTemplate(id, content = {}) {
  if (!templates.some((t) => t.id === id)) throw Error("Unknown template");
  const title = esc(content.title || "あなたらしい働き方を、一緒に。");
  const lead = esc(
    content.lead || "希望の働き方や、転職で気になることをお聞かせください。"
  );
  const brand = esc(content.brand || "キャリア相談");
  const cards =
    id === "career-cards"
      ? `<section class="cards" aria-label="相談できること">${["希望の働き方を整理", "お仕事探しの悩みを相談", "次の一歩を一緒に考える"].map((x) => `<article><h2>${x}</h2><p>今の状況や希望をお伺いしながら、一緒に考えます。</p></article>`).join("")}</section>`
      : "";
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f5f7f3;color:#183a32;font-family:system-ui,sans-serif;line-height:1.8}header,main,footer{max-width:1060px;margin:auto;padding:24px}header{font-weight:700;border-bottom:1px solid #d7e0d8}.hero{padding:64px 0;max-width:780px}.eyebrow{font-size:14px;letter-spacing:.12em}h1{font-size:clamp(30px,5vw,54px);line-height:1.4;overflow-wrap:anywhere}p{overflow-wrap:anywhere}.cta,button{display:inline-block;border:0;border-radius:8px;padding:16px 24px;background:#155e48;color:white;text-decoration:none;font-size:17px;font-weight:700;cursor:pointer}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:48px}.cards article{padding:24px;background:white;border:1px solid #d7e0d8;border-radius:12px}.cards h2{font-size:20px}.form-panel{max-width:680px;background:white;border:1px solid #d7e0d8;border-radius:16px;padding:32px;margin:0 auto 48px}form{display:grid;gap:20px}form h2{margin:0;font-size:24px}form>label{display:grid;gap:8px}input,select{max-width:100%;min-width:0;padding:12px;border:1px solid #83958c;border-radius:6px;font:inherit;background:white;color:#183a32}fieldset{border:1px solid #83958c;border-radius:6px;display:flex;gap:12px;flex-wrap:wrap}fieldset label{display:flex;align-items:center;gap:6px}button:disabled{opacity:.65;cursor:wait}:focus-visible{outline:3px solid #cf7900;outline-offset:3px}footer{font-size:13px;color:#4b6258}@media(max-width:640px){.hero{padding:32px 0}.cards{grid-template-columns:1fr}.form-panel{padding:20px}header,main,footer{padding:20px}}
</style></head><body><header>${brand}</header><main><section class="hero"><p class="eyebrow">CAREER SUPPORT</p><h1>${title}</h1><p>${lead}</p><a class="cta" href="#consultation">相談フォームへ</a></section>${cards}<section class="form-panel" id="consultation" aria-label="相談フォーム">{{LREACH_FORM}}</section></main><footer>${brand}</footer></body></html>`;
}
