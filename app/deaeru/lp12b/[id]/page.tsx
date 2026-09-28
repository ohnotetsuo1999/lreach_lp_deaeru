import { type Metadata } from "next";

import { NursingLpPage } from "@/app/deaeru/lp12b/[id]/_components";

// lp12b: 看護師向けインハウスLP。設定（LP_KEY・画像・CTA座標）と Intro/フォームの切替は
// _components/NursingLpPage.tsx に集約（2026-09-17: /form 別ページ遷移 → 同一URL内切替に変更）。

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント看護";
  const description =
    "あなたの希望条件に合った看護師転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp12b/${id}`;

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

export default async function LP12bDeaeru({ params }: Props) {
  const { id } = await params;

  return <NursingLpPage id={id} />;
}
