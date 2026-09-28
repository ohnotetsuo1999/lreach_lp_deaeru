import { Metadata } from "next";

import { Main } from "@/app/ih/form01a/[id]/_components";

export const metadata: Metadata = {
  title: "一戸不動産 診断結果受け取りフォーム",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Form01A({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <header></header>
      <Main id={id} />
      <footer></footer>
    </>
  );
}
