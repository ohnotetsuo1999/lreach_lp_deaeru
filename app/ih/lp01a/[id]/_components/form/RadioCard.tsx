import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/lp01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/lp01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name: string;
  number: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  radioData: {
    image: string;
    value: string;
  }[];
  required?: boolean;
}

export const RadioCard = forwardRef<HTMLDivElement, Props>(function RadioCard(
  { label, name, number, onChange, radioData, required = false },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} number={number} />
        <div className="flex gap-[10px] mt-8">
          {radioData.map((data, index) => (
            <div className="flex-1" key={data.value}>
              <img
                className="h-[115px] w-[90%] object-cover mx-auto mb-[9px]"
                src={data.image}
                alt={data.value}
              />
              <input
                className="peer sr-only"
                id={`${name}_${index + 1}`}
                name={name}
                onChange={onChange}
                required={required}
                type="radio"
                value={data.value}
              />
              <label
                className="flex items-center justify-center h-[38px] font-zen-maru-gothic font-bold text-sm text-rgb[(33,23,21)] border border-[rgb(189,77,91)] rounded-[10px] cursor-pointer peer-checked:bg-[rgb(189,77,91)] peer-checked:text-white"
                htmlFor={`${name}_${index + 1}`}
              >
                {data.value}
              </label>
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
});
