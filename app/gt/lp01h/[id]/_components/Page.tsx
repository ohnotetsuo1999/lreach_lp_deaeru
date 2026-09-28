"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { formatDate } from "@/utils";

import { createClient } from "@/lib/supabase/client";
import { Footer, Header } from "@/app/gt/lp01h/[id]/_components/layout";
import {
  Condition,
  Info,
  Intro,
} from "@/app/gt/lp01h/[id]/_components/section";
import { LoadingModal } from "@/app/gt/lp01h/[id]/_components/ui";
import { FormData } from "@/app/gt/lp01h/[id]/_types";

interface SendSpreadsheetParams {
  formData: FormData;
  id: string;
}

interface GetRedirectUrlParams {
  lpSessionsId: string;
  usersId: string;
}

interface Props {
  id: string;
  uuid?: string;
}

/* 回答数を取得 */
function getAnsweredQuestions(formData: FormData): number {
  let count = 0;

  for (const key in formData) {
    switch (typeof formData[key as keyof FormData]) {
      case "string":
        if (formData[key as keyof FormData] !== "") count++;
        break;
      case "object":
        if (formData[key as keyof FormData].length !== 0) count++;
        break;
    }
  }

  return count;
}

/* すべての必須項目が入力されているかチェック */
function isAllFieldsFilled(formData: FormData): boolean {
  return (
    formData.birth_year !== "" &&
    formData.full_name !== "" &&
    formData.gender !== "" &&
    formData.phone_number !== "" &&
    formData.preferred_annual_income !== "" &&
    formData.preferred_job_category !== "" &&
    formData.preferred_work_location.length > 0 &&
    formData.preferred_work_style !== ""
  );
}

/* 対象の要素へスクロール */
function scrollToRef(ref: RefObject<HTMLDivElement | null>): void {
  if (!ref.current) return;
  ref.current.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* Introのスクロール率を計算 */
function calculateIntroScrollRate(
  currentScrollY: number,
  maxScrollY: number
): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}

