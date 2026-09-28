interface Props {
  disabled: boolean;
  isSubmitting: boolean;
}

export function Submit({ disabled, isSubmitting }: Props) {
  return (
    <button
      className={`mx-auto block w-4/5 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 px-8 py-4 text-base font-semibold text-white transition-opacity duration-200 ${
        disabled || isSubmitting
          ? "cursor-not-allowed opacity-50"
          : "hover:opacity-90"
      }`}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? "送信中..." : "今すぐエントリーする"}
    </button>
  );
}
