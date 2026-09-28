import { Inner } from "@/components/common";

type Props = {
  step: number;
  title: string;
};

export function StepTitle({ step, title }: Props) {
  return (
    <div className="relative">
      <Inner className="bg-[rgb(255,138,46)]">
        <div className="flex items-center gap-x-4 text-white">
          <p className="text-xs font-semibold ">STEP {step}</p>
          <h2 className="text-base font-semibold">{title}</h2>
        </div>
      </Inner>
    </div>
  );
}
