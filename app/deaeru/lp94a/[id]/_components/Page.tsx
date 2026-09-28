"use client";

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
import { LoadingModal } from "@/app/deaeru/form01a/_components/ui";
import {
  Gender,
  Input,
  Label,
  Radio,
  Select,
} from "@/app/deaeru/form01a/_components/form";
import { Intro } from "@/app/deaeru/lp94a/[id]/_components/section";

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
  preferred_work_style: string;
  preferred_annual_income: string;
  preferred_job_category: string;
  preferred_work_location: string[];
}

const initialFormData: FormData = {
  birth_year: "",
  full_name: "",
  gender: "",
  phone_number: "",
  preferred_work_style: "",
  preferred_annual_income: "",
  preferred_job_category: "",
  preferred_work_location: [],
};

// 希望条件の選択肢（form01a/Condition.tsx と同一）
const preferredWorkStyleData = [
  { label: "土日休み", value: "土日休み" },
  { label: "完全週休2日制", value: "完全週休2日制" },
  { label: "年間休日120日以上", value: "年間休日120日以上" },
  { label: "残業なし", value: "残業なし" },
  { label: "ワークライフバランス", value: "ワークライフバランス" },
  { label: "裁量権", value: "裁量権" },
];

const preferredAnnualIncomeData = [
  { label: "200万円", value: "200万円" },
  { label: "300万円", value: "300万円" },
  { label: "400万円", value: "400万円" },
  { label: "500万円", value: "500万円" },
  { label: "600万円", value: "600万円" },
  { label: "700万円<br />以上", value: "700万円以上" },
];

