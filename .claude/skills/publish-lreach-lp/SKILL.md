---
name: publish-lreach-lp
description: Lreachの新規LPを、対話・HTML・Figmaのデザインから作成し、採番・広告タグ選択・Vercel Preview発行まで進める。既存LPの複製、新規デザイン、LP発行の依頼で使用する。
---

# Lreach LPを発行する

マーケターがデザインを編集し、回答保存・通知・シナリオはLreachのAPIが担当する。

## 初回の前提

- このLPリポジトリをcloneし `npm ci --legacy-peer-deps` を実行済み。
- 管理者がVercelに接続し、`NEXT_PUBLIC_LREACH_BACKEND_URL` を設定済み。
- 発行用の `LP_PUBLISH_API_URL` と `LP_PUBLISH_TOKEN` は実行環境に設定する。チャット、HTML、Gitに値を書かない。
- DBのmigration、既存LP棚卸し、タグ登録が完了済み。APIが停止・未設定なら停止理由を報告し、手元だけで番号を確定しない。

## 手順

1. `node scripts/lp/publish.mjs options` で現在のLP・広告タグ候補を取得する。
2. 名称、媒体、流入ID、番号（自動／指定）、使用する広告タグを対話で決める。すでに指定された内容を再質問しない。現在の新規LPは99Yと同じ5回答とLINEへの遷移を利用する。
3. デザインをHTMLにする。添付HTMLを使う、既存LPを参考に再構成する、対話から新規作成する。Figma連携が利用可能なら指定フレームを読み、利用できなければHTML等の共有を案内する。接続済みとは推測しない。
4. HTMLのフォーム位置に `{{LREACH_FORM}}` を1つ配置する。`head` と `body` を含める。送信先・Supabase・通知先をデザイン内で実装しない。画像は `/issued-assets/<slug>/` に置く。広告タグはマスターから選び、デザインに重複記載しない。計測の有効化はProductionだけ。
5. 機密情報を含まない仕様JSONを作る：
   ```json
   {"slug":"spring-career","title":"転職相談","code":null,"inflow":"meta","media":"Meta","mediaType":"インハウス","note":"99Yの回答形式","tagIds":[],"design":"designs/spring-career.html"}
   ```
   指定番号は `lp100a` のように小文字で記載する。
6. `node scripts/lp/publish.mjs prepare specs/spring-career.json` を実行する。台帳に番号を予約し、`app/deaeru/<番号>/[id]/route.ts` と `issued/<番号>.json` を生成する。同じ依頼の再実行は `.lp-publish/` の同じ状態ファイルを使う。
7. ローカルでPC・スマホ表示、フォーム必須項目、遷移URLを確認する。実データやSlack/LINEへの送信は許可されたテスト対象だけで行う。`npm run build` が通ることを確認する。
8. このLP専用リポジトリは `main` のみで運用する。対象変更だけを日本語でコミットし、`main` にpushする。利用者の他変更はコミットしない。pushが競合したら強制pushせず、他の変更を取り込んで検証する。
9. ユーザーが発行を依頼している場合は `node scripts/lp/publish.mjs deploy .lp-publish/spring-career.json` でPreviewを作る。出力URLをブラウザで確認する。失敗・不明な結果を新規依頼として再採番しない。URLが発行済みで台帳登録だけ失敗した場合は `register` を使う。
10. 確認URL、LP番号、使用タグ、検証結果を返す。回答保存・外部通知を未確認なら明記する。

## 公開の境界

このコマンドはPreview発行まで。LP専用リポジトリのmainへのpushと本番公開は区別する。既存Lreach本体のdevelop/mainへのマージ、Production昇格、既存ドメインの付け替えは別のリリース操作。既存の承認範囲とチーム運用に従う。URL維持の切替手順は管理者向けの移行ドキュメントに従う。

既存LPのそのまま移行は管理者のexport作業で行う。このSkillは、新規LPを安全な送信APIに接続するための手順。
