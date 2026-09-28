import { GoogleAnalytics } from "@next/third-parties/google";

/**
 * lp99bp（緒方ASP 出会えるエージェント本LP）専用 layout。
 *
 * GA4（G-0QL09NJ8ZS）を @next/third-parties の GoogleAnalytics コンポーネントで設置する。
 * このアプリはルート layout で GTM（GTM-N6G5TRW2）が同一 dataLayer を先に初期化するため、
 * 自前の gtag('config') を後乗せすると GA4 measurement が起動せず collect が飛ばなかった。
 * 公式コンポーネントは gtag('js')→config を確実に積み measurement を起動するため、
 * イベント送信（sendGAEvent 経由）が確実に collect として送信される。
 *
 * この layout は [id]/page.tsx（本LP）と [id]/thanks/page.tsx（サンクス）の両方をカバーする。
 */
export default function LP99bpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GoogleAnalytics gaId="G-0QL09NJ8ZS" />
      {children}
    </>
  );
}
