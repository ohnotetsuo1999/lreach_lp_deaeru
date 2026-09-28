import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/deaeru/form01b/_types";

/**
 * lp99cb 専用ヘッダー（lp99az ベース → 3ステップ構成に拡張）
 *
 * form01b の共有 Header をベースに、以下を lp99cb 向けに変更:
 *   - 予約ステップを step3 で判定（lp99cb は step1=希望条件 / step2=基本情報 / step3=面談予約）
 *   - 進捗バーの分母を totalQuestions（希望条件＋基本情報の総設問数）で指定可能に
 *     ※ formData には booking_* や未使用フィールドが残るため、全キー数だと分母がズレる
 *
 * 共有 Header（form01b）は他LP（3ステップ）が使うため変更せず、こちらを lp99cb 専用に分離した。
 */

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
  currentFormStep?: number;
  // 進捗バーの分母（基本情報の総設問数）
  totalQuestions: number;
  // 予約ステップ表示にするか。指定時はこれを優先、未指定時は currentFormStep === BOOKING_STEP_INDEX。
  // 希望条件削除で予約が step2 になった等、ステップ番号がずれた場合に明示的に渡す。
  isBookingStep?: boolean;
};

const BOOKING_STEPS = [
  { key: "method", label: "案内方法" },
  { key: "date", label: "日付" },
  { key: "time", label: "時間" },
] as const;

// 旧: 予約ステップが step3（step1=希望条件 / step2=基本情報 / step3=面談予約）だった名残。
// 希望条件削除後は予約が step2 のため、呼び出し側から isBookingStep を渡して判定する。
const BOOKING_STEP_INDEX = 3;

export function Header({
  formData,
  getAnsweredQuestions,
  currentFormStep,
  totalQuestions,
  isBookingStep: isBookingStepProp,
}: Props) {
  const isBookingStep = isBookingStepProp ?? currentFormStep === BOOKING_STEP_INDEX;
  const answered = getAnsweredQuestions(formData);

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
                        width: `${(answered / totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="shrink-0 text-xs font-bold text-green-600">
                    残り
                    <strong className="text-xl">
                      {Math.max(0, totalQuestions - answered)}
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
