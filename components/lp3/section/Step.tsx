import { Fragment } from "react";

type Props = {
  step: number;
  stepLength: number;
};

export function Step({ step, stepLength }: Props) {
  return (
    <section className="sticky top-0 bg-gray-50 z-10 py-4">
      <ul className="relative flex justify-center">
        {[...Array(stepLength)].map((_, n) => {
          return (
            <Fragment key={n}>
              <li
                className={`relative flex h-10 w-10 items-center justify-center rounded-full ${
                  n < step ? "bg-green-400" : "bg-gray-200"
                } text-sm text-gray-900 duration-300 ease-in-out`}
              >
                {n + 1}
              </li>
              {n < stepLength - 1 && (
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
