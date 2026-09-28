import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { ServicePage } from "@/app/_components/service/ServicePage";
import { parseServicePageParam } from "@/app/_components/service/service-inflow";

const LP_COMPONENTS: Record<string, () => Promise<{ Page: React.ComponentType<{ id: string; uuid?: string }> }>> = {
  "gt/lp01a": () => import("@/app/gt/lp01a/[id]/_components"),
  "gt/lp01b": () => import("@/app/gt/lp01b/[id]/_components"),
  "gt/lp01c": () => import("@/app/gt/lp01c/[id]/_components"),
  "gt/lp01d": () => import("@/app/gt/lp01d/[id]/_components"),
  "gt/lp01e": () => import("@/app/gt/lp01e/[id]/_components"),
  "gt/lp01f": () => import("@/app/gt/lp01f/[id]/_components"),
  "gt/lp01g": () => import("@/app/gt/lp01g/[id]/_components"),
  "gt/lp01h": () => import("@/app/gt/lp01h/[id]/_components"),
  "gt/lp01i": () => import("@/app/gt/lp01i/[id]/_components"),
  "gt/lp01j": () => import("@/app/gt/lp01j/[id]/_components"),
  "gt/lp01k": () => import("@/app/gt/lp01k/[id]/_components"),
  "gt/lp01l": () => import("@/app/gt/lp01l/[id]/_components"),
  "gt/lp01m": () => import("@/app/gt/lp01m/[id]/_components"),
  "gt/lp01n": () => import("@/app/gt/lp01n/[id]/_components"),
  "gt/lp01deaeru": () => import("@/app/gt/lp01deaeru/[id]/_components"),
  "gt/lp01srcw": () => import("@/app/gt/lp01srcw/[id]/_components"),
  "deaeru/lp01a": () => import("@/app/deaeru/lp01a/[id]/_components"),
  "deaeru/lp01b": () => import("@/app/deaeru/lp01b/[id]/_components"),
  "deaeru/lp99b": () => import("@/app/deaeru/lp99b/[id]/_components"),
};

interface Props {
  params: Promise<{ uuid: string }>;
}

/**
 * サービスページの流入パラメータ（/note-001/ 等）はこのルートで受ける（2026-09-18）。
 * 検索エンジンには番号なしの https://deaeru-agent.jp/ を正とする。
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  if (!parseServicePageParam(uuid)) return {};
  const title = "出会えるエージェント｜あなたに合う転職エージェント3社を厳選紹介";
  const description =
    "3万社以上の転職エージェント会社から、あなたの希望に合う3社を厳選してご紹介。15分のオンライン相談で始められる完全無料のサービスです。";
  return {
    alternates: { canonical: "https://deaeru-agent.jp/" },
    description,
    openGraph: {
      type: "website",
      siteName: "出会えるエージェント",
      url: "https://deaeru-agent.jp/",
      title,
      description,
    },
    title,
  };
}

export default async function UuidPage({ params }: Props) {
  const { uuid } = await params;

  // 記事サイトからの流入（/<媒体>-<番号>/ 例: /note-001/、または番号だけの /001/）はサービスページを表示し、番号を流入 id として引き継ぐ
  const serviceInflow = parseServicePageParam(uuid);
  if (serviceInflow) {
    return <ServicePage inflow={serviceInflow} />;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("link_meta")
      .select("lp_type, lp_code, lp_group")
      .eq("id", uuid)
      .eq("is_active", true)
      .single();

    if (error || !data) return notFound();

    const key = `${data.lp_group}/${data.lp_type}`;
    const loader = LP_COMPONENTS[key];
    if (!loader) return notFound();

    const mod = await loader();
    const LpComponent = mod.Page;
    return <LpComponent id={data.lp_code ?? uuid} uuid={uuid} />;
  } catch {
    return notFound();
  }
}
