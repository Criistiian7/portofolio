import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BarChart3, LineChart, Shield, Sparkles, Zap } from "lucide-react";
import { PRODUCT_NAME, PRODUCT_SUBTITLE, PRODUCT_TAGLINE } from "@/brand/constants";
import { paths } from "@/lib/paths";
import { useChartSeedQuery } from "@/hooks/queries/useChartSeedQuery";
import { DocumentTitle } from "@/components/system/DocumentTitle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrustedByStrip } from "@/components/marketing/TrustedByStrip";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { StaggerChildren, StaggerItem } from "@/components/motion/StaggerChildren";
import { FloatingOrbs } from "@/components/motion/FloatingOrbs";
import { PageTransition } from "@/components/motion/PageTransition";

const features = [
  {
    title: "Rollups without the rigging",
    body: "Static seed + Firestore aggregates share the same chart primitives—swap data without redesigning cards.",
    icon: LineChart,
  },
  {
    title: "Operator-grade shell",
    body: "Tables, Kanban, invoices, and activity stay owner-scoped—portfolio realism without a bespoke backend.",
    icon: BarChart3,
  },
  {
    title: "Motion with manners",
    body: "Framer Motion accents across marketing and auth; everything steps down when prefers-reduced-motion is on.",
    icon: Zap,
  },
  {
    title: "Firebase or mock",
    body: "Flip `VITE_ENABLE_MOCK` and ship demos without keys; turn Firebase on when you want real persistence.",
    icon: Shield,
  },
] as const;

const testimonials = [
  { quote: "We finally have a dashboard story that looks like production—not a toy chart.", who: "Alex, PM" },
  { quote: "Dark glass, crisp tables, and believable empty states. Exactly what recruiters scan for.", who: "Jordan, Eng Lead" },
] as const;

export default function LandingPage() {
  const seed = useChartSeedQuery();
  const reduce = useReducedMotion();

  return (
    <PageTransition>
      <DocumentTitle title={`${PRODUCT_NAME} — Revenue intelligence workspace`} />
      <section className="relative overflow-hidden bg-gradient-radial-brand">
        <FloatingOrbs className="pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:pb-24 md:pt-16">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
              Portfolio slice · Vite + Firebase optional
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="text-gradient-brand">{PRODUCT_NAME}</span>
              <span className="mt-2 block text-foreground">{PRODUCT_TAGLINE}</span>
            </h1>
            <p className="mt-5 text-balance text-base text-muted-foreground md:text-lg">{PRODUCT_SUBTITLE}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="shadow-glow">
                <Link to={paths.register}>
                  Start free <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={paths.login}>View sign-in</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Anonymous visitors stay on this landing—no forced redirect to login.
            </p>
          </motion.div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-center">
            <DashboardPreview series={seed.data?.revenueSeries ?? []} />
            <StaggerChildren className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="rounded-xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm">
                    <f.icon className="h-5 w-5 text-primary" aria-hidden />
                    <h3 className="mt-3 font-display text-sm font-semibold">{f.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{f.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      <TrustedByStrip />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <h2 className="text-center font-display text-2xl font-semibold tracking-tight">Loved by sharp operators</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t.who}
              className="rounded-xl border border-border bg-muted/15 p-6 text-sm leading-relaxed text-muted-foreground"
            >
              <p className="text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs font-medium text-primary">{t.who}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section id="faq" className="border-t border-border bg-muted/10 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight">FAQ</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Straight answers—no enterprise sales deck.</p>
          <Tabs defaultValue="product" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <TabsContent value="product" className="mt-4 space-y-3 rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Is this production-ready?</strong> It is a polished portfolio shell: real
                routing, auth gates, tables, and charts. Harden with App Check, MFA, and your own legal links.
              </p>
              <p>
                <strong className="text-foreground">Why MetricFlow?</strong> The name reflects the focus—metrics that flow from
                acquisition to renewal without leaving the shell.
              </p>
            </TabsContent>
            <TabsContent value="data" className="mt-4 space-y-3 rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Where does chart data come from?</strong> A checked-in JSON seed powers demos;
                Firestore backs domain lists when Firebase mode is enabled.
              </p>
              <p>
                <strong className="text-foreground">Can I swap warehouses?</strong> Yes—keep the chart primitives, point queries at
                your API, and preserve the UI contract.
              </p>
            </TabsContent>
            <TabsContent value="security" className="mt-4 space-y-3 rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">How is access scoped?</strong> Firestore rules pin tasks, invoices, and activity
                to `ownerId` matching the signed-in user.
              </p>
              <p>
                <strong className="text-foreground">What about GDPR links?</strong> Footer placeholders remind you to wire real
                privacy/terms URLs before production.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/25 bg-primary/5 px-6 py-12 text-center shadow-glow md:px-10">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Ship your narrative this week</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in with mock mode, record a Loom, and point hiring managers to a URL that feels like a real SaaS.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link to={paths.register}>Create workspace</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={paths.pricing}>Compare plans</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
