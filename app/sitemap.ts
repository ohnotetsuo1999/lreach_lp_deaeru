import type { MetadataRoute } from "next";
import { getAllDeaeruArticles } from "@/lib/deaeru-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://deaeru-agent.jp";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/media/`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const articles = getAllDeaeruArticles();
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/media/${article.slug}/`,
    lastModified: article.date,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
