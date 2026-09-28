/**
 * メール LP (lp08e) の CTA 先 LIFF URL。
 * deaeru-direct 専用 LIFF を使い、LineDirectIntro が付与する lpUrl で mail 計測を引き継ぐ。
 */
export const DEFAULT_MAIL_LIFF_CTA_URL =
  'https://liff.line.me/2008193428-ekeLegz4?form_id=e4f892a1-3c7b-4d2e-9f6a-1b8c5d3e7f02'

export function getMailLiffCtaUrl(): string {
  return (
    process.env.MAIL_LIFF_CTA_URL?.trim() ||
    process.env.NEXT_PUBLIC_MAIL_LIFF_CTA_URL?.trim() ||
    DEFAULT_MAIL_LIFF_CTA_URL
  )
}
