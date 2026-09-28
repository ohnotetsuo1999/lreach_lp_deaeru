import { GoogleAnalytics } from "@next/third-parties/google";

export default function LP01ELayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <meta
          name="google-site-verification"
          content="xgoyWh0wUNyOnqaV1PqIpLQ5ghRybOX14n2OT8vKvBY"
        />
      </head>
      <GoogleAnalytics gaId="G-TYDZLH5C8D" />
      {children}
    </>
  );
}
