import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Box({ children }: Props) {
  return (
    <div className="relative w-[90%] mx-auto pt-3 px-[27px] pb-[35px] bg-white border border-[rgb(143,20,35)] rounded-[44px] shadow-[inset_1px_1px_11px_rgba(0,0,0,.5)]">
      {children}
    </div>
  );
}
