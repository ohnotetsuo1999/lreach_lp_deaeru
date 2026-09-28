export type OutboundEnvironment = Record<string, string | undefined>;

export type OutboundPolicyDecision =
  | {
      allowed: true;
      reason: "explicit-production-opt-in" | "explicit-develop-provider-opt-in";
    }
  | {
      allowed: false;
      reason:
        | "delivery-not-explicitly-enabled"
        | "kill-switch-not-explicitly-disabled"
        | "not-explicit-production"
        | "not-vercel-production"
        | "develop-delivery-not-explicitly-enabled"
        | "develop-kill-switch-not-explicitly-disabled"
        | "not-isolated-development"
        | "not-vercel-preview"
        | "not-vercel-develop-target"
        | "develop-provider-not-allowlisted"
        | "develop-line-destination-not-verified"
        | "develop-slack-destination-not-verified";
    };

export type OutboundRequestClassification = {
  outbound: boolean;
  provider: string | null;
};

export class OutboundDeliveryBlockedError extends Error {
  constructor(provider: string, reason: string);
  readonly code: "OUTBOUND_DELIVERY_BLOCKED";
  readonly provider: string;
  readonly reason: string;
}

export function evaluateOutboundPolicy(environment?: OutboundEnvironment): OutboundPolicyDecision;

export function evaluateDevelopOutboundPolicy(
  provider: string,
  environment?: OutboundEnvironment
): OutboundPolicyDecision;

export function evaluateOutboundDeliveryPolicy(
  provider: string,
  environment?: OutboundEnvironment
): OutboundPolicyDecision;

export function resolveSlackDestination(
  requestedChannel: string,
  environment?: OutboundEnvironment
): string;

export function classifyOutboundRequest(
  input: string | URL,
  method?: string,
  environment?: OutboundEnvironment
): OutboundRequestClassification;

export function assertOutboundDeliveryAllowed(
  provider?: string,
  environment?: OutboundEnvironment
): void;

export function assertOutboundRequestAllowed(
  input: string | URL,
  method?: string,
  environment?: OutboundEnvironment
): void;

export function installOutboundFetchGuard(options?: {
  environment?: OutboundEnvironment;
  logger?: Pick<Console, "warn">;
}): () => void;
