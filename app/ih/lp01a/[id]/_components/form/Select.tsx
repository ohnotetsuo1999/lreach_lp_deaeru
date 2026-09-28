import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/lp01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/lp01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name: string;
  number: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  optionData: string[];
  required?: boolean;
}

export const Select = forwardRef<HTMLDivElement, Props>(function Select(
  { label, name, number, onChange, optionData, required = false },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} number={number} />
        <div className="relative h-[42px] w-[95%] mt-[20px] mx-auto">
          <select
            className="bg-white border border-[rgb(189,77,91)] rounded-[10px] size-full p-2 font-zen-maru-gothic font-bold text-sm appearance-none"
            defaultValue=""
            name={name}
            onChange={onChange}
            required={required}
          >
            <option disabled value="">
              選択してください
            </option>
            {optionData.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </Box>
    </div>
  );
});
