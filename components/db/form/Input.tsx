import { ChangeEvent } from "react";

import { Inner } from "@/components/common";
import { Label } from "@/components/lp2/form";

type Props = {
  addressData?: {
    prefecture: string;
    city: string;
    town: string;
  } | null;
  inputMode?: "numeric";
  label: string;
  maxLength?: number;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
  type: "date" | "tel" | "text";
  value: string;
};

export function Input({
  addressData,
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
  const setAddress = () => {
    if (value.length !== 7) return;
    if (addressData) {
      return (
        <div className="flex flex-col gap-y-1 mt-2 px-4 py-2 bg-gray-100 border-l-4 border-green-500 text-sm">
          <p>
            <strong>郵便番号：</strong>
            {value}
          </p>
          <p>
            <strong>都道府県：</strong>
            {addressData.prefecture}
          </p>
          <p>
            <strong>市区町村：</strong>
            {addressData.city}
          </p>
          <p>
            <strong>町域：</strong>
            {addressData.town}
          </p>
          <p>
            <strong>住所：</strong>
            {addressData.prefecture + addressData.city + addressData.town}
          </p>
        </div>
      );
    } else {
      return (
        <p className="mt-2 text-base text-red-500">
          該当する住所が見つかりませんでした。
        </p>
      );
    }
  };

  return (
    <div className="relative">
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
        {name === "zip_code" ? setAddress() : ""}
      </Inner>
    </div>
  );
}
