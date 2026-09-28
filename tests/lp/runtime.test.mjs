import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { ensurePublisherProject, loadPublisherRuntime, publisherProject } from "../../scripts/lp/runtime.mjs";

test("VercelからLP発行トークンだけを取得し、本番APIへ自動接続する", async () => {
  const env = {}, paths = [];
  await loadPublisherRuntime(env, async path => {
    paths.push(path);
    return path.endsWith("/env") ? {envs:[
      {key:"SUPABASE_SERVICE_ROLE_KEY",id:"db",target:["development"]},
      {key:"LP_PUBLISH_TOKEN",id:"preview",target:["preview"]},
      {key:"LP_PUBLISH_TOKEN",id:"publisher",target:["development"]},
    ]} : {key:"LP_PUBLISH_TOKEN",value:"a".repeat(48)};
  });
  assert.equal(env.LP_PUBLISH_API_URL,publisherProject.backendUrl);
  assert.equal(env.NEXT_PUBLIC_LREACH_BACKEND_URL,publisherProject.backendUrl);
  assert.equal(env.LP_PUBLISH_TOKEN,"a".repeat(48));
  assert.equal(paths.length,2);
  assert.ok(paths[1].endsWith("/env/publisher"));
  assert.equal(env.SUPABASE_SERVICE_ROLE_KEY,undefined);
});

test("片方だけの手動設定には自動取得した秘密情報を渡さない", async () => {
  for (const env of [{LP_PUBLISH_API_URL:"https://other.example"},{LP_PUBLISH_TOKEN:"manual"}])
    await assert.rejects(loadPublisherRuntime(env,()=>assert.fail("must not access Vercel")), /片方/);
});

test("明示したテスト接続を維持し、Vercelへアクセスしない", async () => {
  const env={LP_PUBLISH_API_URL:"http://127.0.0.1:1234",LP_PUBLISH_TOKEN:"manual"};
  await loadPublisherRuntime(env,()=>assert.fail("must not access Vercel"));
  assert.equal(env.LP_PUBLISH_API_URL,"http://127.0.0.1:1234");
});

test("候補がない・復号不可のとき値を含めず停止する", async () => {
  await assert.rejects(loadPublisherRuntime({},async()=>({envs:[]})),/接続設定/);
  const env={};
  await assert.rejects(loadPublisherRuntime(env,async path=>path.endsWith("/env")
    ? {envs:[{key:"LP_PUBLISH_TOKEN",id:"x",target:["development"]}]}
    : {key:"LP_PUBLISH_TOKEN"}),/認証情報/);
  assert.equal(env.LP_PUBLISH_TOKEN,undefined);
});

test("未設定の端末だけLPプロジェクトを接続し、既存接続は保持する", async () => {
  const root=await mkdtemp(join(tmpdir(),"lp-runtime-"));
  try {
    await ensurePublisherProject(root);
    const path=join(root,".vercel/project.json");
    assert.equal(JSON.parse(await readFile(path)).projectId,publisherProject.projectId);
    await writeFile(path,JSON.stringify({projectId:"other",orgId:"other"}));
    assert.equal((await ensurePublisherProject(root)).projectId,"other");
    assert.equal(JSON.parse(await readFile(path)).projectId,"other");
  } finally {await rm(root,{recursive:true,force:true});}
});
