import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  htmlFor?: string;
  label: string;
  required: boolean;
};

export function Label({ className, htmlFor, label, required }: Props) {
  return (
    <label
      className={cn(
        "relative flex items-center gap-x-2 text-base font-semibold text-white",
        className
      )}
      htmlFor={htmlFor}
    >
      {label}
      {required ? (
        <span className="rounded-sm bg-[rgb(219,0,0)] px-2 py-0.5 text-xs">
          必須
        </span>
      ) : (
        ""
      )}
    </label>
  );
}
