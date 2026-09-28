import { forwardRef, type ChangeEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01a/[id]/_components/form";

type Props = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const genderData = ["男性", "女性"];

export const Gender = forwardRef<HTMLDivElement, Props>(function Radio(
  { onChange, value },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Inner className="bg-[rgb(255,138,46)]">
        <Label className="mb-2" label="性別" required={true} />
        <div className="grid grid-cols-2 gap-4">
          {genderData.map((data, index) => (
            <div key={data}>
              <input
                className="peer hidden"
                id={`gender_${index + 1}`}
                name="gender"
                onChange={onChange}
                type="radio"
                required={true}
                value={data}
              />
              <label
                className={`flex cursor-pointer items-center justify-center rounded-lg px-1.5 py-3 text-base font-black leading-tight  duration-300 ease-in-out ${
                  value && value === data
                    ? "bg-white/80 text-[rgb(255,138,46)]"
                    : "bg-white"
                }`}
                htmlFor={`gender_${index + 1}`}
              >
                {data}
              </label>
            </div>
          ))}
        </div>
      </Inner>
    </div>
  );
});
