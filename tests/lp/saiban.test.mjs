import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { once } from "node:events";
import {
  chmod,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import { renderPublishedPage } from "../../scripts/lp/render.mjs";
import { renderTemplate, templates } from "../../scripts/lp/templates.mjs";

const exec = promisify(execFile);
test("テンプレート2種類からフォームを生成し、入力をHTMLとして実行しない", () => {
  for (const template of templates) {
    const design = renderTemplate(template.id, {
      title: "<script>alert(1)</script>",
    });
    const html = renderPublishedPage(
      { design, code: "lp100a", title: "相談" },
      "meta"
    );
    assert.match(html, /id="lreach-form"/);
    assert.match(html, /&lt;script&gt;/);
    assert.doesNotMatch(html, /<script>alert/);
  }
  assert.throws(() => renderTemplate("../unknown"));
});
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "saiban-"));
  const calls = {
    reserve: [],
    deploy: 0,
    registration: 0,
    failRegistration: false,
    inventory: true,
    ready: true,
    uncertain: false,
  };
  const server = createServer(async (req, res) => {
    let raw = "";
    for await (const part of req) raw += part;
    res.setHeader("Content-Type", "application/json");
    if (req.headers.authorization !== "Bearer " + "x".repeat(32)) {
      res.statusCode = 401;
      res.end("{}");
      return;
    }
    if (req.url.includes("/options/"))
      res.end(
        JSON.stringify({
          tags: [
            {
              id: "11111111-1111-4111-8111-111111111111",
              name: "Meta test",
              provider: "meta",
              tag_identifier: "1234567890",
            },
          ],
          readiness: { inventoryComplete: calls.inventory },
        })
      );
    else if (req.url.includes("/reserve/")) {
      const data = JSON.parse(raw);
      calls.reserve.push(data);
      res.end(
        JSON.stringify({ lp_code: "lp100a", request_id: data.requestId })
      );
    } else {
      calls.registration++;
      if (calls.failRegistration) res.statusCode = 503;
      res.end(JSON.stringify({ ok: !calls.failRegistration }));
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  await cp(
    new URL("../../scripts/lp/", import.meta.url),
    join(root, "scripts/lp"),
    { recursive: true }
  );
  await mkdir(join(root, "bin"));
  await mkdir(join(root, ".vercel"));
  await writeFile(
    join(root, ".gitignore"),
    ".lp-publish/\n.vercel/\nbin/\n*.fixture\n"
  );
  await writeFile(
    join(root, ".vercel/project.json"),
    JSON.stringify({ projectId: "prj_test", orgId: "team_test" })
  );
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({
      name: "fixture",
      private: true,
      scripts: { build: 'node -e "process.exit(0)"' },
    })
  );
  // ローカルのCLIスタブのみ。実Vercelにはアクセスしない。
  await writeFile(
    join(root, "bin/vercel"),
    `#!${process.execPath}
const fs=require('node:fs');const mode=fs.readFileSync('mode.fixture','utf8');
if(process.argv[2]==='api'){console.log(JSON.stringify({targets:{preview:{readyState:mode==='not-ready'?'ERROR':'READY'}}}));}
else{fs.appendFileSync('deploy.fixture','deploy\\n');if(mode==='uncertain'){console.log('unknown');process.exit(1);}console.log(JSON.stringify({deployment:{readyState:'READY',target:null,url:'https://fixture.vercel.app'}}));}
`
  );
  await chmod(join(root, "bin/vercel"), 0o755);
  await writeFile(join(root, "mode.fixture"), "ready");
  const env = {
    ...process.env,
    LP_PUBLISH_API_URL: `http://127.0.0.1:${server.address().port}`,
    LP_PUBLISH_TOKEN: "x".repeat(32),
    PATH: join(root, "bin") + ":" + process.env.PATH,
  };
  delete env.VERCEL_PROJECT_ID;
  delete env.VERCEL_ORG_ID;
  const run = (...args) =>
    exec(process.execPath, ["scripts/lp/saiban.mjs", ...args], {
      cwd: root,
      env,
    });
  const git = (...args) => exec("git", args, { cwd: root, env });
  await git("init", "-b", "main");
  await git("config", "user.name", "Fixture");
  await git("config", "user.email", "fixture@example.invalid");
  await git("add", ".");
  await git("commit", "-m", "初期化");
  const remote = join(root, "remote.fixture");
  await git("init", "--bare", remote);
  await git("remote", "add", "origin", remote);
  await git("push", "-u", "origin", "main");
  await mkdir(join(root, ".lp-publish"), { recursive: true });
  await writeFile(
    join(root, ".lp-publish/draft.json"),
    JSON.stringify({
      slug: "career-test",
      title: "新しい相談LP",
      inflow: "meta",
      template: "career-cards",
      tagIds: ["11111111-1111-4111-8111-111111111111"],
    })
  );
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  return { root, calls, run, git };
}
test("lp-saibanでテンプレート→採番→タグ→main push→Preview登録を実行し、登録失敗から再開する", async (t) => {
  const f = await fixture(t);
  await f.run("init", ".lp-publish/draft.json");
  await assert.rejects(f.run("init", ".lp-publish/draft.json"));
  f.calls.failRegistration = true;
  await assert.rejects(f.run("issue", "specs/career-test.json"));
  const state = JSON.parse(
    await readFile(join(f.root, ".lp-publish/career-test.json"))
  );
  assert.equal(state.reservation.lp_code, "lp100a");
  assert.equal(state.url, "https://fixture.vercel.app");
  assert.equal(f.calls.reserve.length, 1);
  assert.equal(f.calls.reserve[0].code, null);
  assert.deepEqual(f.calls.reserve[0].tagIds, [
    "11111111-1111-4111-8111-111111111111",
  ]);
  const issued = JSON.parse(await readFile(join(f.root, "issued/lp100a.json")));
  assert.equal(issued.tags[0].provider, "meta");
  assert.equal((await f.git("status", "--porcelain")).stdout, "");
  assert.equal(
    (await f.git("rev-parse", "HEAD")).stdout,
    (await f.git("rev-parse", "origin/main")).stdout
  );
  f.calls.failRegistration = false;
  await f.run("issue", "specs/career-test.json");
  assert.equal(f.calls.reserve.length, 1);
  assert.equal(
    (await readFile(join(f.root, "deploy.fixture"), "utf8")).trim(),
    "deploy"
  );
  assert.equal(
    JSON.parse(await readFile(join(f.root, ".lp-publish/career-test.json")))
      .registered,
    true
  );
});
test("他の変更・棚卸し未完了・初回Preview未準備を採番前に止める", async (t) => {
  const f = await fixture(t);
  await f.run("init", ".lp-publish/draft.json");
  await writeFile(join(f.root, "unrelated.txt"), "別作業");
  await assert.rejects(f.run("issue", "specs/career-test.json"), /別の変更/);
  await rm(join(f.root, "unrelated.txt"));
  f.calls.inventory = false;
  await assert.rejects(f.run("issue", "specs/career-test.json"), /棚卸し/);
  f.calls.inventory = true;
  await writeFile(join(f.root, "mode.fixture"), "not-ready");
  await assert.rejects(f.run("issue", "specs/career-test.json"), /initialize/);
  assert.equal(f.calls.reserve.length, 0);
});
test("デプロイ結果が不明なら同じコマンドでも再デプロイ・再採番しない", async (t) => {
  const f = await fixture(t);
  await f.run("init", ".lp-publish/draft.json");
  await writeFile(join(f.root, "mode.fixture"), "uncertain");
  await assert.rejects(f.run("issue", "specs/career-test.json"));
  await assert.rejects(
    f.run("issue", "specs/career-test.json"),
    /前回のデプロイ結果が不明/
  );
  assert.equal(f.calls.reserve.length, 1);
  assert.equal(
    (await readFile(join(f.root, "deploy.fixture"), "utf8")).trim(),
    "deploy"
  );
});
test("同じLPを同時に発行しようとしたら採番せず停止する", async (t) => {
  const f = await fixture(t);
  await f.run("init", ".lp-publish/draft.json");
  await writeFile(join(f.root, ".lp-publish/career-test.lock"), "実行中");
  await assert.rejects(
    f.run("issue", "specs/career-test.json"),
    /同じLPを発行中/
  );
  assert.equal(f.calls.reserve.length, 0);
});

test("未pushの別コミットを新LPと一緒にpushしない", async (t) => {
  const f = await fixture(t);
  await writeFile(join(f.root, "another.txt"), "別の実装");
  await f.git("add", "another.txt");
  await f.git("commit", "-m", "別作業");
  await f.run("init", ".lp-publish/draft.json");
  await assert.rejects(
    f.run("issue", "specs/career-test.json"),
    /mainがリモートと一致しません/
  );
  assert.equal(f.calls.reserve.length, 0);
});

test("手動指定100Aをlp100aへ正規化し、自動採番へ切り替えずAPIへ渡す", async (t) => {
  const f = await fixture(t);
  const path = join(f.root, ".lp-publish/draft.json");
  const draft = JSON.parse(await readFile(path, "utf8"));
  await writeFile(path, JSON.stringify({...draft, code:"100A"}));
  await f.run("init", ".lp-publish/draft.json");
  await f.run("issue", "specs/career-test.json");
  assert.equal(f.calls.reserve.length,1);
  assert.equal(f.calls.reserve[0].code,"lp100a");
});
