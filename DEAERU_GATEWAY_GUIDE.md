 # deaeru LP01A → Gateway 実装指示書
 
 ## 目的
 deaeru-lp01a から渡される `lpSessionsId / usersId / referrerUrl` を gateway 側で受け取り、
 CAPI/ピクセル計測に必要な流入パラメータ（例: `fbclid`）を引き継いで計測する。
 
 ---
 
 ## 想定ディレクトリ（gateway側）
 - `gateway/app/deaeru/` （既存の `gt` 相当の配置を想定）
 - ルート: `/deaeru`（例: `https://gateway.lreach.jp/deaeru?...`）
 
 ※ 既存の `gt` と共存させる場合は、実装ベースを `gt` から流用すること。
 
 ---
 
 ## LP側から渡されるクエリ
 - `lpSessionsId`（必須）
 - `usersId`（必須）
 - `referrerUrl`（必須）
 
 ### 例
 ```
 https://gateway.lreach.jp/deaeru?lpSessionsId=...&usersId=...&referrerUrl=...
 ```
 
 `referrerUrl` は LPの `window.location.href` をそのまま渡す想定。
 URLSearchParams 経由でエンコードされるため、gateway 側では decode して使用する。
 
 ---
 
 ## gateway側で行うこと（必須）
 1. クエリ取得
    - `lpSessionsId` / `usersId` / `referrerUrl`
 2. `referrerUrl` を decode して広告パラメータを抽出
    - 例: `fbclid` / `gclid` / `utm_*`
 3. 抽出したパラメータを使い CAPI/ピクセル計測を実行
 4. 成功/失敗のログを残す
 
 ---
 
 ## CAPI連携の最小要件（推奨）
 - イベント: `CompleteRegistration`（LP完了として扱う）
 - 送信データ:
   - `event_id`（重複排除用）
   - `event_time`
   - `fbclid`（存在する場合）
   - `lpSessionsId` / `usersId`（内部トラッキング用）
 
 ---
 
 ## エラーハンドリング
 - クエリ不足の場合は計測をスキップしてフォールバック遷移
 - `referrerUrl` が空の場合でも gateway の最低限の表示は継続
 
 ---
 
 ## 参考（LP側の実装）
 - 保存API（GT系）: `apps/lreach_lp/app/api/lp/save-answers/route.ts`
 - 保存API（LP3系）: `apps/lreach_lp/app/api/lp3/save-answers/route.ts`
 - LP側の gateway 遷移:
   - `apps/lreach_lp/app/gt/lp01a/[id]/_components/Page.tsx`
   - `apps/lreach_lp/app/lp3-01/[id]/_components/Page.tsx`
