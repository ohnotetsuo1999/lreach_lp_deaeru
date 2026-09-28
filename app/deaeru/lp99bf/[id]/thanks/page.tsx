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
      {/* Meta Pixel Code */}
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
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

      {/* AFAD - encolor ASP / 広告主: foresma / 広告名: 出会えるエージェント */}
      <Script id="deaeru-afad-encolor-action" strategy="afterInteractive">
        {`
/* AFAD グループ成果タグ - encolor ASP (広告主: foresma, 広告名: 出会えるエージェント) */
(function(){
var uqid   = "ef86858fdee6efue";
var gid    = "14";
var uid   = "";
var uid2   = "";
var af   = "";
var pid    = "";
var amount = "";
var a=document.createElement("script");
a.src="//ac.adlution.jp/ac/action_js.php";
a.id="afadaction-"+Date.now();
a.addEventListener("load",function(){(new fpcAction(a.id)).groupAction(gid, af, [uid, uid2], pid, amount, uqid)});
document.head.appendChild(a)})();
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
