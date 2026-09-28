import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Box({ children }: Props) {
  return (
    <div className="relative pt-6 px-6 pb-8 bg-white border border-[rgb(183,130,64)] rounded-[22px] shadow-[inset_1px_1px_11px_rgba(0,0,0,.25)]">
      {children}
    </div>
  );
}
