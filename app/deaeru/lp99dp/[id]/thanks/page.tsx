"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Script from "next/script";

export default function ThanksPage() {
  const searchParams = useSearchParams();
  // URL の [id]（入稿 id）。媒体別タグの出し分けに使う（001=GDN Google / 002=YDA Yahoo。2026-09-18）
  const routeParams = useParams<{ id: string }>();
  const id = routeParams?.id;

  useEffect(() => {
    // Gateway URLにパラメータを追加
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");
    const sidParam = searchParams.get("sid");
    const adIdParam = searchParams.get("ad_id");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);
    // ad_id を Gateway 経由で tracking まで引き継ぐ
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // Gateway への遷移タイミング（2026-09-18: 固定 2.5 秒待ちから変更・媒体別タグの発火保証）
    //  - 最低 2 秒は滞在する（Meta CompleteRegistration・AFAD 成果タグの送信時間を従来どおり確保）
    //  - id=001（GDN）: Google 広告（AW-18321474146）conversion の event_callback を待ってから遷移
    //  - id=002（YDA）: Yahoo!広告 ytag.js の読込完了（onLoad）を待ってから遷移（Yahoo には送信完了コールバックが無いため読込完了で代替）
    //  - それ以外の id: 最低滞在のみ
    //  - event_callback / onLoad が来ない環境（gtag.js・ytag.js ブロック等）に備え、2.5 秒で必ず遷移する（フォールバック）
    //  - 重複遷移は hasRedirected でガード
    let hasRedirected = false;
    let minDwellPassed = false;
    let conversionDone = id !== "001";
    let yahooLoaded = id !== "002";
    const redirect = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };
    const tryRedirect = () => {
      if (minDwellPassed && conversionDone && yahooLoaded) redirect();
    };
    const w = window as Window & {
      __encolorGoogleAdsRedirect?: () => void;
      __encolorYahooAdsLoaded?: () => void;
    };
    w.__encolorGoogleAdsRedirect = () => {
      conversionDone = true;
      tryRedirect();
    };
    w.__encolorYahooAdsLoaded = () => {
      yahooLoaded = true;
      tryRedirect();
    };

    const minDwellTimer = window.setTimeout(() => {
      minDwellPassed = true;
      tryRedirect();
    }, 2000);
    const fallbackTimer = window.setTimeout(redirect, 2500);

    return () => {
      window.clearTimeout(minDwellTimer);
      window.clearTimeout(fallbackTimer);
      // アンマウント後に遅れて event_callback / onLoad が来ても遷移しないよう参照を外す
      delete w.__encolorGoogleAdsRedirect;
      delete w.__encolorYahooAdsLoaded;
    };
  }, [searchParams, id]);

  return (
    <>
      {/*
        ASP: encolor（広告主: foresma / 広告名: 出会えるエージェント）向け thanks。2026-09-14 に lp99dg から複製。
        タグ: 自社Pixel 578175028373311（CompleteRegistration）＋ AFAD グループ成果タグ（encolor 指定・thanks のみ）。
        AFAD グループ計測タグは thanks には置かない（仕様: 計測タグは thanks 以外）。
      */}
      {/* Meta Pixel - 自社（578175028373311） */}
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
      {/* AFAD グループ成果タグ - encolor ASP / 広告主: foresma / 広告名: 出会えるエージェント（2026-09-14 設置）
          2026-09-14 受領スニペットどおり uid は {uid1〜uid5} のオブジェクトで渡す（lp99bf の旧形式 [uid, uid2] とは異なる）。
          action_js.php の load 後に groupAction を呼ぶため実行順は自己完結。useEffect の 2.5 秒待ちで送信時間を確保 */}
      <Script id="deaeru-afad-encolor-action" strategy="afterInteractive">{`
/* AFAD グループ成果タグ - encolor ASP (広告主: foresma, 広告名: 出会えるエージェント) */
(function(){
var uqid   = "ef86858fdee6efue";
var gid    = "14";
var uid    = {
    'uid1': "",
    'uid2': "",
    'uid3': "",
    'uid4': "",
    'uid5': "",
}
var af   = "";
var pid    = "";
var amount = "";
var a=document.createElement("script");
a.src="//ac.adlution.jp/ac/action_js.php";
a.id="afadaction-"+Date.now();
a.addEventListener("load",function(){(new fpcAction(a.id)).groupAction(gid, af, uid, pid, amount, uqid)});
document.head.appendChild(a)})();
      `}</Script>
      {/* Google タグ（GDN）- encolor（AW-18321474146）2026-09-18 追加 / lp99dp/001 のみ・thanks: base＋config＋「LINE登録完了コンバージョン」。
          base ロード完了(onLoad)後に config → conversion を同一フローで実行し、実行順の競合（gtag 未定義での無音失敗）を防ぐ。
          conversion の event_callback で Gateway へ遷移する（フォールバックは useEffect の 2.5 秒タイマー）。transaction_id は依頼どおり空 */}
      {id === "001" && (
        <Script
          id="deaeru-thanks-google-ads-encolor-18321"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18321474146"
          onLoad={() => {
            const w = window as Window & {
              dataLayer?: unknown[];
              gtag?: (...args: unknown[]) => void;
              __encolorGoogleAdsRedirect?: () => void;
            };
            w.dataLayer = w.dataLayer || [];
            // Google 公式スニペットと同じく arguments オブジェクトを dataLayer に push する
            const gtag = function (..._args: unknown[]) {
              w.dataLayer!.push(arguments);
            };
            w.gtag = gtag;
            gtag("js", new Date());
            gtag("config", "AW-18321474146");
            gtag("event", "conversion", {
              send_to: "AW-18321474146/qg44COSb1vocEOKErqBE",
              transaction_id: "",
              event_callback: () => {
                w.__encolorGoogleAdsRedirect?.();
              },
            });
          }}
        />
      )}
      {/* Yahoo!広告 ytag（YDA）- encolor 2026-09-18 追加 / lp99dp/002 のみ・thanks: サイトジェネラル → コンバージョン（RK7B4X1R0GNLBT04301378877）の順、
          ＋サイトリターゲティング（0ZAMPTELQT・全ページ指定のため thanks にも）。
          Yahoo には送信完了コールバックが無いため、ytag.js の読込完了（onLoad）を Gateway 遷移の待ち条件にする
          （読込後は yjDataLayer のキューが即時処理され送信される。フォールバックは useEffect の 2.5 秒タイマー） */}
      {id === "002" && (
        <>
          <Script
            id="deaeru-thanks-yahoo-ads-encolor-ytag"
            strategy="afterInteractive"
            src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
            onLoad={() => {
              const w = window as Window & { __encolorYahooAdsLoaded?: () => void };
              w.__encolorYahooAdsLoaded?.();
            }}
          />
          <Script id="deaeru-thanks-yahoo-ads-encolor-general" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});
          `}</Script>
          <Script id="deaeru-thanks-yahoo-ads-encolor-conversion" strategy="afterInteractive">{`
ytag({
  "type":"yjad_conversion",
  "config":{
    "yahoo_ydn_conv_io": "zC4koEfQU54w6ZtXGpGB9g..",
    "yahoo_ydn_conv_label": "RK7B4X1R0GNLBT04301378877",
    "yahoo_ydn_conv_transaction_id": "",
    "yahoo_ydn_conv_value": "0"
  }
});
          `}</Script>
          <Script id="deaeru-thanks-yahoo-ads-encolor-retargeting" strategy="afterInteractive">{`
ytag({
  "type":"yjad_retargeting",
  "config":{
    "yahoo_retargeting_id": "0ZAMPTELQT",
    "yahoo_retargeting_label": "",
    "yahoo_retargeting_page_type": "",
    "yahoo_retargeting_items":[
      {item_id: '', category_id: '', price: '', quantity: ''}
    ]
  }
});
          `}</Script>
        </>
      )}

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
