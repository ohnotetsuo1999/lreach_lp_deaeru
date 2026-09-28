"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { cn, formatDate, formatISOToJST } from "@/utils";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
  normalizePhoneNumber,
  useTwilioPhoneValidation,
} from "@/hooks/usePhoneValidation";
import { validateNameFields } from "@/hooks/useNameValidation";
import { Container, MaxWidth } from "@/components/common";
import { Header } from "@/app/deaeru/form01b/_components/layout";
import {
  BasicInfo,
  BookingStep,
  JobChangeInfo,
} from "@/app/deaeru/form01b/_components/section";
import { type FormData } from "@/app/deaeru/form01b/_types/form-data";
import { Intro } from "@/app/deaeru/lp99l/[id]/_components/section";

interface Props {
  id: string;
  uuid?: string;
}

const TOTAL_STEPS = 3;

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
  "job_change_count",
  "job_change_reason",
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
  job_change_count: "",
  job_change_reason: "",
};

function getAnsweredQuestions(formData: FormData): number {
  return REQUIRED_FIELDS.filter((key) => {
    const v = formData[key];
    return Array.isArray(v) ? v.length > 0 : v !== "" && v !== undefined;
  }).length;
}

function isAllFieldsFilled(formData: FormData): boolean {
  return getAnsweredQuestions(formData) === REQUIRED_FIELDS.length;
}

