import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function MaxWidth({ children, className }: Props) {
  return (
    <div className={`relative mx-auto w-full max-w-lg ${className}`}>
      {children}
    </div>
  );
}
