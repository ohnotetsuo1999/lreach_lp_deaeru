"use client";

import { DEAERU_GATEWAY_URL } from "@/lib/config/deaeru-gateway";

import Script from "next/script";
import {
  type ChangeEvent,
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { formatDate } from "@/utils";
import { useTwilioPhoneValidation, normalizePhoneNumber } from "@/hooks/usePhoneValidation";
import { validateNameFields } from "@/hooks/useNameValidation";

import { createClient } from "@/lib/supabase/client";
import {
  Gender,
  Input,
  Label,
  Radio,
  Select,
} from "@/app/deaeru/form01b/_components/form";
import { Intro } from "@/app/deaeru/lp99f/[id]/_components/section";
import { SimpleHeader } from "@/app/deaeru/lp99e/[id]/_components/SimpleHeader";
import classNames from "classnames";

import { Container, Inner, MaxWidth } from "@/components/common";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils";

interface Props {
  id: string;
  uuid?: string;
}

interface FormData {
  birth_year: string;
  full_name: string;
  full_name_kana: string;
  gender: string;
  phone_number: string;
  preferred_work_location: string[];
  preferred_work_style: string;
  preferred_annual_income: string;
  preferred_job_category: string;
  job_change_timing: string;
}

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "birth_year",
  "full_name",
  "full_name_kana",
  "gender",
  "phone_number",
  "preferred_work_location",
  "preferred_work_style",
  "preferred_annual_income",
  "preferred_job_category",
  "job_change_timing",
];

const initialFormData: FormData = {
  birth_year: "",
  full_name: "",
  full_name_kana: "",
  gender: "",
  phone_number: "",
  preferred_work_location: [],
  preferred_work_style: "",
  preferred_annual_income: "",
  preferred_job_category: "",
  job_change_timing: "",
};

const AGE_NOTE = (
  <>現在は20代限定でサービスを提供しております。</>
);

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

const PREFERRED_WORK_STYLE_DATA = [
  { label: "土日休み", value: "土日休み" },
  { label: "完全週休2日制", value: "完全週休2日制" },
  { label: "年間休日120日以上", value: "年間休日120日以上" },
  { label: "残業なし", value: "残業なし" },
  { label: "ワークライフバランス", value: "ワークライフバランス" },
  { label: "裁量権", value: "裁量権" },
];

const PREFERRED_ANNUAL_INCOME_DATA = [
  { label: "200万円", value: "200万円" },
  { label: "300万円", value: "300万円" },
  { label: "400万円", value: "400万円" },
  { label: "500万円", value: "500万円" },
  { label: "600万円", value: "600万円" },
  { label: "700万円<br />以上", value: "700万円以上" },
];

const PREFERRED_JOB_CATEGORY_DATA = [
  { label: "営業", value: "営業", alt: "", src: "/db_desired-job-category-1_img.png" },
  { label: "マーケティング・広報", value: "マーケティング・広報", alt: "", src: "/db_desired-job-category-2_img.png" },
  { label: "ITエンジニア", value: "ITエンジニア", alt: "", src: "/db_desired-job-category-3_img.png" },
  { label: "デザイナー・クリエイター", value: "デザイナー・クリエイター", alt: "", src: "/db_desired-job-category-4_img.png" },
  { label: "事務", value: "事務", alt: "", src: "/db_desired-job-category-5_img.png" },
  { label: "人事・採用", value: "人事・採用", alt: "", src: "/db_desired-job-category-6_img.png" },
  { label: "サービス・販売", value: "サービス・販売", alt: "", src: "/db_desired-job-category-7_img.png" },
  { label: "その他", value: "その他", alt: "", src: "/db_desired-job-category-8_img.png" },
];

const JOB_CHANGE_TIMING_DATA = [
  { label: "今すぐに", value: "今すぐに" },
  { label: "3ヶ月以内", value: "3ヶ月以内" },
  { label: "6ヶ月以内", value: "6ヶ月以内" },
  { label: "1年以内", value: "1年以内" },
];

function getAnsweredQuestions(formData: FormData): number {
  return REQUIRED_FIELDS.filter((key) => {
    const v = formData[key];
    return Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined;
  }).length;
}

