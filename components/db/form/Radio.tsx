import { ChangeEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/components/lp2/form";

type Props = {
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  radioData: {
    unit: string;
    value: number | string;
  }[];
  required: boolean;
};

export function Radio({ label, name, onChange, radioData, required }: Props) {
  return (
    <div className="flex flex-col gap-y-2 relative">
      <Inner>
        <Label label={label} required={required} />
      </Inner>
      <Inner>
        <div className="flex flex-wrap gap-4">
          {radioData.map(
            (data: { [key: string]: number | string }, index: number) => {
              return (
                <div
                  className="w-[calc((100%-theme(spacing.4)*2)/3)]"
                  key={data.value}
                >
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
                    className="relative flex aspect-square cursor-pointer drop-shadow-[3px_3px_0_rgb(204,239,217)] items-center justify-center rounded-lg bg-green-400 p-1.5 leading-tight text-lg font-black text-green-400 duration-300 ease-in-out before:duration-300 before:ease-in-out before:content-[''] before:absolute before:inset-1.5 before:bg-white before:rounded-md peer-checked:text-white peer-checked:before:bg-green-300"
                    htmlFor={`${name}_${index + 1}`}
                  >
                    <span
                      className="relative text-center"
                      dangerouslySetInnerHTML={{
                        __html: String(data.value) + data.unit,
                      }}
                    />
                  </label>
                </div>
              );
            }
          )}
        </div>
      </Inner>
    </div>
  );
}
