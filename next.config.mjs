import { withAxiom } from "next-axiom";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {cpus: 2},
  outputFileTracingIncludes: {"/deaeru/*/*": ["./issued/**/*.json"]},
  async rewrites() {
    const base=process.env.NEXT_PUBLIC_LREACH_BACKEND_URL;
    if(!base)throw new Error('NEXT_PUBLIC_LREACH_BACKEND_URL is required');
    const url=new URL(base);
    if(url.protocol!=='https:' && !(url.protocol==='http:' && ['127.0.0.1','localhost'].includes(url.hostname)))throw new Error('Backend must use HTTPS');
    return { fallback: [{source:'/api/:path*',destination:url.origin+'/api/:path*'}] };
  },
  trailingSlash: true,
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_LP_DEV_SESSION_WRITES_ENABLED:
      process.env.LP_DEV_SESSION_WRITES_ENABLED ?? "false",
    // Non-secret build-time safety state used by the browser Supabase guard.
    NEXT_PUBLIC_LREACH_DEPLOY_ENV:
      process.env.LREACH_DEPLOY_ENV ?? "unknown",
    NEXT_PUBLIC_OUTBOUND_DELIVERY_ENABLED:
      process.env.OUTBOUND_DELIVERY_ENABLED ?? "false",
    NEXT_PUBLIC_OUTBOUND_DISABLED:
      process.env.OUTBOUND_DISABLED ?? "true",
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV ?? "unknown",
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/*/**",
      },
      {
        protocol: "https",
        hostname: "deaeru-agent.jp",
        pathname: "/ogp/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.deaeru-agent.jp" }],
        destination: "https://deaeru-agent.jp/:path*",
        permanent: true,
      },
      {
        source: "/articles",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/articles/:path*",
        destination: "/media/:path*",
        permanent: true,
      },
    ];
  },
};

export default withAxiom(nextConfig);
