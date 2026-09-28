import { Fragment } from "react";

interface Props {
  maxStep: number;
  step: number;
}

export function Step({ maxStep, step }: Props) {
  return (
    <section className="sticky top-0 z-10 bg-gray-50 py-4">
      <ul className="relative flex justify-center">
        {[...Array(maxStep)].map((_, n) => {
          return (
            <Fragment key={n}>
              <li
                className={`relative flex items-center justify-center rounded-full ${
                  n < step ? "bg-green-400" : "bg-gray-200"
                } size-10 text-sm text-gray-900 duration-300 ease-in-out`}
              >
                {n + 1}
              </li>
              {n < maxStep - 1 && (
                <span
                  className={`block h-0.5 w-8 self-center ${
                    n < step ? "bg-green-400" : "bg-gray-200"
                  } transition-colors duration-300 ease-in-out`}
                />
              )}
            </Fragment>
          );
        })}
      </ul>
    </section>
  );
}
