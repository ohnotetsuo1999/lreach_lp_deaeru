const TRUE = "true";
const FALSE = "false";
const PRODUCTION = "production";
const DEVELOP_TARGET = "develop";
const PREVIEW = "preview";

const ALL_METHOD_PROVIDER_HOSTS = new Map([
  ["api.line.me", "line"],
  ["api-data.line.me", "line"],
  ["slack.com", "slack"],
  ["hooks.slack.com", "slack"],
  ["api.resend.com", "resend"],
  ["api.twilio.com", "twilio"],
  ["api.notion.com", "notion"],
  ["api.channel.io", "channel-talk"],
  ["api.channeltalk.com", "channel-talk"],
  ["script.google.com", "google-apps-script"],
  ["script.googleusercontent.com", "google-apps-script"],
  ["api.stripe.com", "stripe"],
  ["api.sendgrid.com", "sendgrid"],
  ["www.googleapis.com", "google-api"],
  ["gmail.googleapis.com", "gmail"],
  ["calendar.googleapis.com", "google-calendar"],
  ["sheets.googleapis.com", "google-sheets"],
  ["googleads.googleapis.com", "google-ads"],
  ["graph.facebook.com", "meta"],
  ["graph.instagram.com", "meta"],
  ["api.x.com", "x"],
  ["ads-api.x.com", "x-ads"],
  ["api.twitter.com", "x"],
]);

const ALL_METHOD_PROVIDER_SUFFIXES = [
  [".slack.com", "slack"],
  [".twilio.com", "twilio"],
  [".channel.io", "channel-talk"],
  [".channeltalk.com", "channel-talk"],
  [".mailgun.net", "mailgun"],
  [".googleapis.com", "google-api"],
];

const OUTBOUND_ENDPOINT_ENV_KEY =
  /(?:WEBHOOK.*(?:URL|ENDPOINT)|GAS_(?:URL|ENDPOINT)|KICKBACK.*(?:URL|ENDPOINT)|LSTEP.*(?:URL|ENDPOINT)|CHANNEL_IO.*(?:URL|ENDPOINT)|NOTIFICATION.*(?:URL|ENDPOINT)|API_BASE_URL)$/i;

const FETCH_INSTALL_STATE = Symbol.for("lreach.outbound-guard.fetch-install-state.v1");

