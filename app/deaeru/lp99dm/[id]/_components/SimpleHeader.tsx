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
}

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
};

export function SimpleHeader({ formData, getAnsweredQuestions }: Props) {
  return (
    <header className="fixed top-0 z-50 flex w-full flex-col justify-center bg-white shadow-sm">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 flex-col justify-center gap-y-1.5">
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
          </div>
        </Container>
      </MaxWidth>
    </header>
  );
}
