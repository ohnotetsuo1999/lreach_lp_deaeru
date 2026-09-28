"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { LP3Data } from "@/constants";
import {
  formatDataForSupabase,
  formatDate,
  getAddressFromZipCode,
} from "@/utils";

import { Footer, Header } from "@/components/lp3/layout";
import { Form, Head, Step } from "@/components/lp3/section";

type Props = {
  button: string;
  companyName: string;
  headerAlt: string;
  headerSrc: string;
  id: string;
  title: string;
};

export function Page({
  button,
  companyName,
  headerAlt,
  headerSrc,
  id,
  title,
}: Props) {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const sendBeaconJson = (url: string, data: unknown) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    return navigator.sendBeacon(url, blob);
  };

  const sendNotificationBeacon = () => {
    const ok = sendBeaconJson("/api/slack/notify", {
      message: [
        "【株式会社貴瞬_LPに回答しました】",
        `回答日時：${formatDate(new Date())}`,
        `お名前：${formData.name}`,
        `生まれ年：${formData.birth_year}`,
        `郵便番号：${formData.zip_code}`,
        `住所：${formData.address}`,
        `電話番号：${formData.phone_number}`,
        `流入CR：${window.location.href}`,
        "",
        "【株式会社貴瞬】LP入力内容管理シート",
        "https://docs.google.com/spreadsheets/d/1sq_REknNZ1PTE1o7KCrTZhRfpQuexWqVT0GKYqyNEkE/edit?usp=sharing",
      ].join("\n"),
    });

    if (!ok) console.warn("[LP送信] Slack通知(sendBeacon)のキュー投入に失敗しました");
    return ok;
  };

  const sendSpreadsheetBeacon = () => {
    const ok = sendBeaconJson("/api/spreadsheet/lp04-01", {
      ...formData,
      referral_cr: id,
    });
    if (!ok)
      console.warn(
        "[LP送信] スプレッドシート送信(sendBeacon)のキュー投入に失敗しました"
      );
    return ok;
  };

  /* フォーム送信 */
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
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
          lpKey: `lp04-01-${id}`,
          referrerUrl: currentUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('データの保存に失敗しました:', errorData.error);
        alert("登録に失敗しました。確認して再度お試しください。");
        setIsSubmitting(false);
        return;
      }

      const result = await response.json();
      const answerId = result.lp3_answers_id;
      const questionId = result.lp3_questions_id;
      const lpSessionsId = result.lp_sessions_id;
      const usersId = result.users_id;

      // 送信系（Slack/Spreadsheet）は「遷移を止めない」ためにsendBeaconで非同期送信する
      sendNotificationBeacon();
      sendSpreadsheetBeacon();

      const params = new URLSearchParams({
        lp3AnswersId: answerId.toString(),
        lpSessionsId,
        referrerUrl: currentUrl,
        usersId,
      });
      const newRedirectUrl = `https://gateway.lreach.jp?${params.toString()}`;
      setRedirectUrl(newRedirectUrl);

      // Next/Linkクリックに依存すると環境差で遷移しないケースがあるため、直接遷移する
      window.location.assign(newRedirectUrl);
    } catch {
      alert("エントリーに失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.href);

    const handlePagehide = () => {
      if (isSubmitting) return;
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
  }, [currentUrl, formData, isSubmitting]);

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
          isSubmitting={isSubmitting}
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
