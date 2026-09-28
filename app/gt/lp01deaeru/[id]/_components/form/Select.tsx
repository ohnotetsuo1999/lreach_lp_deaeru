import { forwardRef, type FocusEvent } from "react";

import { cn } from "@/lib/utils";
import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01deaeru/[id]/_components/form";

interface Props {
  label: string;
  name: string;
  onBlur: (event: FocusEvent<HTMLSelectElement>) => void;
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
      <Inner className="bg-white">
        <Label className="mb-2" label={label} required={required} />
        <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-white focus-within:border-green-500 transition-colors">
          <select
            className={cn(
              "block w-full appearance-none text-base font-medium",
              multiple ? "absolute top-0 left-0 w-full h-full opacity-0 z-20 p-3.5 sm:relative sm:opacity-100 sm:z-auto text-gray-900" : "p-3.5 text-gray-900 bg-transparent"
            )}
            multiple={multiple}
            name={name}
            onBlur={onBlur}
            required={required}
            size={size}
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
                "p-3.5 flex items-center bg-white sm:hidden pointer-events-none",
                value && value?.length > 0
                  ? "text-gray-900"
                  : "text-gray-400"
              )}
            >
              {value && value?.length > 0
                ? value.join(", ")
                : "選択してください"}
            </div>
          )}
          {!multiple && (
            <svg
              className="pointer-events-none absolute inset-y-1/2 right-3 flex size-5 -translate-y-1/2 items-center text-gray-400"
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
