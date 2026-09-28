import { type ReactNode } from "react";
import { cn } from "@/utils";
import { ChevronRight } from "lucide-react";

import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/deaeru/form01a/_types";

type ButtonProps = {
  label: string;
  type: "button" | "submit";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

type Props = {
  formData: FormData;
  isAllFieldsFilled: (formData: FormData) => boolean;
  isPhoneDisabled: boolean;
  isSubmitting?: boolean;
  nameError?: string;
};

const Button = ({
  label,
  type,
  className,
  disabled,
  onClick,
}: ButtonProps): ReactNode => {
  return (
    <button
      className={cn(
        "flex h-12 items-center justify-center gap-x-2 rounded-lg text-base font-bold transition-all duration-200",
        (label === "LINEで診断結果を受け取る" || label === "読み込み中...") &&
          "w-full bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none",
        className
      )}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      <span className="font-bold">{label}</span>
      {label === "LINEで診断結果を受け取る" ? (
        <ChevronRight className="w-5" />
      ) : (
        ""
      )}
    </button>
  );
};

export function Footer({
  formData,
  isAllFieldsFilled,
  isPhoneDisabled,
  isSubmitting = false,
  nameError = "",
}: Props) {
  return (
    <footer className="fixed bottom-0 w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-20 items-center justify-between gap-x-4">
            <Button
              label={isSubmitting ? "読み込み中..." : "LINEで診断結果を受け取る"}
              type="submit"
              disabled={
                isSubmitting ||
                !isAllFieldsFilled(formData) ||
                isPhoneDisabled ||
                  nameError !== ""
              }
            />
          </div>
        </Container>
      </MaxWidth>
    </footer>
  );
}
