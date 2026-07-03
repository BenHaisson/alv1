import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { VEHICLES } from "../data";
import { CornerMarkers, useReducedMotionPref } from "./MotionProvider";

interface FleetControlSliderProps {
  onRequestScroll: (vehicleName?: string) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const RECOMMENDED: Record<string, string> = {
  "bmw-i7": "Executive arrivals & private clients",
  "v-class": "Groups, delegations & luggage"
};

function AnimatedCounter({ value, suffix, isReduced }: { value: number; suffix: string; isReduced: boolean }) {
  const [count, setCount] = useState(isReduced ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isReduced) {
      setCount(value);
      return;
    }
    if (!isInView) return;

    const duration = 1200;
    const startTime = performance.now();
    let frame = 0;

    const updateCount = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(easeProgress * value);
      if (progress < 1) frame = requestAnimationFrame(updateCount);
      else setCount(value);
    };

    frame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, isReduced]);

  const displayValue = Number.isInteger(value) ? Math.floor(count) : count.toFixed(1);

  return (
    <span ref={ref} className="font-serif text-3xl font-light tracking-tight text-brand-gold md:text-4xl">
      {displayValue}
      <span className="ml-1 text-xs font-sans font-normal uppercase tracking-normal text-brand-stone">
        {suffix}
      </span>
    </span>
  );
}

