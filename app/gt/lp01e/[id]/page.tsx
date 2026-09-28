import { type Metadata } from "next";

import { Page } from "@/app/gt/lp01e/[id]/_components";

const TITLE = "逆転転職｜20代なら、まだ逆転できる";
const DESCRIPTION =
  "希望条件を選択するだけで自分にピッタリの転職エージェントとマッチング！理想の転職先が簡単に見つかる！";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LP01C({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
