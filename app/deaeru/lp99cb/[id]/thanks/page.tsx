"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { formatISOToJST } from "@/utils";

// A8.net Conversion Tag pid（lp99cb 面談予約導線用）
const A8_PID_BOOKING = "s00000027541002";

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
  // 重複ユーザーの場合は A8 CVタグを発火させない（重複はCV計上しない）
  const [isDuplicateUser, setIsDuplicateUser] = useState(false);

  useEffect(() => {
    const checkDuplicateAndSendCV = async () => {
      const lpSessionsIdParam = searchParams.get("lpSessionsId");
      const usersIdParam = searchParams.get("usersId");
      const referrerUrlParam = searchParams.get("referrerUrl");

      const params = new URLSearchParams();
      if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
      if (usersIdParam) params.append("usersId", usersIdParam);
      if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
      setGatewayUrl(`${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`);
      const sidParam = searchParams.get("sid");

      if (!lpSessionsIdParam || !usersIdParam) {
        setIsLoading(false);
        return;
      }

      try {
        // Supabaseからユーザー情報を取得
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

        // users_infoテーブルで重複チェック（名前の正規化を行い、スペース有無を無視）
        const normalizedName = normalizeName(userInfo.name);

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

        if (isDuplicate) {
          // 重複ユーザーは A8 CVタグを発火させない
          setIsDuplicateUser(true);
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

      {/* A8.net 共通スクリプト（head相当）- ASP: a8 */}
      <Script src="https://statics.a8.net/a8sales/a8crossDomain.js" strategy="afterInteractive" />
      <Script src="https://statics.a8.net/a8sales/a8shopForm.js" strategy="afterInteractive" />

      {/* A8.net CV計測タグ - ASP: a8（面談予約導線、lp99cb 専用） */}
      {/*
        以前は a8sales.js（関数定義）と a8sales() 呼び出しを両方 afterInteractive で置いていたが、
        読み込み順が保証されず a8sales() が未定義のまま実行され発火しないことがあった（A8指摘）。
        a8sales.js の onLoad 完了後に a8sales() を呼ぶことで、確実に発火させる。
        重複ユーザー（isDuplicateUser）の場合は CV計上しないため、このタグ自体を出さない。
      */}
      {!isDuplicateUser && (
        <>
          <span id="a8sales"></span>
          <Script
            src="https://statics.a8.net/a8sales/a8sales.js"
            strategy="afterInteractive"
            onLoad={() => {
              const w = window as Window & {
                a8sales?: (args: Record<string, unknown>) => void;
              };
              if (typeof w.a8sales === "function") {
                w.a8sales({
                  pid: A8_PID_BOOKING,
                  order_number: searchParams.get("lpSessionsId") || "",
                  currency: "JPY",
                  items: [{ code: "lp99cb", price: 1, quantity: 1 }],
                  total_price: 1,
                });
              }
            }}
          />
        </>
      )}
    </div>
  );
}
