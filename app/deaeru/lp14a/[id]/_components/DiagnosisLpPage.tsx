"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { formatDate } from "@/utils";

import { createClient } from "@/lib/supabase/client";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

import {
  AGE_OPTIONS,
  ageLabel,
  allStepsComplete,
  AREA_OPTIONS,
  CHOICES,
  formComplete,
  isTargetUser,
  judge,
  QUESTIONS,
  questionsOfStep,
  RESULT_DETAILS,
  stepComplete,
  TYPES,
  type Answers,
  type AnswerValue,
  type FlavorType,
  type JudgeResult,
} from "./diagnosis";

import "./diagnosis.css";

// ▼▼▼ 設定エリア ▼▼▼
// lp14a: ワークライフ占い診断LP（インハウス・16問診断 → 年齢/希望勤務地 → 結果はLINEで開示）。
// 支給コード（占い診断LP_本番/index.html）を React に移植したもの。画面構成・判定・演出は支給版と同一。
//
// lreach への配線（支給版の CONFIG.LINE_ADD_URL / SUBMIT_ENDPOINT の代替）:
//   - 結果画面の「結果を見る（LINEを追加）」押下で users + lp_sessions を保存し、thanks → Gateway → LINE へ遷移
//     （LINE直行ではなく Gateway 経由にしないと LINE追加が LP回答に紐づかず、bot のシナリオ振り分けができない）
//   - lp_sessions は is_submitted: false で保存する（名前・電話がないため call_targets 自動生成トリガーを発火させない。2026-09-25 ユーザー確認）
//   - 送客非対象者（35歳以上 / 30〜34歳で勤務地「その他」のみ）は保存も Slack 通知もせず、LP内で結果を全開示（LINE誘導なし）
//   - Slack 通知は既存チャンネルへ送る（ASP はインハウス）
const LP_KEY = "deaeru-lp14a";
const SLACK_CHANNEL = "C0ACG4U5G68";
const GTM_ID = "GTM-W7S9ZNV8";
const STORAGE_KEY = "flavor_dx_lp14a_v1";
const LOADING_STEPS = [
  { text: "回答を読み解いています…", progress: 55 },
  { text: "あなたにマッチする働き方を診断中…", progress: 100 },
];
const LOADING_DURATION_MS = 2000;
// ▲▲▲ 設定エリアここまで ▲▲▲

type ScreenId =
  | "start"
  | "step1"
  | "step2"
  | "step3"
  | "form"
  | "loading"
  | "result"
  | "result-direct";
type StepScreen = "step1" | "step2" | "step3";

const ORDER: ScreenId[] = [
  "start",
  "step1",
  "step2",
  "step3",
  "form",
  "result",
];
const STEP_OF: Record<StepScreen, 1 | 2 | 3> = { step1: 1, step2: 2, step3: 3 };

function isStepScreen(id: string): id is StepScreen {
  return id === "step1" || id === "step2" || id === "step3";
}
function isResultScreen(id: ScreenId): boolean {
  return id === "result" || id === "result-direct";
}
function isScreenId(id: string): id is ScreenId {
  return ORDER.includes(id as ScreenId) || id === "result-direct";
}

interface SavedSession {
  lpSessionsId: string;
  usersId: string;
}

interface PersistedState {
  answers: Answers;
  age: number | null;
  areas: string[];
  result: JudgeResult | null;
  sid: string | null;
  saved: SavedSession | null;
}

const RESULT_TYPE_LABELS: Record<FlavorType, string> = {
  guardian: "定時退勤を守るガーディアン",
  meister: "早業でこなすマイスター",
  nomad: "マイルールを貫くノマド",
  sprinter: "全力で駆けるスプリンター",
  magician: "自在に変わるマジシャン",
};

const RESULT_BANNERS: { type: FlavorType; src: string }[] = [
  { type: "guardian", src: "/deaeru-lp14a-result-guardian.jpg" },
  { type: "meister", src: "/deaeru-lp14a-result-meister.jpg" },
  { type: "nomad", src: "/deaeru-lp14a-result-nomad.jpg" },
  { type: "sprinter", src: "/deaeru-lp14a-result-sprinter.jpg" },
  { type: "magician", src: "/deaeru-lp14a-result-magician.jpg" },
];

