import { type Metadata } from "next";

import { Main } from "@/app/ht/lp02a/thanks/[id]/_components";

export const metadata: Metadata = {
  title: "株式会社HRteam　中途採用エントリーフォーム　送信完了",
};

export default function Thanks() {
  return (
    <>
      <header></header>
      <Main />
      <footer></footer>
    </>
  );
}
