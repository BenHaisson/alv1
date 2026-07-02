import { motion } from "motion/react";
import { IMAGES } from "../data";

export default function ArrivalRisk() {
  const risks = [
    { label: "Delay", detail: "A vehicle arriving late is visible." },
    { label: "Confusion", detail: "A confused pickup is visible." },
    { label: "Exposure", detail: "A public wait is visible." },
    { label: "Improvisation", detail: "A passenger left uncertain is visible." }
  ];

  const movements = [
    "From airport to hotel.",
    "From residence to meeting.",
    "From meeting to dinner.",
    "From Zürich to wherever the schedule requires."
  ];

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Side: Intense Copy & Narrative */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream mb-6"
          >
            The Paradox of Visibility
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight leading-tight mb-8">
            The first impression begins <br />
            <span className="italic text-brand-stone font-light">before the door opens.</span>
          </h2>

          <p className="text-sm font-mono uppercase tracking-[0.2em] text-brand-stone mb-6">
            The friction of average service:
          </p>

          {/* Staggered risks list */}
          <div className="space-y-4 mb-10">
            {risks.map((risk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="flex items-start space-x-4 border-b border-brand-cream/5 pb-3"
              >
                <span className="font-mono text-xs text-brand-cream tracking-widest uppercase min-w-[120px]">
                  [ {risk.label} ]
                </span>
                <span className="text-sm text-brand-ivory/80 font-light">
                  {risk.detail}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="p-6 bg-brand-forest/30 border-l-2 border-brand-moss mb-8"
          >
            <p className="text-base font-serif text-brand-cream italic leading-relaxed">
              "The purpose of ALAIR NOIR is to remove that uncertainty."
            </p>
          </motion.div>

          {/* Transition points */}
          <div className="grid grid-cols-2 gap-4">
            {movements.map((move, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-1 h-1 rounded-full bg-brand-cream/40" />
                <span className="text-xs font-mono tracking-wider text-brand-stone">{move}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: High Cinematic Detail Image */}
        <div className="relative group">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] overflow-hidden border border-brand-cream/15"
          >
            <img
              src={IMAGES.zurich_luxury_arrival}
              alt="ALAIR NOIR Chauffeur Opening Car Door"
              className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Soft inner shadow overlay to give bespoke luxurious editorial feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Image Sublabel */}
          <div className="mt-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-[0.2em] text-brand-stone">
            <span>[ Plate 04 / Chauffeur Standard ]</span>
            <span>Zurich Base</span>
          </div>
        </div>

      </div>
    </section>
  );
}
