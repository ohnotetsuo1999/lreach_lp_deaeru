import { forwardRef, type ChangeEvent } from "react";
import { cn } from "@/utils";

import { Inner } from "@/components/common";
import { Label } from "@/app/gt/lp01c/[id]/_components/form";

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
  "relative flex cursor-pointer items-center justify-center rounded-lg bg-[rgb(238,115,19)] font-black leading-tight text-[rgb(238,115,19)] drop-shadow-[3px_3px_0_rgb(249,199,154)] duration-300 ease-in-out before:absolute before:inset-1.5 before:rounded-md before:bg-white before:duration-300 before:ease-in-out before:content-[''] peer-checked:text-white peer-checked:before:bg-[rgb(255,138,46)]";

export const Radio = forwardRef<HTMLDivElement, Props>(function Radio(
  { columns, label, name, onChange, radioData, required = false },
  ref
) {
  return (
    <div className={`relative flex flex-col gap-y-2 `} data-field ref={ref}>
      <Inner className="bg-[rgb(255,138,46)]">
        <Label label={label} required={required} />
      </Inner>
      <Inner>
        <div
          className={cn(
            "grid gap-4",
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
                    columns === 2 && "flex-col gap-y-2 px-1.5 py-6 text-2xs",
                    columns === 3 && "aspect-square p-1.5 text-lg"
                  )}
                  htmlFor={`${name}_${index + 1}`}
                >
                  {data.src && (
                    <img
                      className={`relative block h-10 w-auto`}
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
