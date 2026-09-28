"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { formatDate } from "@/utils";
import { useTwilioPhoneValidation, normalizePhoneNumber } from "@/hooks/usePhoneValidation";
import { useNameValidation, validateNameFields } from "@/hooks/useNameValidation";

import { createClient } from "@/lib/supabase/client";
import { Header } from "@/app/deaeru/form01a/_components/layout";
import { Footer } from "./layout";
import {
  Condition,
  Info,
} from "@/app/deaeru/form01a/_components/section";
import { Intro } from "./section";
import { LoadingModal } from "@/app/deaeru/form01a/_components/ui";
import { FormData } from "@/app/deaeru/form01a/_types";

interface GetRedirectUrlParams {
  lpSessionsId: string;
  usersId: string;
}

interface Props {
  id: string;
  uuid?: string;
  skipIntro?: boolean;
}

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

function scrollToRef(ref: RefObject<HTMLDivElement | null>): void {
  if (!ref.current) return;
  ref.current.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

const STEP_LENGTH = 2;

function buildFullName(lastName: string, firstName: string): string {
  const normalizedLastName = lastName.trim();
  const normalizedFirstName = firstName.trim();

  if (normalizedLastName === "" || normalizedFirstName === "") {
    return "";
  }

  return `${normalizedLastName} ${normalizedFirstName}`;
}

function convertAgeToBirthYear(age: string): string {
  const numericAge = Number(age);
  if (!Number.isInteger(numericAge) || numericAge < 20 || numericAge > 29) {
    return age;
  }

  const currentYear = new Date().getFullYear();
  return String(currentYear - numericAge);
}

function calculateIntroScrollRate(
  currentScrollY: number,
  maxScrollY: number
): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}

