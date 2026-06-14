import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useContactModal } from "@/context/ContactModalContext";
import type { ContactIntent } from "@/data/site";
import { Phone } from "lucide-react";

type ContactButtonProps = {
  size?: "sm" | "lg";
  variant?: "brand" | "light";
  intent?: ContactIntent;
  label?: string;
  className?: string;
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

const variantClasses = {
  brand: "bg-brand text-brand-foreground hover:bg-brand-deep",
  light:
    "bg-card text-brand shadow-md hover:bg-background hover:text-brand-deep",
} as const;

const defaultLabels: Record<ContactIntent, string> = {
  booking: "Rezervă acum",
  mission: "Contactează-ne",
};

export function ContactButton({
  size = "sm",
  variant = "brand",
  intent = "mission",
  label,
  className = "",
}: ContactButtonProps) {
  const { openModal } = useContactModal();
  const iconClass =
    variant === "light" ? "text-brand" : "text-brand-foreground";
  const buttonLabel = label ?? defaultLabels[intent];

  return (
    <button
      type="button"
      onClick={() => openModal(intent)}
      className={`interactive-lift inline-flex items-center justify-center gap-2 rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span className="inline-flex items-center gap-1.5" aria-hidden>
        <Phone className={`size-4 shrink-0 ${iconClass}`} />
        <WhatsAppIcon
          className="size-4 shrink-0"
          accent={variant === "brand"}
        />
      </span>
      {buttonLabel}
    </button>
  );
}
