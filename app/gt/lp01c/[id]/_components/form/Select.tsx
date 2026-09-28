import { forwardRef, type SyntheticEvent } from "react";

import { cn } from "@/lib/utils";
import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01c/[id]/_components/form";

interface Props {
  label: string;
  name: string;
  /**
   * NOTE:
   * iOSの自動入力/選択で state が更新されないケースに備えて、
   * onBlur だけでなく onChange/onInput でも同一ハンドラを呼ぶ。
   */
  onBlur: (event: SyntheticEvent<HTMLSelectElement>) => void;
  optionData: string[];
  multiple?: boolean;
  required?: boolean;
  value?: string[];
  size?: number;
}

export const Select = forwardRef<HTMLDivElement, Props>(function Select(
  {
    label,
    name,
    onBlur,
    optionData,
    multiple = false,
    required = false,
    size = 1,
    value,
  },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Inner className="bg-[rgb(255,138,46)]">
        <Label className="mb-2" label={label} required={required} />
        <div className="relative overflow-hidden rounded-md border border-[rgb(170,173,179)] bg-white">
          <select
            className={cn(
              "block w-full appearance-none text-base font-medium",
              multiple ? "absolute top-0 left-0 w-full h-full opacity-0 z-20 p-2 sm:relative sm:opacity-100 sm:z-auto text-[rgb(22,22,22)]" : "p-2 text-[rgb(22,22,22)]"
            )}
            multiple={multiple}
            name={name}
            onBlur={onBlur}
            onChange={onBlur}
            onInput={onBlur}
            required={required}
            size={size}
            value={value}
          >
            {!multiple && (
              <option disabled value="">
                選択してください
              </option>
            )}
            {optionData.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {multiple && (
            <div
              className={cn(
                "p-2 flex items-center bg-white sm:hidden pointer-events-none",
                value && value?.length > 0
                  ? "text-[rgb(22,22,22)]"
                  : "text-[rgb(170,173,179)]"
              )}
            >
              {value && value?.length > 0
                ? value.join(", ")
                : "選択してください"}
            </div>
          )}
          {!multiple && (
            <svg
              className="pointer-events-none absolute inset-y-1/2 right-3 flex size-4 -translate-y-1/2 items-center text-[rgb(170,173,179)]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </Inner>
    </div>
  );
});
