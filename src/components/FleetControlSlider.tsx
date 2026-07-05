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

/** Short labels for the pinned vehicle switch on the gallery frame. */
const SWITCH_LABELS: Record<string, string> = {
  "bmw-i7": "BMW i7",
  "v-class": "V-Class"
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
  const [frameIdx, setFrameIdx] = useState(0);
  const isReduced = useReducedMotionPref();
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const activeVehicle = VEHICLES[selectedIdx];

  const frames = activeVehicle.gallery ?? [
    { image: activeVehicle.image, title: activeVehicle.name, caption: activeVehicle.subTitle }
  ];
  const activeFrame = frames[Math.min(frameIdx, frames.length - 1)];

  useEffect(() => {
    setFrameIdx(0);
  }, [selectedIdx]);

  const stepFrame = (direction: 1 | -1) => {
    setFrameIdx((prev) => (prev + direction + frames.length) % frames.length);
  };

  const scrollDetails = (direction: "left" | "right") => {
    detailScrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: isReduced ? "auto" : "smooth"
    });
  };

  // Site-wide reveal language: media rises from below and settles.
  const frameInitial = isReduced ? { opacity: 0 } : { opacity: 0, y: 90, scale: 1.04 };
  const frameAnimate = isReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  const frameExit = isReduced ? { opacity: 0 } : { opacity: 0, y: -60 };

  return (
    <motion.section
      animate={{ backgroundColor: selectedIdx === 0 ? "#0A0A0A" : "#08130D" }}
      transition={{ duration: isReduced ? 0 : 1.1, ease: "easeInOut" }}
      className="relative overflow-hidden border-b border-brand-cream/10 px-6 py-24 md:px-12 md:py-28 lg:px-24 luxury-noise"
    >
      <div className="mx-auto max-w-7xl">
        {/* Compact selector header — the vehicle switch is pinned on the
            gallery frame itself; the chapter title lives in FleetRevealMotion
            directly above. */}
        <div className="mb-12 md:mb-16">
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            Vehicle Selection · Gallery
          </span>
          <p className="max-w-xl font-serif text-xl font-light leading-relaxed text-brand-ivory md:text-2xl">
            Walk through both cabins <span className="italic text-brand-stone">frame by frame.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: gallery stage */}
          <motion.div
            className="lg:col-span-7"
            initial={isReduced ? undefined : { opacity: 0, y: 60 }}
            whileInView={isReduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: EASE_OUT }}
          >
            <div className="relative overflow-hidden border border-brand-gold/25 bg-brand-black shadow-[0_0_60px_rgba(205,162,80,0.07)]">
              <CornerMarkers />

              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={`${activeVehicle.id}-${frameIdx}`}
                    src={activeFrame.image}
                    alt={`${activeVehicle.name} — ${activeFrame.title}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    initial={frameInitial}
                    animate={frameAnimate}
                    exit={frameExit}
                    transition={{ duration: 1, ease: EASE_OUT }}
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.9]"
                  />
                </AnimatePresence>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/15 to-transparent" />

                {/* Recommended badge */}
                <div className="absolute left-5 top-5 hidden border border-brand-gold/40 bg-brand-black/85 px-3 py-2 sm:block">
                  <span className="block text-[8px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                    Recommended for
                  </span>
                  <span className="mt-0.5 block text-[10px] font-mono uppercase tracking-[0.18em] text-brand-gold">
                    {RECOMMENDED[activeVehicle.id]}
                  </span>
                </div>

                {/* Pinned vehicle switch — top right of the frame */}
                <div className="absolute right-4 top-4 z-20 flex border border-brand-gold/35 bg-brand-black/75 p-1 backdrop-blur-sm md:right-5 md:top-5">
                  {VEHICLES.map((vehicle, idx) => {
                    const isActive = selectedIdx === idx;
                    return (
                      <button
                        key={vehicle.id}
                        type="button"
                        onClick={() => setSelectedIdx(idx)}
                        aria-pressed={isActive}
                        className={`relative cursor-pointer px-3 py-2 text-[9px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 focus:outline-none focus-visible:text-brand-gold md:px-4 md:text-[10px] ${
                          isActive ? "text-brand-black" : "text-brand-stone hover:text-brand-cream"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="fleetSwitchPill"
                            className="absolute inset-0 bg-brand-gold"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <span className="relative z-10">{SWITCH_LABELS[vehicle.id] ?? vehicle.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Frame caption — the content travels with the image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={`${activeVehicle.id}-${frameIdx}-caption`}
                      initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 26 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                      transition={{ duration: 0.7, ease: EASE_OUT }}
                    >
                      <span className="mb-1 block text-[10px] font-mono uppercase tracking-widest text-brand-stone">
                        Gallery // 0{frameIdx + 1} — 0{frames.length} · {activeVehicle.name}
                      </span>
                      <h3 className="font-serif text-xl font-light tracking-wide text-white md:text-3xl">
                        {activeFrame.title}
                      </h3>
                      <p className="mt-1 max-w-lg text-xs font-light leading-relaxed text-brand-ivory/80 md:text-sm">
                        {activeFrame.caption}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Gallery controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-brand-gold">0{frameIdx + 1}</span>
                <span className="text-brand-stone/40">/</span>
                <span className="text-brand-stone">0{frames.length}</span>
              </div>

              <div className="relative h-[1px] max-w-xs flex-1 bg-brand-cream/15">
                <div
                  className="absolute left-0 top-0 h-full bg-brand-gold transition-all duration-500 ease-out"
                  style={{ width: `${((frameIdx + 1) / frames.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center space-x-8">
                <button
                  type="button"
                  onClick={() => stepFrame(-1)}
                  className="group flex cursor-pointer items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone transition-colors duration-300 hover:text-brand-cream focus:outline-none focus-visible:text-brand-gold"
                >
                  <span className="text-[10px] transition-transform duration-300 group-hover:-translate-x-1">←</span>
                  <span>PREV</span>
                </button>
                <button
                  type="button"
                  onClick={() => stepFrame(1)}
                  className="group flex cursor-pointer items-center space-x-3 text-xs font-mono tracking-[0.2em] text-brand-stone transition-colors duration-300 hover:text-brand-cream focus:outline-none focus-visible:text-brand-gold"
                >
                  <span>NEXT</span>
                  <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Filmstrip — every frame of the active vehicle */}
            <div
              className="mt-6 flex snap-x snap-mandatory space-x-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: "none" }}
            >
              {frames.map((frame, idx) => {
                const isActive = frameIdx === idx;
                return (
                  <button
                    key={`${activeVehicle.id}-thumb-${idx}`}
                    type="button"
                    onClick={() => setFrameIdx(idx)}
                    aria-label={`Show frame ${idx + 1}: ${frame.title}`}
                    className="group w-24 flex-shrink-0 cursor-pointer snap-start text-left focus:outline-none md:w-28"
                  >
                    <div
                      className={`relative aspect-[16/10] w-full overflow-hidden border transition-all duration-500 ${
                        isActive
                          ? "border-brand-gold"
                          : "border-brand-cream/10 group-hover:border-brand-cream/30"
                      }`}
                    >
                      <img
                        src={frame.image}
                        alt={frame.title}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className={`h-full w-full object-cover transition-all duration-700 ${
                          isActive ? "opacity-100" : "opacity-45 grayscale group-hover:opacity-75"
                        }`}
                      />
                    </div>
                    <span
                      className={`mt-1.5 block text-[8px] font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${
                        isActive ? "text-brand-gold" : "text-brand-stone group-hover:text-brand-ivory"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

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
