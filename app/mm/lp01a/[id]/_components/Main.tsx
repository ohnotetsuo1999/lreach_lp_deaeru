"use client";

import { useState } from "react";

import { Form, Head, Step } from "@/app/mm/lp01a/[id]/_components";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

interface Props {
  id: string;
}

export function Main({ id }: Props) {
  // LP行動集計シートへの行動計測（2026-07-24 実装漏れ監査で追加）
  const { markCtaClicked } = useLpActionStatistics("mm-lp01a");
  const [step, setStep] = useState(0);

  const maxStep = 4;

  const updateStep = (newStep: number) => {
    // フォーム完了（最終ステップ到達）をCTA達成として行動集計に記録する
    if (newStep >= maxStep) {
      markCtaClicked();
    }
    setStep(newStep);
  };

  return (
    <main>
      <Head />
      <Step maxStep={maxStep} step={step} />
      <Form id={id} updateStep={updateStep} />
    </main>
  );
}
