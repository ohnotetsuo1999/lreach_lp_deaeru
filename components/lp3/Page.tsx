"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { LP3Data } from "@/constants";
import {
  formatDataForSupabase,
  formatDate,
  getAddressFromZipCode,
} from "@/utils";

import { addLP3Answers } from "@/lib/db/lp3Answers";
import { addLP3Questions } from "@/lib/db/lp3Questions";
import { createClient } from "@/lib/supabase/client";
import { Footer, Header } from "@/components/lp3/layout";
import { Form, Head, Step } from "@/components/lp3/section";

type Props = {
  button: string;
  companyName: string;
  headerAlt: string;
  headerSrc: string;
  title: string;
};

export function Page({
  button,
  companyName,
  headerAlt,
  headerSrc,
  title,
}: Props) {
  const isSubmitting = useRef(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [addressData, setAddressData] = useState<{
    prefecture: string;
    city: string;
    town: string;
  } | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    birth_year: "",
    zip_code: "",
    address: "",
    phone_number: "",
  });
  const [redirectUrl, setRedirectUrl] = useState("");
  const [step, setStep] = useState(0);

  const stepLength = 4;

  const updateData = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newFormData = {
      ...formData,
      [name]: value,
    };

    if (name === "zip_code") {
      const addressData = await getAddressFromZipCode(value);
      if (addressData) {
        newFormData.address =
          addressData.prefecture + addressData.city + addressData.town;
      } else {
        newFormData.address = "";
      }
      setAddressData(addressData);
    }
    setFormData(newFormData);

    const countFilledFields = Object.entries(newFormData).filter(
      ([key, value]) => key !== "address" && value !== ""
    ).length;

    setStep(countFilledFields);
  };

  const sendNotification = async () => {
    // 通知先のユーザーID
    const userId = "U081BU7VACU";
    try {
      const res = await fetch("/api/slack/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `<@${userId}>\n【株式会社貴瞬エントリーフォームから流入がありました】\n送信日時：${formatDate(new Date())}\nお名前:${formData.name}\n生まれ年：${formData.birth_year}\n郵便番号：${formData.zip_code}\n住所：${formData.address}\n電話番号：${formData.phone_number}\n流入元URL：${currentUrl}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("通知が送信されました！");
      } else {
        console.log("エラー: " + data.error);
      }
    } catch (error) {
      console.log("通知送信中にエラーが発生しました！");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    if (!currentUrl.includes("fbclid=")) {
      await sendNotification();
      const params = new URLSearchParams({
        referrerUrl: currentUrl,
      });
      const newRedirectUrl = `https://gateway.lreach.jp?${params.toString()}`;
      setRedirectUrl(newRedirectUrl);

      setTimeout(() => {
        linkRef.current?.click();
      }, 100);
      return;
    }

    const { addQuestionsData, addAnswersData } = formatDataForSupabase(
      LP3Data.question_data,
      formData
    );

    // APIルート経由でデータを保存
    const response = await fetch('/api/lp3/save-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData,
        questionData: addQuestionsData,
        lpKey: "lp3",
        referrerUrl: currentUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('データの保存に失敗しました:', errorData.error);
      alert("登録に失敗しました。確認して再度お試しください。");
      isSubmitting.current = false;
      return;
    }

    const result = await response.json();
    const answerId = result.lp3_answers_id;
    const questionId = result.lp3_questions_id;
    const lpSessionsId = result.lp_sessions_id;
    const usersId = result.users_id;

    await sendNotification();
    const params = new URLSearchParams({
      lp3AnswersId: answerId.toString(),
      lpSessionsId,
      referrerUrl: currentUrl,
      usersId,
    });
    const newRedirectUrl = `https://gateway.lreach.jp?${params.toString()}`;
    setRedirectUrl(newRedirectUrl);

    setTimeout(() => {
      linkRef.current?.click();
    }, 100);
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const handlePagehide = () => {
      if (isSubmitting.current) return;
      if (!currentUrl.includes("fbclid=")) return;

      const { addQuestionsData, addAnswersData } = formatDataForSupabase(
        LP3Data.question_data,
        formData
      );
      const data = {
        question_data: addQuestionsData,
        answers_data: {
          ...addAnswersData,
          is_submitted: false,
        },
      };
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });

      navigator.sendBeacon("/api/supabase/create?page=lp3", blob);
    };

    window.addEventListener("pagehide", handlePagehide);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
    };
  }, [currentUrl, formData]);

  return (
    <>
      <Header alt={headerAlt} src={headerSrc} />
      <main className="bg-gray-50 pb-12">
        <Head companyName={companyName} title={title} />
        <Step step={step} stepLength={stepLength} />
        <Form
          addressData={addressData}
          button={button}
          formData={formData}
          isSubmitting={isSubmitting.current}
          linkRef={linkRef}
          questionData={LP3Data.question_data}
          redirectUrl={redirectUrl}
          submit={submit}
          updateData={updateData}
        />
      </main>
      <Footer />
    </>
  );
}
