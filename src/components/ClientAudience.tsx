import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AUDIENCE_CARDS } from "../data";

export default function ClientAudience() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-deep-forest overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Title */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
            Custom Alignment
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight leading-tight">
            Built for people whose movement <br />
            <span className="italic text-brand-stone font-light">represents more than movement.</span>
          </h2>
        </div>

        {/* Audience Grid - 3 Columns on desktop with staggered cascade scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {AUDIENCE_CARDS.map((card, idx) => {
            const isHovered = activeIdx === idx;
            return (
              <motion.div
                key={card.number}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
                  }
                }}
                whileHover={{ y: -4 }}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                className="relative p-8 bg-brand-black/40 border border-brand-cream/10 hover:border-brand-cream/25 transition-all duration-500 cursor-pointer min-h-[260px] flex flex-col justify-between"
              >
                {/* Visual active cue: subtle top gold line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-brand-gold transition-all duration-500 origin-left ${
                    isHovered ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-brand-stone">
                    Class {card.number}
                  </span>
                  <span className="text-xs font-mono text-brand-cream/50 font-light">
                    ALAIR · SPEC
                  </span>
                </div>

                <div className="my-6">
                  <h3 className="text-2xl font-serif font-light text-brand-ivory group-hover:text-brand-cream transition-colors duration-300">
                    {card.title}
                  </h3>
                </div>

                <p className="text-sm text-brand-stone font-light leading-relaxed">
                  {card.description}
                </p>

                {/* Subtle detail trigger indicator */}
                <div className="flex items-center space-x-2 mt-4 text-[10px] font-mono text-brand-gold tracking-widest opacity-75">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span>PREMIUM HANDLING ASSURED</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom micro branding block */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between p-6 border border-brand-cream/10 bg-brand-black/20">
          <span className="text-xs font-mono tracking-[0.25em] text-brand-stone uppercase mb-4 sm:mb-0">
            [ SECURE BOOKING FOR CLIENT REPRESENTATIVES AVAILABLE ]
          </span>
          <span className="text-xs font-serif italic text-brand-cream">
            All journeys remain strictly confidential.
          </span>
        </div>

      </div>
    </section>
  );
}
