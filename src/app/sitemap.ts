import type { MetadataRoute } from "next";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getBrandSlugs } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [routes.home, ...getBrandSlugs().map(routes.brand)];
  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    changeFrequency: "monthly",
    priority: path === routes.home ? 1 : 0.8,
  }));
}
