import { ChangeEvent } from "react";

import { Box } from "@/app/ih/form01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/form01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name_1: string;
  name_2: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required_1?: boolean;
  required_2?: boolean;
  subLabel?: string;
  value_1?: string;
  value_2?: string;
}

export function PreferredAt({
  label,
  name_1,
  name_2,
  onChange,
  required_1,
  required_2,
  subLabel,
  value_1,
  value_2,
}: Props) {
  return (
    <div className="relative" data-field>
      <Box>
        <Label label={label} subLabel={subLabel} />
        <div className="w-[90%] mx-auto flex flex-col gap-4">
          <div>
            <label className="block mb-2 text-center text-lg text-[rgb(183,130,64)] font-bold">
              第<strong className="text-xl font-bold">1</strong>希望日時
            </label>
            <div className="relative">
              <input
                className="flex items-center justify-center w-full bg-white border border-[rgb(183,130,64)] rounded-[9px] p-2 font-zen-maru-gothic font-bold text-xs"
                name={name_1}
                onChange={onChange}
                required={required_1}
                type="datetime-local"
                value={value_1}
              />
              {!value_1 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-[rgb(151,142,141)] pointer-events-none">
                  選択してください
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-[10px] text-center text-lg text-[rgb(183,130,64)] font-bold">
              第<strong className="text-xl font-bold">2</strong>希望日時
            </label>
            <div className="relative">
              <input
                className="flex items-center justify-center w-full bg-white border border-[rgb(183,130,64)] rounded-[9px] p-2 font-zen-maru-gothic font-bold text-xs"
                name={name_2}
                onChange={onChange}
                required={required_2}
                type="datetime-local"
                value={value_2}
              />
              {!value_2 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-[rgb(151,142,141)] pointer-events-none">
                  選択してください
                </span>
              )}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}
