"use client";

import { useState, type SyntheticEvent } from "react";

function buildFullNameForValidation(lastName: string, firstName: string): string {
  const trimmedLast = lastName.trim();
  const trimmedFirst = firstName.trim();
  if (!trimmedLast || !trimmedFirst) return "";
  return `${trimmedLast} ${trimmedFirst}`;
}

export function validateNameFields(
  lastName: string,
  firstName: string,
  // 送信時バリデーション用フラグ。true のとき、姓または名が空なら必須エラーを返す。
  // blur 時（入力途中）は false のままにして、片方未入力でエラーを出さない。
  requireFilled = false
): string {
  const trimmedLast = lastName.trim();
  const trimmedFirst = firstName.trim();
  if (!trimmedLast || !trimmedFirst) {
    // 送信時は空を弾く。blur 時（入力途中）は従来どおりエラーを出さない。
    return requireFilled ? "お名前（姓・名）を入力してください。" : "";
  }

  const full = buildFullNameForValidation(trimmedLast, trimmedFirst);

  if (/[0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_{|}~]/.test(full)) {
    return "氏名に数字・記号は使用できません。";
  }
  if (/[a-zA-Z]/.test(full)) {
    return "氏名にローマ字は使用できません。";
  }
  if (full.length < 3) {
    return "氏名は3文字以上入力してください。";
  }
  if (full.length > 20) {
    return "氏名は20文字以内で入力してください。";
  }
  // ヶ(U+30F6) は「茅ヶ崎」等の名字で使われるため全角カタカナ禁止の対象外にする（範囲をヵまでに狭める）
  if (/[ァ-ヵー]/.test(full)) {
    return "氏名に全角カタカナは使用できません。";
  }
  if (/[ｦ-ﾟ]/.test(full)) {
    return "氏名に半角カタカナは使用できません。全角で入力してください。";
  }
  if (/[@#!？・()（）]/.test(full)) {
    return "氏名に特殊記号は使用できません。";
  }
  if (
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(
      full
    )
  ) {
    return "氏名に絵文字は使用できません。";
  }
  // 々(U+3005 踊り字「佐々木」等)・ヶ(U+30F6「茅ヶ崎」等)は漢字レンジ外のため明示的に許可する
  if (!/^[一-龯ぁ-ん々ヶ\s]+$/.test(full)) {
    return "氏名は漢字、ひらがなのみで入力してください。";
  }
  if (
    full.replace(/\s/g, "") === "山田太郎" ||
    full.replace(/\s/g, "") === "山田花子"
  ) {
    return "正しいお名前を入力してください。";
  }
  const isLastHiragana = /^[ぁ-ん]+$/.test(trimmedLast);
  const isFirstHiragana = /^[ぁ-ん]+$/.test(trimmedFirst);
  if (isLastHiragana && trimmedLast.length < 2) {
    return "苗字（ひらがな）は2文字以上入力してください。";
  }
  if (isLastHiragana && /(.)\1/.test(trimmedLast)) {
    return "苗字に同じ文字の繰り返しは使用できません。";
  }
  if (/(.)\1\1/.test(trimmedLast)) {
    return "苗字に同じ文字が3文字以上連続しています。正しいお名前を入力してください。";
  }
  if (/(.)\1\1/.test(trimmedFirst)) {
    return "名前に同じ文字が3文字以上連続しています。正しいお名前を入力してください。";
  }
  if (isLastHiragana && isFirstHiragana) {
    return "氏名は漢字を含めて入力してください。（姓・名の両方をひらがなにすることはできません）";
  }
  return "";
}

export function useNameValidation(nameData: {
  last_name: string;
  first_name: string;
}): {
  nameError: string;
  setNameError: (error: string) => void;
  handleNameBlur: (event: SyntheticEvent<HTMLInputElement>) => void;
} {
  const [nameError, setNameError] = useState<string>("");

  function handleNameBlur(event: SyntheticEvent<HTMLInputElement>): void {
    const { name, value } = event.currentTarget;
    const currentNameData = { ...nameData, [name]: value };
    const error = validateNameFields(
      currentNameData.last_name,
      currentNameData.first_name
    );
    setNameError(error);
  }

  return { nameError, setNameError, handleNameBlur };
}
