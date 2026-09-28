import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/lp01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/lp01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name: string;
  number: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  radioData: string[];
  required?: boolean;
}

export const Radio = forwardRef<HTMLDivElement, Props>(function Radio(
  { label, name, number, onChange, radioData, required = false },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} number={number} />
        <div className="flex flex-col gap-3 mt-6">
          {radioData.map((data, index) => (
            <div key={data}>
              <input
                className="peer sr-only"
                id={`${name}_${index + 1}`}
                name={name}
                onChange={onChange}
                required={required}
                type="radio"
                value={data}
              />
              <label
                className="flex items-center justify-center h-[42px] font-zen-maru-gothic font-bold text-lg text-rgb[(33,23,21)] border border-[rgb(189,77,91)] rounded-[10px] cursor-pointer peer-checked:bg-[rgb(189,77,91)] peer-checked:text-white"
                htmlFor={`${name}_${index + 1}`}
              >
                {data}
              </label>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
});
