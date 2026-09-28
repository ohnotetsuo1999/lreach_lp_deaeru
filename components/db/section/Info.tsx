import { ChangeEvent } from "react";

import { Container, MaxWidth } from "@/components/common";
import { Input } from "@/components/db/form";
import { StepTitle } from "@/components/db/title";

type Props = {
  addressData: {
    prefecture: string;
    city: string;
    town: string;
  } | null;
  formData: { [key: string]: number | string | string[] | null };
  questionData: string[];
  updateFormData: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Info({
  addressData,
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
              <StepTitle step={2} title="基本情報" />
              <Input
                label={questionData[3]}
                name="name"
                onChange={updateFormData}
                placeholder="山田太郎"
                required={true}
                type="text"
                value={formData.name as string}
              />
              <Input
                label={questionData[4]}
                name="birthday"
                onChange={updateFormData}
                required={true}
                type="date"
                value={formData.birthday as string}
              />
              <Input
                addressData={addressData}
                inputMode="numeric"
                label={questionData[5]}
                maxLength={7}
                name="zip_code"
                onChange={updateFormData}
                placeholder="1234567"
                required={true}
                type="text"
                value={formData.zip_code as string}
              />
              <Input
                label={questionData[7]}
                maxLength={11}
                name="phone_number"
                onChange={updateFormData}
                placeholder="08012345678"
                required={true}
                type="tel"
                value={formData.phone_number as string}
              />
            </div>
          </Container>
        </MaxWidth>
      </div>
    </section>
  );
}
