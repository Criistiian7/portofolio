import { BOOKING_CONDITIONS, FEES } from "@/data/booking";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export function TermsSection() {
  return (
    <section
      id="conditii"
      className="scroll-mt-24 bg-forest/5 py-12 sm:py-16"
      aria-labelledby="taxe-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2
              id="taxe-heading"
              className="font-display text-3xl font-bold text-navy"
            >
              Taxe și garanție
            </h2>
            <ul className="mt-6 space-y-4">
              {FEES.map((fee) => (
                <li
                  key={fee.label}
                  className="flex items-start gap-3 rounded-xl border border-forest/20 bg-card p-4"
                >
                  <ShieldCheck
                    className="mt-0.5 size-5 shrink-0 text-forest"
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-navy">{fee.label}</p>
                    <p className="text-lg font-bold text-brand">{fee.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-navy">
              Condiții rezervare
            </h2>
            <ul className="mt-6 space-y-3">
              {BOOKING_CONDITIONS.map((condition) => (
                <li
                  key={condition}
                  className="flex items-start gap-3 text-sm text-navy"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-forest"
                    aria-hidden
                  />
                  {condition}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
