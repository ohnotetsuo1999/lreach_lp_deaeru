import { forwardRef, type FocusEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01d/[id]/_components/form";

type Props = {
  label: string;
  name: string;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  type: "number" | "tel" | "text";
  inputMode?: "numeric";
  max?: number;
  maxLength?: number;
  min?: number;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLDivElement, Props>(function Input(
  {
    inputMode,
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
      <Inner className="bg-[rgb(255,138,46)]">
        <Label className="mb-2" label={label} required={required} />
        <input
          className="block w-full rounded-md border border-[rgb(170,173,179)] bg-white p-2 text-base font-medium text-[rgb(22,22,22)] placeholder:text-[rgb(170,173,179)]"
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
      </Inner>
    </div>
  );
});
