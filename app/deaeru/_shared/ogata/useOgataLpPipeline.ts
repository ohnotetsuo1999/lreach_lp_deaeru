"use client";

/*
 * 緒方LP 共通の「配管」フック（2026-09-10）
 *
 * lp93a / lp94b の Page.tsx に散らばっていた次の処理を1か所にまとめたもの。
 * lp93b / lp94c / lp94b の3本（共通フォーム OgataEntryForm を使う LP）から呼ぶ。
 *
 * - 流入情報: currentUrl / inflowDatetime / sid（?sid=）/ ad_id（?ad_id=）の取り込み
 * - Intro（訴求画面）表示中のスクロール量の保持（行動集計用）
 * - 離脱時の行動集計ビーコン（未送信離脱者の記録）
 * - 送信: users → lp_sessions（lp_key = deaeru-<lpCode>-<id>）/ users_info 保存、
 *         Slack 通知（ASP名：緒方）、行動集計（送信時）、thanks へ遷移
 *
 * ※ 緒方は sid でのキックバック送信は無い（GAS スプシ記録のみ）が、
 *   他LPと同じく sid / ad_id は thanks → Gateway → tracking へ引き継ぐ。
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { formatDate } from "@/utils";
import { createClient } from "@/lib/supabase/client";
import type { OgataFormData } from "./OgataEntryForm";

const EMPTY_FORM_DATA: OgataFormData = {
  birth_year: "",
  full_name: "",
  gender: "",
  phone_number: "",
  preferred_work_location: [],
};

interface UseOgataLpPipelineParams {
  /** LPコード（例: "lp93b"）。lp_key と thanks パスに使う */
  lpCode: string;
  /** URL の [id]（媒体ID・CRコード） */
  id: string;
  /** lp_key を丸ごと差し替えたい場合（既存LPの uuid 互換） */
  uuid?: string;
  /** 送信成功（thanks 遷移直前）に呼ぶ任意処理（先方計測など） */
  onSubmitSuccess?: () => void;
}

interface SubmitResult {
  lp_sessions_id: string;
  users_id: string;
}

function calculateIntroScrollRate(currentScrollY: number, maxScrollY: number): number {
  if (maxScrollY === 0) return 0;
  return Math.round((currentScrollY / maxScrollY) * 100);
}

