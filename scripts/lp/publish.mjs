#!/usr/bin/env node
// このスクリプトはLPリポジトリのscripts/lp/へコピーして使用する。
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { renderPublishedPage } from "./render.mjs";
const root = process.cwd(),
  [action, input] = process.argv.slice(2);
const run = (file, args) => execFileSync(file, args, { cwd: root, encoding: "utf8" }).trim();
async function api(action, body) {
  const base = new URL(process.env.LP_PUBLISH_API_URL || "");
  if (
    base.protocol !== "https:" &&
    !(base.protocol === "http:" && ["localhost", "127.0.0.1"].includes(base.hostname))
  )
    throw Error("Publisher API must use HTTPS");
  const token = process.env.LP_PUBLISH_TOKEN;
  if (!token || token.length < 32) throw Error("LP_PUBLISH_TOKEN missing");
  const res = await fetch(new URL("/api/lp/admin/" + action + "/", base), {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  const result = await res.json();
  if (!res.ok) throw Error(result.error || `API ${res.status}`);
  return result;
}
async function save(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n");
}
if (action === "options") {
  console.log(JSON.stringify(await api("options"), null, 2));
} else if (action === "prepare") {
  const spec = JSON.parse(await readFile(resolve(input), "utf8"));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.inflow)) throw Error("Invalid inflow");
  const statePath = resolve(".lp-publish", spec.slug + ".json");
  if (!/^[a-z0-9-]{1,60}$/.test(spec.slug)) throw Error("Invalid slug");
  let state;
  try {
    state = JSON.parse(await readFile(statePath, "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    state = { requestId: randomUUID(), spec };
    await save(statePath, state);
  }
  if (JSON.stringify(state.spec) !== JSON.stringify(spec))
    throw Error("Existing request differs. Use a new slug; never silently reuse the number.");
  const options = await api("options");
  const tags = spec.tagIds.map((id) => {
    const tag = options.tags.find((t) => t.id === id);
    if (!tag) throw Error("Unknown/inactive tag");
    return tag;
  });
  const design = await readFile(resolve(spec.design), "utf8");
  // 入力不備で番号だけ消費しないよう、予約前に検査する。
  renderPublishedPage(
    { design, tags, code: spec.code || "lp100a", title: spec.title },
    spec.inflow,
    { tracking: true }
  );
  const reserved = await api("reserve", {
    requestId: state.requestId,
    code: spec.code || null,
    title: spec.title,
    sourceLpCode: "lp99y",
    tagIds: spec.tagIds,
    media: spec.media,
    mediaType: spec.mediaType,
    note: spec.note,
  });
  state.reservation = reserved;
  await save(statePath, state);
  const code = reserved.lp_code,
    folder = resolve("app/deaeru", code, "[id]");
  if (!state.generated) {
    try {
      await access(resolve("app/deaeru", code));
      throw Error("LP route already exists");
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  await mkdir(folder, { recursive: true });
  await mkdir(resolve("lib/lp-publication"), { recursive: true });
  await writeFile(
    resolve("lib/lp-publication/render.mjs"),
    await readFile(new URL("./render.mjs", import.meta.url))
  );
  await save(resolve("issued", code + ".json"), { code, title: spec.title, design, tags });
  await writeFile(
    resolve(folder, "route.ts"),
    `import {readFile} from 'node:fs/promises';\nimport {renderPublishedPage} from '@/lib/lp-publication/render.mjs';\nexport const runtime='nodejs';export const dynamic='force-dynamic';\nexport async function GET(_request:Request,context:{params:Promise<{id:string}>}){const {id}=await context.params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))return new Response('Not found',{status:404});const spec=JSON.parse(await readFile(process.cwd()+'/issued/${code}.json','utf8'));return new Response(renderPublishedPage(spec,id,{tracking:process.env.LP_AD_TRACKING_ENABLED==='true'&&process.env.VERCEL_ENV==='production'}),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}\n`
  );
  state.generated = true;
  await save(statePath, state);
  console.log(JSON.stringify({ code, path: `/deaeru/${code}/${spec.inflow}/`, state: statePath }));
} else if (action === "deploy" || action === "register") {
  const statePath = resolve(input);
  const state = JSON.parse(await readFile(statePath, "utf8"));
  if (!state.generated) throw Error("Run prepare first");
  const sha = run("git", ["rev-parse", "HEAD"]);
  if (action === "deploy") {
    if (state.deploymentStarted && !state.url)
      throw Error(
        "Previous deployment result is unknown. Inspect Vercel and record the actual URL in state; do not redeploy blindly."
      );
    if (run("git", ["status", "--porcelain"]))
      throw Error("Commit the reviewed design before deploying");
    if (state.url) throw Error("Deployment already exists. Use register to resume registration.");
    const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit" });
    if (build.status !== 0) throw Error("Build failed");
    state.deploymentStarted = true;
    state.sourceSha = sha;
    await save(statePath, state);
    // --prodは使用しない。このワークフローはPreview作成まで。
    const result = spawnSync("vercel", ["deploy", "--target=preview", "--yes", "--format=json"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
    let deployment;
    try {
      const output = JSON.parse(result.stdout);
      deployment = output.deployment || output;
    } catch {}
    if (
      result.status !== 0 ||
      deployment?.readyState !== "READY" ||
      deployment?.target === "production" ||
      !/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(deployment?.url)
    )
      throw Error("Deployment result unknown. Inspect Vercel before retrying.");
    state.url = deployment.url;
    await save(statePath, state);
  }
  if (!state.url || !state.sourceSha) throw Error("Missing verified deployment URL/SHA");
  await api("deployment", {
    code: state.reservation.lp_code,
    requestId: state.requestId,
    status: "preview",
    url: state.url,
    sourceSha: state.sourceSha,
  });
  state.registered = true;
  await save(statePath, state);
  console.log(state.url + `/deaeru/${state.reservation.lp_code}/${state.spec.inflow}/`);
} else
  throw Error(
    "Usage: node scripts/lp/publish.mjs options | prepare spec.json | deploy .lp-publish/slug.json | register .lp-publish/slug.json"
  );
