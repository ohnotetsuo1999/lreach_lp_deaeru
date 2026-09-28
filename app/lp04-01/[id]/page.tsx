import { type Metadata } from "next";

import { Page } from "@/app/lp04-01/[id]/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "株式会社貴瞬　中途採用エントリーフォーム",
};

export default async function LP3({ params }: Props) {
  const { id } = await params;

  return (
    <Page
      button="今すぐエントリーする"
      companyName="株式会社貴瞬"
      headerAlt="業界トップ上場目前の安定した企業 未経験OKで高収入の環境で働きませんか？"
      headerSrc="/lp3_kishun_img.jpg"
      id={id}
      title="中途採用エントリーフォーム"
    />
  );
}
