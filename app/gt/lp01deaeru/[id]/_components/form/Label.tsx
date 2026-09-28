import { cn } from "@/utils";

type Props = {
  label: string;
  required?: boolean;
  className?: string;
};

export function Label({ label, required = false, className }: Props) {
  return (
    <p
      className={cn(
        "text-sm font-bold text-gray-700",
        className
      )}
    >
      {label}
      {required && (
        <span className="ml-1 inline-block rounded bg-green-500 px-1.5 py-0.5 text-2xs font-bold text-white">
          必須
        </span>
      )}
    </p>
  );
}
