import { motion } from "motion/react";
import { ALAIR_STANDARDS } from "../data";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TRUST_STRIP = [
  "Direct booking",
  "Clear confirmation",
  "Professional chauffeur conduct",
  "Prepared vehicle",
  "Flight-aware timing",
  "Switzerland-wide capability"
];

export default function StandardsSection() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl md:mb-20">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            The ALAIR Standard
          </span>
          <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
            Five principles <span className="font-light italic text-brand-stone">behind every journey.</span>
          </h2>
          <p className="text-base font-light leading-relaxed text-brand-body">
            The difference is not only the vehicle. It is the preparation, discretion, and
            consistency around it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ALAIR_STANDARDS.map((pillar, index) => (
            <motion.div
              key={pillar.number}
              initial={isReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: isReduced ? 0 : index * 0.08, ease: EASE_OUT }}
              className={`group relative flex min-h-[220px] flex-col justify-between border border-brand-cream/10 bg-brand-deep-forest/20 p-7 transition-colors duration-200 ease-out hover:border-brand-gold hover:bg-brand-forest-lift/40 ${
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
                  transition={{ duration: 0.8, delay: isReduced ? 0 : 0.25 + index * 0.08, ease: EASE_OUT }}
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

        {/* Trust strip — how the standard shows up in practice. */}
        <div className="mt-14 border-t border-brand-cream/10 pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {TRUST_STRIP.map((item, index) => (
              <motion.span
                key={item}
                initial={isReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: isReduced ? 0 : index * 0.06, ease: EASE_OUT }}
                className="flex items-center gap-2.5"
              >
                <span className="h-1 w-1 rounded-full bg-brand-cream/45" />
                <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-brand-ivory/80">
                  {item}
                </span>
              </motion.span>
            ))}
          </div>

          {/* Registry proof line */}
          <div className="mt-8 flex flex-col gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone/70 md:flex-row md:gap-8">
            <span>UID CHE-411.952.415</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-brand-cream/25 md:block" />
            <span>Limousine Permit / Kanton Zürich</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-brand-cream/25 md:block" />
            <span>Certified Tachograph</span>
            <span className="hidden h-1 w-1 self-center rounded-full bg-brand-cream/25 md:block" />
            <span>Swiss Federal Passenger Compliance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
