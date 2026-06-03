import type { SiteImage } from "@/types/image";

type StaticImageProps = {
  image: SiteImage;
  className?: string;
  width?: number;
  height?: number;
  /** LCP hero — prioritate încărcare */
  priority?: boolean;
};

export function StaticImage({
  image,
  className = "",
  width = image.width ?? 480,
  height = image.height ?? 360,
  priority = false,
}: StaticImageProps) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}
