const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );

// The source HTML is also the design review artifact. Keep its file:// preview
// usable without adding a second submission path to the published page.
export function addFilePreview(design, title) {
  // Reusing a generated design as designFile should refresh the title and
  // retain just one file-only preview.
  design = design
    .replace(/<script data-lreach-file-preview>[\s\S]*?<\/script>/g, "")
    .replace('<div data-lreach-form-placeholder>{{LREACH_FORM}}</div>', '{{LREACH_FORM}}');
  if (design.split("{{LREACH_FORM}}").length !== 2 || !/<\/body>/i.test(design))
    throw Error("デザインHTMLには{{LREACH_FORM}}を1か所と</body>が必要です。");
  const safeTitle = JSON.stringify(escapeHtml(title)).replaceAll("<", "\\u003c");
  const preview = `<script data-lreach-file-preview>
if (location.protocol === 'file:') {
  document.querySelectorAll('img[src^="/"]').forEach(image => {
    image.src = new URL('../public' + image.getAttribute('src'), location.href).href;
  });
  document.querySelector('[data-lreach-form-placeholder]').innerHTML =
    '<form id="lreach-form" aria-label="表示確認用フォーム">' +
    '<h2>' + ${safeTitle} + '</h2>' +
    '<label>お名前<input disabled></label>' +
    '<label>性別<select disabled><option>選択してください</option></select></label>' +
    '<label>生まれ年<input disabled></label>' +
    '<fieldset disabled><legend>希望勤務地（1つ以上）</legend>' +
    '<label><input type="checkbox">東京都</label><label><input type="checkbox">神奈川県</label>' +
    '<label><input type="checkbox">埼玉県</label><label><input type="checkbox">千葉県</label></fieldset>' +
    '<label>電話番号<input disabled></label>' +
    '<button disabled>回答してLINEへ進む</button>' +
    '<p>表示確認用です。発行後のページで回答できます。</p></form>';
}
</script>`;
  return design
    .replace("{{LREACH_FORM}}", '<div data-lreach-form-placeholder>{{LREACH_FORM}}</div>')
    .replace(/<\/body>/i, `${preview}</body>`);
}
