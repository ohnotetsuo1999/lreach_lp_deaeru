/** メール CTA URL のパスセグメント `mail-{campaignId}-{uid}` をパースする */
export function parseMailTrackingPathId(
  pathId: string
): { campaignId: string; uid: string } | null {
  const trimmed = pathId.trim()
  if (!trimmed.startsWith('mail-')) return null

  const rest = trimmed.slice('mail-'.length)
  const lastHyphen = rest.lastIndexOf('-')
  if (lastHyphen <= 0) return null

  const campaignId = rest.slice(0, lastHyphen)
  const uid = rest.slice(lastHyphen + 1)
  if (!campaignId || !uid) return null

  return { campaignId, uid }
}