function newSid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID)
      return crypto.randomUUID();
  } catch {
    /* noop */
  }
  return `sid-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** GA4 / GTM があれば送る。無ければ何もしない（支給版 track() と同じ） */
function track(name: string, params: Record<string, unknown> = {}): void {
  try {
    const w = window as Window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: Record<string, unknown>[];
    };
    if (typeof w.gtag === "function") w.gtag("event", name, params);
    if (Array.isArray(w.dataLayer))
      w.dataLayer.push({ event: name, ...params });
  } catch {
    /* noop */
  }
}

interface Props {
  id: string;
}

export function DiagnosisLpPage({ id }: Props) {
  const lpKey = `${LP_KEY}-${id}`;
  const { markCtaClicked } = useLpActionStatistics(LP_KEY);

  const [screen, setScreen] = useState<ScreenId>("start");
  const [answers, setAnswers] = useState<Answers>({});
  const [age, setAge] = useState<number | null>(null);
  const [areas, setAreas] = useState<string[]>([]);
  const [result, setResult] = useState<JudgeResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<ScreenId, string>>>({});
  const [missingQids, setMissingQids] = useState<string[]>([]);
  const [missingField, setMissingField] = useState<"age" | "area" | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* イベントリスナー（popstate 等）や setTimeout から最新値を読むための ref */
  const stateRef = useRef<PersistedState>({
    answers: {},
    age: null,
    areas: [],
    result: null,
    sid: null,
    saved: null,
  });
  const screenRef = useRef<ScreenId>("start");
  const hydratedRef = useRef(false);
  const currentUrlRef = useRef("");
  const aspSidRef = useRef("");

  stateRef.current = { ...stateRef.current, answers, age, areas, result };
  screenRef.current = screen;

  /* ------------------------------------------------------------------
     永続化（sessionStorage）
     ------------------------------------------------------------------ */
  const persist = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateRef.current));
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    persist();
  }, [answers, age, areas, result, persist]);

  /* ------------------------------------------------------------------
     入力チェック
     ------------------------------------------------------------------ */
  const furthestAllowed = useCallback((): ScreenId => {
    const s = stateRef.current;
    if (!stepComplete(s.answers, 1)) return "step1";
    if (!stepComplete(s.answers, 2)) return "step2";
    if (!stepComplete(s.answers, 3)) return "step3";
    if (!formComplete(s.age, s.areas)) return "form";
    return "result";
  }, []);

  const canEnter = useCallback(
    (target: ScreenId): boolean => {
      if (target === "start" || target === "step1") return true;
      const depth =
        target === "result-direct"
          ? ORDER.indexOf("result")
          : ORDER.indexOf(target);
      return depth <= ORDER.indexOf(furthestAllowed());
    },
    [furthestAllowed]
  );

  /** 現在の画面から次へ進めるか。進めない場合は理由を表示してフォーカスを合わせる */
  const validateBeforeLeaving = useCallback((from: ScreenId): boolean => {
    const s = stateRef.current;
    if (isStepScreen(from)) {
      const missing = questionsOfStep(STEP_OF[from]).filter(
        (q) => typeof s.answers[q.id] !== "number"
      );
      if (missing.length) {
        setErrors((prev) => ({
          ...prev,
          [from]: `未回答が${missing.length}問あります。すべてお答えください。`,
        }));
        setMissingQids(missing.map((q) => q.id));
        const firstCard = document.querySelector<HTMLElement>(
          `.qcard[data-qid="${missing[0].id}"]`
        );
        if (firstCard) {
          firstCard.scrollIntoView({ behavior: "smooth", block: "center" });
          firstCard
            .querySelector<HTMLElement>(".qopt")
            ?.focus({ preventScroll: true });
        }
        return false;
      }
      return true;
    }
    if (from === "form") {
      if (!formComplete(s.age, s.areas)) {
        const lack: string[] = [];
        if (s.age === null) lack.push("年齢");
        if (!s.areas.length) lack.push("希望勤務地");
        setErrors((prev) => ({
          ...prev,
          form: `${lack.join("と")}を選択してください。`,
        }));
        const field = s.age === null ? "age" : "area";
        setMissingField(field);
        const grid = document.getElementById(
          field === "age" ? "ageGrid" : "areaGrid"
        );
        const first = grid?.querySelector<HTMLElement>(".pill-chip");
        if (first) {
          first.scrollIntoView({ behavior: "smooth", block: "center" });
          first.focus({ preventScroll: true });
        }
        return false;
      }
      return true;
    }
    return true;
  }, []);

  /* ------------------------------------------------------------------
     結果の確定
     ------------------------------------------------------------------ */
  const finalizeResult = useCallback((): JudgeResult => {
    const s = stateRef.current;
    const r = judge(s.answers);
    if (!s.sid) stateRef.current.sid = newSid();
    stateRef.current.result = r;
    setResult(r);
    return r;
  }, []);

  /* ------------------------------------------------------------------
     画面遷移
     ------------------------------------------------------------------ */
  const show = useCallback((target: ScreenId) => {
    screenRef.current = target;
    setScreen(target);
    window.scrollTo(0, 0);
  }, []);

  const pushHash = useCallback((target: ScreenId) => {
    try {
      if (window.location.hash !== `#${target}`) {
        window.history.pushState({ screen: target }, "", `#${target}`);
      }
    } catch {
      /* noop */
    }
  }, []);

  const trackResultView = useCallback((target: ScreenId) => {
    const r = stateRef.current.result;
    track("result_view", {
      flavor_type: r?.type,
      target_user: target === "result",
    });
  }, []);

  /** アンケート完了 → 結果表示の間に約2秒の集計演出を挟む */
  const showLoadingThen = useCallback(
    (finalId: ScreenId, push: boolean) => {
      show("loading");
      setLoadingStep(0);
      setLoadingPercent(0);
      let stepIndex = 0;
      const stepInterval = window.setInterval(() => {
        stepIndex++;
        if (stepIndex < LOADING_STEPS.length) setLoadingStep(stepIndex);
      }, LOADING_DURATION_MS / LOADING_STEPS.length);

      window.setTimeout(() => {
        window.clearInterval(stepInterval);
        /* 演出中にユーザーが離脱（戻る操作など）していたら上書きしない */
        if (screenRef.current !== "loading") return;
        show(finalId);
        if (push) pushHash(finalId);
        trackResultView(finalId);
      }, LOADING_DURATION_MS);
    },
    [pushHash, show, trackResultView]
  );

  /* ローディングの「◯%」カウントアップ（ステップが進むたびに 550ms で補間） */
  useEffect(() => {
    if (screen !== "loading") return;
    const from =
      loadingStep === 0 ? 0 : LOADING_STEPS[loadingStep - 1].progress;
    const to = LOADING_STEPS[loadingStep].progress;
    const duration = 550;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setLoadingPercent(Math.round(from + (to - from) * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [screen, loadingStep]);

  const go = useCallback(
    (rawId: string, push = true): boolean => {
      let target: ScreenId = isScreenId(rawId) ? rawId : "start";
      /* 'result' 行き先は、送客対象かどうかで 'result' / 'result-direct' に振り分ける */
      if (target === "result") {
        target = isTargetUser(stateRef.current.age, stateRef.current.areas)
          ? "result"
          : "result-direct";
      }
      const current = screenRef.current;

      /* 前へ進むときだけ入力チェック（result-direct は result と同じ深さ扱い） */
      const targetDepth =
        target === "result-direct"
          ? ORDER.indexOf("result")
          : ORDER.indexOf(target);
      const currentDepth =
        current === "result-direct"
          ? ORDER.indexOf("result")
          : ORDER.indexOf(current);
      if (current !== "loading" && targetDepth > currentDepth) {
        if (!validateBeforeLeaving(current)) return false;
      }
      if (!canEnter(target)) target = furthestAllowed();

      if (isResultScreen(target)) {
        if (!stateRef.current.result) finalizeResult();
      }

      /* アンケート画面から結果へ進む、まさにその瞬間だけローディング演出を挟む */
      if (isResultScreen(target) && current === "form") {
        showLoadingThen(target, push);
        return true;
      }
      /* Step3 を抜けた時点で結果を確定しておく */
      if (target === "form" && allStepsComplete(stateRef.current.answers))
        finalizeResult();

      show(target);
      if (push) pushHash(target);

      /* 計測 */
      if (target === "step1") track("diagnosis_start", {});
      if (isStepScreen(target)) track("step_view", { step: STEP_OF[target] });
      if (target === "form") {
        const r = stateRef.current.result;
        track("diagnosis_complete", {
          flavor_type: r?.type,
          score_s: r?.S,
          score_p: r?.P,
        });
      }
      if (isResultScreen(target)) trackResultView(target);
      return true;
    },
    [
      canEnter,
      finalizeResult,
      furthestAllowed,
      pushHash,
      show,
      showLoadingThen,
      trackResultView,
      validateBeforeLeaving,
    ]
  );

  const back = useCallback(() => {
    if (window.history.length > 1) window.history.back();
    else {
      const i = ORDER.indexOf(screenRef.current);
      go(ORDER[Math.max(0, i - 1)], true);
    }
  }, [go]);

  /* ------------------------------------------------------------------
     初期化: 保存済み回答の復元・URLハッシュ・履歴イベント
     ------------------------------------------------------------------ */
  useEffect(() => {
    currentUrlRef.current = window.location.href;
    aspSidRef.current =
      new URLSearchParams(window.location.search).get("sid") ?? "";

    /* 保存済み状態の復元 */
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const o = JSON.parse(raw) as Partial<PersistedState>;
        stateRef.current = {
          answers: o.answers && typeof o.answers === "object" ? o.answers : {},
          age: typeof o.age === "number" ? o.age : null,
          areas: Array.isArray(o.areas) ? o.areas : [],
          result: o.result ?? null,
          sid: o.sid ?? null,
          saved: o.saved ?? null,
        };
        setAnswers(stateRef.current.answers);
        setAge(stateRef.current.age);
        setAreas(stateRef.current.areas);
        setResult(stateRef.current.result);
      }
    } catch {
      /* noop */
    }
    hydratedRef.current = true;

    const resolveHash = (): ScreenId => {
      const raw = (window.location.hash || "#start").slice(1);
      let target: ScreenId = isScreenId(raw) ? raw : "start";
      if (!canEnter(target)) target = "start";
      return target;
    };

    /* 初期表示: URLハッシュを尊重しつつ、到達できない画面には入れない */
    const s = stateRef.current;
    let start = resolveHash();
    if (
      isResultScreen(start) &&
      !s.result &&
      allStepsComplete(s.answers) &&
      formComplete(s.age, s.areas)
    )
      finalizeResult();
    if (isResultScreen(start) && !stateRef.current.result) start = "start";
    show(start);
    try {
      window.history.replaceState({ screen: start }, "", `#${start}`);
    } catch {
      /* noop */
    }
    track("lp_view", {});

    const onPopState = (ev: PopStateEvent) => {
      const state = ev.state as { screen?: string } | null;
      const raw = state?.screen ?? (window.location.hash || "#start").slice(1);
      let target: ScreenId = isScreenId(raw) ? raw : "start";
      if (!canEnter(target)) target = furthestAllowed();
      if (isResultScreen(target) && !stateRef.current.result) target = "form";
      show(target);
    };
    /* URLのハッシュを手で書き換えられた場合（popstate は発火しない） */
    const onHashChange = () => {
      const raw = (window.location.hash || "#start").slice(1);
      const target: ScreenId = isScreenId(raw) ? raw : "start";
      if (!canEnter(target)) {
        try {
          window.history.replaceState(
            { screen: screenRef.current },
            "",
            `#${screenRef.current}`
          );
        } catch {
          /* noop */
        }
        return;
      }
      if (target === screenRef.current) return;
      const st = stateRef.current;
      if (
        isResultScreen(target) &&
        !st.result &&
        allStepsComplete(st.answers) &&
        formComplete(st.age, st.areas)
      )
        finalizeResult();
      if (isResultScreen(target) && !stateRef.current.result) return;
      show(target);
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 画面が切り替わったらその画面へフォーカス（支給版 show() と同じ） */
  useEffect(() => {
    document
      .querySelector<HTMLElement>(`.dx14a .screen[data-screen="${screen}"]`)
      ?.focus({ preventScroll: true });
  }, [screen]);

  /* ------------------------------------------------------------------
     回答・アンケートの操作
     ------------------------------------------------------------------ */
  const selectAnswer = (qid: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    setMissingQids((prev) => prev.filter((x) => x !== qid));
    if (isStepScreen(screen)) {
      const next = { ...stateRef.current.answers, [qid]: value };
      if (stepComplete(next, STEP_OF[screen]))
        setErrors((prev) => ({ ...prev, [screen]: undefined }));
    }
  };

  const selectAge = (value: number) => {
    setAge(value);
    setMissingField(null);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  const toggleArea = (name: string) => {
    setAreas((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
    setMissingField(null);
    setErrors((prev) => ({ ...prev, form: undefined }));
  };

  /* 矢印キーでの選択移動（radiogroup の標準的な挙動） */
  const onRadioKey = (ev: React.KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    if (!keys.includes(ev.key)) return;
    ev.preventDefault();
    const wrap = ev.currentTarget.parentElement;
    if (!wrap) return;
    const items = Array.from(wrap.querySelectorAll<HTMLButtonElement>(".qopt"));
    let i = items.indexOf(ev.currentTarget);
    if (i === -1) i = 0;
    const next =
      ev.key === "ArrowLeft" || ev.key === "ArrowUp"
        ? (i - 1 + items.length) % items.length
        : (i + 1) % items.length;
    items[next].focus();
    items[next].click();
  };

  /* ------------------------------------------------------------------
     LINE追加 CTA: 保存 → Slack通知 → thanks → Gateway → LINE
     ------------------------------------------------------------------ */
  async function saveDataToSupabase(
    r: JudgeResult
  ): Promise<SavedSession | false> {
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
      const s = stateRef.current;
      const { data: lpSessionsData, error: lpSessionsError } = await supabase
        .from("lp_sessions")
        .insert({
          answers: {
            flavor_type: r.type,
            flavor_type_name: RESULT_TYPE_LABELS[r.type],
            score_s: r.S,
            score_p: r.P,
            diagnosis_answers: s.answers,
            age: s.age,
            age_label: ageLabel(s.age),
            preferred_work_location: s.areas,
            is_target_user: true,
            diagnosis_sid: s.sid,
          },
          // 名前・電話番号を取らないLPのため、call_targets 自動生成トリガー（is_submitted=true で発火）を通さない
          is_submitted: false,
          lp_key: lpKey,
          referrer_url: currentUrlRef.current,
          user_id: usersData.id,
        })
        .select("id")
        .single();
      if (lpSessionsError) {
        console.error("[Supabase保存] lp_sessionsエラー:", lpSessionsError);
        return false;
      }
      return { lpSessionsId: lpSessionsData.id, usersId: usersData.id };
    } catch (error) {
      console.error("[Supabase保存] 例外発生:", error);
      return false;
    }
  }

  async function sendNotification(r: JudgeResult): Promise<boolean> {
    try {
      const s = stateRef.current;
      const res = await fetch("/api/slack/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: SLACK_CHANNEL,
          text: [
            "【出会えるエージェント_ワークライフ占い診断LPに回答しました（LINE追加前）】",
            "ASP名：インハウス",
            `回答日時：${formatDate(new Date())}`,
            `診断タイプ：${RESULT_TYPE_LABELS[r.type]}（${r.type}）`,
            `スコア：S=${r.S} / P=${r.P}`,
            `年齢：${ageLabel(s.age)}`,
            `希望勤務地：${s.areas.join(", ")}`,
            `流入CR：${currentUrlRef.current}`,
            "",
            "【逆転転職】LP入力内容管理シート",
            "https://lreach-prototype.vercel.app/call-targets",
            "",
            "【逆転転職】Lリーチ HUB",
            "https://lreach-hub.vercel.app/",
          ].join("\n"),
        }),
      });
      if (res.status !== 200) {
        const data = await res.json();
        console.error("エラー: " + data.error);
        return false;
      }
      return true;
    } catch {
      console.error("Slack通知送信中にエラーが発生しました！");
      return false;
    }
  }

  function thanksUrl(saved: SavedSession): string {
    const params = new URLSearchParams({
      lpSessionsId: saved.lpSessionsId,
      referrerUrl: currentUrlRef.current,
      usersId: saved.usersId,
    });
    if (aspSidRef.current) params.append("sid", aspSidRef.current);
    return `/deaeru/lp14a/${id}/thanks?${params.toString()}`;
  }

  async function handleLineCta() {
    if (isSubmitting) return;
    const r = stateRef.current.result ?? finalizeResult();
    markCtaClicked();
    track("line_cta_click", { flavor_type: r.type });
    setIsSubmitting(true);

    /* ブラウザバックで戻って再度押した場合は、同じ回答で lp_sessions を増やさず前回の遷移先へ */
    const already = stateRef.current.saved;
    if (already) {
      window.location.href = thanksUrl(already);
      return;
    }

    try {
      const [saved, notified] = await Promise.all([
        saveDataToSupabase(r),
        sendNotification(r),
      ]);
      if (!saved) throw new Error("保存に失敗しました");
      if (!notified) console.warn("Slack通知に失敗しました");
      stateRef.current.saved = saved;
      persist();
      window.location.href = thanksUrl(saved);
    } catch {
      alert(
        "送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。"
      );
      setIsSubmitting(false);
    }
  }

  /* ------------------------------------------------------------------
     描画
     ------------------------------------------------------------------ */
  const renderStep = (
    stepScreen: StepScreen,
    nextId: ScreenId,
    label: string
  ) => {
    const step = STEP_OF[stepScreen];
    const list = questionsOfStep(step);
    const answered = list.filter(
      (q) => typeof answers[q.id] === "number"
    ).length;
    const ready = answered === list.length;
    return (
      <section
        className={`screen${screen === stepScreen ? " is-active" : ""}`}
        data-screen={stepScreen}
        tabIndex={-1}
        aria-label={`Step ${step}`}
        aria-hidden={screen !== stepScreen || undefined}
      >
        {step > 1 && (
          <button type="button" className="step-back" onClick={back}>
            ← 前に戻る
          </button>
        )}
        <div className="step-progress" aria-hidden="true">
          {([1, 2, 3] as const).map((n, i) => (
            <span key={n} style={{ display: "contents" }}>
              {i > 0 && <div className="step-connector" />}
              <div
                className={`step-dot${n < step ? " done" : n === step ? " now" : ""}`}
              >
                <span className="mark" />
                <span>Step {n}</span>
              </div>
            </span>
          ))}
        </div>
        <div className="step-gauge">
          <div
            className="step-gauge-fill"
            style={{ width: `${Math.round((answered / list.length) * 100)}%` }}
          />
        </div>
        <p className="step-label">{label}</p>

        <div className="qgroup" data-step={step}>
          {list.map((q) => {
            const no = QUESTIONS.indexOf(q) + 1;
            const v = answers[q.id];
            const unanswered = typeof v !== "number";
            return (
              <div
                key={q.id}
                className={`qcard${missingQids.includes(q.id) ? " is-missing" : ""}`}
                data-qid={q.id}
              >
                <p className="qtext" id={`label-${q.id}`}>
                  <b className="qn">Q{no}</b>
                  {q.text}
                </p>
                <div
                  className="qopts"
                  role="radiogroup"
                  aria-labelledby={`label-${q.id}`}
                >
                  {CHOICES.map((choice, ci) => {
                    const on = !unanswered && v === choice.value;
                    return (
                      <button
                        key={choice.label}
                        type="button"
                        className={`qopt${on ? " sel" : ""}`}
                        role="radio"
                        aria-checked={on}
                        data-value={choice.value}
                        tabIndex={on || (unanswered && ci === 0) ? 0 : -1}
                        onClick={() => selectAnswer(q.id, choice.value)}
                        onKeyDown={onRadioKey}
                      >
                        {choice.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className={`step-cta${ready ? " ready" : ""}`}
          onClick={() => go(nextId)}
        >
          次へ
        </button>
        <p className="form-error" role="alert" hidden={!errors[stepScreen]}>
          {errors[stepScreen]}
        </p>
        <p className="step-hint">
          <span>{list.length}</span>問中{" "}
          <span className="ans-count">{answered}</span>問 回答済み
        </p>
      </section>
    );
  };

  const resultType = result?.type ?? null;
  const details = resultType ? RESULT_DETAILS[resultType] : null;

  return (
    <>
      {/* GTM（出会えるエージェントLP共通 W7S9ZNV8）。Pixel 等は GTM 側で管理 */}
      <Script id="deaeru-gtm" strategy="afterInteractive">{`
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
      `}</Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      <div className="dx14a">
        <main className="fp">
          {/* ============ 1. START ============ */}
          <section
            className={`screen${screen === "start" ? " is-active" : ""}`}
            data-screen="start"
            tabIndex={-1}
            aria-label="スタート"
            aria-hidden={screen !== "start" || undefined}
          >
            {/* 見出しは画像に焼き込まれているため、SEO・読み上げ用にテキストでも持たせる */}
            <h1 className="visually-hidden">
              ワークライフ占い診断｜あなたの性格・特徴から向いている働き方を1分で占います（完全無料）
            </h1>
            {/* ▼ CTAボタンの位置調整は diagnosis.css の .dx14a .fv 内 --fv-cta-y / --fv-cta-x / --fv-cta-width の3つだけで行えます */}
            <div className="fv">
              <img
                className="fv-img"
                src="/deaeru-lp14a-fv.jpg"
                width={880}
                height={1563}
                fetchPriority="high"
                decoding="async"
                alt="ワークライフ占い診断。今の働き方以外の可能性も、本当は知りたい。定時退勤を守るガーディアン／早業でこなすマイスター／マイルールを貫くノマド／全力で駆けるスプリンター／自在に変わるマジシャンの5タイプから、あなたの性格・特徴に向いている働き方を占います。完全無料・1分で回答。"
              />
              <div className="fv-cta-slot">
                <button
                  type="button"
                  className="cta fv-cta"
                  onClick={() => go("step1")}
                >
                  無料で診断スタート
                  <span className="cta-arrow" aria-hidden="true">
                    ▶
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* ============ 2〜4. STEP 1〜3 ============ */}
          {renderStep("step1", "step2", "占いは、正直に答えるほど当たります")}
          {renderStep(
            "step2",
            "step3",
            "もう少しで、あなたに合う働き方がわかります"
          )}
          {renderStep("step3", "form", "診断の質問は、これで最後です")}

          {/* ============ 5. アンケート（年齢 / 希望勤務地） ============ */}
          <section
            className={`screen${screen === "form" ? " is-active" : ""}`}
            data-screen="form"
            tabIndex={-1}
            aria-label="アンケート"
            aria-hidden={screen !== "form" || undefined}
          >
            <button type="button" className="step-back" onClick={back}>
              ← 前に戻る
            </button>
            <div className="eyebrow-mark">One More Step</div>
            <h2
              className="hero-head"
              style={{ fontSize: 22, marginBottom: 22 }}
            >
              アンケートへの
              <br />
              ご協力
            </h2>

            <div
              className={`field${missingField === "age" ? " is-missing" : ""}`}
              id="ageField"
            >
              <span className="field-label" id="ageLabel">
                年齢
              </span>
              <div
                className="pill-grid"
                id="ageGrid"
                role="radiogroup"
                aria-labelledby="ageLabel"
              >
                {AGE_OPTIONS.map((opt, i) => {
                  const on = age === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`pill-chip${on ? " sel" : ""}`}
                      role="radio"
                      aria-checked={on}
                      data-age={opt.value}
                      tabIndex={on || (age === null && i === 0) ? 0 : -1}
                      onClick={() => selectAge(opt.value)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div
              className={`field${missingField === "area" ? " is-missing" : ""}`}
              id="areaField"
            >
              <span className="field-label" id="areaLabel">
                希望勤務地 <span className="field-note">複数選択可</span>
              </span>
              <div
                className="pill-grid"
                id="areaGrid"
                role="group"
                aria-labelledby="areaLabel"
              >
                {AREA_OPTIONS.map((name) => {
                  const on = areas.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      className={`pill-chip${on ? " sel" : ""}`}
                      aria-pressed={on}
                      data-area={name}
                      onClick={() => toggleArea(name)}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="cta"
              id="formCta"
              style={{ opacity: formComplete(age, areas) ? 1 : 0.75 }}
              onClick={() => go("result")}
            >
              占いの結果を見る{" "}
              <span className="cta-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p className="form-error" role="alert" hidden={!errors.form}>
              {errors.form}
            </p>
            <p className="fine-print">
              ご回答いただいた年齢・希望勤務地は、診断結果のご案内とサービス改善の目的で利用します。
              <br />
              <a
                href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94"
                target="_blank"
                rel="noopener noreferrer"
              >
                利用規約
              </a>
              ・
              <a
                href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec"
                target="_blank"
                rel="noopener noreferrer"
              >
                プライバシーポリシー
              </a>
            </p>
          </section>

          {/* ============ 5.5 診断中ローディング ============ */}
          <section
            className={`screen${screen === "loading" ? " is-active" : ""}`}
            data-screen="loading"
            tabIndex={-1}
            aria-label="診断結果を集計中"
            aria-live="polite"
            aria-hidden={screen !== "loading" || undefined}
          >
            <div className="loading-box">
              <div className="loading-mark">Now Diagnosing</div>
              <span className="loading-spark" aria-hidden="true">
                ✦
              </span>
              <div className="loading-progress">
                <div
                  className="loading-progress-fill"
                  style={{ width: `${LOADING_STEPS[loadingStep].progress}%` }}
                />
              </div>
              <p className="loading-percent">{loadingPercent}%</p>
              <p className="loading-text">{LOADING_STEPS[loadingStep].text}</p>
            </div>
          </section>

          {/* ============ 6. RESULT TEASER + SERVICE（送客対象者: タイプは伏せて LINE 誘導） ============ */}
          <section
            className={`screen${screen === "result" ? " is-active" : ""}`}
            data-screen="result"
            tabIndex={-1}
            aria-label="診断結果"
            aria-hidden={screen !== "result" || undefined}
          >
            <div className="result-hero">
              <h2 className="visually-hidden">診断が完了しました</h2>
              <img
                className="result-frame"
                src="/deaeru-lp14a-result-frame.jpg"
                width={920}
                height={1382}
                loading="lazy"
                decoding="async"
                alt="診断が完了しました"
              />
              <div className="result-teaser-slot">
                <div className="result-teaser">
                  <span className="teaser-glow" aria-hidden="true" />
                  <div className="result-teaser-stage">
                    <img
                      src="/deaeru-lp14a-question.jpg"
                      width={640}
                      height={979}
                      loading="lazy"
                      decoding="async"
                      alt="診断結果カード（内容は伏せられています）。結果は公式LINEでお届けします"
                    />
                    <span className="teaser-sheen" aria-hidden="true" />
                  </div>
                  <span
                    className="spark tspark"
                    style={{ top: "-4%", left: "-7%", fontSize: 20 }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span
                    className="spark tspark"
                    style={{
                      top: "8%",
                      right: "-9%",
                      fontSize: 14,
                      animationDelay: ".5s",
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span
                    className="spark tspark"
                    style={{
                      top: "44%",
                      left: "-11%",
                      fontSize: 16,
                      animationDelay: "1.1s",
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span
                    className="spark tspark"
                    style={{
                      top: "58%",
                      right: "-8%",
                      fontSize: 22,
                      animationDelay: "1.7s",
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span
                    className="spark tspark"
                    style={{
                      bottom: "2%",
                      left: "-6%",
                      fontSize: 13,
                      animationDelay: "2.3s",
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                  <span
                    className="spark tspark"
                    style={{
                      bottom: "-5%",
                      right: "6%",
                      fontSize: 18,
                      animationDelay: "2.9s",
                    }}
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                </div>
              </div>
            </div>

            <div className="bridge-note">
              <p>結果を見る前に、お伝えさせてください。</p>
              <p>これは、占いだけで終わる話ではありません。</p>
              <p>
                その働き方のクセ、
                <br />
                そのまま「合う職場」のヒントになります。
              </p>
            </div>

            <p className="cta-lede">
              ＼あなたのタイプに合う環境を
              <br />
              出会えるエージェントと
              <br />
              一緒に探しませんか？／
            </p>

            <img
              className="service-image"
              src="/deaeru-lp14a-service.jpg"
              width={867}
              height={1782}
              loading="lazy"
              decoding="async"
              alt="出会えるエージェント。出会えるエージェントは、評価の高い転職エージェントを厳選してご紹介するサービスです。自分では出会えなかった優良なエージェントに出会え、あなたに合った転職のプロを紹介します。相性を見ながら複数社を比較できるから視野が狭くならない。完全無料、簡単なヒアリングだけであとはお任せできます。人材業界出身のサポーターが対応し、厳しい研修を受けたスタッフがあなたのペースに合わせて相談に乗ります。選ばれる3つの理由：1,200件以上のマッチングデータ／即日面談対応で相談しやすい／総合型〜特化型の幅広いエージェントと提携。完全無料なのに転職成功率3.2倍以上（自社アンケートでの調査結果）。"
            />

            <div className="sticky-cta">
              <button
                type="button"
                className="line-cta"
                id="lineCta"
                onClick={handleLineCta}
                disabled={isSubmitting}
                style={isSubmitting ? { opacity: 0.7 } : undefined}
              >
                <span className="ico" aria-hidden="true">
                  L
                </span>{" "}
                {isSubmitting ? "送信中…" : "結果を見る（LINEを追加）"}
              </button>
              <p className="fine-print">
                追加後にご希望をいただければ、あなたに合うエージェントのご紹介も可能です。
              </p>
            </div>
          </section>

          {/* ============ 7. RESULT DIRECT（非対象者向け・LP内でフル開示・LINE誘導なし） ============ */}
          <section
            className={`screen${screen === "result-direct" ? " is-active" : ""}`}
            data-screen="result-direct"
            tabIndex={-1}
            aria-label="診断結果"
            aria-hidden={screen !== "result-direct" || undefined}
          >
            <div className="result-hero">
              <h2 className="visually-hidden">診断結果</h2>
              {/* 通常版の額縁は下部に「公式LINE追加後にお受け取り」の文言が焼き込まれているため、その手前でクロップした専用版を使う */}
              <img
                className="result-frame"
                src="/deaeru-lp14a-result-frame-direct.jpg"
                width={920}
                height={1133}
                loading="lazy"
                decoding="async"
                alt="診断結果"
              />
              <div className="result-teaser-slot result-teaser-slot--direct">
                <div
                  className="result-banner-reveal"
                  id="resultBannerReveal"
                  data-result={resultType ?? undefined}
                >
                  <div className="result-banner-stage">
                    {RESULT_BANNERS.map((b) => (
                      <div
                        key={b.type}
                        className="result-banner"
                        data-type={b.type}
                        aria-label={RESULT_TYPE_LABELS[b.type]}
                      >
                        <img
                          src={b.src}
                          alt={`診断結果：${RESULT_TYPE_LABELS[b.type]}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* タイプ名・長所・伸びしろ・合う環境・タグはすべて結果画像に焼き込み済みのため、HTML側はアクセシビリティ用のみ */}
            <h1 className="visually-hidden">
              {resultType ? TYPES[resultType].name : ""}
            </h1>
            <p className="visually-hidden">{details?.tagline ?? ""}</p>
            <span className="visually-hidden">
              {resultType ? `${TYPES[resultType].sub}タイプ` : ""}
            </span>
            <span className="visually-hidden">{details?.strength ?? ""}</span>
            <span className="visually-hidden">{details?.growth ?? ""}</span>
            <span className="visually-hidden">
              {details?.environment ?? ""}
            </span>
            <p className="visually-hidden">
              {(details?.tags ?? []).map((t) => `#${t}`).join(" ")}
            </p>

            <div className="closing-note">
              <div className="divider" aria-hidden="true" />
              <p className="thanks">
                最後まで診断にお付き合いいただき、
                <br />
                ありがとうございました。
              </p>
              <h3>
                あなたの働き方のクセ、
                <br />
                いかがでしたか？
              </h3>
              <p>
                これからのお仕事選びで、
                <br />
                &quot;自分に合う環境&quot;を選ぶための
                <br />
                小さなヒントになれば嬉しいです。
              </p>
              <p>
                出会えるエージェントは、これからも
                <br />
                一人ひとりに合った&quot;働き方&quot;と出会えるお手伝いができるよう、
                <br />
                日々サービスを育てています。
              </p>
              <p>またどこかで、あなたのお役に立てる機会があれば嬉しいです。</p>
            </div>

            <div className="brand-footer">
              <img src="/deaeru-lp14a-logo.png" alt="" aria-hidden="true" />
              <span>PRESENTED BY 出会えるエージェント</span>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
