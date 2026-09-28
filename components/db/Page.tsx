"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DBData } from "@/constants";
import {
  formatDataForSupabase,
  getAddressFromZipCode,
  getIpAddress,
} from "@/utils";

import { addDBAnswers } from "@/lib/db/dbAnswers";
import { addDBQuestions } from "@/lib/db/dbQuestions";
import { Footer, Header } from "@/components/db/layout";
import { Condition, Info } from "@/components/db/section";

export function Page() {
  const isSecondPage = useRef(false);
  const isSubmitting = useRef(false);

  const [addressData, setAddressData] = useState<{
    prefecture: string;
    city: string;
    town: string;
  } | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [formData, setFormData] = useState({
    desired_work_style: [],
    desired_annual_income: "",
    desired_job_category: [],
    name: "",
    birthday: "",
    zip_code: "",
    address: "",
    phone_number: "",
  });
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);

  const updateFormData = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "desired_job_category":
      case "desired_work_style":
        const { checked } = event.target;

        setFormData((prev) => {
          const updatedTags = checked
            ? [...prev[name], value]
            : prev[name].filter((d) => d !== value);

          return {
            ...prev,
            [name]: updatedTags,
          };
        });
        break;

      case "zip_code":
        const addressData = await getAddressFromZipCode(value);
        if (addressData) {
          setFormData({
            ...formData,
            [name]: value,
            address:
              addressData.prefecture + addressData.city + addressData.town,
          });
        } else {
          setFormData({
            ...formData,
            [name]: value,
            address: "",
          });
        }
        setAddressData(addressData);
        break;

      default:
        setFormData({
          ...formData,
          [name]: value,
        });
        break;
    }
  };

  const updateStep = (type: "next" | "prev") => {
    switch (type) {
      case "next":
        setStep((latest) => latest + 1);
        break;

      case "prev":
        setStep((latest) => latest - 1);
        break;
    }
    if (!isSecondPage.current) {
      isSecondPage.current = true;
    }
  };

  const submit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    const { addQuestionsData, addAnswersData } = formatDataForSupabase(
      DBData.question_data,
      formData
    );

    const questions = await addDBQuestions(addQuestionsData);
    if (questions.length === 0) {
      alert("登録に失敗しました。確認して再度お試しください。");
      isSubmitting.current = false;
      return;
    }

    const { id: questionId } = questions[0] as { id: number };
    const answers = await addDBAnswers({
      ...addAnswersData,
      db_questions_id: questionId,
      ip_address: ipAddress,
      is_second_page: isSecondPage.current,
      is_submitted: true,
    });
    if (answers.length === 0) {
      alert("登録に失敗しました。確認して再度お試しください。");
      isSubmitting.current = false;
      return;
    }

    const { id: answerId } = answers[0] as { id: number };
    const params = new URLSearchParams({
      dbAnswersId: answerId.toString(),
      referrerUrl: currentUrl,
    });
    window.location.href = `https://gateway.lreach.jp?${params.toString()}`;
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const fetchIpAddress = async () => {
      const ip = await getIpAddress();
      setIpAddress(ip);
    };
    fetchIpAddress();

    const handlePagehide = async () => {
      if (isSubmitting.current) return;

      const { addQuestionsData, addAnswersData } = formatDataForSupabase(
        DBData.question_data,
        formData
      );
      const data = {
        question_data: addQuestionsData,
        answers_data: {
          ...addAnswersData,
          ip_address: ipAddress,
          is_second_page: isSecondPage.current,
          is_submitted: false,
        },
      };
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });

      navigator.sendBeacon("/api/supabase/create?page=db", blob);
    };

    window.addEventListener("pagehide", handlePagehide);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
    };
  }, [formData, ipAddress]);

  return (
    <>
      <Header
        formData={formData}
        questionData={DBData.question_data}
        step={step}
      />
      <main className="overflow-x-hidden">
        <div
          className={`relative flex min-h-screen w-[200%] bg-gray-50 pb-22 pt-40 transition duration-500 ease-in-out`}
          style={{ transform: `translateX(-${(100 / 2) * (step - 1)}%)` }}
        >
          <Condition
            desiredAnnualIncomeData={DBData.desired_annual_income_data}
            desiredJobCategoryData={DBData.desired_job_category_data}
            desiredWorkStyleData={DBData.desired_work_style_data}
            formData={formData}
            questionData={DBData.question_data}
            updateFormData={updateFormData}
          />
          <Info
            addressData={addressData}
            formData={formData}
            questionData={DBData.question_data}
            updateFormData={updateFormData}
          />
        </div>
      </main>
      <Footer
        formData={formData}
        isSubmitting={isSubmitting.current}
        step={step}
        submit={submit}
        updateStep={updateStep}
      />
    </>
  );
}
