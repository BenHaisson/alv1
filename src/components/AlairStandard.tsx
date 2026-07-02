import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { imageAssets } from "../assets";

interface ProtocolRow {
  number: string;
  category: string;
  title: string;
  paragraph: string;
  statusLabel: string;
  image: string;
  location: string;
  meta: string;
}

const PROTOCOLS: ProtocolRow[] = [
  {
    number: "01",
    category: "CHRONOMETRY",
    title: "Timing",
    paragraph: "Routes, pickup rhythm, waiting time, and handover are prepared before the journey begins.",
    statusLabel: "PRE-JOURNEY",
    image: imageAssets.bmwI7Departure,
    location: "ZÜRICH REGION",
    meta: "ROUTE TRACKING CALIBRATED"
  },
  {
    number: "02",
    category: "CONFIDENTIALITY",
    title: "Privacy",
    paragraph: "Passenger details, routes, schedules, and instructions are handled with discretion by default.",
    statusLabel: "DISCRETION",
    image: imageAssets.bmwI7TarmacMeet,
    location: "LSZH TERMINAL",
    meta: "ZERO DIGITAL footprint"
  },
  {
    number: "03",
    category: "AESTHETICS",
    title: "Presence",
    paragraph: "The vehicle, cabin, communication, and arrival posture are prepared to represent the client properly.",
    statusLabel: "REPRESENTATION",
    image: imageAssets.bmwI7StMoritzDusk,
    location: "ENGADIN VALLEY",
    meta: "IMPECCABLE POSTURE"
  },
  {
    number: "04",
    category: "SANCTUARY",
    title: "Composure",
    paragraph: "The cabin becomes a private interval between obligations — quiet enough to think, call, read, or reset.",
    statusLabel: "CABIN SANCTUARY",
    image: imageAssets.bmwI7RearWorkspace,
    location: "TRANSIT CALM",
    meta: "ACOUSTIC DECOUPLING"
  },
  {
    number: "05",
    category: "CHOREOGRAPHY",
    title: "Precision",
    paragraph: "Every detail is confirmed clearly, executed quietly, and adjusted when the schedule changes.",
    statusLabel: "REAL-TIME ADJUSTMENT",
    image: imageAssets.bmwI7CockpitNight,
    location: "ZÜRICH HEADQUARTERS",
    meta: "DYNAMIC ROUTING ACTIVE"
  }
];

