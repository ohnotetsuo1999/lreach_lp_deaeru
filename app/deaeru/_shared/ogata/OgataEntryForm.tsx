"use client";

/*
 * 緒方LP 共通「基本情報」フォーム（2026-09-10）
 *
 * 先方支給 register.html / register.js（lp93b / lp94c / lp94b 完成ZIP・2026-09-08版）の React 移植。
 * 3本とも HTML は同一で、<body class="theme-purple|theme-green" data-lp="lpXX"> だけが違うため共通化した。
 *
 * - 項目: 姓・名 / 性別 / 年齢（20〜29のセレクト）/ 希望勤務地（9都府県・複数選択の details）/ 電話番号
 * - 進捗: 入力済みグループ数（5問）で「残り○問」とバーを更新（register.js の update() 相当）
 * - エラー: グループ単位。カードから focus が外れた時と送信時に表示（register.js の showError 相当）
 * - 名前チェックは既存の validateNameFields（先方 register.js の validateName と同じルール）、
 *   電話は既存の Twilio 検証フック（onBlur）＋ 070/080/090 の11桁チェック
 * - 年齢は他LPと同じく生まれ年（birth_year）へ変換して保存する
 * - 送信処理（DB / Slack / 行動集計 / thanks 遷移）は持たず、onSubmit(formData) に委ねる
 * - 「LINEで診断結果を受け取る」ボタンの押下は onLineButtonClick で親へ通知（X タグ用）
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

import { validateNameFields } from "@/hooks/useNameValidation";
import {
  normalizePhoneNumber,
  useTwilioPhoneValidation,
} from "@/hooks/usePhoneValidation";

export type OgataFormTheme = "purple" | "green";

export interface OgataFormData {
  birth_year: string;
  full_name: string;
  gender: string;
  phone_number: string;
  preferred_work_location: string[];
}

interface OgataEntryFormProps {
  theme: OgataFormTheme;
  lpCode: string;
  isSubmitting: boolean;
  /** 入力内容が変わるたびに親へ渡す（離脱時の行動集計ビーコン用） */
  onFormDataChange: (formData: OgataFormData) => void;
  /** 入力チェック通過後に呼ぶ。DB保存〜thanks遷移は親が行う。失敗時は throw する */
  onSubmit: (formData: OgataFormData) => Promise<void>;
  /** 「LINEで診断結果を受け取る」ボタン押下時（X タグ等の計測用。入力チェックの前に呼ぶ） */
  onLineButtonClick?: () => void;
  /** ヘッダーのロゴ押下（先方HTMLでは index.html へ戻るリンク）。未指定ならただの画像 */
  onBrandClick?: () => void;
}

const AGES = ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"];

const WORK_LOCATIONS = [
  "東京都",
  "埼玉県",
  "千葉県",
  "神奈川県",
  "大阪府",
  "京都府",
  "兵庫県",
  "愛知県",
  "福岡県",
];

const TOTAL_GROUPS = 5;

type Group = "name" | "gender" | "age" | "location" | "phone";
const GROUPS: Group[] = ["name", "gender", "age", "location", "phone"];

const PHONE_PATTERN = /^(070|080|090)\d{8}$/;

/* 年齢（20〜29）→ 生まれ年。範囲外は空（他LPと同じ扱い） */
function convertAgeToBirthYear(age: string): string {
  const numericAge = Number(age);
  if (!Number.isInteger(numericAge) || numericAge < 20 || numericAge > 29)
    return "";
  return String(new Date().getFullYear() - numericAge);
}

function buildFullName(lastName: string, firstName: string): string {
  const l = lastName.trim();
  const f = firstName.trim();
  if (l === "" || f === "") return "";
  return `${l} ${f}`;
}

