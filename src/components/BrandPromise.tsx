import { motion } from "motion/react";

export default function BrandPromise() {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-deep-forest overflow-hidden luxury-noise border-y border-brand-cream/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Editorial Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold mb-8"
        >
          Brand Manifesto
        </motion.div>

        {/* Central Brand Statement */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-brand-ivory tracking-widest uppercase mb-12 glow-subtle"
        >
          NOT FOR EVERYONE. <br />
          <span className="italic text-brand-gold font-extralight block mt-2">FOR YOU.</span>
        </motion.h2>

        <div className="w-16 h-[1px] bg-brand-gold/30 mb-12" />

        {/* Short, staggered lines in a quiet sequence */}
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-brand-stone font-light"
          >
            Not for passengers seeking the loudest arrival. <br />
            Not for those who measure service only by distance. <br />
            Not for movement treated as an afterthought.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-base md:text-xl font-serif text-brand-ivory/90 font-light leading-relaxed italic"
          >
            "ALAIR NOIR is for the traveller who values silence over spectacle, precision over excess, and privacy over attention."
          </motion.p>

          {/* Targeted use cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 text-left max-w-lg mx-auto">
            {[
              { label: "For the CEO", detail: "before a boardroom" },
              { label: "For the founder", detail: "between meetings" },
              { label: "For the principal", detail: "arriving without exposure" },
              { label: "For the private guest", detail: "who should never ask twice" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 + idx * 0.1 }}
                className="p-4 border-l border-brand-gold/35 bg-brand-black/25"
              >
                <div className="text-xs font-mono uppercase text-brand-gold tracking-widest">{item.label}</div>
                <div className="text-sm font-serif text-brand-stone italic mt-1">{item.detail}</div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-sm md:text-base font-serif text-brand-stone tracking-wide pt-6"
          >
            Every journey is arranged to feel calm, exact, and already understood.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
