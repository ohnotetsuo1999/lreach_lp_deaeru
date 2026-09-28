const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
const js = (value) => JSON.stringify(value ?? null).replaceAll("<", "\\u003c");
export function validateTag(tag) {
  const patterns = {
    gtm: /^GTM-[A-Z0-9]+$/,
    meta: /^\d{5,30}$/,
    tiktok: /^[A-Z0-9]{10,40}$/,
    google_ads: /^AW-\d+$/,
  };
  if (!tag || typeof tag.name !== "string" || !tag.name.trim()) throw Error("Tag name required");
  if (tag.provider === "custom") {
    if (
      typeof tag.config?.html !== "string" ||
      tag.config.html.length > 20000 ||
      /<\/?(?:html|head|body|form)\b/i.test(tag.config.html)
    )
      throw Error("Custom tag must be an administrator-reviewed fragment");
  } else if (!patterns[tag.provider]?.test(tag.tag_identifier))
    throw Error("Invalid advertisement tag");
  if (tag.config?.conversionLabel && !/^[a-zA-Z0-9_-]{1,100}$/.test(tag.config.conversionLabel))
    throw Error("Invalid conversion label");
  return tag;
}
export function renderTags(tags) {
  for (const tag of tags) validateTag(tag);
  if (new Set(tags.map((t) => `${t.provider}:${t.tag_identifier || t.id}`)).size !== tags.length)
    throw Error("Duplicate advertisement tag");
  return tags
    .map((tag) => {
      const id = js(tag.tag_identifier),
        literal = escapeHtml(tag.tag_identifier);
      switch (tag.provider) {
        case "gtm":
          return `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':Date.now(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${id});</script>`;
        case "meta":
          return `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${id});fbq('trackSingle',${id},'PageView');</script>`;
        case "tiktok":
          return `<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var q=w[t]=w[t]||[];q.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];q.setAndDefer=function(q,m){q[m]=function(){q.push([m].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<q.methods.length;i++)q.setAndDefer(q,q.methods[i]);q.instance=function(id){var a=q._i[id]||[];for(var i=0;i<q.methods.length;i++)q.setAndDefer(a,q.methods[i]);return a};q.load=function(id){q._i=q._i||{};q._i[id]=[];q._i[id]._u='https://analytics.tiktok.com/i18n/pixel/events.js';q._t=q._t||{};q._t[id]=+new Date;q._o=q._o||{};q._o[id]={};var s=d.createElement('script');s.async=true;s.src=q._i[id]._u+'?sdkid='+id+'&lib='+t;d.head.appendChild(s)};q.load(${id});q.instance(${id}).page()}(window,document,'ttq');</script>`;
        case "google_ads":
          return `<script async src="https://www.googletagmanager.com/gtag/js?id=${literal}"></script><script>window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',${id});</script>`;
        case "custom":
          return tag.config.html;
      }
    })
    .join("\n");
}
export function renderPublishedPage(
  { design, tags = [], code, title },
  inflow,
  { tracking = false } = {}
) {
  if (!/^lp\d{2,5}[a-z]{1,3}$/.test(code) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(inflow))
    throw Error("Invalid LP route");
  if (
    typeof design !== "string" ||
    design.split("{{LREACH_FORM}}").length !== 2 ||
    !/<\/head>/i.test(design) ||
    !/<\/body>/i.test(design)
  )
    throw Error("HTML must include head, body and exactly one {{LREACH_FORM}}");
  const form = `<form id="lreach-form"><h2>${escapeHtml(title)}</h2><label>お名前<input name="full_name" autocomplete="name" maxlength="100" required></label><label>性別<select name="gender" required><option value="">選択してください</option><option>女性</option><option>男性</option></select></label><label>生まれ年<input name="birth_year" type="number" min="1900" max="${new Date().getFullYear()}" required></label><fieldset><legend>希望勤務地（1つ以上）</legend>${["東京都", "神奈川県", "埼玉県", "千葉県"].map((x) => `<label><input type="checkbox" name="preferred_work_location" value="${x}">${x}</label>`).join("")}</fieldset><label>電話番号<input name="phone_number" type="tel" autocomplete="tel" pattern="[0-9\\- ]{10,15}" required></label><button type="submit">回答してLINEへ進む</button><p role="status" id="lreach-status"></p></form>`;
  const client = `<script type="module">
const form=document.getElementById('lreach-form'),status=document.getElementById('lreach-status'),button=form.querySelector('button');
const key='lreach-submission:'+location.pathname;let payload;
form.addEventListener('submit',async event=>{event.preventDefault();if(button.disabled)return;const data=new FormData(form);if(!data.getAll('preferred_work_location').length){status.textContent='希望勤務地を選択してください。';return;}
button.disabled=true;status.textContent='送信しています…';
try{
 if(!payload){let requestId=sessionStorage.getItem(key);if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(key,requestId);}payload={requestId,lpKey:${js(`deaeru-${code}-${inflow}`)},referrerUrl:location.href.split('#')[0],answers:{full_name:data.get('full_name'),gender:data.get('gender'),birth_year:data.get('birth_year'),phone_number:data.get('phone_number'),preferred_work_location:data.getAll('preferred_work_location')}};}
 const response=await fetch('/api/lp/v1/submissions/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});const result=await response.json();
 if(!response.ok||result.success!==true)throw Error(result.message||'送信できませんでした。同じ内容で再試行してください。');
 const next=new URL(result.continueUrl);if(next.protocol!=='https:')throw Error('遷移先を確認してください。');
 // 成功後のみコンバージョンを送信。再送成功(200)では重複発火させない。
 if(response.status===201&&${tracking ? "true" : "false"}){
  try{window.dataLayer=window.dataLayer||[];window.dataLayer.push({event:'lreach_form_success',lp_code:${js(code)}});document.dispatchEvent(new CustomEvent('lreach:submitted',{detail:{code:${js(code)}}}));
  for(const tag of ${js(tags.map((t) => ({ provider: t.provider, tag_identifier: t.tag_identifier, config: { conversionLabel: t.config?.conversionLabel } })))}){
   if(tag.provider==='meta')window.fbq?.('trackSingle',tag.tag_identifier,'CompleteRegistration');
   if(tag.provider==='tiktok')window.ttq?.instance(tag.tag_identifier).track('CompleteRegistration');
   if(tag.provider==='google_ads'&&tag.config.conversionLabel)window.gtag?.('event','conversion',{send_to:tag.tag_identifier+'/'+tag.config.conversionLabel});
  }}catch{}
  await new Promise(resolve=>setTimeout(resolve,300));
 }
 location.assign(next.href);
}catch(error){status.textContent=error.message;button.disabled=false;}
});</script>`;
  return design
    .replace("{{LREACH_FORM}}", form)
    .replace(/<\/head>/i, `${tracking ? renderTags(tags) : ""}</head>`)
    .replace(/<\/body>/i, `${client}</body>`);
}
