/**
 * 逆導線LP（外部提携先がプレ面を実施したあとに LP回答が来るLP）の定義。
 *
 * 通常LP:   LP回答 → LINE追加 → シナリオ配信 → プレ面予約 → プレ面実施 → 送客
 * 逆導線LP: 提携先がプレ面を実施済み → LP回答 → LINE追加（シナリオ不要）
 *
 * このLPでは以下の扱いになる:
 *   - 友だち追加後のシナリオを配信しない（lreach_bot 側 lib/line-webhook/follow/lp-routing.ts）
 *   - LP回答時にプレ面（interview_bookings）を「実施済み」で自動作成する（このディレクトリの API）
 *   - call_targets のステータスは interview_bookings の同期処理が自動で付ける
 *
 * 提携先を増やすときは PARTNER_BY_LP_CODE に1行足す。
 */

/** 逆導線LPの提携先情報 */
export interface ReverseFlowPartner {
  /** 提携先の表示名（Slack通知やログ用） */
  name: string;
  /**
   * プレ面の担当者として記録する is_staff.id。
   *
   * is_staff に「表示専用」の1行（is_external_partner=true）を登録し、その UUID を持つ。
   * interview_bookings.is_staff_id は is_staff への外部キーなので、
   * 実在しない UUID を入れると DB に拒否される（架空IDは使えない）。
   *
   * 秘匿情報ではなく環境ごとに変わることもないマスタIDなので、
   * call_target_statuses の id 等と同じくコードに直接持つ。
   */
  isStaffId: string;
}

/** LPコード → 提携先。ここに無いLPは通常導線として扱う */
const PARTNER_BY_LP_CODE: Record<string, ReverseFlowPartner> = {
  lp99dd: {
    name: "ウェルキャリア",
    // is_staff に登録した表示専用レコード（is_external_partner=true・2026-08-25 登録）
    isStaffId: "47b9912b-38ff-49ef-af58-debc725170b7",
  },
};

/**
 * lp_key から逆導線LPの提携先を解決する。通常導線のLPなら null。
 *
 * lp_key 形式は "deaeru-lp99dd-002" 等（deaeru-<lpコード>-<サフィックス>）。
 * lreach_bot 側の isNoScenarioLpKey と同じく "-" 分割で判定する。
 */
export function resolveReverseFlowPartner(
  lpKey: string | null | undefined
): ReverseFlowPartner | null {
  if (!lpKey) return null;
  for (const part of lpKey.split("-")) {
    const partner = PARTNER_BY_LP_CODE[part];
    if (partner) return partner;
  }
  return null;
}
