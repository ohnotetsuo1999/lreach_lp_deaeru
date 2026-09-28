# Outbound delivery guard

Server-side communication to LINE, Slack, Resend, Twilio, Notion, ChannelTalk,
Google Apps Script/APIs, Stripe, SendGrid, Mailgun, Amazon SES, Meta/X write APIs,
configured webhook URLs, and app-to-app delivery endpoints is blocked unless all
of the following are explicit:

```dotenv
LREACH_DEPLOY_ENV=production
VERCEL_ENV=production # Provided by Vercel
OUTBOUND_DELIVERY_ENABLED=true
OUTBOUND_DISABLED=false
```

Missing values, invalid booleans, Preview deployments, local development, and a
separate `*-develop` project's Production deployment fail closed. Production
must opt in deliberately; setting `NODE_ENV=production` is never sufficient.

Unknown external HTTP write methods also default to blocked. Read-only requests,
loopback traffic, and ordinary Supabase Data API traffic remain available so the
develop application can read and update Staging; writes known to activate the
`lp_sessions` database trigger have an additional application guard.

The guard is installed by each Next.js application's `instrumentation.ts`. Edge
runtimes patch only `fetch`; Node runtimes also patch `http`/`https` clients used
by provider SDKs. It deliberately does not block ordinary Supabase Data API
traffic.

This process-level guard cannot intercept outbound HTTP started inside Postgres
(for example `pg_net`, database webhooks, or `pg_cron`). Those require separate
Supabase project checks and database-side controls. It also cannot intercept raw
`net`/`tls`, SMTP, gRPC/native transports, browser-side SDK traffic, or WebSocket
connections. The repository currently has no direct raw socket, SMTP, or gRPC
sender; the Gemini Live client is the known WebSocket exception.
