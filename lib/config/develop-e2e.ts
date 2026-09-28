/**
 * develop Preview で本番向け外部連携を発火させずに導線確認するためのフラグ。
 *
 * Production では環境変数を設定しない（既定値 false）。
 */
export const IS_DEVELOP_E2E_MODE =
  process.env.NEXT_PUBLIC_DEVELOP_E2E_MODE?.trim().toLowerCase() === "true";
