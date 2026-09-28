import { MaxWidth } from "@/components/common";

interface Props {
  updateIsCta1Submitted: (isCta1Submitted: boolean) => void;
  updateIsIntroVisible: (isIntroVisible: boolean) => void;
}

export function Intro({ updateIsCta1Submitted, updateIsIntroVisible }: Props) {
  /* CTAをクリックしたときの処理 */
  function handleClickCTA(): void {
    updateIsCta1Submitted(true);
    updateIsIntroVisible(false);
  }

  return (
    <div className="relative">
      <MaxWidth>
        <div className="relative">
          <img className="block w-full" src="/gt-lp01a-intro.jpg" alt="" />
        </div>
      </MaxWidth>
      <div className="fixed inset-0 bottom-[6%]">
        <MaxWidth className="h-full">
          <div className="flex h-full items-end justify-center">
            <button className="mx-auto block w-4/5" onClick={handleClickCTA}>
              <img
                className="block w-full animate-button-bounce"
                src="/gt-lp01a-intro-button.png"
                alt=""
              />
            </button>
          </div>
        </MaxWidth>
      </div>
    </div>
  );
}
