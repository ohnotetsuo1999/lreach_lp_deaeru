export function connection() {
  const configured = process.env.NEXT_PUBLIC_LREACH_BACKEND_URL;
  if (!configured) throw new Error('NEXT_PUBLIC_LREACH_BACKEND_URL is required');
  const url = new URL(configured);
  if (url.protocol !== 'https:' && !(['localhost','127.0.0.1'].includes(url.hostname) && url.protocol === 'http:')) throw new Error('Backend must use HTTPS');
  return { url: `${url.origin}/api/lp/compat`, key: 'lreach-public-anon', auth: {
    ...(process.env.NEXT_PUBLIC_LREACH_AUTH_STORAGE_KEY ? {storageKey:process.env.NEXT_PUBLIC_LREACH_AUTH_STORAGE_KEY} : {}),
  }};
}
