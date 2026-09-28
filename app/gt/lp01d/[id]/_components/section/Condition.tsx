import { type ChangeEvent, type RefObject } from "react";

import { Container, MaxWidth } from "@/components/common";
import { Radio } from "@/app/gt/lp01d/[id]/_components/form";
import { StepTitle } from "@/app/gt/lp01d/[id]/_components/ui";

interface Props {
  preferredAnnualIncomeRef: RefObject<HTMLDivElement | null>;
  preferredJobCategoryRef: RefObject<HTMLDivElement | null>;
  preferredWorkStyleRef: RefObject<HTMLDivElement | null>;
  updateFormData: (event: ChangeEvent<HTMLInputElement>) => void;
}

const preferredWorkStyleData = [
  {
    label: "土日休み",
    value: "土日休み",
  },
  {
    label: "完全週休2日制",
    value: "完全週休2日制",
  },
  {
    label: "年間休日120日以上",
    value: "年間休日120日以上",
  },
  {
    label: "残業なし",
    value: "残業なし",
  },
  {
    label: "リモート可",
    value: "リモート可",
  },
  {
    label: "副業可",
    value: "副業可",
  },
];

const preferredAnnualIncomeData = [
  {
    label: "200万円",
    value: "200万円",
  },
  {
    label: "300万円",
    value: "300万円",
  },
  {
    label: "400万円",
    value: "400万円",
  },
  {
    label: "500万円",
    value: "500万円",
  },
  {
    label: "600万円",
    value: "600万円",
  },
  {
    label: "700万円<br />以上",
    value: "700万円以上",
  },
];

const preferredJobCategoryData = [
  {
    label: "営業",
    value: "営業",
    alt: "",
    src: "/db_desired-job-category-1_img.png",
  },
  {
    label: "マーケティング・広報",
    value: "マーケティング・広報",
    alt: "",
    src: "/db_desired-job-category-2_img.png",
  },
  {
    label: "ITエンジニア",
    value: "ITエンジニア",
    alt: "",
    src: "/db_desired-job-category-3_img.png",
  },
  {
    label: "デザイナー・クリエイター",
    value: "デザイナー・クリエイター",
    alt: "",
    src: "/db_desired-job-category-4_img.png",
  },
  {
    label: "事務",
    value: "事務",
    alt: "",
    src: "/db_desired-job-category-5_img.png",
  },
  {
    label: "人事・採用",
    value: "人事・採用",
    alt: "",
    src: "/db_desired-job-category-6_img.png",
  },
  {
    label: "サービス・販売",
    value: "サービス・販売",
    alt: "",
    src: "/db_desired-job-category-7_img.png",
  },
  {
    label: "その他",
    value: "その他",
    alt: "",
    src: "/db_desired-job-category-8_img.png",
  },
];

export function Condition({
  preferredAnnualIncomeRef,
  preferredJobCategoryRef,
  preferredWorkStyleRef,
  updateFormData,
}: Props) {
  return (
    <section className="relative grow">
      <div className="absolute inset-y-0 w-full overflow-y-scroll">
        <MaxWidth>
          <Container width="90">
            <div className="flex flex-col gap-y-4">
              <StepTitle step={1} title="希望条件" />
              <Radio
                columns={2}
                label="理想の働き方"
                name="preferred_work_style"
                onChange={updateFormData}
                radioData={preferredWorkStyleData}
                ref={preferredWorkStyleRef}
                required={true}
              />
              <Radio
                columns={3}
                label="希望年収"
                name="preferred_annual_income"
                onChange={updateFormData}
                radioData={preferredAnnualIncomeData}
                ref={preferredAnnualIncomeRef}
                required={true}
              />
              <Radio
                columns={2}
                label="希望職種"
                name="preferred_job_category"
                onChange={updateFormData}
                radioData={preferredJobCategoryData}
                ref={preferredJobCategoryRef}
                required={true}
              />
            </div>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
