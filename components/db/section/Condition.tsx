import { ChangeEvent } from "react";

import { Container, MaxWidth } from "@/components/common";
import { Checkbox, Radio } from "@/components/db/form";
import { StepTitle } from "@/components/db/title";

type Props = {
  desiredAnnualIncomeData: {
    unit: string;
    value: number;
  }[];
  desiredJobCategoryData: {
    alt: string;
    src: string;
    value: string;
  }[];
  desiredWorkStyleData: {
    value: string;
  }[];
  formData: { [key: string]: number | string | string[] | null };
  questionData: string[];
  updateFormData: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Condition({
  desiredAnnualIncomeData,
  desiredJobCategoryData,
  desiredWorkStyleData,
  formData,
  questionData,
  updateFormData,
}: Props) {
  return (
    <section className="relative grow">
      <div className="absolute inset-y-0 w-full overflow-y-scroll">
        <MaxWidth>
          <Container width="90">
            <div className="flex flex-col gap-y-4">
              <StepTitle step={1} title="希望条件" />
              <Checkbox
                checkboxData={desiredWorkStyleData}
                label={questionData[0]}
                name="desired_work_style"
                onChange={updateFormData}
              />
              <Radio
                label={questionData[1]}
                name="desired_annual_income"
                onChange={updateFormData}
                radioData={desiredAnnualIncomeData}
                required={true}
              />
              <Checkbox
                checkboxData={desiredJobCategoryData}
                label={questionData[2]}
                name="desired_job_category"
                onChange={updateFormData}
              />
              <div className="flex items-start justify-center gap-x-8">
                <p
                  className="relative px-4 py-2 bg-green-100 rounded-lg text-2xs text-gray-900 font-normal after:content-[''] after:block after:absolute after:bg-green-100 after:size-3 after:rounded-full after:-right-4 after:top-4 before:block before:content-[''] before:bg-green-100 before:absolute before:size-2 before:rounded-full before:-right-7 before:top-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      (formData.desired_annual_income as number) === 0 ||
                      (formData.desired_job_category as string[]).length ===
                        0 ||
                      (formData.desired_work_style as string[]).length === 0
                        ? "転職先に求める条件を答えると<br />あなたにピッタリなスカウトが届きます！"
                        : "ここまで答えてくれたあなたに<br />ピッタリなスカウトが届きます！<br />スカウトを受け取る際に<br />必要な情報をお答えください！",
                  }}
                />
                <img
                  className="block shrink-0 h-auto w-10"
                  src="/global_calimimichanai-left_img.png"
                  alt="キャリミミちゃん"
                />
              </div>
            </div>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
