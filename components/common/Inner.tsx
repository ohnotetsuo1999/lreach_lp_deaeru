import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Inner({ children, className }: Props) {
  return (
    <div className={cn("rounded-xl bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}
