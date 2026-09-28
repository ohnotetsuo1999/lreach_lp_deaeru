import { parseMailTrackingPathId } from './parse-tracking-id'

function extractMailPathId(url: string): string | null {
  const pathMatch = url.match(/\/mail-([^/?#]+)/i)
  if (pathMatch?.[1]) return `mail-${pathMatch[1]}`

  try {
    const parsed = new URL(url)
    const lpUrl = parsed.searchParams.get('lpUrl')
    if (lpUrl) return extractMailPathId(decodeURIComponent(lpUrl))
  } catch {
    // fall through
  }

  const lpUrlMatch = url.match(/[?&]lpUrl=([^&]+)/i)
  if (lpUrlMatch?.[1]) {
    try {
      return extractMailPathId(decodeURIComponent(lpUrlMatch[1]))
    } catch {
      // fall through
    }
  }

  return null
}

/** LP URL / LIFF URL / パスから mail-{campaignId}-{uid} を抽出 */
export function parseMailTrackingFromReferrerUrl(
  referrerUrl: string
): { campaignId: string; uid: string } | null {
  const trimmed = referrerUrl.trim()
  if (!trimmed) return null

  const pathId = extractMailPathId(trimmed)
  if (pathId) return parseMailTrackingPathId(pathId)

  return parseMailTrackingPathId(trimmed)
}
