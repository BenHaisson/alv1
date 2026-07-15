import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface ProductFleetProps {
  onSelect: (vehicleName: string) => void;
}

const vehicles = [
  {
    name: "BMW i7",
    role: "Executive electric saloon",
    exterior: imageAssets.journeyBmwI7Exterior,
    interior: imageAssets.bmwI7RearCabin,
    copy: "A quiet rear cabin for airport arrivals, business travel and private schedules.",
    specs: ["Electric", "Quiet rear cabin", "1–3 passengers", "2 large bags"],
    alt: "Fully black BMW i7 travelling through the Swiss Alps"
  },
  {
    name: "Mercedes V-Class",
    role: "Group and family movement",
    exterior: imageAssets.journeyVclass2026Exterior,
    interior: imageAssets.vclassRearCabinNight,
    copy: "Space for executive teams, families, hotel arrivals and luggage-heavy journeys.",
    specs: ["Up to 6 passengers", "5 large bags", "Flexible cabin", "Airport & hotel arrivals"],
    alt: "Black Mercedes V-Class prepared outside a luxury hotel"
  }
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ProductFleet({ onSelect }: ProductFleetProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section id="fleet-section" className="scroll-mt-[72px] bg-brand-black">
      <div className="mx-auto max-w-[1440px] px-4 pb-4 pt-24 md:px-8 md:pt-32 lg:px-12">
        <motion.div
          className="border-b border-brand-cream/12 pb-8"
          initial={isReduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: isReduced ? 0 : 0.6, ease: EASE }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">The fleet</span>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-none text-brand-ivory md:text-6xl">
            Select the cabin, not an inventory number.
          </h2>
        </motion.div>
      </div>

      {vehicles.map((vehicle, index) => (
        <article
          key={vehicle.name}
          className="mx-auto grid min-h-[100svh] max-w-[1440px] items-center gap-8 border-b border-brand-cream/10 px-4 py-20 md:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12"
        >
          <div className={`lg:col-span-8 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
            <motion.div
              className="relative aspect-[16/10] overflow-hidden"
              initial={isReduced ? false : { clipPath: index === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: isReduced ? 0 : 0.95, ease: EASE }}
            >
              <motion.img
                src={vehicle.exterior}
                alt={vehicle.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                initial={isReduced ? false : { scale: 1.035 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: isReduced ? 0 : 1.1, ease: EASE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/32 via-transparent to-transparent" />
              <motion.div
                className="absolute bottom-4 right-4 w-[38%] overflow-hidden border border-brand-cream/25 bg-brand-black p-1 md:bottom-6 md:right-6"
                initial={isReduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: isReduced ? 0 : 0.65, delay: isReduced ? 0 : 0.35, ease: EASE }}
              >
                <img src={vehicle.interior} alt={`${vehicle.name} passenger cabin`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-1" : ""}`}
            initial={isReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: isReduced ? 0 : 0.7, ease: EASE }}
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-brand-gold">{vehicle.role}</span>
            <h3 className="mt-4 font-serif text-5xl font-light leading-none text-brand-ivory md:text-6xl">{vehicle.name}</h3>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-brand-body md:text-base">{vehicle.copy}</p>
            <dl className="mt-8 grid grid-cols-2 border-t border-brand-cream/15">
              {vehicle.specs.map((spec, specIndex) => (
                <div key={spec} className={`border-b border-brand-cream/15 py-4 ${specIndex % 2 === 0 ? "pr-3" : "border-l border-brand-cream/15 pl-4"}`}>
                  <dt className="text-[10px] font-mono uppercase leading-relaxed tracking-[0.13em] text-brand-stone">{spec}</dt>
                </div>
              ))}
            </dl>
            <motion.button
              type="button"
              onClick={() => onSelect(vehicle.name)}
              whileHover={isReduced ? undefined : "hover"}
              whileTap={isReduced ? undefined : { scale: 0.985 }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              className="mt-8 flex h-12 items-center gap-5 bg-brand-gold px-6 text-[10px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-black"
            >
              Select this vehicle
              <motion.span variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 360, damping: 32 }}>
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
              </motion.span>
            </motion.button>
          </motion.div>
        </article>
      ))}
    </section>
  );
}
