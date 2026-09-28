"use client";

import { useState } from "react";

import { LineDirectIntro } from "@/app/deaeru/_shared/LineDirectIntro";

import { FormPage } from "./FormPage";

// ▼▼▼ 設定エリア ▼▼▼
// lp12a: 看護師向けインハウスLP（Meta広告リストマーケ・直予約導線）。
// 見た目は lp10 系（LineDirectIntro）。CTA は LINE 直行ではなく希望条件・基本情報フォームへ。
//
// 2026-09-17: フォームは別ページ（/form）への遷移ではなく、lp02c 系と同じ「同一ページ内の切替」にした。
//   - URL が /deaeru/lp12a/{id} のまま変わらない（GTM の URL 依存トリガーが従来LPと同条件になる）
//   - Intro で読み込んだ GTM（W7S9ZNV8）がフォーム入力中もそのまま生きる
//   - /form ルートは直アクセス・新規タブ開き用に残す（form/page.tsx。GTM もそちらに設置済み）
// FV・3枚目・4枚目のみ看護素材、他は lp10 共通スライスを使用。
const LP_KEY = "deaeru-lp12a";
// ▲▲▲ 設定エリアここまで ▲▲▲

/** FV下の本文画像。3枚目・4枚目（section3/4）のみ看護版に差し替え */
const LP12A_BODY_IMAGES = [
  "/deaeru-lp10-section2.png",
  "/deaeru-lp12a-section3.png",
  "/deaeru-lp12a-section4.png",
  "/deaeru-lp10-section5.png",
  "/deaeru-lp10-section6.png",
  "/deaeru-lp10-slice7.png",
];

/** 途中着地CTA（lp10 系と同位置。section5/6 は共通画像のため座標も共通）※モジュール定数で渡す */
const LP12A_MID_CTAS = [
  { imageIndex: 3, topPercent: 72 },
  { imageIndex: 4, topPercent: 93 },
];

interface Props {
  id: string;
}

/**
 * lp12a の1ページ目（Intro）とフォームを同一URL内で切り替えるクライアント部品。
 * CTA 押下で Intro を外してフォームを表示し、先頭へスクロールする（lp02c の updateIsIntroVisible と同じ挙動）。
 */
export function NursingLpPage({ id }: Props) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  if (isFormVisible) {
    return <FormPage id={id} />;
  }

  return (
    <LineDirectIntro
      lpKey={LP_KEY}
      // href は直アクセス・新規タブ開き・JS無効時のフォールバック（通常クリックは onInternalCtaClick で切替）
      ctaUrl={`/deaeru/lp12a/${id}/form`}
      internalCta
      onInternalCtaClick={() => {
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
      ctaButtonImage="/deaeru-lp99b-cta-button.png"
      ctaButtonAlt="無料 今すぐ面談を予約する"
      fvImage="/deaeru-lp12a-fv.png"
      // 看護FVはボタンスロットが低めのため位置を補正（7%だと評価ボックスに上端が重なる）
      fvCtaBottomPercent={4.2}
      // 縦長端末でFV上下に白余白（レターボックス）が出るため上詰めにする
      fvFillViewport={false}
      bodyImages={LP12A_BODY_IMAGES}
      showDiagnosisCount={false}
      bottomCta
      midCtas={LP12A_MID_CTAS}
    />
  );
}
