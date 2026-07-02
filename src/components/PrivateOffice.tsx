import { motion } from "motion/react";

interface PrivateOfficeProps {
  onRequestScroll: () => void;
}

export default function PrivateOffice({ onRequestScroll }: PrivateOfficeProps) {
  const cards = [
    {
      title: "For Executive Assistants",
      desc: "Clear communication, confirmed details, and professional coordination without unnecessary back-and-forth."
    },
    {
      title: "For Family Offices",
      desc: "Discreet movement for principals, relatives, guests, private schedules, and recurring travel."
    },
    {
      title: "For Corporate Bookers",
      desc: "Professional handling for executives, visiting clients, investors, board members, and event guests."
    },
    {
      title: "For Concierge Teams",
      desc: "Private mobility for hotel guests requiring composed airport, city, and long-distance travel."
    }
  ];

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Context & Bullet List (6 cols) */}
          <div className="lg:col-span-6">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
              Bespoke Booking Desk
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight leading-tight mb-8">
              For those arranging movement <br />
              <span className="italic text-brand-stone font-light">on behalf of someone important.</span>
            </h2>

            <div className="w-12 h-[1px] bg-brand-cream/20 mb-8" />

            <p className="text-sm md:text-base text-brand-stone font-light leading-relaxed mb-8">
              The passenger may not be the person making the request. ALAIR NOIR works directly with executive assistants, family offices, corporate bookers, concierge teams, and private offices arranging travel for CEOs, principals, guests, and families.
            </p>

            {/* List of sub-groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {cards.map((card, idx) => (
                <div key={card.title} className="p-5 border border-brand-cream/10 bg-brand-deep-forest/10">
                  <h3 className="text-sm font-mono uppercase tracking-wider text-brand-cream mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-brand-stone leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={onRequestScroll}
              className="px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.2em] hover:bg-brand-ivory hover:text-brand-deep-forest transition-all duration-300"
            >
              Book for a Client
            </button>
          </div>

          {/* Right Column: Premium Request Summary Card Layout (6 cols) */}
          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-10 bg-brand-deep-forest/40 border border-brand-cream/15 backdrop-blur-sm relative"
            >
              {/* Premium watermark overlay */}
              <div className="absolute top-4 right-4 text-[10px] font-mono text-brand-stone/40">
                ALAIR // ADVISORY
              </div>

              <h3 className="text-xs font-mono tracking-widest text-brand-cream uppercase mb-8 pb-3 border-b border-brand-cream/10">
                Mandatory Booking Parameters
              </h3>

              <div className="space-y-6">
                {[
                  { field: "01 / Journey Routing", value: "Pickup point, intermediate destinations, arrival stop." },
                  { field: "02 / Temporal Coordinates", value: "Precise date, scheduled time, takeoff/landing flight details." },
                  { field: "03 / Spatial Requirements", value: "Passenger count, specific luggage metrics, security clearances." },
                  { field: "04 / Vehicle Selection", value: "BMW i7 2026 or Mercedes V-Class 2026 requirement." },
                  { field: "05 / Special Directives", value: "Discretion level, cabin settings, secure key handover." }
                ].map((item) => (
                  <div key={item.field} className="flex flex-col">
                    <span className="text-[10px] font-mono text-brand-cream uppercase tracking-widest">
                      {item.field}
                    </span>
                    <span className="text-sm font-serif text-brand-ivory font-light italic mt-1">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-brand-cream/10 flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-brand-moss animate-pulse" />
                <span className="text-[10px] font-mono text-brand-stone uppercase tracking-widest">
                  CONFIRMATION DELIVERED WITHIN 15 MINUTES BY DEFAULT
                </span>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
