import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface RouteNetworkProps {
  onRequest: () => void;
}

const destinations = [
  { name: "Zürich", x: 42, y: 42, delay: 0.18 },
  { name: "Basel", x: 18, y: 21, delay: 0.34 },
  { name: "Lucerne", x: 39, y: 58, delay: 0.42 },
  { name: "Davos", x: 72, y: 43, delay: 0.5 },
  { name: "St. Moritz", x: 75, y: 67, delay: 0.58 },
  { name: "Geneva", x: 10, y: 80, delay: 0.66 },
  { name: "Milan", x: 61, y: 91, delay: 0.74 },
  { name: "Munich", x: 92, y: 18, delay: 0.82 }
];

const paths = [
  "M42 42 C31 33 25 25 18 21",
  "M42 42 C40 48 39 53 39 58",
  "M42 42 C53 37 63 37 72 43",
  "M42 42 C56 52 67 59 75 67",
  "M42 42 C30 58 18 70 10 80",
  "M42 42 C52 59 58 76 61 91",
  "M42 42 C63 29 79 21 92 18"
];

export default function RouteNetwork({ onRequest }: RouteNetworkProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section id="routes-section" className="scroll-mt-[72px] overflow-hidden bg-brand-deep-forest px-4 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-16">
        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: isReduced ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">Routes</span>
          <h2 className="mt-5 max-w-xl font-serif text-4xl font-light leading-[1.02] text-brand-ivory md:text-6xl">
            From Zürich to wherever required.
          </h2>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-brand-body md:text-base">
            City arrivals, alpine destinations and selected European journeys—prepared as a fixed private quotation.
          </p>
          <div className="mt-8 border-y border-brand-cream/15 py-5">
            <p className="font-serif text-xl font-light italic text-brand-cream/82">
              Route received. A fixed quotation will be confirmed before the journey.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onRequest}
            whileHover={isReduced ? undefined : "hover"}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="mt-8 flex h-12 items-center gap-5 border border-brand-cream/30 px-6 text-[10px] font-mono uppercase tracking-[0.18em] text-brand-ivory"
          >
            Request a route
            <motion.span variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 360, damping: 32 }}>
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.div
          className="relative aspect-[4/5] overflow-hidden border border-brand-cream/12 bg-[#09150f] md:aspect-[16/10]"
          initial={isReduced ? false : { opacity: 0, clipPath: "inset(0 0 14% 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: isReduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Route network from Zürich across Switzerland and Europe"
        >
          <motion.img
            src={imageAssets.journeyRoutesMap}
            alt="Black BMW i7 travelling above Lake Zürich toward the Swiss Alps"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            initial={isReduced ? false : { scale: 1.035 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: isReduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-brand-deep-forest/48" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(234,222,206,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(234,222,206,0.08)_1px,transparent_1px)] [background-size:10%_10%]" />
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-hidden="true">
            {paths.map((path, index) => (
              <motion.path
                key={path}
                d={path}
                fill="none"
                stroke="rgba(205,162,80,0.68)"
                strokeWidth="0.32"
                vectorEffect="non-scaling-stroke"
                initial={isReduced ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: isReduced ? 0 : 1.05, delay: isReduced ? 0 : 0.2 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>

          {destinations.map((destination) => (
            <motion.div
              key={destination.name}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${destination.x}%`, top: `${destination.y}%` }}
              initial={isReduced ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: "spring", stiffness: 150, damping: 28, delay: isReduced ? 0 : destination.delay }}
            >
              <span className="block h-2 w-2 rounded-full border border-brand-gold bg-brand-deep-forest shadow-[0_0_0_4px_rgba(205,162,80,0.1)]" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[8px] font-mono uppercase tracking-[0.13em] text-brand-cream md:text-[10px]">
                {destination.name}
              </span>
            </motion.div>
          ))}

          <div className="absolute bottom-5 left-5 text-[8px] font-mono uppercase tracking-[0.18em] text-brand-stone md:bottom-7 md:left-7 md:text-[9px]">
            Schematic service network · routes confirmed individually
          </div>
        </motion.div>
      </div>
    </section>
  );
}
