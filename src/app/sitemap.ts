import { serviceSlugs } from "@/content/services.es";
import { siteConfig } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  const serviceUrls = serviceSlugs.map((slug) => ({
    url: `${base}/servicios/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/servicios`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...serviceUrls,
    {
      url: `${base}/politica-privacidad`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
