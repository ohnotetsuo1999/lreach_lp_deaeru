#!/usr/bin/env node
import { execFileSync, spawnSync } from "node:child_process";
import { access, mkdir, open, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { renderTemplate, templates } from "./templates.mjs";
import { loadPublisherRuntime } from "./runtime.mjs";

const [action, input] = process.argv.slice(2);
const root = process.cwd();
const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trimEnd();
const call = (...args) => {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL("./publish.mjs", import.meta.url)), ...args],
    { cwd: root, stdio: "inherit" }
  );
  if (result.status !== 0)
    throw Error(
      "発行処理が停止しました。同じ仕様・状態ファイルから再開してください。"
    );
};
const slugOf = (spec) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.slug) || spec.slug.length > 60)
    throw Error(
      "slugは60文字以内の英小文字・数字・ハイフンで指定してください。"
    );
  return spec.slug;
};
const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));
async function stateFor(slug) {
  try {
    return await readJson(resolve(".lp-publish", slug + ".json"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    return null;
  }
}
function validateFiles(spec, input) {
  const slug = slugOf(spec);
  if (
    relative(root, resolve(input)) !== `specs/${slug}.json` ||
    spec.design !== `designs/${slug}.html`
  )
    throw Error(
      "仕様はspecs/<slug>.json、デザインはdesigns/<slug>.htmlに置いてください。"
    );
  const changed = git("status", "--porcelain=v1", "-z", "--untracked-files=all")
    .split("\0")
    .filter(Boolean);
  for (const entry of changed) {
    if (entry[0] !== " " && !entry.startsWith("??"))
      throw Error(
        "ステージ済みの変更があります。対象を確認してから再実行してください。"
      );
    const file = entry.slice(3);
    const allowed =
      file === `specs/${slug}.json` ||
      file === spec.design ||
      file.startsWith(`public/issued-assets/${slug}/`);
    if (!allowed)
      throw Error(`別の変更があるため自動コミットを停止しました: ${file}`);
  }
}
async function withIssueLock(slug, operation) {
  await mkdir(resolve(".lp-publish"), { recursive: true });
  const path = resolve(".lp-publish", slug + ".lock");
  let lock;
  try {
    lock = await open(path, "wx");
  } catch (e) {
    if (e.code === "EEXIST")
      throw Error(
        "同じLPを発行中です。異常終了の場合は、実行プロセスとVercelの結果を確認してからロックを解除してください。"
      );
    throw e;
  }
  try {
    await lock.writeFile(
      JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() })
    );
    return await operation();
  } finally {
    await lock.close();
    await rm(path);
  }
}
if (action === "templates") {
  console.log(JSON.stringify(templates, null, 2));
} else if (action === "init") {
  const draft = await readJson(resolve(input));
  const slug = slugOf(draft);
  if (
    typeof draft.title !== "string" ||
    !draft.title.trim() ||
    draft.title.length > 120
  )
    throw Error("LP名を120文字以内で指定してください。");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.inflow))
    throw Error("流入IDを指定してください。");
  if (!Array.isArray(draft.tagIds))
    throw Error("tagIdsを配列で指定してください（タグなしは空配列）。");
  const lineScenarioKey = draft.lineScenarioKey ?? "lp99y";
  if (!["lp99y", "legacy_b", "none"].includes(lineScenarioKey))
    throw Error("LINE追加後のシナリオを候補から選んでください。");
  let code = null;
  if (draft.code != null && draft.code !== "") {
    if (typeof draft.code !== "string") throw Error("LP番号は100Aのように指定してください。");
    code = "lp" + draft.code.trim().toLowerCase().replace(/^lp/, "");
    if (!/^lp[0-9]{2,5}[a-z]{1,3}$/.test(code)) throw Error("LP番号は100Aのように指定してください。");
  }
  const specPath = resolve("specs", slug + ".json"),
    designPath = resolve("designs", slug + ".html");
  for (const path of [specPath, designPath]) {
    try {
      await access(path);
      throw Error(
        "同名のLPがあります。既存ファイルを編集するか、別のslugを指定してください。"
      );
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  const design = draft.designFile
    ? await readFile(resolve(draft.designFile), "utf8")
    : renderTemplate(draft.template || "career-simple", {
        title: draft.title,
        ...draft.content,
      });
  const spec = {
    slug,
    title: draft.title,
    code,
    inflow: draft.inflow,
    tagIds: draft.tagIds,
    lineScenarioKey,
    design: `designs/${slug}.html`,
    media: draft.media || "",
    mediaType: draft.mediaType || "",
    note: draft.note || "",
  };
  await mkdir(dirname(specPath), { recursive: true });
  await mkdir(dirname(designPath), { recursive: true });
  await writeFile(designPath, design, { flag: "wx" });
  await writeFile(specPath, JSON.stringify(spec, null, 2) + "\n", {
    flag: "wx",
  });
  console.log(
    JSON.stringify(
      {
        spec: `specs/${slug}.json`,
        design: spec.design,
        next: `npm run lp-saiban -- issue specs/${slug}.json`,
      },
      null,
      2
    )
  );
} else if (action === "options") {
  call("options");
  console.log(JSON.stringify({ templates }, null, 2));
} else if (action === "issue") {
  await loadPublisherRuntime();
  const spec = await readJson(resolve(input)),
    slug = slugOf(spec),
    statePath = resolve(".lp-publish", slug + ".json");
  if (git("branch", "--show-current") !== "main")
    throw Error("LP専用リポジトリのmainで実行してください。");
  git("check-ignore", statePath); // 依頼IDや状態をGitへ含めない。
  git("remote", "get-url", "origin");
  await withIssueLock(slug, async () => {
    let state = await stateFor(slug);
    if (state && JSON.stringify(state.spec) !== JSON.stringify(spec))
      throw Error("予約済みの仕様と異なります。元の仕様で再開してください。");
    if (state?.url) {
      const issued = await readJson(
        resolve("issued", state.reservation.lp_code + ".json")
      );
      if (issued.design !== (await readFile(resolve(spec.design), "utf8")))
        throw Error(
          "デプロイ後にデザインが変更されています。このコマンドは既存デプロイの登録再開用です。"
        );
      call("register", statePath);
      return;
    }
    if (state?.deploymentStarted)
      throw Error(
        "前回のデプロイ結果が不明です。Vercelで確認し、同じ状態ファイルから登録を再開してください。"
      );
    git("fetch", "origin", "main");
    const head = git("rev-parse", "HEAD");
    const remoteHead = git("rev-parse", "FETCH_HEAD");
    if (head !== remoteHead && head !== state?.publicationCommit)
      throw Error(
        "mainがリモートと一致しません。未pushの別作業や更新を確認してから再開してください。"
      );
    call("check");
    // 前回の生成に成功済みなら再生成せず、コミット以降から再開する。
    if (!state?.generated) {
      validateFiles(spec, input);
      call("prepare", input);
      state = await stateFor(slug);
    }
    if (JSON.stringify(state.spec) !== JSON.stringify(spec))
      throw Error(
        "予約済みの仕様と異なります。元の仕様に戻してから再開してください。"
      );
    const code = state.reservation.lp_code;
    if (!/^lp\d{2,5}[a-z]{1,3}$/.test(code))
      throw Error("APIのLP番号が不正です。");
    const paths = [
      `specs/${slug}.json`,
      spec.design,
      `app/deaeru/${code}/[id]/route.ts`,
      `issued/${code}.json`,
      "lib/lp-publication/render.mjs",
    ];
    const assetPrefix = `public/issued-assets/${slug}/`;
    const dirty = git("status", "--porcelain=v1", "-z", "--untracked-files=all")
      .split("\0")
      .filter(Boolean);
    for (const entry of dirty) {
      if (
        (entry[0] !== " " && !entry.startsWith("??")) ||
        (!paths.includes(entry.slice(3)) &&
          !entry.slice(3).startsWith(assetPrefix))
      )
        throw Error(
          "発行対象以外またはステージ済みの変更があります。確認後、同じコマンドで再開してください。"
        );
    }
    // 予約後にデザインだけ変更して、画面と登録情報が食い違うことを防ぐ。
    const issued = await readJson(resolve("issued", code + ".json"));
    if (issued.design !== (await readFile(resolve(spec.design), "utf8")))
      throw Error(
        "予約後にデザインが変更されています。prepareで再生成してから再開してください。"
      );
    const check = spawnSync("npm", ["run", "build"], {
      cwd: root,
      stdio: "inherit",
    });
    if (check.status !== 0)
      throw Error("ビルドが失敗しました。push・デプロイは行っていません。");
    if (dirty.length) {
      const files = dirty.map((entry) => entry.slice(3));
      git("add", "--", ...files);
      git("commit", "-m", `${code}のLPを発行`);
      state.publicationCommit = git("rev-parse", "HEAD");
      await writeFile(statePath, JSON.stringify(state, null, 2) + "\n");
    }
    // 強制pushはしない。競合時は番号を取り直さず取り込み・検証後に再開する。
    git("push", "origin", "main");
    call("deploy", statePath);
  });
} else {
  throw Error(
    "Usage: npm run lp-saiban -- templates | options | init draft.json | issue specs/<slug>.json"
  );
}
