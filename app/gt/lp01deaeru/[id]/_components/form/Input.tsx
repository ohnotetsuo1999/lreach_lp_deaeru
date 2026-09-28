import { forwardRef, type FocusEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01deaeru/[id]/_components/form";

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
      <Inner className="bg-white">
        <Label className="mb-2" label={label} required={required} />
        <input
          className="block w-full rounded-lg border-2 border-gray-200 bg-white p-3.5 text-base font-medium text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none transition-colors"
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
