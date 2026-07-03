import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { OCCASIONS } from "../data";
import { imageAssets } from "../assets";

interface OccasionCardsProps {
  onRequestScroll: () => void;
}

const SERVICE_IMAGES: Record<string, string> = {
  "01": imageAssets.luxuryAirportWelcome,
  "02": imageAssets.bmwI7Departure,
  "03": imageAssets.luxuryVipCabin,
  "04": imageAssets.luxuryBmwI7,
  "05": imageAssets.luxuryVClass,
  "06": imageAssets.zurichLuxuryArrival
};

function ServiceCard({ occasion, idx, key }: { occasion: typeof OCCASIONS[0]; idx: number; key?: string | number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);
  }, []);

  // Framer Motion motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for high-end luxury acceleration/deceleration
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  // Map to limited 4-degree rotations as per prompt guidelines
  const rotateX = useTransform(springY, [-0.5, 0.5], [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isReduced) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized coords between -0.5 and 0.5
    const relativeX = (e.clientX - rect.left) / width - 0.5;
    const relativeY = (e.clientY - rect.top) / height - 0.5;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer focus-within:outline-none min-h-[280px]"
      style={{
        perspective: isReduced ? "none" : "1000px"
      }}
    >
      <motion.div
        style={{
          rotateX: isReduced ? 0 : rotateX,
          rotateY: isReduced ? 0 : rotateY,
          transformStyle: isReduced ? "flat" : "preserve-3d"
        }}
        animate={{
          scale: isHovered ? 1.01 : 1,
          borderColor: isHovered ? "rgba(234, 222, 206, 0.3)" : "rgba(234, 222, 206, 0.1)"
        }}
        transition={{
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="relative w-full h-full p-8 bg-brand-black/45 border border-brand-cream/10 flex flex-col justify-between overflow-hidden transition-all duration-700 min-h-[280px]"
      >
        {/* Subtle background image reveal */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.img
            src={SERVICE_IMAGES[occasion.number] || SERVICE_IMAGES["01"]}
            alt={occasion.title}
            className="w-full h-full object-cover grayscale brightness-50"
            referrerPolicy="no-referrer"
            animate={{
              opacity: isHovered ? 0.25 : 0.05,
              scale: isHovered ? 1.04 : 1
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1]
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-black/80" />
        </div>

        {/* Top bar with indices */}
        <div className="flex justify-between items-center z-10 relative" style={{ transform: "translateZ(30px)" }}>
          <span className="text-[10px] font-mono tracking-widest text-brand-cream uppercase">
            Service / 0{idx + 1}
          </span>
          <span className="text-xs font-mono text-brand-stone">
            {occasion.number}
          </span>
        </div>

        {/* Content pane */}
        <div className="mt-auto z-10 relative flex flex-col justify-end" style={{ transform: "translateZ(50px)" }}>
          <h3 className="text-xl md:text-2xl font-serif text-brand-ivory font-light mb-4 tracking-wide">
            {occasion.title}
          </h3>
          <p className="text-xs md:text-sm text-brand-stone font-light leading-relaxed group-hover:text-brand-ivory/90 transition-colors duration-500">
            {occasion.description}
          </p>
        </div>

        {/* Corner elegant indicator */}
        <div 
          className="absolute bottom-4 right-4 text-brand-cream/30 group-hover:text-brand-cream/80 transition-colors duration-500 text-xs font-mono z-10 pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        >
          {isHovered ? "READ SPECS →" : "·"}
        </div>
      </motion.div>
    </div>
  );
}

export default function OccasionCards({ onRequestScroll }: OccasionCardsProps) {
  return (
    <section className="relative py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-brand-deep-forest overflow-hidden luxury-noise border-b border-brand-cream/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream block mb-4">
              Dedicated Scenarios
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light text-brand-ivory tracking-tight">
              Private mobility, <br />
              <span className="italic text-brand-stone font-light">arranged around the moment.</span>
            </h2>
          </div>
          <div className="mt-6 md:mt-0">
            <button
              onClick={onRequestScroll}
              className="px-8 py-4 bg-transparent border border-brand-cream text-brand-cream text-xs font-mono uppercase tracking-[0.2em] hover:bg-brand-cream hover:text-brand-black transition-all duration-300 cursor-pointer"
            >
              Request Availability
            </button>
          </div>
        </div>

        {/* Occasions Editorial Grid (3 Cols) with high-end Interactive Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OCCASIONS.map((occasion, idx) => (
            <ServiceCard
              key={occasion.number}
              occasion={occasion}
              idx={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
