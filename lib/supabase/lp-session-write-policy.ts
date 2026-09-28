import { evaluateOutboundPolicy } from '@lreach/outbound-guard';

type Environment = Record<string, string | undefined>;
const DEVELOPMENT_REF = 'ulwctsnuzrcytbhsqjam';

function matchesDevelopmentKey(value: string | undefined, role: string): boolean {
  try {
    const parts = value?.split('.');
    if (!parts || parts.length !== 3 || !parts.every(Boolean)) return false;
    const body = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return body.ref === DEVELOPMENT_REF && body.role === role;
  } catch {
    return false;
  }
}

/** The JWT payload checks identify the target; Supabase verifies the signature. */
export function evaluateLpSessionWritePolicy(
  environment: Environment,
  { server = false, method = 'POST' }: { server?: boolean; method?: string } = {},
): { allowed: boolean; reason: string } {
  const production = evaluateOutboundPolicy(environment);
  if (production.allowed) return production;

  if (environment.LP_DEV_SESSION_WRITES_ENABLED !== 'true' ||
      environment.LREACH_DEPLOY_ENV !== 'staging' ||
      environment.VERCEL_ENV !== 'preview' ||
      environment.OUTBOUND_DELIVERY_ENABLED !== 'false' ||
      environment.OUTBOUND_DISABLED !== 'true') {
    return { allowed: false, reason: 'development-session-write-not-enabled' };
  }
  if (!['POST', 'PATCH'].includes(method.toUpperCase())) {
    return { allowed: false, reason: 'development-session-write-method-rejected' };
  }
  const url = environment.NEXT_PUBLIC_SUPABASE_URL;
  if (url !== `https://${DEVELOPMENT_REF}.supabase.co` &&
      url !== `https://${DEVELOPMENT_REF}.supabase.co/`) {
    return { allowed: false, reason: 'development-database-url-mismatch' };
  }
  if (!matchesDevelopmentKey(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'anon') ||
      (server && !matchesDevelopmentKey(environment.SUPABASE_SERVICE_ROLE_KEY, 'service_role'))) {
    return { allowed: false, reason: 'development-database-key-mismatch' };
  }
  // Enable only after the independent DB audit proves notification triggers disabled.
  return { allowed: true, reason: 'isolated-development-session-write' };
}
