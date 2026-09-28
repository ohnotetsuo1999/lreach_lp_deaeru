# Lreach LP

マーケターがLPのデザインとコードを管理する独立プロジェクトです。回答データの保存・Slack通知・LINEシナリオ・採番台帳は、既存Lreachの `backend/` が担当します。

## 使い方

1. `npm ci --legacy-peer-deps` で依存をインストールする。
2. `.env.example` を参考にLreach backendのURLを設定する。DBやSlackのキーは置かない。
3. `npm run dev` で表示を確認する。
4. Codex／Claudeで「publish-lreach-lpを使って、新しいLPを発行して」と依頼する。

[発行Skill](.agents/skills/publish-lreach-lp/SKILL.md) は、番号の自動／手動指定、登録済み広告タグの選択、デザイン作成、Vercel Preview発行を案内します。新規LPの回答形式は99Y互換です。

## 既存LP

99A・99Y・08Aを含む既存画面・画像はそのまま移しています。`npm run verify` は初回移行時に元の2388ファイルと一致するかを検査します。その後の意図したデザイン編集では差分が出るため、日常のビルドとは分けています。

`lib/supabase` は既存画面との互換アダプターです。Supabaseの操作はLreach backendのAPIを通り、ブラウザはDBキーを持ちません。`/api/*` はbackendへのrewriteです。

## 管理者の初期設定

- GitHub/Vercel接続、Preview環境変数、発行用API・トークンを設定する。
- DBのmigrationと既存番号・広告タグの棚卸しをLreach側で完了する。
- Vercel Preview保護が有効な場合、LPからbackendへのリクエストも保護対象になる。既存チームの開発用接続方式を設定してから回答テストを行う。
- 新規Vercelプロジェクトの初回デプロイはPreview指定でもProduction扱いになる場合がある。管理者が初期化し、以降の発行で実際のtargetを検査する。
- develop/mainのマージと既存ドメイン・HTTPSの切替は、この発行スクリプトでは実行しない。

`.lp-publish/` は依頼IDとデプロイ再開情報を保持します。同じ依頼の再送時に削除しないでください。番号予約後に止まっても、別番号でやり直さず状態ファイルから続行します。
