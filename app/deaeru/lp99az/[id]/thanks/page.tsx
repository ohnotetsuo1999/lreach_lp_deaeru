"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { formatISOToJST } from "@/utils";

// 両方達成型LP（lp99az）: thanks ではキックバック送信を行わない。
// LINE追加時に bot 側で interview_bookings(8/9) 存在チェック後に送信する。
// この thanks では重複ユーザー検出と Slack 通知のみ行う。

// 名前の正規化：全角・半角スペースを削除して比較
function normalizeName(name: string): string {
  return name.replace(/[\s　]/g, "");
}

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [gatewayUrl, setGatewayUrl] = useState(DEAERU_GATEWAY_URL);

  useEffect(() => {
    const checkDuplicateAndSendCV = async () => {
      const lpSessionsIdParam = searchParams.get("lpSessionsId");
      const usersIdParam = searchParams.get("usersId");
      const referrerUrlParam = searchParams.get("referrerUrl");

      const sidParam = searchParams.get("sid");

      const params = new URLSearchParams();
      if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
      if (usersIdParam) params.append("usersId", usersIdParam);
      if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
      // sid（サルクルー MONKEY計測用）を Gateway → tracking → inflow_path.sid まで引き継ぐ。
      // 引き継がないとキックバックURL生成時に buildKickbackUrl が null を返してしまい、
      // 両方達成型キックバック（lp99az）が送信されない（中島さん事例と並列の事象）。
      if (sidParam) params.append("sid", sidParam);
      setGatewayUrl(`${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`);

      if (!lpSessionsIdParam || !usersIdParam) {
        setIsLoading(false);
        return;
      }

      try {
        // Supabaseからユーザー情報を取得
        console.log("🔵 [重複チェック] users_infoからユーザー情報を取得開始");
        console.log(`   - users_id: ${usersIdParam}`);

        const supabase = createClient();
        const { data: userInfo, error: userInfoError } = await supabase
          .from("users_info")
          .select("name, phone_number")
          .eq("users_id", usersIdParam)
          .single();

        if (userInfoError || !userInfo) {
          console.error("❌ [重複チェック] ユーザー情報取得エラー:", userInfoError);
          console.error(`   - users_id: ${usersIdParam}`);
          setIsLoading(false);
          return;
        }

        console.log("✅ [重複チェック] ユーザー情報取得成功");
        console.log(`   - 名前: ${userInfo.name}`);
        console.log(`   - 電話番号: ${userInfo.phone_number}`);

        // users_infoテーブルで重複チェック（名前の正規化を行い、スペース有無を無視）
        console.log("🔍 [重複チェック開始] users_infoテーブルを検索");
        console.log(`   - 検索条件: phone_number="${userInfo.phone_number}"`);

        const normalizedName = normalizeName(userInfo.name);
        console.log(`   - 正規化された名前: "${normalizedName}" (元: "${userInfo.name}")`);

        // 同じ電話番号を持つ全てのusers_infoレコードを取得
        const { data: existingUsers, error: usersError } = await supabase
          .from("users_info")
          .select("users_id, name, created_at")
          .eq("phone_number", userInfo.phone_number);

        if (usersError) {
          console.error("❌ [重複チェック] users_info検索エラー:", usersError);
          console.error(`   - エラー詳細: ${JSON.stringify(usersError)}`);
        }

        // 名前を正規化して比較（スペース有無を無視）
        const matchingUsers = existingUsers?.filter(
          (user) => normalizeName(user.name) === normalizedName
        ) || [];

        // 今回作成したユーザーを除外（users_idが一致するもの）
        const otherUsers = matchingUsers.filter((user) => user.users_id !== usersIdParam);

        const isDuplicate = otherUsers.length > 0;
        console.log(`🔍 [重複チェック結果] 同一電話番号: ${existingUsers?.length || 0}件 / 同一名前（正規化後）: ${matchingUsers.length}件 / 重複: ${otherUsers.length}件`);

        if (isDuplicate) {
          console.warn("⚠️ ========================================");
          console.warn("⚠️ [重複ユーザー検出（面談予約導線）]");
          console.warn("⚠️ ========================================");
          console.warn(`   - 名前: ${userInfo.name}`);
          console.warn(`   - 電話番号: ${userInfo.phone_number}`);
          console.warn(`   - 重複件数: ${otherUsers.length}件`);
          console.warn(`   - 初回登録日時: ${otherUsers[0]?.created_at ? formatISOToJST(otherUsers[0].created_at) : "不明"}`);
          console.warn("⚠️ → CV送信をスキップします");
          console.warn("⚠️ ========================================");

          // 重複通知を送信
          await fetch("/api/slack/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              channel: "C0ACG4U5G68",
              text: [
                "⚠️【重複ユーザー検出（面談予約導線）】",
                "",
                "このユーザーは過去に登録済みです。",
                "CVは返していません。",
                "",
                `名前：${userInfo.name}`,
                `電話番号：${userInfo.phone_number}`,
                `重複件数：${otherUsers.length}件`,
                `初回登録日時：${otherUsers[0]?.created_at ? formatISOToJST(otherUsers[0].created_at) : "不明"}`,
              ].join("\n"),
            }),
          });
        } else {
          console.log("✅ [重複チェック完了] 新規ユーザー（初回登録）");
          console.log(`   - 名前: ${userInfo.name}`);
          console.log(`   - 電話番号: ${userInfo.phone_number}`);
          // 両方達成型LP（lp99az）はキックバック送信を thanks では行わない。
          // LINE追加時に bot 側 handleLineFollowKickback で interview_bookings(8/9) 存在チェック後に送信する。
        }
      } catch (error) {
        console.error("❌ [重複チェック] 例外発生:", error);
        console.error(`   - エラー詳細: ${error instanceof Error ? error.message : String(error)}`);
      }

      setIsLoading(false);
    };

    checkDuplicateAndSendCV();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block size-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Yahoo!広告 ytag - サルクルー（コンバージョン B6IQKM6CKFVYOP1DCR1379561）2026-09-18 追加・全LP（thanks）。
          本LPの thanks はボタン型（自動遷移なし）のため遷移待ち合わせは不要。ytag() は yjDataLayer へのキュー投入で読込後に順次処理される */}
      <Script
        id="deaeru-thanks-yahoo-ads-sarucrew-ytag"
        strategy="afterInteractive"
        src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"
      />
      <Script id="deaeru-thanks-yahoo-ads-sarucrew-cookie" strategy="afterInteractive">{`
window.yjDataLayer = window.yjDataLayer || [];
function ytag() { yjDataLayer.push(arguments); }
ytag({"type":"ycl_cookie", "config":{"ycl_use_non_cookie_storage":true}});
      `}</Script>
      <Script id="deaeru-thanks-yahoo-ads-sarucrew-conversion" strategy="afterInteractive">{`
ytag({
  "type":"yjad_conversion",
  "config":{
    "yahoo_ydn_conv_io": "d7aaTRVbD9UpmIEuKTbRgA..",
    "yahoo_ydn_conv_label": "B6IQKM6CKFVYOP1DCR1379561",
    "yahoo_ydn_conv_transaction_id": "",
    "yahoo_ydn_conv_value": "0",
    "yahoo_email": "",
    "yahoo_phone_number": ""
  }
});
      `}</Script>
      {/* TikTok Pixel - サルクルー（D8BQHIJC77UANKFS41C0）2026-09-17 追加・全ページ base＋page（thanks）。
          依頼スニペットは素の ttq.page() だが、同居する他 TikTok Pixel へ page が重複送信されないよう
          ttq.instance() で送信先を本Pixelに固定する（2026-08-06 D9OMD5 と同方針） */}
      <Script id="deaeru-thanks-tiktok-pixel-sarucrew-d8bqhi" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D8BQHIJC77UANKFS41C0');
  ttq.instance('D8BQHIJC77UANKFS41C0').page();
}(window, document, 'ttq');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18444590797）2026-09-17 追加・全ページ（thanks）。既存 AW-17539380368 / AW-18175526274 とは別アカウント・追加並存（config のみ） */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18444"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18444590797"
      />
      <Script id="deaeru-thanks-google-ads-sarucrew-18444-config" strategy="afterInteractive">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18444590797');
      `}</Script>
      {/* Google 広告 gtag - サルクルー（AW-18463299655）2026-09-25 追加・全商流 thanks（「出会えるエージェント」conversion）。既存 AW-17539380368 / AW-18175526274 / AW-18444590797 とは別アカウント・追加並存 */}
      {/* base ロード完了(onLoad)後に config → conversion を同一フローで実行し、
          実行順の競合（gtag 未定義での無音失敗）を防ぐ。このページは自動遷移せずユーザーのボタン押下で LINE へ進むため、遷移の待ち合わせは不要。 */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18463"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18463299655"
        onLoad={() => {
          const w = window as Window & {
            dataLayer?: unknown[];
            gtag?: (...args: unknown[]) => void;
          };
          w.dataLayer = w.dataLayer || [];
          // Google 公式スニペットと同じく arguments オブジェクトを dataLayer に push する
          const gtag = function (..._args: unknown[]) {
            w.dataLayer!.push(arguments);
          };
          w.gtag = gtag;
          gtag("js", new Date());
          gtag("config", "AW-18463299655");
          gtag("event", "conversion", {
            send_to: "AW-18463299655/AhZNCP-Suf4cEMew_uNE",
            transaction_id: "",
          });
        }}
      />
      {/* Google 広告 gtag - サルクルー（AW-18175526274）2026-09-14 追加・thanks（「出会えるエージェント」conversion）。既存 AW-17539380368 とは別アカウント・追加並存 */}
      {/* base ロード完了(onLoad)後に config → conversion を同一フローで実行し、
          実行順の競合（gtag 未定義での無音失敗）を防ぐ。このページは自動遷移せずユーザーのボタン押下で LINE へ進むため、遷移の待ち合わせは不要。 */}
      <Script
        id="deaeru-thanks-google-ads-sarucrew-18175"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-18175526274"
        onLoad={() => {
          const w = window as Window & {
            dataLayer?: unknown[];
            gtag?: (...args: unknown[]) => void;
          };
          w.dataLayer = w.dataLayer || [];
          // Google 公式スニペットと同じく arguments オブジェクトを dataLayer に push する
          const gtag = function (..._args: unknown[]) {
            w.dataLayer!.push(arguments);
          };
          w.gtag = gtag;
          gtag("js", new Date());
          gtag("config", "AW-18175526274");
          gtag("event", "conversion", {
            send_to: "AW-18175526274/7OliCM7a7_YcEIKL4tpD",
            transaction_id: "",
          });
        }}
      />
      {/* TikTok Pixel - サルクルー（D9OMD5BC77U1C011Q3MG）2026-08-06 追加・thanks限定（page + CompleteRegistration + Purchase） */}
      {/* 依頼スニペットは素の ttq.track だが、lp99bl/lp99bu には既存TikTok Pixel（D8JO34RC77U7JESGMHNG）が
          同居しており、素の track/page は読み込み済み全Pixelへ一斉送信されて誤発火するため、
          全LPで ttq.instance() により送信先を本Pixelに固定する（Meta trackSingle 統一と同方針） */}
      <Script id="deaeru-thanks-tiktok-pixel-sarucrew-d9omd5" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D9OMD5BC77U1C011Q3MG');
  ttq.instance('D9OMD5BC77U1C011Q3MG').page();
  ttq.instance('D9OMD5BC77U1C011Q3MG').track('CompleteRegistration');
  ttq.instance('D9OMD5BC77U1C011Q3MG').track('Purchase');
}(window, document, 'ttq');
      `}</Script>
      {/* Meta Pixel - サルクルー（1911173825727819）2026-07-24 追加 */}
      <Script id="deaeru-thanks-meta-pixel-sarucrew-1911" strategy="afterInteractive">{`
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
fbq('trackSingle','1911173825727819','CompleteRegistration');
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
      <Script id="deaeru-thanks-meta-pixel-sarucrew-8948" strategy="afterInteractive">{`
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
fbq('trackSingle','894859009685893','CompleteRegistration');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=894859009685893&ev=PageView&noscript=1"
        />
      </noscript>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
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

        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          予約ありがとうございます
        </h1>

        <p className="mb-8 text-center leading-relaxed text-gray-600">
          確定メッセージをLINEでお送りするので
          <br />
          こちらからLINE登録お願いします
        </p>

        <a
          href={gatewayUrl}
          className="flex h-14 w-full items-center justify-center gap-x-2 rounded-xl bg-[#06C755] text-lg font-bold text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
        >
          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span>LINE登録する</span>
        </a>
      </div>
    </div>
    </>
  );
}
