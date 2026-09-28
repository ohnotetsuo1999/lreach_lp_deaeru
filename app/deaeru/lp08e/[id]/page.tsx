import { type Metadata } from "next";

import { LineDirectIntro } from "../../_shared/LineDirectIntro";
import { getMailLiffCtaUrl } from "@/lib/mail/deaeru-direct-liff-cta";
import { parseMailTrackingPathId } from "@/lib/mail/parse-tracking-id";
import { recordMailEventOnce } from "@/lib/mail/record-mail-event";

const LP_KEY = "deaeru-lp08e";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "出会えるエージェント診断";
  const description =
    "あなたの希望条件に合った転職エージェントを診断し、相性の良いキャリアアドバイザーをご紹介します。";
  const canonicalPath = `/deaeru/lp08e/${id}`;

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

export default async function LP08eDeaeru({ params }: Props) {
  const { id } = await params;

  const mailTracking = parseMailTrackingPathId(id);
  if (mailTracking) {
    try {
      await recordMailEventOnce({
        campaignId: mailTracking.campaignId,
        uid: mailTracking.uid,
        type: "click",
      });
    } catch (err) {
      console.error("[lp08e] mail click tracking failed:", err);
    }
  }

  return (
    <LineDirectIntro
      lpKey={LP_KEY}
      ctaUrl={getMailLiffCtaUrl()}
      id={id}
      mailTracking={mailTracking}
      conditionPopup
    />
  );
}
