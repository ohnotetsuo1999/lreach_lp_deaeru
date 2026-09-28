import { type RefObject, type SyntheticEvent } from "react";

import { Container, Inner, MaxWidth } from "@/components/common";
import {
  Gender,
  Input,
  Label,
  Select,
} from "@/app/deaeru/form01a/_components/form";
import { StepTitle } from "@/app/deaeru/form01a/_components/ui";
import { FormData } from "@/app/deaeru/form01a/_types/form-data";

const ageNote = (
  <>
    現在は20代限定でサービスを提供しております。
  </>
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
  birthYearRef: RefObject<HTMLDivElement | null>;
  firstName?: string;
  formData: FormData;
  fullNameRef: RefObject<HTMLDivElement | null>;
  genderRef: RefObject<HTMLDivElement | null>;
  isPhoneValidating: boolean;
  lastName?: string;
  nameError?: string;
  onNameBlur?: (event: SyntheticEvent<HTMLInputElement>) => void;
  onPhoneBlur: (event: SyntheticEvent<HTMLInputElement>) => void;
  phoneError: string;
  phoneNumberRef: RefObject<HTMLDivElement | null>;
  preferredWorkLocationRef: RefObject<HTMLDivElement | null>;
  updateFormData: (
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function Info({
  birthYearRef,
  firstName = "",
  formData,
  fullNameRef,
  genderRef,
  isPhoneValidating,
  lastName = "",
  nameError,
  onNameBlur,
  onPhoneBlur,
  phoneError,
  phoneNumberRef,
  preferredWorkLocationRef,
  updateFormData,
}: Props) {
  const selectedAge =
    formData.birth_year !== ""
      ? String(new Date().getFullYear() - Number(formData.birth_year))
      : "";

  return (
    <section className="relative grow bg-gray-50">
      <div className="absolute inset-y-0 w-full overflow-y-scroll overscroll-y-contain">
        <MaxWidth>
          <Container width="90">
            <div className="mb-4 flex flex-col gap-y-5 pb-6">
              <StepTitle step={2} title="基本情報" />
              <div className="relative" data-field ref={fullNameRef}>
                <Inner className="bg-white">
                  <Label className="mb-2" label="お名前" required={true} />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                      name="last_name"
                      onBlur={onNameBlur}
                      onChange={updateFormData}
                      placeholder="姓（山田）"
                      required={true}
                      type="text"
                      value={lastName}
                    />
                    <input
                      className={`block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${nameError ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-green-500"}`}
                      name="first_name"
                      onBlur={onNameBlur}
                      onChange={updateFormData}
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
                helperText={ageNote}
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
                helperText={serviceAreaNote}
              />
              <Input
                errorMessage={phoneError}
                isValidating={isPhoneValidating}
                label="電話番号"
                maxLength={11}
                name="phone_number"
                onBlur={onPhoneBlur}
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
      </div>
    </section>
  );
}
