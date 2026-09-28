import { forwardRef, type FocusEvent } from "react";

import { cn } from "@/utils";
import { Inner } from "@/components/common";
import { Label } from "@/app/deaeru/form01b/_components/form";

type Props = {
  label: string;
  name: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  type: "number" | "tel" | "text";
  errorMessage?: string;
  inputMode?: "numeric";
  isValidating?: boolean;
  max?: number;
  maxLength?: number;
  min?: number;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLDivElement, Props>(function Input(
  {
    errorMessage,
    inputMode,
    isValidating = false,
    label,
    name,
    onBlur,
    type,
    max,
    maxLength,
    min,
    pattern,
    placeholder,
    required = false,
  },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Inner className="bg-white">
        <Label className="mb-2" label={label} required={required} />
        <div className="relative">
          <input
            className={cn(
              "block w-full rounded-lg border-2 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors",
              errorMessage
                ? "border-red-400 focus:border-red-500 bg-red-50/50"
                : "border-gray-200 focus:border-green-500"
            )}
            name={name}
            onBlur={onBlur}
            type={type}
            inputMode={inputMode}
            maxLength={maxLength}
            max={max}
            min={min}
            pattern={pattern}
            placeholder={placeholder}
            required={required}
          />
          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-red-50 p-3 border border-red-200">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M12 3a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
            <p className="text-sm leading-snug text-red-700">{errorMessage}</p>
          </div>
        )}
      </Inner>
    </div>
  );
});
