import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "ご利用いただけません | 出会えるエージェント",
  robots: { index: false, follow: false },
};

export default function InvalidPhonePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-md">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
          <h1 className="text-center text-xl font-bold text-gray-800">
            不正なアクセスを検知しました
          </h1>
        </div>

        <p className="mb-2 text-center text-sm leading-relaxed text-gray-600">
          電話番号の入力に複数回失敗したため、
          <br />
          このページへのアクセスを制限しました。
        </p>
        <p className="text-center text-sm leading-relaxed text-gray-600">
          お心当たりのない方は、お手数ですが
          <br />
          時間をおいて再度お試しください。
        </p>
      </div>
    </div>
  );
}
