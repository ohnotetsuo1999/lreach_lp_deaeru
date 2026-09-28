import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/* クラス名をマージ */
export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}
