import assert from "node:assert/strict";
import test from "node:test";

import { createSubmissionProxy } from "../../lib/lp-publication/proxy.mjs";

const env = {
  NEXT_PUBLIC_LREACH_BACKEND_URL: "https://backend.example",
  LREACH_BACKEND_PROTECTION_BYPASS: "server-only-secret",
};
const request = (body = "{}", origin = "https://lp.example") =>
  new Request("https://lp.example/api/lp/v1/submissions/", {
    method: "POST",
    headers: {
      origin,
      "Content-Type": "application/json",
      Authorization: "untrusted",
      Cookie: "untrusted",
    },
    body,
  });
test("新規LPの回答だけを固定APIへ転送し秘密情報やCookieをブラウザへ返さない", async () => {
  const proxy = createSubmissionProxy(env, async (url, init) => {
    assert.equal(url.href, "https://backend.example/api/lp/v1/submissions/");
    assert.equal(init.headers.Origin, "https://lp.example");
    assert.equal(
      init.headers["x-vercel-protection-bypass"],
      "server-only-secret"
    );
    assert.equal(init.headers.Authorization, undefined);
    assert.equal(init.headers.Cookie, undefined);
    assert.equal(init.redirect, "error");
    assert.equal(
      new TextDecoder().decode(init.body),
      '{"requestId":"same-id"}'
    );
    return Response.json(
      { success: true },
      {
        status: 201,
        headers: {
          "Set-Cookie": "secret",
          "x-vercel-protection-bypass": "server-only-secret",
        },
      }
    );
  });
  const response = await proxy(request('{"requestId":"same-id"}'));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(response.headers.get("x-vercel-protection-bypass"), null);
});
test("別Origin・上限超過・不正接続先ではバックエンドを呼ばない", async () => {
  const fail = async () => {
    throw Error("must not call");
  };
  assert.equal(
    (
      await createSubmissionProxy(
        env,
        fail
      )(request("{}", "https://other.example"))
    ).status,
    403
  );
  assert.equal(
    (await createSubmissionProxy(env, fail)(request("x".repeat(16385)))).status,
    413
  );
  assert.equal(
    (
      await createSubmissionProxy(
        {
          ...env,
          NEXT_PUBLIC_LREACH_BACKEND_URL:
            "https://user:password@backend.example",
        },
        fail
      )(request())
    ).status,
    503
  );
});
test("保護画面・リダイレクト・通信障害は回答成功にしない", async () => {
  for (const send of [
    async () =>
      new Response("<html>login</html>", {
        headers: { "Content-Type": "text/html" },
      }),
    async () => {
      throw Error("secret");
    },
  ]) {
    const response = await createSubmissionProxy(env, send)(request());
    assert.equal(response.status, 502);
    assert.ok(!(await response.text()).includes("secret"));
  }
});
