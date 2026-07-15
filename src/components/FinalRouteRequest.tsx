import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useReducedMotionPref } from "./MotionProvider";

interface FinalRouteRequestProps {
  onRequest: () => void;
}

const inclusions = [
  "Airport handling included",
  "Flight monitoring included",
  "Complimentary waiting period",
  "Taxes and standard fees included"
];

export default function FinalRouteRequest({ onRequest }: FinalRouteRequestProps) {
  const isReduced = useReducedMotionPref();

  return (
    <section className="border-y border-brand-cream/10 bg-brand-deep-forest px-4 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="mx-auto max-w-[1280px] text-center">
        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: isReduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-brand-gold">Your route</span>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-5xl font-light leading-[0.98] text-brand-ivory md:text-7xl">
            Tell us where and when.
            <br />
            <span className="italic text-brand-cream/65">We will prepare the rest.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-sm font-light leading-relaxed text-brand-body md:text-base">
            Receive a fixed quotation before confirmation, with no taxi-style live meter and no uncertainty at arrival.
          </p>
        </motion.div>

        <motion.ul
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 border-y border-brand-cream/15 md:grid-cols-4"
          initial={isReduced ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ visible: { transition: { staggerChildren: isReduced ? 0 : 0.07 } } }}
        >
          {inclusions.map((item, index) => (
            <motion.li
              key={item}
              className={`flex min-h-24 items-center justify-center px-3 py-5 text-[9px] font-mono uppercase leading-relaxed tracking-[0.13em] text-brand-cream/72 ${index % 2 === 1 ? "border-l border-brand-cream/15" : ""} ${index > 1 ? "border-t border-brand-cream/15 md:border-t-0" : ""} md:border-l md:first:border-l-0`}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: isReduced ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.button
            type="button"
            onClick={onRequest}
            whileHover={isReduced ? undefined : "hover"}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="flex h-13 w-full items-center justify-center gap-5 bg-brand-gold px-7 text-[10px] font-mono font-semibold uppercase tracking-[0.17em] text-brand-black sm:w-auto"
          >
            Request your route
            <motion.span variants={{ hover: { x: 4 } }} transition={{ type: "spring", stiffness: 360, damping: 32 }}>
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
            </motion.span>
          </motion.button>
          <motion.a
            href="https://wa.me/41772870956"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={isReduced ? undefined : { y: -1, borderColor: "rgba(234,222,206,0.62)" }}
            whileTap={isReduced ? undefined : { scale: 0.985 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="flex h-13 w-full items-center justify-center border border-brand-cream/28 px-7 text-[10px] font-mono uppercase tracking-[0.17em] text-brand-ivory sm:w-auto"
          >
            WhatsApp the desk
          </motion.a>
        </div>
      </div>
    </section>
  );
}
