import { type Metadata } from "next";

import { ResultPage } from "@/app/deaeru/lp04e/[id]/result/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "診断結果 | 転職サービス診断";
  const description =
    "あなたに合った転職サービスの診断結果です。";
  const canonicalPath = `/deaeru/lp04e/${id}/result`;

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

export default async function LP04eResultDeaeru({ params }: Props) {
  const { id } = await params;

  return <ResultPage id={id} />;
}
