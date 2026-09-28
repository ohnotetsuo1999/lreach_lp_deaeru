type Props = {
  htmlFor?: string;
  label: string;
  required: boolean;
};

export function Label({ htmlFor, label, required }: Props) {
  return (
    <label
      className="relative mb-2 flex items-center gap-x-2 text-base font-semibold text-gray-900"
      htmlFor={htmlFor}
    >
      {label}
      {required ? (
        <span className="rounded-sm bg-red-500 px-2 py-0.5 text-xs text-white">
          必須
        </span>
      ) : (
        ""
      )}
    </label>
  );
}