/* Slackに通知を送信 */
async function sendNotification(formData: FormData): Promise<boolean> {
  try {
    const res = await fetch("/api/slack/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "C09KBLBKR08",
        text: [
          "【逆転転職_LPに回答しました】",
          `回答日時：${formatDate(new Date())}`,
          `お名前：${formData.full_name}`,
          `性別：${formData.gender}`,
          `生まれ年：${formData.birth_year}`,
          `希望勤務地：${formData.preferred_work_location.join(", ")}`,
          `電話番号：${formData.phone_number}`,
          `希望勤務スタイル：${formData.preferred_work_style}`,
          `希望年収：${formData.preferred_annual_income}`,
          `希望職種：${formData.preferred_job_category}`,
          `流入CR：${window.location.href}`,
          "",
          "【逆転転職】LP入力内容管理シート",
          "https://lreach-prototype.vercel.app/call-targets",
          "",
          "【逆転転職】Lリーチ HUB",
          "https://lreach-hub.vercel.app/",
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
    console.error("Slack通知送信中にエラーが発生しました！");
    return false;
  }
}

/* スプレッドシートにデータを送信 */
async function sendSpreadsheet({
  formData,
  id,
}: SendSpreadsheetParams): Promise<boolean> {
  try {
    const res = await fetch("/api/spreadsheet/gt/lp01a", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        lp_number: "lp01h",
        referral_cr: id,
      }),
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
}

/* ステップの長さ */
const STEP_LENGTH = 2;

export function Page({ id, uuid }: Props) {
  const birthYearRef = useRef<HTMLDivElement>(null);
  const fullNameRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const phoneNumberRef = useRef<HTMLDivElement>(null);
  const preferredAnnualIncomeRef = useRef<HTMLDivElement>(null);
  const preferredJobCategoryRef = useRef<HTMLDivElement>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement>(null);
  const preferredWorkStyleRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const introScrollRateRef = useRef<number>(0);

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    birth_year: "",
    full_name: "",
    gender: "",
    phone_number: "",
    preferred_annual_income: "",
    preferred_job_category: "",
    preferred_work_location: [],
    preferred_work_style: "",
  });
  const [inflowDatetime, setInflowDatetime] = useState<string>("");
  const [isCta1Submitted, setIsCta1Submitted] = useState<boolean>(false);
  const [isCta2Submitted, setIsCta2Submitted] = useState<boolean>(false);
  const [isIntroVisible, setIsIntroVisible] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  /* ページ読み込み時に実行 */
  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));
  }, []);

  /* Intro表示中のスクロール量を取得して保持 */
  useEffect(() => {
    // Intro表示中のみスクロール量を記録
    if (!isIntroVisible) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      // Intro表示中の最大スクロール量を更新
      introScrollYRef.current = currentScrollY;
      introMaxScrollYRef.current = maxScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isIntroVisible]);

  /* ページ離脱時にスプレッドシートにデータを送信 */
  useEffect(() => {
    const handlePagehide = () => {
      if (isSubmitting) return;

      const actionStatisticsBlob = new Blob(
        [
          JSON.stringify({
            ...formData,
            inflow_datetime: inflowDatetime,
            current_url: currentUrl,
            staying_time: getStayingTime(),
            intro_scroll_y: introScrollYRef.current,
            intro_scroll_rate: `${calculateIntroScrollRate(introScrollYRef.current, introMaxScrollYRef.current)}%`,
            is_cta_1_submitted: isCta1Submitted,
            is_cta_2_submitted: isCta2Submitted,
            is_cta_3_submitted: false,
          }),
        ],
        {
          type: "application/json",
        }
      );

      navigator.sendBeacon(
        "/api/spreadsheet/gt/action-statistics",
        actionStatisticsBlob
      );
    };

    window.addEventListener("pagehide", handlePagehide);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
    };
  });

  /* 滞在時間を取得（秒単位） */
  function getStayingTime(): number {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }

  /* フォームデータ更新 */
  function updateFormData(
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;

    switch (name) {
      case "preferred_work_location":
        const { selectedOptions } = target as HTMLSelectElement;
        const values = Array.from(selectedOptions).map(
          (option) => option.value
        );
        setFormData((prev) => ({ ...prev, [name]: values }));
        break;

      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
    }

    switch (name) {
      case "birth_year":
        scrollToRef(preferredWorkLocationRef);
        break;

      case "full_name":
        scrollToRef(genderRef);
        break;

      case "gender":
        scrollToRef(birthYearRef);
        break;

      case "preferred_work_location":
        scrollToRef(phoneNumberRef);
        break;

      case "preferred_annual_income":
        scrollToRef(preferredJobCategoryRef);
        break;

      case "preferred_work_style":
        scrollToRef(preferredAnnualIncomeRef);
        break;
    }
  }

  /* イントロ画面の表示を更新 */
  function updateIsIntroVisible(isIntroVisible: boolean): void {
    // Intro終了時のスクロール率を計算
    if (!isIntroVisible) {
      // 最後に記録されたIntro表示中のスクロール情報を使用
      const currentScrollY = introScrollYRef.current;
      const maxScrollY = introMaxScrollYRef.current;

      // スクロール率を計算（最大スクロール量が0の場合は0%とする）
      if (maxScrollY > 0) {
        introScrollRateRef.current = Math.round(
          (currentScrollY / maxScrollY) * 100
        );
      } else {
        introScrollRateRef.current = 0;
      }
    }
    setIsIntroVisible(isIntroVisible);
  }

  /* CTA1の送信状態を更新 */
  function updateIsCta1Submitted(isCta1Submitted: boolean): void {
    setIsCta1Submitted(isCta1Submitted);
  }

  /* CTA2の送信状態を更新 */
  function updateIsCta2Submitted(isCta2Submitted: boolean): void {
    setIsCta2Submitted(isCta2Submitted);
  }

  /* ステップを更新 */
  function updateStep(newStep: number): void {
    setStep(newStep);
  }

  /* LP行動集計シートにデータを送信 */
  async function sendActionStatisticsSpreadsheet(): Promise<boolean> {
    if (!startTimeRef.current) return false;

    try {
      const res = await fetch("/api/spreadsheet/gt/action-statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inflow_datetime: inflowDatetime,
          current_url: currentUrl,
          staying_time: getStayingTime(),
          intro_scroll_y: introScrollYRef.current,
          intro_scroll_rate: `${calculateIntroScrollRate(introScrollYRef.current, introMaxScrollYRef.current)}%`,
          is_cta_1_submitted: isCta1Submitted,
          is_cta_2_submitted: isCta2Submitted,
          is_cta_3_submitted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("エラー: " + data.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("LP行動集計シートのデータ送信中にエラーが発生しました！");
      return false;
    }
  }

  /* Supabaseにデータを保存 */
  async function saveDataToSupabase(): Promise<
    | {
        lp_sessions_id: string;
        users_id: string;
      }
    | false
  > {
    try {
      console.log("[Supabase保存] 開始 - formData:", formData);

      // まずusersを作成
      const { data: usersData, error: usersError } = await createClient()
        .from("users")
        .insert({ created_at: new Date().toISOString() })
        .select("*");

      if (usersError) {
        console.error("[Supabase保存] usersエラー:", usersError);
        alert(`usersエラー: ${usersError.message}`);
        return false;
      }

      console.log("[Supabase保存] users作成成功:", usersData);
      const { id: usersId } = usersData[0];

      // usersのIDを使ってlp_sessionsとusers_infoを保存
      console.log("[Supabase保存] lp_sessionsとusers_info保存開始");

      const [lpSessions, usersInfo] = await Promise.all([
        createClient()
          .from("lp_sessions")
          .insert({
            answers: formData,
            is_submitted: true,
            lp_key: uuid ?? `gt-lp01h-${id}`,
            referrer_url: currentUrl,
            user_id: usersId,
          })
          .select("*"),
        createClient()
          .from("users_info")
          .insert({
            birthyear: formData.birth_year,
            name: formData.full_name,
            phone_number: formData.phone_number,
            users_id: usersId,
          })
          .select("*"),
      ]);

      console.log("[Supabase保存] Promise.all完了");

      const { data: lpSessionsData, error: lpSessionsError } = lpSessions;
      const { error: usersInfoError } = usersInfo;

      if (lpSessionsError) {
        console.error("[Supabase保存] lp_sessionsエラー:", lpSessionsError);
        alert(`lp_sessionsエラー: ${lpSessionsError.message} (code: ${lpSessionsError.code})\ndetails: ${lpSessionsError.details}`);
        return false;
      }
      if (usersInfoError) {
        console.error("[Supabase保存] users_infoエラー:", usersInfoError);
        alert(`users_infoエラー: ${usersInfoError.message}`);
        return false;
      }

      console.log("[Supabase保存] 全保存成功");

      return {
        lp_sessions_id: lpSessionsData[0].id,
        users_id: usersData[0].id,
      };
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      alert(`Supabase例外: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /* リダイレクトURLを取得 */
  function getRedirectUrl({
    lpSessionsId,
    usersId,
  }: GetRedirectUrlParams): string {
    const params = new URLSearchParams({
      lpSessionsId,
      referrerUrl: currentUrl,
      usersId,
    });
    
    switch (id) {
      default:
        return `https://gateway.lreach.jp/gt?${params.toString()}`;
    }
  }

  /* フォーム送信 */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    /* バリデーション */

    /* お名前 */
    /* ローマ字が含まれている場合はNG */
    if (/[a-zA-Z]/.test(formData.full_name)) {
      alert("氏名にローマ字は使用できません。");
      return;
    }
    /* 3文字以上 */
    if (formData.full_name.length < 3) {
      alert("氏名は3文字以上入力してください。");
      return;
    }
    /* 最大文字数制限（20文字） */
    if (formData.full_name.length > 20) {
      alert("氏名は20文字以内で入力してください。");
      return;
    }
    /* 全角カタカナを禁止 */
    if (/[ァ-ヶー]/.test(formData.full_name)) {
      alert("氏名に全角カタカナは使用できません。");
      return;
    }
    /* 半角カタカナを禁止 */
    if (/[ｦ-ﾟ]/.test(formData.full_name)) {
      alert("氏名に半角カタカナは使用できません。全角で入力してください。");
      return;
    }
    /* 特殊記号を禁止 */
    if (/[@#!？・()（）]/.test(formData.full_name)) {
      alert("氏名に特殊記号は使用できません。");
      return;
    }
    /* 絵文字を禁止 */
    if (
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
        formData.full_name
      )
    ) {
      alert("氏名に絵文字は使用できません。");
      return;
    }
    /* 漢字・ひらがな・スペース（全角/半角）のみ許可 */
    if (!/^[一-龯ぁ-ん\s]+$/.test(formData.full_name)) {
      alert("氏名は漢字、ひらがなのみで入力してください。");
      return;
    }

    /* 生まれ年 */
    /* 15〜55歳想定 */
    if (
      Number(formData.birth_year) < 1970 ||
      Number(formData.birth_year) > 2010
    ) {
      alert("正しい生まれ年を入力してください。");
      return;
    }

    /* 電話番号 */
    /* 特定の無効な番号を禁止 */
    const invalidPhoneNumbers = ["07012345678", "08012345678", "09012345678"];
    if (invalidPhoneNumbers.includes(formData.phone_number)) {
      alert("正しい電話番号を入力してください。");
      return;
    }
    /* 同じ数字が6桁以上連続する番号を弾く（実在しない番号の入力を防ぐ） */
    const repeatRule = /(\d)\1{5,}/;
    if (repeatRule.test(formData.phone_number)) {
      alert("正しい電話番号を入力してください。");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log("[LP送信] 開始");

      const [data, notification, spreadsheet, actionStatisticsSpreadsheet] =
        await Promise.all([
          saveDataToSupabase().catch((e) => {
            console.error("[LP送信] Supabase保存エラー:", e);
            throw new Error(`Supabase保存失敗: ${e.message}`);
          }),
          sendNotification(formData).catch((e) => {
            console.error("[LP送信] Slack通知エラー:", e);
            throw new Error(`Slack通知失敗: ${e.message}`);
          }),
          sendSpreadsheet({ formData, id }).catch((e) => {
            console.error("[LP送信] スプレッドシート送信エラー:", e);
            throw new Error(`スプレッドシート送信失敗: ${e.message}`);
          }),
          sendActionStatisticsSpreadsheet().catch((e) => {
            console.error("[LP送信] アクション統計送信エラー:", e);
            throw new Error(`アクション統計送信失敗: ${e.message}`);
          }),
        ]);

      console.log("[LP送信] 全処理完了", { data, notification, spreadsheet, actionStatisticsSpreadsheet });

      if (data && notification && spreadsheet && actionStatisticsSpreadsheet) {
        setRedirectUrl(
          getRedirectUrl({
            lpSessionsId: data.lp_sessions_id,
            usersId: data.users_id,
          })
        );
        setTimeout(() => {
          linkRef.current?.click();
        }, 500);
      } else {
        throw new Error("エントリーに失敗しました");
      }
    } catch (error) {
      console.error("[LP送信] エラー詳細:", error);
      alert("フォームの送信に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  }

  if (isIntroVisible) {
    return (
      <Intro
        updateIsCta1Submitted={updateIsCta1Submitted}
        updateIsIntroVisible={updateIsIntroVisible}
      />
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={isSubmitting ? "pointer-events-none" : ""}>
        <Header getAnsweredQuestions={getAnsweredQuestions} formData={formData} />
        <main className="overflow-x-hidden">
          <div
            className="relative flex min-h-screen bg-gray-50 py-22 transition duration-500 ease-in-out"
            style={{
              transform: `translateX(-${(100 / STEP_LENGTH) * (step - 1)}%)`,
              width: `${STEP_LENGTH * 100}%`,
            }}
          >
            <Condition
              preferredAnnualIncomeRef={preferredAnnualIncomeRef}
              preferredJobCategoryRef={preferredJobCategoryRef}
              preferredWorkStyleRef={preferredWorkStyleRef}
              updateFormData={updateFormData}
            />
            <Info
              birthYearRef={birthYearRef}
              formData={formData}
              fullNameRef={fullNameRef}
              genderRef={genderRef}
              phoneNumberRef={phoneNumberRef}
              preferredWorkLocationRef={preferredWorkLocationRef}
              updateFormData={updateFormData}
            />
          </div>
        </main>
        <Footer
          formData={formData}
          getAnsweredQuestions={getAnsweredQuestions}
          isAllFieldsFilled={isAllFieldsFilled}
          step={step}
          updateIsCta2Submitted={updateIsCta2Submitted}
          updateStep={updateStep}
          isSubmitting={isSubmitting}
        />
        <a className="hidden" href={redirectUrl} ref={linkRef} />
      </form>
      <LoadingModal isLoading={isSubmitting} />
    </>
  );
}
