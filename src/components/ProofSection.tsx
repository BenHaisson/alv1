import { motion } from "motion/react";
import { PROOF_ITEMS } from "../data";

export default function ProofSection() {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
            Legal Compliance & Trust
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Verified where <span className="italic text-brand-stone font-light">it matters.</span>
          </h2>
          <p className="text-base text-brand-stone font-light leading-relaxed">
            Private mobility requires trust before the vehicle arrives. ALAIR NOIR operates with clear company identity, Zürich-based availability, professional preparation, direct communication, and discreet handling of passenger details.
          </p>
        </div>

        {/* Verification Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROOF_ITEMS.map((proof, idx) => (
            <motion.div
              key={proof.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.08 }}
              className="p-6 bg-brand-deep-forest/20 border border-brand-cream/10 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                {/* Minimalist certification tag */}
                <span className="text-[9px] font-mono tracking-widest text-brand-stone uppercase block mb-3">
                  Verification Log // 0{idx + 1}
                </span>
                
                <h3 className="text-xs font-mono uppercase tracking-wider text-brand-gold">
                  {proof.title}
                </h3>
              </div>

              <div className="mt-4">
                <div className="text-lg font-serif text-brand-ivory font-light italic leading-tight mb-1">
                  {proof.value}
                </div>
                <p className="text-xs text-brand-stone font-light leading-relaxed">
                  {proof.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro Legal Banner */}
        <div className="mt-12 flex justify-center items-center space-x-2 text-[10px] font-mono tracking-widest text-brand-stone/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
          <span>ALAIR NOIR GMBH IS FULLY COMPLIANT WITH SWISS FEDERAL PASSENGER REGULATIONS</span>
        </div>

      </div>
    </section>
  );
}
