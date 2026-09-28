import { type Metadata } from "next";

import { Page } from "@/app/gt/lp01g/[id]/_components";

export const metadata: Metadata = {
  title: "逆転転職エージェント診断",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LP01C({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
