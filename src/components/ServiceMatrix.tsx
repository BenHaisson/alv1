import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SERVICE_MATRIX } from "../data";
import { CornerMarkers, useMediaQuery, useReducedMotionPref } from "./MotionProvider";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ServiceMatrix() {
  const [activeIndex, setActiveIndex] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isReduced = useReducedMotionPref();

  return (
    <section className="relative overflow-hidden border-b border-brand-cream/10 bg-brand-black px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
              03 / Service Matrix
            </span>
            <h2 className="font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
              Every movement, <span className="font-light italic text-brand-stone">one standard.</span>
            </h2>
            <p className="mt-6 text-sm font-light leading-relaxed text-brand-stone md:text-base">
              Six operational classes cover what ALAIR NOIR handles — from flight-aware airport
              pickups to protocol-sensitive delegation movement. Select a class to unlock its scope.
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
            0{activeIndex + 1} / 06 ACTIVE
          </span>
        </div>

        <div className={isDesktop ? "flex h-[480px] gap-3" : "flex flex-col gap-3"}>
          {SERVICE_MATRIX.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                aria-expanded={isActive}
                initial={isReduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: isReduced ? 0 : index * 0.08, ease: EASE_OUT }}
                style={
                  isDesktop
                    ? {
                        flexGrow: isActive ? 3.4 : 1,
                        flexBasis: 0,
                        transition: isReduced
                          ? undefined
                          : "flex-grow 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
                      }
                    : undefined
                }
                className={`group relative cursor-pointer overflow-hidden border text-left transition-colors duration-500 focus:outline-none focus-visible:border-brand-gold ${
                  isActive
                    ? "border-brand-gold/50 bg-gradient-to-b from-brand-deep-forest/80 to-brand-black shadow-[0_0_40px_rgba(205,162,80,0.06)]"
                    : "border-brand-cream/10 bg-brand-deep-forest/30 hover:border-brand-cream/25"
                } ${isDesktop ? "min-w-0" : ""}`}
              >
                {isActive && <CornerMarkers />}

                {/* Unlock hairline */}
                <motion.span
                  aria-hidden="true"
                  initial={isReduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: isReduced ? 0 : 0.3 + index * 0.08, ease: EASE_OUT }}
                  className={`absolute left-0 right-0 top-0 h-px origin-left ${
                    isActive ? "bg-brand-gold/70" : "bg-brand-cream/15"
                  }`}
                />

                <div className="flex h-full flex-col justify-between p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`text-[10px] font-mono tracking-[0.26em] ${
                        isActive ? "text-brand-gold" : "text-brand-stone/70"
                      }`}
                    >
                      {item.number}
                    </span>
                    <span
                      className={`hidden text-[9px] font-mono uppercase tracking-[0.22em] md:block ${
                        isActive ? "text-brand-gold/80" : "text-brand-stone/40"
                      }`}
                    >
                      {isActive ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>

                  {/* Collapsed label (desktop, inactive): rotated title */}
                  {isDesktop && !isActive && (
                    <h3 className="origin-bottom-left -rotate-90 translate-y-2 whitespace-nowrap font-serif text-xl font-light uppercase tracking-[0.12em] text-brand-ivory/80">
                      {item.title}
                    </h3>
                  )}

                  {/* Expanded content */}
                  {(!isDesktop || isActive) && (
                    <div className="mt-6">
                      <span className="mb-3 block text-[10px] font-mono uppercase tracking-[0.24em] text-brand-stone">
                        {item.tagline}
                      </span>
                      <h3 className="font-serif text-2xl font-light uppercase leading-tight tracking-[0.08em] text-brand-ivory md:text-3xl">
                        {item.title}
                      </h3>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.ul
                            initial={isReduced ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={isReduced ? undefined : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: EASE_OUT }}
                            className="mt-5 space-y-2 overflow-hidden"
                          >
                            {item.details.map((detail, detailIndex) => (
                              <motion.li
                                key={detail}
                                initial={isReduced ? false : { opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.45,
                                  delay: isReduced ? 0 : 0.15 + detailIndex * 0.07,
                                  ease: EASE_OUT
                                }}
                                className="flex items-center gap-3 text-xs font-light text-brand-ivory/80 md:text-sm"
                              >
                                <span className="h-px w-4 shrink-0 bg-brand-gold/50" />
                                <span>{detail}</span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
