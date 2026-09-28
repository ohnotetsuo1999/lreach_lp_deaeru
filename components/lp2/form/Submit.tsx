type Props = {
  isSubmitting: boolean;
};

export function Submit({ isSubmitting }: Props) {
  return (
    <button
      className="w-4/5 mx-auto block rounded-full bg-gradient-to-b from-orange-400 to-orange-500 px-8 py-4 text-base font-semibold text-white"
      disabled={isSubmitting}
    >
      {isSubmitting ? "登録中..." : "今すぐ求人情報を受け取る"}
    </button>
  );
}
