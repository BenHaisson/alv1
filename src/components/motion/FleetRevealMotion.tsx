import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { FLEET_REVEAL } from "../../data/visualJourney";
import { useMediaQuery, useReducedMotionPref, CornerMarkers } from "../MotionProvider";
import MotionImage from "./MotionImage";
import CinematicVideoBackground from "./CinematicVideoBackground";
import { MOTION_EASE, PREMIUM_SPRING, REVEAL_VARIANTS, STAGGER_GROUP_VARIANTS } from "../../lib/motion";

interface FleetRevealMotionProps {
  onRequestScroll?: (vehicleName?: string) => void;
}

/**
 * Section 04 opener — the fleet as a product reveal, not a catalog.
 * The two vehicle cards enter overlapped in the centre and separate into a
 * side-by-side layout as the section scrolls into view (transform/opacity
 * only). Each image reveals through a mask and settles from 1.08 to 1.0.
 * BMW leads, the V-Class follows. Detailed specs remain in FleetControlSlider
 * directly below. Content lives in FLEET_REVEAL (src/data/visualJourney.ts).
 */
export default function FleetRevealMotion({ onRequestScroll }: FleetRevealMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isReduced = useReducedMotionPref();
  const isWide = useMediaQuery("(min-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.25"]
  });
  const separation = useSpring(scrollYProgress, { stiffness: 70, damping: 24, restDelta: 0.001 });

  // Cards start overlapped toward the centre and separate outward.
  const leftX = useTransform(separation, [0, 1], ["16%", "0%"]);
  const rightX = useTransform(separation, [0, 1], ["-16%", "0%"]);
  const rightOpacity = useTransform(separation, [0, 0.35, 1], [0, 0.2, 1]);

  const animateSeparation = !isReduced && isWide;

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-brand-cream/10 bg-brand-black px-6 py-24 luxury-noise md:px-12 md:py-32 lg:px-24"
      aria-label="The ALAIR NOIR fleet"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-2xl"
          initial={isReduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={STAGGER_GROUP_VARIANTS}
        >
          <motion.h2
            variants={REVEAL_VARIANTS}
            className="section-heading"
          >
            Choose your cabin.
          </motion.h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {FLEET_REVEAL.map((vehicle, index) => {
            const isFirst = index === 0;
            return (
              <motion.div
                key={vehicle.id}
                initial={isReduced ? false : { opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: isReduced ? 0 : index * 0.12, ease: MOTION_EASE }}
              >
                <motion.article
                whileHover={isReduced ? undefined : { y: -4 }}
                transition={PREMIUM_SPRING}
                style={
                  animateSeparation
                    ? isFirst
                      ? { x: leftX }
                      : { x: rightX, opacity: rightOpacity }
                    : undefined
                }
                className="group relative border border-brand-cream/12 bg-brand-deep-forest/40"
              >
                <CornerMarkers tone="cream" />
                {vehicle.video ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <CinematicVideoBackground
                      slot={vehicle.video}
                      overlay={false}
                      mediaClassName="brightness-[0.92] contrast-[1.08]"
                    />
                  </div>
                ) : (
                  <MotionImage
                    src={vehicle.image}
                    alt={vehicle.name}
                    reveal={isFirst ? "up" : "left"}
                    delay={isReduced ? 0 : index * 0.18}
                    className="aspect-[16/10]"
                    imgClassName="brightness-[0.92] contrast-[1.08]"
                  />
                )}

                <div className="flex flex-col gap-4 p-6 md:p-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    {vehicle.role}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-brand-ivory md:text-3xl">
                    {vehicle.name}
                  </h3>
                  <p className="max-w-md text-sm font-light leading-relaxed text-brand-stone">
                    {vehicle.line}
                  </p>

                  <div className="mt-1">
                    <span className="mb-3 block text-[9px] font-mono uppercase tracking-[0.24em] text-brand-muted-stone">
                      Best for
                    </span>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {vehicle.bestFor.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-xs font-light text-brand-ivory/80"
                        >
                          <span className="h-px w-3.5 shrink-0 bg-brand-cream/30" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {onRequestScroll && (
                    <motion.button
                      type="button"
                      onClick={() => onRequestScroll(vehicle.name)}
                      initial="rest"
                      animate="rest"
                      whileHover={isReduced ? undefined : "hover"}
                      variants={{
                        rest: { y: 0, borderColor: "rgba(234,222,206,0.25)", color: "#EADECE" },
                        hover: { y: -2, borderColor: "rgba(234,222,206,0.6)", color: "#FAF8F5" }
                      }}
                      whileTap={isReduced ? undefined : { scale: 0.985 }}
                      transition={PREMIUM_SPRING}
                      className="mt-4 flex w-fit cursor-pointer items-center gap-3 border border-brand-cream/25 px-6 py-3 text-[10px] font-mono uppercase tracking-[0.22em] text-brand-cream focus:outline-none focus-visible:border-brand-gold"
                    >
                      <span>{vehicle.cta}</span>
                      <motion.span
                        aria-hidden="true"
                        variants={{
                          rest: { x: 0 },
                          hover: { x: 4 }
                        }}
                        transition={PREMIUM_SPRING}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  )}
                </div>
                </motion.article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
