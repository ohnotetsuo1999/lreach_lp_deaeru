import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/lp01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/lp01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name: string;
  number: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  value: string;
}

export const Textarea = forwardRef<HTMLDivElement, Props>(function Textarea(
  { label, name, number, onChange, required = false, value },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} number={number} />
        <textarea
          className="block border border-[rgb(189,77,91)] rounded-[10px] h-32 w-[95%] mt-[17px] mx-auto mb-[6px] p-2 font-zen-maru-gothic font-bold text-sm"
          name={name}
          onChange={onChange}
          required={required}
          value={value}
        />
        <p className="font-zen-maru-gothic font-bold text-[9px] text-center text-[rgb(87,83,82)]">
          ※ご自由に記入してください！
        </p>
      </Box>
    </div>
  );
});
