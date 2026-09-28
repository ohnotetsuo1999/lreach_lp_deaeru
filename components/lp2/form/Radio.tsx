import { ChangeEvent } from "react";
import { LucideIcon } from "lucide-react";

import { Container, Inner } from "@/components/common";
import { Label } from "@/components/lp2/form";

type Props = {
  label: string;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  radioData: {
    icon: LucideIcon;
    value: string;
  }[];
  required: boolean;
};

export function Radio({ label, name, onChange, radioData, required }: Props) {
  return (
    <div className="relative">
      <Container width="90">
        <Inner>
          <Label label={label} required={required} />
          <div className="flex flex-col gap-y-2">
            {radioData.map((d, n) => {
              return (
                <div key={n}>
                  <input
                    className="peer hidden"
                    id={`${name}_${n + 1}`}
                    name={name}
                    onChange={onChange}
                    type="radio"
                    required={required}
                    value={d.value}
                  />
                  <label
                    className="flex cursor-pointer items-center gap-x-2 rounded-xl bg-gradient-to-b from-green-300 to-green-400 px-8 py-4 text-base font-semibold text-gray-900 duration-300 ease-in-out peer-checked:from-green-500 peer-checked:to-green-600 peer-checked:text-white"
                    htmlFor={`${name}_${n + 1}`}
                  >
                    <d.icon className="size-4" />
                    <span>{d.value}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </Inner>
      </Container>
    </div>
  );
}
