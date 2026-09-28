// 保護されたPreviewへの接続情報は、このサーバー用モジュールだけで扱う。
export function createSubmissionProxy(env, send = fetch) {
  return async (request) => {
    const reply = (message, status) =>
      Response.json(
        { message },
        { status, headers: { "Cache-Control": "no-store" } }
      );
    if (request.method !== "POST")
      return reply("POSTで送信してください。", 405);
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin)
      return reply("このLPから送信してください。", 403);
    if (
      !/^application\/json(?:;|$)/i.test(
        request.headers.get("content-type") || ""
      )
    )
      return reply("JSON形式で送信してください。", 415);
    let target;
    try {
      target = new URL(env.NEXT_PUBLIC_LREACH_BACKEND_URL);
      if (
        target.username ||
        target.password ||
        (target.protocol !== "https:" &&
          !(
            env.NODE_ENV !== "production" &&
            target.protocol === "http:" &&
            ["localhost", "127.0.0.1"].includes(target.hostname)
          ))
      )
        throw Error();
    } catch {
      return reply("受付設定を確認中です。", 503);
    }
    if (!request.body || Number(request.headers.get("content-length")) > 16384)
      return reply("送信内容を確認してください。", 413);
    const reader = request.body.getReader();
    const chunks = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 16384) {
          await reader.cancel();
          return reply("送信内容が大きすぎます。", 413);
        }
        chunks.push(value);
      }
    } catch {
      return reply("送信内容を確認してください。", 400);
    } finally {
      reader.releaseLock();
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const headers = { "Content-Type": "application/json", Origin: origin };
    if (env.LREACH_BACKEND_PROTECTION_BYPASS)
      headers["x-vercel-protection-bypass"] =
        env.LREACH_BACKEND_PROTECTION_BYPASS;
    try {
      const result = await send(
        new URL("/api/lp/v1/submissions/", target.origin),
        {
          method: "POST",
          headers,
          body,
          redirect: "error",
          signal: AbortSignal.timeout(25000),
        }
      );
      if (
        !/^application\/json(?:;|$)/i.test(
          result.headers.get("content-type") || ""
        )
      )
        return reply("受付サーバーに接続できませんでした。", 502);
      return new Response(result.body, {
        status: result.status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    } catch {
      return reply(
        "受付サーバーに接続できませんでした。同じ回答で再送できます。",
        502
      );
    }
  };
}
