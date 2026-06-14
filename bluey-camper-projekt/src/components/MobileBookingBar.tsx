import { useContactModal } from "@/context/ContactModalContext";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileBookingBar() {
  const { openModal } = useContactModal();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 shadow-lg backdrop-blur-md md:hidden"
      role="region"
      aria-label="Rezervare rapidă"
    >
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => openModal("booking")}
          className="interactive-lift inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground"
        >
          <Phone className="size-4" aria-hidden />
          Rezervă acum
        </button>
      </div>
    </div>
  );
}
