type Props = {
  updateIsStatus: (status: string) => void;
};

export function FV({ updateIsStatus }: Props) {
  return (
    <section className="relative">
      <img className="block w-full" src="/lp1-a_fv_bg.jpg" alt="" />
      <div className="absolute bottom-1/4 left-1/2 block w-[74%] -translate-x-1/2">
        <button
          className="mx-auto block w-[98%]"
          onClick={() => updateIsStatus("diagnosis")}
        >
          <img
            className="block w-full animate-button-bounce"
            src="/lp1-a_fv_button.png"
            alt="無料で診断してみる"
          />
        </button>
      </div>
    </section>
  );
}
