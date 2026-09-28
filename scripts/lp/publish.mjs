#!/usr/bin/env node
// このスクリプトはLPリポジトリのscripts/lp/へコピーして使用する。
import { execFileSync, spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { renderPublishedPage } from "./render.mjs";
import { ensurePublisherProject, loadPublisherRuntime, publisherProject } from "./runtime.mjs";

const root = process.cwd(),
  [action, input] = process.argv.slice(2);
const run = (file, args) =>
  execFileSync(file, args, { cwd: root, encoding: "utf8" }).trim();
async function api(action, body) {
  await loadPublisherRuntime();
  const base = new URL(process.env.LP_PUBLISH_API_URL || "");
  if (
    base.protocol !== "https:" &&
    !(
      base.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(base.hostname)
    )
  )
    throw Error("Publisher API must use HTTPS");
  const token = process.env.LP_PUBLISH_TOKEN;
  if (!token || token.length < 32) throw Error("LP_PUBLISH_TOKEN missing");
  const res = await fetch(new URL("/api/lp/admin/" + action + "/", base), {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(process.env.LP_PUBLISH_PROTECTION_BYPASS
        ? {
            "x-vercel-protection-bypass":
              process.env.LP_PUBLISH_PROTECTION_BYPASS,
          }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
    redirect: "error",
  });
  const result = await res.json();
  if (!res.ok) throw Error(result.error || `API ${res.status}`);
  return result;
}
async function save(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + "\n");
}
function projectApi(path, orgId) {
  try {
    return JSON.parse(run("vercel", ["api", path, "--scope", orgId, "--raw"]));
  } catch {
    throw Error("Vercelプロジェクトの設定を確認できませんでした。");
  }
}
async function verifyProductionBackend() {
  await loadPublisherRuntime();
  const apiOrigin = new URL(process.env.LP_PUBLISH_API_URL || publisherProject.backendUrl).origin;
  if (apiOrigin !== publisherProject.backendUrl &&
      !(process.env.NODE_ENV === "test" && /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(apiOrigin)))
    throw Error("Production発行の管理API接続先が本番backendと一致しません。");
}
async function verifyProductionProject() {
  await verifyProductionBackend();
  const link = await ensurePublisherProject(root);
  if (
    !/^prj_[A-Za-z0-9]+$/.test(link.projectId) ||
    !/^team_[A-Za-z0-9]+$/.test(link.orgId)
  )
    throw Error("Invalid Vercel project link");
  const project = projectApi("/v9/projects/" + link.projectId, link.orgId);
  if (project.targets?.production?.readyState !== "READY")
    throw Error("Vercel Productionの既存デプロイを確認できません。");
  if (
    process.env.VERCEL_PROJECT_ID &&
    process.env.VERCEL_PROJECT_ID !== link.projectId
  )
    throw Error("Vercel project environment mismatch");
  if (process.env.VERCEL_ORG_ID && process.env.VERCEL_ORG_ID !== link.orgId)
    throw Error("Vercel team environment mismatch");
  if (project.link)
    throw Error(
      "Git自動デプロイが接続されています。main pushで意図せず本番公開されるため停止しました。"
    );
  const domains = projectApi(`/v9/projects/${link.projectId}/domains`, link.orgId);
  const domain = domains.domains?.find(d =>
    d.name === publisherProject.productionDomain && d.verified && !d.redirect && !d.gitBranch
  );
  if (!domain) throw Error("公開用Productionドメインの設定を確認できません。");
  const envs = projectApi(`/v9/projects/${link.projectId}/env`, link.orgId).envs || [];
  for (const [key, expected] of Object.entries({
    LREACH_DEPLOY_ENV: "production",
    OUTBOUND_DELIVERY_ENABLED: "true",
    OUTBOUND_DISABLED: "false",
    NEXT_PUBLIC_LREACH_BACKEND_URL: publisherProject.backendUrl,
    LP_AD_TRACKING_ENABLED: "true",
  })) {
    const candidates = envs.filter(e => e.key === key && e.target?.includes("production") && !e.gitBranch);
    if (candidates.length !== 1) throw Error(`Vercel Productionの${key}設定を確認できません。`);
    const env = projectApi(`/v1/projects/${link.projectId}/env/${encodeURIComponent(candidates[0].id)}`, link.orgId);
    if (env.value !== expected) throw Error(`Vercel Productionの${key}設定が発行条件と異なります。`);
  }
  return `https://${publisherProject.productionDomain}`;
}
if (action === "check") {
  await verifyProductionProject();
  console.log("Production project ready");
} else if (action === "options") {
  console.log(JSON.stringify(await api("options"), null, 2));
} else if (action === "prepare") {
  const spec = JSON.parse(await readFile(resolve(input), "utf8"));
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
    throw Error(
      "Existing request differs. Use a new slug; never silently reuse the number."
    );
  const options = await api("options");
  if (options.readiness?.inventoryComplete === false)
    throw Error(
      "既存LP番号の棚卸しが未完了です。管理者が台帳を初期化してください。"
    );
  if (options.numbering?.policy !== "suffix-v1")
    throw Error("backendの採番方式が未更新です。LP100A→LP100B方式のmigrationとAPI反映後、同じ仕様・依頼IDで再開してください。");
  const lineScenarioKey = spec.lineScenarioKey ?? "lp99y";
  if (!options.lineScenarios?.some(s => s.key === lineScenarioKey))
    throw Error("Unknown/inactive LINE scenario");
  const tags = spec.tagIds.map((id) => {
    const tag = options.tags.find((t) => t.id === id);
    if (!tag) throw Error("Unknown/inactive tag");
    return tag;
  });
  const design = await readFile(resolve(spec.design), "utf8");
  // 入力不備で番号だけ消費しないよう、予約前に検査する。
  renderPublishedPage(
    { design, tags, code: spec.code || "lp100a", title: spec.title },
    "001", // 描画検証用の例。発行ルートは任意の[id]を受け取る。
    { tracking: true }
  );
  const reserved = await api("reserve", {
    requestId: state.requestId,
    code: spec.code || null,
    title: spec.title,
    sourceLpCode: "lp99y",
    lineScenarioKey,
    tagIds: spec.tagIds,
    media: spec.media,
    mediaType: spec.mediaType,
    note: spec.note,
  });
  state.reservation = reserved;
  await save(statePath, state);
  if (!/^lp\d{2,5}[a-z]{1,3}$/.test(reserved.lp_code))
    throw Error("Invalid LP code returned by API");
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
  await save(resolve("issued", code + ".json"), {
    code,
    title: spec.title,
    design,
    tags,
    lineScenarioKey,
  });
  await writeFile(
    resolve(folder, "route.ts"),
    `import {readFile} from 'node:fs/promises';\nimport {renderPublishedPage} from '@/lib/lp-publication/render.mjs';\nexport const runtime='nodejs';export const dynamic='force-dynamic';\nexport async function GET(_request:Request,context:{params:Promise<{id:string}>}){const {id}=await context.params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))return new Response('Not found',{status:404});const spec=JSON.parse(await readFile(process.cwd()+'/issued/${code}.json','utf8'));return new Response(renderPublishedPage(spec,id,{tracking:process.env.LP_AD_TRACKING_ENABLED==='true'&&process.env.VERCEL_ENV==='production'}),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});}\n`
  );
  state.generated = true;
  await save(statePath, state);
  console.log(
    JSON.stringify({
      code,
      routePattern: `/deaeru/${code}/[id]/`,
      confirmationPath: `/deaeru/${code}/001/`,
      state: statePath,
    })
  );
} else if (action === "deploy" || action === "register") {
  const statePath = resolve(input);
  const state = JSON.parse(await readFile(statePath, "utf8"));
  if (!state.generated) throw Error("Run prepare first");
  const sha = run("git", ["rev-parse", "HEAD"]);
  if (action === "deploy") {
    const productionOrigin = await verifyProductionProject();

    if (state.deploymentStarted && !state.url)
      throw Error(
        "Previous deployment result is unknown. Inspect Vercel and record the actual URL in state; do not redeploy blindly."
      );
    if (run("git", ["status", "--porcelain"]))
      throw Error("Commit the reviewed design before deploying");
    if (state.url)
      throw Error(
        "Deployment already exists. Use register to resume registration."
      );
    const build = spawnSync("npm", ["run", "build"], {
      cwd: root,
      stdio: "inherit",
    });
    if (build.status !== 0) throw Error("Build failed");
    state.deploymentStarted = true;
    state.sourceSha = sha;
    await save(statePath, state);
    const result = spawnSync(
      "vercel",
      ["deploy", "--prod", "--yes", "--format=json"],
      {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 8 * 1024 * 1024,
      }
    );
    let deployment;
    try {
      const output = JSON.parse(result.stdout);
      deployment = output.deployment || output;
    } catch {}
    if (
      result.status !== 0 ||
      deployment?.readyState !== "READY" ||
      deployment?.target !== "production" ||
      !/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(deployment?.url)
    )
      throw Error("Deployment result unknown. Inspect Vercel before retrying.");
    state.deploymentUrl = deployment.url;
    state.deploymentTarget = "production";
    state.url = productionOrigin;
    await save(statePath, state);
  }
  if (!state.url || !state.sourceSha || state.deploymentTarget !== "production" ||
      state.url !== `https://${publisherProject.productionDomain}`)
    throw Error("Missing verified deployment URL/SHA");
  const link = await ensurePublisherProject(root);
  const project = projectApi(`/v9/projects/${link.projectId}`, link.orgId);
  if (project.targets?.production?.readyState !== "READY" ||
      project.targets.production.url !== new URL(state.deploymentUrl).host)
    throw Error("公開用ドメインが新しいProductionデプロイを指していません。同じ依頼から登録を再開してください。");
  await verifyProductionBackend();
  await api("deployment", {
    code: state.reservation.lp_code,
    requestId: state.requestId,
    status: "published",
    url: state.url,
    sourceSha: state.sourceSha,
  });
  state.registered = true;
  await save(statePath, state);
  console.log(JSON.stringify({
    code: state.reservation.lp_code,
    routePattern: state.url + `/deaeru/${state.reservation.lp_code}/[id]/`,
    productionUrl: state.url + `/deaeru/${state.reservation.lp_code}/001/`,
  }, null, 2));
} else
  throw Error(
    "Usage: node scripts/lp/publish.mjs options | prepare spec.json | deploy .lp-publish/slug.json | register .lp-publish/slug.json"
  );
