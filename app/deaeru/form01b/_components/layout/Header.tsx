import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/deaeru/form01b/_types";

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
  currentFormStep?: number;
  /**
   * 進捗バー/残り問数の母数（実際にUIで聞く設問数）。
   * 未指定時は従来通り Object.keys(formData).length を母数にする（後方互換）。
   * 希望条件設問を削除したLP（lp98c/lp98d 等）は formData 型に未使用フィールドが
   * 残るため、ここに実設問数（REQUIRED_FIELDS.length 等）を渡してズレを防ぐ。
   */
  totalQuestions?: number;
  /**
   * 予約ステップ表示にするか。未指定時は従来通り currentFormStep === 3 で判定（後方互換）。
   * 希望条件削除でステップ番号がずれたLP（予約が step2 等）は明示的に渡す。
   */
  isBookingStep?: boolean;
};

const BOOKING_STEPS = [
  { key: "method", label: "案内方法" },
  { key: "date", label: "日付" },
  { key: "time", label: "時間" },
] as const;

export function Header({
  formData,
  getAnsweredQuestions,
  currentFormStep,
  totalQuestions,
  isBookingStep: isBookingStepProp,
}: Props) {
  // 予約ステップ判定: prop 明示時はそれを優先、未指定時は従来通り currentFormStep === 3
  const isBookingStep = isBookingStepProp ?? currentFormStep === 3;
  // 進捗の母数: totalQuestions 明示時はそれ、未指定時は従来通り formData の全キー数
  const totalCount = totalQuestions ?? Object.keys(formData).length;
  const answeredCount = getAnsweredQuestions(formData);
  const remainingCount = Math.max(0, totalCount - answeredCount);
  const progressRate = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const bookingCompletedCount =
    (formData.booking_method ? 1 : 0) +
    (formData.booking_date ? 1 : 0) +
    (formData.booking_start_time ? 1 : 0);

  const bookingRemaining = BOOKING_STEPS.length - bookingCompletedCount;

  return (
    <header className="fixed top-0 z-50 flex w-full flex-col justify-center bg-white shadow-sm">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 flex-col justify-center gap-y-1.5">
            {isBookingStep ? (
              <>
                <div className="flex items-center justify-between">
                  <img
                    className="block h-8 w-auto"
                    src="/deaeru-logo.png"
                    alt="出会えるエージェント"
                  />
                  <p className="shrink-0 text-xs font-bold text-green-600">
                    残り
                    <strong className="text-xl">{bookingRemaining}</strong>
                    ステップ
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    {BOOKING_STEPS.map((s, i) => {
                      const isDone = i < bookingCompletedCount;
                      const isCurrent = i === bookingCompletedCount;
                      return (
                        <div key={s.key} className="flex items-center">
                          <div className="flex items-center gap-x-1">
                            <div
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold transition-all ${
                                isDone
                                  ? "border-green-500 bg-green-500 text-white"
                                  : isCurrent
                                    ? "border-green-500 bg-white text-green-600"
                                    : "border-gray-200 bg-white text-gray-400"
                              }`}
                            >
                              {isDone ? "✓" : i + 1}
                            </div>
                            <span
                              className={`text-[9px] font-medium leading-none ${
                                isDone || isCurrent ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                          {i < BOOKING_STEPS.length - 1 && (
                            <div
                              className={`mx-2 w-10 h-0.5 shrink-0 rounded-full transition-all ${
                                isDone ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <img
                    className="block h-10 w-auto"
                    src="/deaeru-logo.png"
                    alt="出会えるエージェント"
                  />
                </div>
                <div className="flex items-end gap-x-2">
                  <div className="relative mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <span
                      className="absolute left-0 top-0 block h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                      style={{
                        width: `${progressRate}%`,
                      }}
                    />
                  </div>
                  <p className="shrink-0 text-xs font-bold text-green-600">
                    残り
                    <strong className="text-xl">
                      {remainingCount}
                    </strong>
                    問
                  </p>
                </div>
              </>
            )}
          </div>
        </Container>
      </MaxWidth>
    </header>
  );
}
