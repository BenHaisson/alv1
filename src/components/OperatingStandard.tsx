import { motion } from "motion/react";
import { useReducedMotionPref } from "./MotionProvider";

const standards = [
  ["01", "Flight-aware airport pickup", "Pickup timing adjusts around the live arrival, not the timetable alone."],
  ["02", "Direct chauffeur communication", "A clear point of contact before the passenger enters the vehicle."],
  ["03", "Prepared cabin", "Clean, quiet and arranged around the passenger before every assignment."],
  ["04", "Fixed vehicle assignment", "The confirmed BMW i7 or Mercedes V-Class arrives as specified."],
  ["05", "Multi-stop schedule support", "Meetings, waiting periods and route changes remain coordinated."],
  ["06", "Discreet passenger handling", "Measured service for executives, families and protected schedules."]
];

export default function OperatingStandard() {
  const isReduced = useReducedMotionPref();

  return (
    <section id="standard-section" className="bg-brand-deep-forest px-4 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            initial={isReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: isReduced ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">The ALAIR operating standard</span>
            <h2 className="mt-5 max-w-lg font-serif text-4xl font-light leading-[1.02] text-brand-ivory md:text-6xl">
              Luxury, proven operationally.
            </h2>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-brand-body md:text-base">
              The value is not explained through ceremony. It is felt through preparation, timing and quiet control.
            </p>
          </motion.div>

          <div className="border-t border-brand-cream/15">
            {standards.map(([number, title, copy], index) => (
              <motion.article
                key={number}
                className="grid gap-3 border-b border-brand-cream/15 py-6 sm:grid-cols-[48px_0.8fr_1.2fr] sm:items-start sm:gap-6 md:py-8"
                initial={isReduced ? false : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.55 }}
                transition={{ duration: isReduced ? 0 : 0.55, delay: isReduced ? 0 : index * 0.055, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[10px] font-mono text-brand-gold">{number}</span>
                <h3 className="font-serif text-xl font-light leading-tight text-brand-ivory md:text-2xl">{title}</h3>
                <p className="max-w-md text-sm font-light leading-relaxed text-brand-stone">{copy}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
