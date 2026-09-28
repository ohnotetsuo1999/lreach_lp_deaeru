import { Inner } from "@/components/common";

type Props = {
  step: number;
  title: string;
};

export function StepTitle({ step, title }: Props) {
  return (
    <div className="relative">
      <Inner>
        <div className="flex items-center gap-x-4">
          <p className="text-xs font-semibold text-green-500 ">STEP {step}</p>
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
      </Inner>
    </div>
  );
}
