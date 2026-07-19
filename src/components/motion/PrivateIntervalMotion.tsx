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
        {/* The cabin video: city lights drifting past a quiet rear cabin.
            Poster-first, lazy-mounted — the mp4 only loads near the viewport. */}
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
            <h2 className="section-heading">
              A room between obligations,
              <span className="section-heading-muted"> not a ride.</span>
            </h2>
            <p className="section-subtitle mt-8 max-w-md">
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
