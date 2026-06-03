import { CONTACT, SITE } from "@/data/site";
import { MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactModal({ open, onClose }: ContactModalProps) {
  const callButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    callButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-md"
        aria-label="Închide dialogul"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-muted hover:bg-background hover:text-ink"
          aria-label="Închide"
        >
          <X className="size-5" aria-hidden />
        </button>

        <h2
          id="contact-modal-title"
          className="font-display pr-8 text-xl font-bold text-ink"
        >
          Contactează {SITE.brand}
        </h2>
        <p className="mt-2 text-sm text-muted">
          Alege cum vrei să ne contactezi despre călătoriile educative și
          misiunea Travel & Educate.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            ref={callButtonRef}
            href={CONTACT.tel}
            className="interactive-lift flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-semibold text-accent-foreground hover:bg-accent-deep"
          >
            <Phone className="size-5" aria-hidden />
            Sună acum!
          </a>
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-lift flex items-center justify-center gap-2 rounded-xl border-2 border-whatsapp bg-whatsapp/10 px-4 py-3 font-semibold text-ink hover:bg-whatsapp/20"
          >
            <MessageCircle className="size-5 text-whatsapp" aria-hidden />
            Lasă un mesaj
          </a>
        </div>
      </div>
    </div>
  );
}
