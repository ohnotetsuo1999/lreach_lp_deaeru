import { ReactNode } from "react";
import classNames from "classnames";

type Props = {
  children: ReactNode;
  width: "80" | "90";
};

export function Container({ children, width }: Props) {
  const componentClass = classNames("mx-auto relative", {
    "w-[80%]": width === "80",
    "w-[90%]": width === "90",
  });

  return <div className={componentClass}>{children}</div>;
}
