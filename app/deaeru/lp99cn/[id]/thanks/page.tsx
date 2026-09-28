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
    // 角南（すみなみ）用 ad_id を Gateway 経由で tracking まで引き継ぐ
    if (adIdParam) params.append("ad_id", adIdParam);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`;

    // 成果地点タグ（ACS track.php / Meta CompleteRegistration）の送信時間を確保するため、
    // リダイレクトをグローバルに公開し、成果タグの XHR onloadend から呼べるようにする。
    // タグ発火が確認できなくても 2.5 秒後には必ず遷移するフォールバックを設定。
    let hasRedirected = false;
    const redirectToGateway = () => {
      if (hasRedirected) return;
      hasRedirected = true;
      window.location.href = gatewayUrl;
    };

    // 成果地点タグ（下部 Script）の XHR 完了コールバックから参照する
    (window as Window & { __sunaminamiRedirect?: () => void }).__sunaminamiRedirect =
      redirectToGateway;

    const fallbackTimer = setTimeout(redirectToGateway, 2500);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [searchParams]);

  // 成果地点タグの args（成果ID）に lp_sessions_id を渡す。
  // このタグ方式は「LP回答完了（thanks 到達）」段階の成果を表す。
  // 面談予約段階の成果はサーバー方式（interview_booking 側 pre-interview-kickback）で
  // args=interview_booking_id として別途送るため、両者は別値になり2地点を区別できる。
  const lpSessionsId = searchParams.get("lpSessionsId") ?? "";

  return (
    <>
      {/*
        成果地点タグ - 角南（すみなみ）/ aspservice.jp（ACS）向け
        本 thanks は「LP回答完了」ページ（面談予約はこの後 LINE 追加→LIFF で行う）。
        着地点タグ（Intro.tsx）が保存した cid（Cookie/localStorage）を読み、
        track.php を叩いて「LP回答完了」段階の成果を計上する（タグ方式）。
        args（成果ID）には lp_sessions_id を注入する。price（購入金額）はこの動線に無いため空。
        XHR 完了後に Gateway へ遷移（onloadend で __sunaminamiRedirect を呼ぶ）。
        ※ タグ方式の p は下記固定値 PV="pievn0ia4h9q"。着地点タグが cid を保存する Cookie キーは
          CL_+（入稿URLの p 値）なので、タグ方式が成立するには入稿URLの ?p= が pievn0ia4h9q である必要がある。
        ※ 支給コードは全角引用符/全角セミコロンが混入していたため半角に修正済み。
      */}
      <Script id="acs-sunaminami-track" strategy="afterInteractive">
        {`
(function acsTrack(){
var PV = "pievn0ia4h9q";
var _ARGSV = "${lpSessionsId}";
var _PRICEV = "";
var KEYS = {cid : ["CL_", "ACT_", "cid_auth_get_type"]};
var turl = "https://s18.aspservice.jp/ad/track.php?p=" + PV + "&args=" + _ARGSV + "&price=" + _PRICEV;
var cks = document.cookie.split("; ").reduce(function(ret, s){ var kv = s.split("="); if(kv[0] && kv[1]) ret[kv[0]] = kv[1]; return ret; }, []);
turl = Object.keys(KEYS).reduce(function(url, k){ var vk = KEYS[k][0] + PV; var tk = KEYS[k][1] + PV; var v = "", t = ""; if(cks[vk]){ v = cks[vk]; if(cks[tk]) t = cks[tk]; }else if(localStorage.getItem(vk)){ v = localStorage.getItem(vk); t = "ls"; } if(v) url += "&" + k + "=" + v; if(t) url += "&" + KEYS[k][2] + "=" + t; return url; }, turl);
var xhr = new XMLHttpRequest(); xhr.open("GET", turl);
xhr.onloadend = function(){ var w = window; if(w.__sunaminamiRedirect){ w.__sunaminamiRedirect(); } };
xhr.send(); })();
        `}
      </Script>

      {/*
        ASP: 角南（新規）向け thanks。2026-07-03 lp99y（サルクルー）から複製。
        角南の正式タグ（ACS）は上部 acs-sunaminami-track で受領・設置済み（2026-07-10）。
        複製元サルクルー固有Pixel（Meta 2363966233988993 / 2150859532314009）は全削除済み。
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
