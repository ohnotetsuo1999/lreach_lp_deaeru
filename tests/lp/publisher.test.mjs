import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const exec = promisify(execFile);
test("発行CLIが選択→同じ番号を予約→ルート生成→Preview台帳登録まで再開可能", async () => {
  const root = await mkdtemp(join(tmpdir(), "lp-publisher-"));
  let reservations = [];
  let registered;
  const server = createServer(async (req, res) => {
    assert.equal(req.headers.authorization, "Bearer " + "x".repeat(32));
    let raw = "";
    for await (const part of req) raw += part;
    const b = raw ? JSON.parse(raw) : null;
    res.setHeader("Content-Type", "application/json");
    if (req.url.includes("/options/"))
      res.end(JSON.stringify({ tags: [], lps: [] }));
    else if (req.url.includes("/reserve/")) {
      reservations.push(b);
      res.end(JSON.stringify({ lp_code: "lp100a", request_id: b.requestId }));
    } else {
      registered = b;
      res.end(JSON.stringify({ ok: true }));
    }
  });
  try {
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    await cp(
      new URL("../../scripts/lp/", import.meta.url),
      join(root, "scripts/lp"),
      {
        recursive: true,
      }
    );
    await writeFile(
      join(root, "design.html"),
      "<!doctype html><html><head><title>LP</title></head><body>{{LREACH_FORM}}</body></html>"
    );
    await writeFile(
      join(root, "spec.json"),
      JSON.stringify({
        slug: "test",
        title: "新しいLP",
        code: null,
        inflow: "meta",
        tagIds: [],
        design: "design.html",
      })
    );
    await writeFile(join(root, ".gitignore"), ".lp-publish/\n");
    const env = {
      ...process.env,
      LP_PUBLISH_API_URL: `http://127.0.0.1:${server.address().port}`,
      LP_PUBLISH_TOKEN: "x".repeat(32),
    };
    const run = (...args) =>
      exec(process.execPath, ["scripts/lp/publish.mjs", ...args], {
        cwd: root,
        env,
      });
    await run("prepare", "spec.json");
    await run("prepare", "spec.json");
    assert.equal(reservations.length, 2);
    assert.equal(reservations[0].requestId, reservations[1].requestId);
    const source = await readFile(
      join(root, "app/deaeru/lp100a/[id]/route.ts"),
      "utf8"
    );
    assert.match(source, /issued\/lp100a.json/);
    assert.match(source, /LP_AD_TRACKING_ENABLED/);
    await exec("git", ["init", "-b", "codex/test"], { cwd: root });
    await exec("git", ["add", "."], { cwd: root });
    await exec(
      "git",
      [
        "-c",
        "user.name=Fixture",
        "-c",
        "user.email=fixture@example.invalid",
        "commit",
        "-m",
        "発行検証",
      ],
      { cwd: root }
    );
    const { stdout: sha } = await exec("git", ["rev-parse", "HEAD"], {
      cwd: root,
    });
    const path = join(root, ".lp-publish/test.json");
    const state = JSON.parse(await readFile(path));
    Object.assign(state, {
      url: "https://fixture.vercel.app",
      sourceSha: sha.trim(),
      deploymentStarted: true,
    });
    await writeFile(path, JSON.stringify(state));
    await run("register", ".lp-publish/test.json");
    assert.equal(registered.code, "lp100a");
    assert.equal(registered.status, "preview");
    assert.equal(registered.requestId, state.requestId);
    assert.equal(JSON.parse(await readFile(path)).registered, true);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});
