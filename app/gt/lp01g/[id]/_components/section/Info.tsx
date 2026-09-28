import { type RefObject, type SyntheticEvent } from "react";

import { Container, MaxWidth } from "@/components/common";
import { Gender, Input, Select } from "@/app/gt/lp01c/[id]/_components/form";
import { StepTitle } from "@/app/gt/lp01c/[id]/_components/ui";
import { FormData } from "@/app/gt/lp01c/[id]/_types/form-data";

interface Props {
  birthYearRef: RefObject<HTMLDivElement | null>;
  formData: FormData;
  fullNameRef: RefObject<HTMLDivElement | null>;
  genderRef: RefObject<HTMLDivElement | null>;
  phoneNumberRef: RefObject<HTMLDivElement | null>;
  preferredWorkLocationRef: RefObject<HTMLDivElement | null>;
  updateFormData: (
    event: SyntheticEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function Info({
  birthYearRef,
  formData,
  fullNameRef,
  genderRef,
  phoneNumberRef,
  preferredWorkLocationRef,
  updateFormData,
}: Props) {
  return (
    <section className="relative grow">
      <div className="absolute inset-y-0 w-full overflow-y-scroll">
        <MaxWidth>
          <Container width="90">
            <div className="mb-4 flex flex-col gap-y-4">
              <StepTitle step={2} title="基本情報" />
              <Input
                label="お名前"
                name="full_name"
                onBlur={updateFormData}
                ref={fullNameRef}
                type="text"
                placeholder="山田太郎"
                required={true}
              />
              <Gender
                onChange={updateFormData}
                ref={genderRef}
                value={formData.gender}
              />
              <Input
                label="生まれ年"
                name="birth_year"
                onBlur={updateFormData}
                ref={birthYearRef}
                type="text"
                inputMode="numeric"
                maxLength={4}
                pattern="\d{4}"
                placeholder="2000"
                required={true}
              />
              <Select
                label="希望勤務地(複数選択可)"
                name="preferred_work_location"
                onBlur={updateFormData}
                optionData={[
                  "北海道",
                  "青森県",
                  "岩手県",
                  "宮城県",
                  "秋田県",
                  "山形県",
                  "福島県",
                  "茨城県",
                  "栃木県",
                  "群馬県",
                  "埼玉県",
                  "千葉県",
                  "東京都",
                  "神奈川県",
                  "新潟県",
                  "富山県",
                  "石川県",
                  "福井県",
                  "山梨県",
                  "長野県",
                  "岐阜県",
                  "静岡県",
                  "愛知県",
                  "三重県",
                  "滋賀県",
                  "京都府",
                  "大阪府",
                  "兵庫県",
                  "奈良県",
                  "和歌山県",
                  "鳥取県",
                  "島根県",
                  "岡山県",
                  "広島県",
                  "山口県",
                  "徳島県",
                  "香川県",
                  "愛媛県",
                  "高知県",
                  "福岡県",
                  "佐賀県",
                  "長崎県",
                  "熊本県",
                  "大分県",
                  "宮崎県",
                  "鹿児島県",
                  "沖縄県",
                ]}
                multiple={true}
                ref={preferredWorkLocationRef}
                value={formData.preferred_work_location}
                required={true}
                size={4}
              />
              <Input
                label="電話番号"
                maxLength={11}
                name="phone_number"
                onBlur={updateFormData}
                ref={phoneNumberRef}
                type="tel"
                pattern="(070|080|090)\d{8}$"
                placeholder="08012345678"
                required={true}
              />
            </div>
            <p className="text-center text-2xs">
              「LINEで診断結果を受け取る」ボタンをタップすると
              <br />
              <a
                className="text-blue-500 underline"
                href="https://brick-snowdrop-428.notion.site/1f858c60cd4180c5b875da7670ab0bfd"
                target="_blank"
              >
                プライバシーポリシー
              </a>
              に同意したものとします。
            </p>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
