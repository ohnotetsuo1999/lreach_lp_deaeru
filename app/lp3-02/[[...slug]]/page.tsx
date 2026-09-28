import { type Metadata } from "next";

import { Page } from "@/components/lp3";

export const metadata: Metadata = {
  title: "株式会社貴瞬　中途採用エントリーフォーム",
};

export default function LP3() {
  return (
    <Page
      button="LINEで求人情報を受け取る"
      companyName="株式会社貴瞬"
      headerAlt="業界トップ上場目前の安定した企業 未経験OKで高収入の環境で働きませんか？"
      headerSrc="/lp3_kishun_img.jpg"
      title="<span class='text-red-500 font-bold'>今月限定</span>求人情報をご覧になりたい方は<br />下記フォームをご入力ください。"
    />
  );
}
