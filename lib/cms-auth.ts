import crypto from "crypto";
import { NextRequest } from "next/server";

export const CMS_ID = "lreach";
export const CMS_PASS = "P@ssw0rd";
export const SESSION_SECRET = "lreach-cms-8f3a9c2d-session-key";
export const COOKIE_NAME = "cms_session";
export const MAX_AGE = 60 * 60 * 24; // 24h

export function createCmsToken(): string {
  const payload = Date.now().toString(36);
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  return `${payload}.${sig}`;
}

export function verifyCmsSession(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  return sig === expected;
}
