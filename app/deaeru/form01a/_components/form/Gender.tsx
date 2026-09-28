import { forwardRef, type ChangeEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/app/deaeru/form01a/_components/form";

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
      <Inner className="bg-white">
        <Label className="mb-2" label="性別" required={true} />
        <div className="grid grid-cols-2 gap-3">
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
                className={`flex cursor-pointer items-center justify-center rounded-lg px-4 py-3.5 text-base font-bold transition-all duration-200 border-2 ${
                  value && value === data
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
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
