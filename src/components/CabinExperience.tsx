import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "../data";

export default function CabinExperience() {
  const slides = [
    {
      title: "Executive lounge",
      desc: "A spacious environment engineered for physical ease and quiet, allowing you to settle and regain momentum.",
      image: IMAGES.vclass_interior
    },
    {
      title: "Ambient privacy",
      desc: "Insulated from public exposure and external noise, ensuring your phone calls and conversations stay yours alone.",
      image: IMAGES.cabin_1
    },
    {
      title: "Rear cabin focus",
      desc: "Perfect workstation geometry with soft task lighting designed for busy executives preparing critical reviews.",
      image: IMAGES.cabin_2
    },
    {
      title: "Business preparation",
      desc: "A calm, clutter-free space where thoughts align and the focus shifts seamlessly to the upcoming boardroom agenda.",
      image: IMAGES.cabin_3
    },
    {
      title: "Passenger silence",
      desc: "The ultimate luxury of absolute quietude. No unsolicited conversation, just undisturbed transition time.",
      image: IMAGES.zurich_luxury_arrival
    }
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  const nextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative py-24 md:py-36 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
            Interior Atmosphere
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight mb-6">
            A private room <span className="italic text-brand-stone font-light">between obligations.</span>
          </h2>
          <p className="text-sm font-mono tracking-widest uppercase text-brand-stone mb-12">
            Silence is not emptiness. It is space to think.
          </p>
        </div>

        {/* Diaporama Slider Layout */}
        <div className="relative">
          
          {/* Main Slide Panel */}
          <div className="relative aspect-[16/9] w-full overflow-hidden border border-brand-cream/10 bg-brand-deep-forest/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={slides[activeIdx].image}
                  alt={slides[activeIdx].title}
                  className="w-full h-full object-cover grayscale brightness-75 contrast-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/20" />
                
                {/* Info Card Overlay inside the slider frame */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 bg-gradient-to-t from-brand-black/90 to-brand-black/0 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div className="max-w-xl">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-cream block mb-2">
                      Ambient Space [ 0{activeIdx + 1} / 0{slides.length} ]
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-light text-brand-ivory mb-2">
                      {slides[activeIdx].title}
                    </h3>
                    <p className="text-xs md:text-sm text-brand-stone font-light leading-relaxed">
                      {slides[activeIdx].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controllers & Progress Indicators below slide */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-brand-cream/10 pt-6">
            
            {/* Numeric Indicators */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-brand-cream">0{activeIdx + 1}</span>
              <span className="text-brand-stone/40">/</span>
              <span className="text-brand-stone">0{slides.length}</span>
            </div>

            {/* Custom Progress Line (Aesthetic visual requirement) */}
            <div className="flex-1 max-w-xs h-[1px] bg-brand-cream/15 relative">
              <div
                className="absolute left-0 top-0 h-full bg-brand-cream transition-all duration-500 ease-out"
                style={{ width: `${((activeIdx + 1) / slides.length) * 100}%` }}
              />
            </div>

            {/* Micro Trigger buttons */}
            <div className="flex space-x-4">
              <button
                onClick={prevSlide}
                className="w-12 h-8 border border-brand-cream/10 text-brand-stone hover:text-brand-cream hover:border-brand-cream/30 flex items-center justify-center transition-all duration-300 text-[10px] font-mono tracking-widest cursor-pointer"
              >
                PREV
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-8 border border-brand-cream/10 text-brand-stone hover:text-brand-cream hover:border-brand-cream/30 flex items-center justify-center transition-all duration-300 text-[10px] font-mono tracking-widest cursor-pointer"
              >
                NEXT
              </button>
            </div>

          </div>

          {/* Interactive Diaporama Visual Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-12">
            {slides.map((slide, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className="group relative flex flex-col items-start text-left focus:outline-none cursor-pointer"
                >
                  <div className={`relative aspect-[16/10] w-full overflow-hidden border transition-all duration-500 ${
                    isActive ? "border-brand-cream" : "border-brand-cream/10 group-hover:border-brand-cream/30"
                  }`}>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isActive ? "scale-105 grayscale-0 brightness-95" : "grayscale opacity-50 hover:opacity-80 hover:scale-102"
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-brand-cream/10 pointer-events-none" />
                    )}
                  </div>
                  <span className={`text-[9px] font-mono tracking-[0.15em] uppercase mt-2.5 transition-colors duration-300 ${
                    isActive ? "text-brand-cream font-medium" : "text-brand-stone group-hover:text-brand-ivory"
                  }`}>
                    0{idx + 1} · {slide.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
