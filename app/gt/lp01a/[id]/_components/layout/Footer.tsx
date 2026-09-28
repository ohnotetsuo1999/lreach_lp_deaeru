import { type ReactNode } from "react";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/gt/lp01a/[id]/_types";

type ButtonProps = {
  label: string;
  type: "button" | "submit";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
  isAllFieldsFilled: (formData: FormData) => boolean;
  step: number;
  updateIsCta2Submitted: (isCta2Submitted: boolean) => void;
  updateStep: (newStep: number) => void;
  isSubmitting?: boolean;
};

const Button = ({
  label,
  type,
  className,
  disabled = false,
  onClick,
}: ButtonProps): ReactNode => {
  return (
    <button
      className={cn(
        "flex h-10 items-center justify-center gap-x-1 rounded-md text-base font-medium",
        label === "前へ" &&
          "w-20 shrink-0 bg-[rgb(243,243,246)] text-gray-900 disabled:opacity-50",
        (label === "次へ" ||
          label === "LINEで診断結果を受け取る" ||
          label === "読み込み中...") &&
          "w-full bg-[rgb(219,60,0)] text-white disabled:bg-[rgb(249,199,154)]",
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {label === "前へ" ? <ChevronLeft className="w-4" /> : ""}
      <span className="font-medium">{label}</span>
      {label === "次へ" || label === "LINEで診断結果を受け取る" ? (
        <ChevronRight className="w-4" />
      ) : (
        ""
      )}
    </button>
  );
};

export function Footer({
  formData,
  getAnsweredQuestions,
  isAllFieldsFilled,
  step,
  updateIsCta2Submitted,
  updateStep,
  isSubmitting = false,
}: Props) {
  return (
    <footer className="fixed bottom-0 w-full border-t bg-white">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 items-center justify-between gap-x-4">
            <Button
              label="前へ"
              type="button"
              disabled={step === 1}
              onClick={() => updateStep(step - 1)}
            />
            {step === 1 && (
              <Button
                label="次へ"
                type="button"
                className={
                  (!(
                    formData.preferred_annual_income === "" ||
                    formData.preferred_job_category.length === 0 ||
                    formData.preferred_work_style.length === 0
                  ) &&
                    "animate-button-bounce") ||
                  ""
                }
                disabled={
                  formData.preferred_annual_income === "" ||
                  formData.preferred_job_category.length === 0 ||
                  formData.preferred_work_style.length === 0
                }
                onClick={() => {
                  updateStep(2);
                  updateIsCta2Submitted(true);
                }}
              />
            )}
            {step === 2 && (
              <Button
                label={
                  isSubmitting ? "読み込み中..." : "LINEで診断結果を受け取る"
                }
                type="submit"
                className={
                  !isSubmitting && isAllFieldsFilled(formData)
                    ? "animate-button-bounce"
                    : ""
                }
                disabled={isSubmitting || !isAllFieldsFilled(formData)}
              />
            )}
          </div>
        </Container>
      </MaxWidth>
    </footer>
  );
}