export function OgataEntryForm({
  theme,
  lpCode,
  isSubmitting,
  onFormDataChange,
  onSubmit,
  onLineButtonClick,
  onBrandClick,
}: OgataEntryFormProps) {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  /* 一度でも触った（＝エラーを出してよい）グループ */
  const [touched, setTouched] = useState<Set<Group>>(() => new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const cardRefs = useRef<Record<Group, HTMLDivElement | null>>({
    name: null,
    gender: null,
    age: null,
    location: null,
    phone: null,
  });
  const pickerRef = useRef<HTMLDetailsElement>(null);
  /* 電話番号の Twilio 検証中に送信ボタンが押された場合、検証完了後に自動で送信する
     （blur → 検証開始 → ボタン disabled でクリックが消える競合を防ぐ） */
  const pendingSubmitRef = useRef(false);

  const { phoneError, isPhoneValidating, handlePhoneBlur } =
    useTwilioPhoneValidation({
      onPhoneChange: (phone) => setPhoneNumber(phone),
    });

  const formData = useMemo<OgataFormData>(
    () => ({
      birth_year: convertAgeToBirthYear(age),
      full_name: buildFullName(lastName, firstName),
      gender,
      phone_number: phoneNumber,
      preferred_work_location: locations,
    }),
    [age, lastName, firstName, gender, phoneNumber, locations]
  );

  useEffect(() => {
    onFormDataChange(formData);
  }, [formData, onFormDataChange]);

  /* 各グループのエラー文言（register.js の errorFor 相当） */
  function errorFor(group: Group): string {
    switch (group) {
      case "name":
        return validateNameFields(lastName, firstName, true);
      case "gender":
        return gender ? "" : "性別を選択してください。";
      case "age":
        return AGES.includes(age) ? "" : "年齢を選択してください。";
      case "location":
        return locations.length ? "" : "希望勤務地を1つ以上選んでください。";
      case "phone":
        if (!PHONE_PATTERN.test(phoneNumber))
          return "070・080・090から始まる11桁の電話番号を入力してください。";
        return phoneError;
      default:
        return "";
    }
  }

  const shouldShow = (group: Group) => submitAttempted || touched.has(group);
  const visibleError = (group: Group) => (shouldShow(group) ? errorFor(group) : "");

  /* 入力済みグループ数（進捗表示用。register.js の groups() 相当） */
  const answeredCount = [
    lastName.trim() !== "" && firstName.trim() !== "",
    gender !== "",
    age !== "",
    locations.length > 0,
    phoneInput.trim() !== "",
  ].filter(Boolean).length;

  function markTouched(group: Group) {
    setTouched((prev) => {
      if (prev.has(group)) return prev;
      const next = new Set(prev);
      next.add(group);
      return next;
    });
  }

  /* カードの外へ focus が移った時にそのグループのエラーを出す（register.js の focusout 相当） */
  function handleCardBlur(group: Group) {
    return (event: FocusEvent<HTMLDivElement>) => {
      const card = event.currentTarget;
      if (event.relatedTarget && card.contains(event.relatedTarget as Node)) return;
      markTouched(group);
    };
  }

  function handleLocationChange(event: ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;
    setLocations((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const normalized = normalizePhoneNumber(event.target.value);
    setPhoneInput(event.target.value);
    setPhoneNumber(normalized);
  }

  async function runSubmit() {
    if (isSubmitting) return;

    setSubmitAttempted(true);
    const firstInvalid = GROUPS.find((g) => errorFor(g) !== "");
    if (firstInvalid) {
      if (firstInvalid === "location" && pickerRef.current) pickerRef.current.open = true;
      const card = cardRefs.current[firstInvalid];
      card?.scrollIntoView({ block: "start", behavior: "smooth" });
      const focusTarget = card?.querySelector<HTMLElement>("input, select, summary");
      focusTarget?.focus({ preventScroll: true });
      return;
    }

    try {
      await onSubmit(formData);
    } catch {
      alert("フォームの送信に失敗しました。確認して再度お試しください。");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPhoneValidating) {
      // 検証完了後（下の useEffect）に送信する
      pendingSubmitRef.current = true;
      return;
    }
    await runSubmit();
  }

  useEffect(() => {
    if (isPhoneValidating || !pendingSubmitRef.current) return;
    pendingSubmitRef.current = false;
    void runSubmit();
    // runSubmit は最新の state を閉じ込めた関数でよいため依存から外す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPhoneValidating]);

  const locationSummary = locations.length ? locations.join("・") : "選択してください";

  return (
    <div className={`ogata-form-scope theme-${theme}`} data-lp={lpCode}>
      <form id="entryForm" onSubmit={handleSubmit} noValidate>
        <header className="form-header">
          <div className="header-inner">
            {onBrandClick ? (
              <button type="button" className="brand" onClick={onBrandClick} aria-label="LPに戻る">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/deaeru-logo.png" alt="出会えるエージェント" width={177} height={40} />
              </button>
            ) : (
              <span className="brand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/deaeru-logo.png" alt="出会えるエージェント" width={177} height={40} />
              </span>
            )}
            <div className="progress-row">
              <div
                className="progress-track"
                role="progressbar"
                aria-label="入力の進捗"
                aria-valuemin={0}
                aria-valuemax={TOTAL_GROUPS}
                aria-valuenow={answeredCount}
              >
                <span style={{ width: `${answeredCount * (100 / TOTAL_GROUPS)}%` }} />
              </div>
              <p className="progress-copy">
                残り<strong>{TOTAL_GROUPS - answeredCount}</strong>問
              </p>
            </div>
          </div>
        </header>

        <main className="form-content">
          <div className="form-heading">
            <span>1</span>
            <h1>基本情報</h1>
          </div>

          {/* お名前 */}
          <div
            className="field-card"
            id="field-name"
            ref={(el) => { cardRefs.current.name = el; }}
            onBlur={handleCardBlur("name")}
          >
            <p className="field-label">
              お名前<span className="required">必須</span>
            </p>
            <div className="name-grid">
              <input
                name="last_name"
                type="text"
                placeholder="姓（山田）"
                aria-label="姓"
                autoComplete="family-name"
                required
                aria-invalid={visibleError("name") ? true : undefined}
                aria-describedby="error-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                name="first_name"
                type="text"
                placeholder="名（太郎）"
                aria-label="名"
                autoComplete="given-name"
                required
                aria-invalid={visibleError("name") ? true : undefined}
                aria-describedby="error-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <p className="error" id="error-name" aria-live="polite">{visibleError("name")}</p>
          </div>

          {/* 性別 */}
          <div
            className="field-card"
            id="field-gender"
            ref={(el) => { cardRefs.current.gender = el; }}
            onBlur={handleCardBlur("gender")}
          >
            <p className="field-label">
              性別<span className="required">必須</span>
            </p>
            <div className="choice-grid">
              {["男性", "女性"].map((g) => (
                <label className="choice" key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    required
                    checked={gender === g}
                    onChange={() => { setGender(g); markTouched("gender"); }}
                    aria-describedby="error-gender"
                  />
                  <span>{g}</span>
                </label>
              ))}
            </div>
            <p className="error" id="error-gender" aria-live="polite">{visibleError("gender")}</p>
          </div>

          {/* 年齢 */}
          <div
            className="field-card"
            id="field-age"
            ref={(el) => { cardRefs.current.age = el; }}
            onBlur={handleCardBlur("age")}
          >
            <label className="field-label" htmlFor="ogata-age">
              年齢<span className="required">必須</span>
            </label>
            <div className="select-wrap">
              <select
                id="ogata-age"
                name="birth_year"
                required
                className={age === "" ? "is-placeholder" : undefined}
                aria-invalid={visibleError("age") ? true : undefined}
                aria-describedby="age-note error-age"
                value={age}
                onChange={(e) => { setAge(e.target.value); markTouched("age"); }}
              >
                <option value="" disabled>選択してください</option>
                {AGES.map((a) => (
                  <option key={a} value={a}>{a}歳</option>
                ))}
              </select>
            </div>
            <p className="field-note" id="age-note">現在は20代限定でサービスを提供しております。</p>
            <p className="error" id="error-age" aria-live="polite">{visibleError("age")}</p>
          </div>

          {/* 希望勤務地 */}
          <div
            className="field-card"
            id="field-location"
            ref={(el) => { cardRefs.current.location = el; }}
            onBlur={handleCardBlur("location")}
          >
            <p className="field-label">
              希望勤務地(複数選択可)<span className="required">必須</span>
            </p>
            <details
              className={`location-picker${locations.length ? " has-selection" : ""}`}
              ref={pickerRef}
            >
              <summary aria-label="希望勤務地を選択" aria-invalid={visibleError("location") ? true : undefined}>
                <span id="locationSummary">{locationSummary}</span>
                <span className="chevron" aria-hidden="true" />
              </summary>
              <div className="location-options">
                {WORK_LOCATIONS.map((loc) => (
                  <label key={loc}>
                    <input
                      type="checkbox"
                      name="preferred_work_location"
                      value={loc}
                      checked={locations.includes(loc)}
                      onChange={handleLocationChange}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </details>
            <p className="field-note">
              ご希望に沿った最適な求人のご紹介と、<br />
              質の高いサポートをお届けするため、<br />
              現在のサービス提供エリアを<br />
              一部地域に限定させていただいております。
            </p>
            <p className="error" id="error-location" aria-live="polite">{visibleError("location")}</p>
          </div>

          {/* 電話番号 */}
          <div
            className="field-card"
            id="field-phone"
            ref={(el) => { cardRefs.current.phone = el; }}
            onBlur={handleCardBlur("phone")}
          >
            <label className="field-label" htmlFor="ogata-phone">
              電話番号<span className="required">必須</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              id="ogata-phone"
              placeholder="08012345678"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={11}
              required
              aria-invalid={visibleError("phone") ? true : undefined}
              aria-describedby="error-phone"
              value={phoneInput}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
            />
            {isPhoneValidating && (
              <p className="validating-note">電話番号を確認しています…</p>
            )}
            <p className="error" id="error-phone" aria-live="polite">{visibleError("phone")}</p>
          </div>

          <p className="agreement">
            下記ボタンを押すことで、<br />
            ・
            <a
              href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94"
              target="_blank"
              rel="noopener noreferrer"
            >
              利用規約
            </a>
            および
            <a
              href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec"
              target="_blank"
              rel="noopener noreferrer"
            >
              プライバシーポリシー
            </a>
            <br />
            ・現在、業務遂行に支障となる健康問題がなく、<span>通院中ではない</span>
            <br />
            ・<span>現在学生の方、および時短勤務希望ではない。</span>
            <br />
            上記に同意したものとみなします
          </p>

          <div className="final-actions">
            {/* 「LINEで診断結果を受け取る」= LINE遷移ボタン。X の LINEボタンクリック計測はここで発火（入力チェック前・1人1回は呼び出し側で担保） */}
            <button
              className="final-button"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isPhoneValidating || undefined}
              onClick={() => onLineButtonClick?.()}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>{isSubmitting ? "読み込み中..." : "LINEで診断結果を受け取る"}</span>
              {!isSubmitting && <b aria-hidden="true">›</b>}
            </button>
          </div>
        </main>
      </form>
    </div>
  );
}
