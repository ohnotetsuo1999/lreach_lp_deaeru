# Non-LP Pages Metadata (Excluding Articles)

## app/layout.tsx (Common)
```typescript
export const metadata: Metadata = {
  description: "「LINEでスカウトが届く」Lリーチのサイトです。",
  title: "Lリーチ | LINEでスカウトが届く！",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
```

## app/ht/lp02a/thanks/[id]/page.tsx
```typescript
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
```

## app/ht/lp03a/thanks/[id]/page.tsx
```typescript
export const metadata: Metadata = {
  title: "株式会社HRteam　中途採用エントリーフォーム　送信完了",
};

export default function Thanks() {
  return (
    <>
      {/* Google Tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17676212788"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17676212788');
        `}
      </Script>
      <header></header>
```

## app/ih/form01a/[id]/page.tsx
```typescript
export const metadata: Metadata = {
  title: "一戸不動産 診断結果受け取りフォーム",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Form01A({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <header></header>
      <Main id={id} />
      <footer></footer>
    </>
  );
}
```

## app/page.tsx
No static metadata export. Dynamic rendering based on host headers.

## app/db/[[...slug]]/page.tsx
No static metadata export. Inherits from `app/layout.tsx`.

