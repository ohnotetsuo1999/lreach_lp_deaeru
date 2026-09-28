import {
  type ChangeEvent,
  type FocusEvent,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from "react";

import { Container, Inner, MaxWidth } from "@/components/common";
import {
  Gender,
  Input,
  Label,
  Select,
} from "@/app/deaeru/form01b/_components/form";
import { StepTitle } from "@/app/deaeru/form01b/_components/ui";
import { FormData } from "@/app/deaeru/form01b/_types/form-data";
import { validateNameFields } from "@/hooks/useNameValidation";

const MOBILE_PHONE_REGEX = /^(070|080|090)\d{8}$/;

const ageNote = (
  <>現在は20代限定でサービスを提供しております。</>
);

const serviceAreaNote = (
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

interface Props {
  stepTitleStep?: number;
  birthYearRef: RefObject<HTMLDivElement | null>;
  firstName: string;
  firstNameKana: string;
  formData: FormData;
  fullNameRef: RefObject<HTMLDivElement | null>;
  fullNameKanaRef: RefObject<HTMLDivElement | null>;
  genderRef: RefObject<HTMLDivElement | null>;
  isPhoneValidating: boolean;
  lastName: string;
  lastNameKana: string;
  onPhoneBlur: (event: SyntheticEvent<HTMLInputElement>) => void;
  phoneError: string;
  phoneNumberRef: RefObject<HTMLDivElement | null>;
  preferredWorkLocationRef: RefObject<HTMLDivElement | null>;
  updateFormData: (
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function BasicInfo({
  stepTitleStep = 1,
  birthYearRef,
  firstName,
  firstNameKana,
  formData,
  fullNameRef,
  fullNameKanaRef,
  genderRef,
  isPhoneValidating,
  lastName,
  lastNameKana,
  onPhoneBlur,
  phoneError,
  phoneNumberRef,
  preferredWorkLocationRef,
  updateFormData,
}: Props) {
  const basicInfoEndRef = useRef<HTMLDivElement | null>(null);
  const [localLastName, setLocalLastName] = useState(lastName);
  const [localFirstName, setLocalFirstName] = useState(firstName);
  const [localLastNameKana, setLocalLastNameKana] = useState(lastNameKana);
  const [localFirstNameKana, setLocalFirstNameKana] = useState(firstNameKana);
  // 漢字氏名のリアルタイムバリデーションエラー（blur 時に表示）。
  // requireFilled は渡さない＝片方だけ入力した時点ではエラーを出さない（入力途中UXを維持）。
  const [nameError, setNameError] = useState("");

  const selectedAge =
    formData.birth_year !== ""
      ? String(new Date().getFullYear() - Number(formData.birth_year))
      : "";

  const scrollToNext = useCallback((ref: RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, []);

  const handleKanjiNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateFormData(event);
      const { name, value } = event.target;
      if (name === "last_name") setLocalLastName(value);
      if (name === "first_name") setLocalFirstName(value);
    },
    [updateFormData]
  );

  const handleLastNameBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const currentLast = event.currentTarget.value;
      // 漢字氏名のリアルタイム検証（空・ローマ字・カタカナ・文字数・ダミー名等）。
      setNameError(validateNameFields(currentLast, localFirstName));
      if (currentLast.trim() !== "" && localFirstName.trim() !== "") {
        scrollToNext(fullNameKanaRef);
      }
    },
    [localFirstName, fullNameKanaRef, scrollToNext]
  );

  const handleFirstNameBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const currentFirst = event.currentTarget.value;
      // 漢字氏名のリアルタイム検証（空・ローマ字・カタカナ・文字数・ダミー名等）。
      setNameError(validateNameFields(localLastName, currentFirst));
      if (localLastName.trim() !== "" && currentFirst.trim() !== "") {
        scrollToNext(fullNameKanaRef);
      }
    },
    [localLastName, fullNameKanaRef, scrollToNext]
  );

  const handleKanaNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateFormData(event);
      const { name, value } = event.target;
      if (name === "last_name_kana") setLocalLastNameKana(value);
      if (name === "first_name_kana") setLocalFirstNameKana(value);
    },
    [updateFormData]
  );

  const handleLastNameKanaBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const currentLast = event.currentTarget.value;
      if (currentLast.trim() !== "" && localFirstNameKana.trim() !== "") {
        scrollToNext(genderRef);
      }
    },
    [localFirstNameKana, genderRef, scrollToNext]
  );

  const handleFirstNameKanaBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      const currentFirst = event.currentTarget.value;
      if (localLastNameKana.trim() !== "" && currentFirst.trim() !== "") {
        scrollToNext(genderRef);
      }
    },
    [localLastNameKana, genderRef, scrollToNext]
  );

  const handleGenderChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateFormData(event);
      scrollToNext(birthYearRef);
    },
    [updateFormData, birthYearRef, scrollToNext]
  );

  const handleBirthYearBlur = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      updateFormData(event);
      const v = event.currentTarget.value;
      if (v !== "") {
        scrollToNext(preferredWorkLocationRef);
      }
    },
    [updateFormData, preferredWorkLocationRef, scrollToNext]
  );

  const handlePreferredWorkLocationBlur = useCallback(
    (event: FocusEvent<HTMLSelectElement>) => {
      updateFormData(event);
      const selected = Array.from(event.currentTarget.selectedOptions).map(
        (o) => o.value
      );
      if (selected.length > 0) {
        scrollToNext(phoneNumberRef);
      }
    },
    [updateFormData, phoneNumberRef, scrollToNext]
  );

  const handlePhoneBlurWithScroll = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      onPhoneBlur(event);
      const digits = event.currentTarget.value.replace(/\D/g, "");
      if (MOBILE_PHONE_REGEX.test(digits)) {
        setTimeout(() => {
          basicInfoEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        }, 150);
      }
    },
    [onPhoneBlur]
  );

  return (
    <section className="relative grow bg-gray-50">
      <div className="absolute inset-y-0 w-full overflow-y-scroll overscroll-y-contain">
        <MaxWidth>
          <Container width="90">
            <div className="mb-4 flex flex-col gap-y-5 pb-6">
              <StepTitle step={stepTitleStep} title="基本情報" />
              <div className="relative" data-field ref={fullNameRef}>
                <Inner className="bg-white">
                  <Label className="mb-2" label="氏名（漢字）" required={true} />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                      name="last_name"
                      onChange={handleKanjiNameChange}
                      onBlur={handleLastNameBlur}
                      placeholder="姓（山田）"
                      required={true}
                      type="text"
                      value={lastName}
                    />
                    <input
                      className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                      name="first_name"
                      onChange={handleKanjiNameChange}
                      onBlur={handleFirstNameBlur}
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
                      onChange={handleKanaNameChange}
                      onBlur={handleLastNameKanaBlur}
                      placeholder="セイ（ヤマダ）"
                      required={true}
                      type="text"
                      value={lastNameKana}
                    />
                    <input
                      className="block w-full rounded-lg border-2 border-gray-200 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                      name="first_name_kana"
                      onChange={handleKanaNameChange}
                      onBlur={handleFirstNameKanaBlur}
                      placeholder="メイ（タロウ）"
                      required={true}
                      type="text"
                      value={firstNameKana}
                    />
                  </div>
                </Inner>
              </div>
              <Gender
                onChange={handleGenderChange}
                ref={genderRef}
                value={formData.gender}
              />
              <Select
                label="年齢"
                name="birth_year"
                onBlur={handleBirthYearBlur}
                optionData={["20", "21", "22", "23", "24", "25", "26", "27", "28", "29"]}
                customDropdown={true}
                ref={birthYearRef}
                required={true}
                value={selectedAge}
                helperText={ageNote}
              />
              <Select
                label="希望勤務地(複数選択可)"
                name="preferred_work_location"
                onBlur={handlePreferredWorkLocationBlur}
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
                helperText={serviceAreaNote}
              />
              <Input
                errorMessage={phoneError}
                isValidating={isPhoneValidating}
                label="電話番号"
                maxLength={11}
                name="phone_number"
                onBlur={handlePhoneBlurWithScroll}
                ref={phoneNumberRef}
                type="tel"
                pattern="(070|080|090)\d{8}$"
                placeholder="08012345678"
                required={true}
              />
              <div
                ref={basicInfoEndRef}
                className="h-px w-full shrink-0"
                aria-hidden
              />
            </div>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
