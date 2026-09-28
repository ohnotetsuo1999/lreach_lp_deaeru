interface Props {
  isSubmitting: boolean;
}

export function Submit({ isSubmitting }: Props) {
  return (
    <div
      className={`relative pt-4 pb-[45px] font-zen-maru-gothic font-bold text-center bg-[rgb(255,249,238)] ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <p className="mb-[9px] text-lg text-[rgb(189,77,91)]">
        ＼一人ひとりに合わせて作成／
      </p>
      <button className="relative flex items-center justify-center gap-1 text-2xl bg-[rgb(189,77,91)] text-white h-[60px] w-[78%] mx-auto rounded-[13px] shadow-[3px_5px_1px_rgb(169,80,80)] animate-button-bounce after:content-[''] after:absolute after:inset-[6px] after:border after:border-white after:rounded-[12px]">
        <span>無料で診断を依頼する</span>
        <span className="flex items-center justify-center w-[22px] h-[22px] pb-1 text-lg bg-white text-[rgb(189,77,91)] rounded-full font-sofia-sans-extra-condensed translate-y-[2px]">
          →
        </span>
      </button>
    </div>
  );
}
