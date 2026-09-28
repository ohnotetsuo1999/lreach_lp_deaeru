"use client";

import { useState } from "react";

import { Form, Head, Step } from "@/app/ht/lp03a/[id]/_components";

interface Props {
  id: string;
}

export function Main({ id }: Props) {
  const [step, setStep] = useState(0);

  const updateStep = (newStep: number) => {
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
