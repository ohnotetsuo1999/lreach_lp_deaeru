import { StatusType } from "@/types/lp1";

type Props = {
  updateIsStatus: (status: StatusType) => void;
};

export function FV({ updateIsStatus }: Props) {
  return (
    <section className="relative">
      <div className="relative">
        <img className="block w-full" src="/lp1_fv_bg.jpg" alt="" />
        <div
          className="absolute bottom-[23.5%] left-1/2 block w-[74%] -translate-x-1/2"
          onClick={() => updateIsStatus("diagnosis")}
        >
          <img
            className="mb-2 block w-full"
            src="/lp1_fv_button_txt.png"
            alt="たった一分でAI解析"
          />
          <button className="mx-auto block w-[98%]">
            <img
              className="block w-full animate-button-bounce"
              src="/lp1_fv_button.png"
              alt="無料で診断してみる"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
