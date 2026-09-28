"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { formatDate, getAddressFromZipCode } from "@/utils";

import { createClient } from "@/lib/supabase/client";
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
  const [currentUrl, setCurrentUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    birth_year: "",
    zip_code: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  // フォームデータが有効かどうか
  const isFormValid = useMemo(() => {
    return Object.values(formData).every((v) => v && v.trim() !== "");
  }, [formData]);

  // リダイレクトURLを取得
  const getRedirectUrl = (lpSessionsId: string, usersId: string) => {
    const params = new URLSearchParams({
      lpSessionsId,
      referrerUrl: currentUrl,
      usersId,
    });
    
    switch (id) {
      default:
        return `https://gateway.lreach.jp?${params.toString()}`;
    }
  };

  // フォームデータを更新
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

  // Supabaseにデータを保存
  const saveData = async () => {
    try {
      // APIルート経由でデータを保存
      const response = await fetch('/api/lp/save-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          lpKey: `mm-lp01a-${id}`,
          referrerUrl: currentUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('データの保存に失敗しました:', errorData.error);
        return false;
      }

      const result = await response.json();
      return {
        lp_sessions_id: result.lp_sessions_id,
        users_id: result.users_id,
      };
    } catch (error) {
      console.error("Supabaseにデータ保存中にエラーが発生しました！", error);
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
          channel: "C09KBLAH61E",
          text: [
            "【株式会社MAGMA_LPに回答しました】",
            `回答日時：${formatDate(new Date())}`,
            `お名前：${formData.name}`,
            `生まれ年：${formData.birth_year}`,
            `郵便番号：${formData.zip_code}`,
            `住所：${formData.address}`,
            `電話番号：${formData.phone}`,
            `流入CR：${window.location.href}`,
            "",
            "【株式会社MAGMA】LP入力内容管理シート",
            "https://docs.google.com/spreadsheets/d/1x43UoKXxFvEgqvKuspt28Cs1is7JixCeIbfgNxr3xAE/edit?usp=sharing",
          ].join("\n"),
        }),
      });

      const data = await res.json();
      if (res.status !== 200) {
        console.error("エラー: " + data.error);
        return false;
      }

      return true;
    } catch (error) {
      console.log("Slack通知送信中にエラーが発生しました！");
      return false;
    }
  };

  // スプレッドシートにデータを送信
  const sendSpreadsheet = async () => {
    try {
      const res = await fetch("/api/spreadsheet/mm/lp01a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, referral_cr: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("エラー: " + data.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("スプレッドシートのデータ送信中にエラーが発生しました！");
      return false;
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const [data, notification, spreadsheet] = await Promise.all([
        saveData(),
        sendNotification(),
        sendSpreadsheet(),
      ]);

      if (data && notification && spreadsheet) {
        setRedirectUrl(getRedirectUrl(data.lp_sessions_id, data.users_id));
        setTimeout(() => {
          linkRef.current?.click();
          setIsSubmitting(false);
        }, 500);
      } else {
        throw new Error("エントリーに失敗しました");
      }
    } catch {
      alert("エントリーに失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gray-50 pb-6">
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
