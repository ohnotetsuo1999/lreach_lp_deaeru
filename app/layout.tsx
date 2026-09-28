import "./globals.css";

import React from "react";
import { type Metadata, type Viewport } from "next";
import {
  Inter,
  Jomolhari,
  Noto_Sans_JP,
  Sofia_Sans_Extra_Condensed,
  Zen_Antique,
  Zen_Maru_Gothic,
} from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-inter",
});

const jomolhari = Jomolhari({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jomolhari",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const sofiaSansExtraCondensed = Sofia_Sans_Extra_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-sofia-sans-extra-condensed",
});

const zenAntique = Zen_Antique({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-zen-antique",
});

const zenMaruGothic = Zen_Maru_Gothic({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-zen-maru-gothic",
});

export const metadata: Metadata = {
  applicationName: "出会えるエージェント",
  metadataBase: new URL("https://deaeru-agent.jp"),
  description:
    "「出会えるエージェント」は、希望条件に合致した相性の良いキャリアアドバイザーや優良求人をご紹介する転職エージェントマッチングサービスです",
  title: "出会えるエージェント | たった1分でいい人に、いい求人に出会える",
  openGraph: {
    siteName: "出会えるエージェント",
  },
  appleWebApp: {
    capable: true,
    title: "出会えるエージェント",
  },
  icons: {
    icon: "/deaeru_logo.svg",
    apple: "/deaeru_logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "出会えるエージェント",
  alternateName: ["deaeru-agent.jp", "deaeru agent"],
  url: "https://deaeru-agent.jp/",
  publisher: {
    "@type": "Organization",
    name: "foresma株式会社",
    url: "https://foresma.jp",
    logo: {
      "@type": "ImageObject",
      url: "https://deaeru-agent.jp/deaeru-magazine-logo.svg",
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "foresma株式会社",
  url: "https://foresma.jp",
  logo: "https://deaeru-agent.jp/deaeru-magazine-logo.svg",
  sameAs: ["https://deaeru-agent.jp", "https://lreach.jp"],
  brand: {
    "@type": "Brand",
    name: "出会えるエージェント",
    url: "https://deaeru-agent.jp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="ja"
        suppressHydrationWarning
        className={`${inter.variable} ${jomolhari.variable} ${notoSansJP.className} ${sofiaSansExtraCondensed.variable} ${zenAntique.variable} ${zenMaruGothic.variable}`}
      >
        <head>
          <GoogleTagManager gtmId="GTM-N6G5TRW2" />
          <meta name="application-name" content="出会えるエージェント" />
          <meta property="og:site_name" content="出会えるエージェント" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteJsonLd),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />
        </head>
        <body className="min-h-screen overflow-x-hidden bg-background antialiased">
          {children}
        </body>
      </html>
    </>
  );
}
