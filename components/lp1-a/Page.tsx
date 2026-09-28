"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { LP1AData } from "@/constants";

import { ChatData } from "@/types/lp1-a";
import { Analyzing, Diagnosis, FV, Result } from "@/components/lp1-a/section";

export function Page() {
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const [formData, setFormData] = useState({
    desired_work_style: null,
    desired_annual_income: null,
    desired_job_category: null,
    name: "",
    birthday: "",
    zip_code: "",
    phone_number: "",
  });
  const [isStatus, setIsStatus] = useState<string>("diagnosis");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const updateChatData = ({ message, type }: ChatData) => {
    setChatData((prev) => [...prev, { message: message, type: type }]);
  };

  const updateFormData = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const updateIsStatus = (status: string) => {
    setIsStatus(status);
  };

  const updateIsSubmitting = (bool: boolean) => {
    setIsSubmitting(bool);
  };

  const submit = async () => {
    if (isSubmitting) return;

    updateIsSubmitting(true);
  };

  useEffect(() => {
    // 診断画面の初期メッセージを表示
    if (isStatus === "diagnosis") {
      LP1AData.diagnosis_start_data.forEach((message) => {
        updateChatData({ message, type: "bot" });
      });
    }

    // 診断結果画面の表示
    if (isStatus === "analyzing") {
      setTimeout(() => {
        updateIsStatus("result");
      }, 2000);
    }
  }, [isStatus]);

  const setComponent = () => {
    switch (isStatus) {
      case "analyzing":
        return <Analyzing />;

      case "diagnosis":
        return (
          <Diagnosis
            chatData={chatData}
            endData={LP1AData.diagnosis_end_data}
            infoStartData={LP1AData.diagnosis_info_start_data}
            questionData={LP1AData.diagnosis_question_data}
            step={step}
            totalStep={LP1AData.diagnosis_question_data.length}
          />
        );

      case "fv":
        return <FV updateIsStatus={updateIsStatus} />;

      case "result":
        return <Result isSubmitting={isSubmitting} submit={submit} />;
    }
  };

  return <main className="mx-auto max-w-lg">{setComponent()}</main>;
}
