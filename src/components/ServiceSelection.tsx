import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface ServiceSelectionProps {
  onSelect: () => void;
}

const services = [
  {
    label: "Air & private aviation",
    title: "Private Arrivals",
    copy: "Flight-aware timing, luggage handling and direct chauffeur communication.",
    desktop: imageAssets.journeyPrivateArrivals,
    mobile: imageAssets.journeyPrivateArrivals,
    position: "center"
  },
  {
    label: "Retained chauffeur",
    title: "Executive Day",
    copy: "A vehicle held for meetings, waiting periods and schedule changes.",
    desktop: imageAssets.journeyExecutiveDay,
    mobile: imageAssets.journeyExecutiveDay,
    position: "center"
  },
  {
    label: "Switzerland & Europe",
    title: "Private Routes",
    copy: "Zürich, alpine destinations and selected European journeys.",
    desktop: imageAssets.journeyPrivateRoutes,
    mobile: imageAssets.journeyPrivateRoutes,
    position: "center"
  },
  {
    label: "Mercedes V-Class",
    title: "Group & Family Travel",
    copy: "Room for passengers, luggage, hotels, events and family offices.",
    desktop: imageAssets.journeyGroupFamily,
    mobile: imageAssets.journeyGroupFamily,
    position: "center"
  }
];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ServiceSelection({ onSelect }: ServiceSelectionProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section id="services-section" className="scroll-mt-[72px] bg-brand-black px-4 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          className="mb-10 flex flex-col justify-between gap-5 border-b border-brand-cream/12 pb-8 md:mb-12 md:flex-row md:items-end"
          initial={isReduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: isReduced ? 0 : 0.6, ease: EASE }}
        >
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">Choose your service</span>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl font-light leading-none text-brand-ivory md:text-6xl">
              What can we arrange?
            </h2>
          </div>
          <p className="max-w-sm text-sm font-light leading-relaxed text-brand-stone">
            One booking desk, four precise ways to move.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
          initial={isReduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{ visible: { transition: { staggerChildren: isReduced ? 0 : 0.08 } } }}
        >
          {services.map((service) => (
            <motion.button
              key={service.title}
              type="button"
              onClick={onSelect}
              className="group relative h-[74svh] min-h-[560px] overflow-hidden border border-brand-cream/10 text-left md:h-[64vh] md:min-h-[560px]"
              variants={{
                hidden: { opacity: 0, y: 34, clipPath: "inset(12% 0 0 0)" },
                visible: { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }
              }}
              whileHover={isReduced ? undefined : "hover"}
              whileTap={isReduced ? undefined : { scale: 0.992 }}
              transition={{ duration: isReduced ? 0 : 0.78, ease: EASE }}
            >
              <motion.picture className="absolute inset-0" variants={{ hover: { scale: 1.035 } }} transition={{ type: "spring", stiffness: 120, damping: 28 }}>
                <source media="(max-width: 767px)" srcSet={service.mobile} />
                <img
                  src={service.desktop}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: service.position }}
                />
              </motion.picture>
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_34%,rgba(6,9,7,0.12)_50%,rgba(6,9,7,0.94)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-mono uppercase tracking-[0.22em] text-brand-gold">{service.label}</span>
                  <motion.span variants={{ hover: { x: 3, y: -3 } }} transition={{ type: "spring", stiffness: 340, damping: 30 }}>
                    <ArrowUpRight className="h-4 w-4 text-brand-cream" strokeWidth={1.4} aria-hidden="true" />
                  </motion.span>
                </div>
                <h3 className="mt-3 font-serif text-[2rem] font-light leading-[0.98] text-brand-ivory">{service.title}</h3>
                <p className="mt-4 max-w-[30ch] text-sm font-light leading-relaxed text-brand-cream/72">{service.copy}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
