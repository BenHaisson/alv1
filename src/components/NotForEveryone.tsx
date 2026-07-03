import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  type PanInfo
} from "motion/react";
import { ACCESS_CLASSES } from "../data";
import { useReducedMotionPref, CornerMarkers } from "./MotionProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Section 02 — "NOT FOR EVERYONE. FOR YOU."
 * Scroll-controlled 3D stacked identity cards. Each card represents a client
 * class. Vertical scroll through the pinned stage advances the active card;
 * horizontal swipe (touch) and the index dots offer the same control.
 *
 * Data-driven from ACCESS_CLASSES in src/data.ts — edit copy/images there.
 */
export default function NotForEveryone() {
  const cards = ACCESS_CLASSES;
  const count = cards.length;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotionPref();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const idx = clamp(Math.round(value * (count - 1)), 0, count - 1);
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // Scroll the page so a given card becomes active. Keeps scroll the single
  // source of truth so dot-taps and swipes never fight the scroll position.
  const goTo = (index: number) => {
    const el = sectionRef.current;
    if (!el) {
      setActive(clamp(index, 0, count - 1));
      return;
    }
    const clamped = clamp(index, 0, count - 1);
    const scrollable = el.offsetHeight - window.innerHeight;
    const target = el.offsetTop + (clamped / (count - 1)) * scrollable;
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) goTo(active + 1);
    else if (info.offset.x > 60) goTo(active - 1);
  };

  // Reduced-motion fallback: quiet responsive grid, no pin, no 3D.
  if (reduced) {
    return (
      <section
        id="selection-section"
        className="relative border-b border-brand-cream/10 bg-brand-deep-forest px-6 py-24 luxury-noise md:px-12 lg:px-24"
      >
        <Heading />
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="relative overflow-hidden border border-brand-cream/12 bg-brand-black/50"
            >
              <div className="relative aspect-[4/5]">
                {card.image && (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-brand-gold">
                    Class {card.number}
                  </span>
                  <h3 className="mt-2 font-serif text-2xl font-light text-brand-ivory">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-brand-stone">
                    {card.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      id="selection-section"
      ref={sectionRef}
      className="relative bg-brand-deep-forest"
      style={{ height: `${count * 62}vh` }}
      aria-label="Who ALAIR NOIR is for"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-y border-brand-cream/10 luxury-noise">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:px-20">
          {/* Left — heading + clickable index */}
          <div className="relative z-10">
            <Heading />

            <ol className="mt-10 hidden max-w-sm flex-col gap-1 lg:flex">
              {cards.map((card, index) => {
                const isActive = index === active;
                return (
                  <li key={card.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className="group flex w-full items-center gap-4 py-2 text-left focus:outline-none"
                      aria-current={isActive ? "true" : undefined}
                    >
                      <span
                        className={`font-mono text-[10px] tracking-[0.25em] transition-colors duration-300 ${
                          isActive ? "text-brand-gold" : "text-brand-muted-stone"
                        }`}
                      >
                        {card.number}
                      </span>
                      <span
                        className={`h-px transition-all duration-500 ${
                          isActive
                            ? "w-10 bg-brand-gold"
                            : "w-5 bg-brand-cream/20 group-hover:w-8 group-hover:bg-brand-gold/50"
                        }`}
                      />
                      <span
                        className={`font-serif text-lg font-light transition-colors duration-300 ${
                          isActive
                            ? "text-brand-ivory"
                            : "text-brand-stone/60 group-hover:text-brand-stone"
                        }`}
                      >
                        {card.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right — the 3D card stack */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative aspect-[4/5] w-[78vw] max-w-[380px] sm:w-[62vw] md:w-[46vw] lg:w-full"
              style={{ perspective: "1600px" }}
            >
              {cards.map((card, index) => {
                const offset = index - active;
                const target = cardTransform(offset);
                const isActive = offset === 0;

                return (
                  <motion.article
                    key={card.id}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.16}
                    dragSnapToOrigin
                    onDragEnd={handleDragEnd}
                    className="absolute inset-0 origin-center overflow-hidden border border-brand-cream/15 bg-brand-black shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
                    style={{
                      zIndex: target.zIndex,
                      cursor: isActive ? "grab" : "default",
                      transformStyle: "preserve-3d"
                    }}
                    initial={false}
                    animate={{
                      x: target.x,
                      y: target.y,
                      scale: target.scale,
                      opacity: target.opacity,
                      rotateY: target.rotateY,
                      filter: `blur(${target.blur}px)`
                    }}
                    transition={{ duration: 0.9, ease: EASE }}
                    aria-hidden={!isActive}
                  >
                    {card.image && (
                      <img
                        src={card.image}
                        alt={card.title}
                        draggable={false}
                        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                        loading={index <= 1 ? "eager" : "lazy"}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/45 to-brand-black/15" />
                    <CornerMarkers tone="cream" />

                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cream/80">
                          Class {card.number}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-cream/40">
                          ALAIR · SPEC
                        </span>
                      </div>

                      <div>
                        <motion.div
                          className="mb-4 h-px w-10 origin-left bg-brand-gold"
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.7, ease: EASE, delay: isActive ? 0.15 : 0 }}
                        />
                        <h3 className="font-serif text-2xl font-light leading-tight text-brand-ivory md:text-3xl">
                          {card.title}
                        </h3>
                        <motion.div
                          animate={{
                            opacity: isActive ? 1 : 0,
                            y: isActive ? 0 : 10
                          }}
                          transition={{ duration: 0.6, ease: EASE, delay: isActive ? 0.12 : 0 }}
                        >
                          {card.tagline && (
                            <p className="mt-2 font-serif text-sm italic text-brand-cream/90">
                              {card.tagline}
                            </p>
                          )}
                          <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-brand-stone">
                            {card.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Progress dots */}
            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2.5 lg:hidden">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View ${card.title}`}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === active
                      ? "w-7 bg-brand-gold"
                      : "w-1.5 bg-brand-cream/25"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Heading() {
  return (
    <div className="max-w-xl">
      <span className="mb-5 block font-mono text-[11px] uppercase tracking-[0.32em] text-brand-gold">
        The Selection
      </span>
      <h2 className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-brand-ivory md:text-5xl lg:text-6xl">
        Not for everyone.
        <br />
        <span className="italic text-brand-stone">For you.</span>
      </h2>
      <p className="mt-6 max-w-md text-base font-light leading-relaxed text-brand-stone">
        ALAIR NOIR is shaped around a small set of clients whose movement is
        measured by timing, discretion, and how the arrival feels — not by
        distance.
      </p>
    </div>
  );
}

/** Per-card 3D state as a function of its distance from the active card. */
function cardTransform(offset: number) {
  if (offset === 0) {
    return { x: "0%", y: 0, scale: 1, opacity: 1, rotateY: 0, blur: 0, zIndex: 50 };
  }
  if (offset > 0) {
    // Upcoming cards stacked behind and slightly lower/right.
    return {
      x: `${offset * 4}%`,
      y: offset * 22,
      scale: 1 - offset * 0.05,
      opacity: offset > 3 ? 0 : 1 - offset * 0.2,
      rotateY: -5,
      blur: Math.min(offset * 0.6, 2),
      zIndex: 40 - offset
    };
  }
  // Past cards slide left and fade; only the immediate previous stays faintly.
  const distance = -offset;
  return {
    x: `${-72 - (distance - 1) * 16}%`,
    y: 0,
    scale: 0.97,
    opacity: distance === 1 ? 0.25 : 0,
    rotateY: 8,
    blur: 1.4,
    zIndex: 10 - distance
  };
}
