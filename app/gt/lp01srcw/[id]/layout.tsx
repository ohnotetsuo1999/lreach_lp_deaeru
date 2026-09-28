import Script from "next/script";

export default function LP01SRCWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      {/* LPトップ用計測タグ（サルクルー） */}
      <Script
        id="sarucrew-lp"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(t,e,c){s=t.createElement(e),s.async=!0,s.src="https://cdn.monkey-ads.com/js/analytic.js?"+c,t.getElementsByTagName("head")[0].appendChild(s)}(document,"script","cg_id=1969&type=lp")
          `,
        }}
      />
      {/* Google 広告 gtag - サルクルー（AW-17539380368）2026-06-22 追加 */}
      <Script
        id="gt-google-ads-sarucrew"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17539380368"
      />
      <Script id="gt-google-ads-sarucrew-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17539380368');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18175526274）2026-09-14 追加。既存 AW-17539380368 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="gt-google-ads-sarucrew-18175"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18175526274"
      />
      <Script id="gt-google-ads-sarucrew-18175-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18175526274');
      `}</Script>
      {/* TikTok Pixel - サルクルー（D8BQHIJC77UANKFS41C0）2026-09-17 追加・全ページ base＋page（LPトップ）。
          依頼スニペットは素の ttq.page() だが、同居する他 TikTok Pixel へ page が重複送信されないよう
          ttq.instance() で送信先を本Pixelに固定する（2026-08-06 D9OMD5 と同方針） */}
      <Script id="gt-tiktok-pixel-sarucrew-d8bqhi" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D8BQHIJC77UANKFS41C0');
  ttq.instance('D8BQHIJC77UANKFS41C0').page();
}(window, document, 'ttq');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18444590797）2026-09-17 追加・全ページ（LPトップ）。既存 AW-17539380368 / AW-18175526274 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="gt-google-ads-sarucrew-18444"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18444590797"
      />
      <Script id="gt-google-ads-sarucrew-18444-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18444590797');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18463299655）2026-09-25 追加・全商流（LPトップ）。既存 AW-17539380368 / AW-18175526274 / AW-18444590797 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="gt-google-ads-sarucrew-18463"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18463299655"
      />
      <Script id="gt-google-ads-sarucrew-18463-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18463299655');
      `}</Script>
      {/* Meta Pixel - サルクルー経由（メディア未確認）（1761460088419219）2026-09-25 追加・全商流（LPトップのみ・PageView のみ）。
          2026-09-08 に lp99bl のみへ設置 → 過剰発火防止のため一度削除（2026-09-25 マージ済み）してから全商流へ再設置。trackSingle で本Pixel限定 */}
      <Script id="gt-meta-pixel-sarucrew-1761" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1761460088419219');
fbq('trackSingle','1761460088419219','PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1761460088419219&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Yahoo!広告 ytag - サルクルー（コンバージョン 5O536T30DR1K15BANQ1379558 ／ サイトリターゲティング 60M3FSXJ2H）2026-09-18 追加・全LP（LPトップ）。
          依頼文どおり ytag.js 読込と ytag 定義を2回記載（next/script は同一 src を1回しか読み込まず、ytag.js 自体も2回目は no-op なので実害なし）。
          ytag() は yjDataLayer へのキュー投入で、ytag.js 読込後に順次処理されるため実行順に依存しない */}
      <Script
        id="gt-yahoo-ads-sarucrew-ytag"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
      />
      <Script id="gt-yahoo-ads-sarucrew-cookie" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});
      `}</Script>
      <Script id="gt-yahoo-ads-sarucrew-conversion" strategy="afterInteractive">{`
ytag({
  "type":"yjad_conversion",
  "config":{
    "yahoo_ydn_conv_io": "d7aaTRVbD9UpmIEuKTbRgA..",
    "yahoo_ydn_conv_label": "5O536T30DR1K15BANQ1379558",
    "yahoo_ydn_conv_transaction_id": "",
    "yahoo_ydn_conv_value": "0",
    "yahoo_email": "",
    "yahoo_phone_number": ""
  }
});
      `}</Script>
      <Script
        id="gt-yahoo-ads-sarucrew-ytag-2"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
      />
      <Script id="gt-yahoo-ads-sarucrew-retargeting" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({
  "type":"yjad_retargeting",
  "config":{
    "yahoo_retargeting_id": "60M3FSXJ2H",
    "yahoo_retargeting_label": "",
    "yahoo_retargeting_page_type": "",
    "yahoo_retargeting_items":[
      {item_id: '', category_id: '', price: '', quantity: ''}
    ]
  }
});
      `}</Script>
      {/* Meta Pixel - サルクルー（1021752120329261）2026-06-22 追加 */}
      <Script id="gt-meta-pixel-sarucrew-1021" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1021752120329261');
fbq('track', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1021752120329261&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（2363966233988993）2026-06-30 追加 */}
      <Script id="gt-meta-pixel-sarucrew-2363" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2363966233988993');
fbq('track', 'PageView');
fbq('track', 'ViewContent');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=2363966233988993&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（1911173825727819）2026-07-24 追加 */}
      <Script id="gt-meta-pixel-sarucrew-1911" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1911173825727819');
fbq('trackSingle','1911173825727819','PageView');
fbq('trackSingle','1911173825727819','ViewContent');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1911173825727819&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - サルクルー（894859009685893）2026-07-24 追加 */}
      <Script id="gt-meta-pixel-sarucrew-8948" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '894859009685893');
fbq('trackSingle','894859009685893','PageView');
fbq('trackSingle','894859009685893','ViewContent');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=894859009685893&ev=PageView&noscript=1"
        />
      </noscript>
    </>
  );
}

