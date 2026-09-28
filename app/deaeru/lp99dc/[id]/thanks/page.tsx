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
    const adIdParam = searchParams.get("ad_id");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    if (sidParam) params.append("sid", sidParam);
    // ad_id を Gateway 経由で tracking まで引き継ぐ
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // タグ発火（マジェラードACS track / Meta CompleteRegistration）の送信時間を確保するため、
    // リダイレクトをグローバルに公開し、成果地点タグの XHR onloadend から呼べるようにする。
    // タグ発火が確認できなくても 2.5 秒後には必ず遷移するフォールバックを設定（角南 lp99cn と同パターン）。
    let hasRedirected = false;
    const redirectToGateway = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    // 成果地点タグ（下部 Script）の XHR 完了コールバックから参照する
    (window as Window & { __magellardRedirect?: () => void }).__magellardRedirect =
      redirectToGateway;

    const fallbackTimer = setTimeout(redirectToGateway, 2500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [searchParams]);

  // 成果地点タグの args（成果識別ID）に lp_sessions_id を渡す。
  // 先方仕様の「カートシステムの注文ID」に相当する一意ID（他ASPの verify/orid と同じ扱い）。
  const lpSessionsId = searchParams.get("lpSessionsId") ?? "";

  return (
    <>
      {/*
        成果地点タグ - マジェラード / reputy.jp（ACS系）向け（2026-09-01 先方支給タグ設置）
        本 thanks は「LP回答完了」ページ（成果地点のLINE追加はこの後 Gateway→LINE 追加で行われるが、
        Cookie方式のためブラウザ上の最終接点である thanks で計上する＝先方指定の設置場所）。
        着地点タグ（Intro.tsx）が保存した cid/plid（Cookie/localStorage）を読み、
        track.php を叩いて成果を計上する（タグ方式・角南 lp99cn と同型）。
        args（成果識別ID）には lp_sessions_id を注入する。
        XHR 完了後に Gateway へ遷移（onloadend で __magellardRedirect を呼ぶ）。
        ※ タグ方式の p は下記固定値 PV="pigb8hdwl4iz"。着地点タグが cid を保存する Cookie キーは
          CL_+（入稿URLの p 値）なので、タグ方式が成立するには入稿URLの ?p= が pigb8hdwl4iz で
          ある必要がある（先方に入稿URL実物の確認を依頼中）。
      */}
      <Script id="acs-magellard-track" strategy="afterInteractive">
        {`
(function acsTrack(){
var PV = "pigb8hdwl4iz";
var _ARGSV = "${lpSessionsId}";
var KEYS = {cid : ["CL_", "ACT_", "cid_auth_get_type"], plid : ["PL_", "APT_", "plid_auth_get_type"]};
var turl = "https://reputy.jp/track.php?p=" + PV + "&args=" + _ARGSV;
var cks = document.cookie.split("; ").reduce(function(ret, s){ var kv = s.split("="); if(kv[0] && kv[1]) ret[kv[0]] = kv[1]; return ret; }, []);
turl = Object.keys(KEYS).reduce(function(url, k){ var vk = KEYS[k][0] + PV; var tk = KEYS[k][1] + PV; var v = "", t = ""; if(cks[vk]){ v = cks[vk]; if(cks[tk]) t = cks[tk]; }else if(localStorage.getItem(vk)){ v = localStorage.getItem(vk); t = "ls"; } if(v) url += "&" + k + "=" + v; if(t) url += "&" + KEYS[k][2] + "=" + t; return url; }, turl);
var xhr = new XMLHttpRequest(); xhr.open("GET", turl);
xhr.onloadend = function(){ var w = window; if(w.__magellardRedirect){ w.__magellardRedirect(); } };
xhr.send(); })();
        `}
      </Script>

      {/*
        ASP: マジェラード（新規）向け thanks。2026-09-01 に lp99cr（タグ中継状態）から複製。
        マジェラードの正式タグ（ACS系）は上部 acs-magellard-track で受領・設置済み（2026-09-01）。
        自社Pixel 578175028373311 は継続設置（CompleteRegistration 発火）。
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
