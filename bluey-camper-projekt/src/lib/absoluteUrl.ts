/** Origine publică (ex. https://autorulotabluey.ro) — setează VITE_SITE_URL la deploy */
export function getSiteOrigin(): string {
  const url = import.meta.env.VITE_SITE_URL;
  if (typeof url !== "string" || !url.trim()) return "";
  return url.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const origin = getSiteOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return origin ? `${origin}${normalized}` : normalized;
}
