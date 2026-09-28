"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

// RENTRACKS / Meta Pixel の型定義
declare global {
  interface Window {
    _rt?: {
      sid?: number;
      pid?: number;
      price?: number;
      reward?: number;
      cname?: string;
      ctel?: string;
      cemail?: string;
      cinfo?: string;
    };
    rt_tracktag?: () => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export default function ThanksPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Gateway URLにパラメータを追加
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // RENTRACKS Conversion Tag
    const loadRentracksTag = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function(){
          function loadScriptRTCV(callback){
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://www.rentracks.jp/js/itp/rt.track.js?t=' + (new Date()).getTime();
            if ( script.readyState ) {
              script.onreadystatechange = function() {
                if ( script.readyState === 'loaded' || script.readyState === 'complete' ) {
                  script.onreadystatechange = null;
                  callback();
                }
              };
            } else {
              script.onload = function() {
                callback();
              };
            }
            document.getElementsByTagName('head')[0].appendChild(script);
          }
          loadScriptRTCV(function(){
            _rt.sid = 11003;
            _rt.pid = 15749;
            _rt.price = 0;
            _rt.reward = -1;
            _rt.cname = '';
            _rt.ctel = '';
            _rt.cemail = '';
            _rt.cinfo = encodeURIComponent('${lpSessionsIdParam || ''}');
            rt_tracktag();
            console.log('🟢 [RENTRACKS] Conversion Tag送信完了');

            // タグ発火後、2秒待ってからリダイレクト（ビーコン送信完了を確保）
            setTimeout(function() {
              window.location.href = '${gatewayUrl}';
            }, 2000);
          });
        })();
      `;
      document.body.appendChild(script);
      console.log('🔵 [RENTRACKS] Conversion Tag実行開始');
    };

    // タグ実行
    loadRentracksTag();
  }, [searchParams]);

  return (
    <>
      <Script id="deaeru-meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '578175028373311');
      `}</Script>
      <noscript>
        {/* Meta Pixel noscript: メインPixel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=578175028373311&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
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
