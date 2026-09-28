import { forwardRef, type SyntheticEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01c/[id]/_components/form";

type Props = {
  label: string;
  name: string;
  /**
   * NOTE:
   * 既存実装は onBlur でしか親stateを更新していなかったため、
   * iOS Safariの自動入力(Autofill)で「DOMには値が入るが state が更新されない」ケースが発生しやすい。
   * 互換性のため prop 名は onBlur のまま維持しつつ、
   * onChange/onInput でも同じハンドラを呼ぶ。
   */
  onBlur: (event: SyntheticEvent<HTMLInputElement>) => void;
  type: "number" | "tel" | "text";
  inputMode?: "numeric";
  max?: number;
  maxLength?: number;
  min?: number;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  autoComplete?: string;
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
    value,
    autoComplete,
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
          onChange={onBlur}
          onInput={onBlur}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          max={max}
          min={min}
          pattern={pattern}
          placeholder={placeholder}
          required={required}
          value={value}
          autoComplete={autoComplete}
        />
      </Inner>
    </div>
  );
});
