import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface JourneyStage {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
}

const BMW_I7_JOURNEY_STAGES: JourneyStage[] = [
  {
    step: "Stage I",
    title: "Zürich Dawn Departure",
    subtitle: "Minimalist Preparation",
    description: "The journey begins in the quiet dawn fog of a private residence in Zürich. The BMW i7 2026 stands silent, pre-conditioned to the perfect cabin temperature, with its signature signature LED halo lights piercing the mist. Ready for departure.",
    image: "/src/assets/images/bmw_i7_departure_1782861743795.jpg",
    location: "Zürich Gold Coast"
  },
  {
    step: "Stage II",
    title: "The Alpine Transit",
    subtitle: "Dynamic Composure",
    description: "Cruising seamlessly through the elevated Swiss mountain passes. The vehicle's active air suspension absorbs every imperfection, while acoustic glazing isolates passengers from high-altitude winds. The cabin remains a silent sanctuary.",
    image: "/src/assets/images/bmw_i7_alpine_cruise_1782861758267.jpg",
    location: "Gotthard Pass Region"
  },
  {
    step: "Stage III",
    title: "Tarmac Rendezvous",
    subtitle: "Aviation Handover",
    description: "A direct meet on the private airfield tarmac in Zürich. Arriving guests transition effortlessly from their private aircraft straight into the spacious rear lounge of the BMW i7 2026, with luggage handled discreetly.",
    image: "/src/assets/images/bmw_i7_tarmac_meet_1782861771287.jpg",
    location: "Zürich Airport (LSZH)"
  },
  {
    step: "Stage IV",
    title: "St. Moritz Alpine Dusk",
    subtitle: "High-Altitude Arrival",
    description: "As dusk falls over the snow-covered Engadin valley, the BMW i7 2026 glides into the grand driveway of a premier luxury resort in St. Moritz. Ambient light reflections highlight the clean, muscular contours of the chassis.",
    image: "/src/assets/images/bmw_i7_st_moritz_dusk_1782861783352.jpg",
    location: "St. Moritz, Engadin"
  },
  {
    step: "Stage V",
    title: "The Rear Executive Workspace",
    subtitle: "Mobile Focus",
    description: "Inside the rear lounge, the focus shifts to business. An integrated luxury wooden folding desk supports critical notes and a high-end notebook, while deep-pile carpets and ultra-plush merino-and-leather seats provide executive comfort.",
    image: "/src/assets/images/bmw_i7_rear_workspace_1782861794303.jpg",
    location: "Transit via Schwyz"
  },
  {
    step: "Stage VI",
    title: "Ambient Digital Cockpit",
    subtitle: "Intelligent Guidance",
    description: "As night falls, the crystal-cut Interaction Bar and Curved Display illuminate in warm amber and copper hues. Advanced navigation guidance directs the quiet electric drive through the dark Swiss landscape with watchmaker precision.",
    image: "/src/assets/images/bmw_i7_cockpit_night_1782861804665.jpg",
    location: "Zürich Environs"
  }
];

