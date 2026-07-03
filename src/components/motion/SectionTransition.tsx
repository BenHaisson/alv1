import { motion } from "motion/react";
import { useReducedMotionPref } from "../MotionProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Fade-through-black bridge between major sections: the space dips through
 * deep black while a thin gold hairline draws vertically. No bounce, no spin —
 * a quiet editorial breath. Replaces the inline SectionBridge in App.tsx.
 */
export default function SectionTransition() {
  const isReduced = useReducedMotionPref();

  return (
    <div className="relative h-16 overflow-hidden bg-brand-black md:h-24" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-deep-forest/45 to-brand-black" />
      {!isReduced && (
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ amount: 0.7, once: false }}
          transition={{ duration: 1.05, ease: EASE }}
          className="absolute bottom-3 left-1/2 top-3 w-px origin-top bg-brand-gold/25"
        />
      )}
    </div>
  );
}
