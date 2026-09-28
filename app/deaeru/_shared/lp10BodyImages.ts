/**
 * lp10系（リストマーケ型）の FV下・本文画像。
 * lp10a/b/c/d の4本で共通のデザインを使用する。
 * 上から順に描画され、最後の画像（slice7）に運営会社リンクが重なる。
 * LineDirectIntro の bodyImages prop に渡す。
 */
export const LP10_BODY_IMAGES = [
  "/deaeru-lp10-section2.png",
  "/deaeru-lp10-section3.png",
  "/deaeru-lp10-section4.png",
  "/deaeru-lp10-section5.png",
  "/deaeru-lp10-section6.png",
  "/deaeru-lp10-slice7.png",
];

/**
 * lp10系の途中着地CTA（LineDirectIntro の midCtas prop に渡す）。
 * フローティングCTAがこの位置に来ると固定されたように見える（見えている間は追従を非表示）。
 * imageIndex は LP10_BODY_IMAGES の添字。topPercent は画像高さに対するCTA中心の位置。
 * - imageIndex 3 = section5: 「LINEで気軽にスタートできます」と「利用料 完全無料」の間の空白帯
 * - imageIndex 4 = section6: カンタン5STEP の下、「利用料 完全無料」の上の空白帯
 * ※ モジュール定数として渡すこと（毎レンダー新配列だとオブザーバーが再生成されるため）
 */
export const LP10_MID_CTAS = [
  { imageIndex: 3, topPercent: 72 },
  { imageIndex: 4, topPercent: 93 },
];
