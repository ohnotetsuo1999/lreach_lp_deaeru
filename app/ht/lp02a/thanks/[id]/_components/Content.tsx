import { Check } from "lucide-react";

import { Container, MaxWidth } from "@/components/common";

export function Content() {
  return (
    <section className="relative">
      <MaxWidth>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-700 to-blue-800">
          <Container width="90">
            <div className="flex flex-col items-center rounded-3xl bg-white px-4 py-8">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
                <Check className="size-1/2 text-white" />
              </div>
              <div className="mb-6 text-center">
                <h1 className="mb-1 text-xl font-bold">
                  ご応募ありがとうございます！
                </h1>
                <p className="text-gray-600">エントリーを受け付けました</p>
              </div>
              <div className="w-full rounded-2xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
                <p className="text-xs font-medium text-blue-900">
                  近日中に担当者よりお電話でご案内いたします。
                </p>
                <span className="my-2 block h-px w-full bg-blue-200" />
                <p className="text-2xs text-gray-600">
                  ※ご連絡まで少々お時間をいただく場合がございます。
                </p>
              </div>
            </div>
          </Container>
        </div>
      </MaxWidth>
    </section>
  );
}
