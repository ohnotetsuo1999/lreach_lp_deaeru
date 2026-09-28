import classNames from "classnames";

type Props = {
  loading: boolean;
};

export function Loading({ loading }: Props) {
  const componentClass = classNames(
    "fixed inset-0 z-50 flex flex-col items-center justify-center duration-300 ease-in-out",
    {
      "pointer-events-auto bg-black/60 opacity-100": loading,
      "pointer-events-none opacity-0": !loading,
    }
  );

  return (
    <div className={componentClass}>
      <div className="relative mb-4 size-16">
        <span className="absolute left-0 top-0 size-full rounded-full border-4 border-green-100" />
        <span className="absolute left-0 top-0 size-full animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
      </div>
    </div>
  );
}
