import { type ReactNode } from "react";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/deaeru/form01b/_types";

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
  isPhoneDisabled: boolean;
  isStep1Complete: boolean;
  step: number;
  totalSteps: number;
  updateIsCta2Submitted: (isCta2Submitted: boolean) => void;
  updateStep: (newStep: number) => void;
  isSubmitting?: boolean;
};

const Button = ({ label, type, className, disabled, onClick }: ButtonProps): ReactNode => {
  return (
    <button
      className={cn(
        "flex h-12 items-center justify-center gap-x-2 rounded-lg text-base font-bold transition-all duration-200",
        label === "前へ" &&
          "w-24 shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100",
        (label === "次へ" || label === "LINEで面談を予約する" || label === "読み込み中...") &&
          "w-full bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none",
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      {label === "前へ" ? <ChevronLeft className="w-5" /> : ""}
      <span className="font-bold">{label}</span>
      {label === "次へ" || label === "LINEで面談を予約する" ? <ChevronRight className="w-5" /> : ""}
    </button>
  );
};

export function Footer({
  formData,
  getAnsweredQuestions,
  isAllFieldsFilled,
  isPhoneDisabled,
  isStep1Complete,
  step,
  totalSteps,
  updateIsCta2Submitted,
  updateStep,
  isSubmitting = false,
}: Props) {

  return (
    <footer className="fixed bottom-0 w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-20 items-center justify-between gap-x-4">
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
                disabled={!isStep1Complete || isPhoneDisabled}
                onClick={() => {
                  updateStep(2);
                  updateIsCta2Submitted(true);
                }}
              />
            )}
            {step === 2 && (
              <Button
                label="LINEで面談を予約する"
                type="submit"
                disabled={
                  isSubmitting ||
                  !isAllFieldsFilled(formData) ||
                  isPhoneDisabled
                }
              />
            )}
          </div>
        </Container>
      </MaxWidth>
    </footer>
  );
}
