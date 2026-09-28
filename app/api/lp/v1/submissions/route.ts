import { createSubmissionProxy } from "@/lib/lp-publication/proxy.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = createSubmissionProxy(process.env);
