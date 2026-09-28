import { Container, MaxWidth } from "@/components/common";

type Props = {
  formData: { [key: string]: number | string | string[] | null };
  questionData: string[];
  step: number;
};

export function Header({ formData, questionData, step }: Props) {
  const setComment = () => {
    switch (true) {
      case (formData.desired_annual_income === "" ||
        (formData.desired_job_category as string[]).length === 0 ||
        (formData.desired_work_style as string[]).length === 0) &&
        step === 1:
        return "転職先に求める条件を答えると<br />あなたにピッタリな<br />スカウトが届きます！";

      case formData.name === "":
        return "お名前を教えてください！";

      case formData.birthday === "":
        return "生年月日を教えてください！";

      case formData.zip_code === "":
        return "郵便番号を教えてください！";

      case formData.phone_number === "":
        return "電話番号を教えてください！";

      default:
        return "おつかれさまでした！";
    }
  };

  const getAnsweredQuestions = () => {
    let count = 0;

    if (step !== 1 || formData.desired_annual_income !== "") count++;
    if (step !== 1 || (formData.desired_job_category as string[]).length > 0)
      count++;
    if (step !== 1 || (formData.desired_work_style as string[]).length > 0)
      count++;
    if (formData.name !== "") count++;
    if (formData.birthday !== "") count++;
    if (formData.zip_code !== "") count++;
    if (formData.phone_number !== "") count++;

    return count;
  };

  return (
    <header className="fixed top-0 flex flex-col justify-center z-50 w-full bg-white shadow-sm h-36">
      <MaxWidth>
        <Container width="90">
          <div className="flex flex-col gap-y-2 w-full">
            <img
              className="block h-auto mx-auto w-20"
              src="/global_lreach-logo_img.svg"
              alt="Lリーチ"
            />
            <div className="relative flex items-start gap-x-3 z-10">
              <img
                className="block h-auto w-10"
                src="/global_calimimichanai-right_img.png"
                alt="キャリミミちゃん"
              />
              <p
                className="relative px-2 py-1 bg-green-100 rounded-sm text-3xs text-gray-900 font-norma after:content-[''] after:block after:absolute after:bg-green-100 after:size-2 after:top-2 after:right-full after:clip-path-triangle-left"
                dangerouslySetInnerHTML={{ __html: setComment() }}
              />
            </div>
            <div className="flex items-end gap-x-2 -mt-8">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 mb-1">
                <span
                  className="absolute left-0 top-0 block h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{
                    width: `${(getAnsweredQuestions() / (questionData.length - 1)) * 100}%`,
                  }}
                />
              </div>
              <p className="shrink-0 text-xs font-black text-green-400">
                残り
                <strong className="text-2xl">
                  {questionData.length - 1 - getAnsweredQuestions()}
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