export default function BMW7Journey() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);
  }, []);

  const nextStage = () => {
    setActiveIdx((prev) => (prev + 1) % BMW_I7_JOURNEY_STAGES.length);
  };

  const prevStage = () => {
    setActiveIdx((prev) => (prev - 1 + BMW_I7_JOURNEY_STAGES.length) % BMW_I7_JOURNEY_STAGES.length);
  };

  const currentStage = BMW_I7_JOURNEY_STAGES[activeIdx];

  return (
    <section className="relative py-24 md:py-36 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
              Visual Chronicle
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-light text-brand-ivory tracking-tight">
              BMW i7 2026 <span className="italic text-brand-stone">Journey Archive</span>
            </h2>
          </div>
          <div className="mt-4 md:mt-0 font-mono text-xs text-brand-cream/70 tracking-widest uppercase">
            6 Selected Scenes · Swiss Alpine Routes
          </div>
        </div>

        {/* Cinematic Widescreen Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Panel: Widescreen Cinematic Image (8 Columns) */}
          <div className="lg:col-span-8 relative">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-brand-cream/15 bg-brand-forest/10 rounded-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: isReduced ? 1 : 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: isReduced ? 1 : 0.98 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentStage.image}
                    alt={currentStage.title}
                    className="w-full h-full object-cover grayscale brightness-[0.8] contrast-[1.02] transition-transform duration-700 hover:scale-101"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-brand-black/25" />
                  
                  {/* Floating Metadata Indicator */}
                  <div className="absolute top-6 left-6 px-3 py-1 bg-brand-black/85 border border-brand-cream/10 backdrop-blur-sm">
                    <span className="text-[10px] font-mono tracking-widest text-brand-cream uppercase">
                      {currentStage.location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Stage Progress & Mini Triggers */}
            <div className="mt-6 flex items-center justify-between gap-6 border-t border-brand-cream/10 pt-6">
              
              {/* Stepper Dots */}
              <div className="flex items-center space-x-2">
                {BMW_I7_JOURNEY_STAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`h-1.5 transition-all duration-500 cursor-pointer ${
                      activeIdx === idx ? "w-8 bg-brand-cream" : "w-2 bg-brand-stone/35 hover:bg-brand-cream/50"
                    }`}
                    aria-label={`Go to scene ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next controls */}
              <div className="flex space-x-3">
                <button
                  onClick={prevStage}
                  className="w-12 h-8 border border-brand-cream/15 text-brand-cream/55 hover:text-brand-cream hover:border-brand-cream/35 flex items-center justify-center transition-all duration-300 text-[10px] font-mono tracking-widest cursor-pointer"
                >
                  PREV
                </button>
                <button
                  onClick={nextStage}
                  className="w-12 h-8 border border-brand-cream/15 text-brand-cream/55 hover:text-brand-cream hover:border-brand-cream/35 flex items-center justify-center transition-all duration-300 text-[10px] font-mono tracking-widest cursor-pointer"
                >
                  NEXT
                </button>
              </div>

            </div>
          </div>

          {/* Right Panel: Editorial Storytelling (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-center min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, x: isReduced ? 0 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isReduced ? 0 : -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-cream uppercase block mb-3">
                  {currentStage.step} // {currentStage.subtitle}
                </span>
                
                <h3 className="text-2xl md:text-3xl font-serif text-brand-ivory font-light tracking-wide mb-6">
                  {currentStage.title}
                </h3>

                <p className="text-sm text-brand-stone font-light leading-relaxed mb-8">
                  {currentStage.description}
                </p>

                <div className="border-t border-brand-cream/10 pt-6">
                  <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest text-brand-cream/60">
                    <span>Vessel Type</span>
                    <span className="text-brand-cream font-medium">BMW i7 2026</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Thumbnail Strip (Bottom) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-16 pt-8 border-t border-brand-cream/10">
          {BMW_I7_JOURNEY_STAGES.map((stage, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className="group relative flex flex-col items-start text-left focus:outline-none cursor-pointer"
              >
                <div className={`relative aspect-[16/10] w-full overflow-hidden border transition-all duration-500 ${
                  isActive ? "border-brand-cream" : "border-brand-cream/10 group-hover:border-brand-cream/35"
                }`}>
                  <img
                    src={stage.image}
                    alt={stage.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isActive ? "scale-102 grayscale-0 brightness-90" : "grayscale opacity-40 group-hover:opacity-75 group-hover:scale-101"
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-brand-cream/10 pointer-events-none" />
                  )}
                </div>
                <span className={`text-[9px] font-mono tracking-[0.15em] uppercase mt-2.5 transition-colors duration-300 ${
                  isActive ? "text-brand-cream font-medium" : "text-brand-cream/45 group-hover:text-brand-cream/80"
                }`}>
                  0{idx + 1} · {stage.title.split(" ")[1] || stage.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
