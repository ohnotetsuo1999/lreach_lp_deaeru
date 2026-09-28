import classNames from "classnames";

type Props = {
  isLoading: boolean;
};

export function LoadingModal({ isLoading }: Props) {
  const overlayClass = classNames(
    "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out",
    {
      "pointer-events-auto bg-black/60 opacity-100": isLoading,
      "pointer-events-none opacity-0": !isLoading,
    }
  );

  return (
    <div className={overlayClass}>
      <div className="mx-4 max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-y-6">
          {/* Loading Spinner */}
          <div className="relative size-16">
            <span className="absolute left-0 top-0 size-full rounded-full border-4 border-orange-100" />
            <span className="absolute left-0 top-0 size-full animate-spin rounded-full border-4 border-[rgb(219,60,0)] border-t-transparent" />
          </div>

          {/* Title */}
          <h3 className="text-center text-xl font-bold text-[rgb(219,60,0)]">
            診断中
          </h3>

          {/* Message */}
          <p className="text-center text-sm leading-relaxed text-gray-600">
            診断後LINEで
            <br />
            診断結果を受け取れます！
          </p>
        </div>
      </div>
    </div>
  );
}
