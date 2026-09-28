import { type Metadata } from "next";

import { Main } from "@/app/ht/lp01a/[id]/_components";

export const metadata: Metadata = {
  title: "株式会社貴瞬　中途採用エントリーフォーム",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LP01A({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <header></header>
      <Main id={id} />
      <footer></footer>
    </>
  );
}
