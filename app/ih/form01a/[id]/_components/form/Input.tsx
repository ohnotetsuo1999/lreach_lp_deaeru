import { forwardRef, type ChangeEvent } from "react";

import { Box } from "@/app/ih/form01a/[id]/_components/form/Box";
import { Label } from "@/app/ih/form01a/[id]/_components/form/Label";

interface Props {
  label: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  subLabel?: string;
  type?: string;
}

export const Input = forwardRef<HTMLDivElement, Props>(function Input(
  {
    label,
    name,
    onChange,
    placeholder,
    required = false,
    subLabel,
    type = "text",
  },
  ref
) {
  return (
    <div className="relative" data-field ref={ref}>
      <Box>
        <Label label={label} subLabel={subLabel} />
        <input
          className="block w-[90%] mx-auto bg-white border border-[rgb(183,130,64)] rounded-[9px] p-2 font-zen-maru-gothic font-bold text-xs text-center placeholder:text-xs placeholder:text-[rgb(151,142,141)]"
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          type={type}
        />
      </Box>
    </div>
  );
});
