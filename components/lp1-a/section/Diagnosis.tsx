import { ChatData } from "@/types/lp1-a";
import { Chat } from "@/components/lp1-a/element";

type Props = {
  chatData: ChatData[];
  endData: string[];
  infoStartData: string[];
  questionData: {
    choices?: string[];
    question: string;
  }[];
  step: number;
  totalStep: number;
};

export function Diagnosis({
  chatData,
  endData,
  infoStartData,
  questionData,
  step,
  totalStep,
}: Props) {
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
        <div className="my-6 flex grow flex-col gap-y-2.5 overflow-y-scroll scroll-smooth px-4">
          {chatData
            ? chatData.map((chat) => {
                return (
                  <Chat
                    key={chat.message}
                    message={chat.message}
                    type={chat.type}
                  />
                );
              })
            : null}
        </div>
        <div className="flex shrink-0 gap-x-1.5 px-4"></div>
      </div>
      <img
        className="absolute inset-x-0 bottom-0 block w-full"
        src="/lp1_diagnosis_bg.png"
        alt=""
      />
    </section>
  );
}
