import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/form01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/form01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name_1: string;
  name_2: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder_1?: string;
  placeholder_2?: string;
  required_1?: boolean;
  required_2?: boolean;
  subLabel?: string;
}

export const DualInput = forwardRef<HTMLDivElement, Props>(function DualInput(
  {
    label,
    name_1,
    name_2,
    onChange,
    placeholder_1,
    placeholder_2,
    required_1,
    required_2,
    subLabel,
  },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} subLabel={subLabel} />
        <div className="w-[90%] mx-auto flex flex-col gap-3">
          <input
            className="flex align-middle w-full bg-white border border-[rgb(183,130,64)] rounded-[9px] p-2 font-zen-maru-gothic font-bold text-xs text-center placeholder:text-xs placeholder:text-[rgb(151,142,141)]"
            name={name_1}
            onChange={onChange}
            placeholder={placeholder_1}
            required={required_1}
            type="email"
          />
          <input
            className="block w-full bg-white border border-[rgb(183,130,64)] rounded-[9px] p-2 font-zen-maru-gothic font-bold text-xs text-center placeholder:text-xs placeholder:text-[rgb(151,142,141)]"
            maxLength={11}
            name={name_2}
            onChange={onChange}
            pattern="\d{11}"
            placeholder={placeholder_2}
            required={required_2}
            type="tel"
          />
        </div>
      </Box>
    </div>
  );
});