export default function AlairStandard() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);
  }, []);

  const activeProtocol = PROTOCOLS[activeIdx];

  return (
    <section className="relative py-28 md:py-36 bg-brand-black overflow-hidden luxury-noise border-b border-brand-cream/10">
      {/* Background visual accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-forest/[0.03] to-brand-black pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center space-x-3 mb-4">
            <span className="h-[1px] w-6 bg-brand-cream/35" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-cream">
              STANDARD
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8">
              <h2 className="text-3xl md:text-5xl font-serif text-brand-ivory font-light tracking-wide uppercase">
                The Alair Noir <span className="italic text-brand-cream/90 normal-case">Operating Code</span>
              </h2>
              <p className="text-sm md:text-base text-brand-stone/85 mt-4 max-w-xl font-light leading-relaxed">
                Before the vehicle arrives, the journey is already controlled. Five disciplines define how every request is prepared, handled, and delivered.
              </p>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <span className="font-mono text-xs text-brand-cream/40 tracking-widest uppercase block">
                Swiss Dispatch Protocol // 2026
              </span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-brand-cream/10 mt-8" />
        </div>

        {/* Desktop Split Editorial Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Side: Cinematic Airway-style Status Display (5 Columns) */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-brand-cream/15 bg-brand-forest/5 rounded-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: isReduced ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: isReduced ? 1 : 0.98 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={activeProtocol.image}
                    alt={activeProtocol.title}
                    className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.03] transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Deep Shadow overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/25 to-brand-black/45" />

                  {/* Absolute Center Layer: Gigantic Transparent Code Identifier */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[14rem] font-serif font-extralight text-brand-cream/[0.04] leading-none transform translate-y-4">
                      {activeProtocol.number}
                    </span>
                  </div>

                  {/* Operational Telemetry Details Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono tracking-widest text-brand-cream/60">
                          LOC. ORIGIN
                        </span>
                        <span className="text-xs font-mono text-brand-ivory uppercase tracking-wider">
                          {activeProtocol.location}
                        </span>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
                    </div>

                    <div className="border-t border-brand-cream/15 pt-6">
                      <span className="text-[9px] font-mono tracking-widest text-brand-cream/65 uppercase block mb-1">
                        DISPATCH STATUS
                      </span>
                      <p className="text-xs font-mono text-brand-ivory uppercase tracking-widest">
                        {activeProtocol.meta}
                      </p>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Five horizontal protocol rows (7 Columns) */}
          <div className="lg:col-span-7 relative pl-8">
            
            {/* Real-time vertical interactive indicator line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-brand-cream/10">
              <motion.div
                animate={{
                  top: `${(activeIdx / PROTOCOLS.length) * 100}%`,
                  height: `${100 / PROTOCOLS.length}%`
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 w-[2px] bg-brand-gold"
              />
            </div>

            <div className="flex flex-col space-y-2">
              {PROTOCOLS.map((protocol, idx) => {
                const isActive = activeIdx === idx;
                
                return (
                  <div
                    key={protocol.number}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className="group border-t border-brand-cream/10 py-7 transition-all duration-500 cursor-pointer first:border-t-0"
                  >
                    <div className="flex items-center justify-between gap-6 mb-3">
                      <div className="flex items-baseline space-x-6">
                        <span className={`font-mono text-xs transition-colors duration-500 ${
                          isActive ? "text-brand-gold" : "text-brand-cream/35 group-hover:text-brand-cream/60"
                        }`}>
                          {protocol.number}
                        </span>
                        <span className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                          isActive ? "text-brand-cream" : "text-brand-stone group-hover:text-brand-cream/70"
                        }`}>
                          {protocol.category}
                        </span>
                        <h3 className={`text-xl font-serif tracking-wide font-light transition-colors duration-500 ${
                          isActive ? "text-brand-ivory" : "text-brand-stone group-hover:text-brand-ivory/80"
                        }`}>
                          {protocol.title}
                        </h3>
                      </div>

                      <span className={`font-mono text-[9px] tracking-widest px-2 py-0.5 border transition-all duration-500 ${
                        isActive 
                          ? "text-brand-gold border-brand-gold/30 bg-brand-gold-muted" 
                          : "text-brand-cream/25 border-transparent group-hover:border-brand-cream/10"
                      }`}>
                        {protocol.statusLabel}
                      </span>
                    </div>

                    {/* Smooth expanding content with framer-motion */}
                    <div className="overflow-hidden pl-12">
                      <motion.div
                        initial={idx === 0 ? { height: "auto", opacity: 0.9 } : { height: 0, opacity: 0 }}
                        animate={{
                          height: isActive ? "auto" : 0,
                          opacity: isActive ? 0.95 : 0,
                          marginTop: isActive ? 12 : 0
                        }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="text-sm font-light text-brand-cream/80 leading-relaxed max-w-xl font-mono">
                          {protocol.paragraph}
                        </p>
                      </motion.div>
                    </div>

                  </div>
                );
              })}
              
              {/* Bottom end cap hairline */}
              <div className="border-t border-brand-cream/10 w-full" />
            </div>

          </div>

        </div>

        {/* Mobile Layout: Briefing Sequence (Each is a structural Chapter) */}
        <div className="lg:hidden flex flex-col space-y-8">
          {PROTOCOLS.map((protocol, idx) => (
            <div
              key={protocol.number}
              className="border border-brand-cream/10 rounded-sm overflow-hidden bg-brand-forest/5 flex flex-col"
            >
              {/* Image box */}
              <div className="relative h-64 w-full overflow-hidden border-b border-brand-cream/10">
                <img
                  src={protocol.image}
                  alt={protocol.title}
                  className="w-full h-full object-cover grayscale brightness-75"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent" />
                
                {/* Floating tags */}
                <div className="absolute top-4 left-4 px-2.5 py-1 bg-brand-black/85 border border-brand-cream/10">
                  <span className="text-[9px] font-mono tracking-widest text-brand-cream uppercase">
                    {protocol.location}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="text-xs font-mono text-brand-gold tracking-widest uppercase block mb-1">
                    PROTOCOL {protocol.number}
                  </span>
                  <h3 className="text-xl font-serif text-brand-ivory font-light tracking-wide">
                    {protocol.title}
                  </h3>
                </div>
              </div>

              {/* Briefing Text */}
              <div className="p-6 flex flex-col justify-between bg-brand-black/95">
                <p className="text-xs text-brand-cream/85 font-mono leading-relaxed mb-6">
                  {protocol.paragraph}
                </p>

                <div className="flex items-center justify-between border-t border-brand-cream/10 pt-4">
                  <span className="text-[9px] font-mono text-brand-stone uppercase tracking-wider">
                    {protocol.category}
                  </span>
                  <span className="text-[9px] font-mono text-brand-gold border border-brand-gold/30 px-2 py-0.5 bg-brand-gold-muted">
                    {protocol.statusLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
