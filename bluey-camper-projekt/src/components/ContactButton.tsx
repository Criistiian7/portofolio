import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { useContactModal } from "@/context/ContactModalContext";
import type { ContactIntent } from "@/data/site";
import { Phone } from "lucide-react";

type ContactButtonProps = {
  size?: "sm" | "lg";
  variant?: "brand" | "light" | "gradient";
  intent?: ContactIntent;
  label?: string;
  /** Hide WhatsApp icon below `sm` — useful when modal already offers WhatsApp */
  iconLayout?: "default" | "phone-only-mobile";
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
  gradient:
    "bg-gradient-to-br from-brand to-brand-deep text-brand-foreground shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40",
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
  iconLayout = "default",
  className = "",
}: ContactButtonProps) {
  const { openModal } = useContactModal();
  const iconClass =
    variant === "light" ? "text-brand" : "text-brand-foreground";
  const whatsappAccent = variant === "brand" || variant === "gradient";
  const buttonLabel = label ?? defaultLabels[intent];
  const hideWhatsappOnMobile = iconLayout === "phone-only-mobile";

  return (
    <button
      type="button"
      onClick={() => openModal(intent)}
      className={`interactive-lift inline-flex items-center justify-center gap-2 rounded-full font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      <span className="inline-flex items-center gap-1.5" aria-hidden>
        <Phone className={`size-4 shrink-0 ${iconClass}`} />
        <WhatsAppIcon
          className={`size-4 shrink-0 ${hideWhatsappOnMobile ? "hidden sm:inline-flex" : ""}`}
          accent={whatsappAccent}
        />
      </span>
      {buttonLabel}
    </button>
  );
}
