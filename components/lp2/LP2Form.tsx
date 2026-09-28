import { ChangeEvent, FormEvent } from "react";
import {
  Briefcase,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Clock,
  Hourglass,
} from "lucide-react";

import { MaxWidth } from "@/components/common";
import { Input, Radio, Submit } from "@/components/lp2/form";

type Props = {
  formData: { [key: string]: string };
  isSubmitting: boolean;
  questionData: string[];
  submit: (event: FormEvent<HTMLFormElement>) => void;
  updateData: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function LP2Form({
  formData,
  isSubmitting,
  questionData,
  submit,
  updateData,
}: Props) {
  return (
    <section className="relative">
      <MaxWidth>
        <form className="flex flex-col gap-y-8" onSubmit={submit}>
          <div className="flex flex-col gap-y-4">
            <Radio
              label={questionData[0]}
              name="status"
              onChange={updateData}
              radioData={[
                {
                  icon: Briefcase,
                  value: "在職中",
                },
                {
                  icon: Hourglass,
                  value: "離職中",
                },
              ]}
              required={true}
            />
            <Radio
              label={questionData[1]}
              name="desired_time"
              onChange={updateData}
              radioData={[
                {
                  icon: CalendarClock,
                  value: "3ヶ月以内",
                },
                {
                  icon: CalendarDays,
                  value: "半年以内",
                },
                {
                  icon: CalendarRange,
                  value: "1年以内",
                },
                {
                  icon: Clock,
                  value: "良い機会があれば",
                },
              ]}
              required={true}
            />
            <Input
              inputMode="tel"
              label={questionData[2]}
              maxLength={11}
              name="phone_number"
              onChange={updateData}
              placeholder="08012345678"
              required={true}
              type="tel"
              value={formData.tel}
            />
          </div>
          <Submit isSubmitting={isSubmitting} />
        </form>
      </MaxWidth>
    </section>
  );
}
