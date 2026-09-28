import { type Metadata } from "next";

import { Main } from "@/app/ht/lp02a/[id]/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "株式会社HRteam　中途採用エントリーフォーム",
};

export default async function LP02A({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <header></header>
      <Main id={id} />
      <footer></footer>
    </>
  );
}
