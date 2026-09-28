"use client";

import { useEffect, useState } from "react";

/**
 * lp91a 専用の条件入力ポップアップ。
 * 見た目・操作感は lp08系の共通ポップアップ（_shared/ConditionPopupForm.tsx）に揃えているが、
 * 共通版は回答を LIFF の URL パラメータに載せて新基盤へ渡す作りのため流用せず、
 * 回答を親（Page）に返して LP 側で保存する形にしている。
 * 共通版は lp08系・lp10系が使っているので、そちらは変更しないこと。
 */

/** 年齢の選択肢（20〜29歳） */
const AGE_OPTIONS = Array.from({ length: 10 }, (_, i) => String(20 + i));

/**
 * 希望勤務地の選択肢（一都三県・京阪神・愛知・福岡）。
 * value は予約フォーム（deaeru-direct）の自動入力と揃えるため正式名（都道府県名）で保持する。
 */
const LOCATION_OPTIONS = [
  "東京都",
  "神奈川県",
  "埼玉県",
  "千葉県",
  "愛知県",
  "京都府",
  "大阪府",
  "兵庫県",
  "福岡県",
] as const;

/**
 * 既往歴の選択肢。値は lp92zz / lp92a と同じ「はい」「いいえ」。
 * lreach_bot は answers.medical_history === "はい" で就業制限・既往歴シナリオへ分岐するため、表記を変えないこと。
 */
const MEDICAL_HISTORY_OPTIONS = ["はい", "いいえ"] as const;

export type MedicalHistoryAnswer = (typeof MEDICAL_HISTORY_OPTIONS)[number];

export interface ConditionPopupAnswers {
  /** 年齢（"20"〜"29"） */
  age: string;
  /** 希望勤務地（都道府県名・複数） */
  locations: string[];
  /** 既往歴 */
  medicalHistory: MedicalHistoryAnswer;
}

const PRIMARY = "#06C755";

interface Props {
  open: boolean;
  onClose: () => void;
  /** LINEボタン押下時に回答を渡す。保存と遷移は親が行う */
  onSubmit: (answers: ConditionPopupAnswers) => void;
  /** 送信中はボタンを押せなくする */
  isSubmitting: boolean;
}

const toggleBase =
  "rounded-lg border px-1.5 py-2.5 text-center text-[13px] leading-tight transition-colors cursor-pointer";
const toggleOff = "border-[#ddd] text-[#333]";
const toggleOn = "border-[#06C755] bg-[#e6f9ee] text-[#06C755] font-bold";

export function ConditionPopup({ open, onClose, onSubmit, isSubmitting }: Props) {
  const [age, setAge] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryAnswer | "">("");

  // ポップアップ表示中は背面スクロールを抑制
  useEffect(() => {
    if (!open) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isEligible = age !== "" && locations.length > 0 && medicalHistory !== "";
  const canSubmit = isEligible && !isSubmitting;

  const toggleLocation = (value: string) => {
    setLocations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = () => {
    // canSubmit（isEligible）で既往歴が選択済みであることを確認済み
    if (!canSubmit) return;
    onSubmit({ age, locations, medicalHistory });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-3"
      onClick={isSubmitting ? undefined : onClose}
    >
      <div
        className="relative box-border max-h-[90vh] w-full max-w-[450px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="ご希望の条件を教えてください"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="閉じる"
          className="absolute right-3 top-3 text-xl leading-none text-[#999]"
        >
          &times;
        </button>

        <h3 className="mb-5 mt-0 text-center text-[18px] font-bold text-[#333]">
          ご希望の条件を教えてください
        </h3>

        {/* 年齢 */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-bold">年齢</label>
          <p className="mb-2 text-[11px] leading-snug text-[#ff4d4f]">
            ※選択できないご年齢の方はサポートができかねます
          </p>
          <div className="grid grid-cols-5 gap-2.5">
            {AGE_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAge(value)}
                className={`${toggleBase} ${age === value ? toggleOn : toggleOff}`}
              >
                {value}歳
              </button>
            ))}
          </div>
        </div>

        {/* 希望勤務地 */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold">
            希望勤務地
            <span className="ml-1.5 text-[11px] font-normal text-[#888]">
              複数選択可
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {LOCATION_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => toggleLocation(value)}
                className={`${toggleBase} ${
                  locations.includes(value) ? toggleOn : toggleOff
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-[#ff4d4f]">
            ※選択可能エリア外はサポート対象外となります。
          </p>
        </div>

        {/* 既往歴 */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold leading-snug">
            これまでに通院や服薬などがあり
            <br />
            身体・精神面に不安がありますか？
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {MEDICAL_HISTORY_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMedicalHistory(value)}
                className={`${toggleBase} ${
                  medicalHistory === value ? toggleOn : toggleOff
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {isEligible && (
          <div className="mb-5 rounded-lg border border-[#b7eb8f] bg-[#e6f9ee] p-4 text-center">
            <p className="m-0 text-sm font-bold leading-relaxed text-[#06C755]">
              ご希望条件の求人を持ってるエージェントを複数紹介可能です！
              <br />
              LINEでご希望条件をお伺いさせてください！
            </p>
          </div>
        )}

        {/* LINE CTA */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex w-full items-center justify-center rounded-lg border-none px-3 py-3.5 text-base font-bold text-white ${
            canSubmit ? "" : "cursor-not-allowed bg-[#ccc] opacity-70"
          }`}
          style={
            canSubmit
              ? {
                  backgroundColor: PRIMARY,
                  boxShadow: "0 4px 6px rgba(6, 199, 85, 0.2)",
                }
              : undefined
          }
        >
          <span
            className={`mr-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-black ${
              canSubmit ? "text-[#06C755]" : "text-[#999]"
            }`}
          >
            LINE
          </span>
          {isSubmitting ? "送信中..." : "エージェントをLINEで紹介してもらう"}
        </button>

        {/* 同意文言（CTAボタンの下に表示）。
            健康状態は既往歴の設問で聞くため、共通ポップアップにある「通院中ではない」の同意項目は載せない */}
        <div className="pt-3">
          <p className="text-center text-[10px] leading-tight text-[#9a9a9a]">
            上記ボタンを押すことで、以下にご同意いただいたものとみなします。
          </p>
          <ul className="mx-auto mt-1 max-w-[300px] text-[10px] leading-tight text-[#9a9a9a]">
            <li className="flex items-start gap-1">
              <span className="shrink-0 text-[#bdbdbd]">・</span>
              <span>
                <a
                  href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#777]"
                >
                  利用規約
                </a>
                および
                <a
                  href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec?source=copy_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#777]"
                >
                  プライバシーポリシー
                </a>
              </span>
            </li>
            <li className="mt-1 flex items-start gap-1">
              <span className="shrink-0 text-[#bdbdbd]">・</span>
              <span>
                現在<span className="text-[#e60012]">学生の方</span>、
                <span className="text-[#e60012]">リモート勤務</span>希望、および
                <span className="text-[#e60012]">時短勤務</span>希望ではない
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
