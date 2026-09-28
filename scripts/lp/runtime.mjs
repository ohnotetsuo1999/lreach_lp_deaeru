import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Public project identifiers only. Credentials remain in Vercel.
export const publisherProject = Object.freeze({
  projectId: "prj_8SPA6jPpKs9QJgi7yP58hOwevVuk",
  orgId: "team_iM8C6WDEhY26FzgdmQ2efpFZ",
  backendUrl: "https://lreach-backend.vercel.app",
  productionDomain: "lreach-lp-marketing.vercel.app",
});

function vercelApi(path) {
  const result = spawnSync("vercel", ["api", path, "--scope", publisherProject.orgId, "--raw"], {
    encoding: "utf8", timeout: 30000, maxBuffer: 2 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  // Never propagate stdout/stderr: the response can contain a decrypted token.
  if (result.error || result.status !== 0)
    throw Error("Vercelに接続できません。vercel loginでログインし、lreach-lp-marketingのアクセス権を確認してください。");
  try { return JSON.parse(result.stdout); }
  catch { throw Error("Vercelの設定を取得できませんでした。時間をおいて再実行してください。"); }
}

export async function loadPublisherRuntime(env = process.env, api = vercelApi) {
  if (env === process.env && existsSync(resolve(".lp-publish/runtime.env")))
    process.loadEnvFile(resolve(".lp-publish/runtime.env"));
  if (env.LP_PUBLISH_API_URL && env.LP_PUBLISH_TOKEN) return;
  // Partial overrides must never send an automatically retrieved token elsewhere.
  if (env.LP_PUBLISH_API_URL || env.LP_PUBLISH_TOKEN)
    throw Error("手動設定が片方だけ残っています。LP_PUBLISH_API_URLとLP_PUBLISH_TOKENを両方外すと自動接続できます。");
  const { projectId, backendUrl } = publisherProject;
  const listing = await api(`/v9/projects/${projectId}/env`);
  const candidates = listing.envs?.filter(e =>
    e.key === "LP_PUBLISH_TOKEN" && e.target?.includes("development") && !e.gitBranch
  ) || [];
  if (candidates.length !== 1)
    throw Error("LP発行用の接続設定がVercelにありません。管理者がlreach-lp-marketingのDevelopment設定を確認してください。");
  const token = await api(`/v1/projects/${projectId}/env/${encodeURIComponent(candidates[0].id)}`);
  if (token.key !== "LP_PUBLISH_TOKEN" || typeof token.value !== "string" || token.value.length < 32)
    throw Error("LP発行用の認証情報を取得できません。Vercelのアクセス権を確認してください。");
  env.LP_PUBLISH_API_URL = backendUrl;
  env.LP_PUBLISH_TOKEN = token.value;
  env.NEXT_PUBLIC_LREACH_BACKEND_URL ||= backendUrl;
}

export async function ensurePublisherProject(root = process.cwd()) {
  const path = resolve(root, ".vercel/project.json");
  try {
    // Existing links are verified by publish.mjs; never replace one silently.
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const { projectId, orgId } = publisherProject;
  await mkdir(resolve(root, ".vercel"), { recursive: true });
  await writeFile(path, JSON.stringify({ projectId, orgId }) + "\n", { flag: "wx" });
  return { projectId, orgId };
}
