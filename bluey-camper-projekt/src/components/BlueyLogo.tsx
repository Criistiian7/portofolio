import { BRAND_LOGO } from "@/data/site";

type BlueyLogoProps = {
  className?: string;
  /** Înălțime fixă (px); ignorat când stretch */
  size?: number;
  /** Umple înălțimea containerului (ex. footer lângă text) */
  stretch?: boolean;
};

export function BlueyLogo({
  className = "",
  size = 48,
  stretch = false,
}: BlueyLogoProps) {
  return (
    <img
      src={BRAND_LOGO.src}
      alt={BRAND_LOGO.alt}
      className={`w-auto object-contain ${className}`}
      style={stretch ? undefined : { height: size }}
      decoding="async"
    />
  );
}
