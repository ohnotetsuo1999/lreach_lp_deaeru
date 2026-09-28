import { Container, MaxWidth } from "@/components/common";

interface FormData {
  birth_year: string;
  full_name: string;
  full_name_kana: string;
  gender: string;
  phone_number: string;
  preferred_work_location: string[];
  preferred_work_style: string;
  preferred_annual_income: string;
  preferred_job_category: string;
  job_change_timing: string;
  booking_method?: string;
  booking_date?: string;
  booking_start_time?: string;
  booking_end_time?: string;
}

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
  currentFormStep?: number;
};

const BOOKING_STEPS = [
  { key: "method", label: "案内方法" },
  { key: "date", label: "日付" },
  { key: "time", label: "時間" },
] as const;

export function SimpleHeader({ formData, getAnsweredQuestions, currentFormStep }: Props) {
  const isBookingStep = currentFormStep === 3;

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
                        width: `${(getAnsweredQuestions(formData) / Object.keys(formData).length) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="shrink-0 text-xs font-bold text-green-600">
                    残り
                    <strong className="text-xl">
                      {Object.keys(formData).length - getAnsweredQuestions(formData)}
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
