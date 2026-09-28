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
    // コンバージョンタグを発火
    fireConversionTag();
    
    updateIsCta1Submitted(true);
    updateIsIntroVisible(false);
  }

  /* サルクルー コンバージョンタグを発火 */
  function fireConversionTag(): void {
    try {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.monkey-ads.com/js/cv.js?cvid=2a25f0218af25909c9dcbbe6c33208dfdcea80925130af1c648462ff611d669d&type=thank_you&cg_id=1969&orid=' + generateOrderId();
      document.getElementsByTagName('head')[0].appendChild(script);
    } catch (error) {
      console.error('コンバージョンタグの発火に失敗しました:', error);
    }
  }

  /* 注文ID（orid）を生成 */
  function generateOrderId(): string {
    // タイムスタンプとランダム文字列を組み合わせて一意のIDを生成
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `lp01srcw-${timestamp}-${random}`;
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
              src="/gt-lp01c-intro-button.png"
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
                  src="/gt-lp01c-intro-button.png"
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
