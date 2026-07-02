import { motion } from "motion/react";
import { IMAGES } from "../data";

interface AirportMomentProps {
  onRequestScroll: () => void;
}

export default function AirportMoment({ onRequestScroll }: AirportMomentProps) {
  const subsections = [
    {
      title: "For Arrivals",
      description: "The journey is prepared around landing time, passenger flow, luggage, meeting point, and onward route."
    },
    {
      title: "For Departures",
      description: "Pickup timing is planned around distance, terminal rhythm, check-in requirements, and passenger comfort."
    },
    {
      title: "For Guests",
      description: "Principals, executives, family members, corporate visitors, and private guests are received with quiet professionalism."
    },
    {
      title: "For Onward Routes",
      description: "Zürich Airport to Davos, St. Moritz, Basel, Lucerne, Geneva, Gstaad, Milan, Munich, and selected European destinations."
    }
  ];

  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Sub-Header */}
        <div className="max-w-4xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
            First Contact point
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            Zürich Airport, <span className="italic text-brand-stone font-light">without uncertainty.</span>
          </h2>
          <p className="text-base md:text-lg text-brand-stone font-light leading-relaxed max-w-3xl">
            An airport transfer is not a simple pickup. It is the first controlled moment after landing — the transition between public travel and private movement. ALAIR NOIR arranges Zürich Airport arrivals and departures with flight-aware timing, luggage consideration, direct communication, and composed onward travel.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Airport subsections (7 cols on large screen) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {subsections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="p-6 bg-brand-deep-forest/20 border border-brand-cream/5 hover:border-brand-cream/15 transition-all duration-300"
              >
                <div className="text-[10px] font-mono tracking-widest text-brand-stone mb-3 uppercase">
                  Service / 0{idx + 1}
                </div>
                <h3 className="text-xl font-serif text-brand-ivory font-light mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-brand-stone/90 font-light leading-relaxed">
                  {section.description}
                </p>
              </motion.div>
            ))}

            {/* Action Area */}
            <div className="sm:col-span-2 pt-6">
              <button
                onClick={onRequestScroll}
                className="px-8 py-4 bg-transparent border border-brand-gold text-brand-gold text-xs font-mono uppercase tracking-[0.2em] hover:bg-brand-gold hover:text-brand-black transition-all duration-300 inline-block cursor-pointer text-center"
              >
                Request Zürich Airport Transfer
              </button>
            </div>
          </div>

          {/* Right Column: High contrast image showcase with live airport status simulation (5 cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative aspect-[4/3] sm:aspect-video lg:aspect-[3/4] overflow-hidden border border-brand-cream/15"
            >
              <img
                src={IMAGES.zurich_airport_arrival}
                alt="ALAIR NOIR Waiting at Zurich Private Airport Terminal"
                className="w-full h-full object-cover grayscale brightness-90 filter"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Flight awareness tag overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-brand-black/90 border border-brand-cream/10 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-mono tracking-widest text-brand-stone uppercase">
                    Flight Status Monitor
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                </div>
                <div className="text-xs font-mono text-brand-ivory flex justify-between">
                  <span>ZRH ARRIVALS</span>
                  <span className="text-brand-stone">FLIGHT-AWARE SYNC ACTIVE</span>
                </div>
              </div>
            </motion.div>

            {/* Micro details panel below image */}
            <div className="mt-4 flex justify-between text-[10px] font-mono text-brand-stone uppercase tracking-widest">
              <span>[ PLATE 02 / ZÜRICH AP ARRIVALS ]</span>
              <span>GPS SYNC ACTIVE</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
