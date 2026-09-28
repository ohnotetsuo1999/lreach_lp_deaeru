import { type Metadata } from "next";

import { Page } from "./_components/Page";
import "./lp94c.css";
import "@/app/deaeru/_shared/ogata/ogata-form.css";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "パープル企業｜出会えるエージェント";
  const description =
    "20代限定。あなたに合うパープル企業を紹介する、出会えるエージェントのご案内です。";
  const canonicalPath = `/deaeru/lp94c/${id}`;

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

export default async function LP94cDeaeru({ params }: Props) {
  const { id } = await params;

  return <Page id={id} />;
}
