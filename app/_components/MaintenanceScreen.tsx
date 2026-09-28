interface Props {
  title?: string;
}

export function MaintenanceScreen({
  title = "現在メンテナンス中です",
}: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-gray-500"
            aria-hidden="true"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          ご利用の皆さまには大変ご迷惑をおかけしておりますが、
          <br />
          メンテナンス完了まで今しばらくお待ちください。
        </p>
      </div>
    </main>
  );
}
