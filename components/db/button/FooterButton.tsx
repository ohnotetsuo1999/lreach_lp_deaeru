import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  button: "前へ" | "次へ" | "スカウトを受け取る";
  disabled?: boolean;
  onClick: () => void;
};

export function FooterButton({ button, disabled, onClick }: Props) {
  const componentClass = classNames(
    "flex items-center justify-center gap-x-1 h-10 rounded-md text-base font-medium",
    {
      "bg-green-600 text-white w-full disabled:opacity-50":
        button === "次へ" || button === "スカウトを受け取る",
      "bg-gray-200 text-gray-900 shrink-0 w-20 disabled:opacity-50":
        button === "前へ",
    }
  );

  return (
    <button className={componentClass} disabled={disabled} onClick={onClick}>
      {button === "前へ" ? <ChevronLeft className="w-4" /> : ""}
      <span className="font-medium">{button}</span>
      {button === "次へ" ? <ChevronRight className="w-4" /> : ""}
    </button>
  );
}
