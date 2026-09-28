import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-xl md:p-12">
          <p className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-1 text-sm font-bold text-red-600">
            404 NOT FOUND
          </p>
          <h1 className="mb-4 text-3xl font-black text-gray-900 md:text-4xl">
            不正検知されました
          </h1>
          <p className="mb-2 text-base font-medium text-gray-700">
            電話番号の入力エラー回数が上限に達したため、アクセスを制限しています。
          </p>
          <p className="mb-8 text-sm text-gray-500">
            入力内容を見直して、しばらく時間を空けてから再度お試しください。
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-400 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90"
            >
              トップページへ戻る
            </Link>
            <Link
              href="/gt/lp01deaeru/articles"
              className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100"
            >
              出会えるエージェント記事を見る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
