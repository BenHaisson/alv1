import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView } from "motion/react";
import { VEHICLES } from "../data";
import { useMediaQuery, useReducedMotionPref } from "./MotionProvider";
import type { VehicleGalleryFrame } from "../types";

interface FleetControlSliderProps {
  onRequestScroll: (vehicleName?: string) => void;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Auto-drift pace in px/s — the pace of a slow walk past the fleet. */
const DRIFT_PX_PER_SECOND = 45;

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
    <span ref={ref} className="font-serif text-2xl font-light tracking-tight text-brand-cream md:text-3xl">
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
        // The visible copy loads eagerly so frames never collapse to hairlines
        // while the strip drifts; the aria-hidden duplicate can lazy-load.
        loading={ariaHidden ? "lazy" : "eager"}
        decoding="async"
        draggable={false}
        referrerPolicy="no-referrer"
        className="h-full w-full select-none object-cover brightness-[0.94] md:w-auto md:max-w-none"
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
 * desktop and bottom→top on mobile in a seamless loop (two identical track
 * copies, transform wrapped at exactly half the track). The strip is a hand
 * instrument too: drag to scrub on desktop (drift resumes on release), tap
 * to hold on mobile, hover pauses. prefers-reduced-motion stills the loop
 * into a manually scrollable strip. All copy travels on the frames — below
 * the band sits a single ledger line per vehicle.
 */
export default function FleetControlSlider({ onRequestScroll }: FleetControlSliderProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const isReduced = useReducedMotionPref();
  const isWide = useMediaQuery("(min-width: 768px)");
  const activeVehicle = VEHICLES[selectedIdx];

  const sectionRef = useRef<HTMLElement>(null);
  // The drift loop only advances while the band is on screen — the
  // animation-frame work stops as soon as the section scrolls away.
  const isConveyorInView = useInView(sectionRef, { margin: "20% 0px 20% 0px" });
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoverPauseRef = useRef(false);
  const heldRef = useRef(false);
  const dragRef = useRef<{ pointerId: number | null; last: number; moved: number }>({
    pointerId: null,
    last: 0,
    moved: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  const frames = activeVehicle.gallery ?? [
    { image: activeVehicle.image, title: activeVehicle.name, caption: activeVehicle.subTitle }
  ];
  // Reduced motion: a single, manually scrollable run instead of the loop.
  const copies = isReduced ? [0] : [0, 1];

  // Restart the strip cleanly when the vehicle changes.
  useEffect(() => {
    offsetRef.current = 0;
    heldRef.current = false;
    setIsHeld(false);
  }, [selectedIdx]);

  // The drift engine: advance unless held, hovered, or being dragged; wrap
  // at half the track so the duplicated run hands off invisibly.
  useAnimationFrame((_, delta) => {
    if (isReduced || !isConveyorInView) return;
    const track = trackRef.current;
    if (!track) return;
    const half = isWide ? track.scrollWidth / 2 : track.scrollHeight / 2;
    if (!half) return;
    const paused = hoverPauseRef.current || heldRef.current || dragRef.current.pointerId !== null;
    if (!paused) offsetRef.current += (DRIFT_PX_PER_SECOND * Math.min(delta, 64)) / 1000;
    offsetRef.current = ((offsetRef.current % half) + half) % half;
    track.style.transform = isWide
      ? `translate3d(${-offsetRef.current}px, 0, 0)`
      : `translate3d(0, ${-offsetRef.current}px, 0)`;
  });

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isReduced || !isWide) return;
    dragRef.current = { pointerId: event.pointerId, last: event.clientX, moved: 0 };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    const delta = event.clientX - dragRef.current.last;
    dragRef.current.last = event.clientX;
    dragRef.current.moved += Math.abs(delta);
    offsetRef.current -= delta;
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  // Mobile: a tap holds the strip; another releases it.
  const handleTap = () => {
    if (isReduced || isWide) return;
    heldRef.current = !heldRef.current;
    setIsHeld(heldRef.current);
  };

  return (
    <motion.section
      ref={sectionRef}
      animate={{ backgroundColor: selectedIdx === 0 ? "#0A0A0A" : "#08130D" }}
      transition={{ duration: isReduced ? 0 : 1.1, ease: "easeInOut" }}
      className="relative overflow-hidden border-b border-brand-cream/10 px-6 py-24 md:px-12 md:py-28 lg:px-24 luxury-noise"
    >
      {/* Compact header — the chapter title lives in FleetRevealMotion above */}
      <div className="mx-auto mb-10 flex max-w-7xl flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-4 block text-xs font-mono uppercase tracking-[0.3em] text-brand-gold">
            The Fleet · In Motion
          </span>
          <p className="max-w-xl font-serif text-xl font-light leading-relaxed text-brand-ivory md:text-2xl">
            Both cabins pass by <span className="italic text-brand-stone">— slowly.</span>
          </p>
        </div>
        <span className="hidden text-[10px] font-mono uppercase tracking-[0.25em] text-brand-muted-stone md:block">
          Drag to explore · release to resume
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-brand-muted-stone md:hidden">
          Tap the strip to hold a frame
        </span>
      </div>

      {/* Full-bleed conveyor band */}
      <div className="relative -mx-6 md:-mx-12 lg:-mx-24">
        {/* Pinned vehicle switch — top right of the band, above the drift */}
        <div className="absolute right-5 top-5 z-30 flex border border-brand-cream/20 bg-brand-black/75 p-1 backdrop-blur-sm md:right-10 md:top-8 lg:right-16">
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
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onClick={handleTap}
              onMouseEnter={() => (hoverPauseRef.current = true)}
              onMouseLeave={() => (hoverPauseRef.current = false)}
              style={{ touchAction: "pan-y" }}
              className={`fleet-conveyor relative border-y border-brand-cream/10 max-md:h-[68vh] md:h-[52vh] md:min-h-[400px] ${
                isReduced
                  ? "overflow-x-auto overflow-y-auto"
                  : `overflow-hidden ${isWide ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`
              }`}
            >
              <div ref={trackRef} className="fleet-conveyor-track max-md:px-6 md:py-0">
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

              {isHeld && (
                <span className="pointer-events-none absolute bottom-5 right-5 z-30 border border-brand-cream/30 bg-brand-black/80 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-brand-cream md:hidden">
                  Held — tap to resume
                </span>
              )}
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
              className="group flex w-fit cursor-pointer items-center gap-4 border border-brand-cream/25 px-7 py-3.5 text-[10px] font-mono uppercase tracking-[0.25em] text-brand-cream transition-all duration-300 hover:border-brand-cream/60 hover:text-brand-ivory focus:outline-none focus-visible:border-brand-gold"
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
