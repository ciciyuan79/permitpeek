import { MetadataRoute } from "next";
import { CITIES_LIST } from "@/lib/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://permitpeek.com";

  const cityUrls = CITIES_LIST.map((city) => ({
    url: `${baseUrl}/${city.stateSlug || city.state.toLowerCase()}/${city.slug}/building-permits`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...cityUrls,
  ];
}
