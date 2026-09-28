"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { formatDate, getAddressFromZipCode } from "@/utils";

import { MaxWidth } from "@/components/common";
import { Input } from "@/app/ht/lp02a/[id]/_components/form/Input";
import { Submit } from "@/app/ht/lp02a/[id]/_components/form/Submit";

interface AddressData {
  prefecture: string;
  city: string;
  town: string;
}

interface FormData {
  name: string;
  birth_year: string;
  zip_code: string;
  address: string;
  phone: string;
}

interface Props {
  id: string;
  updateStep: (newStep: number) => void;
}

export function Form({ id, updateStep }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [addressData, setAddressData] = useState<AddressData>({
    prefecture: "",
    city: "",
    town: "",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    birth_year: "",
    zip_code: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  /* フォームデータが有効かどうか */
  const isFormValid = useMemo(() => {
    return Object.values(formData).every((v) => v && v.trim() !== "");
  }, [formData]);

  /* リダイレクトURLを取得 */
  const getRedirectUrl = () => {
    switch (id) {
      default:
        return `/ht/lp02a/thanks/${id}`;
    }
  };

  /* フォームデータを更新 */
  const updateData = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { name, value } = event.target;

    const newFormData: FormData = {
      ...formData,
      [name]: value,
    };

    if (name === "zip_code") {
      const response: AddressData | null = await getAddressFromZipCode(value);
      if (response) {
        newFormData.address =
          response.prefecture + response.city + response.town;
        setAddressData(response);
      } else {
        newFormData.address = "";
        setAddressData({
          prefecture: "",
          city: "",
          town: "",
        });
      }
    }
    setFormData(newFormData);

    const countFilledFields = Object.entries(newFormData).filter(
      ([key, value]) => key !== "address" && value !== ""
    ).length;

    updateStep(countFilledFields);
  };

  // 推定年齢を取得
  const getEstimatedAgeRange = (birthYear: string): string => {
    if (!birthYear) return "（推定不明）";
    const year = Number(birthYear);
    if (isNaN(year)) return "（推定不明）";

    const currentYear = new Date().getFullYear();
    const minAge = currentYear - year - 1;
    const maxAge = currentYear - year;

    const formattedMin = minAge.toLocaleString("ja-JP");
    const formattedMax = maxAge.toLocaleString("ja-JP");

    return `（推定：${formattedMin},${formattedMax}歳）`;
  };

  // メールを送信
  const sendEmail = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "foresma株式会社 <lreach-hrteam@foresma.jp>",
          subject: "【foresma株式会社_架電のご依頼】",
          to: ["k-tozaki@hr-team.co.jp"],
          bcc: ["mcotaro070835@gmail.com", "miurakoutarou@foresma.jp"],
          text: [
            "【foresma株式会社_架電のご依頼】",
            `お名前：${formData.name}`,
            `生まれ年：${formData.birth_year}${getEstimatedAgeRange(formData.birth_year)}`,
            `電話番号：${formData.phone}`,
            `郵便番号：${formData.zip_code}`,
            `住所：${formData.address}`,
            "流入経路：自社採用広告",
            "",
            "スプレッドシートのURL：",
            "https://docs.google.com/spreadsheets/d/14GrVeHcFuWiV0gMgY3NXQ51VLcnyV2jf33z9R8WvtFI/edit?usp=sharing",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("メールが送信されました！");
        return true;
      } else {
        console.log("エラー: " + data.error.json());
        return false;
      }
    } catch (error) {
      console.log("メール送信中にエラーが発生しました！");
      return false;
    }
  };

  // Slackに通知を送信
  const sendNotification = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C09JDUC0PUM",
          text: [
            "【HRteam_自社採用LPに回答しました】",
            `回答日時：${formatDate(new Date())}`,
            `お名前：${formData.name}`,
            `生まれ年：${formData.birth_year}`,
            `郵便番号：${formData.zip_code}`,
            `住所：${formData.address}`,
            `電話番号：${formData.phone}`,
            `流入CR：${window.location.href}`,
            "",
            "【HRteam】自社採用導線_LP入力内容管理シート",
            "https://docs.google.com/spreadsheets/d/14GrVeHcFuWiV0gMgY3NXQ51VLcnyV2jf33z9R8WvtFI/edit?usp=sharing",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log("Slack通知が送信されました！");
        return true;
      } else {
        console.log("エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("Slack通知送信中にエラーが発生しました！");
      return false;
    }
  };

  // スプレッドシートにデータを送信
  const sendSpreadsheet = async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/spreadsheet/ht/lp02a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, referral_cr: id }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("スプレッドシートのデータが送信されました！");
        return true;
      } else {
        console.log("エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("スプレッドシートのデータ送信中にエラーが発生しました！");
      return false;
    }
  };

  /* フォーム送信 */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const notification = await sendNotification();

      if (notification) {
        setRedirectUrl(getRedirectUrl());
        setTimeout(() => {
          linkRef.current?.click();
        }, 500);
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch {
      console.error("送信に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gray-50">
      <MaxWidth>
        <form className="flex flex-col gap-y-8" onSubmit={handleSubmit}>
          <Input
            label="お名前"
            name="name"
            onChange={updateData}
            placeholder="山田太郎"
            required={true}
            type="text"
            value={formData.name}
          />
          <Input
            inputMode="numeric"
            label="生まれ年"
            maxLength={4}
            name="birth_year"
            onChange={updateData}
            pattern="\d{4}"
            placeholder="2000"
            required={true}
            type="text"
            value={formData.birth_year}
          />
          <Input
            addressData={addressData}
            inputMode="numeric"
            label="郵便番号(ハイフンなし)"
            maxLength={7}
            name="zip_code"
            onChange={updateData}
            pattern="\d{7}"
            placeholder="1234567"
            required={true}
            type="text"
            value={formData.zip_code}
          />
          <Input
            inputMode="tel"
            label="電話番号(ハイフンなし)"
            maxLength={11}
            name="phone"
            onChange={updateData}
            pattern="\d{11}"
            placeholder="08012345678"
            required={true}
            type="tel"
            value={formData.phone}
          />
          <Submit disabled={!isFormValid} isSubmitting={isSubmitting} />
          <p className="text-center text-2xs">
            「今すぐエントリーする」ボタンをタップすると
            <br />
            <a
              className="text-blue-500 underline"
              href="https://brick-snowdrop-428.notion.site/1f858c60cd4180c5b875da7670ab0bfd"
              target="_blank"
            >
              プライバシーポリシー
            </a>
            に同意したものとします。
          </p>
          <a className="hidden" href={redirectUrl} ref={linkRef} />
        </form>
      </MaxWidth>
    </section>
  );
}
