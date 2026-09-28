import { type ChangeEvent, type RefObject, useCallback } from "react";

import { Container, MaxWidth } from "@/components/common";
import { Radio } from "@/app/deaeru/form01b/_components/form";
import { StepTitle } from "@/app/deaeru/form01b/_components/ui";

interface Props {
  stepTitleStep?: number;
  preferredWorkStyleRef: RefObject<HTMLDivElement | null>;
  preferredAnnualIncomeRef: RefObject<HTMLDivElement | null>;
  preferredJobCategoryRef: RefObject<HTMLDivElement | null>;
  jobChangeTimingRef: RefObject<HTMLDivElement | null>;
  jobChangeCountRef?: RefObject<HTMLDivElement | null>;
  jobChangeReasonRef?: RefObject<HTMLDivElement | null>;
  updateFormData: (event: ChangeEvent<HTMLInputElement>) => void;
  uniformButtonHeight?: boolean;
  // true の場合、転職回数・転職理由 を非表示にする（lp99cb 等の4項目構成用）
  hideJobChangeOptional?: boolean;
}

const preferredWorkStyleData = [
  { label: "土日休み", value: "土日休み" },
  { label: "完全週休2日制", value: "完全週休2日制" },
  { label: "年間休日120日以上", value: "年間休日120日以上" },
  { label: "残業なし", value: "残業なし" },
  { label: "ワークライフバランス", value: "ワークライフバランス" },
  { label: "裁量権", value: "裁量権" },
];

const preferredAnnualIncomeData = [
  { label: "200万円", value: "200万円" },
  { label: "300万円", value: "300万円" },
  { label: "400万円", value: "400万円" },
  { label: "500万円", value: "500万円" },
  { label: "600万円", value: "600万円" },
  { label: "700万円<br />以上", value: "700万円以上" },
];

const preferredJobCategoryData = [
  { label: "営業", value: "営業", alt: "", src: "/db_desired-job-category-1_img.png" },
  { label: "マーケティング・広報", value: "マーケティング・広報", alt: "", src: "/db_desired-job-category-2_img.png" },
  { label: "ITエンジニア", value: "ITエンジニア", alt: "", src: "/db_desired-job-category-3_img.png" },
  { label: "デザイナー・クリエイター", value: "デザイナー・クリエイター", alt: "", src: "/db_desired-job-category-4_img.png" },
  { label: "事務", value: "事務", alt: "", src: "/db_desired-job-category-5_img.png" },
  { label: "人事・採用", value: "人事・採用", alt: "", src: "/db_desired-job-category-6_img.png" },
  { label: "サービス・販売", value: "サービス・販売", alt: "", src: "/db_desired-job-category-7_img.png" },
  { label: "その他", value: "その他", alt: "", src: "/db_desired-job-category-8_img.png" },
];

const jobChangeTimingData = [
  { label: "今すぐに", value: "今すぐに" },
  { label: "3ヶ月以内", value: "3ヶ月以内" },
  { label: "6ヶ月以内", value: "6ヶ月以内" },
  { label: "1年以内", value: "1年以内" },
];

const jobChangeCountData = [
  { label: "初めて", value: "初めて" },
  { label: "1回", value: "1回" },
  { label: "2回以上", value: "2回以上" },
  { label: "正社員経験なし", value: "正社員経験なし" },
];

const jobChangeReasonData = [
  { label: "キャリアチェンジしたい", value: "キャリアチェンジしたい" },
  { label: "年収を上げたい", value: "年収を上げたい" },
  { label: "市場価値を上げたい", value: "市場価値を上げたい" },
  { label: "将来が不安", value: "将来が不安" },
  { label: "人間関係", value: "人間関係" },
  { label: "その他", value: "その他" },
];

export function JobChangeInfo({
  stepTitleStep = 2,
  preferredWorkStyleRef,
  preferredAnnualIncomeRef,
  preferredJobCategoryRef,
  jobChangeTimingRef,
  jobChangeCountRef,
  jobChangeReasonRef,
  updateFormData,
  uniformButtonHeight = false,
  hideJobChangeOptional = false,
}: Props) {
  const scrollToNext = useCallback((ref: RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, []);

  const handleChangeAndScroll = useCallback(
    (nextRef: RefObject<HTMLDivElement | null>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData(event);
        scrollToNext(nextRef);
      },
    [updateFormData, scrollToNext]
  );

  return (
    <section className="relative grow bg-gray-50">
      <div className="absolute inset-y-0 w-full overflow-y-scroll overscroll-y-contain">
        <MaxWidth>
          <Container width="90">
            <div className="flex flex-col gap-y-5 pb-6">
              <StepTitle step={stepTitleStep} title="希望条件・転職について" />
              <Radio
                columns={2}
                label="理想の働き方"
                name="preferred_work_style"
                onChange={handleChangeAndScroll(preferredAnnualIncomeRef)}
                radioData={preferredWorkStyleData}
                ref={preferredWorkStyleRef}
                required={true}
                equalHeight={uniformButtonHeight}
              />
              <Radio
                columns={3}
                label="希望年収"
                name="preferred_annual_income"
                onChange={handleChangeAndScroll(preferredJobCategoryRef)}
                radioData={preferredAnnualIncomeData}
                ref={preferredAnnualIncomeRef}
                required={true}
                equalHeight={uniformButtonHeight}
              />
              <Radio
                columns={2}
                label="希望職種"
                name="preferred_job_category"
                onChange={handleChangeAndScroll(jobChangeTimingRef)}
                radioData={preferredJobCategoryData}
                ref={preferredJobCategoryRef}
                required={true}
              />
              <Radio
                columns={2}
                label="転職希望時期"
                name="job_change_timing"
                onChange={
                  hideJobChangeOptional || !jobChangeCountRef
                    ? updateFormData
                    : handleChangeAndScroll(jobChangeCountRef)
                }
                radioData={jobChangeTimingData}
                ref={jobChangeTimingRef}
                required={true}
                equalHeight={uniformButtonHeight}
              />
              {!hideJobChangeOptional && jobChangeCountRef && jobChangeReasonRef && (
                <>
                  <Radio
                    columns={2}
                    label="転職回数を選択してください"
                    name="job_change_count"
                    onChange={handleChangeAndScroll(jobChangeReasonRef)}
                    radioData={jobChangeCountData}
                    ref={jobChangeCountRef}
                    required={true}
                    equalHeight={uniformButtonHeight}
                  />
                  <Radio
                    columns={2}
                    label="転職理由"
                    name="job_change_reason"
                    onChange={updateFormData}
                    radioData={jobChangeReasonData}
                    ref={jobChangeReasonRef}
                    required={true}
                    equalHeight={uniformButtonHeight}
                  />
                </>
              )}
            </div>
            <p className="mx-auto w-fit text-left text-xs text-gray-600 pb-8">
              下記ボタンを押すことで、
              <br />
              ・
              <a
                className="text-green-600 underline font-medium"
                href="https://brick-snowdrop-428.notion.site/38058c60cd41800fa87ff4b9ccb68f94"
                target="_blank"
              >
                利用規約
              </a>
              および
              <a
                className="text-green-600 underline font-medium"
                href="https://brick-snowdrop-428.notion.site/38058c60cd418093a226ebdb6656acec"
                target="_blank"
              >
                プライバシーポリシー
              </a>
              <br />
              ・現在、業務遂行に支障となる健康問題がなく、<span className="text-red-500">通院中ではない</span>
              <br />
              ・<span className="text-red-500">現在学生の方、および時短勤務希望ではない。</span>
              <br />
              上記に同意したものとみなします
            </p>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
