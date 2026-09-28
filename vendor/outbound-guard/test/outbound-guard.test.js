import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  OutboundDeliveryBlockedError,
  assertOutboundRequestAllowed,
  classifyOutboundRequest,
  evaluateDevelopOutboundPolicy,
  evaluateOutboundPolicy,
  installOutboundFetchGuard,
  installOutboundNetworkGuard,
  resolveSlackDestination,
} from "../src/node.js";

const explicitProduction = {
  LREACH_DEPLOY_ENV: "production",
  VERCEL_ENV: "production",
  OUTBOUND_DELIVERY_ENABLED: "true",
  OUTBOUND_DISABLED: "false",
};

const explicitDevelop = {
  LREACH_DEPLOY_ENV: "staging",
  VERCEL_ENV: "preview",
  VERCEL_TARGET_ENV: "develop",
  OUTBOUND_DELIVERY_ENABLED: "false",
  OUTBOUND_DISABLED: "true",
  DEVELOP_OUTBOUND_DELIVERY_ENABLED: "true",
  DEVELOP_OUTBOUND_DISABLED: "false",
  DEVELOP_OUTBOUND_PROVIDERS: "line,slack",
  DEVELOP_LINE_DESTINATION_VERIFIED: "true",
  DEVELOP_SLACK_DESTINATION_VERIFIED: "true",
};

test("unknown environment fails closed", () => {
  assert.deepEqual(evaluateOutboundPolicy({}), {
    allowed: false,
    reason: "delivery-not-explicitly-enabled",
  });
});

test("malformed boolean fails closed", () => {
  assert.equal(
    evaluateOutboundPolicy({ ...explicitProduction, OUTBOUND_DISABLED: "0" }).allowed,
    false
  );
  assert.equal(
    evaluateOutboundPolicy({ ...explicitProduction, OUTBOUND_DELIVERY_ENABLED: "yes" }).allowed,
    false
  );
});

test("Vercel preview is denied even when delivery is enabled", () => {
  assert.deepEqual(evaluateOutboundPolicy({ ...explicitProduction, VERCEL_ENV: "preview" }), {
    allowed: false,
    reason: "not-vercel-production",
  });
});

test("a separate develop project's production target is denied", () => {
  assert.deepEqual(
    evaluateOutboundPolicy({ ...explicitProduction, LREACH_DEPLOY_ENV: "develop" }),
    { allowed: false, reason: "not-explicit-production" }
  );
});

test("kill switch wins over every other opt-in", () => {
  assert.deepEqual(evaluateOutboundPolicy({ ...explicitProduction, OUTBOUND_DISABLED: "true" }), {
    allowed: false,
    reason: "kill-switch-not-explicitly-disabled",
  });
});

test("only explicit production opt-in is allowed", () => {
  assert.deepEqual(evaluateOutboundPolicy(explicitProduction), {
    allowed: true,
    reason: "explicit-production-opt-in",
  });
});

test("develop permits only allowlisted providers on the develop target", () => {
  assert.deepEqual(evaluateDevelopOutboundPolicy("line", explicitDevelop), {
    allowed: true,
    reason: "explicit-develop-provider-opt-in",
  });
  assert.deepEqual(evaluateDevelopOutboundPolicy("slack", explicitDevelop), {
    allowed: true,
    reason: "explicit-develop-provider-opt-in",
  });
  assert.equal(evaluateDevelopOutboundPolicy("resend", explicitDevelop).allowed, false);
});

test("develop opt-in cannot enable Production or ordinary Preview deployments", () => {
  assert.equal(
    evaluateDevelopOutboundPolicy("line", {
      ...explicitDevelop,
      VERCEL_ENV: "production",
      VERCEL_TARGET_ENV: "production",
    }).allowed,
    false
  );
  assert.equal(
    evaluateDevelopOutboundPolicy("line", {
      ...explicitDevelop,
      VERCEL_TARGET_ENV: "preview",
    }).allowed,
    false
  );
});

test("develop kill switch wins over the provider allowlist", () => {
  assert.equal(
    evaluateDevelopOutboundPolicy("line", {
      ...explicitDevelop,
      DEVELOP_OUTBOUND_DISABLED: "true",
    }).allowed,
    false
  );
});

test("develop provider attestation fails closed", () => {
  assert.equal(
    evaluateDevelopOutboundPolicy("line", {
      ...explicitDevelop,
      DEVELOP_LINE_DESTINATION_VERIFIED: "false",
    }).allowed,
    false
  );
  assert.equal(
    evaluateDevelopOutboundPolicy("slack", {
      ...explicitDevelop,
      DEVELOP_SLACK_DESTINATION_VERIFIED: undefined,
    }).allowed,
    false
  );
});

