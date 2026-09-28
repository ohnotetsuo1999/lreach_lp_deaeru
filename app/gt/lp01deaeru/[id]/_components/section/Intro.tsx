"use client";

import { useEffect, useRef, useState } from "react";
import { MaxWidth } from "@/components/common";
import { CheckCircle2, Clock, Shield } from "lucide-react";

interface Props {
  updateIsCta1Submitted: (isCta1Submitted: boolean) => void;
  updateIsIntroVisible: (isIntroVisible: boolean) => void;
}

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showFixedButton, setShowFixedButton] = useState(false);

  /* CTAをクリックしたときの処理 */
  function handleClickCTA(): void {
    updateIsCta1Submitted(true);
    updateIsIntroVisible(false);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFixedButton(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-green-50 to-white">
      <MaxWidth>
        {/* ヒーローセクション */}
        <div className="px-4 pt-12 pb-8">
          <div className="flex flex-col items-center">
            <img
              src="/deaeru-logo.png"
              alt="出会えるエージェント"
              className="h-16 w-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              出会えるエージェント
            </h1>
            <div className="text-center mb-8">
              <p className="text-3xl font-bold text-green-600 mb-2">
                たった1分で出会える。
              </p>
              <p className="text-2xl font-bold text-gray-700">
                いい人に、いい求人に。
              </p>
            </div>

            {/* イラスト */}
            <div className="w-full max-w-sm mb-6">
              <img
                src="/Selecting-team-bro.svg"
                alt="チーム選択"
                className="w-full h-auto"
              />
            </div>

            {/* 特徴カード */}
            <div className="w-full max-w-md space-y-3 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2 bg-green-100 rounded-lg">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      ユーザー評価が高いエージェントのみ紹介
                    </h3>
                    <p className="text-sm text-gray-600">
                      満足度98%以上のエージェントを厳選
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      東証上場・UUUM親会社が出資
                    </h3>
                    <p className="text-sm text-gray-600">
                      安心安全の運営体制
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 p-2 bg-green-100 rounded-lg">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      LINEで完結。驚くほど「タイパ」がいい
                    </h3>
                    <p className="text-sm text-gray-600">
                      最短1分でエージェント紹介
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* カンタン3STEP */}
            <div className="w-full max-w-md mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  カンタン <span className="text-green-600">3STEP</span>
                </h2>
                <p className="text-gray-600">診断の流れ</p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <span className="text-lg font-bold text-white">1</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      30秒で終わる質問に答える
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-13">
                    職種・業種・経験年数を選択
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <span className="text-lg font-bold text-white">2</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      簡単な情報を入力するだけ
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-13">
                    個人情報は厳重に管理されます
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <span className="text-lg font-bold text-white">3</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      あなたにピッタリのエージェントがLINEに届く!
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-13">
                    LINEで気軽に相談OK
                  </p>
                </div>
              </div>
            </div>

            {/* イラスト2 */}
            <div className="w-full max-w-xs mb-6">
              <img
                src="/Hired-bro.svg"
                alt="採用"
                className="w-full h-auto"
              />
            </div>

            {/* CTAボタン */}
            <button
              ref={buttonRef}
              onClick={handleClickCTA}
              className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-400 text-white font-bold text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
            >
              <span className="flex items-center justify-center gap-2">
                <span>あなたに合うエージェントを<br className="sm:hidden" />診断する</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>利用料無料</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span>1分で完了</span>
              </div>
            </div>

            {/* 今週の診断数 */}
            <div className="text-center text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                今週 <strong className="text-green-600">659</strong> 人が診断しました
              </span>
            </div>
          </div>
        </div>
      </MaxWidth>

      {/* 固定CTAボタン */}
      {showFixedButton && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <MaxWidth className="h-full">
            <button
              onClick={handleClickCTA}
              className="w-full max-w-md bg-gradient-to-r from-green-500 to-green-400 text-white font-bold text-base py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="flex items-center justify-center gap-2">
                <span>あなたに合うエージェントを<br className="sm:hidden" />診断する</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </MaxWidth>
        </div>
      )}
    </div>
  );
}
