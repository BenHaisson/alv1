import { motion } from "motion/react";
import { ALAIR_STANDARDS } from "../data";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";
import { MOTION_EASE, REVEAL_VARIANTS, STAGGER_GROUP_VARIANTS } from "../lib/motion";

export default function StandardsSection() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="mb-14 max-w-3xl md:mb-20"
          initial={isReduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.45 }}
          variants={STAGGER_GROUP_VARIANTS}
        >
          <motion.h2
            variants={REVEAL_VARIANTS}
            className="section-heading mb-6"
          >
            Five principles <span className="section-heading-muted">behind every journey.</span>
          </motion.h2>
          <motion.p variants={REVEAL_VARIANTS} className="section-subtitle max-w-2xl">
            The difference is not only the vehicle. It is the preparation, discretion, and
            consistency around it.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ALAIR_STANDARDS.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={isReduced ? false : { opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={
                isReduced
                  ? undefined
                  : { y: -4, borderColor: "rgba(205,162,80,0.9)", backgroundColor: "rgba(13,26,19,0.4)" }
              }
              transition={{ duration: 0.9, delay: isReduced ? 0 : index * 0.1, ease: MOTION_EASE }}
              className={`group relative flex min-h-[220px] flex-col justify-between border border-brand-cream/10 bg-brand-deep-forest/20 p-7 ${
                index === 3 ? "lg:col-start-1" : ""
              }`}
            >
              <CornerMarkers />
              <div className="flex items-start justify-between">
                <span className="font-serif text-4xl font-light text-brand-gold/80">
                  {pillar.number}
                </span>
                <motion.span
                  aria-hidden="true"
                  initial={isReduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: isReduced ? 0 : 0.25 + index * 0.08, ease: MOTION_EASE }}
                  className="mt-4 h-px w-12 origin-right bg-brand-cream/25"
                />
              </div>
              <div>
                <h3 className="mb-3 font-serif text-xl font-light uppercase tracking-[0.12em] text-brand-ivory">
                  {pillar.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-brand-stone">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