export default function FleetControlSlider({ onRequestScroll }: FleetControlSliderProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"exterior" | "interior">("exterior");
  const isReduced = useReducedMotionPref();
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const activeVehicle = VEHICLES[selectedIdx];

  useEffect(() => {
    setViewMode("exterior");
  }, [selectedIdx]);

  const handleStep = (direction: 1 | -1) => {
    setSelectedIdx((prev) => (prev + direction + VEHICLES.length) % VEHICLES.length);
  };

  const scrollDetails = (direction: "left" | "right") => {
    detailScrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: isReduced ? "auto" : "smooth"
    });
  };

  const currentImage =
    viewMode === "exterior" ? activeVehicle.image : activeVehicle.interiorImage ?? activeVehicle.image;

  return (
    <motion.section
      id="fleet-section"
      animate={{ backgroundColor: selectedIdx === 0 ? "#0A0A0A" : "#08130D" }}
      transition={{ duration: isReduced ? 0 : 1.1, ease: "easeInOut" }}
      className="relative overflow-hidden border-b border-brand-cream/10 px-6 py-24 md:px-12 md:py-36 lg:px-24 luxury-noise"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header + vehicle tabs */}
        <div className="mb-12 flex flex-col justify-between md:mb-16 md:flex-row md:items-end">
          <div>
            <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
              Fleet
            </span>
            <h2 className="font-serif text-3xl font-light tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
              Two vehicles. <span className="font-light italic text-brand-stone">One standard.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-brand-stone md:text-base">
              ALAIR NOIR operates a focused premium fleet selected for executive silence, private
              comfort, and refined passenger movement.
            </p>
          </div>

          <div className="mt-8 flex space-x-1 border-b border-brand-cream/10 pb-1 md:mt-0">
            {VEHICLES.map((vehicle, idx) => {
              const isActive = selectedIdx === idx;
              return (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative cursor-pointer px-4 py-3 text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus-visible:text-brand-gold md:px-6 md:text-xs ${
                    isActive ? "text-brand-cream" : "text-brand-stone hover:text-brand-cream"
                  }`}
                >
                  <span>{vehicle.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFleetTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: vehicle stage */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-brand-gold/25 bg-brand-black shadow-[0_0_60px_rgba(205,162,80,0.07)]">
              <CornerMarkers />

              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={`${activeVehicle.id}-${viewMode}`}
                    src={currentImage}
                    alt={`${activeVehicle.name} — ${viewMode === "exterior" ? "exterior" : "interior cabin"}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    initial={
                      isReduced
                        ? { opacity: 0 }
                        : { opacity: 0.4, x: 40, clipPath: "inset(0 0 0 100%)" }
                    }
                    animate={
                      isReduced
                        ? { opacity: 1 }
                        : { opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }
                    }
                    exit={isReduced ? { opacity: 0 } : { opacity: 0, x: -40 }}
                    transition={{ duration: 0.9, ease: EASE_OUT }}
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.9]"
                  />
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/15 to-transparent" />

                {/* Recommended badge */}
                <div className="absolute left-5 top-5 border border-brand-gold/40 bg-brand-black/85 px-3 py-2">
                  <span className="block text-[8px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                    Recommended for
                  </span>
                  <span className="mt-0.5 block text-[10px] font-mono uppercase tracking-[0.18em] text-brand-gold">
                    {RECOMMENDED[activeVehicle.id]}
                  </span>
                </div>

                <div className="absolute right-5 top-5 border border-brand-gold/30 bg-brand-black/90 px-3 py-1 text-[9px] font-mono uppercase tracking-widest text-brand-gold">
                  2026 SPEC
                </div>

                {/* Vehicle nameplate */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5 md:p-7">
                  <div>
                    <span className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                      {viewMode === "exterior" ? "CHASSIS VIEW" : "CABIN VIEW"} // 0{selectedIdx + 1}
                    </span>
                    <h3 className="font-serif text-xl font-light tracking-wide text-white md:text-3xl">
                      {activeVehicle.name}
                    </h3>
                    <p className="mt-1 text-xs font-mono italic text-brand-gold md:text-sm">
                      {activeVehicle.subTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
              <div className="inline-flex rounded-full border border-brand-cream/10 bg-brand-black p-1">
                {(["exterior", "interior"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    className={`cursor-pointer rounded-full px-5 py-2 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 focus:outline-none focus-visible:text-brand-gold ${
                      viewMode === mode
                        ? "bg-brand-gold font-semibold text-brand-black shadow-md"
                        : "text-brand-stone hover:text-brand-cream"
                    }`}
                  >
                    {mode === "exterior" ? "Exterior" : "Interior Cabin"}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-8">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  className="group flex cursor-pointer items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone transition-colors duration-300 hover:text-brand-cream focus:outline-none focus-visible:text-brand-gold"
                >
                  <span className="text-[10px] transition-transform duration-300 group-hover:-translate-x-1">←</span>
                  <span>PREV</span>
                </button>
                <div className="flex items-center space-x-2">
                  {VEHICLES.map((vehicle, idx) => (
                    <button
                      key={vehicle.id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      aria-label={`Select ${vehicle.name}`}
                      className={`h-1 cursor-pointer transition-all duration-300 focus:outline-none ${
                        selectedIdx === idx ? "w-8 bg-brand-gold" : "w-2 bg-brand-stone/40"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="group flex cursor-pointer items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone transition-colors duration-300 hover:text-brand-cream focus:outline-none focus-visible:text-brand-gold"
                >
                  <span>NEXT</span>
                  <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: control panel */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeVehicle.id}
                initial={isReduced ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={isReduced ? undefined : { opacity: 0, y: -15 }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                className="space-y-8"
              >
                <p className="text-sm font-light leading-relaxed text-brand-ivory/85 md:text-base">
                  {activeVehicle.description}
                </p>

                {activeVehicle.numericalSpecs && (
                  <div>
                    <span className="mb-4 block text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                      Performance & Dimensions
                    </span>
                    <div className="grid grid-cols-3 gap-4 border-y border-brand-cream/10 py-6">
                      {activeVehicle.numericalSpecs.map((spec) => (
                        <div key={spec.label} className="flex flex-col">
                          <span className="mb-1.5 h-8 text-[9px] font-mono uppercase tracking-widest text-brand-stone">
                            {spec.label}
                          </span>
                          <AnimatedCounter value={spec.value} suffix={spec.suffix} isReduced={isReduced} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="mb-3 block text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                    Journey use cases
                  </span>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {activeVehicle.bestFor.map((useCase) => (
                      <li
                        key={useCase}
                        className="flex items-center space-x-3 border border-brand-cream/8 bg-brand-deep-forest/30 px-3 py-2.5 text-xs text-brand-ivory/85"
                      >
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-gold" />
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cabin highlight slider */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                      Premium Cabin Highlights
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => scrollDetails("left")}
                        aria-label="Scroll highlights left"
                        className="flex h-6 w-6 cursor-pointer items-center justify-center border border-brand-cream/10 text-xs text-brand-stone hover:text-brand-cream focus:outline-none focus-visible:border-brand-gold"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollDetails("right")}
                        aria-label="Scroll highlights right"
                        className="flex h-6 w-6 cursor-pointer items-center justify-center border border-brand-cream/10 text-xs text-brand-stone hover:text-brand-cream focus:outline-none focus-visible:border-brand-gold"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div
                    ref={detailScrollRef}
                    className="flex snap-x snap-mandatory space-x-4 overflow-x-auto pb-4"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {activeVehicle.highlights.map((highlight, index) => (
                      <div
                        key={highlight}
                        className="w-64 flex-shrink-0 snap-start rounded-sm border border-brand-cream/5 bg-brand-deep-forest/40 p-4"
                      >
                        <div className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-brand-gold">
                          FEATURE // 0{index + 1}
                        </div>
                        <p className="text-xs font-light leading-relaxed text-brand-ivory/90">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRequestScroll(activeVehicle.name)}
                  className="group relative w-full cursor-pointer overflow-hidden rounded-sm bg-brand-cream px-8 py-4 text-xs font-mono font-medium uppercase tracking-[0.25em] text-brand-black transition-all duration-300 hover:bg-brand-ivory hover:text-brand-deep-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <span>Request {activeVehicle.name}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