function normalized(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function configuredDevelopProviders(environment) {
  return new Set(
    String(environment.DEVELOP_OUTBOUND_PROVIDERS ?? "")
      .split(",")
      .map((value) => normalized(value))
      .filter(Boolean)
  );
}

function isWriteMethod(method) {
  const value = String(method || "GET")
    .trim()
    .toUpperCase();
  return value !== "GET" && value !== "HEAD" && value !== "OPTIONS";
}

/**
 * Sending is enabled only for an explicitly opted-in Vercel Production runtime.
 * NODE_ENV and a Vercel project's `production` target are deliberately insufficient.
 */
export function evaluateOutboundPolicy(environment = process.env) {
  if (normalized(environment.OUTBOUND_DELIVERY_ENABLED) !== TRUE) {
    return { allowed: false, reason: "delivery-not-explicitly-enabled" };
  }
  if (normalized(environment.OUTBOUND_DISABLED) !== FALSE) {
    return { allowed: false, reason: "kill-switch-not-explicitly-disabled" };
  }
  if (normalized(environment.LREACH_DEPLOY_ENV) !== PRODUCTION) {
    return { allowed: false, reason: "not-explicit-production" };
  }
  if (normalized(environment.VERCEL_ENV) !== PRODUCTION) {
    return { allowed: false, reason: "not-vercel-production" };
  }
  return { allowed: true, reason: "explicit-production-opt-in" };
}

/** Develop delivery is deliberately independent of the Production switches. */
export function evaluateDevelopOutboundPolicy(provider, environment = process.env) {
  if (normalized(environment.DEVELOP_OUTBOUND_DELIVERY_ENABLED) !== TRUE) {
    return { allowed: false, reason: "develop-delivery-not-explicitly-enabled" };
  }
  if (normalized(environment.DEVELOP_OUTBOUND_DISABLED) !== FALSE) {
    return { allowed: false, reason: "develop-kill-switch-not-explicitly-disabled" };
  }
  if (normalized(environment.LREACH_DEPLOY_ENV) !== "staging") {
    return { allowed: false, reason: "not-isolated-development" };
  }
  if (normalized(environment.VERCEL_ENV) !== PREVIEW) {
    return { allowed: false, reason: "not-vercel-preview" };
  }
  if (normalized(environment.VERCEL_TARGET_ENV) !== DEVELOP_TARGET) {
    return { allowed: false, reason: "not-vercel-develop-target" };
  }
  if (!configuredDevelopProviders(environment).has(normalized(provider))) {
    return { allowed: false, reason: "develop-provider-not-allowlisted" };
  }
  if (
    normalized(provider) === "line" &&
    normalized(environment.DEVELOP_LINE_DESTINATION_VERIFIED) !== TRUE
  ) {
    return { allowed: false, reason: "develop-line-destination-not-verified" };
  }
  if (
    normalized(provider) === "slack" &&
    normalized(environment.DEVELOP_SLACK_DESTINATION_VERIFIED) !== TRUE
  ) {
    return { allowed: false, reason: "develop-slack-destination-not-verified" };
  }
  return { allowed: true, reason: "explicit-develop-provider-opt-in" };
}

export function evaluateOutboundDeliveryPolicy(provider, environment = process.env) {
  const production = evaluateOutboundPolicy(environment);
  if (production.allowed) return production;
  return evaluateDevelopOutboundPolicy(provider, environment);
}

/** Prevent develop deployments from honoring caller-supplied Production channels. */
export function resolveSlackDestination(requestedChannel, environment = process.env) {
  if (normalized(environment.VERCEL_TARGET_ENV) !== DEVELOP_TARGET) {
    return requestedChannel;
  }
  const developChannel = String(environment.SLACK_DEVELOP_CHANNEL_ID ?? "").trim();
  if (!/^[A-Z0-9]{9,15}$/.test(developChannel)) {
    throw new Error("SLACK_DEVELOP_CHANNEL_ID is required for the develop target");
  }
  return developChannel;
}

function parseUrl(input) {
  try {
    return input instanceof URL ? input : new URL(String(input));
  } catch {
    return null;
  }
}

function configuredOutboundEndpoints(environment) {
  const endpoints = [];
  for (const [key, rawValue] of Object.entries(environment)) {
    if (!OUTBOUND_ENDPOINT_ENV_KEY.test(key) || !rawValue) continue;
    const parsed = parseUrl(rawValue.trim());
    if (parsed) endpoints.push(parsed);
  }
  return endpoints;
}

function isDevelopInternalEndpoint(url, environment) {
  return String(environment.DEVELOP_INTERNAL_API_BASE_URLS ?? "")
    .split(",")
    .map((value) => parseUrl(value.trim()))
    .filter(Boolean)
    .some((endpoint) => {
      if (endpoint.origin !== url.origin) return false;
      const endpointPath = endpoint.pathname.replace(/\/+$/, "");
      return !endpointPath || url.pathname.startsWith(endpointPath);
    });
}

function isConfiguredOutboundEndpoint(url, environment) {
  return configuredOutboundEndpoints(environment).some((endpoint) => {
    if (endpoint.origin !== url.origin) return false;
    const endpointPath = endpoint.pathname.replace(/\/+$/, "");
    return !endpointPath || url.pathname.startsWith(endpointPath);
  });
}

function providerFromSuffix(hostname, suffixes) {
  return suffixes.find(([suffix]) => hostname.endsWith(suffix))?.[1] ?? null;
}

function isExplicitlyAllowedInfrastructureHost(hostname) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost") ||
    hostname === "supabase.co" ||
    hostname.endsWith(".supabase.co")
  );
}

