import { type Metadata } from "next";

import { Page } from "./_components/Page";
import "./lp94b.css";
import "@/app/deaeru/_shared/ogata/ogata-form.css";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "非公開ホワイト求人｜出会えるエージェント";
  const description =
    "20代限定。あなたに合う非公開ホワイト求人を紹介する、出会えるエージェントのご案内です。";
  const canonicalPath = `/deaeru/lp94b/${id}`;

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

export default async function LP94bDeaeru({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
