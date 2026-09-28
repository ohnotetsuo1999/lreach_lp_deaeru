import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/apps/", "/profile/"],
      },
    ],
    sitemap: "https://deaeru-agent.jp/sitemap.xml",
    host: "https://deaeru-agent.jp",
  };
}
