"use client";

import { useEffect, useState } from "react";

import { ChatDataType } from "@/types/lp1";

export function Chat({ loadingDelay, message, type }: ChatDataType) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadingDelay);

    return () => clearTimeout(timer);
  }, [loadingDelay, message]);

  const Bot = () => {
    return (
      <div className="relative flex items-start gap-x-3">
        <img
          className="block w-6 shrink-0"
          src="/lp1_diagnosis_calimimichanai.png"
          alt=""
        />
        <p className="relative rounded-xl bg-white p-2.5 text-xs font-medium leading-normal before:absolute before:right-full before:top-3 before:h-2 before:w-1.5 before:bg-white before:content-[''] before:clip-path-triangle-left">
          {isLoading ? (
            <span className="flex gap-x-1">
              {Array.from({ length: 3 }, (_, i) => i * 0.1).map(
                (delay, index) => (
                  <span
                    key={index}
                    className="size-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: `${delay}s` }}
                  />
                )
              )}
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message }} />
          )}
        </p>
      </div>
    );
  };

  const User = () => {
    return (
      <div className="relative flex justify-end">
        <p className="flex h-8 w-28 items-center justify-center rounded-2xl bg-[rgb(46,105,254)] text-center text-xs font-extrabold text-white drop-shadow-[0_1px_15px_rgba(0,0,0,0.15)]">
          <span>{message}</span>
        </p>
      </div>
    );
  };

  const setComponent = () => {
    switch (type) {
      case "bot":
        return <Bot />;

      case "user":
        return <User />;
    }
  };

  return setComponent();
}
