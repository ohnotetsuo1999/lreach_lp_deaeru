import { type Metadata } from "next";

import { ResultPage } from "@/app/deaeru/lp04b/[id]/result/_components";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "診断結果 | 転職サイト診断";
  const description =
    "あなたに合った転職サイトの診断結果です。";
  const canonicalPath = `/deaeru/lp04b/${id}/result`;

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

export default async function LP04bResultDeaeru({ params }: Props) {
  const { id } = await params;

  return <ResultPage id={id} />;
}
