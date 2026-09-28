"use client";

import { useEffect, useRef, useState } from "react";
import { LP1Data } from "@/constants";

import {
  ChatDataType,
  ScoreDataType,
  ScoreType,
  StatusType,
} from "@/types/lp1";
import { Chat } from "@/components/elem";

type Props = {
  questionData: string[];
  scoreData: ScoreDataType[];
  updateIsAnalyzing: (bool: boolean) => void;
  updateIsStatus: (status: StatusType) => void;
  updateScores: (data: ScoreType) => void;
  updateToSupabase: (answer: { [key: string]: string }) => void;
};

export function Diagnosis({
  questionData,
  scoreData,
  updateIsAnalyzing,
  updateIsStatus,
  updateScores,
  updateToSupabase,
}: Props) {
  const [chatData, setChatData] = useState<ChatDataType[]>([]),
    [isButtonDisabled, setIsButtonDisabled] = useState(true),
    [step, setStep] = useState(0);

  const chatBoxRef = useRef<HTMLDivElement>(null);

  const botDelay = 500,
    loadingDelay = 500,
    totalStep =
      LP1Data.diagnosis_greeting_data.length +
      LP1Data.diagnosis_end_data.length +
      questionData.length -
      1;

  const updateMessageData = ({ message, type }: ChatDataType) => {
    setChatData((prev) => [
      ...prev,
      { loadingDelay: loadingDelay, message: message, type: type },
    ]);
  };

  const scrollChatBox = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const setNextQuestion = () => {
    if (step !== totalStep - 1) {
      updateMessageData({
        loadingDelay: loadingDelay,
        message: questionData[step],
        type: "bot",
      });
      setTimeout(() => {
        scrollChatBox();
      }, loadingDelay + 100);
    } else {
      updateMessageData({
        loadingDelay: loadingDelay,
        message: LP1Data.diagnosis_end_data[0],
        type: "bot",
      });
      setTimeout(() => {
        scrollChatBox();

        setTimeout(() => {
          updateIsStatus("analyzing");
          updateIsAnalyzing(true);
        }, loadingDelay + 400);
      }, loadingDelay + 100);
    }
  };

  const selectChoice = (choice: string) => {
    const score = scoreData[step - 1];
    const findScore = score.find((s) => s.choice === choice);

    if (findScore) {
      const { choice: _, ...scoreWithoutChoice } = findScore;
      updateScores(scoreWithoutChoice);
    }

    setIsButtonDisabled(true);
    updateMessageData({
      loadingDelay: loadingDelay,
      message: choice,
      type: "user",
    });
    updateToSupabase({ [`answer_${step}`]: choice });
    setStep((prev) => prev + 1);
    setTimeout(() => {
      setNextQuestion();

      setTimeout(() => {
        if (step !== totalStep - 1) {
          setIsButtonDisabled(false);
        }
      }, loadingDelay);
    }, botDelay);
  };

  useEffect(() => {
    setTimeout(() => {
      setStep(1);
      updateMessageData({
        loadingDelay: loadingDelay,
        message: LP1Data.diagnosis_greeting_data[0],
        type: "bot",
      });

      setTimeout(() => {
        updateMessageData({
          loadingDelay: loadingDelay,
          message: questionData[0],
          type: "bot",
        });

        setTimeout(() => {
          setIsButtonDisabled(false);
        }, loadingDelay);
      }, loadingDelay + botDelay);
    }, botDelay);
  }, [questionData]);

  useEffect(() => {
    scrollChatBox();
  }, [chatData]);

  return (
    <section className="relative h-screen p-6">
      <div className="relative flex h-full flex-col bg-[rgb(160,247,255)] pb-[45%] pt-4">
        <div className="shrink-0 px-2.5">
          <div className="mb-1 flex items-center justify-between text-2xs font-extrabold text-black">
            <p>分析の進捗</p>
            <p>
              {step}/{totalStep}
            </p>
          </div>
          <div className="h-2.5 overflow-hidden rounded-2xl bg-white">
            <span
              className="block h-full w-0 bg-blue-600 transition-all duration-500"
              style={{ width: `${(step / totalStep) * 100}%` }}
            />
          </div>
        </div>
        <div
          className="my-6 flex grow flex-col gap-y-2.5 overflow-y-scroll scroll-smooth px-4"
          ref={chatBoxRef}
        >
          {chatData
            ? chatData.map((d, n) => {
                return (
                  <Chat
                    key={n}
                    loadingDelay={loadingDelay}
                    message={d.message}
                    type={d.type}
                  />
                );
              })
            : null}
        </div>
        <div className="flex shrink-0 gap-x-1.5 px-4">
          {LP1Data.diagnosis_choice_data.map((d, n) => {
            return (
              <button
                className="flex h-8 flex-1 items-center justify-center rounded-2xl bg-blue-600 text-2xs font-extrabold text-white drop-shadow-[0_1px_15px_rgba(0,0,0,0.15)] transition-all duration-500 disabled:opacity-60"
                disabled={isButtonDisabled}
                key={n}
                onClick={() => selectChoice(d)}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
      <img
        className="absolute inset-x-0 bottom-0 block w-full"
        src="/lp1_diagnosis_bg.png"
        alt=""
      />
    </section>
  );
}