export function classifyOutboundRequest(input, method = "GET", environment = process.env) {
  const url = parseUrl(input);
  if (!url) return { outbound: false, provider: null };

  const hostname = url.hostname.toLowerCase();
  if (isDevelopInternalEndpoint(url, environment)) {
    return { outbound: true, provider: "develop-internal-api" };
  }
  const allMethodProvider =
    ALL_METHOD_PROVIDER_HOSTS.get(hostname) ??
    providerFromSuffix(hostname, ALL_METHOD_PROVIDER_SUFFIXES);
  if (allMethodProvider) return { outbound: true, provider: allMethodProvider };
  if (/^email(?:\.[a-z0-9-]+)?\.amazonaws\.com$/.test(hostname)) {
    return { outbound: true, provider: "amazon-ses" };
  }

  // A webhook or GAS endpoint may intentionally use GET for side effects.
  if (isConfiguredOutboundEndpoint(url, environment)) {
    return { outbound: true, provider: "configured-endpoint" };
  }

  if (isExplicitlyAllowedInfrastructureHost(hostname)) {
    return { outbound: false, provider: null };
  }

  if (!isWriteMethod(method)) return { outbound: false, provider: null };

  if (hostname.endsWith(".vercel.app")) {
    return { outbound: true, provider: "vercel-app" };
  }
  if (hostname === "lreach.jp" || hostname.endsWith(".lreach.jp")) {
    return { outbound: true, provider: "lreach-production-service" };
  }
  if (hostname === "lreach-app.com" || hostname.endsWith(".lreach-app.com")) {
    return { outbound: true, provider: "lreach-service" };
  }
  if (url.protocol === "http:" || url.protocol === "https:") {
    return { outbound: true, provider: "external-write" };
  }
  return { outbound: false, provider: null };
}

export class OutboundDeliveryBlockedError extends Error {
  constructor(provider, reason) {
    super(`Outbound delivery blocked for ${provider} (${reason})`);
    this.name = "OutboundDeliveryBlockedError";
    this.code = "OUTBOUND_DELIVERY_BLOCKED";
    this.provider = provider;
    this.reason = reason;
  }
}

export function assertOutboundDeliveryAllowed(
  provider = "external-service",
  environment = process.env
) {
  const decision = evaluateOutboundDeliveryPolicy(provider, environment);
  if (!decision.allowed) {
    throw new OutboundDeliveryBlockedError(provider, decision.reason);
  }
}

export function assertOutboundRequestAllowed(input, method = "GET", environment = process.env) {
  const classification = classifyOutboundRequest(input, method, environment);
  if (!classification.outbound) return;
  assertOutboundDeliveryAllowed(classification.provider ?? "external-service", environment);
}

export function installOutboundFetchGuard({ environment = process.env, logger = console } = {}) {
  if (globalThis[FETCH_INSTALL_STATE]) {
    return globalThis[FETCH_INSTALL_STATE].uninstall;
  }

  const warned = new Set();
  const originalFetch = globalThis.fetch;
  if (typeof originalFetch !== "function") return () => {};

  globalThis.fetch = function guardedFetch(input, init) {
    const requestMethod =
      init?.method ??
      (typeof Request !== "undefined" && input instanceof Request ? input.method : "GET");
    const requestUrl =
      typeof Request !== "undefined" && input instanceof Request ? input.url : input;
    const classification = classifyOutboundRequest(requestUrl, requestMethod, environment);

    if (classification.outbound) {
      const decision = evaluateOutboundDeliveryPolicy(
        classification.provider ?? "external-service",
        environment
      );
      if (!decision.allowed) {
        const provider = classification.provider ?? "external-service";
        const warningKey = `${provider}:${decision.reason}`;
        if (!warned.has(warningKey)) {
          warned.add(warningKey);
          // Never log URLs, bodies, headers, tokens, or configured endpoint values.
          logger.warn?.(`[outbound-guard] blocked provider=${provider} reason=${decision.reason}`);
        }
        throw new OutboundDeliveryBlockedError(provider, decision.reason);
      }
    }

    return originalFetch.call(this, input, init);
  };

  const uninstall = () => {
    globalThis.fetch = originalFetch;
    delete globalThis[FETCH_INSTALL_STATE];
  };
  globalThis[FETCH_INSTALL_STATE] = { uninstall };
  return uninstall;
}
