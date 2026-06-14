import { BEDS } from "@/data/booking";
import { BedDouble, Ruler, Users } from "lucide-react";

export function BedsSection() {
  return (
    <section
      id="paturi"
      className="scroll-mt-24 bg-navy/5 py-12 sm:py-16"
      aria-labelledby="paturi-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="paturi-heading"
          className="font-display text-3xl font-bold text-navy"
        >
          Paturi
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          5 locuri de dormit în 3 zone — ideal pentru familii și grupuri mici.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {BEDS.map((bed) => (
            <article
              key={bed.id}
              className="interactive-lift relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm"
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-brand/5"
                aria-hidden
              />
              <div className="relative flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/10">
                <BedDouble className="size-6" aria-hidden />
              </div>
              <h3 className="relative mt-5 font-display text-lg font-bold text-navy">
                {bed.name}
              </h3>
              <dl className="relative mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-background/80 px-4 py-3">
                  <Ruler
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Dimensiuni
                    </dt>
                    <dd className="font-display text-base font-bold text-navy">
                      {bed.dimensions}
                    </dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-background/80 px-4 py-3">
                  <Users
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Capacitate
                    </dt>
                    <dd className="font-display text-base font-bold text-navy">
                      {bed.capacity}
                    </dd>
                  </div>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
