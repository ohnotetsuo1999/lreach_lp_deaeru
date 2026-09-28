import { Suspense } from "react";
import { type Metadata } from "next";

import { Page } from "@/app/deaeru/x01a/_components";

export function generateMetadata(): Metadata {
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = "/deaeru/x01a";

  return {
    alternates: { canonical: canonicalPath },
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

export default function DeaeruX01a() {
  return (
    <Suspense fallback={null}>
      <Page id="x01a" uuid="deaeru-x01a" />
    </Suspense>
  );
}
