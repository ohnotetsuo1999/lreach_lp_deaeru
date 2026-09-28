import { type Metadata } from "next";

import { Page } from "@/app/deaeru/lp04b/[id]/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "失敗しないサイト選びの法則｜転職サイト診断";
  const description =
    "年齢・地域・職種の3つを基本に、あなたに合った転職サイトを診断します。";
  const canonicalPath = `/deaeru/lp04b/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "website",
      siteName: "転職サイト診断",
      url: canonicalPath,
      title,
      description,
    },
    title,
  };
}

export default async function LP04bDeaeru({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
