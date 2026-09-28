"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";

import { Container, MaxWidth } from "@/components/common";
import { DualInput } from "@/app/ih/form01a/[id]/_components/form/DualInput";
import { Input } from "@/app/ih/form01a/[id]/_components/form/Input";
import { PreferredAt } from "@/app/ih/form01a/[id]/_components/form/PreferredAt";
import { Submit } from "@/app/ih/form01a/[id]/_components/form/Submit";

interface Props {
  id: string;
}

interface FormDataV1 {
  taste_preference: string;
  entrance_style_preference: string;
  kitchen_style_preference: string;
  works_from_home: string;
  clothing_preference: string;
  hosts_home_parties: string;
  household_income: string;
  budget_estimate: string;
  preferred_areas: string;
  other_requirements: string;
}

export function Form({ id }: Props) {
  const fullNameRef = useRef<HTMLDivElement>(null);
  const dualInputRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [formData, setFormData] = useState({
    preferred_at_1: "",
    preferred_at_2: "",
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [formDataV1, setFormDataV1] = useState<FormDataV1 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  const router = useRouter();

  /* 対象の要素へスクロール */
  const scrollToRef = (ref: RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getRedirectUrl = () => {
    switch (id) {
      case "001":
        return "https://page.line.me/984xglsa";
      case "002":
        return "https://page.line.me/984xglsa";
      case "003":
        return "https://page.line.me/984xglsa";
      case "004":
        return "https://page.line.me/984xglsa";
      case "005":
        return "https://page.line.me/984xglsa";
      case "006":
        return "https://page.line.me/984xglsa";
      case "007":
        return "https://page.line.me/984xglsa";
      case "008":
        return "https://page.line.me/984xglsa";
      case "009":
        return "https://page.line.me/984xglsa";
      case "010":
        return "https://page.line.me/984xglsa";
      default:
        return "https://page.line.me/984xglsa";
    }
  };

  // フォームデータ更新
  const updateFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "preferred_at_1":
      case "preferred_at_2":
        scrollToRef(fullNameRef);
        break;
      case "full_name":
        scrollToRef(dualInputRef);
        break;
    }
  };

  /* ヒートマップ管理スプレッドシートにデータを送信 */
  const sendHeatmapManagementSpreadsheet = async () => {
    try {
      const res = await fetch("/api/spreadsheet/ih/heatmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...formDataV1,
          is_submitted_1: "◯",
          is_submitted_2: "◯",
          referral_cr: id,
        }),
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

  /* 入力内容管理スプレッドシートにデータを送信 */
  const sendInputManagementSpreadsheet = async () => {
    try {
      const res = await fetch("/api/spreadsheet/ih/form01a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...formDataV1, referral_cr: id }),
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

  /* 通知メッセージを設定 */
  const setNotificationMessage = useCallback(() => {
    return [
      "【株式会社一戸不動産_LPに回答しました】",
      "",
      `回答日時：${formatDate(new Date())}`,
      `お名前：${formData.full_name}`,
      `メールアドレス：${formData.email}`,
      `電話番号：${formData.phone_number}`,
      "",
      `第1希望日時：${formData.preferred_at_1}`,
      `第2希望日時：${formData.preferred_at_2}`,
      "",
      `世帯年収：${formDataV1?.household_income ?? ""}`,
      `ご予算：${formDataV1?.budget_estimate ?? ""}`,
      `ご希望のエリア：${formDataV1?.preferred_areas ?? ""}`,
      "",
      `その他ご希望の条件：${formDataV1?.other_requirements ?? ""}`,
      "",
      `好きなテイスト：${formDataV1?.taste_preference ?? ""}`,
      `好きな玄関スタイル：${formDataV1?.entrance_style_preference ?? ""}`,
      `好きなキッチンスタイル：${formDataV1?.kitchen_style_preference ?? ""}`,
      "",
      `自宅で仕事をする機会はあるか：${formDataV1?.works_from_home ?? ""}`,
      `洋服の好み：${formDataV1?.clothing_preference ?? ""}`,
      `自宅で友人を招いてホームパーティーをしたいか：${formDataV1?.hosts_home_parties ?? ""}`,
      "",
      `流入CR：${window.location.href}`,
      "",
      "【一戸不動産様】LP入力内容管理シート",
      "https://docs.google.com/spreadsheets/d/1LO_b00Jm1RHOOhKycJtfynFdVUqD2pGZnRAC3uMHr80/edit?usp=sharing",
      "",
      "【一戸不動産様】ヒートマップ管理シート",
      "https://docs.google.com/spreadsheets/d/1H0DyltoxdkS4Mf44Tz7dL8Mrk_Aj5fCNdDbLfC6xmuE/edit?usp=sharing",
    ].join("\n");
  }, [formData, formDataV1]);

  /* Slackに通知を送信 */
  const sendNotification = async () => {
    if (!formDataV1) return false;
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C09KBL6TCE4",
          text: setNotificationMessage(),
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

  /* フォーム送信 */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const form = e.currentTarget;

    /* すべての入力要素を取り出して */
    const controls = Array.from(
      form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")
    );

    /* 最初の不正要素を自前で判定 */
    const invalid = controls.find((el) => !el.checkValidity());
    if (invalid) {
      const target =
        (invalid.closest("[data-field]") as HTMLElement) ?? invalid;

      /* rAFでタイミングを合わせるとiOSで安定 */
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        invalid.focus?.({ preventScroll: true });
        invalid.reportValidity?.();
      });
      setIsSubmitting(false);
      return;
    }

    /* 送信処理 */
    try {
      const [
        heatmapManagementSpreadsheet,
        inputManagementSpreadsheet,
        notification,
      ] = await Promise.all([
        sendHeatmapManagementSpreadsheet(),
        sendInputManagementSpreadsheet(),
        sendNotification(),
      ]);

      if (
        heatmapManagementSpreadsheet &&
        inputManagementSpreadsheet &&
        notification
      ) {
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

  useEffect(() => {
    const raw = sessionStorage.getItem("form:v1");
    if (!raw) {
      router.push(`/ih/lp01a/${id}`);
      return;
    }
    setFormDataV1(JSON.parse(raw));
    sessionStorage.removeItem("form:v1");
  }, [id, router]);

  /* ページ離脱時にスプレッドシートにデータを送信 */
  useEffect(() => {
    const handlePagehide = () => {
      if (window.location.href.includes("localhost") || isSubmitting) return;

      const heatmapBlob = new Blob(
        [
          JSON.stringify({
            ...formData,
            ...formDataV1,
            is_submitted_1: "◯",
            referral_cr: id,
          }),
        ],
        {
          type: "application/json",
        }
      );

      navigator.sendBeacon("/api/spreadsheet/ih/heatmap", heatmapBlob);
    };

    window.addEventListener("pagehide", handlePagehide);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
    };
  }, [formData, formDataV1, id, isSubmitting, setNotificationMessage]);

  return (
    <section className="relative  ">
      <MaxWidth>
        <div className="bg-[rgb(255,249,238)] pb-10 pt-[19px]">
          <Container width="80">
            <form
              className="flex flex-col gap-[22px]"
              noValidate
              onSubmit={handleSubmit}
            >
              <PreferredAt
                label="お受け取り希望日時を<br />お選びください！"
                name_1="preferred_at_1"
                name_2="preferred_at_2"
                onChange={updateFormData}
                required_1={true}
                required_2={true}
                subLabel="＼オンラインで直接お渡し／"
                value_1={formData.preferred_at_1}
                value_2={formData.preferred_at_2}
              />
              <Input
                label="お名前"
                name="full_name"
                onChange={updateFormData}
                placeholder="山田　太郎"
                ref={fullNameRef}
                required={true}
              />
              <DualInput
                label="ご連絡用の<br />メールアドレス・電話番号"
                name_1="email"
                name_2="phone_number"
                onChange={updateFormData}
                placeholder_1="メールアドレスを入力してください"
                placeholder_2="電話番号を入力してください"
                ref={dualInputRef}
                required_1={true}
                required_2={true}
              />
              <Submit isSubmitting={isSubmitting} />
              <a className="hidden" href={redirectUrl} ref={linkRef} />
            </form>
          </Container>
        </div>
      </MaxWidth>
    </section>
  );
}
