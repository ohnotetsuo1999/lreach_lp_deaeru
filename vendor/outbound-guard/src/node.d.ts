export * from "./policy.js";

import type { OutboundEnvironment } from "./policy.js";

export function installOutboundNetworkGuard(options?: {
  environment?: OutboundEnvironment;
  logger?: Pick<Console, "warn">;
}): Promise<() => void>;
