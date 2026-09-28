import { type Metadata } from "next";
import { getAgeFromBirthYear } from "@/utils";

import { Lp3Answer } from "@/types/lp3-answers";
import { sendPushToUser } from "@/lib/line/services";
import { onAction } from "@/lib/line/templates/gt/lp01a/2025-10-15";
import { createClient } from "@/lib/supabase/client";
import { Page } from "@/app/gt/lp01a/[id]/_components";

type sendLineNotificationParams = {
  lineUserId: string;
  lp3AnswerData: Lp3Answer;
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lineUserId?: string; lp3AnswersId?: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "逆転転職エージェント診断",
};

/* lp3_answersのデータを取得 */
async function getLp3AnswersData(
  lp3AnswersId: string
): Promise<Lp3Answer | null> {
  const { data, error } = await createClient()
    .from("lp3_answers")
    .select("*")
    .eq("id", lp3AnswersId)
    .single();

  if (!data || error) {
    console.error("lp3_answersのデータ取得に失敗しました。");
    return null;
  }

  return data;
}

/* LINEに通知を送信 */
async function sendLineNotification({
  lineUserId,
  lp3AnswerData,
}: sendLineNotificationParams): Promise<void> {
  await sendPushToUser({
    messages: onAction(lp3AnswerData.answer_1),
    userId: lineUserId,
  });
}

/* Slackに通知を送信 */
async function sendSlackNotification(lp3AnswerData: Lp3Answer): Promise<void> {
  try {
    const { answer_1, answer_2, answer_3, answer_4, answer_5 } = lp3AnswerData;

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slack/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "C09KBLBKR08",
        text: [
          "【逆転転職_20251015一斉配信_LINEシナリオがタップされました】※架電依頼※",
          `名前：${answer_1}`,
          `年齢（推定）：${getAgeFromBirthYear(Number(answer_2))}`,
          `郵便番号：${answer_3}`,
          `住所：${answer_4}`,
          `電話番号：${answer_5}`,
        ].join("\n"),
      }),
    });
  } catch (error) {
    console.error("Slack通知送信中にエラーが発生しました！");
  }
}

export default async function LP01A({ params, searchParams }: Props) {
  const { id } = await params;
  const { lineUserId, lp3AnswersId } = await searchParams;

  if (id === "20251015") {
    if (lineUserId && lp3AnswersId) {
      const lp3AnswerData = await getLp3AnswersData(lp3AnswersId);

      if (lp3AnswerData) {
        Promise.all([
          sendLineNotification({ lineUserId, lp3AnswerData }),
          sendSlackNotification(lp3AnswerData),
        ]);
      }
    }
  }

  return <Page id={id} />;
}
