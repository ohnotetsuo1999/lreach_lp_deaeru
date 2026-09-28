"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { formatDate, getAddressFromZipCode } from "@/utils";

import { MaxWidth } from "@/components/common";
import { Input } from "@/app/ht/lp01a/[id]/_components/form/Input";
import { Submit } from "@/app/ht/lp01a/[id]/_components/form/Submit";

interface Props {
  id: string;
  updateStep: (newStep: number) => void;
}

export function Form({ id, updateStep }: Props) {
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

  const getRedirectUrl = () => {
    // シンプル化: lpパラメータにidをそのまま使用（lpコードの個別値は使われていないため）
    return `https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=${id}&liff_id=1657369789-lBbpzk0w`;

    // 旧実装（念のためコメントアウトで保持）
    // switch (id) {
    //   case "001":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=ih4NIB&liff_id=1657369789-lBbpzk0w";
    //   case "002":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=G0D4WT&liff_id=1657369789-lBbpzk0w";
    //   case "003":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=Wk3Hdx&liff_id=1657369789-lBbpzk0w";
    //   case "004":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=dWtOT2&liff_id=1657369789-lBbpzk0w";
    //   case "005":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=ZN6gnp&liff_id=1657369789-lBbpzk0w";
    //   case "006":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=rZWJwM&liff_id=1657369789-lBbpzk0w";
    //   case "007":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=rj9s1m&liff_id=1657369789-lBbpzk0w";
    //   case "008":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=UsJoZo&liff_id=1657369789-lBbpzk0w";
    //   case "009":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=TeCyQ3&liff_id=1657369789-lBbpzk0w";
    //   case "010":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=nUKrX6&liff_id=1657369789-lBbpzk0w";
    //   case "011":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=jweost&liff_id=1657369789-lBbpzk0w";
    //   case "012":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=cf2flA&liff_id=1657369789-lBbpzk0w";
    //   case "013":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=KhoKMw&liff_id=1657369789-lBbpzk0w";
    //   case "014":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=XWjdNB&liff_id=1657369789-lBbpzk0w";
    //   case "015":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=EXXxVW&liff_id=1657369789-lBbpzk0w";
    //   case "016":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=B2Q99c&liff_id=1657369789-lBbpzk0w";
    //   case "017":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=BxrQFw&liff_id=1657369789-lBbpzk0w";
    //   case "018":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=nWeubw&liff_id=1657369789-lBbpzk0w";
    //   case "019":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=H84BuW&liff_id=1657369789-lBbpzk0w";
    //   case "020":
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=cc7XcF&liff_id=1657369789-lBbpzk0w";
    //   default:
    //     return "https://liff.line.me/1657369789-lBbpzk0w/landing?follow=%40239zjmqs&lp=test&liff_id=1657369789-lBbpzk0w";
    // }
  };

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

    updateStep(countFilledFields);
  };

  // 推定年齢を取得
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

  // メールを送信
  // 使わないのでコメントアウト（lp02a,lp03aも同じく
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
        console.log("エラー: " + data.error.json());
        return false;
      }
    } catch (error) {
      console.log("メール送信中にエラーが発生しました！");
      return false;
    }
  };

  // Slackに通知を送信
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
            `流入CR：${window.location.href}`,
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
        console.log("エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("Slack通知送信中にエラーが発生しました！");
      return false;
    }
  };

  // スプレッドシートにデータを送信
  // 使わないのでコメントアウト（lp02a,lp03aも同じく）
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
        console.log("エラー: " + data.error);
        return false;
      }
    } catch (error) {
      console.log("スプレッドシートのデータ送信中にエラーが発生しました！");
      return false;
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const notification = await sendNotification();

      if (notification) {
        setRedirectUrl(getRedirectUrl());
        setTimeout(() => {
          linkRef.current?.click();
          setIsSubmitting(false);
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
        <form className="flex flex-col gap-y-8" onSubmit={submit}>
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
