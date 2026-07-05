import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { VEHICLES } from "../data";
import { useReducedMotionPref } from "./MotionProvider";
import type { VehicleGalleryFrame } from "../types";

interface FleetControlSliderProps {
  onRequestScroll: (vehicleName?: string) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Seconds of drift per frame — the pace of a slow walk past the fleet. */
const DRIFT_SECONDS_PER_FRAME = 9;

const RECOMMENDED: Record<string, string> = {
  "bmw-i7": "Executive arrivals & private clients",
  "v-class": "Groups, delegations & luggage"
};

/** Short labels for the pinned vehicle switch on the gallery band. */
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
    <span ref={ref} className="font-serif text-2xl font-light tracking-tight text-brand-gold md:text-3xl">
      {displayValue}
      <span className="ml-1 text-[10px] font-sans font-normal uppercase tracking-normal text-brand-stone">
        {suffix}
      </span>
    </span>
  );
}

function ConveyorFrame({
  frame,
  index,
  total,
  vehicleName,
  ariaHidden
}: {
  frame: VehicleGalleryFrame;
  index: number;
  total: number;
  vehicleName: string;
  ariaHidden?: boolean;
}) {
  return (
    <figure
      aria-hidden={ariaHidden}
      className="group/frame relative flex-none overflow-hidden border border-brand-cream/12 bg-brand-black max-md:mb-5 max-md:aspect-[4/5] max-md:w-full md:mr-6 md:h-full"
    >
      <img
        src={frame.image}
        alt={ariaHidden ? "" : `${vehicleName} — ${frame.title}`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="h-full w-full object-cover brightness-[0.94] md:w-auto md:max-w-none"
      />

      {/* Frame index — etched, top left */}
      <span className="absolute left-4 top-4 text-[9px] font-mono uppercase tracking-[0.3em] text-brand-ivory/60">
        0{index + 1} <span className="text-brand-ivory/30">/ 0{total}</span>
      </span>

      {/* Caption etched into the lower edge of the frame */}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-black/85 via-brand-black/35 to-transparent p-4 pt-12 md:p-5 md:pt-14">
        <h3 className="font-serif text-base font-light tracking-wide text-brand-ivory md:text-lg">
          {frame.title}
        </h3>
        <p className="mt-1 max-w-[38ch] text-[11px] font-light leading-relaxed text-brand-stone md:text-xs">
          {frame.caption}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * The fleet as a continuous cinematic conveyor: frames drift right→left on
 * desktop and bottom→top on mobile in a seamless, compositor-only loop
 * (two identical track copies, linear translate to -50%). Hover pauses the
 * drift; prefers-reduced-motion stills it entirely. All copy travels on the
 * frames themselves — below the band sits a single ledger line per vehicle.
 */
export default function FleetControlSlider({ onRequestScroll }: FleetControlSliderProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const isReduced = useReducedMotionPref();
  const activeVehicle = VEHICLES[selectedIdx];

  const frames = activeVehicle.gallery ?? [
    { image: activeVehicle.image, title: activeVehicle.name, caption: activeVehicle.subTitle }
  ];
  const driftDuration = frames.length * DRIFT_SECONDS_PER_FRAME;
  // Reduced motion: a single, manually scrollable run instead of the loop.
  const copies = isReduced ? [0] : [0, 1];

  return (
    <motion.section
      animate={{ backgroundColor: selectedIdx === 0 ? "#0A0A0A" : "#08130D" }}
      transition={{ duration: isReduced ? 0 : 1.1, ease: "easeInOut" }}
      className="relative overflow-hidden border-b border-brand-cream/10 px-6 py-24 md:px-12 md:py-28 lg:px-24 luxury-noise"
    >
      {/* Compact header — the chapter title lives in FleetRevealMotion above */}
      <div className="mx-auto mb-10 flex max-w-7xl items-end justify-between md:mb-12">
        <div>
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            The Fleet · In Motion
          </span>
          <p className="max-w-xl font-serif text-xl font-light leading-relaxed text-brand-ivory md:text-2xl">
            Both cabins pass by <span className="italic text-brand-stone">— slowly.</span>
          </p>
        </div>
        <span className="hidden text-[10px] font-mono uppercase tracking-[0.25em] text-brand-muted-stone md:block">
          Hover to hold a frame
        </span>
      </div>

      {/* Full-bleed conveyor band */}
      <div className="relative -mx-6 md:-mx-12 lg:-mx-24">
        {/* Pinned vehicle switch — top right of the band, above the drift */}
        <div className="absolute right-5 top-5 z-30 flex border border-brand-gold/35 bg-brand-black/75 p-1 backdrop-blur-sm md:right-10 md:top-8 lg:right-16">
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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeVehicle.id}
            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <div
              className={`fleet-conveyor relative border-y border-brand-cream/10 max-md:h-[68vh] md:h-[52vh] md:min-h-[400px] ${
                isReduced ? "overflow-x-auto overflow-y-auto" : "overflow-hidden"
              }`}
            >
              <div
                className="fleet-conveyor-track max-md:px-6 md:py-0"
                style={{ animationDuration: `${driftDuration}s` }}
              >
                {copies.map((copy) =>
                  frames.map((frame, idx) => (
                    <ConveyorFrame
                      key={`${activeVehicle.id}-${copy}-${idx}`}
                      frame={frame}
                      index={idx}
                      total={frames.length}
                      vehicleName={activeVehicle.name}
                      ariaHidden={copy === 1}
                    />
                  ))
                )}
              </div>

              {/* Cinematic edge fades — horizontal on desktop, vertical on mobile */}
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-brand-black to-transparent md:block lg:w-36" />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-brand-black to-transparent md:block lg:w-36" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brand-black to-transparent md:hidden" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-black to-transparent md:hidden" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Ledger line — everything else about the vehicle, in one short row */}
      <div className="mx-auto max-w-7xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeVehicle.id}-ledger`}
            initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: isReduced ? 0 : 0.15 }}
            className="mt-10 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-md">
              <span className="mb-2 block text-[9px] font-mono uppercase tracking-[0.26em] text-brand-stone">
                Recommended for — {RECOMMENDED[activeVehicle.id]}
              </span>
              <h3 className="font-serif text-2xl font-light tracking-wide text-brand-ivory md:text-3xl">
                {activeVehicle.name}
              </h3>
              <p className="mt-2 text-xs font-light leading-relaxed text-brand-stone md:text-sm">
                {activeVehicle.subTitle}
              </p>
            </div>

            {activeVehicle.numericalSpecs && (
              <div className="flex items-end gap-8 md:gap-10">
                {activeVehicle.numericalSpecs.map((spec) => (
                  <div key={spec.label} className="flex flex-col">
                    <span className="mb-1.5 text-[9px] font-mono uppercase tracking-widest text-brand-muted-stone">
                      {spec.label}
                    </span>
                    <AnimatedCounter value={spec.value} suffix={spec.suffix} isReduced={isReduced} />
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => onRequestScroll(activeVehicle.name)}
              className="group flex w-fit cursor-pointer items-center gap-4 border border-brand-cream/25 px-7 py-3.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-cream transition-all duration-300 hover:border-brand-gold hover:text-brand-gold focus:outline-none focus-visible:border-brand-gold"
            >
              <span>Request {SWITCH_LABELS[activeVehicle.id] ?? activeVehicle.name}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
