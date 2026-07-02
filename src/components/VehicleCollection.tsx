import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { VEHICLES } from "../data";

interface VehicleCollectionProps {
  onRequestScroll: (vehicleName?: string) => void;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 1200; // ms
    const startTime = performance.now();

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      
      const currentVal = start + easeProgress * (end - start);
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value]);

  // Handle integers vs decimals
  const displayValue = Number.isInteger(value) ? Math.floor(count) : count.toFixed(1);

  return (
    <span ref={ref} className="font-serif text-3xl md:text-5xl text-brand-gold font-light tracking-tight">
      {displayValue}
      <span className="text-xs font-sans text-brand-stone ml-1 font-normal tracking-normal uppercase">{suffix}</span>
    </span>
  );
}

export default function VehicleCollection({ onRequestScroll }: VehicleCollectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isReduced, setIsReduced] = useState(false);
  const [viewMode, setViewMode] = useState<"exterior" | "interior">("exterior");
  const activeVehicle = VEHICLES[selectedIdx];
  const detailScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Reset view mode when switching vehicles
  useEffect(() => {
    setViewMode("exterior");
  }, [selectedIdx]);

  const handleNext = () => {
    setSelectedIdx((prev) => (prev + 1) % VEHICLES.length);
  };

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev - 1 + VEHICLES.length) % VEHICLES.length);
  };

  const scrollDetails = (direction: "left" | "right") => {
    if (detailScrollRef.current) {
      const scrollAmount = 300;
      detailScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="fleet-section" className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold block mb-4">
              The Selection
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight">
              The 2026 Fleet
            </h2>
          </div>
          
          {/* Tabbing Control */}
          <div className="mt-8 md:mt-0 flex space-x-1 border-b border-brand-cream/10 pb-1">
            {VEHICLES.map((vehicle, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <button
                  key={vehicle.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 relative cursor-pointer ${
                    isActive ? "text-brand-cream" : "text-brand-stone hover:text-brand-cream"
                  }`}
                >
                  <span>{vehicle.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeVehicleTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interior/Exterior View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-brand-black border border-brand-cream/10 p-1">
            <button
              onClick={() => setViewMode("exterior")}
              className={`px-5 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                viewMode === "exterior" 
                  ? "bg-brand-gold text-brand-black font-semibold shadow-md" 
                  : "text-brand-stone hover:text-brand-cream"
              }`}
            >
              Exterior View
            </button>
            <button
              onClick={() => setViewMode("interior")}
              className={`px-5 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                viewMode === "interior" 
                  ? "bg-brand-gold text-brand-black font-semibold shadow-md" 
                  : "text-brand-stone hover:text-brand-cream"
              }`}
            >
              Interior Cabin
            </button>
          </div>
        </div>

        {/* 3D Fleet Deck Container */}
        <div className="relative w-full py-8 md:py-12 mb-12 flex flex-col items-center">
          
          {/* Deck with Perspective */}
          <div 
            className="relative w-full max-w-[850px] h-[320px] md:h-[450px] flex items-center justify-center"
            style={{ 
              perspective: "1400px",
              transformStyle: "preserve-3d"
            }}
          >
            {VEHICLES.map((vehicle, idx) => {
              const isActive = selectedIdx === idx;
              const isPrev = idx === (selectedIdx - 1 + VEHICLES.length) % VEHICLES.length;
              const isNext = idx === (selectedIdx + 1) % VEHICLES.length;

              // Motion configuration matching specifications perfectly
              let xPosition = "0%";
              let rotateYVal = 0;
              let zPosition = 80;
              let scaleVal = 1;
              let opacityVal = 1;
              let blurFilter = "blur(0px)";

              if (!isActive) {
                if (isPrev) {
                  xPosition = "-38%";
                  rotateYVal = 16;
                  zPosition = -80;
                  scaleVal = 0.84;
                  opacityVal = 0.55;
                  blurFilter = "blur(1.5px)";
                } else if (isNext) {
                  xPosition = "38%";
                  rotateYVal = -16;
                  zPosition = -80;
                  scaleVal = 0.84;
                  opacityVal = 0.55;
                  blurFilter = "blur(1.5px)";
                }
              }

              // Simple fallback for reduced-motion
              const motionConfig = isReduced ? {
                x: isActive ? "0%" : (idx < selectedIdx ? "-20%" : "20%"),
                rotateY: 0,
                z: 0,
                scale: isActive ? 1 : 0.95,
                opacity: isActive ? 1 : 0,
                filter: "blur(0px)"
              } : {
                x: xPosition,
                rotateY: rotateYVal,
                z: zPosition,
                scale: scaleVal,
                opacity: opacityVal,
                filter: blurFilter
              };

              // Determine image to show based on viewMode toggle
              const currentImg = isActive 
                ? (viewMode === "exterior" ? vehicle.image : (vehicle.interiorImage || vehicle.image))
                : vehicle.image;

              return (
                <motion.div
                  key={vehicle.id}
                  animate={motionConfig}
                  transition={{ 
                    duration: 0.9, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  onClick={() => setSelectedIdx(idx)}
                  className={`absolute w-[85%] max-w-[580px] h-full overflow-hidden border border-brand-cream/15 bg-brand-black shadow-2xl cursor-pointer select-none rounded-sm ${
                    isActive ? "z-30 pointer-events-auto shadow-brand-gold/5" : "z-10 pointer-events-auto"
                  }`}
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Image Asset overlay */}
                  <div className="relative w-full h-full">
                    <img
                      src={currentImg}
                      alt={vehicle.name}
                      className="w-full h-full object-cover grayscale brightness-[0.85] transition-transform duration-1000 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/20 to-transparent" />

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end">
                      <div className="text-[10px] font-mono tracking-widest text-brand-stone mb-1 uppercase">
                        {viewMode === "exterior" ? "CHASSIS SPEC" : "CABIN COMFORT"} // 0{idx + 1}
                      </div>
                      <h3 className="text-xl md:text-3xl font-serif text-white tracking-wide font-light mb-1">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs md:text-sm text-brand-gold font-mono italic">
                        {vehicle.subTitle}
                      </p>
                    </div>

                    {/* Active badge */}
                    {isActive && (
                      <div className="absolute top-6 right-6 px-3 py-1 border border-brand-gold/30 bg-brand-black/95 text-[9px] font-mono tracking-widest text-brand-gold uppercase">
                        2026 SPEC
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Premium Control Suite */}
          <div className="flex items-center space-x-12 mt-10 z-20">
            <button
              onClick={handlePrev}
              className="group flex items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone hover:text-brand-cream transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              <span className="text-[10px] transition-transform duration-300 group-hover:-translate-x-1">←</span>
              <span>PREV</span>
            </button>
            <div className="flex items-center space-x-2">
              {VEHICLES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`h-1 transition-all duration-300 cursor-pointer ${
                    selectedIdx === idx ? "w-8 bg-brand-gold" : "w-2 bg-brand-stone/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="group flex items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone hover:text-brand-cream transition-colors duration-300 cursor-pointer focus:outline-none"
            >
              <span>NEXT</span>
              <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>

        </div>

        {/* Dynamic Spec Details Container - Underneath active selection */}
        <div className="max-w-5xl mx-auto border border-brand-cream/10 bg-brand-black/40 p-8 md:p-12 rounded-sm backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeVehicle.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            >
              {/* Suitability & Description */}
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-stone uppercase block mb-2">
                    Purpose & Cabin Use Case
                  </span>
                  <p className="text-sm md:text-base text-brand-ivory/85 font-light leading-relaxed">
                    {activeVehicle.description}
                  </p>
                </div>

                {/* Animated Spec Counters */}
                {activeVehicle.numericalSpecs && (
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-stone uppercase block mb-4">
                      Performance & Dimensions
                    </span>
                    <div className="grid grid-cols-3 gap-4 border-t border-b border-brand-cream/10 py-6">
                      {activeVehicle.numericalSpecs.map((spec) => (
                        <div key={spec.label} className="flex flex-col">
                          <span className="text-[9px] font-mono text-brand-stone uppercase tracking-widest mb-1.5 h-8">
                            {spec.label}
                          </span>
                          <AnimatedCounter value={spec.value} suffix={spec.suffix} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-stone uppercase block mb-3">
                    Primarily Recommended For
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeVehicle.bestFor.map((suite) => (
                      <li key={suite} className="flex items-center space-x-3 text-xs text-brand-ivory/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                        <span>{suite}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="flex flex-col justify-between h-full space-y-8">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-stone uppercase block mb-4">
                    Vehicle Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-brand-cream/10 pt-6">
                    {activeVehicle.specs.map((spec) => (
                      <div key={spec.label} className="flex flex-col">
                        <span className="text-[10px] font-mono text-brand-stone uppercase tracking-widest">
                          {spec.label}
                        </span>
                        <span className="text-sm font-serif text-brand-gold mt-1 font-medium">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 360-degree feel horizontal detail cards */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-brand-stone uppercase">
                      Premium Cabin Highlights
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => scrollDetails("left")} 
                        className="w-6 h-6 border border-brand-cream/10 flex items-center justify-center text-brand-stone hover:text-brand-cream cursor-pointer text-xs"
                      >
                        ←
                      </button>
                      <button 
                        onClick={() => scrollDetails("right")} 
                        className="w-6 h-6 border border-brand-cream/10 flex items-center justify-center text-brand-stone hover:text-brand-cream cursor-pointer text-xs"
                      >
                        →
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    ref={detailScrollRef}
                    className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {activeVehicle.highlights.map((highlight, index) => (
                      <div 
                        key={index} 
                        className="flex-shrink-0 w-72 bg-brand-deep-forest/40 border border-brand-cream/5 p-4 rounded-sm snap-start"
                      >
                        <div className="text-[10px] font-mono text-brand-gold uppercase tracking-[0.2em] mb-2">
                          FEATURE // 0{index + 1}
                        </div>
                        <p className="text-xs text-brand-ivory/90 leading-relaxed font-light">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Request CTA with Shimmer hover effect */}
                <div className="pt-4">
                  <button
                    onClick={() => onRequestScroll(activeVehicle.name)}
                    className="group relative overflow-hidden w-full px-8 py-4 bg-brand-cream text-brand-black text-xs font-mono uppercase tracking-[0.25em] font-medium hover:bg-brand-ivory hover:text-brand-deep-forest transition-all duration-300 cursor-pointer rounded-sm"
                  >
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ repeat: Infinity, repeatType: "loop", duration: 1.2, ease: "easeInOut" }}
                      style={{ transform: "skewX(-20deg)" }}
                    />
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Book {activeVehicle.name === "BMW i7 2026" ? "BMW i7 2026" : "Mercedes V-Class 2026"}</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
