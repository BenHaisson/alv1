import { motion } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TRUST_ITEMS = [
  "Swiss company identity",
  "Zürich operating base",
  "Licensed professional transport",
  "Direct WhatsApp confirmation",
  "Privacy-first handling"
];

/**
 * A compact horizontal trust strip — not a full section. Sits just before the
 * final request so the client reads five quiet proof points and moves straight
 * to booking. No paragraphs, no bento grid.
 */
export default function TrustStrip() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative border-b border-brand-cream/10 bg-brand-black px-6 py-10 md:px-12 lg:px-24 luxury-noise">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-between">
        {TRUST_ITEMS.map((item, index) => (
          <motion.span
            key={item}
            initial={isReduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: isReduced ? 0 : index * 0.07, ease: EASE }}
            className="flex items-center gap-2.5"
          >
            <span className="h-1 w-1 rounded-full bg-brand-gold/70" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-ivory/80">
              {item}
            </span>
          </motion.span>
        ))}
      </div>
    </section>
  );
}
