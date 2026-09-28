"use client";

import { useState } from "react";

import { Form, Head, Step } from "@/app/ht/lp02a/[id]/_components";

interface Props {
  id: string;
}

export function Main({ id }: Props) {
  const [step, setStep] = useState<number>(0);

  /* ステップを更新 */
  const updateStep = (newStep: number): void => {
    setStep(newStep);
  };

  const maxStep = 4;

  return (
    <main>
      <Head />
      <Step maxStep={maxStep} step={step} />
      <Form id={id} updateStep={updateStep} />
    </main>
  );
}
