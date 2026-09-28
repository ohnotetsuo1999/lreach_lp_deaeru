"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "@/utils";

import { createClient } from "@/lib/supabase/client";
import {
  ConditionPopup,
  Intro,
  type ConditionPopupAnswers,
} from "@/app/deaeru/lp91a/[id]/_components/section";

interface Props {
  id: string;
}

/**
 * lp_sessions.answers に保存する回答。
 * キー名は後続の処理が読む名前に揃えている。
 *   - birth_year / preferred_work_location: 予約フォーム（deaeru-direct）の自動入力、Bot の年齢判定
 *   - medical_history: Bot の就業制限・既往歴シナリオ分岐（"はい" で分岐）
 * 氏名・電話番号は LP では聞かず、予約時に deaeru-direct のフォームで取得する。
 */
interface Lp91aAnswers {
  birth_year: string;
  preferred_work_location: string[];
  medical_history: ConditionPopupAnswers["medicalHistory"];
}

function toAnswers({ age, locations, medicalHistory }: ConditionPopupAnswers): Lp91aAnswers {
  return {
    birth_year: String(new Date().getFullYear() - Number(age)),
    preferred_work_location: locations,
    medical_history: medicalHistory,
  };
}

function calculateIntroScrollRate(currentScrollY: number, maxScrollY: number): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}

export function Page({ id }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCtaClicked, setIsCtaClicked] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState("");

  const startTimeRef = useRef<number>(Date.now());
  const scrollYRef = useRef<number>(0);
  const maxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);

  const lpKey = `deaeru-lp91a-${id}`;

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));
  }, []);

  /* スクロール量を保持（行動集計用） */
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
      maxScrollYRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getStayingTime(): number {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }

  function buildActionStatistics(answers: Lp91aAnswers | null, isSubmitted: boolean) {
    return {
      ...(answers ?? {}),
      inflow_datetime: inflowDatetime,
      current_url: currentUrl,
      staying_time: getStayingTime(),
      intro_scroll_y: scrollYRef.current,
      intro_scroll_rate: `${calculateIntroScrollRate(scrollYRef.current, maxScrollYRef.current)}%`,
      is_cta_1_submitted: isCtaClicked,
      is_cta_2_submitted: false,
      is_cta_3_submitted: isSubmitted,
    };
  }

  /* 送信せずに離脱した場合の行動集計送信 */
  useEffect(() => {
    const sendBeaconData = () => {
      if (isSubmitting || hasSentBeaconRef.current) return;
      hasSentBeaconRef.current = true;
      const blob = new Blob([JSON.stringify(buildActionStatistics(null, false))], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/spreadsheet/gt/action-statistics", blob);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendBeaconData();
    };
    window.addEventListener("pagehide", sendBeaconData);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", sendBeaconData);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // buildActionStatistics は下記の state から組み立てるため、それらの変化で登録し直す
  }, [isSubmitting, isCtaClicked, currentUrl, inflowDatetime]);

  async function saveDataToSupabase(
    answers: Lp91aAnswers
  ): Promise<{ lp_sessions_id: string; users_id: string } | false> {
    try {
      const supabase = createClient();

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .insert({ created_at: new Date().toISOString() })
        .select("id")
        .single();
      if (usersError) return false;

      const usersId = usersData.id;

      const [lpSessions] = await Promise.all([
        supabase
          .from("lp_sessions")
          .insert({
            answers,
            is_submitted: true,
            lp_key: lpKey,
            referrer_url: currentUrl,
            user_id: usersId,
          })
          .select("id")
          .single(),
        // 氏名・電話番号は予約時に deaeru-direct のフォームで埋まる
        supabase.from("users_info").insert({
          birthyear: answers.birth_year,
          users_id: usersId,
        }),
      ]);

      if (lpSessions.error) return false;

      return { lp_sessions_id: lpSessions.data.id, users_id: usersId };
    } catch {
      return false;
    }
  }

  async function sendNotification(answers: Lp91aAnswers): Promise<void> {
    try {
      await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "C0ACG4U5G68",
          text: [
            "【出会えるエージェント_LPに回答しました（ポップアップ）】",
            "ASP名：サルクルー",
            `回答日時：${formatDate(new Date())}`,
            `生まれ年：${answers.birth_year}`,
            `希望勤務地：${answers.preferred_work_location.join(", ")}`,
            `既往歴：${answers.medical_history}`,
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
    } catch {
      // 通知失敗でも LINE 追加の導線は止めない
    }
  }

  async function sendActionStatistics(answers: Lp91aAnswers): Promise<void> {
    try {
      await fetch("/api/spreadsheet/gt/action-statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildActionStatistics(answers, true)),
      });
    } catch {
      // 行動集計は分析用の補助なので失敗しても続行する
    }
  }

  const handleCtaClick = () => {
    setIsCtaClicked(true);
    setIsPopupOpen(true);
  };

  async function handleSubmit(popupAnswers: ConditionPopupAnswers): Promise<void> {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answers = toAnswers(popupAnswers);

    const [data] = await Promise.all([
      saveDataToSupabase(answers),
      sendNotification(answers),
      sendActionStatistics(answers),
    ]);

    if (!data) {
      alert("送信に失敗しました。時間をおいて再度お試しください。");
      setIsSubmitting(false);
      return;
    }

    // サンクスページ（CVタグ発火）→ Gateway → LIFF → 公式LINE の順に進む。
    // sid はサルクルーのキックバック（LINE追加時に Bot が送信）に必要なので必ず引き継ぐ。
    const thanksParams = new URLSearchParams({
      lpSessionsId: data.lp_sessions_id,
      usersId: data.users_id,
      referrerUrl: currentUrl,
    });
    const sid = new URLSearchParams(window.location.search).get("sid");
    if (sid) thanksParams.append("sid", sid);

    window.location.href = `/deaeru/lp91a/${id}/thanks?${thanksParams.toString()}`;
  }

  return (
    <>
      <Intro onCtaClick={handleCtaClick} />
      <ConditionPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
