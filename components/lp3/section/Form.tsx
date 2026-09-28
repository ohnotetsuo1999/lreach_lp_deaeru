import { ChangeEvent, FormEvent, useMemo } from "react";
import Link from "next/link";

import { MaxWidth } from "@/components/common";
import { Input, Submit } from "@/components/lp3/form";

type Props = {
  addressData: {
    prefecture: string;
    city: string;
    town: string;
  } | null;
  button: string;
  formData: { [key: string]: string };
  isSubmitting: boolean;
  linkRef: React.RefObject<HTMLAnchorElement | null>;
  questionData: string[];
  redirectUrl: string;
  submit: (event: FormEvent<HTMLFormElement>) => void;
  updateData: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Form({
  addressData,
  button,
  formData,
  isSubmitting,
  linkRef,
  questionData,
  redirectUrl,
  submit,
  updateData,
}: Props) {
  const isFormValid = useMemo(() => {
    // NOTE:
    // - `address` は郵便番号APIの成功に依存して自動入力されるため、必須判定に含めると
    //   環境差（通信遮断/遅延等）で「ボタンを押しても遷移しない」状態になりやすい。
    // - 送信必須はユーザーが直接入力する項目のみとする。
    const requiredKeys = ["name", "birth_year", "zip_code", "phone_number"];
    return requiredKeys.every((k) => {
      const v = formData[k];
      return typeof v === "string" && v.trim() !== "";
    });
  }, [formData]);

  return (
    <section className="relative">
      <MaxWidth>
        <form className="flex flex-col gap-y-8" onSubmit={submit}>
          <Input
            label={questionData[0]}
            name="name"
            onChange={updateData}
            placeholder="山田太郎"
            required={true}
            type="text"
            value={formData.name}
          />
          <Input
            inputMode="numeric"
            label={questionData[1]}
            maxLength={4}
            name="birth_year"
            onChange={updateData}
            pattern="\d{4}"
            placeholder="2000"
            required={true}
            type="text"
            value={formData.birth_year}
          />
          <Input
            addressData={addressData}
            inputMode="numeric"
            label={questionData[2]}
            maxLength={7}
            name="zip_code"
            onChange={updateData}
            pattern="\d{7}"
            placeholder="1234567"
            required={true}
            type="text"
            value={formData.zip_code}
          />
          <Input
            inputMode="tel"
            label={questionData[4]}
            maxLength={11}
            name="phone_number"
            onChange={updateData}
            pattern="\d{11}"
            placeholder="08012345678"
            required={true}
            type="tel"
            value={formData.phone_number}
          />
          <Submit
            button={button}
            disabled={!isFormValid}
            isSubmitting={isSubmitting}
          />
          <p className="text-center text-2xs">
            「{button}」ボタンをタップすると
            <br />
            <Link
              className="text-blue-500 underline"
              href="https://brick-snowdrop-428.notion.site/1f858c60cd4180c5b875da7670ab0bfd"
              target="_blank"
            >
              プライバシーポリシー
            </Link>
            に同意したものとします。
          </p>
          <Link className="hidden" href={redirectUrl} ref={linkRef} />
        </form>
      </MaxWidth>
    </section>
  );
}
