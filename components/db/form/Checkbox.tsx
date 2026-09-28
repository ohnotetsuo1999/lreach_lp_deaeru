import { ChangeEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/components/lp2/form";

type Props = {
  checkboxData: {
    alt?: string;
    src?: string;
    value: string;
  }[];
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Checkbox({ label, name, onChange, checkboxData }: Props) {
  return (
    <div className="flex flex-col gap-y-2 relative">
      <Inner>
        <Label label={label} required={false} />
      </Inner>
      <Inner>
        <div className="flex flex-wrap gap-4">
          {checkboxData.map(
            (data: { [key: string]: string }, index: number) => {
              return (
                <div
                  className="w-[calc(theme(width.1/2)-theme(spacing.2))]"
                  key={data.value}
                >
                  <input
                    className="peer hidden"
                    id={`${name}_${index + 1}`}
                    name={name}
                    onChange={onChange}
                    type="checkbox"
                    value={data.value}
                  />
                  <label
                    className="relative flex flex-col gap-y-2 items-center cursor-pointer drop-shadow-[3px_3px_0_rgb(204,239,217)] items-center justify-center rounded-lg bg-green-400 px-1.5 py-6 leading-tight text-2xs font-black text-green-400 duration-300 ease-in-out before:duration-300 before:ease-in-out before:content-[''] before:absolute before:inset-1.5 before:bg-white before:rounded-md peer-checked:text-white peer-checked:before:bg-green-300"
                    htmlFor={`${name}_${index + 1}`}
                  >
                    {data.src ? (
                      <img
                        className={`relative block h-10 w-auto`}
                        src={data.src}
                        alt={data.alt}
                      />
                    ) : (
                      ""
                    )}
                    <span
                      className="relative text-center"
                      dangerouslySetInnerHTML={{ __html: data.value }}
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
