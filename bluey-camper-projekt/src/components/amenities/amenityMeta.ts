import { AMENITY_GROUPS } from "@/data/booking";
import type { LucideIcon } from "lucide-react";
import {
  Crown,
  Package,
  Sparkles,
  Sun,
  Tent,
  Wind,
  Zap,
  Flame,
  Bike,
  BedDouble,
  Camera,
  Users,
} from "lucide-react";

export type AmenityGroupId = (typeof AMENITY_GROUPS)[number]["id"];

export const AMENITY_GROUP_META: Record<
  AmenityGroupId,
  {
    icon: LucideIcon;
    accentClass: string;
    glowClass: string;
    chipClass: string;
  }
> = {
  premium: {
    icon: Crown,
    accentClass: "bg-brand/10 text-brand",
    glowClass: "from-brand/20 via-brand/5 to-transparent",
    chipClass: "bg-brand/10 text-navy border-brand/20",
  },
  fotovoltaic: {
    icon: Sun,
    accentClass: "bg-amber-100 text-amber-700",
    glowClass: "from-amber-200/50 via-amber-50/30 to-transparent",
    chipClass: "bg-amber-50 text-amber-950 border-amber-200/60",
  },
  camping: {
    icon: Tent,
    accentClass: "bg-forest/10 text-forest",
    glowClass: "from-forest/20 via-forest/5 to-transparent",
    chipClass: "bg-forest/10 text-navy border-forest/20",
  },
  alte: {
    icon: Package,
    accentClass: "bg-violet-100 text-violet-700",
    glowClass: "from-violet-200/40 via-violet-50/20 to-transparent",
    chipClass: "bg-violet-50 text-violet-950 border-violet-200/50",
  },
};

export const AMENITY_PREVIEW_ITEMS: {
  label: string;
  icon: LucideIcon;
  groupId: AmenityGroupId;
}[] = [
  { label: "Aer condiționat cabină șofer", icon: Wind, groupId: "premium" },
  { label: "Panouri solare + baterie 200 Ah+", icon: Sun, groupId: "fotovoltaic" },
  { label: "Încălzire TRUMA pe gaz", icon: Flame, groupId: "premium" },
  { label: "Marchiză exterioară 4 m", icon: Tent, groupId: "premium" },
  { label: "Suport 3 biciclete", icon: Bike, groupId: "premium" },
  { label: "Lenjerii și veselă incluse", icon: BedDouble, groupId: "alte" },
  { label: "Cameră marșarier", icon: Camera, groupId: "premium" },
  { label: "5 locuri · Fiat Ducato 2026", icon: Users, groupId: "premium" },
];

export { Sparkles };