test("develop always overrides caller-supplied Slack channels", () => {
  assert.equal(
    resolveSlackDestination("C_PRODUCTION", {
      VERCEL_TARGET_ENV: "develop",
      SLACK_DEVELOP_CHANNEL_ID: "C0123456789",
    }),
    "C0123456789"
  );
  assert.throws(
    () => resolveSlackDestination("C_PRODUCTION", { VERCEL_TARGET_ENV: "develop" }),
    /SLACK_DEVELOP_CHANNEL_ID/
  );
  assert.equal(
    resolveSlackDestination("C_PRODUCTION", { VERCEL_TARGET_ENV: "production" }),
    "C_PRODUCTION"
  );
});

test("classifies provider and configured delivery endpoints without exposing values", () => {
  assert.deepEqual(classifyOutboundRequest("https://api.line.me/v2/bot/message/push", "POST", {}), {
    outbound: true,
    provider: "line",
  });
  assert.deepEqual(
    classifyOutboundRequest("https://example.test/hooks/private", "POST", {
      FORM_RESULT_SLACK_WEBHOOK_URL: "https://example.test/hooks/private",
    }),
    { outbound: true, provider: "configured-endpoint" }
  );
  assert.deepEqual(
    classifyOutboundRequest("https://project.supabase.co/rest/v1/events", "POST", {}),
    { outbound: false, provider: null }
  );
});

test("classifies only explicitly listed develop internal API bases", () => {
  const environment = {
    DEVELOP_INTERNAL_API_BASE_URLS: "https://lreach-bot-develop.example.test/api",
  };
  assert.deepEqual(
    classifyOutboundRequest(
      "https://lreach-bot-develop.example.test/api/slack/send",
      "POST",
      environment
    ),
    { outbound: true, provider: "develop-internal-api" }
  );
  assert.deepEqual(
    classifyOutboundRequest("https://lreach-bot-develop.example.test/other", "POST", environment),
    { outbound: true, provider: "external-write" }
  );
});

test("provider GET and side-effecting configured GET endpoints fail closed", () => {
  assert.deepEqual(classifyOutboundRequest("https://api.line.me/v2/bot/profile/U123", "GET", {}), {
    outbound: true,
    provider: "line",
  });
  assert.deepEqual(
    classifyOutboundRequest("https://example.test/gas?action=send", "GET", {
      CAMPAIGN_GAS_ENDPOINT: "https://example.test/gas",
    }),
    { outbound: true, provider: "configured-endpoint" }
  );
  assert.deepEqual(
    classifyOutboundRequest("https://example.test/lstep/send", "GET", {
      LSTEP_FIRST_CONTACT_API_URL: "https://example.test/lstep",
    }),
    { outbound: true, provider: "configured-endpoint" }
  );
  assert.deepEqual(
    classifyOutboundRequest("https://calendar.googleapis.com/calendar/v3/calendars", "GET", {}),
    { outbound: true, provider: "google-calendar" }
  );
});

test("unknown external writes default deny while reads and Supabase remain allowed", () => {
  assert.deepEqual(classifyOutboundRequest("https://example.test/api/data", "POST", {}), {
    outbound: true,
    provider: "external-write",
  });
  assert.deepEqual(classifyOutboundRequest("https://example.test/api/data", "GET", {}), {
    outbound: false,
    provider: null,
  });
  assert.deepEqual(
    classifyOutboundRequest("https://project.supabase.co/rest/v1/events", "POST", {}),
    { outbound: false, provider: null }
  );
});

test("edge entrypoint has no Node builtin dependency and blocks through fetch", async () => {
  const source = await readFile(new URL("../src/policy.js", import.meta.url), "utf8");
  assert.equal(source.includes("node:"), false);

  const realFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    return new Response(null, { status: 204 });
  };
  const uninstall = installOutboundFetchGuard({ environment: {}, logger: { warn() {} } });
  try {
    await assert.rejects(
      async () => fetch("https://script.google.com/macros/s/secret/exec", { method: "GET" }),
      (error) => error instanceof OutboundDeliveryBlockedError
    );
    assert.equal(networkCalls, 0);
  } finally {
    uninstall();
    globalThis.fetch = realFetch;
  }
});

