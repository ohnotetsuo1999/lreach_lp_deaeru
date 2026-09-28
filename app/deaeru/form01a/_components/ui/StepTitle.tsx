import { Container, Inner, MaxWidth } from "@/components/common";

type Props = {
  step: number;
  title: string;
};

export function StepTitle({ step, title }: Props) {
  return (
    <div className="relative">
      <MaxWidth>
        <Container width="90">
          <Inner className="bg-gradient-to-r from-green-500 to-green-400">
            <div className="flex items-center gap-x-3 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                <span className="text-lg font-bold text-green-600">
                  {step}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
          </Inner>
        </Container>
      </MaxWidth>
    </div>
  );
}
