import { type Metadata } from "next";

import { Page } from "./_components";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp99do/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "website",
      siteName: "出会えるエージェント",
      url: canonicalPath,
      title,
      description,
    },
    title,
  };
}

export default async function LP99doDeaeru({ params }: Props) {
  const { id } = await params;

  // BPX 依頼「1ページ目なし・設問2ページ構成」: lp02 系の /ws と同じく Intro を出さず設問から始める。
  // lp02 系は id==="ws" のときだけ Intro を飛ばすが、本LPは全ての id で飛ばす（想定リンク /test/ でも設問から）。
  return <Page id={id} skipIntro />;
}