function calculateIntroScrollRate(
  currentScrollY: number,
  maxScrollY: number
): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}
export function Page({ id, uuid }: Props) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isIntroVisible, setIsIntroVisible] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCta1Submitted, setIsCta1Submitted] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [inflowDatetime, setInflowDatetime] = useState<string>("");
  const [isCta2Submitted, setIsCta2Submitted] = useState<boolean>(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);
  const [sid, setSid] = useState("");

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  // 漢字氏名のリアルタイムバリデーションエラー（blur 時に表示）
  const [nameError, setNameError] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");

  const { phoneError, isPhoneValidating, handlePhoneBlur } =
    useTwilioPhoneValidation({
      onPhoneChange: (phone) =>
        setFormData((prev) => ({ ...prev, phone_number: phone })),
    });

  const linkRef = useRef<HTMLAnchorElement>(null);
  const fullNameRef = useRef<HTMLDivElement | null>(null);
  const fullNameKanaRef = useRef<HTMLDivElement | null>(null);
  const genderRef = useRef<HTMLDivElement | null>(null);
  const birthYearRef = useRef<HTMLDivElement | null>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement | null>(null);
  const phoneNumberRef = useRef<HTMLDivElement | null>(null);
  const preferredWorkStyleRef = useRef<HTMLDivElement | null>(null);
  const preferredAnnualIncomeRef = useRef<HTMLDivElement | null>(null);
  const preferredJobCategoryRef = useRef<HTMLDivElement | null>(null);
  const jobChangeTimingRef = useRef<HTMLDivElement | null>(null);
  const scrolledFields = useRef<Set<string>>(new Set());

  const scrollToField = (ref: { current: HTMLDivElement | null }) => {
    if (!ref.current) return;
    const HEADER_HEIGHT = 88;
    const elementTop = ref.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementTop - HEADER_HEIGHT, behavior: "smooth" });
  };

  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);
  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));

    // URLパラメータからsidを取得
    const urlParams = new URLSearchParams(window.location.search);
    const sidParam = urlParams.get('sid');
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

  useEffect(() => {
    if (formData.preferred_work_style !== "" && !scrolledFields.current.has("preferredWorkStyle")) {
      scrolledFields.current.add("preferredWorkStyle");
      scrollToField(preferredAnnualIncomeRef);
    }
  }, [formData.preferred_work_style]);

  useEffect(() => {
    if (formData.preferred_annual_income !== "" && !scrolledFields.current.has("preferredAnnualIncome")) {
      scrolledFields.current.add("preferredAnnualIncome");
      scrollToField(preferredJobCategoryRef);
    }
  }, [formData.preferred_annual_income]);

  useEffect(() => {
    if (formData.preferred_job_category !== "" && !scrolledFields.current.has("preferredJobCategory")) {
      scrolledFields.current.add("preferredJobCategory");
      scrollToField(jobChangeTimingRef);
    }
  }, [formData.preferred_job_category]);

  useEffect(() => {
    if (formData.job_change_timing !== "" && !scrolledFields.current.has("jobChangeTiming")) {
      scrolledFields.current.add("jobChangeTiming");
      scrollToField(fullNameRef);
    }
  }, [formData.job_change_timing]);

  useEffect(() => {
    if (lastName !== "" && firstName !== "" && !scrolledFields.current.has("fullName")) {
      scrolledFields.current.add("fullName");
      scrollToField(fullNameKanaRef);
    }
  }, [lastName, firstName]);

  useEffect(() => {
    if (lastNameKana !== "" && firstNameKana !== "" && !scrolledFields.current.has("fullNameKana")) {
      scrolledFields.current.add("fullNameKana");
      scrollToField(genderRef);
    }
  }, [lastNameKana, firstNameKana]);

  useEffect(() => {
    if (formData.gender !== "" && !scrolledFields.current.has("gender")) {
      scrolledFields.current.add("gender");
      scrollToField(birthYearRef);
    }
  }, [formData.gender]);

  useEffect(() => {
    if (formData.birth_year !== "" && !scrolledFields.current.has("birthYear")) {
      scrolledFields.current.add("birthYear");
      scrollToField(preferredWorkLocationRef);
    }
  }, [formData.birth_year]);

  useEffect(() => {
    if (formData.preferred_work_location.length > 0 && !scrolledFields.current.has("preferredWorkLocation")) {
      scrolledFields.current.add("preferredWorkLocation");
      scrollToField(phoneNumberRef);
    }
  }, [formData.preferred_work_location]);

  const isAllComplete =
    lastName !== "" &&
    firstName !== "" &&
    // 氏名（漢字）が形式エラー（カタカナ・ローマ字・文字数等）の場合はボタンを活性化しない
    validateNameFields(lastName, firstName) === "" &&
    lastNameKana !== "" &&
    firstNameKana !== "" &&
    formData.gender !== "" &&
    formData.birth_year !== "" &&
    formData.preferred_work_location.length > 0 &&
    formData.phone_number !== "" &&
    !isPhoneDisabled &&
    formData.preferred_work_style !== "" &&
    formData.preferred_annual_income !== "" &&
    formData.preferred_job_category !== "" &&
    formData.job_change_timing !== "";

  const selectedAge =
    formData.birth_year !== ""
      ? String(new Date().getFullYear() - Number(formData.birth_year))
      : "";

  const updateFormData = (
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.currentTarget ?? (event as ChangeEvent<HTMLInputElement>).target;
    const { name, value } = target;

    if (name === "last_name") {
      setLastName(value);
      setFormData((prev) => ({ ...prev, full_name: `${value} ${firstName}`.trim() }));
      return;
    }
    if (name === "first_name") {
      setFirstName(value);
      setFormData((prev) => ({ ...prev, full_name: `${lastName} ${value}`.trim() }));
      return;
    }
    if (name === "last_name_kana") {
      setLastNameKana(value);
      setFormData((prev) => ({ ...prev, full_name_kana: `${value} ${firstNameKana}`.trim() }));
      return;
    }
    if (name === "first_name_kana") {
      setFirstNameKana(value);
      setFormData((prev) => ({ ...prev, full_name_kana: `${lastNameKana} ${value}`.trim() }));
      return;
    }

    if (name === "birth_year") {
      const numericAge = Number(value);
      if (Number.isInteger(numericAge) && numericAge >= 20 && numericAge <= 29) {
        const birthYear = String(new Date().getFullYear() - numericAge);
        setFormData((prev) => ({ ...prev, birth_year: birthYear }));
      } else {
        setFormData((prev) => ({ ...prev, birth_year: value }));
      }
      return;
    }

    if (name === "preferred_work_location") {
      const select = target as HTMLSelectElement;
      const selected = Array.from(select.selectedOptions).map((o) => o.value);
      setFormData((prev) => ({ ...prev, preferred_work_location: selected }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
            `お名前（かな）：${fd.full_name_kana}`,
            `性別：${fd.gender}`,
            `生まれ年：${fd.birth_year}`,
            `希望勤務地：${fd.preferred_work_location.join(", ")}`,
            `電話番号：${fd.phone_number}`,
            `理想の働き方：${fd.preferred_work_style}`,
            `希望年収：${fd.preferred_annual_income}`,
            `希望職種：${fd.preferred_job_category}`,
            `転職希望時期：${fd.job_change_timing}`,
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
    | { lp_sessions_id: string; users_id: string }
    | false
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
            lp_key: uuid ?? `deaeru-lp99f-${id}`,
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

  function getRedirectUrl({ lpSessionsId, usersId }: { lpSessionsId: string; usersId: string }): string {
    const params = new URLSearchParams({
      lpSessionsId,
      referrerUrl: currentUrl,
      usersId,
    });

    // sidがある場合はgatewayに渡す
    if (sid) {
      params.append('sid', sid);
    }

    return `${DEAERU_GATEWAY_URL}?${params.toString()}`;
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    // お名前（姓・名）のバリデーション（空・ローマ字・カタカナ・文字数・ダミー名等）。
    // requireFilled=true で空送信も弾く（オートフィル等で full_name が空のケース対策）。
    const nameValidationError = validateNameFields(lastName, firstName, true);
    if (nameValidationError) {
      alert(nameValidationError);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const [data, , spreadsheet] = await Promise.all([
        saveDataToSupabase(),
        sendNotification(formData),
        sendActionStatisticsSpreadsheet(),
      ]);

      if (!data) throw new Error("データ保存に失敗しました");
      if (!spreadsheet) console.warn("スプレッドシート送信に失敗しました");

      const redirectUrl = getRedirectUrl({
        lpSessionsId: data.lp_sessions_id,
        usersId: data.users_id,
      });

      window.location.href = redirectUrl;
    } catch {
      alert("フォームの送信に失敗しました。確認して再度お試しください。");
      setIsSubmitting(false);
    }
  }

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
      <Script id="deaeru-meta-pixel" strategy="afterInteractive">{`
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
        className={`flex min-h-dvh flex-col pt-[72px] pb-20 ${isSubmitting ? "pointer-events-none" : ""}`}
      >
        <SimpleHeader formData={formData} getAnsweredQuestions={getAnsweredQuestions} />
        <section className="grow bg-gray-50">
          <MaxWidth>
            <Container width="90">
              <div className="flex flex-col gap-y-5 pb-6">
                {/* 希望条件 */}
                <Radio
                  columns={2}
                  label="理想の働き方"
                  name="preferred_work_style"
                  onChange={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
                  radioData={PREFERRED_WORK_STYLE_DATA}
                  ref={preferredWorkStyleRef}
                  required={true}
                />
                <Radio
                  columns={3}
                  label="希望年収"
                  name="preferred_annual_income"
                  onChange={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
                  radioData={PREFERRED_ANNUAL_INCOME_DATA}
                  ref={preferredAnnualIncomeRef}
                  required={true}
                />
                <Radio
                  columns={2}
                  label="希望職種"
                  name="preferred_job_category"
                  onChange={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
                  radioData={PREFERRED_JOB_CATEGORY_DATA}
                  ref={preferredJobCategoryRef}
                  required={true}
                />

                {/* 転職について */}
                <Radio
                  columns={2}
                  label="転職希望時期"
                  name="job_change_timing"
                  onChange={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
                  radioData={JOB_CHANGE_TIMING_DATA}
                  ref={jobChangeTimingRef}
                  required={true}
                />

                {/* 基本情報 */}
                <div className="relative" data-field ref={fullNameRef}>
                  <Inner className="bg-white">
                    <Label className="mb-2" label="氏名（漢字）" required={true} />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                        name="last_name"
                        onChange={updateFormData}
                        onBlur={(e) => setNameError(validateNameFields(e.currentTarget.value, firstName))}
                        placeholder="姓（山田）"
                        required={true}
                        type="text"
                        value={lastName}
                      />
                      <input
                        className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                        name="first_name"
                        onChange={updateFormData}
                        onBlur={(e) => setNameError(validateNameFields(lastName, e.currentTarget.value))}
                        placeholder="名（太郎）"
                        required={true}
                        type="text"
                        value={firstName}
                      />
                    </div>
                  {nameError && (
                    <p className="mt-2 text-sm text-red-500">{nameError}</p>
                  )}
                  </Inner>
                </div>
                <div className="relative" data-field ref={fullNameKanaRef}>
                  <Inner className="bg-white">
                    <Label className="mb-2" label="氏名（フリガナ）" required={true} />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="block w-full rounded-lg border-2 border-gray-200 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                        name="last_name_kana"
                        onChange={updateFormData}
                        placeholder="セイ（ヤマダ）"
                        required={true}
                        type="text"
                        value={lastNameKana}
                      />
                      <input
                        className="block w-full rounded-lg border-2 border-gray-200 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                        name="first_name_kana"
                        onChange={updateFormData}
                        placeholder="メイ（タロウ）"
                        required={true}
                        type="text"
                        value={firstNameKana}
                      />
                    </div>
                  </Inner>
                </div>
                <Gender
                  onChange={updateFormData}
                  ref={genderRef}
                  value={formData.gender}
                />
                <Select
                  label="年齢"
                  name="birth_year"
                  onBlur={updateFormData}
                  optionData={["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"]}
                  customDropdown={true}
                  ref={birthYearRef}
                  required={true}
                  value={selectedAge}
                  helperText={AGE_NOTE}
                />
                <Select
                  label="希望勤務地(複数選択可)"
                  name="preferred_work_location"
                  onBlur={updateFormData}
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
                <br />
                ・
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
        </section>

        <footer className="fixed bottom-0 w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <MaxWidth>
            <Container width="90">
              <div className="flex h-20 items-center justify-center">
                <button
                  type="submit"
                  disabled={!isAllComplete || isSubmitting}
                  className={cn(
                    "flex h-12 w-full items-center justify-center gap-x-2 rounded-lg text-base font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl",
                    "bg-[#06C755] hover:brightness-110 disabled:bg-gray-300 disabled:shadow-none"
                  )}
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  <span className="font-bold">{isSubmitting ? "読み込み中..." : "LINEで面談予約する"}</span>
                  {!isSubmitting && <ChevronRight className="w-5" />}
                </button>
              </div>
            </Container>
          </MaxWidth>
        </footer>

        <a className="hidden" href="" ref={linkRef} />
      </form>

      <div
        className={classNames(
          "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out",
          isSubmitting
            ? "pointer-events-auto bg-black/60 opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div className="mx-4 max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-y-6">
            <div className="relative size-16">
              <span className="absolute left-0 top-0 size-full rounded-full border-4 border-green-100" />
              <span className="absolute left-0 top-0 size-full animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            </div>
            <h3 className="text-center text-xl font-bold text-gray-800">
              LINEに移動しています
            </h3>
            <p className="text-center text-sm leading-relaxed text-gray-600">
              しばらくお待ちください...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
