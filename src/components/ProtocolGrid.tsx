import { motion } from "motion/react";
import { PROTOCOLS } from "../data";
import { useReducedMotionPref } from "./MotionProvider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

function VerifiedMark({ delay, isReduced }: { delay: number; isReduced: boolean }) {
  return (
    <span className="flex items-center gap-2" aria-hidden="true">
      <svg viewBox="0 0 20 20" className="h-4 w-4">
        <motion.circle
          cx="10"
          cy="10"
          r="8"
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="1"
          initial={isReduced ? false : { pathLength: 0, opacity: 0.4 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay, ease: EASE_OUT }}
        />
        <motion.path
          d="M6.5 10.2 L9 12.6 L13.6 7.6"
          fill="none"
          stroke="var(--color-brand-gold)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={isReduced ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: delay + 0.55, ease: EASE_OUT }}
        />
      </svg>
      <motion.span
        initial={isReduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4, delay: delay + 0.8 }}
        className="text-[8px] font-mono uppercase tracking-[0.28em] text-brand-gold"
      >
        Verified
      </motion.span>
    </span>
  );
}

export default function ProtocolGrid() {
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl md:mb-20">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            07 / Trust Protocol
          </span>
          <h2 className="mb-6 font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl">
            Verified where <span className="font-light italic text-brand-stone">it matters.</span>
          </h2>
          <p className="text-base font-light leading-relaxed text-brand-stone">
            Private mobility requires trust before the vehicle arrives. Every ALAIR NOIR
            journey runs on the same operational checklist — confirmed, prepared, and discreet.
          </p>
        </div>

        {/* Secure checklist grid with gold scan sweep */}
        <div className="relative">
          {!isReduced && (
            <motion.div
              aria-hidden="true"
              initial={{ x: "-12%", opacity: 0 }}
              whileInView={{ x: "112%", opacity: [0, 0.9, 0.9, 0] }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2.4, delay: 0.5, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 z-10 w-16 bg-gradient-to-r from-transparent via-brand-gold/[0.06] to-transparent"
            />
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROTOCOLS.map((protocol, index) => (
              <motion.div
                key={protocol.number}
                initial={isReduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: isReduced ? 0 : index * 0.08, ease: EASE_OUT }}
                className="relative flex min-h-[190px] flex-col justify-between border border-brand-cream/10 bg-brand-deep-forest/20 p-6"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-[0.26em] text-brand-stone/70">
                      {protocol.number} /
                    </span>
                    <VerifiedMark delay={isReduced ? 0 : 0.3 + index * 0.08} isReduced={isReduced} />
                  </div>
                  <h3 className="font-serif text-lg font-light tracking-wide text-brand-ivory">
                    {protocol.title}
                  </h3>
                </div>
                <p className="mt-4 text-xs font-light leading-relaxed text-brand-stone">
                  {protocol.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Compact legal registry strip */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-brand-cream/10 pt-8 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone/70 md:flex-row md:justify-center md:gap-8">
          <span>UID CHE-411.952.415</span>
          <span className="hidden h-1 w-1 rounded-full bg-brand-gold/50 md:block" />
          <span>Limousine Permit / Kanton Zürich</span>
          <span className="hidden h-1 w-1 rounded-full bg-brand-gold/50 md:block" />
          <span>Certified Tachograph</span>
          <span className="hidden h-1 w-1 rounded-full bg-brand-gold/50 md:block" />
          <span>Swiss Federal Passenger Compliance</span>
        </div>
      </div>
    </section>
  );
}