test("blocked errors contain no URL or credential", () => {
  assert.throws(
    () => assertOutboundRequestAllowed("https://hooks.slack.com/services/T000/SECRET", "POST", {}),
    (error) => {
      assert.ok(error instanceof OutboundDeliveryBlockedError);
      assert.equal(error.code, "OUTBOUND_DELIVERY_BLOCKED");
      assert.equal(error.message.includes("SECRET"), false);
      assert.equal(error.message.includes("hooks.slack.com"), false);
      return true;
    }
  );
});

test("installed fetch guard blocks delivery before network I/O", async () => {
  const realFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    return new Response(null, { status: 204 });
  };

  const uninstall = await installOutboundNetworkGuard({
    environment: {},
    logger: { warn() {} },
  });

  try {
    await assert.rejects(
      async () => fetch("https://api.resend.com/emails", { method: "POST" }),
      (error) => error instanceof OutboundDeliveryBlockedError
    );
    assert.equal(networkCalls, 0);

    await fetch("https://project.supabase.co/rest/v1/events", { method: "POST" });
    assert.equal(networkCalls, 1);
  } finally {
    uninstall();
    globalThis.fetch = realFetch;
  }
});

test("explicitly opted-in Vercel Production reaches the underlying transport", async () => {
  const realFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    return new Response(null, { status: 204 });
  };
  const uninstall = installOutboundFetchGuard({
    environment: explicitProduction,
    logger: { warn() {} },
  });

  try {
    await fetch("https://api.line.me/v2/bot/message/push", { method: "POST" });
    assert.equal(networkCalls, 1);
  } finally {
    uninstall();
    globalThis.fetch = realFetch;
  }
});

test("explicit develop opt-in reaches LINE and Slack but blocks other providers", async () => {
  const realFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = async () => {
    networkCalls += 1;
    return new Response(null, { status: 204 });
  };
  const uninstall = installOutboundFetchGuard({
    environment: explicitDevelop,
    logger: { warn() {} },
  });

  try {
    await fetch("https://api.line.me/v2/bot/message/push", { method: "POST" });
    await fetch("https://slack.com/api/chat.postMessage", { method: "POST" });
    assert.throws(() => fetch("https://api.resend.com/emails", { method: "POST" }));
    assert.equal(networkCalls, 2);
  } finally {
    uninstall();
    globalThis.fetch = realFetch;
  }
});

test("Node SDK traffic through https.request is blocked before socket I/O", async () => {
  const uninstall = await installOutboundNetworkGuard({
    environment: {},
    logger: { warn() {} },
  });

  try {
    const https = await import("node:https");
    assert.throws(
      () => https.request("https://api.stripe.com/v1/payment_intents"),
      (error) => error instanceof OutboundDeliveryBlockedError
    );
  } finally {
    uninstall();
  }
});

test("LP Preview relay allows only the configured backend submission POST", () => {
  const origin = "https://lreach-backend-abc-lreach-app.vercel.app";
  const env = { LREACH_DEPLOY_ENV:"staging", VERCEL_ENV:"preview", OUTBOUND_DELIVERY_ENABLED:"false", OUTBOUND_DISABLED:"true", LP_PREVIEW_BACKEND_PROXY_ENABLED:"true", LP_PREVIEW_BACKEND_ORIGIN:origin };
  const url = origin + "/api/lp/v1/submissions/";
  assert.doesNotThrow(() => assertOutboundRequestAllowed(url,"POST",env));
  for (const target of [origin+"/api/slack/send/",origin+"/api/lp/admin/reserve/",url+"extra",url+"?target=other", "https://other.vercel.app/api/lp/v1/submissions/", "https://slack.com/api/chat.postMessage", "https://api.line.me/v2/bot/message/push"]) {
    assert.throws(() => assertOutboundRequestAllowed(target,"POST",env), OutboundDeliveryBlockedError);
  }
  for (const change of [{LP_PREVIEW_BACKEND_PROXY_ENABLED:"false"},{LREACH_DEPLOY_ENV:"production"},{VERCEL_ENV:"production"},{OUTBOUND_DISABLED:"false"},{LP_PREVIEW_BACKEND_ORIGIN:origin+"/api"},{LP_PREVIEW_BACKEND_ORIGIN:"https://lreach-lp.vercel.app"}]) {
    assert.throws(() => assertOutboundRequestAllowed(url,"POST",{...env,...change}), OutboundDeliveryBlockedError);
  }
  assert.throws(() => assertOutboundRequestAllowed(url,"DELETE",env), OutboundDeliveryBlockedError);
});
