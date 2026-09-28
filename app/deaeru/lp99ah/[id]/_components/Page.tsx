"use client";

import Script from "next/script";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { cn, formatDate } from "@/utils";
import { ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  useNameValidation,
  validateNameFields,
} from "@/hooks/useNameValidation";
import {
  normalizePhoneNumber,
  useTwilioPhoneValidation,
} from "@/hooks/usePhoneValidation";
import { Container, Inner, MaxWidth } from "@/components/common";
import { LoadingModal, StepTitle } from "@/app/deaeru/form01a/_components/ui";
import {
  Gender,
  Input,
  Label,
  Select,
} from "@/app/deaeru/form01a/_components/form";
import { Intro } from "@/app/deaeru/lp99ah/[id]/_components/section";

interface Props {
  id: string;
  uuid?: string;
}

const STEP_LENGTH = 1;

interface FormData {
  birth_year: string;
  full_name: string;
  gender: string;
  phone_number: string;
  preferred_work_location: string[];
}

const initialFormData: FormData = {
  birth_year: "",
  full_name: "",
  gender: "",
  phone_number: "",
  preferred_work_location: [],
};

const AGE_NOTE = <>現在は20代限定でサービスを提供しております。</>;

const SERVICE_AREA_NOTE = (
  <>
    ご希望に沿った最適な求人のご紹介と、
    <br />
    質の高いサポートをお届けするため、
    <br />
    現在のサービス提供エリアを
    <br />
    一部地域に限定させていただいております。
  </>
);

function getAnsweredQuestions(formData: FormData): number {
  let count = 0;
  for (const key in formData) {
    const v = formData[key as keyof FormData];
    if (Array.isArray(v)) {
      if (v.length > 0) count++;
    } else {
      if (v !== "") count++;
    }
  }
  return count;
}

function isFormFilled(formData: FormData): boolean {
  return (
    formData.full_name !== "" &&
    formData.gender !== "" &&
    formData.birth_year !== "" &&
    formData.preferred_work_location.length > 0 &&
    formData.phone_number !== ""
  );
}

function buildFullName(lastName: string, firstName: string): string {
  const l = lastName.trim();
  const f = firstName.trim();
  if (l === "" || f === "") return "";
  return `${l} ${f}`;
}

function convertAgeToBirthYear(age: string): string {
  const numericAge = Number(age);
  if (!Number.isInteger(numericAge) || numericAge < 20 || numericAge > 29)
    return age;
  return String(new Date().getFullYear() - numericAge);
}

