import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { imageAssets } from "../assets";
import { useReducedMotionPref } from "./MotionProvider";

interface PrivateOfficeProps {
  onRequestScroll: () => void;
}

const support = [
  "Named booking contact",
  "Multi-passenger coordination",
  "Vehicle and chauffeur confirmation",
  "Itinerary changes handled directly",
  "Consolidated journey records",
  "Discreet principal and guest handling"
];

export default function PrivateOffice({ onRequestScroll }: PrivateOfficeProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section id="office-section" className="scroll-mt-[72px] bg-brand-black px-4 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1440px] overflow-hidden border border-brand-cream/12 lg:grid-cols-2">
        <motion.div
          className="relative min-h-[52svh] overflow-hidden lg:min-h-[720px]"
          initial={isReduced ? false : { clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: isReduced ? 0 : 0.95, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.img
            src={imageAssets.journeyPrivateOffice}
            alt="ALAIR NOIR chauffeur coordinating a private office itinerary beside a Mercedes-Benz V-Class"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            initial={isReduced ? false : { scale: 1.035 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: isReduced ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/55 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          className="flex flex-col justify-center bg-brand-deep-forest p-7 md:p-12 lg:p-16"
          initial={isReduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: isReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">Private Office</span>
          <h2 className="mt-5 max-w-xl font-serif text-4xl font-light leading-[1.02] text-brand-ivory md:text-6xl">
            For those arranging movement for someone important.
          </h2>
          <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-brand-body md:text-base">
            A direct booking desk for executive assistants, family offices, hotels and concierge teams coordinating principals, guests and private schedules.
          </p>

          <ul className="mt-9 grid gap-4 border-t border-brand-cream/15 pt-7 sm:grid-cols-2">
            {support.map((item, index) => (
              <motion.li
                key={item}
                className="flex items-start gap-3 text-xs font-light leading-relaxed text-brand-cream/80"
                initial={isReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: isReduced ? 0 : 0.4, delay: isReduced ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" strokeWidth={1.5} aria-hidden="true" />
                {item}
              </motion.li>
            ))}
          </ul>

          <motion.button
            type="button"
            onClick={onRequestScroll}
            whileHover={isReduced ? undefined : "hover"}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="mt-10 flex h-12 w-fit items-center gap-5 bg-brand-gold px-6 text-[10px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-black"
          >
            Book for a client
            <motion.span variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 360, damping: 32 }}>
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
