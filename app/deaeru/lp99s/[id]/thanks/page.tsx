"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

// RENTRACKS の型定義
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

const RENTRACKS_META_PIXEL_ID = "962935206619250";
// メディア不明（2026-05-29 タグ設置依頼）— 誤発火防止のため trackSingle で発火
const UNKNOWN_MEDIA_META_PIXEL_ID = "1002095592354055";
// 出会えるエージェント_68733_AD（メディア・レントラックスASP経由・2026-09-03 タグ設置依頼）— lp99s/004 のみ・PageView のみ
const REN_68733_AD_META_PIXEL_ID = "1039600745502589";

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id;

  useEffect(() => {
    // Gateway URLにパラメータを追加
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? "?" + params.toString() : ""}`;

    // === Meta Pixel: Sparkle Ark（広告主・レントラックスASP経由）向け CV計測 ===
    // 全イベントを trackSingle で発火し、メインPixel側に余計なイベントを送らない
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("trackSingle", RENTRACKS_META_PIXEL_ID, "PageView");
      window.fbq("trackSingle", RENTRACKS_META_PIXEL_ID, "ViewContent");
      window.fbq("trackSingle", RENTRACKS_META_PIXEL_ID, "AddToCart");
      window.fbq("trackSingle", RENTRACKS_META_PIXEL_ID, "Purchase");
      // メディア不明（2026-05-29 タグ設置依頼）— 依頼トリガーは PageView のみ
      window.fbq("trackSingle", UNKNOWN_MEDIA_META_PIXEL_ID, "PageView");
      // 出会えるエージェント_68733_AD（レントラックス経由）— lp99s/004 のみ・依頼どおり PageView のみ
      if (id === "004") {
        window.fbq("trackSingle", REN_68733_AD_META_PIXEL_ID, "PageView");
      }
    } else {
      console.warn(
        "⚠️ [Meta Pixel - Sparkle Ark / Rentracks] fbq未初期化のためスキップ"
      );
    }

    // RENTRACKS Conversion Tag
    const loadRentracksTag = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
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
            _rt.cinfo = encodeURIComponent('${lpSessionsIdParam || ""}');
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
      console.log("🔵 [RENTRACKS] Conversion Tag実行開始");
    };

    // タグ実行
    loadRentracksTag();
  }, [searchParams, id]);

  return (
    <>
      {/*
        Meta Pixel 統合スクリプト（Thanksページ）
        - 578175028373311: メインPixel（init のみ）
        - 962935206619250: Sparkle Ark（広告主・レントラックスASP経由）— init のみ。CVイベントは useEffect 内で trackSingle 発火
        - 1002095592354055: メディア不明（2026-05-29 タグ設置依頼）— init のみ。PageView は useEffect 内で trackSingle 発火
        - 1039600745502589: 出会えるエージェント_68733_AD（レントラックス経由・2026-09-03）— **lp99s/004 のみ** init。PageView は useEffect 内で trackSingle 発火
        ※ <Script> を複数に分けると実行順序が保証されず init が失敗するため、必ず1つにまとめること。
      */}
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
fbq('init', '${RENTRACKS_META_PIXEL_ID}');
fbq('init', '${UNKNOWN_MEDIA_META_PIXEL_ID}');
${id === "004" ? `fbq('init', '${REN_68733_AD_META_PIXEL_ID}');` : ""}
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
        {/* Meta Pixel noscript: Sparkle Ark（広告主・レントラックスASP経由）向け */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${RENTRACKS_META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
        {/* Meta Pixel noscript: メディア不明（2026-05-29 タグ設置依頼）向け */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${UNKNOWN_MEDIA_META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
        {id === "004" && (
          <>
            {/* Meta Pixel noscript: 出会えるエージェント_68733_AD（レントラックス経由）/ lp99s/004 のみ */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${REN_68733_AD_META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </>
        )}
      </noscript>
      {/* TikTok Pixel - メディア不明（2026-05-29 タグ設置依頼） */}
      <Script id="deaeru-tiktok-pixel-unknown" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D89T8ABC77UE9S4B1V90');
  ttq.page();
}(window, document, 'ttq');
      `}</Script>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
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
