import { syncBuiltinESMExports } from "node:module";

import {
  assertOutboundRequestAllowed,
  installOutboundFetchGuard,
} from "./policy.js";

export * from "./policy.js";

const NODE_INSTALL_STATE = Symbol.for("lreach.outbound-guard.node-install-state.v1");

function parseUrl(input) {
  try {
    return input instanceof URL ? input : new URL(String(input));
  } catch {
    return null;
  }
}

function requestUrlFromNodeArgs(args, protocol) {
  const first = args[0];
  if (typeof first === "string" || first instanceof URL) {
    return { url: parseUrl(first), method: String(args[1]?.method ?? "GET") };
  }
  if (!first || typeof first !== "object") return { url: null, method: "GET" };

  const hostname = first.hostname ?? first.host;
  if (!hostname) return { url: null, method: String(first.method ?? "GET") };
  const host = String(hostname).replace(/^\[|\]$/g, "");
  const port = first.port ? `:${first.port}` : "";
  const path = first.path ?? first.pathname ?? "/";
  return {
    url: parseUrl(`${first.protocol ?? protocol}//${host}${port}${path}`),
    method: String(first.method ?? "GET"),
  };
}

function patchNodeRequestModule(module, protocol, environment) {
  const originalRequest = module.request;
  const originalGet = module.get;

  module.request = function guardedRequest(...args) {
    const { url, method } = requestUrlFromNodeArgs(args, protocol);
    if (url) assertOutboundRequestAllowed(url, method, environment);
    return originalRequest.apply(this, args);
  };
  module.get = function guardedGet(...args) {
    const { url, method } = requestUrlFromNodeArgs(args, protocol);
    if (url) assertOutboundRequestAllowed(url, method, environment);
    return originalGet.apply(this, args);
  };

  return () => {
    module.request = originalRequest;
    module.get = originalGet;
  };
}

export async function installOutboundNetworkGuard({
  environment = process.env,
  logger = console,
} = {}) {
  if (globalThis[NODE_INSTALL_STATE]) return globalThis[NODE_INSTALL_STATE].uninstall;

  const uninstallFetch = installOutboundFetchGuard({ environment, logger });
  const [httpImport, httpsImport] = await Promise.all([
    import("node:http"),
    import("node:https"),
  ]);
  const cleanupHttp = patchNodeRequestModule(httpImport.default, "http:", environment);
  const cleanupHttps = patchNodeRequestModule(httpsImport.default, "https:", environment);
  syncBuiltinESMExports();

  const uninstall = () => {
    cleanupHttps();
    cleanupHttp();
    uninstallFetch();
    syncBuiltinESMExports();
    delete globalThis[NODE_INSTALL_STATE];
  };
  globalThis[NODE_INSTALL_STATE] = { uninstall };
  return uninstall;
}
