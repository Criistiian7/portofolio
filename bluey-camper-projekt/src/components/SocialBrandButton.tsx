import { SOCIAL_BRAND } from "@/data/site";
import { Facebook, Instagram } from "lucide-react";
import type { ReactNode } from "react";

type SocialNetwork = "facebook" | "instagram";

type SocialBrandButtonProps = {
  network: SocialNetwork;
  href: string;
  label: string;
  variant?: "icon" | "pill";
  children?: ReactNode;
};

const iconOnlyClass =
  "interactive-lift flex size-10 items-center justify-center rounded-full text-white hover:brightness-95 hover:scale-105";

const pillClass =
  "interactive-lift inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white hover:brightness-95";

export function SocialBrandButton({
  network,
  href,
  label,
  variant = "icon",
  children,
}: SocialBrandButtonProps) {
  const isIcon = variant === "icon";
  const baseClass = isIcon ? iconOnlyClass : pillClass;

  const style =
    network === "facebook"
      ? { backgroundColor: SOCIAL_BRAND.facebook }
      : {
          backgroundImage: `linear-gradient(135deg, ${SOCIAL_BRAND.instagram.from}, ${SOCIAL_BRAND.instagram.via}, ${SOCIAL_BRAND.instagram.to})`,
        };

  const Icon = network === "facebook" ? Facebook : Instagram;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
      style={style}
      aria-label={label}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      {!isIcon && (children ?? label)}
    </a>
  );
}
