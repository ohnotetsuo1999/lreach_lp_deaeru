import { ReactNode } from "react";

import { Container, MaxWidth } from "@/components/common";

type Props = {
  children: ReactNode;
};

export function Box({ children }: Props) {
  return (
    <div className="relative">
      <MaxWidth>
        <Container width="90">
          <div className="bg-white">{children}</div>
        </Container>
      </MaxWidth>
    </div>
  );
}
