import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/deaeru/form01a/_types";

// lp02g で実際に表示・回答する設問のみ（Info セクションの5問）。
// FormData には未使用の preferred_annual_income / preferred_job_category /
// preferred_work_style も含まれるため、Object.keys(formData).length（=8）を
// 総設問数に使うと、全問回答しても「残り3問」になってしまう。
const QUESTION_KEYS: (keyof FormData)[] = [
  "birth_year",
  "full_name",
  "gender",
  "phone_number",
  "preferred_work_location",
];

const TOTAL_QUESTIONS = QUESTION_KEYS.length;

function getAnsweredQuestions(formData: FormData): number {
  return QUESTION_KEYS.reduce((count, key) => {
    const value = formData[key];
    if (Array.isArray(value)) {
      return value.length !== 0 ? count + 1 : count;
    }
    return value !== "" ? count + 1 : count;
  }, 0);
}

type Props = {
  formData: FormData;
};

export function Header({ formData }: Props) {
  const answered = getAnsweredQuestions(formData);
  const remaining = TOTAL_QUESTIONS - answered;

  return (
    <header className="fixed top-0 z-50 flex w-full flex-col justify-center bg-white shadow-sm">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 flex-col justify-center gap-y-2">
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
                    width: `${(answered / TOTAL_QUESTIONS) * 100}%`,
                  }}
                />
              </div>
              <p className="shrink-0 text-xs font-bold text-green-600">
                残り
                <strong className="text-xl">{remaining}</strong>問
              </p>
            </div>
          </div>
        </Container>
      </MaxWidth>
    </header>
  );
}
