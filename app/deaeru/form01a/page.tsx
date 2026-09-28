"use client";

import { type ChangeEvent, type SyntheticEvent, useRef, useState } from "react";

import { Header, Footer } from "@/app/deaeru/form01a/_components/layout";
import { Condition, Info } from "@/app/deaeru/form01a/_components/section";
import { type FormData } from "@/app/deaeru/form01a/_types/form-data";
import { useSimplePhoneValidation } from "@/hooks/usePhoneValidation";
import { useLpActionStatistics } from "@/app/deaeru/_shared/useLpActionStatistics";

const initialFormData: FormData = {
  birth_year: "",
  full_name: "",
  gender: "",
  phone_number: "",
  preferred_annual_income: "",
  preferred_job_category: "",
  preferred_work_location: [],
  preferred_work_style: "",
};

function getAnsweredQuestions(formData: FormData): number {
  return Object.values(formData).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ""
  ).length;
}

function isAllFieldsFilled(formData: FormData): boolean {
  return getAnsweredQuestions(formData) === Object.keys(formData).length;
}

export default function Form01aPage() {
  // LP行動集計シートへの行動計測（2026-07-24 実装漏れ監査で追加）
  const { markCtaClicked } = useLpActionStatistics("deaeru-form01a");
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

  const preferredWorkStyleRef = useRef<HTMLDivElement | null>(null);
  const preferredAnnualIncomeRef = useRef<HTMLDivElement | null>(null);
  const preferredJobCategoryRef = useRef<HTMLDivElement | null>(null);
  const fullNameRef = useRef<HTMLDivElement | null>(null);
  const genderRef = useRef<HTMLDivElement | null>(null);
  const birthYearRef = useRef<HTMLDivElement | null>(null);
  const preferredWorkLocationRef = useRef<HTMLDivElement | null>(null);
  const phoneNumberRef = useRef<HTMLDivElement | null>(null);

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
          <Condition
            preferredAnnualIncomeRef={preferredAnnualIncomeRef}
            preferredJobCategoryRef={preferredJobCategoryRef}
            preferredWorkStyleRef={preferredWorkStyleRef}
            updateFormData={updateFormData as (event: ChangeEvent<HTMLInputElement>) => void}
          />
        )}
        {step === 2 && (
          <Info
            birthYearRef={birthYearRef}
            firstName={firstName}
            formData={formData}
            fullNameRef={fullNameRef}
            genderRef={genderRef}
            isPhoneValidating={isPhoneValidating}
            lastName={lastName}
            onPhoneBlur={onPhoneBlur}
            phoneError={phoneError}
            phoneNumberRef={phoneNumberRef}
            preferredWorkLocationRef={preferredWorkLocationRef}
            updateFormData={updateFormData}
          />
        )}
        <Footer
          formData={formData}
          getAnsweredQuestions={getAnsweredQuestions}
          isAllFieldsFilled={isAllFieldsFilled}
          isPhoneDisabled={isPhoneDisabled}
          step={step}
          updateIsCta2Submitted={markCtaClicked}
          updateStep={setStep}
        />
      </form>
    </div>
  );
}
