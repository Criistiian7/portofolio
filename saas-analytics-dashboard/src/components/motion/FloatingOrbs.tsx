import { motion, useReducedMotion } from "framer-motion";

/** Lightweight ambient layer for hero/auth panels. Disabled when reduced motion is on. */
export function FloatingOrbs({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className={className} aria-hidden>
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[hsl(270_85%_55%/0.18)] blur-3xl"
        animate={{ x: [0, -14, 0], y: [0, 16, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
