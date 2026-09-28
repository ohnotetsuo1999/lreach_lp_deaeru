import { ChangeEvent } from "react";

import { Container, Inner } from "@/components/common";
import { Label } from "@/components/lp2/form";

type Props = {
  inputMode?: "text" | "numeric" | "tel";
  label: string;
  maxLength?: number;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
  type: "tel";
  value: string;
};

export function Input({
  inputMode,
  label,
  maxLength,
  name,
  onChange,
  placeholder,
  required,
  type,
  value,
}: Props) {
  return (
    <div className="relative">
      <Container width="90">
        <Inner>
          <Label htmlFor={name} label={label} required={required} />
          <input
            className="block w-full rounded-md border border-gray-300 bg-white p-2 text-base font-medium text-gray-900 placeholder:text-gray-300"
            id={name}
            inputMode={inputMode}
            maxLength={maxLength}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            type={type}
            value={value}
          />
        </Inner>
      </Container>
    </div>
  );
}
