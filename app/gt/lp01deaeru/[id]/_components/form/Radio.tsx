import { forwardRef, type ChangeEvent } from "react";
import { cn } from "@/utils";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01deaeru/[id]/_components/form";

type Props = {
  columns: 2 | 3;
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  radioData: {
    label: string;
    value: string;
    alt?: string;
    src?: string;
  }[];
  required?: boolean;
};

const LABEL_BASE_CLASS =
  "relative flex cursor-pointer items-center justify-center rounded-xl border-2 font-bold leading-tight transition-all duration-200 ease-in-out";

export const Radio = forwardRef<HTMLDivElement, Props>(function Radio(
  { columns, label, name, onChange, radioData, required = false },
  ref
) {
  return (
    <div className={`relative flex flex-col gap-y-3`} data-field ref={ref}>
      <Inner className="bg-white">
        <Label label={label} required={required} />
      </Inner>
      <Inner>
        <div
          className={cn(
            "grid gap-3",
            columns === 2 && "grid-cols-2",
            columns === 3 && "grid-cols-3"
          )}
        >
          {radioData.map((data, index) => {
            return (
              <div key={data.value}>
                <input
                  className="peer hidden"
                  id={`${name}_${index + 1}`}
                  name={name}
                  onChange={onChange}
                  type="radio"
                  required={required}
                  value={data.value}
                />
                <label
                  className={cn(
                    LABEL_BASE_CLASS,
                    columns === 2 && "flex-col gap-y-3 px-5 py-6 text-base h-[130px]",
                    columns === 3 && "aspect-square p-3 text-base",
                    "border-gray-200 bg-white text-gray-700",
                    "peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700",
                    "hover:border-green-300 hover:bg-green-25"
                  )}
                  htmlFor={`${name}_${index + 1}`}
                >
                  {data.src && (
                    <img
                      className={`relative block h-14 w-auto object-contain`}
                      src={data.src || ""}
                      alt={data.alt || ""}
                    />
                  )}
                  <span
                    className="relative text-center"
                    dangerouslySetInnerHTML={{
                      __html: data.label,
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </Inner>
    </div>
  );
});
