import { Container, MaxWidth } from "@/components/common";
import { FormData } from "@/app/gt/lp01d/[id]/_types";

type Props = {
  formData: FormData;
  getAnsweredQuestions: (formData: FormData) => number;
};

export function Header({ formData, getAnsweredQuestions }: Props) {
  return (
    <header className="fixed top-0 z-50 flex w-full flex-col justify-center bg-white shadow-sm">
      <MaxWidth>
        <Container width="90">
          <div className="flex h-18 flex-col justify-center">
            <div>
              <img
                className="mx-auto block h-auto w-12"
                src="/gt-lp01a-logo.png"
                alt="逆転転職"
              />
            </div>
            <div className="-mt-2 flex items-end gap-x-2">
              <div className="relative mb-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <span
                  className="absolute left-0 top-0 block h-full bg-gradient-to-r from-[rgb(255,138,46)] to-[rgb(238,115,19)] transition-all duration-500"
                  style={{
                    width: `${(getAnsweredQuestions(formData) / Object.keys(formData).length) * 100}%`,
                  }}
                />
              </div>
              <p className="shrink-0 text-xs font-black text-[rgb(238,115,19)]">
                残り
                <strong className="text-2xl">
                  {Object.keys(formData).length -
                    getAnsweredQuestions(formData)}
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
