import { motion } from "motion/react";
import { CABIN_VIDEO } from "../../data/visualJourney";
import { useReducedMotionPref, CornerMarkers } from "../MotionProvider";
import CinematicVideoBackground from "./CinematicVideoBackground";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section 06 — Private Interval. The third and final approved video moment:
 * a near-still rear-cabin scene (city lights drifting, tablet glow) behind a
 * short editorial statement. No visible identity, no dramatic camera work —
 * quiet by design. Content: CABIN_VIDEO (src/data/visualJourney.ts).
 */
export default function PrivateIntervalMotion() {
  const isReduced = useReducedMotionPref();

  return (
    <section
      className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black"
      aria-label="The private interval inside the cabin"
    >
      <div className="relative h-[70vh] min-h-[520px] w-full">
        <CinematicVideoBackground slot={CABIN_VIDEO} />
        <CornerMarkers tone="cream" />

        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 pt-24 md:px-12 md:pb-20 lg:px-24">
          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl"
          >
            <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
              The Private Interval
            </span>
            <h2 className="font-serif text-3xl font-light leading-[1.1] tracking-tight text-brand-ivory md:text-5xl">
              A room between obligations,
              <span className="italic text-brand-stone"> not a ride.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-brand-ivory/80 md:text-base">
              Work, call, read, or say nothing at all. The cabin stays quiet
              enough to think, and private enough that none of it leaves
              the car.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
