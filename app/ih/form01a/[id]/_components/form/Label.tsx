import { Box } from "@/app/ih/form01a/[id]/_components/form/Box";

interface Props {
  label: string;
  subLabel?: string;
}

export function Label({ label, subLabel }: Props) {
  return (
    <div className="relative pb-3 mb-5 font-zen-maru-gothic font-bold text-[rgb(183,130,64)] text-center border-b border-[rgb(183,130,64)] border-dashed">
      {subLabel && <span className="block text-[13px]">{subLabel}</span>}
      <label
        className="text-[15px]"
        dangerouslySetInnerHTML={{ __html: label }}
      />
    </div>
  );
}
