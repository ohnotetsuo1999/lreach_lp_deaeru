type Props = {
  isSubmitting: boolean;
};

export function Submit({ isSubmitting }: Props) {
  return (
    <div
      className={`relative font-zen-maru-gothic font-bold text-center ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <p className="mb-[9px] text-[15px] text-[rgb(183,130,64)]">
        \ボタンを押して申し込み完了/
      </p>
      <button className="relative flex items-center justify-center gap-1 text-lg bg-[rgb(68,205,33)] text-white h-[71px] w-full rounded-[14px] shadow-[3px_5px_1px_rgb(79,188,51)] animate-button-bounce after:content-[''] after:absolute after:inset-[6px] after:border after:border-white after:rounded-[14px]">
        <span>公式LINEで案内を受け取る</span>
        <span className="flex items-center justify-center w-4 h-4 pb-1 text-[15px] bg-white text-[rgb(68,205,33)] rounded-full font-sofia-sans-extra-condensed translate-y-[2px]">
          →
        </span>
      </button>
    </div>
  );
}
