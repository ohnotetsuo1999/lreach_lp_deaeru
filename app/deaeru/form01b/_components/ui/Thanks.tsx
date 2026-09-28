"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { MaxWidth } from "@/components/common";

const LINE_URL = "https://lin.ee/deaeru";

export function Thanks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <MaxWidth>
        <div className="flex flex-col items-center px-6 py-16">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>

          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
            面談予約が完了しました！
          </h1>

          <p className="mb-8 text-center text-sm leading-relaxed text-gray-600">
            ご予約ありがとうございます。
            <br />
            担当者より折り返しご連絡いたします。
          </p>

          <div className="mb-8 w-full max-w-sm rounded-2xl border-2 border-green-200 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#06C755]">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">
                  公式LINEを追加してください
                </p>
                <p className="text-xs text-gray-500">
                  面談の日程調整はLINEで行います
                </p>
              </div>
            </div>

            <ul className="mb-5 space-y-2">
              {[
                "面談の日程調整がスムーズに",
                "エージェント紹介の結果をお届け",
                "転職に役立つ情報を配信",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 size={14} className="shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#06C755] px-6 py-4 text-base font-bold text-white transition-all hover:bg-[#05b04c] active:scale-[0.98]"
            >
              <MessageCircle size={20} />
              LINEで友だち追加する
            </a>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-xs leading-relaxed text-gray-500">
              LINEを追加いただけない場合は、
              <br />
              お電話にてご連絡いたします。
            </p>
          </div>
        </div>
      </MaxWidth>
    </div>
  );
}
