"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

function ThanksRedirect() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    const lpSessionsId = searchParams.get("lpSessionsId");
    const usersId = searchParams.get("usersId");
    const referrerUrl = searchParams.get("referrerUrl");
    const sid = searchParams.get("sid");

    if (lpSessionsId) params.append("lpSessionsId", lpSessionsId);
    if (usersId) params.append("usersId", usersId);
    if (referrerUrl) params.append("referrerUrl", referrerUrl);
    if (sid) params.append("sid", sid);

    const gatewayUrl = `${DEAERU_GATEWAY_URL}${params.toString() ? `?${params.toString()}` : ""}`;
    const redirectTimer = window.setTimeout(() => {
      window.location.href = gatewayUrl;
    }, 2000);

    return () => window.clearTimeout(redirectTimer);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="size-10 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
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
        <p className="mb-8 text-gray-600">LINE登録ページへ移動しています...</p>
        <div className="inline-block size-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={null}>
      <ThanksRedirect />
    </Suspense>
  );
}
