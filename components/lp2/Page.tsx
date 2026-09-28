"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { LP2Data } from "@/constants";

import { addLP2Answers } from "@/lib/db/lp2Answers";
import { addLP2Questions } from "@/lib/db/lp2Questions";
import { FV, Header, LP2Form, Step } from "@/components/lp2";

export function Page() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [formData, setFormData] = useState({
    desired_time: "",
    phone_number: "",
    status: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const stepLength = 3;

  const updateData = (event: ChangeEvent<HTMLInputElement>) => {
    const newFormData = {
      ...formData,
      [event.target.name]: event.target.value,
    };
    setFormData(newFormData);

    const countFilledFields = Object.values(newFormData).filter(
      (value) => value !== ""
    ).length;

    setStep(countFilledFields);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const addLP2QuestionsData = Object.fromEntries(
      LP2Data.question_data.map((question, index) => [
        `question_${index + 1}`,
        question,
      ])
    );
    const addLP2AnswersData = Object.fromEntries(
      Object.values(formData).map((data, index) => [
        `answer_${index + 1}`,
        data,
      ])
    );

    const questions = await addLP2Questions(addLP2QuestionsData);
    if (questions.length === 0) {
      alert("登録に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
      return;
    }

    const { id: questionId } = questions[0] as { id: number };
    const answers = await addLP2Answers({
      ...addLP2AnswersData,
      lp2_questions_id: questionId,
    });
    if (answers.length === 0) {
      alert("登録に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
      return;
    }

    const { id: answerId } = answers[0] as { id: number };
    const params = new URLSearchParams({
      lp2AnswersId: answerId.toString(),
      referrerUrl: currentUrl,
    });
    window.location.href = `https://gateway.lreach.jp?${params.toString()}`;
    setIsSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 pb-12">
        <FV />
        <Step step={step} stepLength={stepLength} />
        <LP2Form
          formData={formData}
          isSubmitting={isSubmitting}
          questionData={LP2Data.question_data}
          submit={submit}
          updateData={updateData}
        />
      </main>
    </>
  );
}
