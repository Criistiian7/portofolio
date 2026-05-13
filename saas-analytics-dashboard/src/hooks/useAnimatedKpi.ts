import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function useAnimatedKpi(value: number, options?: { duration?: number }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(() => Math.round(value));
  const latest = useRef(display);
  latest.current = display;

  useEffect(() => {
    if (reduced) {
      const v = Math.round(value);
      setDisplay(v);
      latest.current = v;
      return;
    }
    const controls = animate(latest.current, value, {
      duration: options?.duration ?? 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const r = Math.round(v);
        latest.current = r;
        setDisplay(r);
      },
    });
    return () => controls.stop();
  }, [value, reduced, options?.duration]);

  return display;
}
