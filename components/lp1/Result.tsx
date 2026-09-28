"use client";

import { useRef, useState } from "react";
import Link from "next/link";

type Props = {
  answersId: number | null;
  scores: { [key: string]: number };
  updateToSupabase: (answer: { [key: string]: string | boolean }) => void;
};

export function Result({ answersId, scores, updateToSupabase }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUrl = window.location.href;

  // 最大値のキーを取得
  const maxScoreKeys = Object.entries(scores).reduce<{
    maxValue: number | null;
    keys: string[];
  }>(
    (acc, entry) => {
      const [key, value] = entry;

      if (acc.maxValue === null || value > acc.maxValue) {
        return { maxValue: value, keys: [key] };
      } else if (value === acc.maxValue) {
        acc.keys.push(key);
      }

      return acc;
    },
    { maxValue: null, keys: [] }
  ).keys;

  const submit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const maxScore =
      maxScoreKeys[Math.floor(Math.random() * maxScoreKeys.length)];

    await updateToSupabase({
      oriented_type: maxScore,
      scenario_type: Math.random() < 0.5 ? "A" : "B",
      submit: true,
      submitted_at: new Date().toISOString(),
    });

    linkRef.current?.click();
  };

  return (
    <section className="relative">
      <div className="relative">
        <img className="block w-full" src="/lp1_result_bg.jpg" alt="" />
        <button
          className="absolute inset-x-0 bottom-[34.5%] mx-[11.5%] block"
          disabled={isSubmitting}
          onClick={() => submit()}
        >
          <img
            className="mx-auto block w-full animate-button-bounce"
            src="/lp1_result_button.png"
            alt="診断書を受け取る"
          />
          <img
            className="pointer-events-none absolute bottom-0 right-[-6.7%] w-[13%] translate-y-[53%]"
            src="/lp1_result_button_sub.png"
            alt=""
          />
        </button>
        <Link
          className="hidden"
          href={(() => {
            const params = new URLSearchParams({
              answersId: answersId?.toString() || '',
              referrerUrl: currentUrl,
            });
            return `https://gateway.lreach.jp?${params.toString()}`;
          })()}
          ref={linkRef}
        >
          クリック
        </Link>
      </div>
    </section>
  );
}
