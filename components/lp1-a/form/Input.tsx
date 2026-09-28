import { ChangeEvent } from "react";

type Props = {
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

export function Input({ name, onChange, placeholder }: Props) {
  return (
    <div>
      <input
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
      />
    </div>
  );
}