function calculateIntroScrollRate(
  currentScrollY: number,
  maxScrollY: number
): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}
export function Page({ id, uuid }: Props) {
  const fullNameRef = useRef<HTMLDivElement>(null);
  const genderRef = useRef<HTMLDivElement>(null);
  const birthYearRef = useRef<HTMLDivElement>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement>(null);
  const phoneNumberRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [nameData, setNameData] = useState({ last_name: "", first_name: "" });
  const { nameError, handleNameBlur } = useNameValidation(nameData);
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCta1Submitted, setIsCta1Submitted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [sid, setSid] = useState("");

  const { phoneError, isPhoneValidating, handlePhoneBlur } =
    useTwilioPhoneValidation({
      onPhoneChange: (phone) =>
        setFormData((prev) => ({ ...prev, phone_number: phone })),
    });

  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);
  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));

    // URLパラメータからsidを取得
    const urlParams = new URLSearchParams(window.location.search);
    const sidParam = urlParams.get("sid");
    if (sidParam) {
      setSid(sidParam);
    }
  }, []);

  /* Intro表示中のスクロール量を取得して保持 */
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

  /* 滞在時間を取得（秒単位） */
  function getStayingTime(): number {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }

  /* ページ離脱時の行動集計送信 */
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
            is_cta_2_submitted: false,
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
  }, [
    formData,
    inflowDatetime,
    currentUrl,
    isCta1Submitted,
    isSubmitting,
  ]);

  function scrollToRef(ref: React.RefObject<HTMLDivElement | null>) {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateFormData(
    event:
      | SyntheticEvent<HTMLInputElement | HTMLSelectElement>
      | ChangeEvent<HTMLInputElement>
  ): void {
    const target =
      (event as ChangeEvent<HTMLInputElement>).target ??
      (event as SyntheticEvent<HTMLInputElement>).currentTarget;
    const { name, value } = target;

    switch (name) {
      case "preferred_work_location": {
        const select = target as unknown as HTMLSelectElement;
        const values = Array.from(select.selectedOptions).map((o) => o.value);
        setFormData((prev) => ({ ...prev, preferred_work_location: values }));
        break;
      }
      case "last_name":
      case "first_name": {
        const nextNameData = { ...nameData, [name]: value };
        const nextFullName = buildFullName(nextNameData.last_name, nextNameData.first_name);
        setNameData(nextNameData);
        setFormData((prev) => ({ ...prev, full_name: nextFullName }));
        if (name === "first_name" && nextFullName !== "") scrollToRef(genderRef);
        break;
      }
      case "birth_year":
        setFormData((prev) => ({
          ...prev,
          birth_year: convertAgeToBirthYear(value),
        }));
        scrollToRef(preferredWorkLocationRef);
        break;
      case "phone_number":
        setFormData((prev) => ({
          ...prev,
          phone_number: normalizePhoneNumber(value),
        }));
        break;
      case "gender":
        setFormData((prev) => ({ ...prev, gender: value }));
        scrollToRef(birthYearRef);
        break;
      default:
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function sendNotification(fd: FormData): Promise<boolean> {
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C0ACG4U5G68",
          text: [
            "【出会えるエージェント_LPに回答しました（予約なし）】",
            `ASP名：アドウェイズ`,
            `回答日時：${formatDate(new Date())}`,
            `お名前：${fd.full_name}`,
            `性別：${fd.gender}`,
            `生まれ年：${fd.birth_year}`,
            `希望勤務地：${fd.preferred_work_location.join(", ")}`,
            `電話番号：${fd.phone_number}`,
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
      return res.status === 200;
    } catch {
      console.error("Slack通知送信中にエラーが発生しました！");
      return false;
    }
  }

  async function saveDataToSupabase(): Promise<
    { lp_sessions_id: string; users_id: string } | false
  > {
    try {
      const supabase = createClient();

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .insert({ created_at: new Date().toISOString() })
        .select("id")
        .single();

      if (usersError) {
        console.error("[Supabase保存] usersエラー:", usersError);
        return false;
      }

      const { id: usersId } = usersData;

      const [lpSessions, usersInfoError] = await Promise.all([
        supabase
          .from("lp_sessions")
          .insert({
            answers: formData,
            is_submitted: true,
            lp_key: uuid ?? `deaeru-lp99ah-${id}`,
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

      const { data: lpSessionsData, error: lpSessionsError } = lpSessions;

      if (lpSessionsError) {
        console.error("[Supabase保存] lp_sessionsエラー:", lpSessionsError);
        return false;
      }
      if (usersInfoError) {
        console.error("[Supabase保存] users_infoエラー:", usersInfoError);
      }

      return {
        lp_sessions_id: lpSessionsData.id,
        users_id: usersData.id,
      };
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      return false;
    }
  }

  function getRedirectUrl({
    lpSessionsId,
    usersId,
  }: {
    lpSessionsId: string;
    usersId: string;
  }): string {
    const params = new URLSearchParams({
      lpSessionsId,
      referrerUrl: currentUrl,
      usersId,
    });

    // sidがある場合はthanksページに渡す
    if (sid) {
      params.append("sid", sid);
    }

    return `/deaeru/lp99ah/${id}/thanks?${params.toString()}`;
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
          is_cta_2_submitted: false,
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    const nameValidationError = validateNameFields(
      nameData.last_name,
      nameData.first_name,
      true
    );
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
      const [data, notification, spreadsheet] = await Promise.all([
        saveDataToSupabase(),
        sendNotification(formData),
        sendActionStatisticsSpreadsheet(),
      ]);

      if (!data || !notification) {
        throw new Error("エントリーに失敗しました");
      }

      if (!spreadsheet) console.warn("スプレッドシート送信に失敗しました");

      setRedirectUrl(
        getRedirectUrl({
          lpSessionsId: data.lp_sessions_id,
          usersId: data.users_id,
        })
      );
      setTimeout(() => {
        linkRef.current?.click();
      }, 500);
    } catch {
      alert("フォームの送信に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  }

  const selectedAge =
    formData.birth_year !== ""
      ? String(new Date().getFullYear() - Number(formData.birth_year))
      : "";

  const totalQuestions = Object.keys(initialFormData).length;
  const answeredQuestions = getAnsweredQuestions(formData);

  if (isIntroVisible) {
    return (
      <Intro
        updateIsCta1Submitted={setIsCta1Submitted}
        updateIsIntroVisible={setIsIntroVisible}
      />
    );
  }

  return (
    <>
      <Script id="deaeru-meta-pixel-adways" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1509735510737082');
fbq('track', 'PageView');
      `}</Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1509735510737082&ev=PageView&noscript=1"
        />
      </noscript>
      <Script id="deaeru-tiktok-pixel" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D7ERMSRC77UFN8265QLG');
  ttq.page();
}(window, document, 'ttq');
      `}</Script>
      <form
        onSubmit={handleSubmit}
        className={isSubmitting ? "pointer-events-none" : ""}
      >
        {/* Header */}
        <header className="fixed top-0 z-50 flex w-full flex-col justify-center bg-white shadow-sm">
          <MaxWidth>
            <Container width="90">
              <div className="flex h-18 flex-col justify-center gap-y-2">
                <div className="flex items-center justify-center">
                  <img
                    className="block h-10 w-auto"
                    src="/deaeru-logo.png"
                    alt="出会えるエージェント"
                  />
                </div>
                <div className="flex items-end gap-x-2">
                  <div className="relative mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <span
                      className="absolute left-0 top-0 block h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                      style={{
                        width: `${(answeredQuestions / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="shrink-0 text-xs font-bold text-green-600">
                    残り
                    <strong className="text-xl">
                      {totalQuestions - answeredQuestions}
                    </strong>
                    問
                  </p>
                </div>
              </div>
            </Container>
          </MaxWidth>
        </header>

        {/* Main: 基本情報のみ */}
        <main className="overflow-x-hidden">
          <div
            className="relative flex min-h-screen bg-gray-50 py-22"
            style={{
              width: `${STEP_LENGTH * 100}%`,
            }}
          >
            {/* 基本情報 */}
            <section className="relative grow bg-gray-50">
              <div className="absolute inset-y-0 w-full overflow-y-scroll overscroll-y-contain">
                <MaxWidth>
                  <Container width="90">
                    <div className="mb-4 flex flex-col gap-y-5 pb-6">
                      <StepTitle step={1} title="基本情報" />
                      <div className="relative" data-field ref={fullNameRef}>
                        <Inner className="bg-white">
                          <Label
                            className="mb-2"
                            label="お名前"
                            required={true}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                              name="last_name"
                              onBlur={handleNameBlur}
                              onChange={
                                updateFormData as (
                                  event: ChangeEvent<HTMLInputElement>
                                ) => void
                              }
                              placeholder="姓（山田）"
                              required={true}
                              type="text"
                              value={nameData.last_name}
                            />
                            <input
                              className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                              name="first_name"
                              onBlur={handleNameBlur}
                              onChange={
                                updateFormData as (
                                  event: ChangeEvent<HTMLInputElement>
                                ) => void
                              }
                              placeholder="名（太郎）"
                              required={true}
                              type="text"
                              value={nameData.first_name}
                            />
                          </div>
                          {nameError && (
                            <p className="mt-2 text-sm text-red-500">
                              {nameError}
                            </p>
                          )}
                        </Inner>
                      </div>
                      <Gender
                        onChange={
                          updateFormData as (
                            event: ChangeEvent<HTMLInputElement>
                          ) => void
                        }
                        ref={genderRef}
                        value={formData.gender}
                      />
                      <Select
                        label="年齢"
                        name="birth_year"
                        onBlur={
                          updateFormData as (
                            event: SyntheticEvent<HTMLSelectElement>
                          ) => void
                        }
                        optionData={[
                          "20",
                          "21",
                          "22",
                          "23",
                          "24",
                          "25",
                          "26",
                          "27",
                          "28",
                          "29",
                        ]}
                        customDropdown={true}
                        ref={birthYearRef}
                        required={true}
                        value={selectedAge}
                        helperText={AGE_NOTE}
                      />
                      <Select
                        label="希望勤務地(複数選択可)"
                        name="preferred_work_location"
                        onBlur={
                          updateFormData as (
                            event: SyntheticEvent<HTMLSelectElement>
                          ) => void
                        }
                        optionData={[
                          "東京都",
                          "埼玉県",
                          "千葉県",
                          "神奈川県",
                          "大阪府",
                          "京都府",
                          "兵庫県",
                          "愛知県",
                          "福岡県",
                        ]}
                        multiple={true}
                        ref={preferredWorkLocationRef}
                        value={formData.preferred_work_location}
                        required={true}
                        size={4}
                        helperText={SERVICE_AREA_NOTE}
                      />
                      <Input
                        errorMessage={phoneError}
                        isValidating={isPhoneValidating}
                        label="電話番号"
                        maxLength={11}
                        name="phone_number"
                        onBlur={handlePhoneBlur}
                        ref={phoneNumberRef}
                        type="tel"
                        pattern="(070|080|090)\d{8}$"
                        placeholder="08012345678"
                        required={true}
                      />
                    </div>
                    <p className="mx-auto w-fit text-left text-xs text-gray-600 pb-8">
                      下記ボタンを押すことで、
                      <br />・
                      <a
                        className="text-green-600 underline font-medium"
                        href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94"
                        target="_blank"
                      >
                        利用規約
                      </a>
                      および
                      <a
                        className="text-green-600 underline font-medium"
                        href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec"
                        target="_blank"
                      >
                        プライバシーポリシー
                      </a>
                      <br />
                      ・現在、業務遂行に支障となる健康問題がなく、<span className="text-red-500">通院中ではない</span>
                      <br />
                      ・<span className="text-red-500">現在学生の方、および時短勤務希望ではない。</span>
                      <br />
                      上記に同意したものとみなします
                    </p>
                  </Container>
                </MaxWidth>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <MaxWidth>
            <Container width="90">
              <div className="flex h-20 items-center justify-between gap-x-4">
                <button
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-x-1.5 rounded-lg text-sm font-bold transition-all duration-200",
                    "bg-[#06C755] text-white shadow-lg hover:brightness-110 hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none"
                  )}
                  disabled={
                    isSubmitting ||
                    !isFormFilled(formData) ||
                    phoneError !== "" ||
                    isPhoneValidating ||
                    nameError !== ""
                  }
                  type="submit"
                >
                  <svg
                    className="size-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span className="font-bold whitespace-nowrap">
                    {isSubmitting
                      ? "読み込み中..."
                      : "LINEで診断結果を受け取る"}
                  </span>
                  {!isSubmitting && <ChevronRight className="w-5 shrink-0" />}
                </button>
              </div>
            </Container>
          </MaxWidth>
        </footer>

        <a className="hidden" href={redirectUrl} ref={linkRef} />
      </form>
      <LoadingModal isLoading={isSubmitting} />
    </>
  );
}
