import { SITE } from "@/data/site";
import { absoluteUrl } from "@/lib/absoluteUrl";

type SeoConfig = {
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
};

type PageHeadOptions = {
  /** Hero LCP — preload în <head> (doar pe ruta curentă) */
  preloadImages?: readonly string[];
};

export function buildPageHead(
  { title, description, ogImage, ogImageAlt }: SeoConfig,
  options?: PageHeadOptions,
) {
  const ogImageUrl = absoluteUrl(ogImage);
  const twitterHandle = SITE.social.instagram.handle.replace(/^@/, "");

  const links =
    options?.preloadImages?.map((href) => ({
      rel: "preload" as const,
      as: "image" as const,
      href,
      type: "image/jpeg",
      fetchPriority: "high" as const,
    })) ?? [];

  return {
    links,
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { name: "author", content: SITE.brand },
      { property: "og:site_name", content: SITE.brand },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImageUrl },
      { property: "og:image:alt", content: ogImageAlt },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ro_RO" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: `@${twitterHandle}` },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImageUrl },
      { name: "twitter:image:alt", content: ogImageAlt },
    ],
  };
}