// 希望職種アイコンは lp94a 専用に WebP 化・リサイズした画像を使用（表示速度改善・2026-06-25）。
// 共通の db_desired-job-category-*.png（40以上のLPで共有・各150〜270KB）は重いため、
// lp94a 専用 deaeru_lp94a_jobcat-*.webp（各14〜36KB）を複製して参照する。
const preferredJobCategoryData = [
  { label: "営業", value: "営業", alt: "", src: "/deaeru_lp94a_jobcat-1.webp" },
  { label: "マーケティング・広報", value: "マーケティング・広報", alt: "", src: "/deaeru_lp94a_jobcat-2.webp" },
  { label: "ITエンジニア", value: "ITエンジニア", alt: "", src: "/deaeru_lp94a_jobcat-3.webp" },
  { label: "デザイナー・クリエイター", value: "デザイナー・クリエイター", alt: "", src: "/deaeru_lp94a_jobcat-4.webp" },
  { label: "事務", value: "事務", alt: "", src: "/deaeru_lp94a_jobcat-5.webp" },
  { label: "人事・採用", value: "人事・採用", alt: "", src: "/deaeru_lp94a_jobcat-6.webp" },
  { label: "サービス・販売", value: "サービス・販売", alt: "", src: "/deaeru_lp94a_jobcat-7.webp" },
  { label: "その他", value: "その他", alt: "", src: "/deaeru_lp94a_jobcat-8.webp" },
];

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
    formData.preferred_work_style !== "" &&
    formData.preferred_annual_income !== "" &&
    formData.preferred_job_category !== "" &&
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
  const preferredWorkStyleRef = useRef<HTMLDivElement>(null);
  const preferredAnnualIncomeRef = useRef<HTMLDivElement>(null);
  const preferredJobCategoryRef = useRef<HTMLDivElement>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement>(null);
  const phoneNumberRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [nameData, setNameData] = useState({ last_name: "", first_name: "" });
  const { nameError, handleNameBlur } = useNameValidation(nameData);
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

  /* スクロール量を取得して保持（行動集計用） */
  useEffect(() => {
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
  }, []);

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
      case "preferred_work_style":
        setFormData((prev) => ({ ...prev, preferred_work_style: value }));
        scrollToRef(preferredAnnualIncomeRef);
        break;
      case "preferred_annual_income":
        setFormData((prev) => ({ ...prev, preferred_annual_income: value }));
        scrollToRef(preferredJobCategoryRef);
        break;
      case "preferred_job_category":
        setFormData((prev) => ({ ...prev, preferred_job_category: value }));
        scrollToRef(fullNameRef);
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
            `ASP名：緒方`,
            `回答日時：${formatDate(new Date())}`,
            `お名前：${fd.full_name}`,
            `性別：${fd.gender}`,
            `生まれ年：${fd.birth_year}`,
            `希望勤務スタイル：${fd.preferred_work_style}`,
            `希望年収：${fd.preferred_annual_income}`,
            `希望職種：${fd.preferred_job_category}`,
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
            lp_key: uuid ?? `deaeru-lp94a-${id}`,
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

    return `/deaeru/lp94a/${id}/thanks?${params.toString()}`;
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

  // X（Twitter）コンバージョン計測イベント - 緒方ASP向け。
  // 依頼仕様により「LINEで診断結果を受け取る」ボタンがクリックされた瞬間に発火させる。
  // ベースコード（twq config）は Intro.tsx で読み込み済み。
  function fireXConversionEvent(): void {
    const w = window as Window & {
      twq?: (command: string, eventId: string, params?: Record<string, unknown>) => void;
    };
    if (typeof w.twq === "function") {
      w.twq("event", "tw-rcrwm-rcrx1", {});
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

  return (
    <>
      {/* ① 記事（FVあり・縦スクロール）。CTAボタンは下のフォームへスクロール */}
      <Intro updateIsCta1Submitted={setIsCta1Submitted} />

      {/* ② フォーム（同一ページの記事の下に常時表示。遷移・切替なし） */}
      {/* lp94a 限定: 白背景で各設問のタイトル見出し（Inner カード）が
          白に溶けて見えにくいので、border を足して区切りを浮かせる
          （共通 Inner.tsx / Radio.tsx は変更しない） */}
      <style jsx global>{`
        #lp94a-form .rounded-xl.bg-white.p-4.shadow-sm {
          border: 1px solid #d8e8df;
          box-shadow: 0 4px 12px rgba(0, 93, 51, 0.08);
        }
      `}</style>
      <form
        id="lp94a-form"
        onSubmit={handleSubmit}
        className={isSubmitting ? "pointer-events-none" : ""}
      >
        {/* フォーム全体を1枚の白カードで包む（外側ミント・中央白） */}
        <div className="bg-[#effcf5]">
          <MaxWidth className="bg-white">
            {/* Main: 希望条件＋基本情報 */}
            <main>
              <div className="pt-4">
                {/* 希望条件 */}
                <section>
                  <Container width="90">
                    <div className="mb-4 flex flex-col gap-y-5 pb-6">
                      <Radio
                        columns={2}
                        label="理想の働き方"
                        name="preferred_work_style"
                        onChange={
                          updateFormData as (
                            event: ChangeEvent<HTMLInputElement>
                          ) => void
                        }
                        radioData={preferredWorkStyleData}
                        ref={preferredWorkStyleRef}
                        required={true}
                      />
                      <Radio
                        columns={3}
                        label="希望年収"
                        name="preferred_annual_income"
                        onChange={
                          updateFormData as (
                            event: ChangeEvent<HTMLInputElement>
                          ) => void
                        }
                        radioData={preferredAnnualIncomeData}
                        ref={preferredAnnualIncomeRef}
                        required={true}
                      />
                      <Radio
                        columns={2}
                        label="希望職種"
                        name="preferred_job_category"
                        onChange={
                          updateFormData as (
                            event: ChangeEvent<HTMLInputElement>
                          ) => void
                        }
                        radioData={preferredJobCategoryData}
                        ref={preferredJobCategoryRef}
                        required={true}
                      />
                    </div>
                  </Container>
                </section>

                {/* 基本情報 */}
                <section>
                  <Container width="90">
                    <div className="mb-4 flex flex-col gap-y-5 pb-6">
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
                </section>
              </div>
            </main>

            {/* フォーム入力欄の一番下のCTA（画像）。画面遷移なし＝そのまま送信 */}
            <div className="px-4 pb-10">
              <Container width="90">
              <button
                type="submit"
                className="block w-full disabled:opacity-50"
                disabled={
                  isSubmitting ||
                  !isFormFilled(formData) ||
                  phoneError !== "" ||
                  isPhoneValidating ||
                    nameError !== ""
                }
                onClick={fireXConversionEvent}
              >
                <img
                  className="block w-full"
                  src="/deaeru_lp94a_cta_button.webp"
                  alt="エージェントを紹介してもらう"
                />
              </button>
              </Container>
            </div>

            {/* 出会えるエージェントのロゴ＋運営会社（フォームの一番下に移設） */}
            <div className="flex flex-col items-center gap-4 pb-10 text-center">
              <img
                className="block h-10 w-auto"
                src="/deaeru-logo.png"
                alt="出会えるエージェント"
              />
              <a
                href="https://foresma.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-bold text-[#5d6966] transition-opacity hover:opacity-70"
              >
                運営会社
              </a>
            </div>
          </MaxWidth>
        </div>

        <a className="hidden" href={redirectUrl} ref={linkRef} />
        {/* /form-card */}
      </form>
      <LoadingModal isLoading={isSubmitting} />
    </>
  );
}
