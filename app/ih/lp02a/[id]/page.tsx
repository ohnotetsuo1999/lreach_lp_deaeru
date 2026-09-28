import { type Metadata } from "next";
import Script from "next/script";

import {
  AddLine,
  IchinoneLineClickWatcher,
} from "@/app/ih/lp02a/[id]/_components";

export const metadata: Metadata = {
  title: "ICHINOHE HOME",
};

export default function LP02A() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17675949884"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17675949884');
        `}
      </Script>
      <IchinoneLineClickWatcher />
      <header></header>
      <main>
        <AddLine />
      </main>
      <footer></footer>
    </>
  );
}
