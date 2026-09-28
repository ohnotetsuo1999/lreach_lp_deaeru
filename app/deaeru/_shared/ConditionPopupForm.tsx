"use client";

import { useEffect, useMemo, useState } from "react";

/** 年齢の選択肢（20〜34歳） */
const AGE_OPTIONS = Array.from({ length: 15 }, (_, i) => String(20 + i));

/** 転職回数の選択肢（30〜34歳のみ表示） */
const JOB_CHANGE_OPTIONS = [
  { label: "0回", value: "0" },
  { label: "1回", value: "1" },
  { label: "2回", value: "2" },
  { label: "3回以上", value: "3+" },
] as const;

/**
 * 希望勤務地の選択肢。label=表示名 / value=URLパラメータ・answers用。
 * value は予約フォーム（preferred_work_location）と揃えるため正式名（都道府県名）で保持する。
 */
const LOCATION_OPTIONS = [
  { label: "東京都", value: "東京都" },
  { label: "神奈川県", value: "神奈川県" },
  { label: "埼玉県", value: "埼玉県" },
  { label: "千葉県", value: "千葉県" },
  { label: "愛知県", value: "愛知県" },
  { label: "京都府", value: "京都府" },
  { label: "大阪府", value: "大阪府" },
  { label: "兵庫県", value: "兵庫県" },
  { label: "福岡県", value: "福岡県" },
  { label: "その他", value: "その他" },
] as const;

const PRIMARY = "#06C755";

interface Props {
  /** 表示制御 */
  open: boolean;
  /** 閉じる操作 */
  onClose: () => void;
  /** CTA（LIFF / LINEリンク）のベースURL。linkId / to を含む */
  ctaUrl: string;
  /** 流入元LP URL（window.location.href）。lpUrl パラメータに付加 */
  lpUrl: string;
  /** LINE CTAタップ時に呼ばれる（GTM / Wick 等の計測用） */
  onConfirm?: () => void;
}

const toggleBase =
  "rounded-lg border px-1.5 py-2.5 text-center text-[13px] leading-tight transition-colors cursor-pointer";
const toggleOff = "border-[#ddd] text-[#333]";
const toggleOn = "border-[#06C755] bg-[#e6f9ee] text-[#06C755] font-bold";

/**
 * lp08系のCTAタップ後に表示する条件入力ポップアップ。
 * 年齢 / 転職回数 / 希望勤務地を選択し、判定ロジックでLINE CTAの有効/無効を制御する。
 * LINE CTAタップ時に回答をURLパラメータ（age / jobChange / location）として付加して遷移する。
 */
export function ConditionPopupForm({
  open,
  onClose,
  ctaUrl,
  lpUrl,
  onConfirm,
}: Props) {
  const [age, setAge] = useState<string>("");
  const [jobChange, setJobChange] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);

  // ポップアップ表示中は背面スクロールを抑制
  useEffect(() => {
    if (!open) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const ageNum = age === "" ? null : Number(age);
  // 30〜34歳のときのみ転職回数を表示・必須にする
  const showJobChange = ageNum !== null && ageNum >= 30 && ageNum <= 34;

  const allSelected =
    age !== "" &&
    locations.length > 0 &&
    (!showJobChange || jobChange !== "");

  // 案内不可: 30〜34歳 かつ 転職3回以上
  const isIneligible = showJobChange && jobChange === "3+";
  // 案内可能: 全項目選択済み かつ 案内不可でない
  const isEligible = allSelected && !isIneligible;

  const finalUrl = useMemo(() => {
    if (!isEligible) return "";
    try {
      const url = new URL(ctaUrl);
      url.searchParams.set("lpUrl", lpUrl);
      url.searchParams.set("age", age);
      if (showJobChange && jobChange) {
        url.searchParams.set("jobChange", jobChange);
      }
      url.searchParams.set("location", locations.join(","));
      return url.toString();
    } catch {
      return "";
    }
  }, [isEligible, ctaUrl, lpUrl, age, showJobChange, jobChange, locations]);

  const toggleLocation = (value: string) => {
    setLocations((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-3"
      onClick={onClose}
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
            {AGE_OPTIONS.map((value) => {
              const selected = age === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setAge(value);
                    // 30〜34歳以外に変更したら転職回数をリセット
                    const n = Number(value);
                    if (n < 30 || n > 34) setJobChange("");
                  }}
                  className={`${toggleBase} ${selected ? toggleOn : toggleOff}`}
                >
                  {value}歳
                </button>
              );
            })}
          </div>
        </div>

        {/* 転職回数（30〜34歳のみ） */}
        {showJobChange && (
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold">転職回数</label>
            <div className="grid grid-cols-4 gap-2.5">
              {JOB_CHANGE_OPTIONS.map((opt) => {
                const selected = jobChange === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setJobChange(opt.value)}
                    className={`${toggleBase} ${
                      selected ? toggleOn : toggleOff
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 希望勤務地 */}
        <div className="mb-5">
          <label className="mb-2 block text-sm font-bold">
            希望勤務地
            <span className="ml-1.5 text-[11px] font-normal text-[#888]">
              複数選択可
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {LOCATION_OPTIONS.map((opt) => {
              const selected = locations.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleLocation(opt.value)}
                  className={`${toggleBase} ${
                    selected ? toggleOn : toggleOff
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="mt-1.5 text-[11px] text-[#ff4d4f]">
            ※選択可能エリア外はサポート対象外となります。
          </p>
        </div>

        {/* 判定メッセージ */}
        {isIneligible && (
          <div className="mb-5 rounded-lg border border-[#ffccc7] bg-[#fff5f5] p-4 text-center">
            <p className="m-0 text-sm font-bold leading-relaxed text-[#cf1322]">
              ご案内できるエージェントがございません
              <br />
              申し訳ございません
            </p>
          </div>
        )}
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
        {isEligible ? (
          <a
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onConfirm?.()}
            className="flex w-full items-center justify-center rounded-lg border-none px-3 py-3.5 text-base font-bold text-white"
            style={{
              backgroundColor: PRIMARY,
              boxShadow: "0 4px 6px rgba(6, 199, 85, 0.2)",
            }}
          >
            <span className="mr-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-[#06C755]">
              LINE
            </span>
            エージェントをLINEで紹介してもらう
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center rounded-lg border-none bg-[#ccc] px-3 py-3.5 text-base font-bold text-white opacity-70"
          >
            <span className="mr-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-black text-[#999]">
              LINE
            </span>
            エージェントをLINEで紹介してもらう
          </button>
        )}

        {/* 同意文言（CTAボタンの下に表示） */}
        <div className="pt-3">
          <p className="text-center text-[10px] leading-tight text-[#9a9a9a]">
            上記ボタンを押すことで、以下にご同意いただいたものとみなします。
          </p>
          <ul className="mt-1 mx-auto max-w-[300px] text-[10px] leading-tight text-[#9a9a9a]">
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
                現在、業務遂行に支障となる健康問題がなく、
                <span className="text-[#e60012]">通院中</span>ではない
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
