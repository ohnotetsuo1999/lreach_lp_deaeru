"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { formatDate, getAddressFromZipCode } from "@/utils";

import { MaxWidth } from "@/components/common";
import { Input } from "@/app/ht/lp03a/[id]/_components/form/Input";
import { Submit } from "@/app/ht/lp03a/[id]/_components/form/Submit";


interface Props {
  id: string;
  updateStep: (newStep: number) => void;
}



export function Form({ id, updateStep }: Props) {
  // テストするときだけ false にする
  const IS_NOTIFICATION_ON = true;

  const linkRef = useRef<HTMLAnchorElement>(null);

  const [addressData, setAddressData] = useState<{
    prefecture: string;
    city: string;
    town: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    birth_year: "",
    zip_code: "",
    address: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const isFormValid = useMemo(() => {
    return Object.values(formData).every((v) => v && v.trim() !== "");
  }, [formData]);

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

    // 入力済みの項目数でステップ更新
    const countFilledFields = Object.entries(newFormData).filter(
      ([key, value]) => key !== "address" && value !== ""
    ).length;
    updateStep(countFilledFields);
  };

  // 推定年齢（メール本文に使うやつ）
  const getEstimatedAgeRange = (birthYear: string) => {
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

  // ここから送信系の関数たち ---------------------------------
  const sendEmail = async () => {
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
            "流入経路：株式会社貴瞬広告",
            "",
            "スプレッドシートのURL：",
            "https://docs.google.com/spreadsheets/d/1IdhUdAPjG5f3PFi8Lv87TDcrNbRZgHYhKZsCpFMNi1E/edit?gid=436002199#gid=436002199",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("メールが送信されました！");
        return true;
      } else {
        console.log("メール送信エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("メール送信中にエラーが発生しました！", error);
      return false;
    }
  };

  const sendNotification = async () => {
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C09JDUC0PUM",
          text: [
            "【HRteam_貴瞬LPに回答しました】",
            `回答日時：${formatDate(new Date())}`,
            `お名前：${formData.name}`,
            `生まれ年：${formData.birth_year}`,
            `郵便番号：${formData.zip_code}`,
            `住所：${formData.address}`,
            `電話番号：${formData.phone}`,
            `流入CR：${typeof window !== "undefined" ? window.location.href : ""}`,
            "",
            "【HRteam】株式会社貴瞬導線_LP入力内容管理シート",
            "https://docs.google.com/spreadsheets/d/1IdhUdAPjG5f3PFi8Lv87TDcrNbRZgHYhKZsCpFMNi1E/edit?usp=sharing",
          ].join("\n"),
        }),
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log("Slack通知が送信されました！");
        return true;
      } else {
        console.log("Slack通知エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("Slack通知送信中にエラーが発生しました！", error);
      return false;
    }
  };

  const sendSpreadsheet = async () => {
    try {
      const res = await fetch("/api/spreadsheet/ht/lp01a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, referral_cr: id }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("スプレッドシートのデータが送信されました！");
        return true;
      } else {
        console.log("スプレッドシート送信エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("スプレッドシート送信中にエラーが発生しました！", error);
      return false;
    }
  };
  // --------------------------------------------------------

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // 通知ONのときだけ送る（テストのときはfalseにしておく）
      if (IS_NOTIFICATION_ON) {
        await sendNotification();
      }

      // LINEに遷移させる
      const lineUrl =
        "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=4RBlTd&liff_id=1657369789-lBbpzk0w";
      setRedirectUrl(lineUrl);

      // hiddenのaをクリックして飛ばす
      setTimeout(() => {
        linkRef.current?.click();
      }, 300);
    } catch (error) {
      console.error("送信中にエラーが発生しました:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gray-50">
      <MaxWidth>
        <form className="flex flex-col gap-y-8" onSubmit={submit}>
          <Input
            label="お名前"
            name="name"
            onChange={updateData}
            placeholder="山田太郎"
            required
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
            required
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
            required
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
            required
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

          {/* ここでLINEに飛ばす */}
          <a className="hidden" href={redirectUrl} ref={linkRef} />
        </form>
      </MaxWidth>
    </section>
  );
}