export function Page({ id, uuid, skipIntro = false }: Props) {
  const birthYearRef = useRef<HTMLDivElement>(null);
  const fullNameRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const phoneNumberRef = useRef<HTMLDivElement>(null);
  const preferredAnnualIncomeRef = useRef<HTMLDivElement>(null);
  const preferredJobCategoryRef = useRef<HTMLDivElement>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement>(null);
  const preferredWorkStyleRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);

  const [currentUrl, setCurrentUrl] = useState<string>("");
  const linkRef = useRef<HTMLAnchorElement>(null);
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
  const [isIntroVisible, setIsIntroVisible] = useState<boolean>(!skipIntro);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [nameData, setNameData] = useState<{ first_name: string; last_name: string }>({
    first_name: "",
    last_name: "",
  });
  const { nameError, handleNameBlur } = useNameValidation(nameData);
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const { phoneError, isPhoneValidating, handlePhoneBlur } =
    useTwilioPhoneValidation({
      onPhoneChange: (phone) =>
        setFormData((prev) => ({ ...prev, phone_number: phone })),
    });

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));
  }, []);

  useEffect(() => {
    if (!isIntroVisible) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight;

      introScrollYRef.current = currentScrollY;
      introMaxScrollYRef.current = maxScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isIntroVisible]);

  useEffect(() => {
    const sendBeaconData = () => {
      if (isSubmitting) return;
      if (hasSentBeaconRef.current) {
        console.log("[行動集計] 既に送信済みのためスキップ");
        return;
      }

      hasSentBeaconRef.current = true;

      console.log("[行動集計] sendBeacon送信開始", {
        currentUrl,
        inflowDatetime,
        staying_time: getStayingTime(),
      });

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

      const result = navigator.sendBeacon(
        "/api/spreadsheet/gt/action-statistics",
        actionStatisticsBlob
      );

      console.log("[行動集計] sendBeacon送信結果:", result);
    };

    const handlePagehide = () => {
      console.log("[行動集計] pagehideイベント発火");
      sendBeaconData();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("[行動集計] visibilitychangeイベント発火（hidden）");
        sendBeaconData();
      }
    };

    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [formData, inflowDatetime, currentUrl, isCta1Submitted, isCta2Submitted, isSubmitting]);

  function getStayingTime(): number {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }

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

  async function sendNotification(formData: FormData): Promise<boolean> {
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C0ACG4U5G68",
          text: [
            "【出会えるエージェント_LPに回答しました】",
            `流入名：#出会えるエージェント`,
            `回答日時：${formatDate(new Date())}`,
            `お名前：${formData.full_name}`,
            `性別：${formData.gender}`,
            `生まれ年：${formData.birth_year}`,
            `希望勤務地：${formData.preferred_work_location.join(", ")}`,
            `電話番号：${formData.phone_number}`,
            `希望勤務スタイル：${formData.preferred_work_style}`,
            `希望年収：${formData.preferred_annual_income}`,
            `希望職種：${formData.preferred_job_category}`,
            `流入経路：${id === "ws" ? "自然流入" : ""}`,
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

  function updateFormData(
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const { name, value } = target;
    let nextFullName = "";

    switch (name) {
      case "preferred_work_location":
        const { selectedOptions } = target as HTMLSelectElement;
        const values = Array.from(selectedOptions).map(
          (option) => option.value
        );
        setFormData((prev) => ({ ...prev, [name]: values }));
        break;

      case "last_name":
      case "first_name":
        const nextNameData = { ...nameData, [name]: value };
        nextFullName = buildFullName(
          nextNameData.last_name,
          nextNameData.first_name
        );
        setNameData(nextNameData);
        setFormData((prev) => ({ ...prev, full_name: nextFullName }));
        break;

      default:
        if (name === "birth_year") {
          setFormData((prev) => ({
            ...prev,
            [name]: convertAgeToBirthYear(value),
          }));
          break;
        }

        if (name === "phone_number") {
          const normalizedPhoneNumber = normalizePhoneNumber(value);
          setFormData((prev) => ({ ...prev, [name]: normalizedPhoneNumber }));
          break;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
    }

    switch (name) {
      case "birth_year":
        scrollToRef(preferredWorkLocationRef);
        break;

      case "first_name":
        if (nextFullName !== "") {
          scrollToRef(genderRef);
        }
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

  function updateIsIntroVisible(isIntroVisible: boolean): void {
    setIsIntroVisible(isIntroVisible);
  }

  function updateIsCta1Submitted(isCta1Submitted: boolean): void {
    setIsCta1Submitted(isCta1Submitted);
  }

  function updateIsCta2Submitted(isCta2Submitted: boolean): void {
    setIsCta2Submitted(isCta2Submitted);
  }

  function updateStep(newStep: number): void {
    setStep(newStep);
  }

  async function saveDataToSupabase(): Promise<
    | {
        lp_sessions_id: string;
        users_id: string;
      }
    | false
  > {
    try {
      console.log("[Supabase保存] 開始 - formData:", formData);
      const supabase = createClient();

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .insert({ created_at: new Date().toISOString() })
        .select("id")
        .single();

      if (usersError) {
        console.error("[Supabase保存] usersエラー:", usersError);
        alert(`usersエラー: ${usersError.message}`);
        return false;
      }

      console.log("[Supabase保存] users作成成功:", usersData);
      const { id: usersId } = usersData;

      console.log("[Supabase保存] lp_sessionsとusers_info保存開始");

      const [lpSessions, usersInfoError] = await Promise.all([
        supabase
          .from("lp_sessions")
          .insert({
            answers: formData,
            is_submitted: true,
            lp_key: uuid ?? `deaeru-lp02p-${id}`,
            referrer_url: currentUrl,
            user_id: usersId,
          })
          .select("id")
          .single(),
        supabase
          .from("users_info")
          .insert({
            birthyear: formData.birth_year,
            name: formData.full_name,
            phone_number: formData.phone_number,
            users_id: usersId,
          })
          .then(({ error }) => error),
      ]);

      console.log("[Supabase保存] Promise.all完了");

      const { data: lpSessionsData, error: lpSessionsError } = lpSessions;

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
        lp_sessions_id: lpSessionsData.id,
        users_id: usersData.id,
      };
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      alert(`Supabase例外: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

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
        return `${DEAERU_GATEWAY_URL}?${params.toString()}`;
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const nameValidationError = validateNameFields(nameData.last_name, nameData.first_name, true);
    if (nameValidationError) {
      alert(nameValidationError);
      return;
    }

    if (
      Number(formData.birth_year) < 1970 ||
      Number(formData.birth_year) > 2010
    ) {
      alert("正しい生まれ年を入力してください。");
      return;
    }

    if (phoneError !== "" || isPhoneValidating) return;

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("[LP送信] 開始");

      const [data, notification, spreadsheet] = await Promise.all([
        saveDataToSupabase(),
        sendNotification(formData),
        sendActionStatisticsSpreadsheet(),
      ]);

      if (data && notification && spreadsheet) {
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
    } catch {
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
              firstName={nameData.first_name}
              formData={formData}
              fullNameRef={fullNameRef}
              genderRef={genderRef}
              isPhoneValidating={isPhoneValidating}
              lastName={nameData.last_name}
              nameError={nameError}
              onNameBlur={handleNameBlur}
              onPhoneBlur={handlePhoneBlur}
              phoneError={phoneError}
              phoneNumberRef={phoneNumberRef}
              preferredWorkLocationRef={preferredWorkLocationRef}
              updateFormData={updateFormData}
            />
          </div>
        </main>
        <Footer
          nameError={nameError}
          formData={formData}
          getAnsweredQuestions={getAnsweredQuestions}
          isAllFieldsFilled={isAllFieldsFilled}
          isPhoneDisabled={phoneError !== "" || isPhoneValidating}
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
