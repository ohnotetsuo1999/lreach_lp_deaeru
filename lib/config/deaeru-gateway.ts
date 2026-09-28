const configuredGatewayUrl =
  process.env.NEXT_PUBLIC_DEAERU_GATEWAY_URL?.trim();

/**
 * 出会えるエージェントLPの遷移先Gateway。
 *
 * Production URLへの暗黙fallbackは禁止。未設定時は外部遷移を行わない。
 */
export const DEAERU_GATEWAY_URL =
  configuredGatewayUrl?.replace(/\/+$/, "") ?? "#gateway-url-not-configured";
