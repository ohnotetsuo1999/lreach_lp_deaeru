"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ThanksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gateway URLにパラメータを追加
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");
    const sidParam = searchParams.get("sid");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // Meta Pixel CompleteRegistrationイベント発火後、2秒待ってリダイレクト
    setTimeout(() => {
      window.location.href = gatewayUrl;
    }, 2000);
  }, [searchParams]);

  return (
    <>
      {/* Meta Pixel - 自社(foresm)向け */}
      <Script id="meta-pixel-foresm" strategy="afterInteractive">
        {`
/* Meta Pixel - 自社(foresm)向け */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '578175028373311');
fbq('track', 'PageView');
fbq('track', 'CompleteRegistration');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - 緒方ASP / バナー広告向け（Pixel: 1333575804939284）*/}
      {/* 自社Pixelと混ざらないよう trackSingle で当該Pixelに明示送信する */}
      <Script id="deaeru-meta-pixel-ogata-banner" strategy="afterInteractive">
        {`
/* Meta Pixel - 緒方ASP / バナー広告向け */
/* 各ブロックが自前ローダー(!function)を持つ＝Script実行順に依存せず確実に fbq を初期化（if(f.fbq)returnで冪等）*/
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1333575804939284');
fbq('trackSingle', '1333575804939284', 'PageView');
fbq('trackSingle', '1333575804939284', 'CompleteRegistration', { event_id: 'CR' + Date.now() });
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1333575804939284&ev=PageView&noscript=1"
        />
      </noscript>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1333575804939284&ev=CompleteRegistration&noscript=1"
        />
      </noscript>
      {/* Meta Pixel - 緒方ASP / 新広告アカウント（Pixel: 1061213309566860）2026-07-03 追加 */}
      {/* 旧緒方Pixel(1333575804939284)と並行運用。自社/他Pixelと混ざらないよう trackSingle で明示送信する */}
      <Script id="deaeru-meta-pixel-ogata-new" strategy="afterInteractive">
        {`
/* Meta Pixel - 緒方ASP / 新広告アカウント */
/* 自前ローダーで順序非依存・trackSingleで自Pixelのみに明示送信（旧緒方1333と並行） */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1061213309566860');
fbq('trackSingle', '1061213309566860', 'PageView');
fbq('trackSingle', '1061213309566860', 'CompleteRegistration', { event_id: 'CR' + Date.now() });
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1061213309566860&ev=PageView&noscript=1"
        />
      </noscript>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1061213309566860&ev=CompleteRegistration&noscript=1"
        />
      </noscript>
      {/* X (Twitter) コンバージョン計測 ベースコード - 緒方ASP向け（全ページhead設置） */}
      <Script id="deaeru-x-pixel-ogata" strategy="afterInteractive">
        {`
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('config','rcrwm');
        `}
      </Script>

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="size-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="mb-4 text-xl font-bold text-gray-800">
            ご回答ありがとうございます！
          </h1>

          <p className="mb-8 text-gray-600">
            LINE登録ページへ移動しています...
          </p>

          <div className="inline-block size-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
        </div>
      </div>
    </>
  );
}
