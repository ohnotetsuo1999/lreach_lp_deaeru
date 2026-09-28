---
name: lp-saiban
description: Lreach LPをテンプレートや添付HTMLから作成し、自動・指定採番、広告タグ設定、mainへのpush、Vercel Preview発行を行う。マーケターの「LPを作って」「採番して」「タグを入れて発行して」という依頼で使う。
---

# LPを作成して発行する

LP専用リポジトリのルートで実行する。デザインはこのリポジトリ、回答保存・通知・番号台帳はLreach backendが担当する。利用者にDBやJSONの編集を求めず、対話の内容を実行用JSONへ変換する。

## 必要な初期設定

- Node.js、npm依存、GitHubの書き込み権限、Vercel CLIへのログインとLP専用プロジェクトへのアクセス権。端末のlinkはCLIが自動作成する。
- URL・トークンは入力不要。CLIが本番backendへ自動接続し、VercelのLPプロジェクトから限定トークンだけをメモリ上に取得する。認証失敗時はVercelログイン・LPプロジェクト権限を確認し、秘密の値を利用者に質問しない。別環境を手動指定する場合だけ `LP_PUBLISH_API_URL` と `LP_PUBLISH_TOKEN` を両方設定する。
- backendのDB migration、既存番号の棚卸し、広告主確認済みタグの登録。未設定のAPIや未完了の台帳をローカル採番で代用しない。
- mainのみで運用する。自動発行はPreviewまで。VercelのGit自動連携があるとmain pushで本番公開されうるため、このPreview用CLIはGit自動連携のないプロジェクトで使う。

## 対話から発行まで

1. `npm run lp-saiban -- options` で使用できるタグ・LINEシナリオ・元の挙動を取得する。テンプレートだけの確認は `npm run lp-saiban -- templates`。APIが停止していたら設定不足を報告し、テンプレートのデザイン作業は進める。
2. LP名、デザイン（シンプル／特徴カード／添付HTML）、媒体・流入ID、番号（自動／指定）、広告タグ、LINE追加後のシナリオを決める。指定済み事項は聞き直さない。採番方法が未指定なら「自動で採番／LP番号を指定」の2択を提示する。自動は `code:null`、手動は入力された `100A`・`LP100A` 等を指定し、CLIが `lp100a` に正規化する。指定番号が重複した場合は勝手に別番号へ変更せず、別の番号か自動採番を選んでもらう。タグ名だけで広告主が不明なら確認し、適当なIDを選ばない。新規LPの回答・LINEへの遷移は99Y互換。シナリオ未指定ならAPIの `lineScenarios` を使い「案内方法を選択（99Yと同じ）／従来の予約案内／自動配信なし（手動チャット）」を提示し、選んだ `key` を `lineScenarioKey` に保存する。自動配信なしは初回シナリオを送らない設定で、既存予約の通知等を全て無効化するものではない。08A等の別基盤のシナリオは候補にしない。
3. `.lp-publish/draft-<slug>.json` を作る。例：
   ```json
   {"slug":"spring-career","title":"あなたらしい働き方を、一緒に。","template":"career-cards","content":{"brand":"キャリア相談","lead":"希望の働き方をお聞かせください。"},"code":null,"inflow":"meta","media":"Meta","mediaType":"インハウス","note":"99Y互換","tagIds":[],"lineScenarioKey":"lp99y"}
   ```
   手動採番は `code:"lp100a"`。タグはDBを参照したAPIが返す名前・種類・識別子を候補として表示し、選ばれたIDだけを使用する。GTM IDをSkillに固定しない。添付HTMLは `designFile` で指定する。Figmaは利用可能な連携からHTML化し、利用不可ならHTMLを使う。
4. `npm run lp-saiban -- init .lp-publish/draft-<slug>.json`。生成された `designs/<slug>.html` を利用者の希望に合わせて編集する。フォーム位置は `{{LREACH_FORM}}` を1つ。画像は `public/issued-assets/<slug>/`。デザインに保存処理・通知先・広告タグを直接追加しない。
5. 見出し・表示内容を確認する。誇大な実績・架空の口コミを足さない。フォームを入れた完成HTMLは `renderPublishedPage` でローカル描画し、PC・スマホで確認する。秘密情報や承認されていない送信先がないことを確かめる。
6. 発行を依頼されていれば `npm run lp-saiban -- issue specs/<slug>.json`。番号予約・タグ取得・ルート生成・ビルド・対象ファイルだけのコミット・main push・Vercel Preview・台帳へのURL登録を順に実行する。別の変更やステージ済みファイルがあれば巻き込まず停止理由を解消する。強制pushしない。
7. 出力URLをブラウザで確認し、LP番号・タグ・確認結果を返す。テスト回答は許可された接続先と対象だけで行う。READYだけで回答保存・Slack・LINEも動いたとは報告しない。

## 再開と境界

- 同じ仕様と `.lp-publish/<slug>.json` を保持して同じ `issue` を再実行する。登録失敗なら既存URLの登録だけ再開し、新しい番号やデプロイを作らない。
- デプロイ結果が不明なときはVercelの実結果を確認する。番号の取り直し、状態削除、闇雲な再デプロイをしない。
- 予約後にデザインを修正した場合は、未デプロイであることを確認して `node scripts/lp/publish.mjs prepare specs/<slug>.json` で同じ番号のコードを再生成する。デプロイ後の改修は新規発行とは分けて扱う。
- 既存Lreach本体のdevelop/mainへのマージ、Production昇格、既存URL・HTTPSの切替はこのコマンドに含めない。広告計測はProductionの明示有効化時だけ動く。