function calculateIntroScrollRate(
  currentScrollY: number,
  maxScrollY: number
): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}
export function Page({ id, uuid }: Props) {
  const [step, setStep] = useState(1);
  const [sid, setSid] = useState<string>("");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isIntroVisible, setIsIntroVisible] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCta1Submitted, setIsCta1Submitted] = useState<boolean>(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [inflowDatetime, setInflowDatetime] = useState<string>("");
  const [isCta2Submitted, setIsCta2Submitted] = useState<boolean>(false);
  const [isPhoneDisabled, setIsPhoneDisabled] = useState(false);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");

  const { phoneError, isPhoneValidating, handlePhoneBlur } =
    useTwilioPhoneValidation({
      onPhoneChange: (phone) =>
        setFormData((prev) => ({ ...prev, phone_number: phone })),
    });

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
  const jobChangeCountRef = useRef<HTMLDivElement | null>(null);
  const jobChangeReasonRef = useRef<HTMLDivElement | null>(null);
  const bookingMethodRef = useRef<HTMLDivElement | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);
  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));
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
  }, [
    formData,
    inflowDatetime,
    currentUrl,
    isCta1Submitted,
    isCta2Submitted,
    isSubmitting,
  ]);

  const isStep1Complete =
    formData.preferred_work_style !== "" &&
    formData.preferred_annual_income !== "" &&
    formData.preferred_job_category !== "" &&
    formData.job_change_timing !== "" &&
    formData.job_change_count !== "" &&
    formData.job_change_reason !== "";

  const isStep2Complete =
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
    !isPhoneDisabled;

  const isStep3Complete =
    !!formData.booking_method &&
    !!formData.booking_start_time &&
    !!formData.booking_end_time;

  const updateFormData = (
    event:
      | SyntheticEvent<HTMLInputElement | HTMLSelectElement>
      | ChangeEvent<HTMLInputElement>
  ) => {
    const target =
      event.currentTarget ?? (event as ChangeEvent<HTMLInputElement>).target;
    const { name, value } = target;

    if (name === "last_name") {
      setLastName(value);
      setFormData((prev) => ({
        ...prev,
        full_name: `${value} ${firstName}`.trim(),
      }));
      return;
    }
    if (name === "first_name") {
      setFirstName(value);
      setFormData((prev) => ({
        ...prev,
        full_name: `${lastName} ${value}`.trim(),
      }));
      return;
    }
    if (name === "last_name_kana") {
      setLastNameKana(value);
      setFormData((prev) => ({
        ...prev,
        full_name_kana: `${value} ${firstNameKana}`.trim(),
      }));
      return;
    }
    if (name === "first_name_kana") {
      setFirstNameKana(value);
      setFormData((prev) => ({
        ...prev,
        full_name_kana: `${lastNameKana} ${value}`.trim(),
      }));
      return;
    }

    if (name === "birth_year") {
      const numericAge = Number(value);
      if (
        Number.isInteger(numericAge) &&
        numericAge >= 20 &&
        numericAge <= 29
      ) {
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

  const handleBookingChange = (data: {
    booking_method: string;
    booking_date: string;
    booking_start_time: string;
    booking_end_time: string;
  }) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  async function sendNotification(fd: FormData): Promise<boolean> {
    try {
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C0ACG4U5G68",
          text: [
            "【出会えるエージェント_LPに回答しました（予約付き）】",
            `ASP名：サルクルー`,
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
            `転職回数：${fd.job_change_count}`,
            `転職理由：${fd.job_change_reason}`,
            `案内方法：${fd.booking_method === "online" ? "オンライン面談" : "電話"}`,
            `予約日時：${formatISOToJST(fd.booking_start_time || "")}`,
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
            lp_key: uuid ?? `deaeru-lp99l-${id}`,
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

  async function saveBooking(usersId: string): Promise<boolean> {
    if (
      !formData.booking_method ||
      !formData.booking_start_time ||
      !formData.booking_end_time
    ) {
      console.error("[LP予約] 必須予約情報不足", {
        has_booking_method: Boolean(formData.booking_method),
        has_booking_start_time: Boolean(formData.booking_start_time),
        has_booking_end_time: Boolean(formData.booking_end_time),
        usersId,
      });
      return false;
    }

    try {
      console.log("[LP予約] 保存開始", {
        usersId,
        booking_method: formData.booking_method,
        booking_start_time: formData.booking_start_time,
        booking_end_time: formData.booking_end_time,
        lp_key: uuid ?? `deaeru-lp99l-${id}`,
      });

      const res = await fetch("/api/lp-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booker_name: formData.full_name,
          booking_method: formData.booking_method,
          start_at: formData.booking_start_time,
          end_at: formData.booking_end_time,
          users_id: usersId,
          lp_key: uuid ?? `deaeru-lp99l-${id}`,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[LP予約] API応答エラー", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
          usersId,
        });
        return false;
      }

      const bookingResult = await res.json();
      console.log("[LP予約] 保存成功", {
        usersId,
        bookingId: bookingResult.id,
        reminder_type_id: bookingResult.reminder_type_id,
      });
      return true;
    } catch (error) {
      console.error("[LP予約] 保存例外", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        usersId,
      });
      return false;
    }
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

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
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
      // 枠の空きを先に確認する（満枠/受付停止/ブロック枠で users 等のゴミデータを作らないため）。
      // ここで弾けば saveDataToSupabase を呼ばないので DB に何も残らない。
      if (formData.booking_start_time && formData.booking_end_time) {
        const slotCheck = await fetch("/api/interview-bookings/check-slot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start_at: formData.booking_start_time,
            end_at: formData.booking_end_time,
          }),
        });
        if (!slotCheck.ok) {
          const result = await slotCheck.json().catch(() => ({}));
          alert(
            result?.error ||
              "選択された枠は予約できません。別の日時を選択してください。"
          );
          setIsSubmitting(false);
          return;
        }
      }

      const [data, , spreadsheet] = await Promise.all([
        saveDataToSupabase(),
        sendNotification(formData),
        sendActionStatisticsSpreadsheet(),
      ]);

      if (!data) throw new Error("データ保存に失敗しました");
      if (!spreadsheet) console.warn("スプレッドシート送信に失敗しました");

      const isBookingSaved = await saveBooking(data.users_id);
      if (!isBookingSaved) {
        throw new Error("予約保存に失敗しました");
      }

      // URLパラメータからsidを取得
      const urlParams = new URLSearchParams(window.location.search);
      const sidParam = urlParams.get("sid");

      // サンクスページにリダイレクト
      const thanksParams = new URLSearchParams({
        lpSessionsId: data.lp_sessions_id,
        usersId: data.users_id,
        referrerUrl: currentUrl,
      });
      if (sid) {
        thanksParams.append("sid", sid);
      }
      if (sidParam) {
        thanksParams.append("sid", sidParam);
      }

      window.location.href = `/deaeru/lp99l/${id}/thanks?${thanksParams.toString()}`;
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

  const getStepButtonConfig = () => {
    if (step === 1) {
      return {
        nextLabel: "次へ",
        nextDisabled: !isStep1Complete,
        onNext: () => setStep(2),
        showSubmit: false,
      };
    }
    if (step === 2) {
      return {
        nextLabel: "次へ",
        nextDisabled: !isStep2Complete || isPhoneDisabled,
        onNext: () => setStep(3),
        showSubmit: false,
      };
    }
    return {
      nextLabel: "この時間で予約確定する",
      nextDisabled: !isStep3Complete || isSubmitting,
      onNext: undefined,
      showSubmit: true,
    };
  };

  const btnConfig = getStepButtonConfig();

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`flex h-dvh flex-col pt-[72px] pb-20 ${isSubmitting ? "pointer-events-none" : ""}`}
      >
        <Header
          formData={formData}
          getAnsweredQuestions={getAnsweredQuestions}
          currentFormStep={step}
        />
        <div className="flex grow flex-col overflow-hidden">
          {step === 1 && (
            <JobChangeInfo
              stepTitleStep={1}
              preferredWorkStyleRef={preferredWorkStyleRef}
              preferredAnnualIncomeRef={preferredAnnualIncomeRef}
              preferredJobCategoryRef={preferredJobCategoryRef}
              jobChangeTimingRef={jobChangeTimingRef}
              jobChangeCountRef={jobChangeCountRef}
              jobChangeReasonRef={jobChangeReasonRef}
              updateFormData={
                updateFormData as (event: ChangeEvent<HTMLInputElement>) => void
              }
              uniformButtonHeight={true}
            />
          )}
          {step === 2 && (
            <BasicInfo
              stepTitleStep={2}
              birthYearRef={birthYearRef}
              firstName={firstName}
              firstNameKana={firstNameKana}
              formData={formData}
              fullNameRef={fullNameRef}
              fullNameKanaRef={fullNameKanaRef}
              genderRef={genderRef}
              isPhoneValidating={isPhoneValidating}
              lastName={lastName}
              lastNameKana={lastNameKana}
              onPhoneBlur={handlePhoneBlur}
              phoneError={phoneError}
              phoneNumberRef={phoneNumberRef}
              preferredWorkLocationRef={preferredWorkLocationRef}
              updateFormData={updateFormData}
            />
          )}
          {step === 3 && (
            <BookingStep
              bookingMethodRef={bookingMethodRef}
              onBookingChange={handleBookingChange}
              maxDaysFromNow={5}
            />
          )}
        </div>

        <footer className="fixed bottom-0 w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <MaxWidth>
            <Container width="90">
              <div className="flex h-20 items-center justify-between gap-x-4">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                  className={cn(
                    "flex h-12 w-24 shrink-0 items-center justify-center gap-x-2 rounded-lg text-base font-bold transition-all duration-200",
                    "bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
                  )}
                >
                  <ChevronLeft className="w-5" />
                  <span className="font-bold">前へ</span>
                </button>

                {btnConfig.showSubmit ? (
                  <button
                    type="submit"
                    disabled={btnConfig.nextDisabled}
                    className="flex h-12 w-full items-center justify-center gap-x-2 rounded-lg bg-gradient-to-r from-green-500 to-green-400 text-base font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
                  >
                    <span className="font-bold">
                      {isSubmitting ? "読み込み中..." : btnConfig.nextLabel}
                    </span>
                    {!isSubmitting && <ChevronRight className="w-5" />}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={btnConfig.nextDisabled}
                    onClick={btnConfig.onNext}
                    className="flex h-12 w-full items-center justify-center gap-x-2 rounded-lg bg-gradient-to-r from-green-500 to-green-400 text-base font-bold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none"
                  >
                    <span className="font-bold">{btnConfig.nextLabel}</span>
                    <ChevronRight className="w-5" />
                  </button>
                )}
              </div>
            </Container>
          </MaxWidth>
        </footer>
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
              予約を確定しています
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
