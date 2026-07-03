import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { FLEET_REVEAL } from "../../data/visualJourney";
import { useMediaQuery, useReducedMotionPref, CornerMarkers } from "../MotionProvider";
import MotionImage from "./MotionImage";

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
        <div className="max-w-2xl">
          <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
            The Fleet
          </span>
          <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl">
            Two cabins.
            <span className="italic text-brand-stone"> One standard.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {FLEET_REVEAL.map((vehicle, index) => {
            const isFirst = index === 0;
            return (
              <motion.article
                key={vehicle.id}
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
                <MotionImage
                  src={vehicle.image}
                  alt={vehicle.name}
                  reveal={isFirst ? "up" : "left"}
                  delay={isReduced ? 0 : index * 0.18}
                  className="aspect-[16/10]"
                  imgClassName="brightness-[0.92] contrast-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                <div className="flex flex-col gap-3 p-6 md:p-8">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                    {vehicle.role}
                  </span>
                  <h3 className="font-serif text-2xl font-light text-brand-ivory md:text-3xl">
                    {vehicle.name}
                  </h3>
                  <p className="max-w-md text-sm font-light leading-relaxed text-brand-stone">
                    {vehicle.line}
                  </p>
                  {onRequestScroll && (
                    <button
                      type="button"
                      onClick={() => onRequestScroll(vehicle.name)}
                      className="mt-3 flex w-fit cursor-pointer items-center gap-3 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-cream/80 transition-colors duration-300 hover:text-brand-gold focus:outline-none"
                    >
                      <span className="h-px w-8 bg-brand-gold/50" />
                      Request this cabin
                    </button>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-10 max-w-xl text-sm font-light leading-relaxed text-brand-muted-stone">
          Full specifications, interiors, and vehicle selection below.
        </p>
      </div>
    </section>
  );
}
