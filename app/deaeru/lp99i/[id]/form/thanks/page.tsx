"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// JANet Crib Notes の型定義
declare global {
  interface Window {
    crib?: {
      setItem: (key: string, value: string) => void;
    };
  }
}

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [gatewayUrl, setGatewayUrl] = useState(DEAERU_GATEWAY_URL);

  useEffect(() => {
    const lpSessionsIdParam = searchParams.get("lpSessionsId");
    const usersIdParam = searchParams.get("usersId");
    const referrerUrlParam = searchParams.get("referrerUrl");

    const params = new URLSearchParams();
    if (lpSessionsIdParam) params.append("lpSessionsId", lpSessionsIdParam);
    if (usersIdParam) params.append("usersId", usersIdParam);
    if (referrerUrlParam) params.append("referrerUrl", referrerUrlParam);
    setGatewayUrl(`${DEAERU_GATEWAY_URL}${params.toString() ? '?' + params.toString() : ''}`);

    /* JANet Conversion Tag（予約完了時に実行） */
    if (lpSessionsIdParam && typeof window !== "undefined") {
      console.log("🔵 [JANet] Conversion Tag実行開始", {
        transaction_id: lpSessionsIdParam,
        thanks_id: "411503",
      });

      // ntm.js を読み込み
      const ntmScript = document.createElement("script");
      ntmScript.src = "https://tag.cribnotes.jp/support/ntm.js";
      ntmScript.onload = () => {
        // cribオブジェクトが利用可能になったら設定
        if (window.crib) {
          window.crib.setItem("transaction_id", lpSessionsIdParam);
          window.crib.setItem("thanks_id", "411503");
          console.log("🟢 [JANet] Conversion Tag送信完了");
        }
      };
      document.body.appendChild(ntmScript);
    }

    setIsLoading(false);
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
    </div>
  );
}
