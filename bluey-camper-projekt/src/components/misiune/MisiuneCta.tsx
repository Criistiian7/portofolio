import { ContactButton } from "@/components/ContactButton";
import { SITE } from "@/data/site";

export function MisiuneCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="interactive-lift rounded-3xl bg-accent px-6 py-10 text-center text-accent-foreground shadow-lg sm:px-12">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Vrei să ne susții sau să călătorești cu noi?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-accent-foreground/90">
          Sună sau lasă-ne un mesaj pe WhatsApp — {SITE.phoneDisplay}. Îți
          răspundem cu detalii despre călătorii și despre cum poți contribui la
          misiunea {SITE.brand}.
        </p>
        <div className="mt-8 flex justify-center">
          <ContactButton size="lg" variant="light" />
        </div>
      </div>
    </section>
  );
}
