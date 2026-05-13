import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PRODUCT_NAME } from "@/brand/constants";
import { paths } from "@/lib/paths";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/motion/PageTransition";

const tiers = [
  {
    name: "Starter",
    price: "€0",
    cadence: "demo",
    blurb: "Mock auth, chart seed, and Kanban—perfect for portfolios.",
    perks: ["Owner-scoped tasks & invoices", "Static analytics seed", "Dark glass shell"],
  },
  {
    name: "Growth",
    price: "€49",
    cadence: "per month",
    blurb: "Wire Firebase and invite a small team—still a portfolio slice.",
    perks: ["Firebase Auth + Firestore", "Role-aware navigation", "CSV exports"],
    featured: true,
  },
  {
    name: "Scale",
    price: "Talk",
    cadence: "to us",
    blurb: "Placeholder tier for storytelling—swap numbers when you productize.",
    perks: ["Dedicated review", "Custom connectors", "SLA copy here"],
  },
] as const;

export default function PricingPage() {
  return (
    <PageTransition>
      <DocumentTitle title={`Pricing — ${PRODUCT_NAME}`} />
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Plans that scale with your story</h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Numbers are illustrative—treat this page as UX chrome. Engineering hiring teams care about clarity, not the literal price.
          </p>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                t.featured
                  ? "relative flex flex-col rounded-2xl border border-primary/40 bg-card/80 p-6 shadow-glow"
                  : "flex flex-col rounded-2xl border border-border bg-card/40 p-6 shadow-sm"
              }
            >
              {t.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Popular
                </span>
              ) : null}
              <h2 className="font-display text-lg font-semibold">{t.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <p className="mt-6 font-display text-4xl font-semibold tabular-nums">
                {t.price}
                <span className="ml-2 text-base font-normal text-muted-foreground">/{t.cadence}</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8 w-full" variant={t.featured ? "default" : "outline"} asChild>
                <Link to={paths.register}>Choose {t.name}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
