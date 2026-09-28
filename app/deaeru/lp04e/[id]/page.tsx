import { type Metadata } from "next";

import { Page } from "@/app/deaeru/lp04e/[id]/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "失敗しないサービス選びの法則｜転職サービス診断";
  const description =
    "年齢・地域・職種の3つを基本に、あなたに合った転職サービスを診断します。";
  const canonicalPath = `/deaeru/lp04e/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "website",
      siteName: "転職サービス診断",
      url: canonicalPath,
      title,
      description,
    },
    title,
  };
}

export default async function LP04eDeaeru({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
