import { type Metadata } from "next";

import { DiagnosisLpPage } from "@/app/deaeru/lp14a/[id]/_components";

// lp14a: ワークライフ占い診断LP（インハウス）。
// 16問の診断 → 年齢・希望勤務地 → 結果は伏せて LINE 誘導（送客非対象者は LP 内で全開示）。
// 画面・判定・保存・LINE遷移の配線は _components/DiagnosisLpPage.tsx に集約。

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title =
    "ワークライフ占い診断｜あなたに向いている働き方を1分で診断 - 出会えるエージェント";
  const description =
    "全16問・約1分。あなたの性格・特徴から向いている働き方を5つのタイプで占います。完全無料。診断結果はLINEでお届けします。";
  const canonicalPath = `/deaeru/lp14a/${id}`;

  return {
    alternates: {
      canonical: canonicalPath,
    },
    description,
    openGraph: {
      type: "website",
      siteName: "出会えるエージェント",
      url: canonicalPath,
      title: "ワークライフ占い診断｜あなたに向いている働き方を1分で診断",
      description:
        "全16問・約1分。あなたの性格・特徴から向いている働き方を5つのタイプで占います。完全無料。",
      // OGP はタイプが特定できない FV 画像にする（支給版の guardian.jpg だと共有先で特定タイプの結果に見えてしまう）
      images: ["/deaeru-lp14a-fv.jpg"],
    },
    title,
    other: {
      "format-detection": "telephone=no",
      "theme-color": "#F3E3EC",
    },
  };
}

export default async function LP14aDeaeru({ params }: Props) {
  const { id } = await params;

  return <DiagnosisLpPage id={id} />;
}
