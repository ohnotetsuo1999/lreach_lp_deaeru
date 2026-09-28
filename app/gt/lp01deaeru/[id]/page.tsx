import { type Metadata } from "next";

import { Page } from "@/app/gt/lp01deaeru/[id]/_components";

export const metadata: Metadata = {
  title: "出会えるエージェント診断",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LP01Deaeru({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
