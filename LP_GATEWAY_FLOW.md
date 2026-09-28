 # LP流入〜フォーム回答〜Gateway遷移とCAPI連携の流れ
 
 ## 対象
 - GT系LP: `apps/lreach_lp/app/gt/lp01a/[id]/_components/Page.tsx`
 - LP3系LP: `apps/lreach_lp/app/lp3-01/[id]/_components/Page.tsx`
 - 保存API（GT系）: `apps/lreach_lp/app/api/lp/save-answers/route.ts`
 - 保存API（LP3系）: `apps/lreach_lp/app/api/lp3/save-answers/route.ts`
 
 ---
 
 ## 全体フロー（GT系の例）
 1. LP表示後に `currentUrl = window.location.href` を保持
 2. フォーム送信でバリデーション → 保存API/通知/スプレッドシート送信を並列実行
 3. 保存APIが `lp_sessions_id` と `users_id` を返却
 4. `lp_sessions_id` / `users_id` / `referrerUrl` をクエリに詰めて gateway に遷移
 
 ### 主要コード抜粋（GT系）
 - 保存API呼び出しとリダイレクトURL生成
 ```ts
 // apps/lreach_lp/app/gt/lp01a/[id]/_components/Page.tsx
 const response = await fetch('/api/lp/save-answers', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
     formData,
     lpKey: `gt-lp01a-${id}`,
     referrerUrl: currentUrl,
   }),
 });
 
 const params = new URLSearchParams({
   lpSessionsId,
   referrerUrl: currentUrl,
   usersId,
 });
 const redirectUrl = `https://gateway.lreach.jp/gt?${params.toString()}`;
 ```
 
 ---
 
 ## フォーム送信〜保存APIの詳細（GT系）
 ### 保存APIの処理順
 - `users` 作成
 - `lp_sessions` 作成（`referrer_url` に `referrerUrl` を保存）
 - `users_info` 作成（フォーム項目に応じてマッピング）
 
 ### 主要コード抜粋（GT系）
 ```ts
 // apps/lreach_lp/app/api/lp/save-answers/route.ts
 const { formData, lpKey, referrerUrl } = body;
 
 const { data: usersData } = await supabaseAdmin
   .from('users')
   .insert({ created_at: new Date().toISOString() })
   .select('*');
 
 const { data: lpSessionsData } = await supabaseAdmin
   .from('lp_sessions')
   .insert({
     answers: formData,
     is_submitted: true,
     lp_key: lpKey,
     referrer_url: referrerUrl || null,
     user_id: usersId,
   })
   .select('*');
 ```
 
 ---
 
 ## LP3系の違い
 - `lp3_questions` / `lp3_answers` を作成してから `lp_sessions` を作成
 - 送信後のリダイレクトは `window.location.assign()` で直接遷移
 
 ```ts
 // apps/lreach_lp/app/lp3-01/[id]/_components/Page.tsx
 const response = await fetch('/api/lp3/save-answers', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
     formData,
     questionData: addQuestionsData,
     lpKey: `lp3-01-${id}`,
     referrerUrl: currentUrl,
   }),
 });
 
 const params = new URLSearchParams({
   lp3AnswersId: answerId.toString(),
   lpSessionsId,
   referrerUrl: currentUrl,
   usersId,
 });
 const newRedirectUrl = `https://gateway.lreach.jp?${params.toString()}`;
 window.location.assign(newRedirectUrl);
 ```
 
 ```ts
 // apps/lreach_lp/app/api/lp3/save-answers/route.ts
 const { formData, questionData, lpKey, referrerUrl } = body;
 
 // lp3_questions -> lp3_answers -> users -> users_info -> lp_sessions
 const { data: questionsData } = await supabaseAdmin
   .from('lp3_questions')
   .insert(questionData)
   .select();
 
 const { data: answersResult } = await supabaseAdmin
   .from('lp3_answers')
   .insert({
     ...addAnswersData,
     is_submitted: true,
     lp3_questions_id: questionId,
   })
   .select();
 ```
 
 ---
 
 ## コンバージョンAPI（CAPI）連携の考え方
 - LP側は「流入URL（`window.location.href`）を `referrerUrl` として保存・引き回す」ことが責務
 - `referrerUrl` は以下の2箇所で利用される
   - `lp_sessions.referrer_url` に保存（DB側のトラッキング）
   - gateway への遷移クエリに付与（広告パラメータの引き継ぎ）
 - gateway 側で `referrerUrl` を元に `fbclid` 等の広告パラメータを使って CAPI / Pixel 計測を実施する前提
 
 ### 参照
 - `referrerUrl` が gateway に渡される箇所
   - `apps/lreach_lp/app/gt/lp01a/[id]/_components/Page.tsx`
   - `apps/lreach_lp/app/lp3-01/[id]/_components/Page.tsx`
 - `referrer_url` がDBに保存される箇所
   - `apps/lreach_lp/app/api/lp/save-answers/route.ts`
   - `apps/lreach_lp/app/api/lp3/save-answers/route.ts`
