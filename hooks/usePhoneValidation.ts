import { useRef, useState, type SyntheticEvent } from "react";

import { IS_DEVELOP_E2E_MODE } from "@/lib/config/develop-e2e";

export function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, "");
}

const PHONE_NUMBER_REGEX = /^(070|080|090)\d{8}$/;
const PHONE_ERROR_MESSAGE =
  "入力された電話番号を確認できませんでした。お手元の番号をもう一度ご確認ください。";
const INVALID_PHONE_NUMBERS = ["07012345678", "08012345678", "09012345678"];
const MAX_PHONE_VALIDATION_FAILURES = 3;

interface PhoneLookupResponse {
  valid: boolean;
  reason: "valid" | "invalid" | "error";
}

// ─────────────────────────────────────────────
// Twilio 検証付き（Pattern B: LP系 Page.tsx）
// ─────────────────────────────────────────────

interface UseTwilioPhoneValidationOptions {
  onPhoneChange: (normalizedPhone: string) => void;
}

interface UseTwilioPhoneValidationResult {
  phoneError: string;
  isPhoneValidating: boolean;
  handlePhoneBlur: (event: SyntheticEvent<HTMLInputElement>) => Promise<void>;
  setPhoneError: (error: string) => void;
}

export function useTwilioPhoneValidation({
  onPhoneChange,
}: UseTwilioPhoneValidationOptions): UseTwilioPhoneValidationResult {
  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneValidating, setIsPhoneValidating] = useState<boolean>(false);
  const phoneValidationFailuresRef = useRef<number>(0);

  function normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, "");
  }

  async function validatePhoneNumberWithTwilio(
    phoneNumber: string
  ): Promise<PhoneLookupResponse> {
    try {
      const response = await fetch("/api/twilio/phone-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error(`電話番号確認APIエラー: ${response.status}`);
      }

      return (await response.json()) as PhoneLookupResponse;
    } catch (error) {
      console.error("[Twilio検証] 電話番号確認エラー:", error);
      return { valid: false, reason: "error" };
    }
  }

  function handlePhoneValidationFailure(message: string): void {
    phoneValidationFailuresRef.current += 1;

    if (phoneValidationFailuresRef.current >= MAX_PHONE_VALIDATION_FAILURES) {
      alert("不正検知されました。");
      window.location.assign("/deaeru/invalid-phone");
      return;
    }

    setPhoneError(message);
  }

  async function handlePhoneBlur(
    event: SyntheticEvent<HTMLInputElement>
  ): Promise<void> {
    const value = (event.target as HTMLInputElement).value;
    const normalizedPhone = normalizePhoneNumber(value);

    onPhoneChange(normalizedPhone);
    setPhoneError("");

    if (normalizedPhone === "") return;

    if (!PHONE_NUMBER_REGEX.test(normalizedPhone)) {
      handlePhoneValidationFailure(PHONE_ERROR_MESSAGE);
      return;
    }

    if (INVALID_PHONE_NUMBERS.includes(normalizedPhone)) {
      handlePhoneValidationFailure(PHONE_ERROR_MESSAGE);
      return;
    }

    // 同じ数字が6桁以上連続する番号を弾く（実在しない番号の入力を防ぐ）
    if (/(\d)\1{5,}/.test(normalizedPhone)) {
      handlePhoneValidationFailure(PHONE_ERROR_MESSAGE);
      return;
    }

    // develop E2E では形式検証だけ残し、外部 Twilio Lookup は呼ばない。
    if (IS_DEVELOP_E2E_MODE) return;

    setIsPhoneValidating(true);
    try {
      const result = await validatePhoneNumberWithTwilio(normalizedPhone);
      if (!result.valid) {
        handlePhoneValidationFailure(PHONE_ERROR_MESSAGE);
      }
    } finally {
      setIsPhoneValidating(false);
    }
  }

  return { phoneError, isPhoneValidating, handlePhoneBlur, setPhoneError };
}

// ─────────────────────────────────────────────
// 単純検証（Pattern A: form01a, form01b, lp99c, lp99g）
// ─────────────────────────────────────────────

interface UseSimplePhoneValidationOptions {
  onPhoneChange: (phone: string) => void;
}

interface UseSimplePhoneValidationResult {
  phoneError: string;
  isPhoneValidating: boolean;
  isPhoneDisabled: boolean;
  onPhoneBlur: (event: SyntheticEvent<HTMLInputElement>) => void;
  setPhoneError: (error: string) => void;
  setIsPhoneDisabled: (disabled: boolean) => void;
}

export function useSimplePhoneValidation({
  onPhoneChange,
}: UseSimplePhoneValidationOptions): UseSimplePhoneValidationResult {
  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneDisabled, setIsPhoneDisabled] = useState<boolean>(false);

  function onPhoneBlur(event: SyntheticEvent<HTMLInputElement>): void {
    const value = event.currentTarget.value;

    if (value && !PHONE_NUMBER_REGEX.test(value)) {
      setPhoneError("正しい携帯電話番号を入力してください");
      setIsPhoneDisabled(true);
    } else {
      setPhoneError("");
      setIsPhoneDisabled(false);
      onPhoneChange(value);
    }
  }

  return {
    phoneError,
    isPhoneValidating: false,
    isPhoneDisabled,
    onPhoneBlur,
    setPhoneError,
    setIsPhoneDisabled,
  };
}
