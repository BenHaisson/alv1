import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { HEADING_REVEAL_VARIANTS, MOTION_EASE, REVEAL_VARIANTS, STAGGER_GROUP_VARIANTS } from "../lib/motion";
import { useReducedMotionPref } from "./MotionProvider";

interface PreFooterRequestProps {
  onRequestRoute: () => void;
}

const INCLUDED_ITEMS = [
  "Airport handling included",
  "Flight monitoring included",
  "Complimentary waiting period",
  "Taxes and standard fees included"
];

export default function PreFooterRequest({ onRequestRoute }: PreFooterRequestProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-deep-forest px-6 py-20 md:px-12 md:py-28 lg:px-24 luxury-noise">
      <motion.div
        className="mx-auto max-w-6xl text-center"
        initial={isReduced ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, amount: 0.36 }}
        variants={STAGGER_GROUP_VARIANTS}
      >
        <motion.h2
          variants={HEADING_REVEAL_VARIANTS}
          className="section-heading mx-auto max-w-5xl"
        >
          Tell us where and when.
          <span className="section-heading-muted block">We will prepare the rest.</span>
        </motion.h2>

        <motion.p
          variants={REVEAL_VARIANTS}
          className="section-subtitle mx-auto mt-8 max-w-2xl"
        >
          Receive a fixed quotation before confirmation, with no taxi-style live meter
          and no uncertainty at arrival.
        </motion.p>

        <motion.div
          variants={REVEAL_VARIANTS}
          className="mt-12 grid border-y border-brand-cream/14 md:grid-cols-4"
        >
          {INCLUDED_ITEMS.map((item, index) => (
            <div
              key={item}
              className={`flex min-h-24 items-center justify-center px-5 py-7 ${
                index > 0 ? "border-t border-brand-cream/14 md:border-l md:border-t-0" : ""
              }`}
            >
              <span className="max-w-[18ch] text-[10px] font-mono uppercase leading-5 tracking-[0.22em] text-brand-cream">
                {item}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={REVEAL_VARIANTS}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            type="button"
            onClick={onRequestRoute}
            whileHover={isReduced ? undefined : { y: -2, backgroundColor: "#F6F2E9" }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.48, ease: MOTION_EASE }}
            className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-6 bg-brand-gold px-8 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-brand-black sm:w-auto"
          >
            Request your route
            <ArrowRight className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
          </motion.button>

          <motion.a
            href="https://wa.me/41772870956"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={isReduced ? undefined : { y: -2, borderColor: "rgba(214, 199, 176,0.55)" }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ duration: 0.48, ease: MOTION_EASE }}
            className="inline-flex min-h-14 w-full items-center justify-center border border-brand-cream/25 px-8 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-brand-cream sm:w-auto"
          >
            WhatsApp the desk
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
