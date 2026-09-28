"use client";

import { type ChangeEvent, type SyntheticEvent, useRef, useState } from "react";

import { Header, Footer } from "@/app/deaeru/form01b/_components/layout";
import { BasicInfo, JobChangeInfo } from "@/app/deaeru/form01b/_components/section";
import { type FormData } from "@/app/deaeru/form01b/_types/form-data";
import { useSimplePhoneValidation } from "@/hooks/usePhoneValidation";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

const TOTAL_STEPS = 2;

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
  return Object.values(formData).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ""
  ).length;
}

function isAllFieldsFilled(formData: FormData): boolean {
  return getAnsweredQuestions(formData) === Object.keys(formData).length;
}

export default function Form01bPage() {
  // LP行動集計シートへの行動計測（2026-07-24 実装漏れ監査で追加）
  const { markCtaClicked } = useLpActionStatistics("deaeru-form01b");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { phoneError, isPhoneValidating, isPhoneDisabled, onPhoneBlur } =
    useSimplePhoneValidation({
      onPhoneChange: (phone) =>
        setFormData((prev) => ({ ...prev, phone_number: phone })),
    });

  // 姓・名を個別に管理して入力順序に依存しないようにする
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");

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

  const isStep1Complete =
    lastName !== "" &&
    firstName !== "" &&
    lastNameKana !== "" &&
    firstNameKana !== "" &&
    formData.gender !== "" &&
    formData.birth_year !== "" &&
    formData.preferred_work_location.length > 0 &&
    formData.phone_number !== "" &&
    !isPhoneDisabled;

  const updateFormData = (
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement> | ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.currentTarget ?? (event as ChangeEvent<HTMLInputElement>).target;
    const { name, value } = target;

    if (name === "last_name") {
      setLastName(value);
      setFormData((prev) => ({ ...prev, full_name: `${value} ${firstName}`.trim() }));
      return;
    }
    if (name === "first_name") {
      setFirstName(value);
      setFormData((prev) => ({ ...prev, full_name: `${lastName} ${value}`.trim() }));
      return;
    }
    if (name === "last_name_kana") {
      setLastNameKana(value);
      setFormData((prev) => ({ ...prev, full_name_kana: `${value} ${firstNameKana}`.trim() }));
      return;
    }
    if (name === "first_name_kana") {
      setFirstNameKana(value);
      setFormData((prev) => ({ ...prev, full_name_kana: `${lastNameKana} ${value}`.trim() }));
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

  return (
    <div className="flex h-dvh flex-col pt-[72px] pb-20">
      <Header formData={formData} getAnsweredQuestions={getAnsweredQuestions} />
      <form className="flex grow flex-col overflow-hidden">
        {step === 1 && (
          <BasicInfo
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
            onPhoneBlur={onPhoneBlur}
            phoneError={phoneError}
            phoneNumberRef={phoneNumberRef}
            preferredWorkLocationRef={preferredWorkLocationRef}
            updateFormData={updateFormData}
          />
        )}
        {step === 2 && (
          <JobChangeInfo
            preferredWorkStyleRef={preferredWorkStyleRef}
            preferredAnnualIncomeRef={preferredAnnualIncomeRef}
            preferredJobCategoryRef={preferredJobCategoryRef}
            jobChangeTimingRef={jobChangeTimingRef}
            jobChangeCountRef={jobChangeCountRef}
            jobChangeReasonRef={jobChangeReasonRef}
            updateFormData={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
          />
        )}
        <Footer
          formData={formData}
          getAnsweredQuestions={getAnsweredQuestions}
          isAllFieldsFilled={isAllFieldsFilled}
          isPhoneDisabled={isPhoneDisabled}
          isStep1Complete={isStep1Complete}
          step={step}
          totalSteps={TOTAL_STEPS}
          updateIsCta2Submitted={markCtaClicked}
          updateStep={setStep}
        />
      </form>
    </div>
  );
}
