"use client";

import { useEffect, useRef, useState } from "react";

import { MaxWidth } from "@/components/common";

interface Props {
  updateIsCta1Submitted: (isCta1Submitted: boolean) => void;
  updateIsIntroVisible: (isIntroVisible: boolean) => void;
}

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showFixedButton, setShowFixedButton] = useState(false);

  /* CTAをクリックしたときの処理 */
  function handleClickCTA(): void {
    updateIsCta1Submitted(true);
    updateIsIntroVisible(false);
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // ボタンが画面外に出たら固定ボタンを表示
        setShowFixedButton(!entry.isIntersecting);
      },
      {
        threshold: 0,
      }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <MaxWidth>
        <div className="relative">
          <img className="block w-full" src="/gt-lp01c-intro.jpg" alt="" />
          <button
            ref={buttonRef}
            className="absolute left-0 right-0 top-[11.6%] mx-auto block w-[92%]"
            onClick={handleClickCTA}
          >
            <img
              className="block w-full animate-button-bounce"
              src="/gt-lp01i-intro-button.png"
              alt=""
            />
          </button>
        </div>
      </MaxWidth>
      {showFixedButton && (
        <div className="fixed inset-0 bottom-[8%]">
          <MaxWidth className="h-full">
            <div className="flex h-full items-end justify-center">
              <button
                className="mx-auto block w-[92%]"
                onClick={handleClickCTA}
              >
                <img
                  className="block w-full animate-button-bounce"
                  src="/gt-lp01i-intro-button.png"
                  alt=""
                />
              </button>
            </div>
          </MaxWidth>
        </div>
      )}
    </div>
  );
}
