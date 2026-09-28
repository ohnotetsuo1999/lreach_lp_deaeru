"use client";

/*
 * lp93b（緒方ASP・lp93a のパープル版）
 * - 訴求画面: ./section/Intro（パープル画像＋3STEPセクション）
 * - フォーム: 共通部品 OgataEntryForm（先方支給 register.html 移植・テーマ紫）
 * - 配管: 共通フック useOgataLpPipeline（DB保存 / Slack「緒方」/ 行動集計 / thanks 遷移）
 * - X: LINE遷移ボタン押下で fireOgataXLineButtonClick（rcrx1 / re13a / rexm9・本番ドメイン限定・1回）
 */

import { LoadingModal } from "@/app/deaeru/form01a/_components/ui";
import { OgataEntryForm } from "@/app/deaeru/_shared/ogata/OgataEntryForm";
import { useOgataLpPipeline } from "@/app/deaeru/_shared/ogata/useOgataLpPipeline";
import {
  OgataXPixelScript,
  fireOgataXLineButtonClick,
} from "@/app/deaeru/_shared/ogata/ogataXTags";
import { Intro } from "@/app/deaeru/lp93b/[id]/_components/section";

interface Props {
  id: string;
  uuid?: string;
}

const LP_CODE = "lp93b";

export function Page({ id, uuid }: Props) {
  const {
    isIntroVisible,
    isSubmitting,
    showForm,
    showIntro,
    submit,
    setFormDataForBeacon,
    redirectUrl,
    linkRef,
  } = useOgataLpPipeline({ lpCode: LP_CODE, id, uuid });

  /* X (Twitter) - 緒方ASP向け共通部品。Intro / フォームのどちらでもマウントし続ける（保留クリックイベントの消費のため）。
     base＋config（rcrwm / re139 / rexm3）＋本LP表示イベント（re13b / rexm4）。本番ドメイン限定 */
  const xPixel = <OgataXPixelScript page="lp" />;

  if (isIntroVisible) {
    return (
      <>
        {xPixel}
        <Intro onCtaClick={showForm} />
      </>
    );
  }

  return (
    <>
      {xPixel}
      <OgataEntryForm
        theme="purple"
        lpCode={LP_CODE}
        isSubmitting={isSubmitting}
        onFormDataChange={setFormDataForBeacon}
        onSubmit={submit}
        onLineButtonClick={fireOgataXLineButtonClick}
        onBrandClick={showIntro}
      />
      {/* thanks への遷移用（送信成功後に programmatically click） */}
      <a className="hidden" href={redirectUrl} ref={linkRef} />
      <LoadingModal isLoading={isSubmitting} />
    </>
  );
}
