import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PRODUCT_NAME } from "@/brand/constants";

const STORAGE_KEY = "metricflow-onboarding-dismissed";

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const steps = useMemo(
    () => [
      {
        title: `Welcome to ${PRODUCT_NAME}`,
        body: "This shell pairs static chart seed with owner-scoped Firestore lists—swap either side without redesigning the UI.",
      },
      {
        title: "Fake integrations",
        body: "Visit Integrations to toggle demo connectors. Nothing leaves the browser; it is local state for storytelling.",
      },
      {
        title: "Highlights",
        body: "Try Revenue for rollups, AI Insights for static cards, and Operations for invoices, tasks, and activity feeds.",
      },
    ],
    [],
  );

  const isLast = step >= steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && dismiss()}>
      <DialogContent className="max-w-md border-border bg-glass shadow-glow">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <DialogTitle>{steps[step]?.title}</DialogTitle>
            <DialogDescription>{steps[step]?.body}</DialogDescription>
          </DialogHeader>
        </motion.div>
        <DialogFooter className="gap-2 sm:justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={dismiss}>
            Skip
          </Button>
          <div className="flex gap-2">
            {step > 0 ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                if (isLast) dismiss();
                else setStep((s) => s + 1);
              }}
            >
              {isLast ? "Done" : "Next"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