export function useOgataLpPipeline({
  lpCode,
  id,
  uuid,
  onSubmitSuccess,
}: UseOgataLpPipelineParams) {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [isCta1Submitted, setIsCta1Submitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [inflowDatetime, setInflowDatetime] = useState("");
  const [sid, setSid] = useState("");
  const [adId, setAdId] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const linkRef = useRef<HTMLAnchorElement>(null);
  const formDataRef = useRef<OgataFormData>(EMPTY_FORM_DATA);
  const startTimeRef = useRef<number>(Date.now());
  const introScrollYRef = useRef<number>(0);
  const introMaxScrollYRef = useRef<number>(0);
  const hasSentBeaconRef = useRef<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  /* 保存に成功したのに Slack 通知だけ失敗して再送信された場合、DB へ二重登録しないよう保存結果を保持する */
  const savedResultRef = useRef<SubmitResult | null>(null);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setInflowDatetime(formatDate(new Date(Date.now())));

    const urlParams = new URLSearchParams(window.location.search);
    const sidParam = urlParams.get("sid");
    if (sidParam) setSid(sidParam);
    const adIdParam = urlParams.get("ad_id");
    if (adIdParam) setAdId(adIdParam);
  }, []);

  /* thanks から「戻る」で bfcache 復元されたとき、送信中表示のまま固まらないよう戻す */
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  /* Intro 表示中のスクロール量を保持（行動集計用） */
  useEffect(() => {
    if (!isIntroVisible) return;

    const handleScroll = () => {
      introScrollYRef.current = window.scrollY;
      introMaxScrollYRef.current =
        document.documentElement.scrollHeight - window.innerHeight;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isIntroVisible]);

  const getStayingTime = useCallback((): number => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const buildActionStatisticsPayload = useCallback(
    (isCta3Submitted: boolean) => ({
      ...formDataRef.current,
      inflow_datetime: inflowDatetime,
      current_url: currentUrl,
      staying_time: getStayingTime(),
      intro_scroll_y: introScrollYRef.current,
      intro_scroll_rate: `${calculateIntroScrollRate(introScrollYRef.current, introMaxScrollYRef.current)}%`,
      is_cta_1_submitted: isCta1Submitted,
      is_cta_2_submitted: false,
      is_cta_3_submitted: isCta3Submitted,
    }),
    [currentUrl, getStayingTime, inflowDatetime, isCta1Submitted]
  );

  /* 離脱時の行動集計ビーコン（未送信離脱者の記録） */
  useEffect(() => {
    const sendBeaconData = () => {
      if (isSubmittingRef.current) return;
      if (hasSentBeaconRef.current) return;
      hasSentBeaconRef.current = true;

      const blob = new Blob([JSON.stringify(buildActionStatisticsPayload(false))], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/spreadsheet/gt/action-statistics", blob);
    };

    const handlePagehide = () => sendBeaconData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendBeaconData();
    };

    window.addEventListener("pagehide", handlePagehide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", handlePagehide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [buildActionStatisticsPayload]);

  /** フォームの入力内容を保持（離脱ビーコン用）。OgataEntryForm の onFormDataChange に渡す */
  const setFormDataForBeacon = useCallback((formData: OgataFormData) => {
    formDataRef.current = formData;
  }, []);

  /** 訴求画面の CTA 押下 → フォーム表示 */
  const showForm = useCallback(() => {
    setIsCta1Submitted(true);
    setIsIntroVisible(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /** フォームヘッダーのロゴ押下 → 訴求画面へ戻る（先方HTMLの index.html リンク相当） */
  const showIntro = useCallback(() => {
    setIsIntroVisible(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  async function sendNotification(fd: OgataFormData): Promise<boolean> {
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

  async function saveDataToSupabase(fd: OgataFormData): Promise<SubmitResult | false> {
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
            answers: fd,
            is_submitted: true,
            lp_key: uuid ?? `deaeru-${lpCode}-${id}`,
            referrer_url: currentUrl,
            user_id: usersId,
          })
          .select("id")
          .single(),
        supabase
          .from("users_info")
          .insert({
            birthyear: fd.birth_year,
            name: fd.full_name,
            phone_number: fd.phone_number,
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

      return { lp_sessions_id: lpSessionsData.id, users_id: usersData.id };
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      return false;
    }
  }

  async function sendActionStatisticsSpreadsheet(): Promise<boolean> {
    if (!startTimeRef.current) return false;
    try {
      const res = await fetch("/api/spreadsheet/gt/action-statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildActionStatisticsPayload(true)),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("エラー: " + data.error);
        return false;
      }
      return true;
    } catch {
      console.error("LP行動集計シートのデータ送信中にエラーが発生しました！");
      return false;
    }
  }

  function getThanksUrl({ lp_sessions_id, users_id }: SubmitResult): string {
    const params = new URLSearchParams({
      lpSessionsId: lp_sessions_id,
      referrerUrl: currentUrl,
      usersId: users_id,
    });
    if (sid) params.append("sid", sid);
    if (adId) params.append("ad_id", adId);
    return `/deaeru/${lpCode}/${id}/thanks?${params.toString()}`;
  }

  /**
   * 送信本体。OgataEntryForm の onSubmit に渡す。
   * 入力チェックはフォーム側で済んでいる前提。失敗時は throw（フォーム側で alert）。
   */
  async function submit(fd: OgataFormData): Promise<void> {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    formDataRef.current = fd;

    try {
      const [data, notification, spreadsheet] = await Promise.all([
        // 再送信時（前回 DB 保存は成功・通知だけ失敗）は保存をスキップして前回の結果を使う
        savedResultRef.current ?? saveDataToSupabase(fd),
        sendNotification(fd),
        sendActionStatisticsSpreadsheet(),
      ]);

      if (data) savedResultRef.current = data;
      if (!data || !notification) {
        throw new Error("エントリーに失敗しました");
      }
      if (!spreadsheet) console.warn("スプレッドシート送信に失敗しました");

      onSubmitSuccess?.();

      const thanksUrl = getThanksUrl(data);
      setRedirectUrl(thanksUrl);

      // state 反映を待たず、隠しアンカーへ直接 href を入れて確実に遷移する。
      // 待つ対象は無い（先方計測は sendBeacon で遷移をまたぐ）ため即時遷移し、保険として遅延呼び出しも残す
      let hasNavigated = false;
      const navigate = () => {
        if (hasNavigated) return;
        hasNavigated = true;
        if (linkRef.current) {
          linkRef.current.href = thanksUrl;
          linkRef.current.click();
        } else {
          window.location.assign(thanksUrl);
        }
      };
      navigate();
      setTimeout(navigate, 1500);
    } catch (error) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      throw error;
    }
  }

  return {
    isIntroVisible,
    isSubmitting,
    showForm,
    showIntro,
    submit,
    setFormDataForBeacon,
    redirectUrl,
    linkRef,
  };
}
